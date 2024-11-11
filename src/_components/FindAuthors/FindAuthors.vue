<!-- FindAuthors
Parents: AdvancedSearch.vue, FixMetaData.vue
Children: FilterTag
Siblings: None

Props: None
Variables: lastPage (computed), isBusy (boolean, imported), hasSearch (boolean, imported)
Methods: gotoPage (local)

NOTE: 
- outputs results in v-model authorList of <Array<{ label : string, count : number }>>
- passing exclude property allows excluding of a string from the authorList

Description: presents a 'search for authors' text box and retrieves authors every key press.
-->
<template>
  <span class="columns is-mobile is-vcentered mt-1 p-1">
    <p class="column is-2 is-flex is-desktop is-flex-grow-1 has-text-white">
      {{ $t('search.author') }}
    </p>
    <span
      class="column is-flex-grow-2 field has-addons has-addons-left is-horizontal"
      :aria-label="$t('search.author')"
    >
      <span
        class="control is-expanded dropdown is-active field has-addons has-addons-left is-horizontal"
        v-show="searchAuthors"
      >
        <span
          class="control is-expanded dropdown-trigger"
          :class="{
            'has-icons-left': showExcludeCheckbox && preferences.displayLeftToRight,
            'has-icons-right': showExcludeCheckbox && !preferences.displayLeftToRight
          }"
        >
          <input
            :id="uniqueId"
            class="input"
            type="text"
            lang="yi"
            name="findAuthorInput"
            v-model="authorText"
            :disabled="disabled"
            :placeholder="$t('search.authorPlaceholder')"
          />
          <div
            v-if="showExcludeCheckbox"
            class="control icon is-small"
            :class="{
              'is-left': preferences.displayLeftToRight,
              'is-right': !preferences.displayLeftToRight
            }"
            v-tooltip:bottom.tooltip="$t('search.excludeAuthors')"
          >
            <input
              type="checkbox"
              class="is-clickable"
              name="findAuthorCheckbox"
              :disabled="disabled"
              @click="excludeAuthors"
            />
          </div>
        </span>
        <span
          class="dropdown-menu"
          :ipd="`${uniqueId}-dropdown-menu`"
          role="menu"
          v-if="authorDropdownItems.length > 0"
        >
          <div class="dropdown-content">
            <a
              v-for="author of authorDropdownItems"
              :key="sha1(author)"
              class="dropdown-item"
              @click="addAuthor(author)"
            >
              {{ author.label }}
            </a>
          </div>
        </span>
        <p class="control keyboardButton">
          <button
            class="button is-clickable is-medium"
            @click="toggleKeyboard(uniqueId)"
            :alt="$t('search.keyboard')"
            :title="$t('search.keyboard')"
          >
            <font-awesome-icon icon="keyboard" />
          </button>
        </p>
      </span>
    </span>
  </span>
  <span class="columns is-mobile is-vcentered mt-1 p-1" v-if="authorList.length">
    <p class="column is-2 is-flex is-desktop is-flex-grow-1 has-text-white"></p>
    <span class="column is-flex is-flex-grow-2 is-flex-wrap-nowrap is-justify-content-flex-start">
      <div v-for="author of authorList" :key="sha1(author)">
        <FilterTag
          :label="author.label"
          :count="author.count"
          :showCount="false"
          @func="delAuthor"
        />
      </div>
    </span>
  </span>
</template>
<script setup lang="ts">
import { ref, watch, type Ref } from 'vue'
import { sha1 } from 'object-hash'
import { fetchData } from '@/assets/fetchMethods'
import FilterTag from '@/_components/FilterTag/FilterTag.vue'
import { usePreferencesStore } from '@/stores/PreferencesStore'

const preferences = usePreferencesStore()

const { multiValue, uniqueId, showExcludeCheckbox } = defineProps([
  'multiValue',
  'uniqueId',
  'showExcludeCheckbox'
])

const simpleKeyboard: Ref = defineModel('simpleKeyboard')

const toggleKeyboard = (attachTo: string) => {
  simpleKeyboard.value.attachTo = attachTo
  simpleKeyboard.value.show = !simpleKeyboard.value.show
  simpleKeyboard.value.ref = authorText
}

const disabled: Ref = defineModel('disabled')
const includeAuthor: Ref = defineModel('includeAuthor', { default: true })
const includeAuthorInTranscription: Ref = defineModel('includeAuthorInTranscription', {
  default: true
})

const exclude = defineModel('exclude', { default: '' })
const excludeFromSearch = defineModel('excludeFromSearch')
const authorList: Ref = defineModel('authorList')

const authorDropdownItems = ref<Array<{ label: string; count: number }>>([])
const authorText = ref<string>('')
const searchAuthors = ref<boolean>(true)

watch(authorText, () => findAuthor())

const closeOutside = () => {
  const dropdown = document.getElementById(`${uniqueId}-dropdown-menu`)
  const menu = dropdown?.children[0]
  if (menu) authorDropdownItems.value = []
  document.removeEventListener('click', closeOutside, true)
}

const closeOnEscape = (e: KeyboardEvent) => {
  e.key === 'Escape' ? (authorDropdownItems.value = []) : null
  document.removeEventListener('keydown', closeOnEscape, true)
}

const addAuthor = (author: { label: string; count: number }) => {
  if (!multiValue) {
    authorList.value.length = 0
  }
  authorList.value.push(author)
  authorText.value = ''
  authorDropdownItems.value = []

  simpleKeyboard.value.attachTo = null
  simpleKeyboard.value.ref = null
  simpleKeyboard.value.show = false
}

const delAuthor = (value: { label: string }) => {
  authorList.value = authorList.value.filter(
    (author: { label: string; count: number }) => author.label !== value.label
  )
}

const excludeAuthors = () => (excludeFromSearch.value = !excludeFromSearch.value)

const findAuthor = () => {
  if (authorText.value.length > 0) {
    const params: URLSearchParams = new URLSearchParams({
      prefix: authorText.value,
      maxBins: '10',
      includeAuthor: includeAuthor.value,
      includeAuthorInTranscription: includeAuthorInTranscription.value
    })
    fetchData('authors', 'get', params).then((response) =>
      response.json().then((result) => {
        authorDropdownItems.value = result.bins.filter(
          (author: { label: string; count: number }) =>
            !authorList.value
              .map((author: { label: string }) => author.label)
              .includes(author.label)
        )
        if (exclude.value) {
          authorDropdownItems.value = authorDropdownItems.value.filter(
            (author: { label: string; count: number }) => author.label !== exclude.value
          )
        }
        document.addEventListener('click', closeOutside, true)
        document.addEventListener('keydown', closeOnEscape, true)
      })
    )
  } else {
    authorDropdownItems.value = []
  }
}
</script>
