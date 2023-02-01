import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import QuantityInput from './QuantityInput.vue'

describe('Quantity Input', () => {
  it('should include the word Quantity', () => {
    const wrapper = mount(QuantityInput, { props: { value: 1, state: true } })
    expect(wrapper.text()).toContain('Quantity')
  })

  it('should say quantity is required if input is blank', async () => {
    const wrapper = mount(QuantityInput, { props: { value: '', state: false } })
    expect(wrapper.text()).toContain('is required.')
  })

  it('should say quantity must be more than 0 if input is 0', async () => {
    const wrapper = mount(QuantityInput, { props: { value: 0, state: false } })
    expect(wrapper.text()).toContain('must be more than 0.')
  })

  it('should say quantity must be a whole number if input is a float', async () => {
    const wrapper = mount(QuantityInput, {
      props: { value: 1.5, state: false },
    })
    expect(wrapper.text()).toContain('must be a whole number.')
  })
})
