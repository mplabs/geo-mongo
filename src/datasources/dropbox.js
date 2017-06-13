import dropbox from 'dropbox'
import { join } from 'path'
import { filterBy, sortBy } from '../utils'

export class DropboxSource {

  isFetching = false
  didInvalidate = false
  entries = []

  get needToFetch() {
    return ( !this.isFetching || this.didInvalidate )
  }

  constructor({ accessToken, clientId = null, basePath = '' }) {
    if (!accessToken || 'string' !== typeof accessToken) {
      throw new Error('Expected `accessToken` to be string.')
    }

    this.dbx = new dropbox({ accessToken, clientId })
    this.cd(basePath)
  }

  cd(newPath) {
    this.cwd = (newPath.match(/^\/|^$/)) ?
      newPath : join(this.cwd, newPath)
    this.didInvalidate = true
    this.entries = []
  }

  fetch(force = false) {
    if (force) {
      this.didInvalidate = true
    }

    if (!this.needToFetch) {
      return Promise.resolve(this.entries)
    }

    this.isFetching = true
    return this.dbx.filesListFolder({
      path: this.cwd,
      include_media_info: true
    }).then(response => {
      this.entries = response.entries
      this.isFetching = false
      this.didInvalidate = false
      return this.entries
    })
  }

  listFiles () {
    return this.fetch()
      .then(filterBy('.tag', 'file'))
      .then(sortBy('name', 'ASC'))
  }

  listFolders() {
    return this.fetch()
      .then(filterBy('.tag', 'folder'))
      .then(sortBy('name', 'ASC'))
  }
}

export default DropboxSource
