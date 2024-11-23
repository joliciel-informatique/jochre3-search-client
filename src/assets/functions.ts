export const isInView = (el: Element) => {
  const rect = el.getBoundingClientRect()
  return rect.top >= 0 && rect.bottom <= window.innerHeight
}

export const isSticking = (el: HTMLElement) => {
  const observer = new IntersectionObserver(
    ([e]) => e.target.classList.toggle('is-pinned', e.intersectionRatio < 1),
    { threshold: [1] }
  )

  observer.observe(el)
}

export const insertInSortedArray = (array: any[], value: number) => {
  let low = 0,
    high = array.length

  while (low < high) {
    const mid = (low + high) >>> 1
    if (array[mid] < value) low = mid + 1
    else high = mid
  }
  return low
}

export const flatten = (arr: any) => {
  let ret: any[] = []
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      ret = ret.concat(flatten(arr[i]))
    } else {
      ret.push(arr[i])
    }
  }
  return ret
}

export const replaceAt = (str: string, index: number, replacement: string) => {
  return str.substring(0, index) + replacement + str.substring(index + replacement.length)
}
