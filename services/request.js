const db = require('../db');

function makeRequest(query, dataSet) {
  const resultPromise = new Promise((resolve, reject) => {
    db.query(query, dataSet, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });

  return resultPromise.then(results => {
    return { code: 'success', content: results };
  })
  .catch(error => {
    return { code: 'error', content: error }
  });
}

module.exports = makeRequest;