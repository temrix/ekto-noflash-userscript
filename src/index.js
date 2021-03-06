'use strict'
const Buffer = require('buffer').Buffer
const zip = require('lodash/zip')

const createAudioElement = async (file) => {
  try {
    const div = document.createElement('div')
    const audio = document.createElement('audio')
    audio.setAttribute('controls', 'controls')
    audio.setAttribute('preload', 'none')
    audio.setAttribute('src', file)
    div.appendChild(audio)
    return div
  } catch (e) {
    console.error(e)
  }
}

const processPost = async (post) => {
  try {
    const source = post.querySelector('.audioplayer_container ~ p script').innerHTML
    const encoded = source.match(/soundFile:\s*"([^"]+)"/)[1]
    const decoded = Buffer.from(encoded, 'base64').toString()
    const files = decoded.split(',')
    const siblings = post.querySelector('.tl').getElementsByClassName('t')
    return [files, siblings]
  } catch (e) {
    console.error(e)
  }
}

const main = async () => {
  try {
    const posts = document.getElementsByClassName('post')
    Array.from(posts).forEach((post) => {
      post.querySelector('.audioplayer_container').innerHTML = ''
    })
    const comb = Array.from(posts).map(await processPost)
    for (const post of comb) {
      const postArr = await post
      const zipped = zip(postArr[0], postArr[1])
      zipped.forEach(async (item, i) => {
        const after = item[1]
        after.parentNode.insertBefore(await createAudioElement(item[0]), after.nextSibling)
      })
    }
  } catch (e) {
    console.error(e)
  }
}

// If running as WebExtension, this is done by the browser.
if (typeof browser === 'undefined') {
  window.addEventListener('DOMContentLoaded', (event) => {
    main()
  })
} else {
  main()
}
