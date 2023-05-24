/**
 * f-logo
 */

import { common } from '@this/cobra-framework/src/plugins/mixins';

export default {

    name: 'f-logo',

    mixins: [
        ...common
    ],

    computed: {
        logo() {
            return '/images/logo/' + this.$store.getters['header/theme'] + '.svg';
        }
    }

};
