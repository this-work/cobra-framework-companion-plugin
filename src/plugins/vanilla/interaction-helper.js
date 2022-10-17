/**
 * Interaction Helper JS
 *
 * Version 1.0.0
 * Author Charly Wolf
 *
 */

/**
 * Shuffles array in place.
 * @param array {Array} An array containing the items.
 * @return {Array} The shuffled array.
 */
export function shuffleArray(array) {
    let j, x, i;

    for (i = array.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = array[i];
        array[i] = array[j];
        array[j] = x;
    }

    return array;
}


/**
 * Simple object check.
 * @param item {Object} The item to be tested.
 * @return {Boolean} 'true' if the item is an object. Otherwise 'false'.
 */
export function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}


/**
 * Deep merge two or more objects.
 * @param target {Object} The object to be merged into.
 * @param sources {Object}  Objects to be merged from.
 * @return {Object} The merged target Object.
 */
export function mergeDeep(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return mergeDeep(target, ...sources);
}


/**
 * Compare 2 arrays on the top level.
 * @param array1 {Array} One array to compare.
 * @param array2 {Array} The other array to compare.
 * @return {Boolean} 'true' if the arrays contains the same items. Otherwise 'false'.
 */
export function compareArrays(array1, array2) {
    let i = array1.length;
    if (i != array2.length) return false;

    while (i--) {
        if (array1[i] !== array2[i]) return false;
    }

    return true;
}


/**
 * Clone an object deep.
 * @param obj {Object} The object to be cloned.
 * @return {Object} The cloned object.
 */
export function cloneDeep(obj) {
    return JSON.parse(JSON.stringify(obj));
}


