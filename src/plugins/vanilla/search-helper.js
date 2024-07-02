/**
 * Search Helper JS
 *
 * Version 1.0.0
 * Author Tobias Wöstmann
 *
 */

/**
 * @function
 * @name getUriParams
 *
 * @description Get all get params in the current uri
 *
 * @return {String}
 *
 */
export function getUriParams() {

    if (window && window.location) {

        return window.location.search.substring(1).split('&').reduce((a, v) =>
                ({ ...a, [decodeURIComponent(decodeURIComponent(v.split('=')[0]))]: decodeURIComponent(decodeURIComponent(v.split('=')[1])) }),
            {});

    }

    return '';

}

/**
 * @function
 * @name getElasticsearchQueryString
 *
 * @description Build the elasticsearch 'query' string with all tags they found in the current uri
 *
 * @return {String}
 *
 */
export function getElasticsearchQueryString() {

    const urlQuery = getUriParams();

    if (!urlQuery.tags) {
        return '*';
    }

    let tagArray = urlQuery.tags.split(",").map((tag) => {
        return tag.indexOf(" ") >= 0 || tag.indexOf("/") || tag.indexOf("-") >= 0 ? '"' + tag + '"' : tag + '~2'
    });

    return tagArray.join(' AND ');
}

/**
 * @function
 * @name updateUriParams
 *
 * @description Update given param in uri
 *
 * @param {String} key - Key of the uri param that should be updated
 * @param {String} value - Value of the uri param that should be updated
 *
 */
export function updateUriParams(key, value) {

    const baseUrl = [ location.protocol, '//', location.host, location.pathname ].join('');

    let params = '';

    if (value.length > 0) {

        const urlQueryString = document.location.search;
        const newParam = key + '=' + value;
        params = '?' + newParam;

        if (urlQueryString) {

            const keyRegex = new RegExp('([\?&])' + key + '[^&]*');

            if (urlQueryString.match(keyRegex) !== null) {
                params = urlQueryString.replace(keyRegex, '$1' + newParam);
            } else {
                params = urlQueryString + '&' + newParam;
            }

        }

    }

    window.history.replaceState({}, '', baseUrl + params);

}
