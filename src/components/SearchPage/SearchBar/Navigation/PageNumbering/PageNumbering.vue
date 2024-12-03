<!-- PageNumbering
Parent: SearchPage.vue
Children: None
Siblings: None

Props: search, page, totalHits
Variables: lastPage (computed), isBusy (boolean, imported), hasSearch (boolean, imported)
Methods: gotoPage (local)

Description: calculates and presents page numbers
-->
<template>
  <div
    class="footerNavBar is-hidden-touch hero is-flex-direction-column is-align-items-center has-text-centered p-1 has-background-primary"
    role="navigation"
  >
    <nav
      class="pagination p-1"
      role="navigation"
      aria-label="pagination"
      tabindex="2"
      v-if="totalHits > 0 && !isBusy && hasSearch"
    >
      <div>
        <button
          @click="atTop = true"
          @keyup.enter="atTop = true"
          class="pagination-previous is-small has-text-white"
        >
          {{ $t('pagination.top') }}
        </button>
      </div>
      <div>
        <button
          @click="page--"
          @keyup.enter="page--"
          class="pagination-previous is-small"
          :class="page - 1 < 1 ? 'has-text-grey-darker' : 'has-text-white'"
          :disabled="page - 1 < 1"
        >
          {{ $t('pagination.previous') }}
        </button>
      </div>
      <div>
        <ul class="pagination-list">
          <li v-if="page - 1 > 1">
            <a
              @click="page = 1"
              @keyup.enter="page = 1"
              class="pagination-link is-small m-1 has-text-white"
              aria-label="go to page 1"
              tabindex="2"
              >1</a
            >
          </li>
          <li v-if="page - 1 > 2">
            <span class="pagination-ellipsis">&hellip;</span>
          </li>
          <li v-if="page > 1">
            <a
              class="pagination-link is-small m-1 has-text-white"
              tabindex="2"
              @click="page--"
              @keyup.enter="page--"
              :aria-label="`go to page ${page - 1}`"
              ><div class="pagination-number-ellipsis">{{ page - 1 }}</div></a
            >
          </li>
          <li>
            <a
              class="pagination-link is-current is-small m-1 has-text-white"
              :aria-label="`go to page ${page}`"
              aria-current="page"
              tabindex="2"
              ><div class="pagination-number-ellipsis">{{ page }}</div></a
            >
          </li>
          <li v-if="page < lastPage">
            <a
              @click="page++"
              @keyup.enter="page++"
              class="pagination-link is-small m-1 has-text-white"
              :aria-label="`go to page ${page + 1}`"
              tabindex="2"
              ><div class="pagination-number-ellipsis">{{ page + 1 }}</div></a
            >
          </li>
          <li v-if="page + 1 < lastPage - 1">
            <span class="pagination-ellipsis">&hellip;</span>
          </li>
          <li v-if="page + 1 < lastPage">
            <a
              v-tooltip:bottom="`Page ${lastPage}`"
              @click="page = lastPage"
              @keyup.enter="page = lastPage"
              class="pagination-link is-small m-1 has-text-white"
              :aria-label="`go to lastpage ${lastPage}`"
              tabindex="2"
              ><div class="pagination-number-ellipsis">{{ lastPage }}</div></a
            >
          </li>
        </ul>
      </div>
      <div>
        <button
          @click="page++"
          @keyup.enter="page++"
          class="pagination-next is-small m-1"
          :class="page >= lastPage ? 'has-text-grey-darker' : 'has-text-white'"
          :disabled="page >= lastPage"
        >
          {{ $t('pagination.next') }}
        </button>
      </div>
      <div>
        <button
          @click="atTop = false"
          @keyup.enter="atTop = false"
          class="pagination-previous is-small has-text-white"
        >
          {{ $t('pagination.bottom') }}
        </button>
      </div>
    </nav>
  </div>
  <nav
    class="pagination is-hidden-desktop mobile-navigation is-align-self-center"
    role="navigation"
    aria-label="pagination"
    tabindex="2"
    v-if="totalHits > 0 && !isBusy && hasSearch"
  >
    <ul class="pagination-list is-flex-wrap-nowrap">
      <li v-if="(page <= lastPage && page > 1) || (lastPage <= 5 && page > 1)">
        <a
          @click="page = 1"
          @keyup.enter="page = 1"
          class="pagination-link is-small m-1"
          aria-label="go to page 1"
          tabindex="2"
          >1</a
        >
      </li>
      <li v-if="(page >= lastPage && lastPage > 5) || (lastPage <= 5 && page - 3 >= 2)">
        <a
          class="pagination-link is-small m-1"
          tabindex="2"
          @click="page = page - 3"
          @keyup.enter="page = page - 3"
          :aria-label="`go to page ${page - 1}`"
          >{{ page - 3 }}</a
        >
      </li>
      <li v-if="(page + 1 >= lastPage && lastPage > 5) || (lastPage <= 5 && page > 3)">
        <a
          class="pagination-link is-small m-1"
          tabindex="2"
          @click="page = page - 2"
          @keyup.enter="page = page - 2"
          :aria-label="`go to page ${page - 1}`"
          >{{ page - 2 }}</a
        >
      </li>
      <li v-if="page - 1 > 1">
        <a
          class="pagination-link is-small m-1"
          tabindex="2"
          @click="page--"
          @keyup.enter="page--"
          :aria-label="`go to page ${page - 1}`"
          >{{ page - 1 }}</a
        >
      </li>
      <li>
        <a
          class="pagination-link is-current is-small m-1"
          :aria-label="`current page ${page}`"
          aria-current="page"
          tabindex="2"
          >{{ page }}</a
        >
      </li>
      <li
        v-if="
          page + 1 <= lastPage - 1 ||
          (lastPage < 5 && page + 1 <= lastPage) ||
          (lastPage < 4 && page <= lastPage)
        "
      >
        <a
          @click="page + 1 > lastPage ? null : page++"
          @keyup.enter="page++"
          class="pagination-link is-small"
          :aria-label="`go to page ${page + 1}`"
          tabindex="2"
          :disabled="page + 1 > lastPage ? true : null"
          >{{ page + 1 }}</a
        >
      </li>
      <li v-if="page < 3 || (lastPage < 3 && page + 2 > lastPage - 1)">
        <a
          @click="page + 2 > lastPage ? null : (page = page + 2)"
          @keyup.enter="page = page + 2"
          class="pagination-link is-small"
          :aria-label="`go to next page`"
          tabindex="2"
          :disabled="page + 2 > lastPage ? true : null"
          >{{ page + 2 }}</a
        >
      </li>
      <li v-if="page === lastPage - (lastPage - 1)">
        <a
          @click="page + 3 > lastPage ? null : (page = page + 3)"
          @keyup.enter="page = page + 3"
          class="pagination-link is-small"
          :aria-label="`go to next page`"
          tabindex="2"
          :disabled="page + 3 > lastPage ? true : null"
          ><div class="pagination-number-ellipsis">{{ page + 3 }}</div></a
        >
      </li>
      <li v-if="(page + 1 <= lastPage && page <= lastPage) || (lastPage < 5 && page === lastPage)">
        <a
          @click="lastPage < 5 ? null : (page = lastPage)"
          @keyup.enter="page = lastPage"
          class="pagination-link is-small"
          :aria-label="`go to lastpage ${lastPage}`"
          tabindex="2"
          :disabled="lastPage < 5 ? true : null"
          ><div class="pagination-number-ellipsis">{{ lastPage <= 5 ? 5 : lastPage }}</div></a
        >
      </li>
      <li class="ml-auto">
        <a @click="atTop = !atTop" class="pagination-link is-small m-1">
          <font-awesome-icon :icon="atTop ? 'arrow-up-1-9' : 'arrow-down-1-9'" />
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { computed, ref, watch, type Ref } from 'vue'
import { preferences } from '@/assets/fetchMethods'
import { isBusy, hasSearch } from '@/assets/appState'

const emit = defineEmits(['newPage'])
const page: Ref = defineModel('page')
const atTop = ref(true)
const totalHits: Ref = defineModel('totalHits')
const lastPage = computed(() => Math.floor((totalHits.value - 1) / preferences.resultsPerPage) + 1)

watch(atTop, (newV) => {
  const snippetDiv = document.getElementById('snippets')
  if (snippetDiv) {
    newV
      ? snippetDiv.scrollTo({ top: 0, behavior: 'instant' })
      : snippetDiv.scrollTo({ top: snippetDiv.scrollHeight, behavior: 'instant' })
  }
})

watch(page, () => emit('newPage'))
</script>
