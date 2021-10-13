/**
 * f-footer
 */

import { common, theme } from '@this/cobra-framework/src/plugins/mixins';

export default {

    name: 'f-footer',

    mixins: [
        ...common,
        theme
    ],

    props: {
    },

    computed: {
        blockClasses() {
            return [
            ];
        },
        list() {
            return this.$store.state.footer.list;
        }
    },

    methods: {

    }
};
