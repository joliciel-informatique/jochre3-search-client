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
    class="box table-of-contents is-flex is-flex-direction-column facets menu is-hidden-touch mx-3"
    :style="preferences.interfaceStyle === 'new' ? 'max-height:85vh' : ''"
    role="navigation"
    tabindex="1"
  >
    <AccordionCard :showing="showing">
      <template #header>
        <p
          class="menu-label is-size-5 label is-flex is-flex-direction-column is-align-items-center"
        >
          <span class="is-flex is-flex-direction-row is-align-items-center">
            <span
              class="pl-1 is-size-6"
              v-show="
                !preferences.displayLeftToRight && preferences.isDesktop && !preferences.isPortrait
              "
              v-tooltip:bottom="$t('facets.what-are-facets')"
            >
              <font-awesome-icon icon="question-circle" />
            </span>
            {{ $t('facets.title', [authorFacetCount]) }}
            <span
              class="pl-1 is-size-6"
              v-show="
                preferences.displayLeftToRight && preferences.isDesktop && !preferences.isPortrait
              "
              v-tooltip:bottom="$t('facets.what-are-facets')"
            >
              <font-awesome-icon icon="question-circle" /> </span
          ></span>
          <span class="pt-2 is-size-7 is-italic">{{ $t('facets.subtitle') }}</span>
        </p>
      </template>
      <template #content>
        <div class="is-flex is-flex-direction-column">
          <div class="columns is-vcentered m-1">
            <div class="column is-6 is-size-7">
              <span
                class=""
                :class="preferences.displayLeftToRight ? 'has-text-left' : 'has-text-right'"
              >
                <p>{{ $t('facets.display-number-of-author-facets') }}</p>
              </span>
            </div>
            <div class="column is-6 is-size-7">
              <div class="dropdown is-hoverable">
                <div class="dropdown-trigger">
                  <button class="button py-0" aria-haspopup="true" aria-controls="dropdown-menu">
                    <span>{{ authorFacetCount }}</span>
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
                    <!-- <hr class="dropdown-divider" />
                    <a href="#" @click.prevent="updateFacetCount(0)" class="dropdown-item">{{
                      $t('facets.facet-count-all')
                    }}</a> -->
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
            <div class="column is-6 is-size-7">
              <span
                class=""
                :class="preferences.displayLeftToRight ? 'has-text-left' : 'has-text-right'"
              >
                {{ $t('facets.sort-by-label') }}</span
              >
            </div>
            <div class="column is-6 is-size-7">
              <div
                class="dropdown is-hoverable"
                :class="preferences.displayLeftToRight ? 'is-right' : 'is-left'"
              >
                <div class="dropdown-trigger">
                  <button
                    class="button py-0"
                    aria-haspopup="true"
                    aria-controls="author-facet-dropdown-menu"
                  >
                    <span ref="dropdownTrigger">{{ dropdownTriggerValue }}</span>
                    <span class="icon is-small">
                      <font-awesome-icon icon="angle-down" aria-hidden="true" />
                    </span>
                  </button>
                </div>
                <div class="dropdown-menu" id="author-facet-dropdown-menu" role="menu">
                  <div class="dropdown-content left">
                    <a
                      href="#"
                      @click.prevent="updateSortOption('count', $t('facets.most-hits'))"
                      class="dropdown-item"
                      :class="facetSortBy === 'count' ? 'is-active' : ''"
                      >{{ $t('facets.most-hits') }}</a
                    >
                    <a
                      href="#"
                      @click.prevent="updateSortOption('label', $t('facets.by-name'))"
                      :class="facetSortBy === 'label' ? 'is-active' : ''"
                      class="dropdown-item"
                      >{{ $t('facets.by-name') }}</a
                    >
                    <a
                      href="#"
                      @click.prevent="updateSortOption('active', $t('facets.active-facets'))"
                      class="dropdown-item"
                      :class="facetSortBy === 'active' ? 'is-active' : ''"
                      >{{ $t('facets.active-facets') }}</a
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
                  :placeholder="$t('facets.filter')"
                />
                <span class="menu-label p-2" v-if="filterValue !== undefined">
                  {{ $t('facets.relevant-facets', [filteredFacets?.length]) }}
                </span>
              </p>
            </span>
          </div>
        </div>
        <div
          class="facet-list is-flex is-flex-direction-column is-flex-wrap-nowrap is-align-items-center"
          :style="preferences.interfaceStyle == 'new' ? 'overflow-y:scroll;max-height:48vh;' : ''"
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
    </AccordionCard>
  </div>

  <div v-show="openMobileFacets" class="menu is-flex is-flex-direction-column is-hidden-desktop">
    <p class="menu-label is-size-5 label is-flex is-flex-direction-column is-align-items-center">
      <span class="is-flex is-flex-direction-row is-align-items-center"
        >{{ $t('facets.title', [authorFacetCount]) }}
        <span
          class="pl-1 is-size-6"
          v-show="preferences.isDesktop && !preferences.isPortrait"
          v-tooltip:bottom="$t('facets.what-are-facets')"
        >
          <font-awesome-icon icon="question-circle" /> </span
      ></span>
      <span class="pt-2 is-size-7 is-italic">{{ $t('facets.subtitle') }}</span>
    </p>
    <div class="is-flex is-flex-direction-column">
      <div class="columns is-vcentered m-1">
        <div class="column is-8 is-size-7">
          <span
            class=""
            :class="preferences.displayLeftToRight ? 'has-text-left' : 'has-text-right'"
          >
            <p>{{ $t('facets.display-number-of-author-facets') }}</p>
          </span>
        </div>
        <div class="column is-4 is-size-7">
          <div class="dropdown is-hoverable">
            <div class="dropdown-trigger">
              <button class="button py-0" aria-haspopup="true" aria-controls="dropdown-menu">
                <span>{{ authorFacetCount }}</span>
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
                <span ref="dropdownTrigger">{{ dropdownTriggerValue }}</span>
                <span class="icon is-small">
                  <font-awesome-icon icon="angle-down" aria-hidden="true" />
                </span>
              </button>
            </div>
            <div class="dropdown-menu" id="author-facet-dropdown-menu" role="menu">
              <div class="dropdown-content left">
                <a
                  href="#"
                  @click.prevent="updateSortOption('count', $t('facets.most-hits'))"
                  class="dropdown-item"
                  :class="facetSortBy === 'count' ? 'is-active' : ''"
                  >{{ $t('facets.most-hits') }}</a
                >
                <a
                  href="#"
                  @click.prevent="updateSortOption('label', $t('facets.by-name'))"
                  :class="facetSortBy === 'label' ? 'is-active' : ''"
                  class="dropdown-item"
                  >{{ $t('facets.by-name') }}</a
                >
                <a
                  href="#"
                  @click.prevent="updateSortOption('active', $t('facets.active-facets'))"
                  class="dropdown-item"
                  :class="facetSortBy === 'active' ? 'is-active' : ''"
                  >{{ $t('facets.active-facets') }}</a
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
            :placeholder="$t('facets.filter')"
          />
          <span class="menu-label p-2" v-if="filterValue !== undefined">
            {{ $t('facets.relevant-facets', [filteredFacets?.length]) }}
          </span>
        </p>
      </span>
      <div
        class="facet-list on-mobile is-flex is-flex-direction-column is-flex-wrap-nowrap is-align-items-center"
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
import { computed, defineAsyncComponent, ref, watch, type Ref } from 'vue'
import { sha1 } from 'object-hash'
import type { AggregationBin } from '@/assets/interfacesExternals'
import { usePreferencesStore } from '@/stores/PreferencesStore'
import { insertInSortedArray } from '@/assets/functions'
import { useI18n } from 'vue-i18n'
import FilterTag from '@/_components/FilterTag/FilterTag.vue'
import AccordionCard from '@/_components/AccordionCard/AccordionCard.vue'
// const FilterTag = defineAsyncComponent(() => import('@/_components/FilterTag/FilterTag.vue'))
// const AccordionCard = defineAsyncComponent(
//   () => import('@/_components/AccordionCard/AccordionCard.vue')
// )

const emit = defineEmits(['newSearch'])
const preferences = usePreferencesStore()

const defaultFacetCount = [5, 10, 15, 20]
const showing = ref(true)
const authorFacetCount = ref(preferences.authorFacetCount)
const facetSortBy = ref(preferences.facetSortBy)
const facetCount = ref(defaultFacetCount)
const filteredFacets = ref()
const filterValue = ref(undefined)
const dropdownTrigger = ref()
const dropdownTriggerValue = computed(() => {
  const { t } = useI18n()
  if (facetSortBy.value === 'label') return t('facets.by-name')
  if (facetSortBy.value === 'active') return t('facets.active-facets')
  return t('facets.most-hits')
})
const facets: Ref = defineModel<AggregationBin[]>('facets')
const openMobileFacets = defineModel('openMobileFacets')

const toggle = () => (showing.value = !showing.value)

// Set user preferences from dropdown options
const updateFacetCount = (val: number) => {
  authorFacetCount.value = val
  preferences.authorFacetCount = authorFacetCount.value
  preferences.save()
}

// Update the facet list based on a filter
const updateFilter = (val: string) => {
  filteredFacets.value = facets.value
    .map((facet: AggregationBin) => (facet.label.includes(val) ? facet : null))
    .filter((x: AggregationBin) => x)
}

// Perpetuate option to dropdown trigger text and user preference
const updateSortOption = (val: string, textValue: string) => {
  if (dropdownTrigger.value) {
    dropdownTrigger.value.innerHTML = textValue
    facetSortBy.value = val
    preferences.facetSortBy = facetSortBy.value
    preferences.save()
  }
}

// Sort facets by option
const sortBy = (option: string = 'count') => {
  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })
  if (option === 'count') {
    filteredFacets.value = filteredFacets.value.sort(
      (a: AggregationBin, b: AggregationBin) => b.count - a.count
    )
  }
  if (option === 'label') {
    filteredFacets.value = filteredFacets.value.sort((a: AggregationBin, b: AggregationBin) =>
      collator.compare(a.label, b.label)
    )
  }

  if (option === 'active') {
    const activeFilters = filteredFacets.value
      .map((a: AggregationBin) => (a.active ? a : null))
      .filter((x: AggregationBin) => x)
      .sort((a: AggregationBin, b: AggregationBin) => b.count - a.count)
    const inactiveFilters = filteredFacets.value
      .map((a: AggregationBin) => (!a.active ? a : null))
      .filter((x: AggregationBin) => x)
      .sort((a: AggregationBin, b: AggregationBin) => b.count - a.count)
    filteredFacets.value = [...activeFilters, ...inactiveFilters]
  }
}

// Activate a facet
const toggleFacet = (facet: AggregationBin) => {
  facet.active = !facet.active
  sortBy(facetSortBy.value)
  emit('newSearch')
}

// Update sort
watch(facetSortBy, (newV) => sortBy(newV))

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
  sortBy(facetSortBy.value)
  if (filterValue.value !== undefined) updateFilter(filterValue.value)
})

// Update number of authors to display
watch(authorFacetCount, (newV, oldV) => {
  // Limit to numbers 1-100
  if (newV > 100 || newV < 1 || isNaN(newV)) {
    authorFacetCount.value = oldV
    if (!defaultFacetCount.includes(authorFacetCount.value)) {
      const index = insertInSortedArray(defaultFacetCount, authorFacetCount.value)
      facetCount.value = [
        ...defaultFacetCount.slice(0, index),
        authorFacetCount.value,
        ...defaultFacetCount.slice(index)
      ]
    }
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
</script>
