<template>
  <div
    class="container hero-body is-fluid has-background-primary has-text-white m-0 p-0 header-footer-content"
    aria-role="banner"
  >
    <div class="grid">
      <div class="cell p-2">
        <div class="is-pulled-left">
          <a :href="$t('header.logo-url')">
            <img
              style="width: 100px; border: none"
              :src="$t('header.logo')"
              :alt="$t('header.title')"
              :title="$t('header.title')"
          /></a>
        </div>
      </div>
      <div class="cell is-col-span-2 p-2">
        {{ headerInfo($tm('header')) }}
        <div class="title has-text-white py-4">{{ $t('header.title') }}</div>
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
      <div class="cell p-2">
        <div class="is-pulled-right">
          <button
            @click="preferences.show = true"
            class="button is-small"
            :title="$t('header.preferences')"
          >
            <span class="icon is-small">
              <font-awesome-icon icon="gear" />
            </span>
          </button>
          <button
            @click="loginOrLogout"
            class="button is-small"
            :title="authenticated ? $t('header.logout') : $t('header.login')"
          >
            <span class="icon is-small">
              <font-awesome-icon icon="right-to-bracket" v-if="!authenticated" />
              <font-awesome-icon icon="right-from-bracket" v-if="authenticated" />
            </span>
          </button>
          <button @click="toggleLanguage($i18n as VueI18n.VueI18n)" class="button is-small">
            <span v-if="preferences.language === 'yi'">YI</span>
            <span v-if="preferences.language === 'en'">EN</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useKeycloakStore } from '@/stores/KeycloakStore'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faGear, faRightToBracket, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { usePreferencesStore } from '@/stores/PreferencesStore'
import VueI18n from 'vue-i18n'

const preferences = usePreferencesStore()

library.add(faGear, faRightToBracket, faRightFromBracket)

const keycloak = useKeycloakStore().keycloak
const authenticated = ref<boolean>(keycloak?.authenticated ?? false)
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

const loginOrLogout = () => (authenticated.value ? keycloak?.logout() : keycloak?.login())

const toggleLanguage = (vi18n: VueI18n.VueI18n) => {
  preferences.language = preferences.language === 'yi' ? 'en' : 'yi'
  vi18n.locale = preferences.language
}
</script>
