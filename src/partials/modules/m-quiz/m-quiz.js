/**
 * m-quiz
 */

import { common, spacing, theme, background } from '@this/cobra-framework/src/plugins/mixins';

export default {

    name: 'm-quiz',

    mixins: [
        ...common,
        spacing,
        theme,
        background
    ],

    props: {
        layout: {
            type: String,
            default: 'l-12'
        }
    },

    computed: {
        blockClasses() {
            return [
            ];
        },
        getSlotName() {
            return 'column-1';
        }
    },

    methods: {
    }
};
