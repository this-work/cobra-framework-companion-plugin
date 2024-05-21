/**
 * m-form-change-password
 */

import { common, spacing, theme, background } from '@this/cobra-framework/src/plugins/mixins';

export default {

    name: 'm-form-change-password',

    mixins: [
        ...common,
        spacing,
        theme,
        background
    ],

    props: {
        heading: Object
    },

    computed: {
    },

    methods: {
    }
};
