<template>
  <div class="accordion-card is-flex is-flex-direction-column is-justify-content-space-between">
    <slot name="header"></slot>
    <Transition
      name="accordion-card"
      @before-enter="beforeEnter"
      @enter="enter"
      @before-leave="beforeLeave"
      @leave="leave"
    >
      <div class="body is-flex-grow-1" v-show="showing">
        <div class="body-inner is-flex is-flex-direction-column">
          <slot name="content"></slot>
        </div>
      </div>
    </Transition>
    <slot name="footer"></slot>
  </div>
</template>
<script setup lang="ts">
const showing = defineModel('showing', { default: true, type: Boolean })

const beforeEnter = <Element,>(el: Element) => ((el as HTMLElement).style.height = '0')
const enter = <Element,>(el: Element) =>
  ((el as HTMLElement).style.height = `${(el as HTMLElement).scrollHeight}px`)
const beforeLeave = <Element,>(el: Element) =>
  ((el as HTMLElement).style.height = `${(el as HTMLElement).scrollHeight}px`)
const leave = <Element,>(el: Element) => ((el as HTMLElement).style.height = '0')
</script>
