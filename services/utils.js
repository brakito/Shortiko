const rootUrl = `https://shortiko.onrender.com/`;

function createLink(key) {
  return rootUrl + 'l/' + key;
}

function arrToLinks(arr) {
  return arr.map(item => createLink(item.alias));
}

function formatUrl(url) {
  if (!url.startsWith("https://") && !url.startsWith("http://")) {
    return "http://" + url;
  }

  return url;
}

module.exports = { rootUrl, createLink, arrToLinks, formatUrl }