<template>
  <div v-if="book" class="transcribed-text panel container is-fluid">
    <div
      class="panel-heading is-flex is-justify-content-space-between is-align-items-center m-2"
      :class="isMobile || isTablet ? 'is-flex-direction-column' : 'is-flex-direction-row'"
      id="panel-heading"
    >
      <h1
        class="book-title"
        :class="{
          'rtl-align': preferences.needsRightToLeft
        }"
      >
        <span
          >{{ book.title }}
          <span v-if="book.subtitle">:{{ book.subtitle }}</span>
        </span>
      </h1>

      <span
        class="is-flex is-align-items-center"
        :class="isMobile ? 'is-flex-direction-column' : 'is-flex-direction-row'"
      >
        <p class="is-size-6">{{ $t('navigation.currently-viewing-pages', [pageRangeInView]) }} |</p>
        <div class="is-flex is-flex-direction">
          <p class="is-size-6 pr-2">{{ $t('navigation.jump-to') }}</p>
          <p class="control">
            <input
              class="input is-small is-rounded is-size-7 has-text-centered"
              type="number"
              :min="1"
              :max="book.pages.length"
              v-model.lazy="currentPage"
              @change="scrollTo(currentPage)"
            />
          </p>
        </div>
      </span>
    </div>
    <div
      class="panel-block m-3 p-3 is-flex is-flex-direction-column box"
      :class="{
        'rtl-align': preferences.needsRightToLeft
      }"
      id="transcribed-text"
      role="article"
    >
      <div
        class="scroll-container is-flex is-flex-direction-row is-flex-wrap-wrap is-justify-content-space-evenly"
        v-show="!isLoading"
      >
        <div
          v-for="page in book.pages"
          :key="sha1(!page)"
          class="doc-text is-inline-flex is-flex-direction-column is-flex-wrap-wrap"
        >
          <div class="box page" :id="page.realPageNumber">
            <span
              v-if="page.index > 1 && page.text !== ''"
              class="logical-page-number has-text-left has-text-weight-semibold"
            >
              {{ page.realPageNumber ? page.realPageNumber : `(${page.index})` }}
              <hr />
            </span>

            <div
              class="is-flex is-flex-direction-column is-flex-wrap-wrap m-2"
              :class="[
                page.index === 1 ? 'is-justify-content-space-evenly' : '',
                isMobile ? '' : 'is-align-content-start'
              ]"
              :id="`${page.realPageNumber}-paragraphs`"
            >
              <p
                class="page-text"
                v-for="paragraph in page.paragraphs"
                :key="sha1(paragraph)"
                v-html="paragraph"
              ></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="is-flex is-flex-direction-column has-text-centered p-5">
    <!-- Generating a book view -->
    <span class="m-5"
      ><h1>{{ $t('generating-book-view') }}</h1></span
    >
    <div class="loader-wrapper is-active mt-5">
      <div class="loader is-loading is-active"></div>
      <font-awesome-icon icon="book-open" color="grey" size="2xl" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { onUpdated } from 'vue'
import { onMounted, ref } from 'vue'
import { onBeforeRouteUpdate, useRouter, useRoute } from 'vue-router'
import { fetchData } from '@/assets/fetchMethods'
// import { type BookPages } from '@/assets/interfacesExternals'
import { usePreferencesStore } from '@/stores/PreferencesStore'
import { flatten, isInView, replaceAt } from '@/assets/functions'
import { sha1 } from 'object-hash'
import { storeToRefs } from 'pinia'

const preferences = usePreferencesStore()

const { isMobile, isDesktop, isPortrait, isTablet } = storeToRefs(preferences)

const router = useRouter()
const route = useRoute()

const docRef = ref('')
const pageNumber = ref()
const book = ref()

// const docText = ref()

// const bookTitle = ref('')
// const bookPages = ref<NodeListOf<Element>>()
// const paragraphs = ref<Array<object>>()
const currentPage = ref()
// const firstPage = ref()
const query = ref()
const strict = ref(false)
const pageRangeInView = ref()
const isLoading = ref(true)

const getPagesInView = () => {
  const pages = document.querySelectorAll('.page')
  const pagesInView = Array.from(pages)
    .map((page) => (isInView(page) ? parseInt(page.getAttribute('id')!) : null))
    .filter((x) => x)
  if (pagesInView.length) {
    pageRangeInView.value = `${pagesInView[0]}-${pagesInView[pagesInView.length - 1]}`
  }
}

onMounted(() => {
  docRef.value = route.params.docRef as string
  pageNumber.value = /^[+-]?\d+(\.\d+)?$/.test(route.params.page.toString())
    ? parseInt(route.params.page as string)
    : 1
  currentPage.value = pageNumber.value

  router.isReady().then(() => {
    if (route.query['query']) query.value = (route.query['query'] as string).trim()
    if (route.query['strict']) strict.value = route.query['strict'] === 'true'
    updateText()
  })
  // console.log(isMobile.value, isTablet.value, isDesktop.value, isPortrait.value)
})

onUpdated(() => {
  resizePageBlocks()
  getPagesInView()
  document.getElementById('transcribed-text')?.addEventListener('scroll', getPagesInView, false)
  console.log(isMobile.value, isTablet.value, isDesktop.value, isPortrait.value)
})

const defineSearchParams = () => {
  return Object.assign(
    {},
    query.value?.length ? { query: query.value.trim() } : null,
    strict.value.toString() !== null ? { strict: strict.value.toString() } : null
  )
}

const updateText = () => {
  const params = new URLSearchParams(defineSearchParams())
  params.append('doc-ref', docRef.value)

  fetchData('highlighted-text', 'get', params)
    .then((res) => res.json())
    .then((bookData) => {
      if ('pages' in bookData) {
        let additionalPages = []
        let titleInfo = []

        // Find the lowest index page number
        const firstIndexedPage = Math.min(...bookData.pages.map((page: any) => page.index))

        // Split title and subtitle, if any
        if ('title' in bookData && bookData.title.includes(':'))
          titleInfo = bookData.title.split(':')

        // Insert title pages before first indexed page
        for (let i = 1; i < firstIndexedPage; i++) {
          additionalPages.push(insertPage(i, titleInfo))
        }

        // Merge inserted pages into other pages sorted by index
        bookData.pages = [...additionalPages, ...bookData.pages].sort((a, b) => a.index - b.index)

        bookData.mostNumberOfLines = 0
        bookData.mostNumberOfParagraphs = 0

        // Preprocess data for each page
        bookData.pages.map((page: any) => {
          // Compute a realistic page number
          page.realPageNumber = findRealPageNumber(
            typeof page.text === 'object' ? page.text.join(' ') : page.text
          )

          // Reassign realistic page numbers to title pages
          if (page.index < firstIndexedPage) {
            // console.log(page.index, page, firstIndexedPage)
            page.realPageNumber = `title-${page.index}`
          }

          // Add highlights
          if (page.highlights.length) {
            const str = page.text.substring(page.highlights[0][0], page.highlights[0][1])
            // page.highlights.forEach((highlight: any) => {
            const t = `<span class='highlight'>${str}</span>`
            page.text = page.text.replace(str, t)
            // })
            //   // const textSpan = document.createElement('span')
            //   const highlights = page.highlights.map((highlight: [number, number]) => {
            //     return h('span', {
            //       class: 'highlight',
            //       innerHTML: page.text.slice(highlight[0], highlight[1])
            //     })
            //     // const termSpan = document.createElement('span')
            //     // termSpan.classList.add('highlight')
            //     // termSpan.innerHTML = page.text.slice(highlight[0], highlight[1])
            //     // const newText = page.text.replace(
            //     // page.text.slice(highlight[0], highlight[1]),
            //     // termSpan.outerHTML
            //     // )
            //     // textSpan.innerHTML = newText
            //   })
            //   const vnode = h('span', [...highlights])
            //   page.text = vnode
            //   return page
          }

          // Partition text in paragraphs
          page.paragraphs =
            page.text.length && typeof page.text === 'string'
              ? page.text.split(/\n\n/gm).filter((x: string) => x)
              : []

          // Partition paragraphs in lines
          page.paragraphs = page.paragraphs.map((paragraph: string) =>
            paragraph
              .split(/((?<=.)\n(?=\n))|(\n(?=.))/gm)
              .filter((line: string) => line !== undefined && line !== '\n' && line !== '\n\n')
              .filter((x: string) => x)
          )

          // Repartition paragraphs longer than 1,000 characters
          page.paragraphs.forEach((lines: any, index: any, array: any) => {
            if (lines.join().length > 1000) {
              array.splice(index + 1, 0, lines.splice(lines.length / 2 + 1, lines.length / 2))
            }
          })

          page.numberOfLines = page.paragraphs.length
            ? page.paragraphs.reduce((acc: any, element: any) => acc + element.length, 0)
            : 0

          page.lines = page.paragraphs.map((paragraph: any, paragraphIndex: number) => {
            paragraphIndex = paragraphIndex + 1
            return paragraph.map((line: string, lineNumberIndex: number) => {
              return {
                paragraph: paragraphIndex,
                lineNumber: paragraphIndex + lineNumberIndex,
                text: line
              }
            })
          })

          page.lines = flatten(page.lines)

          bookData.mostNumberOfLines =
            page.lines.length > bookData.mostNumberOfLines
              ? page.lines.length
              : bookData.mostNumberOfLines

          bookData.mostNumberOfParagraphs =
            page.paragraphs.length > bookData.mostNumberOfParagraphs
              ? page.paragraphs.length
              : bookData.mostNumberOfParagraphs
        })

        bookData.pages = fillInBlankPageNumbers(bookData.pages)
      }

      // console.log(bookData.pages[50])
      // console.log(bookData.pages[51])

      book.value = bookData
    })
    .then(() => {
      const container = document.getElementById('transcribed-text')

      if (container && document.defaultView) {
        /** Update font-size based on widest possible container
         * Empirically determined c. 30 lines per page is clearly readable at
         * 30 lines: 1em (Bulma: is-size-6)
         * 60 lines: 0.75em (Bulma: is-size-7)
         * 100+ lines: 0.5em
         * */
        if (book.value.mostNumberOfLines > 40)
          document.querySelectorAll('.page-text').forEach((el) => el.classList.add('is-size-6'))
        else document.querySelectorAll('.page-text').forEach((el) => el.classList.add('is-size-7'))

        // resizePageBlocks()

        // Set each page element to the same size and adjust font size if necessary
      }
    })
    .then(() => document.getElementById(`${route.params.page}`)?.scrollIntoView())
  isLoading.value = false
}

const resizePageBlocks = () => {
  const maxWidth = Math.max(
    ...book.value.pages
      .map((page: any) => {
        const el = document.getElementById(page.realPageNumber)
        if (el && el.offsetWidth) {
          return el.offsetWidth
        }
      })
      .filter((x: number) => x)
  )

  book.value.pages.map((page: any) => {
    const el = document.getElementById(page.realPageNumber)
    if (el) {
      el.style.width = `${maxWidth}px`
      console.log(isMobile.value, isTablet.value, isDesktop.value, isPortrait.value)
      if (!isPortrait.value && (!isMobile.value || !isTablet.value)) {
        el.style.height = `${maxWidth * 1.3}px`
        const paragraphContainer = el.lastChild as HTMLElement
        paragraphContainer.style.height = `${maxWidth * 1.2}px`
      }

      // Break up bulky paragraphs
      // const shouldNotBeTallerThanPx = maxWidth * 1.2
      // const childrenElements = paragraphContainer.children

      // Split long paragraphs in equal length strings
      // const paragraphsToSplit = Array.from(childrenElements).map((paragraph: any) => {
      //   if (paragraph && paragraph.getBoundingClientRect().height > shouldNotBeTallerThanPx) {
      //     const part1 = paragraph.innerText.substring(0, paragraph.innerText.length/2)
      //     const part2 = paragraph.innerText.substring(paragraph.innerText.length/2);
      //     return paragraph
      //   }
      // })

      // console.log(paragraphsToSplit)

      // if (breakUp.length) {
      // page.paragraphs.
      //
      // }
    }
    // }
  })
}

const insertPage = (i: number, title: Array<string> = []) => {
  return {
    index: i,
    text: i == 1 && title.length ? title : '',
    highlights: [],
    realPageNumber: title.length ? `title-${i}` : 0,
    startOffset: 0
  }
}

const scrollTo = (page: number) => {
  const main = document.querySelector('.transcribed-text')
  const container = document.getElementById('transcribed-text')
  const client = document.getElementById(page.toString())
  const panelHeading = document.getElementById('panel-heading')
  if (main && container && client && panelHeading) {
    const top =
      client.getBoundingClientRect().top -
      main.getBoundingClientRect().top -
      panelHeading.getBoundingClientRect().height
    container.scrollBy({ top: top, behavior: 'smooth' })
    const activePages = document.querySelectorAll('.doc-text.active')
    activePages.forEach((page) => page.classList.remove('active'))
    client.classList.add('active')
  }
}

const findRealPageNumber = (text: string) => {
  const numbers = text
    .split('\n')
    .map((element) => (/^[+-]?\d+(\.\d+)?$/.test(element) ? element : null))
    .reverse()
    .filter((fragment) => fragment)

  return numbers.length && numbers[0] ? parseInt(numbers[0]) : 0
}

const fillInBlankPageNumbers = (pages: any) => {
  pages.reduce((prev: any, curr: any, index: any, array: any) => {
    if (array[index + 1] !== undefined && 'realPageNumber' in array[index + 1]) {
      if (array[index + 1].realPageNumber > curr.realPageNumber + 1) {
        array[index + 1].realPageNumber = curr.realPageNumber + 1
      }

      if (array[index + 1].realPageNumber + 1 <= curr.realPageNumber + 1) {
        array[index + 1].realPageNumber = curr.realPageNumber + 1
      }
    }
    return curr
  })
  return pages
}

// When URL is changed manually?
onBeforeRouteUpdate(async () => {
  updateText()
  resizePageBlocks()
})
</script>
