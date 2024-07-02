<template>
    <ul>
        <li v-for="(snippet, index) in snippetsWithKeys" :key="snippet.key">
            <SingleSnippet 
                :singleSnippet="snippet"
                :docRef="docRef"
                :index="index"
            />
        </li>
    </ul>
</template>

<script setup lang="ts">
import SingleSnippet from './SingleSnippet/SingleSnippet.vue';
import type { Snippet } from '@/components/Support/InterfacesExternals.vue';
import * as hash from 'object-hash'
import type { PropType } from 'vue';
const snippets = defineModel('resultSnippets', { 
    type : [Array<Snippet>] as PropType<Array<Snippet>>,
    default : [] 
})
const docRef = defineModel('docRef', { type : String })
const snippetsWithKeys = snippets.value.map(snippet => Object.defineProperty(snippet, 'key', { value : hash.sha1(snippet), enumerable : true }) )

</script>

<style lang="scss" scoped>
@import '@/assets/main.scss';
</style>