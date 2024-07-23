<template>
    <div class="pt-0 mt-0">
        <a @click="showAdvancedSearchPanel.toggle()" class="link-white">
            <span class="m-1">{{ $t('search.advanced') }}</span>
            <span class="icon is-small m-1">
              <font-awesome-icon v-if="!showAdvancedSearchPanel.value" icon="square-plus" />
              <font-awesome-icon v-if="showAdvancedSearchPanel.value" icon="square-minus" />
            </span>
        </a>
    </div>
    <div v-if="showAdvancedSearchPanel.value" class="block custom-background-light m-0 p-0">
      <div class="container is-max-desktop">
        <p>{{ $t('search.field-instructions') }}</p>
        <FindAuthors />
        <div class="field has-addons">
        <label class="label">{{ $t('search.title') }}</label>
          <input
            id="title"
            class="input keyboardInput"
            type="text"
            lang="yi"
            :placeholder="title.value"
            v-model="title.value"
            @keyup.enter="newSearch"
          />
      </div>
      <div class="field has-addons">
        <label class="label">{{ $t('search.date-from') }}</label>
        <input
          id="fromYear"
          class="input"
          type="number"
          :placeholder="fromYear.str()"
          v-model="fromYear.value"
          min="1700"
          max="2000"
          @keyup.enter="newSearch"
        />
        <label class="label">{{ $t('search.date-to') }}</label>
        <input
          id="toYear"
          class="input"
          type="number"
          :placeholder="toYear.str()"
          v-model="toYear.value"
          min="1700"
          max="2000"
          @keyup.enter="newSearch"
        />
      </div>
      <div class="field has-addons">
        <label class="label">{{ $t('search.document-reference') }}</label>
        <input class="input" type="text" v-model="docRefs.value" @keyup.enter="search" />
      </div>
      <div class="field has-addons">
        <label class="label">{{ $t('search.sort-by') }}</label>
        <div class="select">
          <select v-model="sortBy.value">
            <option value="Score">{{ $t('search.sort.score') }}</option>
            <option value="DateAscending">{{ $t('search.sort.date-ascending') }}</option>
            <option value="DateDescending">{{ $t('search.sort.date-descending') }}</option>
          </select>
        </div>
      </div>
      <div class="field has-text-centered p-2">
        <button class="button is-light" @click="resetResults">{{ $t('search.reset') }}</button
        >&nbsp;
        <button class="button is-inverted" @click="newSearch">
          {{ $t('search.search') }}
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import FindAuthors from '@/_components/FindAuthors/FindAuthors.vue';
import { showAdvancedSearchPanel } from '@/assets/appState';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { search, resetResults, newSearch } from '@/components/SearchPage/SearchPage-methods';
import { sortBy, toYear, fromYear, title, docRefs } from '@/components/SearchPage/SearchPage-variables';
</script>