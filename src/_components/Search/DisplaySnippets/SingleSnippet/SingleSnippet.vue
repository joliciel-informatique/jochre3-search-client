<template>
  <div
    v-html="snippet.text"
    class="rtl-align snippet rtl yiddish pr-2 pl-2"
    @dblclick="getSelectedWord(docRef, snippet.page, snippet.text)"
  ></div>
  <div class="container is-italic has-text-weight-bold">
    {{ $t('results.word-fix-instructions') }}
  </div>
  <div class="container">
    <button class="button is-small is-text p-1 m-1" @click="toggleImageSnippet(docRef, reference, snippet.start, snippet.end, snippet.highlights)">
      <span class="icon">
        <font-awesome-icon icon="file-image" size="xs" />
      </span>
    </button>
    <button class="button is-text p-0 m-1" @click="toggleImageSnippet(docRef, reference, snippet.start, snippet.end, snippet.highlights)">
      <span>{{ $t('results.show-image-snippet') }}</span>
    </button>
    <button
      class="button is-small is-text p-1 m-1"
      @click="router.push(`/text/${docRef}/page/${snippet.page}`)"
    >
      <span class="icon">
        <font-awesome-icon icon="file-lines" size="xs" />
      </span>
    </button>
    <button
      class="button is-text p-0 m-1"
      @click="router.push(`/text/${docRef}/page/${snippet.page}`)"
    >
      <span>{{ $t('results.show-text') }}</span>
    </button>
    <a class="button is-small is-text p-1 m-1" :href="url" target="_blank">
      <span class="icon" v-if="snippet.deepLink">
        <font-awesome-icon icon="book-open" size="xs" />
      </span>
    </a>
    <a class="button is-text p-0 m-1" v-if="snippet.deepLink" :href="snippet.deepLink" target="_blank">
      <span>{{ $t('results.show-original-page', [snippet.page]) }}</span>
    </a>
  </div>
  <br />
  <div v-if="imageBusy.value.has(reference)">
    <img src="/images/loading.gif" />
  </div>
  <img
    class="image-snippet"
    v-if="images.value.has(reference)"
    :src="images.value.get(reference)"
    title="Image"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { images, imageBusy } from '@/components/SearchPage/SearchPage-variables';
import { getSelectedWord, toggleImageSnippet } from './SingleSnippet-methods';
import { cacheWordImages } from '@/_components/Modals/FixWord/FixWord-methods';

const router = useRouter()

const { snippet, docRef, index, url } = defineProps(['snippet', 'docRef', 'index', 'url'])

cacheWordImages(docRef, snippet.page, snippet.highlights)

const reference = computed(() => `${docRef}_${index}`)
</script>
