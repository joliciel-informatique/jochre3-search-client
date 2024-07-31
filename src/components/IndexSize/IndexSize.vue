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
  <div v-if="!isBusy && !hasSearch && searchResults.length == 0">
    <div v-html="$t('search.about')"></div>
    <div>{{ $t('search.index-size', [indexSize]) }}</div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchData } from '@/assets/fetchMethods'
import { isBusy, hasSearch } from '@/assets/appState'
import { setErrorMessage } from '@/_components/Modals/ErrorNotification/ErrorNotification.vue'

defineProps(['searchResults'])

const indexSize = ref(0)

onMounted(() => {
  fetchData('size', 'get', undefined, 'json')
    .then((response) => {
      // console.log(response)
      response.json().then((result) => {
        indexSize.value = result.size
        isBusy.value = false
      })
    })
    .catch((error: any) => {
      // console.log(error)
      const msg = new Error(`Failed to retrieve index: ${error.message}`)
      setErrorMessage(msg)
    })
})
onMounted(() => {
  fetchData('size', 'get', undefined, 'json')
    .then((response) => {
      // console.log(response)
      response.json().then((result) => {
        indexSize.value = result.size
        isBusy.value = false
      })
    })
    .catch((error: any) => {
      // console.log(error)
      const msg = new Error(`Failed to retrieve index: ${error.message}`)
      setErrorMessage(msg)
    })
})
</script>
