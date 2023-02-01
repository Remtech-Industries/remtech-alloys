import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import QuantityInput from './QuantityInput.vue'

describe('Quantity Input', () => {
  it('should include the word Quantity', () => {
    const wrapper = mount(QuantityInput)
    expect(wrapper.text()).toContain('Quantity')
  })

  it('should say quantity is required if input is blank', async () => {
    const wrapper = mount(QuantityInput)
    const input = wrapper.find('input')
    await input.setValue('')
    expect(wrapper.text()).toContain('is required.')
  })

  it('should say quantity must be more than 0 if input is 0', async () => {
    const wrapper = mount(QuantityInput)
    const input = wrapper.find('input')
    await input.setValue(0)
    expect(wrapper.text()).toContain('must be more than 0.')
  })

  it('should say quantity must be a whole number if input is a float', async () => {
    const wrapper = mount(QuantityInput)
    const input = wrapper.find('input')
    await input.setValue(1.5)
    expect(wrapper.text()).toContain('must be a whole number.')
  })
})
