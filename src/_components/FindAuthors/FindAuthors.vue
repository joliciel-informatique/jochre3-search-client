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
  <div>
    <div class="columns" v-show="searchAuthors">
      <span class="column field has-addons has-addons-left is-horizontal">
        <div class="control dropdown is-active is-expanded">
          <div
            class="control dropdown-trigger is-expanded"
            :class="{
              'has-icons-left': showExcludeCheckbox && preferences.displayLeftToRight,
              'has-icons-right': showExcludeCheckbox && !preferences.displayLeftToRight
            }"
          >
            <input
              id="findAuthors"
              class="input"
              type="text"
              lang="yi"
              name="findAuthorInput"
              :disabled="disabled"
              v-model="authorText"
              @input="findAuthor"
              autocomplete="one-time-code"
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
                :key="sha1(author)"
                class="dropdown-item"
                @click="addAuthor(author)"
              >
                {{ author.label }}
              </a>
            </div>
          </div>
          <p class="control">
            <button
              class="button is-clickable is-medium is-info"
              @click="toggleKeyboard('findAuthors')"
              :alt="$t('search.keyboard')"
              :title="$t('search.keyboard')"
            >
              <font-awesome-icon icon="keyboard" />
            </button>
          </p>
        </div>
      </span>
    </div>
    <div
      v-if="authorList.length"
      class="column flex is-flex is-flex-direction-row is-flex-wrap-wrap"
    >
      <div v-for="author of authorList" :key="sha1(author)">
        <FilterTag
          :label="author.label"
          :count="author.count"
          :showCount="false"
          @func="delAuthor"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, type Ref } from 'vue'
import { sha1 } from 'object-hash'
import { fetchData } from '@/assets/fetchMethods'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import FilterTag from '@/_components/FilterTag/FilterTag.vue'
import { usePreferencesStore } from '@/stores/PreferencesStore'
// import SimpleKeyboard from '../SimpleKeyboard/SimpleKeyboard.vue'

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

const addAuthor = (author: { label: string; count: number }) => {
  if (!multiValue) {
    authorList.value.length = 0
  }
  authorList.value.push(author)
  authorText.value = ''
  authorDropdownItems.value = []
  simpleKeyboard.value = { show: false, attachTo: null }
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
      })
    )
  } else {
    authorDropdownItems.value = []
  }
}
</script>
