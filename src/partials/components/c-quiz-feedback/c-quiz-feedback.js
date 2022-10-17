/**
 * c-quiz
 */
import { common, theme } from '@this/cobra-framework/src/plugins/mixins';

export default {

    name: 'c-quiz-feedback',

    mixins: [
        ...common,
        theme
    ],

    props: {
        progressIndicator: { type: Object },
        feedbackType: {
            type: String,
            required: true,
            validator: value => [ 'positive', 'negative', 'solution' ].includes(value)
        },
        heading: { type: Object, default: null },
        text: { type: String, default: null },
        icon: { type: String, default: null }
    },

    data() {
        return {
            buttonProps: {
                label: this.$t(`${this.$options.name}--retry`),
                icon: 'arrow-back',
                iconPosition: 'left'
            }
        };
    },

    computed: {

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
        mRetry() {
            this.$emit('retry');
        }
    }

};
