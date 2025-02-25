<template>
  <ModalBox v-model:data="preferences" v-model:notification="notification">
    <template #header>
      <p class="modal-card-title">{{ $t('preferences.title') }}</p>
    </template>
    <template #body>
      <div class="p-3">
        <div class="columns is-vcentered py-3">
          <div class="column">
            <h1 class="label">{{ $t('preferences.general-heading') }}</h1>
            <div class="is-flex is-flex-direction-column m-2">
              <div class="columns is-vcentered is-10 pb-2">
                <span class="column is-4 px-2">{{ $t('preferences.interface-style') }}</span>
                <div class="column is-4 control">
                  <span class="select is-fullwidth">
                    <select name="setToLanguageSelect" v-model="interfaceStyleToSet">
                      <option value="old">{{ $t('preferences.old-interface-style') }}</option>
                      <option value="new">{{ $t('preferences.new-interface-style') }}</option>
                    </select>
                  </span>
                </div>
              </div>
              <div class="columns is-vcentered is-10 pb-2">
                <span class="column is-4 px-2">{{ $t('preferences.language') }}</span>
                <div class="column is-4 control">
                  <span class="select is-fullwidth">
                    <select name="setToLanguageSelect" v-model="languageToSet">
                      <option value="yi">ייִדיש</option>
                      <option value="en">English</option>
                    </select>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="columns is-vcentered py-3">
          <div class="column">
            <h1 class="label">{{ $t('preferences.snippets-heading') }}</h1>
            <div class="is-flex is-flex-direction-row is-align-items-center m-2">
              <!-- the switch needs labels inverted if right-to-left -->
              <span class="px-4 has-text-centered" v-if="preferences.displayLeftToRight">{{
                $t('preferences.snippets-per-book')
              }}</span>
              <span class="px-2 has-text-centered" v-else>{{
                $t('preferences.snippets-as-list')
              }}</span>
              <div class="control is-expanded">
                <label
                  class="switch is-rounded is-small"
                  :class="preferences.displayLeftToRight ? '' : 'switch-ltr'"
                >
                  <input type="checkbox" v-model="displayPerBook" />
                  <span class="check"></span>
                </label>
              </div>
              <span class="px-2" v-if="preferences.displayLeftToRight">{{
                $t('preferences.snippets-as-list')
              }}</span>
              <span class="px-2" v-else>{{ $t('preferences.snippets-per-book') }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <button class="button is-link" @click="save()">
        {{ $t('modal.save') }}
      </button>
    </template>
  </ModalBox>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { usePreferencesStore } from '@/stores/PreferencesStore'
import ModalBox from '@/_components/ModalBox/ModalBox.vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()

const notification = defineModel('notification')
const preferences = usePreferencesStore()
const interfaceStyleToSet = ref<string>(preferences.interfaceStyle)
const languageToSet = ref<string>(preferences.language)

const { displayPerBook, language } = storeToRefs(preferences)

const save = () => {
  if (languageToSet.value != language.value) {
    language.value = languageToSet.value
    i18n.locale.value = language.value
  }
  preferences.save()
  preferences.show = false
}
</script>
