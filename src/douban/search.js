const got = require('got');
const decrypt = require('./libs/decrypt');
const headers = require('./libs/getHeaders')();

function extractSearchItems(body) {
  // 2024+：搜索页 window.__DATA__ 已是明文 JSON 对象
  const jsonAssign = /window\.__DATA__\s*=\s*(\{[\s\S]*?\})\s*;/.exec(body);
  if (jsonAssign) {
    const data = JSON.parse(jsonAssign[1]);
    return data.payload?.items || data.items;
  }
  // 旧版：window.__DATA__ 为加密字符串
  const encrypted = /window\.__DATA__\s*=\s*"(.*?)"\s*;/.exec(body);
  if (encrypted) {
    const result = decrypt(encrypted[1]);
    return result.payload.items;
  }
  const title = (/<title>([^<]*)<\/title>/i.exec(body) || [])[1] || '';
  throw new Error('search page has no window.__DATA__; status-title=' + title.trim() + '; length=' + body.length);
}

async function getSearchResultFromOnline(text) {
  const response = await got('https://search.douban.com/book/subject_search?search_text=' + encodeURIComponent(text), {
    method: 'GET',
    headers,
  });
  return extractSearchItems(response.body);
}

module.exports = {
  getSearchResultFromOnline,
  extractSearchItems,
};
