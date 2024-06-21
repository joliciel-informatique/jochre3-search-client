<script setup lang="ts">
import { ref } from 'vue'
import PreferencesModal from '../components/PreferencesModal.vue'
import { useKeycloakStore } from '@/stores/KeycloakStore'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  // import icons here
  faGear,
  faRightToBracket,
  faRightFromBracket
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faGear)
library.add(faRightToBracket)
library.add(faRightFromBracket)

const keycloak = useKeycloakStore().keycloak

const authenticated = ref<boolean>(keycloak?.authenticated ?? false)

const preferencesVisible = ref<boolean>(false)
function showPreferences() {
  preferencesVisible.value = true
  console.log(`preferencesVisible: ${preferencesVisible.value}`)
}

function hidePreferences() {
  preferencesVisible.value = false
  console.log(`preferencesVisible: ${preferencesVisible.value}`)
}

function loginOrLogout() {
  if (authenticated.value) {
    keycloak?.logout()
  } else {
    keycloak?.login()
  }
}
</script>

<template>
  <div
    class="container is-fluid has-text-white custom-background has-text-weight-semibold m-0 p-0 header-footer-content"
  >
    <div class="grid">
      <div class="cell p-2">
        <img style="width: 100px; border: none" :src="$t('header.logo')" />
      </div>
      <div class="cell is-col-span-2 p-2">
        <div v-html="$t('header.title')"></div>
      </div>
      <div class="cell p-2">
        <div class="container">
          <button
            @click="showPreferences"
            class="button is-small"
            :title="$t('header.preferences')"
          >
            <span class="icon is-small">
              <font-awesome-icon icon="gear" />
            </span></button
          >&nbsp;
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
        </div>
        <PreferencesModal
          :visible="preferencesVisible"
          @on-close-modal="hidePreferences"
        ></PreferencesModal>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/main.scss';
</style>
