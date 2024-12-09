<template>
  <div v-if="authenticated">
    <!-- User options on desktop -->
    <div class="is-hidden-touch">
      <div
        class="navbar-item user-options is-hoverable is-flex-wrap-wrap is-align-content-start"
        :class="preferences.displayLeftToRight ? 'rtl' : 'ltr'"
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
          class="navbar-dropdown"
          :class="preferences.displayLeftToRight ? 'is-right rtl' : 'ltr'"
        >
          <a
            class="navbar-item"
            @click.prevent="preferences.show = true"
            :title="$t('header.preferences')"
          >
            <font-awesome-icon icon="gear" size="lg" />
            <span>{{ $t('header.preferences') }}</span>
          </a>

          <a class="navbar-item" @click.prevent="signout()" :title="$t('header.logout')">
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
            <span>{{ $t('header.preferences') }}</span>
          </a>
          <a class="panel-block" @click.prevent="signout()" :title="$t('header.logout')">
            <font-awesome-icon class="panel-icon" icon="right-from-bracket" size="lg" />
            <span>
              {{ $t('header.logout') }}
            </span>
          </a>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="navbar-item">
      <a class="navbar-link">
        <font-awesome-icon icon="user" size="lg" :title="$t('header.login')"></font-awesome-icon>"/>
      </a>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useKeycloakStore } from '@/stores/KeycloakStore'
import { ref } from 'vue'
import { usePreferencesStore } from '@/stores/PreferencesStore'
const keycloak = useKeycloakStore().keycloak
const authenticated = ref<boolean>(keycloak?.authenticated ?? false)
const preferences = usePreferencesStore()
const hasAdvancedSearchCriteria = ref(false)
const showAdvancedSearchPanel = defineModel('showAdvancedSearchPanel')
const openNavBarMobileMenu = defineModel('openNavBarMobileMenu')

const signout = () => keycloak?.logout()

const signin = () => keycloak?.login()
</script>
