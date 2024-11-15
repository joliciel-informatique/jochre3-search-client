<template>
  <div>
    <!-- User options on desktop -->
    <div
      v-if="authenticated"
      class="navbar-item has-dropdown is-hoverable user-options is-hidden-touch"
    >
      <a class="navbar-link">
        <p class="has-text-left has-text-white">
          <font-awesome-icon icon="user" class="" size="lg" />
        </p>
      </a>
      <div class="navbar-dropdown is-right">
        <a
          @click.prevent="preferences.show = true"
          class="navbar-item"
          :title="$t('header.preferences')"
        >
          <span class="">Preferences</span>
          <font-awesome-icon icon="gear" class="is-pulled-right" size="lg" />
        </a>

        <a class="navbar-item" @click.prevent="signout()" :title="$t('header.logout')"
          >{{ $t('header.logout')
          }}<font-awesome-icon icon="right-from-bracket" class="is-pulled-right" size="lg"
        /></a>
      </div>
    </div>

    <!-- User options on mobile -->
    <div v-if="authenticated" class="is-hidden-desktop">
      <a
        class="panel-block"
        href="https://github.com/urieli/jochre/wiki/Jochre-Yiddish-Search-Help"
        target="_blank"
      >
        <font-awesome-icon class="panel-icon" icon="book-open" />
        <span>
          {{ $t('search.user-guide') }}
        </span>
      </a>
      <a class="panel-block" @click.prevent="showAdvancedSearchPanel = true">
        <font-awesome-icon
          class="panel-icon"
          :icon="
            showAdvancedSearchPanel
              ? 'magnifying-glass-minus'
              : hasAdvancedSearchCriteria
                ? 'sliders'
                : 'magnifying-glass-plus'
          "
        />
        <span>
          {{ $t('search.advanced-search') }}
        </span>
      </a>
      <a
        class="panel-block"
        @click.prevent="preferences.show = true"
        :title="$t('header.preferences')"
        target="_blank"
      >
        <font-awesome-icon class="panel-icon" icon="gear" size="lg" />
        <span> Preferences </span>
      </a>
      <a class="panel-block" @click.prevent="signout()" :title="$t('header.logout')">
        <font-awesome-icon class="panel-icon" icon="right-from-bracket" size="lg" />
        <span>
          {{ $t('header.logout') }}
        </span>
      </a>
    </div>
    <div v-else>
      <div class="navbar-item">
        <a class="navbar-link">
          <font-awesome-icon icon="user" size="lg" :title="$t('header.login')"></font-awesome-icon
          >"/>
        </a>
      </div>
    </div>
    <!-- <div class="navbar-item button is-hidden-desktop">
    <a @click.prevent="toggleLanguage($i18n as VueI18n.VueI18n)">
      <span v-if="preferences.language === 'yi'">YI</span>
      <span v-if="preferences.language === 'en'">EN</span>
    </a>
  </div> -->
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
const hasAdvancedSearchCriteria = ref(false)
const showAdvancedSearchPanel = defineModel('showAdvancedSearchPanel')

const signout = () => keycloak?.logout()

const signin = () => keycloak?.login()

const toggleLanguage = (vi18n: VueI18n.VueI18n) => {
  preferences.language = preferences.language === 'yi' ? 'en' : 'yi'
  vi18n.locale = preferences.language
}
</script>
