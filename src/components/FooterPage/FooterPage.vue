<template>
  <div class="columns is-mobile">
    <div class="column is-3 is-size-7-mobile">
      {{ $t('footer.powered-by') }}
      <a href="https://github.com/urieli/jochre/" target="blank">
        <img src="/images/jochreLogo.png" style="width: 150px; border: none" :alt="$t('Jochre')" />
      </a>
    </div>
    <div class="column">
      <div class="columns has-text-centered is-align-content-center">
        <!-- <div class="column" v-html="$t('footer.credits')"></div> -->
        {{ footerInfo($tm('footer.credits')) }}
        <div class="column" v-for="footerColumn in footerLinks" :key="footerColumn">
          <div v-for="col in footerColumn" :key="col">
            <div class="m-2 is-size-7-mobile" v-html="prepareColumn(col)"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="columns is-mobile has-text-right p-2">
    <!-- <a class="button is-link">{{ $t('footer.credits-column-2') }}</a> -->
    <div class="column is-size-7-mobile" v-html="$t('footer.privacy')"></div>
    {{ privacyInfo($tm('footer.privacy')) }}
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
// import FooterDefault from './FooterDefault/FooterDefault.vue'
import { usePreferencesStore } from '@/stores/PreferencesStore'

const FooterDefault = defineAsyncComponent(() => import('./FooterDefault/FooterDefault.vue'))
const FooterNavigation = defineAsyncComponent(
  () => import('./FooterNavigation/FooterNavigation.vue')
)

const preferences = usePreferencesStore()

const showFooterNavigation = ref(false)
// const totalHits = defineModel('totalHits')

const footerLinks = ref()

const footerInfo = (info: {}) => {
  const infoObj = JSON.parse(JSON.stringify(info)) // Proxy to normal JSON object
  footerLinks.value = infoObj
}

const prepareColumn = (item: any) =>
  item.title.match(/{\d}/)?.map((link: any) => {
    const number = link.replace('}', '').replace('{', '') // Isolate numbers
    const hyperlink = `<a class="link-subtle" href="${item[number].link}" target="${item[number].target}">${item[number].title}</a>`
    return `${item.title.replace(link, hyperlink)}`
  }) || item.title

const privacyInfo = (item: any) => {}

/** Autohide footerbar upon scrolling */
const bottomVisible = () =>
  document.documentElement.clientHeight + window.scrollY >=
  (document.documentElement.scrollHeight || document.documentElement.clientHeight)

const hasScrollBar = () => document.body.scrollHeight > window.innerHeight

const autoHide = () =>
  (showFooterNavigation.value = hasScrollBar() && bottomVisible() ? false : true)

onMounted(() => window.addEventListener('scroll', autoHide))
</script>
