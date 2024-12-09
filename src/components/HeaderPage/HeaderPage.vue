<template>
  <div
    id="header"
    class="columns is-mobile has-background-primary has-text-white m-0 p-0 header-footer-content"
    aria-role="banner"
    tabindex="-1"
  >
    <div class="column is-2 p-2">
      <span class="logo">
        <img :src="$t('header.logo')" :alt="$t('header.title')" :title="$t('header.title')" />
      </span>
    </div>
    <div class="column p-2 is-col-span-2">
      {{ headerInfo($tm('header')) }}
      <div
        class="is-size-2-desktop has-text-weight-semibold is-family-primary has-text-white is-size-3-tablet is-size-4-mobile py-4"
      >
        {{ $t('header.title') }}
      </div>
      <div
        class="header-beta-flyout"
        :class="{
          'is-pulled-right': preferences.displayLeftToRight,
          'is-pulled-left': !preferences.displayLeftToRight
        }"
      >
        {{ $t('header.beta') }}
      </div>
      <div class="link" v-for="link in headerLinks" :key="link">
        <a class="link-subtle" :href="link.link" :target="link.target">
          {{ link.title }}
        </a>
      </div>
    </div>
    <div class="column is-2 p-2"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePreferencesStore } from '@/stores/PreferencesStore'

const preferences = usePreferencesStore()

const headerLinks = ref()

const headerInfo = (info: {}) => {
  const infoObj = JSON.parse(JSON.stringify(info)) // Proxy to normal JSON object
  const headerText = infoObj.header
  if ('text' in headerText) {
    const links = headerText.text.match(/{\d}/)
    const strippedLinks = links.map((link: string) => link.replace('}', '').replace('{', ''))
    const linked = strippedLinks.map((link: string) => headerText[link])
    headerLinks.value = linked
  }
}
</script>
