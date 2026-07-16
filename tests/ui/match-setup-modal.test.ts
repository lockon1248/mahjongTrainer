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

  it('does not submit when the initial chips are below 100', async () => {
    const wrapper = mount(MatchSetupModal, {
      props: {
        defaultInitialChips: 1000
      }
    })

    await wrapper.get('[data-testid="match-setup-initial-chips"]').setValue('10')
    await wrapper.get('[data-testid="match-setup-submit"]').trigger('click')

    expect(wrapper.emitted('submit')).toBeUndefined()
    expect(wrapper.get('[data-testid="match-setup-initial-chips"]').attributes('min')).toBe('100')
    expect(wrapper.get('[data-testid="match-setup-error"]').text()).toContain('初始籌碼不可低於 100')
  })

  it('clears the validation message after the chips are corrected back to a legal value', async () => {
    const wrapper = mount(MatchSetupModal, {
      props: {
        defaultInitialChips: 1000
      }
    })

    await wrapper.get('[data-testid="match-setup-initial-chips"]').setValue('10')
    await wrapper.get('[data-testid="match-setup-submit"]').trigger('click')
    expect(wrapper.get('[data-testid="match-setup-error"]').text()).toContain('初始籌碼不可低於 100')

    await wrapper.get('[data-testid="match-setup-initial-chips"]').setValue('100')

    expect(wrapper.find('[data-testid="match-setup-error"]').exists()).toBe(false)
  })
})
