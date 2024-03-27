/**
 * f-header
 */

import { common } from '@this/cobra-framework/src/plugins/mixins';

export default {

    name: 'f-header',

    mixins: [
        ...common
    ],

    computed: {
        navigation() {
            return this.$auth.loggedIn && this.$store.getters['header/navigation'];
        },
        close() {
            return this.$store.getters['header/close'];
        },
        back() {
            return this.$store.getters['header/back'];
        },
        profile() {
            return this.$auth.loggedIn &&
            navigation &&
            this.$config.MODE === 'companion' &&
            !this.$config.EXPORT &&
            (this.$config.PROFILE_PAGE || false)
        },
        entryId() {
            return this.$store.getters['companion/entryId'];
        }
    },

    methods: {
        historyBack() {
            const savedBackUrl = this.$store.getters['header/backUrl'];
            if (savedBackUrl) {
                this.$store.commit('header/settings', {
                    backUrl: null
                });
                this.$router.push(savedBackUrl);
            } else {
                window.history.length > 2 ? this.$router.go(-1) : this.$router.push('/');
            }
        },
        closePage() {
            if (sessionStorage) {
                if (sessionStorage.getItem('savedPlaylistStackLink') === 'search') {
                    this.$router.go(-1);
                } else {
                    this.$router.push(this.$store.getters['header/closeUrl']);
                }
            }
        }
    }


};
