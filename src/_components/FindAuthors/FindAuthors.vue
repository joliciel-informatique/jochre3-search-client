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
  <div class="field has-addons" v-if="searchAuthors">
    <label class="label">{{ label }}</label>
    <div class="dropdown is-active is-right">
      <div class="dropdown-trigger">
        <input
          id="findAuthors"
          class="input"
          type="text"
          v-model="authorText"
          @input="findAuthor"
          autocomplete="one-time-code"
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
            :key="sha1(author)"
            class="dropdown-item"
            @click="addAuthor(author)"
          >
            {{ author.label }}
          </a>
        </div>
      </div>
      <div class="flex is-flex flex-grow">
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
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { sha1 } from 'object-hash'
import { fetchData } from '@/assets/fetchMethods'
import FilterTag from '@/_components/Filter/FilterTag.vue'

const props = defineProps(['label', 'multivalue'])
const { label, multivalue } = props

const exclude = defineModel('exclude', { default: '' })
const authorList = defineModel<Array<{ label: string; count: number }>>('authorList', {
  default: []
})

const authorDropdownItems = ref<Array<{ label: string; count: number }>>([])
const authorText = ref<string>('')
const searchAuthors = ref<boolean>(true)

const addAuthor = (author: { label: string; count: number }) => {
  console.log(`Multivalue? ${multivalue}. Author: ${author.label}`)
  if (!multivalue) {
    authorList.value.length = 0
  }
  authorList.value.push(author)
  authorText.value = ''
  authorDropdownItems.value = []
}

const delAuthor = (value: string) => {
  authorList.value = authorList.value.filter(
    (author: { label: string; count: number }) => author.label !== value
  )
}

const findAuthor = () => {
  if (authorText.value.length > 0) {
    const params: URLSearchParams = new URLSearchParams({
      prefix: authorText.value,
      maxBins: '10'
    })
    fetchData('authors', 'get', params).then((response) =>
      response.json().then((result) => {
        authorDropdownItems.value = result.bins.filter(
          (author: { label: string; count: number }) =>
            !authorList.value.map((author) => author.label).includes(author.label)
        )
        // console.log(exclude.value)
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
