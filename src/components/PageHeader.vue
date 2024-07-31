<template>
  <div
    class="container hery-body is-fluid has-text-white custom-background has-text-weight-semibold m-0 p-0 header-footer-content"
  >
    <div class="grid">
      <div class="cell p-2">
        <div class="is-pulled-left">
          <img style="width: 100px; border: none" :src="$t('header.logo')" />
        </div>
      </div>
      <div class="cell is-col-span-2 p-2">
        <div class="title is-3 has-text-white">{{ $t('header.title') }}</div>
        <div class="beta-flyout">{{ $t('header.beta') }}</div>
        <div class="link">
          <a class="link-white" href="{{ $t('header.link.url') }}" target="_blank">{{
            $t('header.link.text')
          }}</a>
        </div>
      </div>
      <div class="cell p-2">
        <div class="is-pulled-right">
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

<script setup lang="ts">
import { ref } from 'vue'
import { useKeycloakStore } from '@/stores/KeycloakStore'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faGear, faRightToBracket, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import PreferencesModal from '@/_components/Modals/Preferences/PreferencesModal.vue'

library.add(faGear, faRightToBracket, faRightFromBracket)

const keycloak = useKeycloakStore().keycloak
const authenticated = ref<boolean>(keycloak?.authenticated ?? false)
const preferencesVisible = ref<boolean>(false)

const showPreferences = () => {
  preferencesVisible.value = true
  console.log(`preferencesVisible: ${preferencesVisible.value}`)
}

const hidePreferences = () => {
  preferencesVisible.value = false
  console.log(`preferencesVisible: ${preferencesVisible.value}`)
}

const loginOrLogout = () => (authenticated.value ? keycloak?.logout() : keycloak?.login())
</script>
