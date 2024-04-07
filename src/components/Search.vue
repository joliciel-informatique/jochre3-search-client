<script setup lang="ts">
import { ref, onMounted, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { store } from '../store.js'

const router = useRouter()
const route = useRoute()

const API_URL = inject('apiUrl')

onMounted(() => {
  getUrlQueryParams()
})

const query = ref<string>('velt')

const getUrlQueryParams = async () => {
  //router is async so we wait for it to be ready
  await router.isReady()
  //once its ready we can access the query params
  console.log(route.query)
  query.value = route.query['query'] as string
  search(false)
}

const results = ref<SearchResult[]>([])

interface Snippet {
  text: String
  start: number
  end: number
  highlights: number[][]
}

interface SearchResult {
  docRef: string
  snippets: Snippet[]
}

interface SearchResponse {
  results: SearchResult[]
}

function search(updateHistory: boolean = true) {
  axios
    .get<SearchResponse>(`${API_URL}/search`, {
      params: {
        query: query.value,
        first: '0',
        max: '10',
        'max-snippets': '20',
        'row-padding': '2'
      },
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${store.keycloakToken}`
      }
    })
    .then((response) => {
      if (updateHistory) {
        history.pushState({}, '', route.path + '?query=' + encodeURIComponent(query.value))
      }
      results.value = response.data.results
      images.value = new Map()
    })
}

const images = ref<Map<string, string>>(new Map())

function toggleImageSnippet(docRef: string, index: number, snippet: Snippet) {
  const imageKey = `${docRef}_${index}`
  if (images.value.has(imageKey)) {
    console.log(`Deleting image ${imageKey}`)
    images.value.delete(imageKey)
  } else {
    console.log(`Creating image ${imageKey}`)
    const params = new URLSearchParams()
    params.append('doc-ref', docRef)
    params.append('start-offset', `${snippet.start}`)
    params.append('end-offset', `${snippet.end}`)
    snippet.highlights.forEach((highlight) =>
      params.append('highlight', `[${highlight[0]},${highlight[1]}]`)
    )

    axios
      .get(`${API_URL}/image-snippet`, {
        params: params,
        headers: {
          accept: 'image/png',
          Authorization: `Bearer ${store.keycloakToken}`
        },
        responseType: 'arraybuffer'
      })
      .then((response) => {
        if (response.status == 200) {
          const b64 = btoa(String.fromCharCode(...new Uint8Array(response.data)))
          const imgData = 'data:' + response.headers['content-type'] + ';base64,' + b64
          images.value.set(imageKey, imgData)
        }
      })
  }
}
</script>

<template>
  <div class="container is-max-desktop">
    Query: <input v-model="query" />
    <button @click="search" class="button is-primary">Search</button>
    <ul>
      <li v-for="result of results">
        {{ result.docRef }}
        <ul>
          <li v-for="(snippet, index) in result.snippets">
            <div v-html="snippet.text" class="rtl-align yiddish"></div>
            <button
              @click="toggleImageSnippet(result.docRef, index, snippet)"
              class="button is-info"
            >
              Image
            </button>
            <img :src="images.get(`${result.docRef}_${index}`)" title="Image" />
            <hr />
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
@use 'bulma/sass/utilities/mixins';

@include mixins.touch {
  // Styles applied
  // below $desktop
}

* {
  font-family: inherit;
  text-align: inherit;
  direction: inherit;
}

/* Required for sticky footer */
html,
body {
  height: 100%;
}

body {
  background-color: #fff;
  /*font-family: 'Times New Roman', Times, serif;*/
}

h1 {
  font-size: 24px;
}

@import url('https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@300..900&display=swap');

.yiddish {
  font-family: 'Frank Ruhl Libre', serif;
  font-optical-sizing: auto;
  font-weight: 300;
  font-style: normal;
}

.title {
  font-size: 24px;
  vertical-align: top;
}

.metadata {
}

a {
  text-decoration: underline;
}

a {
  color: #000;
  text-decoration: underline;
}

a:hover {
  text-decoration: none;
  color: #ed490a;
}

.rtl-align {
  text-align: right;
  direction: rtl;
}

.rtl {
}

.ltr-align {
  text-align: left;
  direction: ltr;
  unicode-bidi: bidi-override;
}

.ltr {
}

.highlight {
  font-weight: bold;
}

.checkboxes label {
  display: block;
  float: left;
  padding-right: 10px;
  white-space: nowrap;
}

.checkboxes input {
  vertical-align: middle;
}

.checkboxes label span {
  vertical-align: middle;
}

.editImage {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.link-white a {
  color: #fff;
}

.preferences__img {
  width: 40px;
  height: 40px;
  margin: 0 10px 0 0;
  border-radius: 40px;
  overflow: hidden;
}

.rtl .preferences__img {
  margin: 0 0 0 10px;
}

/* Bootstrap RTL fixes start */

.rtl .alert-dismissible .close {
  left: 0;
  right: auto;
}

.rtl .alert {
  padding: 0.75rem 1.25rem;
}

.rtl .alert-dismissible {
  padding-left: 4rem;
}

.rtl .modal-header .close {
  margin: -1rem auto -1rem -1rem;
}

.rtl .form-check {
  padding-left: 0;
  padding-right: 1.25rem;
}

.rtl .form-check-input {
  margin-left: 0;
  margin-right: -1.25rem;
}

.rtl .modal-footer > :first-child {
  margin-left: 0.25rem;
  margin-right: 0;
}

.rtl .modal-footer > :last-child {
  margin-left: 0;
  margin-right: 0.25rem;
}

/* Bootstrap RTL fixes end */

/* Twitter typeahead start */

.input-group .twitter-typeahead {
  display: flex !important;
}

.tt-menu {
  top: calc(100% - 2px) !important;
  left: 0.5rem !important;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  box-shadow: 0px 0px 2px 0 rgba(0, 0, 0, 0.2);
  background: #eee;
  width: calc(100% - 1rem);
}

.tt-suggestion.tt-selectable {
  padding: 0.125rem 0.75rem;
  cursor: pointer;
}

.tt-suggestion.tt-selectable:hover,
.tt-suggestion.tt-selectable:focus {
  background: #ddd;
}

/* Twitter typeahead end */

/* Hacks/fixes start */

/* These settings currently don't work on pages which aren't the search page */
html[lang='en-us'] #updatePreferences {
  display: none !important;
}

/* Hacks/fixes end */

/* Pager mobile start */

@media screen and (max-width: 576px) {
  .page-first,
  .page-last,
  .page-next,
  .page-prev {
    flex-basis: 25%;
    margin-bottom: 0.5rem;
    order: -1;
  }

  .page-item {
    flex-grow: 1;
    text-align: center;
  }
}

/* Pager mobile end */
</style>
