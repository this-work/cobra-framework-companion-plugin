/**
 * f-language-switch
 */

import { common } from '@this/cobra-framework/src/plugins/mixins';

export default {

    name: 'f-language-switch',

    mixins: [
        ...common
    ],

    data() {
        return {
            visibleList: false
        };
    },

    computed: {
        languages() {
            return this.$i18n.locales;
        }
    },

    methods: {
        toggleListVisibility(visibility) {

            this.visibleList = visibility ? visibility : !this.visibleList;

            if (this.visibleList) {
                document.addEventListener('click', this.checkClickOutsideLanguageList);
            } else {
                document.removeEventListener('click', this.checkClickOutsideLanguageList);
            }

        },
        checkClickOutsideLanguageList(event) {
            if (this.$el !== event.target.closest('.' + this.$options.name)) {
                this.toggleListVisibility(false);
            }
        },
        changeLanguage(localeCode) {

            this.toggleListVisibility(false);

            if (this.$i18n.locale === localeCode) return;

            this.switchLocalePath(localeCode);

            if (this.$config.FETCH_FRAME) {
                this.$nextTick(() => {
                    this.$store.dispatch('navigations/fetch', { name: 'main' } );

                    this.$store.dispatch('navigations/fetch', { name: 'footer' });
                })
            }

        }
    }
};
