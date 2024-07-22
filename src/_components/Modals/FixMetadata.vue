<template>
  <div
    v-show="fixMetadataModalVisible"
    class="modal"
    tabindex="100"
    :class="{ 'is-active': fixMetadataModalVisible }"
  >
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ $t('fix-metadata.title') }}</p>
        <button class="delete" aria-label="close" @click="onCancel"></button>
      </header>
      <section class="modal-card-body">
        <div v-if="!authenticated" class="is-italic has-text-weight-bold has-text-danger">
          {{ $t('fix-metadata.unauthenticated') }}
        </div>
        <div>{{ $t('fix-metadata.instructions') }}</div>
        <div class="field has-addons">
          <label class="label">{{ $t('fix-metadata.field') }}</label
          >&nbsp;
          {{ $t(`fix-metadata.field-type.${fixMetadataField}`) }}
        </div>
        <div class="field has-addons">
          <label class="label">{{ $t('fix-metadata.current-value') }}</label
          >&nbsp;
          <span
            :class="{
              ltr: isLeftToRight && $i18n.locale === 'yi',
              english: isLeftToRight && $i18n.locale === 'yi'
            }"
            >{{ fixMetadataCurrentValue }}</span
          >
        </div>
        <div class="field has-addons">
          <input
            type="radio"
            name="authorMethod"
            value="input"
            id="authorMethod-input"
            v-if="showFindAuthorDropdown"
            v-model="authorSelectionMethod"
          />
          <label class="label">{{ $t('fix-metadata.new-value') }}</label
          >&nbsp;
          <input
            class="input keyboardInput"
            :class="{
              'ltr-align': isLeftToRight && $i18n.locale === 'yi',
              english: isLeftToRight && $i18n.locale === 'yi'
            }"
            type="text"
            lang="yi"
            v-model="newValue"
            :disabled="authorSelectionMethod !== 'input'"
          />
        </div>
        <div class="field has-addons mb-0" v-if="showFindAuthorDropdown">
          <input
            type="radio"
            name="authorMethod"
            value="dropdown"
            id="authorMethod-dropdown"
            v-model="authorSelectionMethod"
          />
          <label class="label">{{ $t('fix-metadata.or-merge-with') }}</label
          >&nbsp;
          <div class="dropdown is-active is-right">
            <div class="dropdown-trigger">
              <input
                id="findAuthors"
                class="input"
                type="text"
                v-model="authorText"
                @input="findAuthors"
                :disabled="authorSelectionMethod === 'input'"
              />
            </div>
            <div
              class="dropdown-menu"
              id="dropdown-menu"
              role="menu"
              v-if="authorDropdownItems.length > 0"
            >
              <div class="dropdown-content">
                <a
                  v-for="author of authorDropdownItems"
                  :key="author"
                  class="dropdown-item"
                  @click="addAuthor(author)"
                >
                  {{ author }}
                </a>
              </div>
            </div>
            &nbsp;
            {{ authorToMerge }}
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <div class="buttons">
          <button class="button is-link" :disabled="!authenticated" @click="onSubmit">
            {{ $t('save') }}
          </button>
          <button class="button is-link is-light" @click="onCancel">
            {{ $t('cancel') }}
          </button>
        </div>
      </footer>
    </div>
    <button class="modal-close is-large" aria-label="close" @click="onCancel"></button>
  </div>
</template>

<script setup lang="ts">
import { useKeycloakStore } from '@/stores/KeycloakStore'
import axios from 'axios'
import { computed, inject, ref } from 'vue'
import type { AggregationBins } from '@/components/Support/InterfacesExternals.vue'
import { fetchData } from '@/components/Support/FetchMethods.vue'

const fixMetadataModalVisible = ref<boolean>(false)
const fixMetadataDocRef = ref<string>()
const fixMetadataField = ref<string>()
const fixMetadataCurrentValue = ref<string>()

// Setup EventBus
const eventBus: any = inject('eventBus')
eventBus.on('fixMetadata', (value: [string, string, string]) => {
  ;[fixMetadataDocRef.value, fixMetadataField.value, fixMetadataCurrentValue.value] = value
  fixMetadataModalVisible.value = true
  if (fixMetadataField.value == 'author' || fixMetadataField.value == 'authorEnglish') {
    showFindAuthorDropdown.value = true
  } else {
    showFindAuthorDropdown.value = false
  }

  console.log(`Received fixMetadata event: ${value}`)
})

const keycloak = useKeycloakStore().keycloak

const authenticated = ref<boolean>(keycloak?.authenticated ?? false)

const API_URL = inject('apiUrl')

const newValue = ref<string>()

const authorText = ref<string>('')
const authorDropdownItems = ref<string[]>([])
const authorToMerge = ref<string>('')
const authorSelectionMethod = ref<string>('input')

const applyEverywhere = computed(() => authorSelectionMethod.value != 'input')

const showFindAuthorDropdown = ref<boolean>(false)
const isLeftToRight = ref<boolean>(false)

const onSubmit = () => {
  console.log('onSubmit')
  const body = JSON.stringify({
    docRef: fixMetadataDocRef.value,
    field: fixMetadataField.value,
    value: authorSelectionMethod.value == 'input' ? newValue.value : authorToMerge.value,
    applyEverywhere: applyEverywhere.value
  })

  fetchData(
    'correct-metadata',
    'post',
    new URLSearchParams(body),
    undefined,
    `Bearer ${keycloak?.token}`
  )
    .then((result) =>
      result.json().then((result) => {
        console.log(result)
        fixMetadataModalVisible.value = false
      })
    )
    .catch((error) => {
      eventBus.emit('error', error)
    })
}

const onCancel = () => {
  fixMetadataModalVisible.value = false
}

function findAuthors() {
  if (authorText.value.length > 0) {
    axios
      .get<AggregationBins>(`${API_URL}/authors`, {
        params: {
          prefix: authorText.value,
          maxBins: 10
        },
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${keycloak?.token}`
        }
      })
      .then((response) => {
        authorDropdownItems.value = response.data.bins.map((b) => b.label)
      })
  } else {
    authorDropdownItems.value = []
  }
}

function addAuthor(author: string) {
  authorToMerge.value = author
  authorText.value = ''
  authorDropdownItems.value = []
}
</script>
