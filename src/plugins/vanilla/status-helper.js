/**
 * Status Helper JS
 *
 * Version 1.0.0
 * Author Tobias Wöstmann
 *
 */

/**
 * @function
 * @name completed
 *
 * @description check if given playlist/quiz id is already
 * completedd by user
 *
 * @param {String} id - id of the playlist / quiz
 *
 * @return {Boolean}
 *
 */
export function completed(id) {

    if (!sessionStorage || !sessionStorage.getItem('completed') || !id) {
        return false;
    }

    return sessionStorage.getItem('completed').indexOf(id + '') >= 0;

}
