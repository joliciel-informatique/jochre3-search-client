<template>
  <div class="accordion-card">
    <slot name="header"></slot>
    <Transition
      name="accordion-card"
      @before-enter="beforeEnter"
      @enter="enter"
      @before-leave="beforeLeave"
      @leave="leave"
    >
      <div class="body" v-show="showing">
        <div class="body-inner">
          <slot name="content"></slot>
        </div>
      </div>
    </Transition>
    <div class="card-footer is-justify-content-center is-clickable" @click="toggle()">
      <span class="icon is-large footer-icon" :class="{ rotate: !showing }">
        <font-awesome-icon icon="circle-chevron-up" size="lg" />
      </span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCircleChevronUp } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { onMounted } from 'vue'
library.add(faCircleChevronUp)

const { id } = defineProps(['id'])
const showing = defineModel('showing', { default: true, type: Boolean })

const toggle = () => (showing.value = !showing.value)
const beforeEnter = <Element,>(el: Element) => ((el as HTMLElement).style.height = '0')
const enter = <Element,>(el: Element) =>
  ((el as HTMLElement).style.height = `${(el as HTMLElement).scrollHeight}px`)
const beforeLeave = <Element,>(el: Element) =>
  ((el as HTMLElement).style.height = `${(el as HTMLElement).scrollHeight}px`)
const leave = <Element,>(el: Element) => ((el as HTMLElement).style.height = '0')

/** autoShow the sticky result card */
const isSticky = () => {
  const stickyElement = document.querySelector('.card.metadata:not(.not-sticky)')
  if (stickyElement?.getAttribute('id') === id) {
    showing.value = true
    window.removeEventListener('scroll', isSticky)
  }
}

onMounted(() => {
  const el = document.getElementById(id)
  const observer = new IntersectionObserver(
    ([e]) => e.target.classList.toggle('not-sticky', e.intersectionRatio < 1),
    { threshold: [1] }
  )

  if (el !== null) {
    observer.observe(el)
    window.addEventListener('scroll', isSticky)
  }
})
</script>
