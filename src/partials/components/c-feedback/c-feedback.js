/**
 * c-feedback
 */

import { common, spacing } from '@this/cobra-framework/src/plugins/mixins';

export default {

    inheritAttrs: false,

    name: 'c-feedback',

    mixins: [
        ...common,
        spacing
    ],

    props: {
        tag: { type: String, default: 'div' },
        type: String,
        feedbacks: Object,
        layoutArea: {
            type: String,
            default: 'page'
        },
        status: {
            type: String,
            default: 'hidden'
        }
    },

    data() {
        return {
            feedbackKey: 1,
            showSolution: false
        };
    },

    computed: {

        blockClasses() {
            return {
                [`${this.block}--layout-with-image`]: !!this.image
            };
        },

        text() {
            return this.feedbacks[this.feedbackType]?.text;
        },
        heading() {
            return this.feedbacks[this.feedbackType]?.heading;
        },
        icon() {
            return this.feedbacks[this.feedbackType]?.icon;
        },
        image() {
            return this.feedbacks[this.feedbackType]?.image;
        },

        feedbackType() {
            return this.showSolution ? 'solution' : this.type;
        },

        hasSolution() {
            return !!this.feedbacks.solution;
        },

        iconModifier() {
            if (this.icon) return this.icon;

            if (this.feedbackType === 'positive') return 'correct';
            if (this.feedbackType === 'negative') return 'wrong';
            if (this.feedbackType === 'solution') return 'solution';

            return '';
        },

        iconName() {
            if (this.feedbackType === 'positive') return 'check';
            if (this.feedbackType === 'negative') return 'close';
            if (this.feedbackType === 'solution') return 'visibility';

            return '';
        }

    },

    methods: {

        retry() {
            this.$emit('retry');
        },

        solution() {
            if (!this.hasSolution) {
                this.resolve();
                return;
            }

            this.showSolution = true;
        },

        resolve() {
            this.$emit('resolve');
        }
    },

    watch: {
        feedbackType() {
            this.feedbackKey += 1;
        }
    }
};
