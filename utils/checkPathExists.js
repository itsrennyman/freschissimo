const checkPathExists = function (endpoint, req) {
  if (endpoint.paths.indexOf(req.url) !== -1) {
    return true;
  }

  for (const key in endpoint.paths) {
    const path = endpoint.paths[key];

    if (path.slice(-1) === '*') {
      if (
        (req.url.startsWith(path.slice(0, -1))) &&
        (req.url.replace(path.slice(0, -1), '').length > 0) &&
        (req.url.replace(path.slice(0, -1), '') !== '/')
      )
        return true;
    }
  }

  return false;
}

module.exports = checkPathExists;