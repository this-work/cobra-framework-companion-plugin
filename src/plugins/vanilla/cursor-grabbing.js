/**
 * Cursor Grabbing JS
 *
 * Handles the possible cursor style "grabbing" of the html root.
 *
 * Version 1.0.0
 * Author Charly Wolff
 *
 */

/**
 * @function
 * @name disableCursorGrabbing
 *
 * @description Disable the cursor globally to grabbing
 *
 */
export function disableCursorGrabbing() {
    const html = document.querySelector('html');

    html.style.removeProperty('cursor');
}

/**
 * @function
 * @name enableCursorGrabbing
 *
 * @description Activates the cursor globally to grabbing
 *
 */
export function enableCursorGrabbing() {
    const html = document.querySelector('html');

    html.style.setProperty('cursor', 'grabbing', 'important');
}
