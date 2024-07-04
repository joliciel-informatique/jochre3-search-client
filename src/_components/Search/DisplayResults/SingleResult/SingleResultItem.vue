<template>
  <div>
    <strong>{{ $t(title) }}&nbsp;</strong>
    <span :class="{ ltr }">
      {{ value }}
    </span>
    <button @click="fixMetadata(docRef, field, value)" class="button is-small is-white">
      <span class="icon is-small fa-2xs">
        <font-awesome-icon icon="pen-to-square" />
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance, inject } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VueI18n from 'vue-i18n'

const eventBus: any = inject('eventBus')

const props = defineProps(['field', 'value', 'docRef'])

let title: string = `results.${props.field}`
title = props.field === 'titleEnglish' ? `results.alternate-title` : title
title = props.field === 'authorEnglish' ? `results.alternate-author` : title
title = props.field === 'publicationYear' ? `results.publication-year` : title

const app = getCurrentInstance()
const globalProperties = app?.appContext.config.globalProperties
const i18n: VueI18n.VueI18n | undefined = globalProperties?.$i18n as VueI18n.VueI18n
const locale = i18n?.locale

let ltr: string = locale === 'yi' ? 'ltr' : ''
ltr = props.field === 'author' ? '' : ltr

const fixMetadata = (docRef: string, field: string, value: string) =>
  eventBus.emit('fixMetadata', docRef, field, value)
</script>
