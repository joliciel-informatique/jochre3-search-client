<template>
  <div class="">
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
</template>
<script setup lang="ts">
import VueI18n from 'vue-i18n'
import { useKeycloakStore } from '@/stores/KeycloakStore'
import { ref } from 'vue'
import { usePreferencesStore } from '@/stores/PreferencesStore'
const keycloak = useKeycloakStore().keycloak
const authenticated = ref<boolean>(keycloak?.authenticated ?? false)
const preferences = usePreferencesStore()
const loginOrLogout = () => (authenticated.value ? keycloak?.logout() : keycloak?.login())

const toggleLanguage = (vi18n: VueI18n.VueI18n) => {
  preferences.language = preferences.language === 'yi' ? 'en' : 'yi'
  vi18n.locale = preferences.language
}
</script>
