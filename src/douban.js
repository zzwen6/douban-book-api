const { getSearchResultFromOnline } = require('./douban/search');
const {
  getBookInfoFromOnlineById,
  getBookInfoFromOnlineByIsbn,
} = require('./douban/book');
const {
  getSearchResultFromCache,
  updateSearchResultToCache,
  getBookInfoFromCacheById,
  updateBookInfoToCacheById,
  getBookInfoFromCacheByIsbn,
  updateBookInfoToCacheByIsbn,
} = require('./cache');

// 修复标签解析之前缓存的条目 labels 为空，命中这种缓存时回源重新抓取一次。
function isStaleBookInfo(info) {
  return !info || !Array.isArray(info.labels) || info.labels.length === 0;
}

async function searchByText(text, shouldUpdateCache = false) {
  console.log(shouldUpdateCache);
  if (!shouldUpdateCache) {
    const result = await getSearchResultFromCache(text);
    if (result) return { result, is_cache: true };
  }
  const result = await getSearchResultFromOnline(text);
  await updateSearchResultToCache(text, result);
  return { result, is_cache: false };
}

async function getBookInfoById(douban_id, shouldUpdateCache = false) {
  if (!shouldUpdateCache) {
    const info = await getBookInfoFromCacheById(douban_id);
    if (info && !isStaleBookInfo(info)) return { info, is_cache: true };
  }
  const info = await getBookInfoFromOnlineById(douban_id);
  await updateBookInfoToCacheById(douban_id, info);
  return { info, is_cache: false };
}

async function getBookInfoByIsbn(isbn, shouldUpdateCache = false) {
  if (!shouldUpdateCache) {
    const info = await getBookInfoFromCacheByIsbn(isbn);
    if (info && !isStaleBookInfo(info)) return { info, is_cache: true };
  }
  const info = await getBookInfoFromOnlineByIsbn(isbn);
  await updateBookInfoToCacheByIsbn(isbn, info);
  return { info, is_cache: false };
}

module.exports = {
  searchByText,
  getBookInfoById,
  getBookInfoByIsbn,
};