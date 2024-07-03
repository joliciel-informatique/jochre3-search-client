<script setup lang="ts">

</script>

<template id="SnippetText">
    <div
        v-html="snippet.text"
        class="rtl-align snippet rtl yiddish pr-2 pl-2"
        @dblclick="correctWord(SingleResult.docRef)"
      ></div>
      <div class="container is-italic has-text-weight-bold">
        {{ $t('results.word-fix-instructions') }}
      </div>
      <div class="container">
        <button
          class="button is-small is-text p-1 m-1"
          @click="toggleImageSnippet(SingleResult.docRef, index, snippet)"
        >
          <span class="icon">
            <font-awesome-icon icon="file-image" size="xs" />
          </span>
        </button>
        <button
          @click="toggleImageSnippet(SingleResult.docRef, index, snippet)"
          class="button is-text p-0 m-1"
        >
          <span>{{ $t('results.show-image-snippet') }}</span>
        </button>
        <button
          class="button is-small is-text p-1 m-1"
          @click="router.push(`/text/${SingleResult.docRef}/page/${snippet.page}`)"
        >
          <span class="icon">
            <font-awesome-icon icon="file-lines" size="xs" />
          </span>
        </button>
        <button
          @click="router.push(`/text/${SingleResult.docRef}/page/${snippet.page}`)"
          class="button is-text p-0 m-1"
        >
          <span>{{ $t('results.show-text') }}</span>
        </button>
        <a
          class="button is-small is-text p-1 m-1"
          :href="`https://archive.org/details/${SingleResult.docRef}/page/n${snippet.page}/mode/1up`"
          target="_blank"
        >
          <span class="icon" v-if="snippet.deepLink">
            <font-awesome-icon icon="book-open" size="xs" />
          </span>
        </a>
        <a
          v-if="snippet.deepLink"
          :href="snippet.deepLink"
          target="_blank"
          class="button is-text p-0 m-1"
        >
          <span>{{ $t('results.show-original-page', [snippet.page]) }}</span>
        </a>
      </div>
      <br />
      <div v-if="imageBusy.has(`${SingleResult.docRef}_${index}`)">
        <img src="/images/loading.gif" />
      </div>
      <img
        class="image-snippet"
        v-if="images.has(`${SingleResult.docRef}_${index}`)"
        :src="images.get(`${SingleResult.docRef}_${index}`)"
        title="Image"
      />

</template>