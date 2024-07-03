<template>
    <div v-if="field !== 'key'">
        <strong>{{ $t(title) }}</strong>
        <span :class="{ ltr: $i18n.locale === 'yi', english: $i18n.locale === 'yi' }">
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
import { inject } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const eventBus : any = inject('eventBus')

const field = defineModel('field', { default : '' })
const value = defineModel('value', { default : '' })
const docRef = defineModel('docRef', { default : '' })

let title : string = `results.alternate-${field.value}`
title = (field.value === 'publisher') ? `results.${field.value}` : title
title = (field.value === 'publicationYear') ? `results.publication-year` : title

const fixMetadata = (docRef : string, field : string, value : string) => eventBus.emit('fixMetadata', docRef, field, value)
</script>