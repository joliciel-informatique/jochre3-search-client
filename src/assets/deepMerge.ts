/**
 * From https://stackoverflow.com/a/34749873/1417558
 */

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export const isObject = (item: any): boolean => item && typeof item === 'object' && !Array.isArray(item)

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export const mergeDeep = (target: any, ...sources: any): any => {
  if (!sources.length) return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        mergeDeep(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }

  return mergeDeep(target, ...sources)
}
