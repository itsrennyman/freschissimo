const checkPathExists = function(endpoint, req) {
    if (endpoint.paths.indexOf(req.url) !== -1) {
        return true;
    }

    for (const key in endpoint.paths) {
        const path = endpoint.paths[key];
        
        if (path.slice(-1) === '*') {
            // Count slashes of the path to be matched
            const slashes = (path.match(/\//g) || []).length;
        
            // Take the root of the url for matching
            const strToMatch = req.url.split('/').slice(0, slashes).join('/');

            // Check strToMatch is the start of the string.
            if (path.startsWith(strToMatch))
                return true;
        }
    }

    return false;
}

module.exports = checkPathExists;