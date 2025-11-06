<!-- IndexSize
Parent: SearchPage.vue
Children: None
Siblings: None

Props: searchResults
Variables: indexSize (number), isBusy (imported), hasSearch (imported)
Methods: fetchData

Description: presents the current indexed number of books
-->
<template>
  <div
    id="indexPage"
    class="is-flex is-flex-direction-column is-align-items-center has-text-centered"
    tabindex="-1"
  >
    <div class="is-size-5 is-size-7-mobile p-5" tabindex="-1" v-html="$t('search.about')"></div>
    <div class="is-size-5 is-size-7-mobile" tabindex="-1">
      {{ $t('search.index-size', [indexSize]) }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'
import { fetchData } from '@/assets/fetchMethods'
import { useModalStore } from '@/stores/ModalStore'
import { useSearchStore } from '@/stores/SearchStore'
import { storeToRefs } from 'pinia'

const modalStore = useModalStore()
const { notification } = storeToRefs(modalStore)
const indexSize = ref(0)

const searchStore = useSearchStore()
const { isLoading } = storeToRefs(searchStore)

onMounted(() => {
  fetchData('size', 'get', undefined, 'json')
    .then((response) =>
      response.json().then((result) => {
        indexSize.value = result.size
        isLoading.value = false
      })
    )
    .catch((error: any) => {
      notification.value = {
        error: true,
        delay: 4000,
        msg: `Failed to retrieve index: ${error.message}`
      }
    })
})
</script>
