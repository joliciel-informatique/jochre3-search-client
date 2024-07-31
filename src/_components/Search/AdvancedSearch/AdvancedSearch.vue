<!-- AdvancedSearch
Parent: SearchPage.vue
Children: FindAuthors
Siblings: None

NOTES: Local implementation for fade transition based on https://www.telerik.com/blogs/how-to-trap-focus-modal-vue-3

Props: search, resetSearchResults, newSearch, sortBy, toYear, fromYear, title, docRefs
Variables: None
Methods: None

Description: the advanced search toolbox
-->
<template>
  <div ref="trapRef">
    <transition name="fade">
      <div
        v-if="showAdvancedSearchPanel"
        class="modal-background"
        @click="showAdvancedSearchPanel = false"
      ></div>
    </transition>
    <transition name="slide-fade">
      <div
        v-show="showAdvancedSearchPanel"
        class="modal-card m-1 p-3"
        @keydown.esc="showAdvancedSearchPanel = false"
      >
        <div class="container is-max-desktop">
          <FindAuthors
            v-model:authorList="authorList"
            :label="$t('search.author')"
            :multivalue="true"
          />
          <div class="grid has-addons">
            <label class="label">{{ $t('search.title') }}:</label>
            <input
              id="title"
              class="input keyboardInput"
              type="text"
              lang="yi"
              :placeholder="$t('search.title')"
              v-model="title"
              @keyup.enter="emit('search')"
            />
          </div>
          <div class="field has-addons">
            <label class="label">{{ $t('search.date-from') }}</label>
            <input
              id="fromYear"
              class="input"
              type="number"
              placeholder="1700"
              v-model="fromYear"
              min="1700"
              max="2000"
            />
            <label class="label">{{ $t('search.date-to') }}</label>
            <input
              id="toYear"
              class="input"
              type="number"
              placeholder="2000"
              v-model="toYear"
              min="1700"
              max="2000"
            />
          </div>
          <div class="field has-addons">
            <label class="label">{{ $t('search.document-reference') }}</label>
            <input class="input" type="text" v-model="docRefs" />
          </div>
          <div class="field has-addons">
            <label class="label">{{ $t('search.sort-by') }}</label>
            <div class="select">
              <select v-model="sortBy">
                <option value="Score">{{ $t('search.sort.score') }}</option>
                <option value="DateAscending">{{ $t('search.sort.date-ascending') }}</option>
                <option value="DateDescending">{{ $t('search.sort.date-descending') }}</option>
              </select>
            </div>
          </div>
          <p>{{ $t('search.field-instructions') }}</p>
          <div class="field has-text-centered p-2">
            <button class="button is-light" @click="emit('resetSearchResults')">
              {{ $t('search.reset') }}
            </button>
            &nbsp;
            <button class="button is-inverted" @click="emit('search')">
              {{ $t('search.search-button') }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script setup lang="ts">
import FindAuthors from '@/_components/FindAuthors/FindAuthors.vue'
import useFocusTrap from '@/composables/useFocusTrap'

const { trapRef } = useFocusTrap()

const emit = defineEmits(['search', 'resetSearchResults'])

const showAdvancedSearchPanel = defineModel('showAdvancedSearchPanel')
const authorList = defineModel<Array<{ label: string; count: number }>>('authorList')
const title = defineModel('title')
const fromYear = defineModel('fromYear')
const toYear = defineModel('toYear')
const docRefs = defineModel('docRefs')
const sortBy = defineModel('sortBy')

// const togglePanel = () => {
//   showAdvancedSearchPanel.value = !showAdvancedSearchPanel.value
// }
</script>

<!-- Transition styles -->
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease-in-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(2rem);
  opacity: 0;
}
</style>

<!-- Modal styles -->
<style module>
.overlay {
  background: rgba(0, 0, 0, 0.9);
  position: fixed;
  inset: 0;
  z-index: 0;
}

.modalContainer {
  position: fixed;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  /* width: 25rem; */
  /* margin: 0 auto; */
  /* padding: 2rem; */
  /* z-index: 10; */
  /* background-color: white; */
  /* transform: translateY(-2rem); */
}

.formHeadline {
  font-size: 1.6rem;
  margin-bottom: 2rem;
}

.formRow {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.formRow label {
  margin-bottom: 0.5rem;
  display: block;
  width: 100%;
  text-align: left;
  flex-basis: 100%;
}

.formRow input {
  flex-basis: 100%;
  padding: 0.5rem 0.75rem;
}

.formActions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
}
</style>
