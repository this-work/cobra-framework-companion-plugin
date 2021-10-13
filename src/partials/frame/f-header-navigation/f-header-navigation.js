/**
 * f-header-navigation
 */

import { common } from '@this/cobra-framework/src/plugins/mixins';

export default {

    name: 'f-header-navigation',

    mixins: [
        ...common
    ],

    props: {
        tag: {
            type: String,
            default: 'nav'
        }
    },

    computed: {
        blockClasses() {
            return [
            ];
        },
        headerType() {
            return this.$store.state.header.type;
        },
        navigationTitle() {
            return this.$store.state.navigation.title;

        },
        playlistNavigation() {
            return this.$store.state.header.playlistNavigationList;
        }
    },

    methods: {
        openNavigation() {
            this.$store.commit('navigation/visible', true);
        },
        closePage() {
            window.history.back();
        },
        logout() {
            this.$auth.logout('craft');
        }
    }
};
