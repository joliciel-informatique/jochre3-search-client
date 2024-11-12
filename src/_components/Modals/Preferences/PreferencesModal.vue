<template>
  <ModalBox v-model:data="preferences" v-model:notification="notification">
    <template #header>
      <p class="modal-card-title">{{ $t('preferences.title') }}</p>
    </template>
    <template #body>
      <div class="p-3">
        <div class="columns is-vcentered py-3">
          <div class="column">
            <h1 class="label">{{ $t('preferences.results-heading') }}</h1>
            <div class="is-flex is-flex-direction-column m-2">
              <div class="columns is-vcentered is-10 pb-2">
                <span class="column is-4 px-2">{{ $t('preferences.results-per-page') }}</span>
                <div class="column is-4 control">
                  <input
                    class="input"
                    type="number"
                    name="resultsPerPageInput"
                    v-model="resultsPerPage"
                    @onchange="preferences.resultsPerPage = resultsPerPage"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="columns is-vcentered py-3">
          <div class="column">
            <h1 class="label">{{ $t('preferences.snippets-heading') }}</h1>
            <div class="is-flex is-flex-direction-row m-2">
              <span class="px-2">{{ $t('preferences.snippets-per-book') }}</span>
              <div class="control is-expanded">
                <label class="switch is-rounded is-small">
                  <input type="checkbox" v-model="displayPerBook" />
                  <span class="check"></span>
                </label>
              </div>
              <span class="px-2">{{ $t('preferences.snippets-as-list') }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <button class="button is-link" @click="save()">
        {{ $t('save') }}
      </button>
    </template>
  </ModalBox>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { usePreferencesStore } from '@/stores/PreferencesStore'
import ModalBox from '@/_components/ModalBox/ModalBox.vue'

const notification = defineModel('notification')
const preferences = usePreferencesStore()

const { resultsPerPage, displayPerBook } = storeToRefs(preferences)

const save = () => {
  preferences.save()
  preferences.show = false
}
</script>
