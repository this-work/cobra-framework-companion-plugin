/**
 * f-navigation
 */

import { common } from '@this/cobra-framework/src/plugins/mixins';
import { enablePageScrolling, disablePageScrolling } from '@this/cobra-framework/src/plugins/vanilla/scroll-blocker';

export default {

    name: 'f-navigation',

    mixins: [
        ...common
    ],

    data() {
        return {
            level: 'root',
            direction: 'left'
        };
    },

    beforeDestroy() {
        if (this.$store.state.navigation.visible) {
            this.toggle(false);
        }
    },

    watch: {
        $route() {
            if (this.$store.state.navigation.visible) {
                this.toggle(false);
            }
        },
        visible(visible) {
            if (visible) {
                this.open();
            } else {
                this.close();
            }
        }
    },

    computed: {

        visible() {
            return this.$store.state.navigation.visible;
        },

        sublevel() {
            return this.level !== 'root';
        },

        navigation() {

            let navigation = this.$store.state.navigation.list;

            if (this.level) {

                this.level.split('.').forEach(index => {

                    if (index !== 'root') {
                        navigation = navigation.items[parseInt(index)];
                    }

                });

            }

            return navigation;

        }
    },

    methods: {

        toggle(visible) {
            this.$store.commit('navigation/visible', visible);
        },

        open() {

            document.addEventListener('click', this.checkClickOutside);

            window.setTimeout(() => {
                disablePageScrolling([
                    {
                        element: document.body,
                        property: 'right'
                    },
                    {
                        element: document.querySelector(`.f-header__module`),
                        property: 'padding-right'
                    }
                ], true);
            }, 0);

        },

        close() {

            this.level = 'root';

            document.removeEventListener('click', this.checkClickOutside);

            setTimeout(() => {
                enablePageScrolling(true);
            }, 0);

        },

        checkClickOutside(event) {
            if (this.$el === event.target) {
                this.toggle(false);
            }
        },

        navigateLevelUp() {
            this.direction = 'right';
            this.level = this.level.substring(0, this.level.length - 2);
        },

        navigateLevelDown(index) {
            this.direction = 'left';
            this.level += '.' + index;
        }
    }
};
