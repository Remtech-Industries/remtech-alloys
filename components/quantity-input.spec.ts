import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import QuantityInput from './QuantityInput.vue'

describe('Quantity Input', () => {
  it('should include the word Quantity', () => {
    const wrapper = mount(QuantityInput)
    expect(wrapper.text()).toContain('Quantity')
  })

  it('should display no errors and emit value when valid', async () => {
    const wrapper = mount(QuantityInput)
    const $input = wrapper.get('input')
    $input.element.value = '1'
    await $input.trigger('input')

    expect(wrapper.text()).not.toContain('is required.')
    expect($input.classes()).not.toContain('border-red-500')
    expect(wrapper.emitted('update:quantity')).toEqual([[1]])
    expect(wrapper.emitted('update:isValid')).toEqual([[true]])
  })

  it('should say quantity is required if input is blank', async () => {
    const wrapper = mount(QuantityInput)
    const $input = wrapper.get('input')
    $input.element.value = ''
    await $input.trigger('input')

    expect(wrapper.text()).toContain('is required.')
    expect($input.classes()).toContain('border-red-500')
    expect(wrapper.emitted('update:quantity')).toBeUndefined()
    expect(wrapper.emitted('update:isValid')).toEqual([[false]])
  })

  it('should say quantity is required if input is 0', async () => {
    const wrapper = mount(QuantityInput)
    const $input = wrapper.get('input')
    $input.element.value = '0'
    await $input.trigger('input')

    expect(wrapper.text()).toContain('greater than 0.')
    expect($input.classes()).toContain('border-red-500')
    expect(wrapper.emitted('update:quantity')).toBeUndefined()
    expect(wrapper.emitted('update:isValid')).toEqual([[false]])
  })

  it('should say quantity is required to be more than 0 if user enters negative number', async () => {
    const wrapper = mount(QuantityInput)
    const $input = wrapper.get('input')
    $input.element.value = '-1'
    await $input.trigger('input')

    expect(wrapper.text()).toContain('greater than 0.')
    expect($input.classes()).toContain('border-red-500')
    expect(wrapper.emitted('update:quantity')).toBeUndefined()
    expect(wrapper.emitted('update:isValid')).toEqual([[false]])
  })

  it('should reset the error when user corrects the input', async () => {
    const wrapper = mount(QuantityInput)
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
