<template>
  <div
    :id="`${attachTo}-author-dropdown-list`"
    role="menu"
    v-show="authorDropdownItems.length > 0"
    class="dropdown"
    tabindex="0"
  >
    <div class="dropdown-content">
      <a
        v-for="author of authorDropdownItems"
        :key="sha1(author)"
        class="dropdown-item"
        @click="addAuthor(author)"
        @keyup.enter="addAuthor(author)"
        @keyup.space="addAuthor(author)"
        tabindex="0"
      >
        {{ author.label }}
      </a>
    </div>
  </div>
  <div v-show="authorList.length" class="columns" :id="`${attachTo}-author-tags`">
    <div class="column flex is-flex is-flex-direction-row is-flex-wrap-wrap">
      <div v-for="author of authorList" :key="sha1(author)">
        <FilterTag
          :label="author.label"
          :count="author.count"
          :showCount="false"
          :right-to-left="includeAuthor && !preferences.corpusLeftToRight"
          @func="delAuthor"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch, type Ref } from 'vue'
import { fetchData } from '@/assets/fetchMethods'
import { sha1 } from 'object-hash'
import FilterTag from '../FilterTag/FilterTag.vue'
import { usePreferencesStore } from '@/stores/PreferencesStore'

const preferences = usePreferencesStore()

const { attachTo, allowMultiple } = defineProps({
  attachTo: { type: String, required: true },
  allowMultiple: { type: Boolean, default: false }
})

const authorDropdownItems = ref<Array<{ label: string; count: number }>>([])
const authorText: Ref = defineModel('authorText')
const authorList: Ref = defineModel('authorList')
const exclude = ref('')
const includeAuthor: Ref = defineModel('includeAuthor', { default: true })
const includeAuthorInTranscription: Ref = defineModel('includeAuthorInTranscription', {
  default: true
})

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
        positionList()
        document.addEventListener('click', closeOutside, true)
        document.addEventListener('keydown', closeOnEscape, true)
      })
    )
  } else {
    authorDropdownItems.value = []
  }
}

const addAuthor = (author: { label: string; count: number }) => {
  allowMultiple ? authorList.value.push(author) : (authorList.value = [author])
  authorText.value = ''
  authorDropdownItems.value = []

  const grandParent = document.getElementById(attachTo)?.parentElement?.parentElement?.parentElement
  const selectedAuthors = document.getElementById(`${attachTo}-author-tags`) as HTMLDivElement
  if (grandParent && selectedAuthors) {
    selectedAuthors?.setAttribute('style', `position: relative`)
    grandParent.appendChild(selectedAuthors)
  }

  const origin = document.getElementById(attachTo)
  origin?.focus()
}

const delAuthor = (value: { label: string }) => {
  authorList.value = authorList.value.filter(
    (author: { label: string; count: number }) => author.label !== value.label
  )

  const origin = document.getElementById(attachTo)
  origin?.focus()
}

const positionList = () => {
  const parent = document.getElementById(attachTo)
  if (parent) {
    const { top, left, height } = parent.getBoundingClientRect()
    const list = document.getElementById(`${attachTo}-author-dropdown-list`) as HTMLDivElement
    list.setAttribute('style', `top:${top + height}px;left:${left}px;position:fixed;z-index:100`)
  }
}

const closeOutside = (e: MouseEvent) => {
  const dropdown = document.getElementById(`${attachTo}--author-dropdown-list`)
  if (
    e.target instanceof Element &&
    !dropdown?.contains(e.target) &&
    authorDropdownItems.value.length > 0
  ) {
    authorDropdownItems.value = []
    document.removeEventListener('click', closeOutside, true)
  }
}

const closeOnEscape = (e: KeyboardEvent) => {
  e.key === 'Escape' ? (authorDropdownItems.value = []) : null
  document.removeEventListener('keydown', closeOnEscape, true)
}

watch(authorText, () => findAuthor())
watch(authorList, () => positionList())

onMounted(() => positionList())
</script>
