/**
 * f-header
 */

import { common, theme } from '@this/cobra-framework/src/plugins/mixins';
import { project } from '@/project.config';

export default {

    name: 'f-header',

    mixins: [
        ...common,
        theme
    ],

    props: {
    },

    computed: {
        blockClasses() {
            return {
                [`${this.$options.name}--search`]: this.$store.state.header.type === 'search'
            };
        },
        projectName() {
            return project.name;
        }
    },

    methods: {
    }
};
