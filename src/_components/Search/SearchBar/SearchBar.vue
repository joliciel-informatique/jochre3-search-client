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
        <div class="field is-grouped columns is-vcentered p-5">
          <div class="control has-icons-left columns is-vcentered">
            <input id="query" type="text" class="input is-large has-text-light has-background-grey-dark keyboardInput" lang="yi"
              :placeholder="$t('search.query')"
              @keyup.enter="emit('search')"
              @change="({ target }: Event) => {
                query = (target as HTMLInputElement).value
                emit('search')
              }"
            />
            <span class="icon is-small is-left">
              <font-awesome-icon icon="magnifying-glass" />
            </span>
          </div>
          <div class="control column">
          <label class="checkbox is-large">
            <input type="checkbox" @change="emit('search')" />
            {{ $t('search.related-word-forms') }}
          </label>
        </div>

        </div>
      </div>
    </div>
</template>
<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
const query = defineModel('query')
const emit = defineEmits(['search'])
</script>