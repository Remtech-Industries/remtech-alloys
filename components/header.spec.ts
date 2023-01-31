import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Header from './Header.vue'

describe('Quantity Input', () => {
  it('should include the word Quantity', () => {
    const wrapper = mount(Header)
    expect(wrapper.text()).toContain('Rem-Tech')
  })
})
