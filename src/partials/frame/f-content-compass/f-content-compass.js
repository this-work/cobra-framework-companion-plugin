/**
 * f-content-compass
 */

import { common } from '@this/cobra-framework/src/plugins/mixins';
import { completeUnit, completedUnits } from '@this/cobra-framework-companion-plugin/src/plugins/vanilla/status-helper';
import throttle from 'lodash.throttle';

export default {

    name: 'f-content-compass',

    mixins: [
        ...common
    ],

    props: {
        id: {
            type: [String, Number]
        },
        title: {
            type: String
        },
        size: {
            type: Number,
            default: 36
        },
        progressWidth: {
            type: Number,
            default: 2
        },
        collection: {
            type: Object
        },
        anchors: {
            type: Array
        }
    },

    data() {

        const radius = (this.size + 2.5 * this.progressWidth) / 2;
        const normalizedRadius = radius - this.progressWidth * 2;
        const circumference = normalizedRadius * 2 * Math.PI;

        return {
            showContentNavigation: false,
            completedOnced: false,
            completionProgress: 0,
            circumference,
            normalizedRadius,
        };
    },

    computed: {
        blockClasses() {
            return {
                [this.modifier('scroll-completed')]: this.scrollCompleted && !this.showContentNavigation,
                [this.modifier('open-content-navigation')]: this.showContentNavigation
            };
        },
        contentNavigation() {
            return this.anchors && this.anchors.length > 0
        },
        scrollCompleted() {
            const completed = this.completionProgress === 100;
            if (completed) {
                if (!this.completedOnced) {
                    this.completePlaylist();
                }
            }
            return completed;
        },
        compassIcon() {
            if (this.showContentNavigation) {
                return 'close';
            }
            if (this.scrollCompleted) {
                return 'check';
            }
            if (this.contentNavigation) {
                return 'list';
            }
            return undefined;
        },
        strokeDashoffset() {
            const completionProgress = this.completionProgress || 0;
            return this.circumference - (completionProgress / 100 * this.circumference);
        },
        cirleElementProps() {
            return {
                'r': this.normalizedRadius,
                'cx': this.size / 2,
                'cy': this.size / 2,
                'stroke-width': this.progressWidth
            };
        }
    },

    mounted() {
        window.addEventListener('scroll', throttle(this.updateScrollPosition, 1000 / 60));
    },

    unmounted() {
        window.removeEventListener('scroll', this.updateScrollPosition);
    },

    methods: {
        completePlaylist() {

            this.completedOnced = true;
            this.$refs.toast.show();

            completeUnit(this.id);

            document.dispatchEvent(new CustomEvent('playlist-completed', {
                detail: {
                    id: this.id,
                    completed: completedUnits()
                }
            }));

        },
        toggleContentNavigation(event) {
            if (this.contentNavigation) {
                event.stopPropagation();
                if (!this.showContentNavigation) {
                    this.showContentNavigation = true;
                    this.$refs.contentNavigation.open();
                } else {
                    this.showContentNavigation = false;
                    this.$refs.contentNavigation.close();
                }
            }
        },
        getFooterHeight() {
            const footer = document.querySelector('.f-footer');
            if (!footer) {
                return 0;
            }
            return footer.getBoundingClientRect().height;
        },

        updateScrollPosition() {
            const { clientHeight, scrollHeight, scrollTop } = document.documentElement;
            const totalHeight = scrollHeight - clientHeight - this.getFooterHeight();
            const progress = (scrollTop / totalHeight) * 100;

            this.completionProgress = Math.min(progress, 100);
        }
    }
};
