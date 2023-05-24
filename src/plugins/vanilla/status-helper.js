/**
 * Status Helper JS
 *
 * Version 1.0.0
 * Author Tobias Wöstmann
 *
 */

/**
 * @function
 * @name completePlaylist
 *
 * @description Get all completed playlists
 *
 * @return {Array}
 *
 */
export function completedPlaylists() {
    if (!sessionStorage || !sessionStorage.getItem('completed')) {
        return [];
    }
    return sessionStorage.getItem('completed').split(",");
}

/**
 * @function
 * @name completePlaylist
 *
 * @description Complete given playlist / quiz id
 *
 * @param {String} id - id of the playlist / quiz
 *
 */
export function completePlaylist(id) {
    if (sessionStorage) {
        const completed = completedPlaylists();
        if (completed.indexOf(id + '') <= -1) {
            completed.push(id + '');
            sessionStorage.setItem('completed', completed.join(','))
        }
    }
}

/**
 * @function
 * @name isCompleted
 *
 * @description check if given playlist/quiz id is already
 * completedd by user
 *
 * @param {String} id - id of the playlist / quiz
 *
 * @return {Boolean}
 *
 */
export function isPlaylistCompleted(id) {

    if (!sessionStorage || !sessionStorage.getItem('completed') || !id) {
        return false;
    }

    return sessionStorage.getItem('completed').split(",").indexOf(id + '') >= 0;

}

/**
 * @function
 * @name uncompletePlaylist
 *
 * @description Uncomplete given playlist / quiz id
 *
 * @param {String} id - id of the playlist / quiz
 *
 */
export function uncompletePlaylist(id) {
    if (sessionStorage) {
        let completed = this.completedPlaylists();
        const indexOfId = completed.indexOf(id + '');
        if (indexOfId > -1) {
            completed = completed.splice(indexOfId, indexOfId);
            sessionStorage.setItem('completed', completed.join(','))
        }
    }
}
