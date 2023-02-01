import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LengthInput from './LengthInput.vue'

describe('Length Input', () => {
  it('should include the word Length', () => {
    const wrapper = mount(LengthInput, { props: { value: 1, isValid: true } })
    expect(wrapper.text()).toContain('Length')
  })

  it('should say length is required if input is blank', async () => {
    const wrapper = mount(LengthInput, { props: { value: '', isValid: false } })
    expect(wrapper.text()).toContain('is required.')
  })

  it('should say length must be more than 0 if input is 0', async () => {
    const wrapper = mount(LengthInput, { props: { value: 0, isValid: false } })
    expect(wrapper.text()).toContain('must be more than 0.')
  })
})
