/**
 * f-footer
 */

import { common, theme } from '@this/cobra-framework/src/plugins/mixins';
import { project } from '@/project.config';

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
        projectName() {
            return project.name;
        },
        list() {
            return this.$store.state.footer.list;
        }
    },

    methods: {

    }
};
