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
  <div>
    <div class="is-size-5 p-5" v-html="$t('search.about')"></div>
    <div class="is-size-5">{{ $t('search.index-size', [indexSize]) }}</div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'
import { fetchData } from '@/assets/fetchMethods'

const isLoading: Ref = defineModel('isLoading')
const notification: Ref = defineModel('notification')

const indexSize = ref(0)

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
        show: true,
        error: true,
        delay: 4000,
        msg: `Failed to retrieve index: ${error.message}`
      }
    })
})
</script>
