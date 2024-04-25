<script setup lang="ts">
import { useKeycloakStore } from '@/stores/KeycloakStore'
import axios from 'axios'
import { computed, inject, ref, watch } from 'vue'

const props = defineProps(['visible', 'docRef', 'field', 'currentValue'])
const emit = defineEmits(['onCloseModal'])
const keycloak = useKeycloakStore().keycloak

const API_URL = inject('apiUrl')

const newValue = ref<string>()

const authorText = ref<string>('')
const authorDropdownItems = ref<string[]>([])
const authorToMerge = ref<string>('')
const authorSelectionMethod = ref<string>('input')

const applyEverywhere = computed(() => authorSelectionMethod.value != 'input')

const showFindAuthorDropdown = ref<boolean>(false)

function resetForm() {
  authorToMerge.value = ''
  authorSelectionMethod.value = 'input'
}

watch(
  () => props.docRef,
  async (newVal, oldVal) => {
    resetForm()
  }
)

watch(
  () => props.currentValue,
  async (newVal, oldVal) => {
    resetForm()
    newValue.value = newVal
  }
)

watch(
  () => props.field,
  async (newVal, oldVal) => {
    resetForm()
    showFindAuthorDropdown.value = newVal == 'Author' || newVal == 'AuthorEnglish'
  }
)

function onSubmit() {
  console.log('onSubmit')
  axios
    .post(
      `${API_URL}/correct-metadata`,
      {
        docRef: props.docRef,
        field: props.field,
        value: authorSelectionMethod.value == 'input' ? newValue.value : authorToMerge.value,
        applyEverywhere: applyEverywhere.value
      },
      {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${keycloak?.token}`
        }
      }
    )
    .then((response) => {
      console.log('Metadata correction made')
    })
    .catch((error) => {
      console.error(error)
    })
  emit('onCloseModal')
}

function onCancel() {
  console.log('onCancel')
  emit('onCloseModal')
}

interface AggregationBin {
  label: string
  count: number
}

interface AggregationBins {
  bins: AggregationBin[]
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

<template>
  <div class="modal" tabindex="100" :class="{ 'is-active': visible }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ $t('fix-metadata.title') }}</p>
        <button class="delete" aria-label="close" @click="onCancel"></button>
      </header>
      <section class="modal-card-body">
        <div>{{ $t('fix-metadata.instructions') }}</div>
        <div class="field has-addons">
          <label class="label">{{ $t('fix-metadata.field') }}</label
          >&nbsp;
          {{ $t(`fix-metadata.field-type.${props.field}`) }}
        </div>
        <div class="field has-addons">
          <label class="label">{{ $t('fix-metadata.current-value') }}</label
          >&nbsp;
          {{ currentValue }}
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
                  class="dropdown-item"
                  @click="addAuthor(author)"
                  >{{ author }}</a
                >
              </div>
            </div>
            &nbsp;
            {{ authorToMerge }}
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <div class="buttons">
          <button class="button is-link" @click="onSubmit">
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
