<template>
    <div class="block has-text-white custom-background has-text-weight-semibold m-0 p-0">
      <div class="container is-max-desktop">
        <div class="field has-addons pb-0 mb-0">
          <input id="query" type="text" class="input is-normal keyboardInput" lang="yi"
            :placeholder="$t('search.query')"
            @keyup="({target}: Event) => query.set((target as HTMLInputElement).value)"
            @keyup.enter="newSearch()"
            @change="newSearch()"
          />
          <button @click="newSearch()" class="button is-normal" v-if="true">
            <span class="icon is-small">
              <font-awesome-icon icon="magnifying-glass" />
            </span>
          </button>
        </div>
        <div class="control pr-2 pl-2">
          <label class="checkbox">
            <input type="checkbox" @change="newSearch()" />
            {{ $t('search.related-word-forms') }}
          </label>
        </div>
        <AdvancedSearch />
      </div>
    </div>
</template>
<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import AdvancedSearch from '@/_components/Search/AdvancedSearch/AdvancedSearch.vue'
import { query } from '@/components/SearchPage/SearchPage-variables';
import { newSearch } from '@/components/SearchPage/SearchPage-methods';
</script>