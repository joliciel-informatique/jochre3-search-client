<template>
  <div class="notification is-danger" v-if="showErrorNotification.value">
    <button class="delete" @click="showErrorNotification.false()"></button>
    {{ $t('error') }}
  </div>
  <div>
    <SearchBar />
    <div class="container is-max-desktop hero search-content">
      <IndexSize />
      <FacetDisplay />
      <PageNumbering />
      <KeepAlive>
        <DisplayResults :is="DisplayResults"/>
      </KeepAlive>
      <PageNumbering />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  // import { defineSearchParams, search } from './methods/searchPage-methods'

  // Import sub-components
  import DisplayResults from '@/_components/Search/DisplayResults/DisplayResults.vue'
  import PageNumbering from '@/_components/PageNumbering/PageNumbering.vue'
  import SearchBar from '@/_components/Search/SearchBar/SearchBar.vue'
  import FacetDisplay from '@/_components/DisplayFacets/DisplayFacets.vue'
  import IndexSize from '@/components/IndexSize/IndexSize.vue'

  // Import assets and variables
  import { showAdvancedSearchPanel, showErrorNotification } from '@/assets/appState'
  import { query, relatedWordForms, page, sortBy, docRefs, toYear, fromYear, title } from './SearchPage-variables'
  import { search } from './SearchPage-methods'
  import { authorInclude, authors } from '@/_components/FindAuthors/FindAuthors-methods'

  // Configure icons
  import { library } from '@fortawesome/fontawesome-svg-core'
  import {
    faMagnifyingGlass,
    faFileImage,
    faSquarePlus,
    faSquareMinus,
    faBookOpen,
    faFileLines,
    faPenToSquare
  } from '@fortawesome/free-solid-svg-icons'
  library.add(
    faMagnifyingGlass,
    faFileImage,
    faSquarePlus,
    faSquareMinus,
    faBookOpen,
    faFileLines,
    faPenToSquare
  )

  // Startup variables: may move to App.vue or HomeView.vue
  const router = useRouter()
  const route = useRoute()

  onMounted(() => {
    router.isReady().then(() => {
      if (route.query['query']) query.set((route.query['query'] as string).trim())
      if (route.query['strict']) relatedWordForms.value = route.query['strict'] !== 'true'
      if (route.query['page']) page.value = Number(route.query['page'])
      if (route.query['authorInclude']) authorInclude.true()
      if (route.query['title']) title.value = (route.query['title'] as string).trim()
      if (route.query['from-year'])
        fromYear.value = Number((route.query['from-year'] as string).trim())
      if (route.query['to-year']) toYear.value = Number((route.query['to-year'] as string).trim())
      if (route.query['doc-refs']) docRefs.value = (route.query['doc-refs'] as string).trim()
      if (route.query['sort']) sortBy.value = (route.query['sort'] as string).trim()
      // if (route.query['authors'] && Array.isArray(route.query['authors']))
      //   authors.value = route.query['authors'] as string[]
      // if (route.query['authors'] && !Array.isArray(route.query['authors']))
      //   authors.value = [route.query['authors'] as string]

      showAdvancedSearchPanel.value =
        authors.value.length > 0 ||
        title.value.length > 0 ||
        (fromYear.value != null && fromYear.value > 0) ||
        (toYear.value != null && toYear.value > 0) ||
        docRefs.value.length > 0 ||
        (sortBy.value.length > 0 && sortBy.value != 'Score')

      const stylesheet = document.createElement('link')
      stylesheet.type = 'text/css'
      stylesheet.rel = 'stylesheet'
      document.head.appendChild(stylesheet)

      stylesheet.href = '/css/keyboard.css'

      const plugin = document.createElement('script')
      plugin.type = 'module'

      document.head.appendChild(plugin)

      plugin.src = '/js/keyboard.js'
      plugin.async = true

      search()
    })
  })

</script>

<style lang="scss" scoped>
@import '@/assets/main.scss';
</style>