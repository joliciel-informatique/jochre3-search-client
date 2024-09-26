import type { App, DirectiveBinding } from 'vue'

const toolTipDirective = (app: App<Element>) => {
  app.directive('tooltip', {
    mounted(el, binding) {
      init(el, binding)
    },
    updated(el, binding) {
      init(el, binding)
    }
  })
}

const init = (el: HTMLElement, binding: DirectiveBinding) => {
  if (Array.isArray(binding.value)) {
    const position = binding.value[0] ?? 'top'
    const tooltipText = binding.value[1] ?? 'Tooltip text'
    el.setAttribute('position', position)
    el.setAttribute('tooltip', tooltipText)
  } else {
    const position = binding.arg || 'top'
    const tooltipText = binding.value || 'Tooltip text'
    el.setAttribute('position', position)
    el.setAttribute('tooltip', tooltipText)
  }
}

export default toolTipDirective
