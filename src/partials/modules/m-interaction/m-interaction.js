/**
 * m-interaction
 */

import { common, background } from '@this/cobra-framework/src/plugins/mixins';
import { spacingProps, spacingClass } from '@this/cobra-framework/src/plugins/mixins/spacing';

export default {

    name: 'm-interaction',

    mixins: [ ...common, background ],

    props: {
        ...spacingProps,
        isFeedbackVisible: { type: Boolean },
        headingLayout: {
            type: Object,
            default: () => ({
                layout: 'l-12',
                slot: 'column-1'
            })
        },
        interactionLayout: {
            type: Object,
            default: () => ({
                layout: 'l-12',
                slot: 'column-1'
            })
        },
        alignment: String,
        feedbacks: Object,
        question: Object,
        type: String,
        scroll: { type: Boolean, default: true }
    },

    data() {
        return {
            answersVisible: false,
            scrollOptions: {
                duration: 300,
                easing: [ 0.42, 0.0, 0.58, 1.0 ],
                offset: 22,
                force: true,
                cancelable: false
            }
        };
    },

    computed: {
        blockClasses() {
            return [
                { [`${this.block}--alignment-${this.alignment}`]: true },
                spacingClass('margin', 'top', this.spacingMarginTop),
                spacingClass('margin', 'bottom', this.spacingMarginBottom),
                spacingClass('padding', 'top', this.spacingPaddingTop),
                spacingClass('padding', 'bottom', this.spacingPaddingBottom)
            ];
        },

        slotProps() {
            return {
                scrollTo: this.scrollTo
            };
        }
    },

    methods: {
        spacingClass,

        headerHeight() {
            return document.querySelector('.f-header').getBoundingClientRect().height;
        },

        scrollTo(target) {
            if (!this.scroll) return;

            const targets = {
                'question': this.$refs.question.$el || this.$refs.question,
                'feedbacks': this.$refs.feedbacks.$el || this.$refs.feedbacks,
                'interaction': this.$refs.interaction.$el || this.$refs.interaction
            };

            const { duration, offset, ...scrollOptions } = this.scrollOptions;

            this.$scrollTo(
                targets[target],
                duration,
                {
                    offset: -(this.headerHeight() + offset),
                    ...scrollOptions
                }
            );
        }

    }

};
