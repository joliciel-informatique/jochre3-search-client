<template>
  <div class="footer-partners columns m-1">
    <div class="column has-text-centered is-align-content-center">
      {{ $t('footer.powered-by') }}
      <a href="https://github.com/urieli/jochre/" target="blank">
        <img src="/images/jochreLogo.png" style="width: 150px; border: none" :alt="$t('Jochre')" />
      </a>
    </div>
    <!-- <div class="column" v-html="$t('footer.credits')"></div> -->
    {{ footerInfo($tm('footer.credits')) }}
    <div class="column" v-for="footerColumn in footerLinks" :key="footerColumn">
      <div v-for="col in footerColumn" :key="col">
        <div class="m-2" v-html="prepareColumn(col)"></div>
      </div>
    </div>
  </div>
  {{ privacyInfo($tm('footer.privacy')) }}
  <div class="column has-text-right p-2 is-full">
    <!-- <a class="button is-link">{{ $t('footer.credits-column-2') }}</a> -->
    <div v-html="$t('footer.privacy')"></div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
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
</script>
