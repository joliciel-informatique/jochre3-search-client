<!-- PageNumbering
Parent: SearchPage.vue
Children: None
Siblings: None

Props: search, page, totalHits
Variables: lastPage (computed)
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
      v-if="totalHits > 0 && hasSearch"
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
          @click="changePage(page - 1)"
          @keyup.enter="changePage(page - 1)"
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
              @click="changePage(1)"
              @keyup.enter="changePage(1)"
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
              @click="changePage(page - 1)"
              @keyup.enter="changePage(page - 1)"
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
              @click="changePage(page + 1)"
              @keyup.enter="changePage(page + 1)"
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
              @click="changePage(lastPage)"
              @keyup.enter="changePage(lastPage)"
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
          @click="changePage(page + 1)"
          @keyup.enter="changePage(page + 1)"
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
      <div>
        <button class="pagination-link has-text-white" @click.prevent="tour('#snippetsTour')">
          <font-awesome-icon icon="circle-info" />
        </button>
      </div>
    </nav>
  </div>
  <nav
    class="pagination is-hidden-desktop mobile-navigation is-align-self-center"
    role="navigation"
    aria-label="pagination"
    tabindex="2"
    v-if="totalHits > 0 && hasSearch"
  >
    <ul class="pagination-list is-flex-wrap-nowrap">
      <li v-if="(page <= lastPage && page > 1) || (lastPage <= 5 && page > 1)">
        <a
          @click="changePage(1)"
          @keyup.enter="changePage(1)"
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
          @click="changePage(page - 3)"
          @keyup.enter="changePage(page - 3)"
          :aria-label="`go to page ${page - 3}`"
          >{{ page - 3 }}</a
        >
      </li>
      <li v-if="(page + 1 >= lastPage && lastPage > 5) || (lastPage <= 5 && page > 3)">
        <a
          class="pagination-link is-small m-1"
          tabindex="2"
          @click="changePage(page - 2)"
          @keyup.enter="changePage(page - 2)"
          :aria-label="`go to page ${page - 2}`"
          >{{ page - 2 }}</a
        >
      </li>
      <li v-if="page - 1 > 1">
        <a
          class="pagination-link is-small m-1"
          tabindex="2"
          @click="changePage(page - 1)"
          @keyup.enter="changePage(page - 1)"
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
          @click="page + 1 > lastPage ? null : changePage(page + 1)"
          @keyup.enter="page + 1 > lastPage ? null : changePage(page + 1)"
          class="pagination-link is-small"
          :aria-label="`go to page ${page + 1}`"
          tabindex="2"
          :disabled="page + 1 > lastPage ? true : null"
          >{{ page + 1 }}</a
        >
      </li>
      <li v-if="page < 3 || (lastPage < 3 && page + 2 > lastPage - 1)">
        <a
          @click="page + 2 > lastPage ? null : changePage(page + 2)"
          @keyup.enter="page + 2 > lastPage ? null : changePage(page + 2)"
          class="pagination-link is-small"
          :aria-label="`go to next page`"
          tabindex="2"
          :disabled="page + 2 > lastPage ? true : null"
          >{{ page + 2 }}</a
        >
      </li>
      <li v-if="page === lastPage - (lastPage - 1)">
        <a
          @click="page + 3 > lastPage ? null : changePage(page + 3)"
          @keyup.enter="page + 3 > lastPage ? null : changePage(page + 3)"
          class="pagination-link is-small"
          :aria-label="`go to next page`"
          tabindex="2"
          :disabled="page + 3 > lastPage ? true : null"
          ><div class="pagination-number-ellipsis">{{ page + 3 }}</div></a
        >
      </li>
      <li v-if="(page + 1 <= lastPage && page <= lastPage) || (lastPage < 5 && page === lastPage)">
        <a
          @click="lastPage < 5 ? null : changePage(lastPage)"
          @keyup.enter="lastPage < 5 ? null : changePage(lastPage)"
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
import { useSearchStore } from '@/stores/SearchStore'
import { storeToRefs } from 'pinia'
import { useTourStore } from '@/stores/TourStore'

const searchStore = useSearchStore()
const { page, hasSearch } = storeToRefs(searchStore)
const emit = defineEmits(['newPage'])

const atTop = ref(true)
const totalHits: Ref = defineModel('totalHits')
const lastPage = computed(() => Math.floor((totalHits.value - 1) / preferences.resultsPerPage) + 1)

const { tour } = useTourStore()

const changePage = (pageNumber: number) => {
  page.value = pageNumber
  emit('newPage')
}

watch(atTop, (newV) => {
  const snippetDiv = document.getElementById('snippets')
  if (snippetDiv) {
    newV
      ? snippetDiv.scrollTo({ top: 0, behavior: 'instant' })
      : snippetDiv.scrollTo({ top: snippetDiv.scrollHeight, behavior: 'instant' })
  }
})
</script>
