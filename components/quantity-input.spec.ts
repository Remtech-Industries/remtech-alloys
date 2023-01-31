import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import QuantityInput from './QuantityInput.vue'

describe('Quantity Input', () => {
  it('should include the word Quantity', () => {
    const wrapper = mount(QuantityInput)
    expect(wrapper.text()).toContain('Quantity')
  })
})
