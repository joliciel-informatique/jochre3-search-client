<template>
  <div
    :id="`${attachTo}-author-dropdown-list`"
    role="menu"
    v-show="authorDropdownItems.length > 0"
    class="dropdown"
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
  <div v-if="authorList.length" class="columns">
    <div class="column is-2"></div>
    <div
      :id="`${attachTo}-author-tags`"
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
import { fetchData } from '@/assets/fetchMethods'
import { sha1 } from 'object-hash'
import FilterTag from '../FilterTag/FilterTag.vue'

const authorDropdownItems = ref<Array<{ label: string; count: number }>>([])
const authorText: Ref = defineModel('authorText')
const authorList: Ref = defineModel('authorList')
const exclude = ref('')

const addAuthor = (author: { label: string; count: number }) => {
  authorList.value.push(author)
  authorText.value = ''
  authorDropdownItems.value = []
}

const { attachTo } = defineProps(['attachTo'])
watch(authorText, () => findAuthor())
watch(authorList, () => positionList())

const positionList = () => {
  const parent = document.getElementById(attachTo)
  if (parent) {
    const { top, left, height } = parent.getBoundingClientRect()
    const list = document.getElementById(`${attachTo}-author-dropdown-list`) as HTMLDivElement
    list.setAttribute('style', `top:${top + height}px;left:${left}px;position:fixed;z-index:100`)
  }
}

const includeAuthor: Ref = defineModel('includeAuthor', { default: true })
const includeAuthorInTranscription: Ref = defineModel('includeAuthorInTranscription', {
  default: true
})

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

const delAuthor = (value: { label: string }) => {
  authorList.value = authorList.value.filter(
    (author: { label: string; count: number }) => author.label !== value.label
  )
}
</script>
