const { test, mock } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')

const routePath = path.join(__dirname, '../src/app/api/news/route.ts')
const { outputText } = ts.transpileModule(fs.readFileSync(routePath, 'utf8'), {
  compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS }
})
const route = { exports: {} }
new Function('require', 'exports', outputText)(require, route.exports)

test('news route sorts by publication time before limiting the response', async () => {
  const now = Date.now()
  function item(title, ageMinutes) {
    const date = typeof ageMinutes === 'number'
      ? new Date(now - ageMinutes * 60000).toUTCString()
      : ageMinutes
    return `<item><title>${title}</title><link>https://example.com/article</link>${date ? `<pubDate>${date}</pubDate>` : ''}</item>`
  }
  const newest = 'Newest article from five minutes ago'
  const recent = 'Recent article from thirty minutes ago'
  const hours = 'Article published about four hours ago'
  const days = 'Article published about two days ago'
  const invalid = 'Article with an invalid date string'
  const missing = 'Article with no publication date'
  const primary = [item(missing), item(days, 3000), item(hours, 245), item(recent, 30), item(newest, 5), item(invalid, 'invalid')]
  const feeds = [
    primary,
    ...Array.from({ length: 3 }, (_, feed) =>
      Array.from({ length: 7 }, (_, index) =>
        item(`Older article from source ${feed} entry ${index}`, 4000 + feed * 100 + index)
      )
    )
  ]
  let call = 0
  const fetchMock = mock.method(globalThis, 'fetch', async () =>
    new Response(`<rss><channel>${(feeds[call++] || []).join('')}</channel></rss>`)
  )
  try {
    const items = await (await route.exports.GET()).json()
    assert.equal(items.length, 20)
    assert.deepEqual(items.slice(0, 4).map(({ title }) => title), [newest, recent, hours, days])
    assert.equal(items[0].timestamp, 'Just now')
    assert.ok(items.every(({ title }) => title !== invalid && title !== missing))
    assert.ok(items.every(item => !('publishedAt' in item)))

    call = 0
    feeds.length = 1
    const shortList = await (await route.exports.GET()).json()
    assert.deepEqual(shortList.slice(-2).map(({ title, timestamp }) => [title, timestamp]),
      [[missing, 'Recently'], [invalid, 'Recently']])
  } finally {
    fetchMock.mock.restore()
  }
})
