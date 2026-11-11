const cases = require('./cases');
const parseHtml = require('../src/douban/libs/parseHtml');
const keys = [
  'title',          'subtitle',      
  'original_title', 'id',
  'isbn',           'author',        
  'translator',     'publish',       
  'producer',       'publishDate',   
  'pages',          'price',
  'binding',        'series',
  'book_intro',     'author_intro',  
  'catalog',        'cover_url',     
  'url',            'labels',
];

cases.forEach((c) => {
  const info = parseHtml(c.html);
  keys.forEach(k => {
    // eslint-disable-next-line no-undef
    test(`${c.title}.${k}`, () => {
      // eslint-disable-next-line no-undef
      expect(info[k]).toEqual(c[k]);
    });
  });
});
const { getLabelsFromCriteria, uniqueLabels } = parseHtml;

// eslint-disable-next-line no-undef
test('criteria labels: only 7: entries, unescaped', () => {
  // eslint-disable-next-line no-undef
  expect(getLabelsFromCriteria("criteria = '7:余华|7:it\\'s|3:/subject/1/',")).toEqual(['余华', "it's"]);
  // eslint-disable-next-line no-undef
  expect(getLabelsFromCriteria('<html></html>')).toEqual([]);
});

// eslint-disable-next-line no-undef
test('labels dedupe case-insensitively and drop blanks', () => {
  // eslint-disable-next-line no-undef
  expect(uniqueLabels(['Haskell', ' haskell ', '', '编程'])).toEqual(['Haskell', '编程']);
});
