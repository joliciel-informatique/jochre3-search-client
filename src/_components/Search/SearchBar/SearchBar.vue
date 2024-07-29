<!-- SearchBar
Parent: SearchPage.vue
Children: None
Siblings: None

Props: query, newSearch
Variables: None
Methods: None

Description: presents the search bar
-->
<template>
  <div class="block has-text-white custom-background has-text-weight-semibold m-0 p-0">
    <div class="container is-max-desktop">
      <div class="field has-addons pb-0 mb-0">
        <label for="query">{{ $t('search.search') }}</label>
        <p class="control has-icons-right">
          <input
            id="query"
            type="text"
            class="input is-normal keyboardInput"
            lang="yi"
            :placeholder="$t('search.query')"
            @keyup.enter="emit('search')"
            @change="
              ({ target }: Event) => {
                query = (target as HTMLInputElement).value
                emit('search')
              }
            "
          />
          <span class="icon is-small is-right">
            <font-awesome-icon icon="magnifying-glass" />
          </span>

          <span class="icon is-small is-right">
            <i class="fas fa-check"></i>
          </span>
        </p>
      </div>
      <div class="control pr-2 pl-2">
        <label class="checkbox">
          <input type="checkbox" @change="emit('search')" />
          {{ $t('search.related-word-forms') }}
        </label>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
const query = defineModel('query')
const emit = defineEmits(['search'])
</script>
