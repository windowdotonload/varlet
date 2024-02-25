import Select from '..'
import VarSelect from '../Select'
import Option from '../../option'
import VarOption from '../../option/Option'
import { mount } from '@vue/test-utils'
import { createApp } from 'vue'
import { delay, trigger, triggerKeyboard } from '../../utils/test'
import { expect, vi, describe } from 'vitest'

test('test select plugin', () => {
  const app = createApp({}).use(Select)
  expect(app.component(Select.name)).toBeTruthy()
})

test('test select variant', () => {
  ;['standard', 'outlined'].forEach((variant) => {
    const wrapper = mount(VarSelect, {
      props: {
        value: '',
        variant,
      },
    })

    expect(wrapper.find(`var-field-decorator--${variant}`)).toBeTruthy()
    switch (variant) {
      case 'standard': {
        expect(
          wrapper.find('.var-field-decorator__line').wrapperElement.querySelector('.var-field-decorator__dot')
        ).toBeTruthy()
        break
      }

      case 'outlined': {
        expect(wrapper.find('.var-field-decorator__line').wrapperElement.querySelector('legend')).toBeTruthy()
        break
      }

      default:
        break
    }

    expect(wrapper.html()).toMatchSnapshot()
    wrapper.unmount()
  })
})

test('test select size', () => {
  const wrapper = mount(VarSelect, {
    props: {
      value: '',
      size: 'small',
    },
  })

  expect(wrapper.find('.var-field-decorator--small')).toBeTruthy()
  expect(wrapper.html()).toMatchSnapshot()
})

test('test option plugin', () => {
  const app = createApp({}).use(Option)
  expect(app.component(Option.name)).toBeTruthy()
})

const Wrapper = {
  components: {
    [VarSelect.name]: VarSelect,
    [VarOption.name]: VarOption,
  },
}

test('test select by label', async () => {
  const wrapper = mount({
    ...Wrapper,
    data: () => ({
      value: '',
    }),
    template: `
      <var-select v-model="value">
        <var-option label="吃饭" />
        <var-option label="睡觉" />
      </var-select>
    `,
  })

  await wrapper.trigger('click')
  await trigger(document.querySelector('.var-option'), 'click')
  expect(wrapper.vm.value).toBe('吃饭')

  wrapper.unmount()
})

test('test select by value', async () => {
  const wrapper = mount({
    ...Wrapper,
    data: () => ({
      value: '',
    }),
    template: `
      <var-select v-model="value">
        <var-option label="吃饭" :value="1" />
        <var-option label="睡觉" :value="2" />
      </var-select>
    `,
  })

  await wrapper.trigger('click')
  await trigger(document.querySelector('.var-option'), 'click')
  expect(wrapper.vm.value).toBe(1)

  wrapper.unmount()
})

test('test select by disabled', async () => {
  const wrapper = mount({
    ...Wrapper,
    data: () => ({
      value: '',
    }),
    template: `
      <var-select v-model="value">
        <var-option label="吃饭" disabled />
        <var-option label="睡觉" disabled />
      </var-select>
    `,
  })

  await wrapper.trigger('click')
  await trigger(document.querySelector('.var-option'), 'click')
  expect(wrapper.vm.value).toBe('')

  wrapper.unmount()
})

test('test select hint to be false', () => {
  const wrapper = mount({
    ...Wrapper,
    data: () => ({
      value: '吃饭',
    }),
    template: `
      <var-select :hint="false" v-model="value">
        <var-option label="吃饭" />
        <var-option label="睡觉" />
      </var-select>
    `,
  })

  expect(wrapper.html()).toMatchSnapshot()

  wrapper.unmount()
})

test('test select onFocus & onBlur', async () => {
  const onFocus = vi.fn()
  const onBlur = vi.fn()

  const wrapper = mount({
    ...Wrapper,
    data: () => ({
      value: '',
    }),
    methods: {
      onFocus,
      onBlur,
    },
    template: `
      <var-select v-model="value" @focus="onFocus" @blur="onBlur">
        <var-option label="吃饭" />
        <var-option label="睡觉" />
      </var-select>
    `,
  })

  await wrapper.trigger('focus')
  expect(onFocus).toHaveBeenCalledTimes(1)
  await wrapper.trigger('blur')
  expect(onBlur).toHaveBeenCalledTimes(1)

  wrapper.unmount()
})

test('test select disabled', async () => {
  const onFocus = vi.fn()
  const onBlur = vi.fn()

  const wrapper = mount(
    {
      ...Wrapper,
      data: () => ({
        disabled: true,
        value: '睡觉',
      }),
      methods: {
        onFocus,
        onBlur,
      },
      template: `
      <div class="container"></div>
      <var-select
        clearable
        :disabled="disabled"
        v-model="value"
        @focus="onFocus"
        @blur="onBlur"
      >
        <var-option label="吃饭" />
        <var-option label="睡觉" />
      </var-select>
    `,
    },
    { attachTo: document.body }
  )

  await trigger(document.querySelector('.var-select__menu'), 'click')
  expect(onFocus).toHaveBeenCalledTimes(0)

  await wrapper.setData({ disabled: false })
  await trigger(document.querySelector('.var-select__menu'), 'click')
  await wrapper.setData({ disabled: true })
  await wrapper.find('.container').trigger('click')
  expect(onBlur).toHaveBeenCalledTimes(0)

  await wrapper.setData({ disabled: false })
  await wrapper.trigger('click')
  await wrapper.setData({ disabled: true })
  await trigger(document.querySelector('.var-option'), 'click')
  expect(wrapper.vm.value).toBe('睡觉')

  await wrapper.find('.var-icon-close-circle').trigger('click')
  expect(wrapper.vm.value).toBe('睡觉')

  wrapper.unmount()
  document.body.innerHTML = ''
})

test('test select readonly', async () => {
  const onFocus = vi.fn()
  const onBlur = vi.fn()

  const wrapper = mount(
    {
      ...Wrapper,
      data: () => ({
        readonly: true,
        value: '睡觉',
      }),
      methods: {
        onFocus,
        onBlur,
      },
      template: `
      <div class="container"></div>
      <var-select
        clearable
        :readonly="readonly"
        v-model="value"
        @focus="onFocus"
        @blur="onBlur"
      >
        <var-option label="吃饭" />
        <var-option label="睡觉" />
      </var-select>
    `,
    },
    { attachTo: document.body }
  )

  await wrapper.trigger('click')
  expect(onFocus).toHaveBeenCalledTimes(0)

  await wrapper.setData({ readonly: false })
  await trigger(document.querySelector('.var-select__menu'), 'click')
  await wrapper.setData({ readonly: true })
  await wrapper.find('.container').trigger('click')
  expect(onBlur).toHaveBeenCalledTimes(0)

  await wrapper.setData({ readonly: false })
  await trigger(document.querySelector('.var-select__menu'), 'click')
  await wrapper.setData({ readonly: true })
  await trigger(document.querySelector('.var-option'), 'click')
  expect(wrapper.vm.value).toBe('睡觉')

  await wrapper.find('.var-icon-close-circle').trigger('click')
  expect(wrapper.vm.value).toBe('睡觉')

  wrapper.unmount()
  document.body.innerHTML = ''
})

test('test select clear', async () => {
  const wrapper = mount(
    {
      ...Wrapper,
      data: () => ({
        value: '吃饭',
      }),
      template: `
      <var-select clearable v-model="value">
        <var-option label="吃饭" />
        <var-option label="睡觉" />
      </var-select>
    `,
    },
    { attachTo: document.body }
  )

  await wrapper.find('.var-icon-close-circle').trigger('click')
  expect(wrapper.vm.value).toBe(undefined)

  wrapper.unmount()
})

test('test select multiple value', async () => {
  const wrapper = mount(
    {
      ...Wrapper,
      data: () => ({
        value: [],
      }),
      template: `
      <var-select multiple v-model="value">
        <var-option label="吃饭" />
        <var-option label="睡觉" />
      </var-select>
    `,
    },
    { attachTo: document.body }
  )

  await wrapper.trigger('click')

  Array.from(document.querySelectorAll('.var-option')).forEach((el) => trigger(el, 'click'))
  expect(wrapper.vm.value).toStrictEqual(['吃饭', '睡觉'])

  wrapper.unmount()
  document.body.innerHTML = ''
})

test('test select multiple value in chips', async () => {
  const wrapper = mount(
    {
      ...Wrapper,
      data: () => ({
        value: [],
      }),
      template: `
      <var-select multiple chip v-model="value">
        <var-option label="吃饭" />
        <var-option label="睡觉" />
      </var-select>
    `,
    },
    { attachTo: document.body }
  )

  await wrapper.trigger('click')

  Array.from(document.querySelectorAll('.var-option')).forEach((el) => trigger(el, 'click'))
  expect(wrapper.vm.value).toStrictEqual(['吃饭', '睡觉'])
  await delay(16)

  await wrapper.find('.var-chip--close').trigger('click')
  expect(wrapper.vm.value).toStrictEqual(['睡觉'])

  wrapper.unmount()
  document.body.innerHTML = ''
})

test('test select validation', async () => {
  const wrapper = mount(
    {
      ...Wrapper,
      data: () => ({
        value: '',
      }),
      template: `
      <var-select ref="select" :rules="[v => !!v || '您必须选择一个']" v-model="value">
        <var-option label="吃饭" />
        <var-option label="睡觉" />
      </var-select>
    `,
    },
    { attachTo: document.body }
  )

  const { select } = wrapper.vm.$refs

  select.validate()
  await delay(16)
  expect(wrapper.find('.var-form-details__error-message').text()).toBe('您必须选择一个')
  expect(wrapper.html()).toMatchSnapshot()

  await wrapper.trigger('click')
  await trigger(document.querySelector('.var-option'), 'click')
  await delay(16)
  expect(wrapper.find('.var-form-details__error-message').exists()).toBeFalsy()

  select.reset()
  expect(wrapper.vm.value).toBe(undefined)

  wrapper.unmount()
  document.innerHTML = ''
})

test('test select focus & blur methods', async () => {
  const wrapper = mount({
    ...Wrapper,
    data: () => ({
      value: '',
    }),
    template: `
      <var-select ref="select" v-model="value">
        <var-option label="吃饭" />
        <var-option label="睡觉" />
      </var-select>
    `,
  })

  const { select } = wrapper.vm.$refs

  select.focus()
  await delay(16)
  expect(wrapper.html()).toMatchSnapshot()

  select.blur()
  await delay(16)
  expect(wrapper.html()).toMatchSnapshot()

  wrapper.unmount()
})

test('test select keyboard select option by space', async () => {
  const wrapper = mount(
    {
      ...Wrapper,
      data: () => ({
        value: '',
      }),
      template: `
      <var-select v-model="value">
        <var-option label="吃饭" />
        <var-option label="睡觉" />
      </var-select>
    `,
    },
    { attachTo: document.body }
  )

  await trigger(wrapper, 'focus')
  await triggerKeyboard(window, 'keyup', { key: ' ' })
  await triggerKeyboard(window, 'keydown', { key: 'ArrowDown' })
  await triggerKeyboard(document.querySelector('.var-option'), 'focus')
  await triggerKeyboard(window, 'keyup', { key: ' ' })
  expect(wrapper.vm.value).toBe('吃饭')

  wrapper.unmount()
  document.body.innerHTML = ''
})

test('test select keyboard select option by enter', async () => {
  const wrapper = mount(
    {
      ...Wrapper,
      data: () => ({
        value: '',
      }),
      template: `
      <var-select v-model="value">
        <var-option label="吃饭" />
        <var-option label="睡觉" />
      </var-select>
    `,
    },
    { attachTo: document.body }
  )

  await trigger(wrapper, 'focus')
  await triggerKeyboard(window, 'keydown', { key: 'Enter' })
  await triggerKeyboard(window, 'keydown', { key: 'ArrowDown' })
  await triggerKeyboard(document.querySelector('.var-option'), 'focus')
  await triggerKeyboard(window, 'keydown', { key: 'Enter' })
  expect(wrapper.vm.value).toBe('吃饭')

  wrapper.unmount()
  document.body.innerHTML = ''
})

test('test select keyboard close menu by escape', async () => {
  const wrapper = mount(
    {
      ...Wrapper,
      data: () => ({
        value: '',
      }),
      template: `
      <var-select v-model="value">
        <var-option label="吃饭" />
        <var-option label="睡觉" />
      </var-select>
    `,
    },
    { attachTo: document.body }
  )

  await wrapper.trigger('focus')
  await triggerKeyboard(window, 'keydown', { key: 'Enter' })
  expect(document.querySelector('.var-menu__menu').style.display).toBe('')
  await triggerKeyboard(window, 'keydown', { key: 'Escape' })
  expect(document.querySelector('.var-menu__menu').style.display).toBe('none')
  wrapper.unmount()
  document.body.innerHTML = ''
})

test('test select offset-y', async () => {
  const wrapper = mount(
    {
      components: {
        [VarSelect.name]: VarSelect,
        [VarOption.name]: VarOption,
      },
      data: () => ({
        offsetY: 40,
      }),
      template: `
      <var-select ref="select" offset-y="40">
        <var-option label="火猫" />
        <var-option label="土猫" />
        <var-option label="紫猫" />
        <var-option label="蓝猫" />
      </var-select>
      `,
    },
    { attachTo: document.body }
  )

  const { select } = wrapper.vm.$refs

  select.focus()
  await delay(1000)

  const menu = wrapper.findComponent({ name: 'var-menu' })

  expect(menu.vm.offsetY).toBe(40)

  wrapper.unmount()
})

describe('test select component slots', () => {
  test('test select clear icon slot', () => {
    const wrapper = mount(VarSelect, {
      props: {
        clearable: true,
        modelValue: 'value',
      },
      slots: {
        'clear-icon': () => 'clear-icon',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()

    wrapper.unmount()
  })

  test('test select append icon slot', () => {
    const wrapper = mount(VarSelect, {
      props: {
        clearable: true,
        modelValue: 'value',
      },
      slots: {
        'append-icon': () => 'append-icon',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()

    wrapper.unmount()
  })

  test('test select prepend icon slot', () => {
    const wrapper = mount(VarSelect, {
      props: {
        clearable: true,
        modelValue: 'value',
      },
      slots: {
        'prepend-icon': () => 'prepend-icon',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()

    wrapper.unmount()
  })
})
