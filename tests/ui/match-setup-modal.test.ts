// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MatchSetupModal from '@/views/game/components/MatchSetupModal.vue'

describe('match setup modal', () => {
  it('submits the configured initial chips and bankruptcy mode', async () => {
    const wrapper = mount(MatchSetupModal, {
      props: {
        defaultInitialChips: 1000
      }
    })

    await wrapper.get('[data-testid="match-setup-initial-chips"]').setValue('500')
    await wrapper.get('[data-testid="match-setup-submit"]').trigger('click')

    expect(wrapper.emitted('submit')).toEqual([[
      {
        initialChips: 500,
        victoryMode: 'bankruptcy'
      }
    ]])
  })

  it('submits the configured four-winds victory mode', async () => {
    const wrapper = mount(MatchSetupModal, {
      props: {
        defaultInitialChips: 1000
      }
    })

    await wrapper.get('[data-testid="match-setup-mode-four-winds"]').setValue(true)
    await wrapper.get('[data-testid="match-setup-submit"]').trigger('click')

    expect(wrapper.emitted('submit')).toEqual([[
      {
        initialChips: 1000,
        victoryMode: 'four-winds'
      }
    ]])
  })
})
