/**
 * c-anchor-dropdown
 */

import { common } from '@this/cobra-framework/src/plugins/mixins';
import { enablePageScrolling, disablePageScrolling } from '@this/cobra-framework/src/plugins/vanilla/scroll-blocker';

export default {

    name: 'c-anchor-dropdown',

    mixins: [
        ...common
    ],

    props: {
        title: String,
        anchors: Array,
        readingTime: String,
        completed: Boolean
    },

    data() {
        return {
            open: false
        };
    },

    computed: {
        blockClasses() {
            return {
                [`${this.$options.name}--open`]: this.open
            };
        }
    },

    methods: {
        toggleDropdown() {

            if (!this.open) {

                document.addEventListener('click', this.checkClickOutside);

                window.setTimeout(() => {
                    disablePageScrolling([
                        { element: document.body, property: 'right' }
                    ], false);
                }, 0);

            } else {

                document.removeEventListener('click', this.checkClickOutside);

                setTimeout(() => {
                    enablePageScrolling(false);
                }, 0);

            }

            this.open = !this.open;

        },
        checkClickOutside(event) {
            if (!this.$el.querySelector(`.${this.$options.name}__content`).contains(event.target) &&
                !this.$el.querySelector(`.${this.$options.name}__toggle`).contains(event.target)) {
                this.toggleDropdown();
            }
        }

    }
};
