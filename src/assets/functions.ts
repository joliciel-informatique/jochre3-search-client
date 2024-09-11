export const isInView = (el: HTMLElement) => {
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
