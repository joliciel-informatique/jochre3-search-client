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
    <div v-html="$t('search.about')"></div>
    <div>{{ $t('search.index-size', [indexSize]) }}</div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'
import { fetchData } from '@/assets/fetchMethods'
// import { setErrorMessage } from '@/_components/Modals/ErrorNotification/ErrorNotification.vue'

const isLoading: Ref = defineModel('isLoading')

const indexSize = ref(0)

onMounted(() => {
  fetchData('size', 'get', undefined, 'json')
    .then((response) => {
      response.json().then((result) => {
        indexSize.value = result.size
        isLoading.value = false
      })
    })
    .catch((error: any) => {
      const msg = new Error(`Failed to retrieve index: ${error.message}`)
      // setErrorMessage(msg)
    })
})
</script>
