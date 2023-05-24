/**
 * f-sticky-tabs
 */

import { common } from '@this/cobra-framework/src/plugins/mixins';
import throttle from 'lodash.throttle';

export default {
    name: 'f-sticky-tabs',

    mixins: [
        ...common
    ],

    props: {
        tabs: {
            type: Array,
            default: () => []
        }
    },

    data() {
        return {
            currentScrollTop: null,
            tabsScrollTops: []
        };
    },

    computed: {
        getMarkerStyles() {
            const currentTab = document.getElementById(`tab-${this.currentTabType}`);

            if (!currentTab) {
                return {
                    left: 0,
                    width: 'auto'
                };
            }

            const { offsetLeft, offsetWidth } = currentTab.parentNode;

            return {
                left: `${offsetLeft}px`,
                width: `${offsetWidth}px`
            };
        },

        currentTabType() {
            if (this.tabsScrollTops.length <= 0) {
                return null;
            }
            const selectedTarget = this.tabsScrollTops.find(({ scrollTop }) => scrollTop > this.currentScrollTop);

            return (selectedTarget || this.tabs[0]).type;
        }
    },

    methods: {
        updateScrollPosition() {
            this.currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        },

        getScrollOffset(elementId) {
            if (!this.$refs.stickyTabs) {
                return null;
            }

            const offset = 20;
            const isDesktop = window.outerWidth >= 768;
            const { height: stickyTabsHeight } = this.$refs.stickyTabs.getBoundingClientRect();
            const { height: headingHeight } = document.querySelector(`#${elementId} > .m-heading`).getBoundingClientRect();

            return (stickyTabsHeight + offset - (isDesktop ? headingHeight : 0)) * -1;
        }
    },

    mounted() {
        window.addEventListener('scroll', throttle(this.updateScrollPosition, 1000 / 60));
        this.updateScrollPosition();

        setTimeout(() => {
            const stickyTabsHeight = this.$refs.stickyTabs.getBoundingClientRect().height;

            this.tabsScrollTops = this.tabs.map(({ type }) => {
                const { top, height } = document.querySelector(`#${type}`).getBoundingClientRect();

                return {
                    type,
                    scrollTop: this.currentScrollTop + top + height - stickyTabsHeight
                };
            });
        }, 16);
    },

    unmounted() {
        window.removeEventListener('scroll', this.updateScrollPosition);
    }
};
