import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LengthInput from './LengthInput.vue'

describe('Length Input', () => {
  it('should include the word Length', () => {
    const wrapper = mount(LengthInput)
    expect(wrapper.text()).toContain('Length')
  })

  it('should say length is required if input is blank', async () => {
    const wrapper = mount(LengthInput)
    const input = wrapper.find('input')
    await input.setValue('')
    expect(wrapper.text()).toContain('is required.')
  })

  it('should say length must be more than 0 if input is 0', async () => {
    const wrapper = mount(LengthInput)
    const input = wrapper.find('input')
    await input.setValue(0)
    expect(wrapper.text()).toContain('must be more than 0.')
  })
})
