/**
 * f-footer
 */

import { common } from '@this/cobra-framework/src/plugins/mixins';

export default {

    name: 'f-footer',

    mixins: [
        ...common
    ],

    computed: {
        blockClasses() {
            return {
                [`theme-${this.$store.getters['footer/theme']}`]: this.$store.getters['footer/theme']
            };
        },
        navigation() {
            const navigation = this.$store.getters['navigations/footer'];
            if (navigation.length <= 0) {
                return false;
            }
            return navigation;
        }
    },

    methods: {
        logout() {
            sessionStorage.clear();
            this.$auth.logout(this.$config.AUTH_STRATEGY);
        }
    }
};
