// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import { createBaselineRound, createBaselineWall, createWinRoundResult, evaluateExhaustiveDraw } from '@/core'
import { useGameSessionStore } from '@/stores/gameSession'
import { AI_TURN_DELAY_MS } from '@/views/game/constants'
import { createGameTableSnapshot } from '@/views/game/selectors'
import GameView from '@/views/game/GameView.vue'
import GameTableView from '@/views/game/components/GameTableView.vue'

describe('interactive turn loop', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useRealTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

  it('schedules AI advancement after a human discard instead of pushing immediately', async () => {
    vi.useFakeTimers()
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useGameSessionStore()
    const discardSpy = vi.spyOn(store, 'discard')
    const advanceSpy = vi.spyOn(store, 'advanceTurn')

    const wrapper = mount(GameView, {
      global: {
        plugins: [pinia]
      }
    })

    await wrapper.get('[data-testid="match-setup-submit"]').trigger('click')

    const selectedTile = createGameTableSnapshot(store.round!, store.humanSeat).players
      .find(player => player.seat === store.humanSeat)!
      .concealedTiles[0]!
    await wrapper.get('[data-testid="human-discard-tile"]').trigger('click')

    expect(discardSpy).toHaveBeenCalledWith(selectedTile)
    expect(advanceSpy).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(AI_TURN_DELAY_MS - 1)
    expect(advanceSpy).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(1)
    expect(advanceSpy).toHaveBeenCalledTimes(1)
  })

  it('forwards a human self-turn action click into the store without auto-advancing the turn loop', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useGameSessionStore()
    store.startLocalRound()
    const baseRound = createBaselineRound({ wall: createBaselineWall() })
    store.round = {
      ...baseRound,
      currentSeat: 'east',
      phase: 'discard',
      players: {
        ...baseRound.players,
        east: {
          ...baseRound.players.east,
          concealedTiles: [
            { suit: 'characters', rank: 1 },
            { suit: 'characters', rank: 2 },
            { suit: 'characters', rank: 3 },
            { suit: 'characters', rank: 7 },
            { suit: 'characters', rank: 7 },
            { suit: 'characters', rank: 7 },
            { suit: 'characters', rank: 7 },
            { suit: 'dots', rank: 1 },
            { suit: 'dots', rank: 2 },
            { suit: 'dots', rank: 3 },
            { suit: 'bamboo', rank: 1 },
            { suit: 'bamboo', rank: 2 },
            { suit: 'bamboo', rank: 3 },
            { suit: 'winds', rank: 'east' },
            { suit: 'winds', rank: 'east' },
            { suit: 'dragons', rank: 'red' },
            { suit: 'dragons', rank: 'white' }
          ]
        }
      }
    }
    const submitSpy = vi.spyOn(store, 'submitHumanSelfTurnAction')
    const advanceSpy = vi.spyOn(store, 'advanceTurn')

    const wrapper = mount(GameView, {
      global: {
        plugins: [pinia]
      }
    })

    await wrapper.get('[data-testid="human-self-turn-action"]').trigger('click')

    expect(submitSpy).toHaveBeenCalledTimes(1)
    expect(advanceSpy).not.toHaveBeenCalled()
  })

  it('forwards a next-round click into the store without rewriting round state in the component', async () => {
    vi.useFakeTimers()
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useGameSessionStore()
    store.startLocalRound()
    const baseRound = createBaselineRound({ wall: createBaselineWall() })
    store.round = {
      ...baseRound,
      phase: 'ended',
      currentSeat: 'south',
      outcome: {
        status: 'win',
        result: createWinRoundResult({
          winnerSeat: 'south',
          discarderSeat: 'west'
        })
      }
    }
    const nextRoundSpy = vi.spyOn(store, 'startNextRound')

    const wrapper = mount(GameView, {
      global: {
        plugins: [pinia]
      }
    })

    await vi.advanceTimersByTimeAsync(1500)
    await nextTick()
    document.body.querySelector<HTMLButtonElement>('[data-testid="next-round-action"]')?.click()
    await nextTick()

    expect(nextRoundSpy).toHaveBeenCalledTimes(1)
  })

  it('does not keep auto-advancing after the round has already ended', async () => {
    vi.useFakeTimers()
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useGameSessionStore()
    store.startLocalRound()
    const baseRound = createBaselineRound({ wall: createBaselineWall() })
    store.round = {
      ...baseRound,
      phase: 'ended',
      currentSeat: 'south',
      outcome: {
        status: 'win',
        result: createWinRoundResult({
          winnerSeat: 'south',
          discarderSeat: 'west'
        })
      }
    }
    const advanceSpy = vi.spyOn(store, 'advanceTurn')

    mount(GameView, {
      global: {
        plugins: [pinia]
      }
    })

    await vi.advanceTimersByTimeAsync(AI_TURN_DELAY_MS * 2)

    expect(advanceSpy).not.toHaveBeenCalled()
  })

  it('resumes delayed AI auto-advancement after next round starts on an AI dealer', async () => {
    vi.useFakeTimers()
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useGameSessionStore()
    store.startLocalRound()
    const baseRound = createBaselineRound({ wall: createBaselineWall() })
    store.round = {
      ...baseRound,
      currentSeat: 'south',
      phase: 'ended',
      table: {
        ...baseRound.table,
        dealerSeat: 'east'
      },
      outcome: {
        status: 'win',
        result: createWinRoundResult({
          winnerSeat: 'south',
          discarderSeat: 'west'
        })
      }
    }
    const advanceSpy = vi.spyOn(store, 'advanceTurn')

    const wrapper = mount(GameView, {
      global: {
        plugins: [pinia]
      }
    })

    await vi.advanceTimersByTimeAsync(1500)
    await nextTick()
    document.body.querySelector<HTMLButtonElement>('[data-testid="next-round-action"]')?.click()
    await nextTick()

    expect(wrapper.get('[data-testid="player-active-west"]').text()).toContain('目前出牌')
    expect(advanceSpy).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(AI_TURN_DELAY_MS - 1)
    expect(advanceSpy).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(1)
    expect(advanceSpy).toHaveBeenCalledTimes(1)
  })

  it('renders turn progress only after the delayed AI advancement fires', async () => {
    vi.useFakeTimers()
    const pinia = createPinia()
    setActivePinia(pinia)

    const wrapper = mount(GameView, {
      global: {
        plugins: [pinia]
      }
    })

    await wrapper.get('[data-testid="match-setup-submit"]').trigger('click')
    await wrapper.get('[data-testid="human-discard-tile"]').trigger('click')

    expect(wrapper.get('[data-testid="player-status-east"]').text()).toContain('剛出牌')

    await vi.advanceTimersByTimeAsync(AI_TURN_DELAY_MS)
    await nextTick()

    expect(wrapper.get('[data-testid="player-status-east"]').text()).not.toContain('剛出牌')
    expect(wrapper.get('[data-testid="summary-phase"]').text()).toMatch(/(摸牌|出牌|宣告|本局結束)/)
  })

  it('keeps scheduling later AI steps instead of stalling after the first delayed step', async () => {
    vi.useFakeTimers()
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useGameSessionStore()
    const advanceSpy = vi.spyOn(store, 'advanceTurn')

    const wrapper = mount(GameView, {
      global: {
        plugins: [pinia]
      }
    })

    await wrapper.get('[data-testid="match-setup-submit"]').trigger('click')
    await wrapper.get('[data-testid="human-discard-tile"]').trigger('click')

    expect(wrapper.findAll('[data-testid="shared-discard-tile"]').length).toBeGreaterThanOrEqual(1)

    await vi.advanceTimersByTimeAsync(AI_TURN_DELAY_MS * 4)
    await nextTick()

    expect(advanceSpy.mock.calls.length).toBeGreaterThan(1)
  })

  it('reflects exhaustive draw outcomes in the rendered table snapshot', () => {
    const round = createBaselineRound({ wall: createBaselineWall() })
    const exhaustedRound = evaluateExhaustiveDraw({
      ...round,
      table: {
        ...round.table,
        wall: []
      },
      phase: 'draw'
    })
    const snapshot = createGameTableSnapshot(exhaustedRound, 'east')

    const wrapper = mount(GameTableView, {
      props: {
        snapshot,
        humanSeat: 'east',
        claimCandidates: [],
        selfTurnCandidates: []
      }
    })

    expect(wrapper.get('[data-testid="result-draw-reason"]').text()).toContain('牌牆耗盡')
  })
})
