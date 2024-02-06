/**
 * f-browse-linklist
 */

import { common } from '@this/cobra-framework/src/plugins/mixins';

export default {
    name: 'f-browse-linklist',

    mixins: [
        ...common
    ],

    props: {
        tag: {
            type: String,
            default: 'ul'
        },
        links: {
            type: Array,
            default: () => []
        }
    }
};
