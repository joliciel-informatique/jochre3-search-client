<template>
    <div class="field has-addons" v-if="searchAuthors.value">
        <label class="label">{{ $t('search.author') }}</label>
        <div class="dropdown is-active is-right">
            <div class="dropdown-trigger">
                <input
                    id="findAuthors"
                    class="input"
                    type="text"
                    v-model="authorText"
                    @input="findAuthors"
                />
            </div>
            <div
                class="dropdown-menu"
                id="dropdown-menu"
                role="menu"
                v-if="authorDropdownItems.value.length > 0"
            >
                <div class="dropdown-content">
                    <a
                        v-for="author of authorDropdownItems.value"
                        :key="sha1(author)"
                        class="dropdown-item"
                        @click="addAuthor(author)"
                        >
                        {{ author.label }}
                    </a>
                </div>
            </div>
            <div v-for="author of authorList.value" :key="sha1(author)">
                <FilterTag :label="author.label" :count="author.count" :showCount="false" @delFn="delAuthor" />
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
    import FilterTag from '@/_components/Filter/FilterTag.vue';
    import { sha1 } from 'object-hash';
    import { authorList, authorDropdownItems, authorText, searchAuthors } from './FindAuthors-variables';
    import { addAuthor, delAuthor, findAuthors } from './FindAuthors-methods';
</script>