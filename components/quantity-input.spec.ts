import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import QuantityInput from './QuantityInput.vue'

describe('Quantity Input', () => {
  it('first test', () => {
    const wrapper = mount(QuantityInput)
    expect(wrapper.text()).toContain('hello')
  })
})
