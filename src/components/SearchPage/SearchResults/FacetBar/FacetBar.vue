<!-- DisplayFacets
Parent: SearchPage.vue
Children: None
Siblings: None

Props: updateSearch, resetSearchResults, searchResults, facets
Variables: None
Methods: None

Description: presents the facet bar
-->
<template>
  <!-- <div class="facetColumn column is-2 is-hidden-touch"> -->
  <div
    class="box table-of-contents is-flex is-flex-direction-column facets menu is-hidden-touch"
    :class="preferences.displayLeftToRight ? 'right' : 'left'"
    role="navigation"
    tabindex="1"
  >
    <AccordionCard :showing="showing">
      <template #header>
        <p class="menu-label is-size-5 label">
          {{ $t('facets.title') }}
          <span v-tooltip:top="$t('search.what-are-facets')">
            <font-awesome-icon icon="question-circle" />
          </span>
        </p>
      </template>
      <template #content>
        <div class="is-flex is-flex-direction-column">
          <div class="columns is-vcentered m-1">
            <div class="column is-8 is-size-7">
              <span
                class=""
                :class="preferences.displayLeftToRight ? 'has-text-left' : 'has-text-right'"
              >
                <p>{{ $t('search.display-number-of-author-facets') }}</p>
              </span>
            </div>
            <div class="column is-4 is-size-7">
              <div class="dropdown is-hoverable">
                <div class="dropdown-trigger">
                  <button class="button py-0" aria-haspopup="true" aria-controls="dropdown-menu">
                    <span>{{ authorFacetCount > 0 ? authorFacetCount : 'all' }}</span>
                    <span class="icon is-small">
                      <font-awesome-icon icon="angle-down" aria-hidden="true" />
                    </span>
                  </button>
                </div>
                <div class="dropdown-menu" id="author-facet-dropdown-menu" role="menu">
                  <div class="dropdown-content left">
                    <div v-for="val of facetCount" :key="val">
                      <a
                        class="dropdown-item"
                        :class="val === authorFacetCount ? 'is-active' : ''"
                        href="#"
                        @click.prevent="updateFacetCount(val)"
                        >{{ val }}</a
                      >
                    </div>
                    <hr class="dropdown-divider" />
                    <a href="#" @click.prevent="updateFacetCount(0)" class="dropdown-item">{{
                      $t('facets.facet-count-all')
                    }}</a>
                    <hr class="dropdown-divider" />
                    <div class="dropdown-item">
                      <input
                        type="number"
                        min="1"
                        max="100"
                        v-model="authorFacetCount"
                        @input="preferences.authorFacetCount = authorFacetCount"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="columns is-vcentered m-1">
            <div class="column is-8 is-size-7">
              <span
                class=""
                :class="preferences.displayLeftToRight ? 'has-text-left' : 'has-text-right'"
              >
                {{ $t('facets.sort-by-label') }}</span
              >
            </div>
            <div class="column is-4 is-size-7">
              <div class="dropdown is-hoverable">
                <div class="dropdown-trigger">
                  <button class="button py-0" aria-haspopup="true" aria-controls="dropdown-menu">
                    <span v-if="preferences.displayLeftToRight">
                      <span>{{ $t('facets.most-hits') }}</span>
                      <span class="icon is-small">
                        <font-awesome-icon icon="angle-down" aria-hidden="true" />
                      </span>
                    </span>
                    <span v-else>
                      <span class="icon is-small">
                        <font-awesome-icon icon="angle-down" aria-hidden="true" />
                      </span>
                      <span>{{ $t('facets.most-hits') }}</span>
                    </span>
                  </button>
                </div>
                <div class="dropdown-menu" id="author-facet-dropdown-menu" role="menu">
                  <div class="dropdown-content left">
                    <a
                      href="#"
                      @click.prevent="updateSortOption('count')"
                      class="dropdown-item"
                      :class="facetSortBy === 'count' ? 'is-active' : ''"
                      >{{ $t('facets.most-hits') }}</a
                    >
                    <a
                      href="#"
                      @click.prevent="updateSortOption('active')"
                      class="dropdown-item"
                      :class="facetSortBy === 'active' ? 'is-active' : ''"
                      >{{ $t('facets.active-facets') }}</a
                    >
                    <a
                      href="#"
                      @click.prevent="updateSortOption('label')"
                      :class="facetSortBy === 'label' ? 'is-active' : ''"
                      class="dropdown-item"
                      >{{ $t('facets.by-name') }}</a
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <span>
              <p class="pb-3">
                <input
                  class="input mb-2"
                  v-model="filterValue"
                  type="text"
                  :placeholder="$t('search.filter')"
                />
                <span class="menu-label p-2" v-if="filterValue !== undefined">
                  {{ $t('search.relevant-facets', [filteredFacets?.length]) }}
                </span>
              </p>
            </span>
          </div>
        </div>
        <div
          class="facet-list is-flex is-flex-direction-column is-flex-wrap-nowrap is-align-items-center"
        >
          <span v-for="facet of filteredFacets" v-bind:key="sha1(facet)">
            <FilterTag
              :label="facet.label"
              :count="facet.count"
              :active="facet.active"
              :showCount="true"
              :right-to-left="!preferences.corpusLeftToRight"
              @func="toggleFacet(facet)"
            />
          </span>
        </div>
      </template>

      <template #footer>
        <div class="columns">
          <span
            class="column footer-icon p-2 is-small has-text-centered is-clickable"
            :class="{ rotate: !showing }"
            @click="toggle()"
          >
            <font-awesome-icon icon="circle-chevron-up" size="lg" />
          </span>
        </div>
      </template>
    </AccordionCard>
  </div>

  <div v-show="openMobileFacets" class="menu is-flex is-flex-direction-column is-hidden-desktop">
    <div>
      <p class="menu-label is-size-5 label">
        {{ $t('facets.title') }}
        <span v-tooltip:top="$t('search.what-are-facets')">
          <font-awesome-icon icon="question-circle" />
        </span>
      </p>
    </div>
    <div class="is-flex is-flex-direction-column">
      <div class="columns is-vcentered m-1">
        <div class="column is-8 is-size-7">
          <span
            class=""
            :class="preferences.displayLeftToRight ? 'has-text-left' : 'has-text-right'"
          >
            <p>{{ $t('search.display-number-of-author-facets') }}</p>
          </span>
        </div>
        <div class="column is-4 is-size-7">
          <div class="dropdown is-hoverable">
            <div class="dropdown-trigger">
              <button class="button py-0" aria-haspopup="true" aria-controls="dropdown-menu">
                <span>{{ authorFacetCount > 0 ? authorFacetCount : 'all' }}</span>
                <span class="icon is-small">
                  <font-awesome-icon icon="angle-down" aria-hidden="true" />
                </span>
              </button>
            </div>
            <div class="dropdown-menu" id="author-facet-dropdown-menu" role="menu">
              <div class="dropdown-content left">
                <div v-for="val of facetCount" :key="val">
                  <a
                    class="dropdown-item"
                    :class="val === authorFacetCount ? 'is-active' : ''"
                    href="#"
                    @click.prevent="updateFacetCount(val)"
                    >{{ val }}</a
                  >
                </div>
                <hr class="dropdown-divider" />
                <a href="#" @click.prevent="updateFacetCount(0)" class="dropdown-item">{{
                  $t('facets.facet-count-all')
                }}</a>
                <hr class="dropdown-divider" />
                <div class="dropdown-item">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    v-model="authorFacetCount"
                    @input="preferences.authorFacetCount = authorFacetCount"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="columns is-vcentered m-1">
        <div class="column is-8 is-size-7">
          <span
            class=""
            :class="preferences.displayLeftToRight ? 'has-text-left' : 'has-text-right'"
          >
            {{ $t('facets.sort-by-label') }}</span
          >
        </div>
        <div class="column is-4 is-size-7">
          <div class="dropdown is-hoverable">
            <div class="dropdown-trigger">
              <button class="button py-0" aria-haspopup="true" aria-controls="dropdown-menu">
                <span>{{ $t('facets.most-hits') }}</span>
                <span class="icon is-small">
                  <font-awesome-icon icon="angle-down" aria-hidden="true" />
                </span>
              </button>
            </div>
            <div class="dropdown-menu" id="author-facet-dropdown-menu" role="menu">
              <div class="dropdown-content left">
                <a
                  href="#"
                  @click.prevent="updateSortOption('count')"
                  class="dropdown-item"
                  :class="facetSortBy === 'count' ? 'is-active' : ''"
                  >{{ $t('facets.most-hits') }}</a
                >
                <a
                  href="#"
                  @click.prevent="updateSortOption('active')"
                  class="dropdown-item"
                  :class="facetSortBy === 'active' ? 'is-active' : ''"
                  >{{ $t('facets.active-facets') }}</a
                >
                <a
                  href="#"
                  @click.prevent="updateSortOption('label')"
                  :class="facetSortBy === 'label' ? 'is-active' : ''"
                  class="dropdown-item"
                  >{{ $t('facets.by-name') }}</a
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <span>
        <p class="pb-3">
          <input
            class="input mb-2"
            v-model="filterValue"
            type="text"
            :placeholder="$t('search.filter')"
          />
          <span class="menu-label p-2" v-if="filterValue !== undefined">
            {{ $t('search.relevant-facets', [filteredFacets?.length]) }}
          </span>
        </p>
      </span>
      <div
        class="facet-list is-flex is-flex-direction-column is-justify-content-center is-flex-wrap-wrap is-align-items-center"
      >
        <span v-for="facet of filteredFacets" :key="sha1(facet)">
          <FilterTag
            :label="facet.label"
            :count="facet.count"
            :active="facet.active"
            :showCount="true"
            :right-to-left="!preferences.corpusLeftToRight"
            @func="toggleFacet(facet)"
          />
        </span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch, type Ref } from 'vue'
import FilterTag from '@/_components/FilterTag/FilterTag.vue'
import { sha1 } from 'object-hash'
import type { AggregationBin } from '@/assets/interfacesExternals'
import { usePreferencesStore } from '@/stores/PreferencesStore'
import { insertInSortedArray } from '@/assets/functions'
import AccordionCard from '@/_components/AccordionCard/AccordionCard.vue'
import { convertTypeAcquisitionFromJson } from 'typescript'

const preferences = usePreferencesStore()
const defaultFacetCount = [5, 10, 15, 20]

const toggle = () => (showing.value = !showing.value)

const showing = ref(true)

const facets: Ref = defineModel<AggregationBin[]>('facets')
const openMobileFacets = defineModel('openMobileFacets')

const authorFacetCount = ref(preferences.authorFacetCount)
const facetSortBy = ref(preferences.facetSortBy)
const facetCount = ref(defaultFacetCount)
const filteredFacets = ref()
const filterValue = ref(undefined)
const emit = defineEmits(['newSearch'])

onMounted(() => (filteredFacets.value = facets.value))

// Set user preferences from dropdown options
const updateFacetCount = (val: number) => {
  authorFacetCount.value = val
  preferences.authorFacetCount = authorFacetCount.value
  preferences.save()
}

const updateSortOption = (val: string) => {
  facetSortBy.value = val
  preferences.facetSortBy = facetSortBy.value
  preferences.save()
}

// Update the facet list based on a filter
const updateFilter = (val: string) => {
  filteredFacets.value = facets.value
    .map((facet: AggregationBin) => (facet.label.includes(val) ? facet : null))
    .filter((x: AggregationBin) => x)
}

watch(facetSortBy, (newV) => {
  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })
  if (newV === 'count')
    filteredFacets.value = filteredFacets.value.sort(
      (a: AggregationBin, b: AggregationBin) => b.count - a.count
    )
  if (newV === 'label')
    filteredFacets.value = filteredFacets.value.sort((a: AggregationBin, b: AggregationBin) =>
      collator.compare(a.label, b.label)
    )
})

// Updates filtered facets based on value
watch(filterValue, (newV) => {
  if (newV !== '' && newV !== undefined) {
    updateFilter(newV)
  } else {
    filterValue.value = undefined
    filteredFacets.value = facets.value
  }
})

// Updates all facets to be filtered/shown
watch(facets, () => {
  filteredFacets.value = facets.value
  if (filterValue.value !== undefined) updateFilter(filterValue.value)
})

// Update options in dropdown
watch(authorFacetCount, () => {
  if (!defaultFacetCount.includes(authorFacetCount.value)) {
    const index = insertInSortedArray(defaultFacetCount, authorFacetCount.value)
    facetCount.value = [
      ...defaultFacetCount.slice(0, index),
      authorFacetCount.value,
      ...defaultFacetCount.slice(index)
    ]
  }
  if (filterValue.value !== undefined) updateFilter(filterValue.value)
})

// Force update of search if active facets fall out of dropdown
// Compare oldV of filteredFacets against facets
watch(filteredFacets, (newV, oldV) => {
  if (oldV) {
    const newObj: AggregationBin[] = JSON.parse(JSON.stringify(oldV)) // longer list
    const oldObj: AggregationBin[] = JSON.parse(JSON.stringify(facets.value)) // shorter list
    const missingActiveFacets = newObj.filter(
      (oldFacet) =>
        !oldObj.some((newFacet) => oldFacet.label === newFacet.label) && oldFacet.active === true
    )

    if (missingActiveFacets.length) emit('newSearch')
  }
})

// Activate a facet
const toggleFacet = (facet: AggregationBin) => {
  facet.active = !facet.active
  filteredFacets.value.sort((a: AggregationBin, b: AggregationBin) =>
    a.active === b.active ? 0 : a.active ? -1 : 1
  )
  emit('newSearch')
}
</script>
