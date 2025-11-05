<template>
  <!-- <div > -->
  <!-- User options on desktop -->
  <div class="is-hidden-touch">
    <div
      class="navbar-item is-hoverable is-flex-wrap-wrap is-align-content-start"
      :class="preferences.displayLeftToRight ? 'rtl' : 'ltr'"
      :style="!searchResults?.length ? 'position:fixed;top:0' : ''"
    >
      <a class="navbar-link" :class="preferences.displayLeftToRight ? 'rtl' : 'ltr'">
        <p
          class="has-text-white"
          :class="preferences.displayLeftToRight ? 'has-text-left' : 'has-text-right'"
        >
          <font-awesome-icon icon="user" class="" size="lg" />
        </p>
      </a>
      <div
        class="navbar-dropdown m-0 p-0"
        :class="preferences.displayLeftToRight ? 'is-right rtl' : 'ltr'"
      >
        <a
          class="navbar-item p-3"
          @click.prevent="preferences.show = true"
          :title="$t('header.preferences')"
        >
          <font-awesome-icon icon="gear" size="lg" />
          <span>{{ $t('header.preferences') }}</span>
        </a>

        <a class="navbar-item p-3" @click.prevent="signout()" :title="$t('header.logout')">
          <font-awesome-icon icon="right-from-bracket" size="lg" />
          <span>{{ $t('header.logout') }} </span>
        </a>
      </div>
    </div>
  </div>

  <!-- User options on mobile -->
  <div
    v-show="openNavBarMobileMenu"
    class="navbar-mobile"
    :class="preferences.displayLeftToRight ? 'right' : 'left'"
    id="navbar-mobile"
  >
    <div class="menu is-pulled-right panel">
      <div class="is-hidden-desktop">
        <a class="panel-block" :href="$t('search.help-url')" target="_blank">
          <font-awesome-icon class="panel-icon" icon="book-open" />
          <span class="has-text-dark">
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
          <span class="has-text-dark">
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
          <span class="has-text-dark">{{ $t('header.preferences') }}</span>
        </a>
        <a class="panel-block" @click.prevent="signout()" :title="$t('header.logout')">
          <font-awesome-icon class="panel-icon" icon="right-from-bracket" size="lg" />
          <span class="has-text-dark">
            {{ $t('header.logout') }}
          </span>
        </a>
      </div>
    </div>
  </div>
  <!-- </div> -->
  <!-- <div v-else>
    <div class="navbar-item">
      <a class="navbar-link">
        <font-awesome-icon icon="user" size="lg" :title="$t('header.login')"></font-awesome-icon>"/>
      </a>
    </div>
  </div> -->
</template>
<script setup lang="ts">
import { useKeycloakStore } from '@/stores/KeycloakStore'
import { ref } from 'vue'
import { usePreferencesStore } from '@/stores/PreferencesStore'
import { useSearchStore } from '@/stores/SearchStore'
import { storeToRefs } from 'pinia'
const keycloak = useKeycloakStore().keycloak
const authenticated = ref<boolean>(keycloak?.authenticated ?? false)
const preferences = usePreferencesStore()
const hasAdvancedSearchCriteria = ref(false)
const showAdvancedSearchPanel = defineModel('showAdvancedSearchPanel')
const openNavBarMobileMenu = defineModel('openNavBarMobileMenu')
const { searchResults } = storeToRefs(useSearchStore())

const signout = () => keycloak?.logout()

const signin = () => keycloak?.login()
</script>
