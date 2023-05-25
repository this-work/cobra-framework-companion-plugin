/**
 * Status Helper JS
 *
 * Version 1.0.0
 * Author Tobias Wöstmann
 *
 */

/**
 * @function
 * @name completedUnits
 *
 * @description Get all completed playlists
 *
 * @return {Array}
 *
 */
export function completedUnits() {
    if (!sessionStorage || !sessionStorage.getItem('completed')) {
        return [];
    }
    return sessionStorage.getItem('completed').split(",");
}

/**
 * @function
 * @name completeUnit
 *
 * @description Complete given playlist / quiz id
 *
 * @param {String} id - id of the playlist / quiz
 *
 */
export function completeUnit(id) {
    if (sessionStorage) {
        const completed = completedUnits();
        if (completed.indexOf(id + '') <= -1) {
            completed.push(id + '');
            sessionStorage.setItem('completed', completed.join(','))
        }
    }
}

/**
 * @function
 * @name isUnitCompleted
 *
 * @description check if given playlist/quiz id is already
 * completedd by user
 *
 * @param {String} id - id of the playlist / quiz
 *
 * @return {Boolean}
 *
 */
export function isUnitCompleted(id) {

    if (!sessionStorage || !sessionStorage.getItem('completed') || !id) {
        return false;
    }

    return sessionStorage.getItem('completed').split(",").indexOf(id + '') >= 0;

}

/**
 * @function
 * @name uncompleteUnit
 *
 * @description Uncomplete given playlist / quiz id
 *
 * @param {String} id - id of the playlist / quiz
 *
 */
export function uncompleteUnit(id) {
    if (sessionStorage) {
        let completed = this.completedUnits();
        const indexOfId = completed.indexOf(id + '');
        if (indexOfId > -1) {
            completed = completed.splice(indexOfId, indexOfId);
            sessionStorage.setItem('completed', completed.join(','))
        }
    }
}
