import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LengthInput from './LengthInput.vue'

describe('Length Input', () => {
  it('should include the word Length', () => {
    const wrapper = mount(LengthInput)
    expect(wrapper.text()).toContain('Length')
  })

  it('should display no errors and emit value when valid', async () => {
    const wrapper = mount(LengthInput)
    const $input = wrapper.get('input')
    $input.element.value = '1'
    await $input.trigger('input')

    expect(wrapper.text()).not.toContain('is required.')
    expect($input.classes()).not.toContain('border-red-500')
    expect(wrapper.emitted('update:length')).toEqual([[1]])
    expect(wrapper.emitted('update:isValid')).toEqual([[true]])
  })

  it('should say length is required if input is blank', async () => {
    const wrapper = mount(LengthInput)
    const $input = wrapper.get('input')
    $input.element.value = ''
    await $input.trigger('input')

    expect(wrapper.text()).toContain('is required.')
    expect($input.classes()).toContain('border-red-500')
    expect(wrapper.emitted('update:length')).toBeUndefined()
    expect(wrapper.emitted('update:isValid')).toEqual([[false]])
  })

  it('should say length must be more than 0 if input is 0', async () => {
    const wrapper = mount(LengthInput)
    const $input = wrapper.get('input')
    $input.element.value = '0'
    await $input.trigger('input')

    expect(wrapper.text()).toContain('greater than 0.')
    expect($input.classes()).toContain('border-red-500')
    expect(wrapper.emitted('update:length')).toBeUndefined()
    expect(wrapper.emitted('update:isValid')).toEqual([[false]])
  })

  it('should say length must be more than 0 if input is a negative number', async () => {
    const wrapper = mount(LengthInput)
    const $input = wrapper.get('input')
    $input.element.value = '-1'
    await $input.trigger('input')

    expect(wrapper.text()).toContain('greater than 0.')
    expect($input.classes()).toContain('border-red-500')
    expect(wrapper.emitted('update:length')).toBeUndefined()
    expect(wrapper.emitted('update:isValid')).toEqual([[false]])
  })

  it('should reset the error when user corrects the input', async () => {
    const wrapper = mount(LengthInput)
    const $input = wrapper.get('input')
    $input.element.value = '0'
    await $input.trigger('input')

    expect(wrapper.text()).toContain('greater than 0.')
    expect($input.classes()).toContain('border-red-500')

    $input.element.value = '1'
    await $input.trigger('input')

    expect(wrapper.text()).not.toContain('greater than 0.')
    expect($input.classes()).not.toContain('border-red-500')
  })
})
