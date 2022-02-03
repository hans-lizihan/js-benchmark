const fetch = require('isomorphic-fetch');

fetch('http://localhost:8080/frameworks/non-keyed/vanillajs/package.json')
  .then((d) => d.json())
  .then(console.log)

