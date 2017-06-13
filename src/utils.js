import { sortBy as _sortBy } from 'lodash'

export const filterBy = (key, needle) => entries =>
  entries.filter(e => e[key] === needle)

export const sortBy = (key, dir = 'ASC') => entries => {
  const ordered = _sortBy(entries, key)
  
  if (dir !== 'ASC') {
    ordered.reverse()
  }

  return ordered
}
