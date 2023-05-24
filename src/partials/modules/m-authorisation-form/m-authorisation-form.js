/**
 * m-authorisation-form
 */

import { common, theme, background } from '@this/cobra-framework/src/plugins/mixins';

export default {

    name: 'm-authorisation-form',

    mixins: [
        ...common,
        theme,
        background
    ],

    props: {
        heading: {
            type: Object
        }
    }
};
