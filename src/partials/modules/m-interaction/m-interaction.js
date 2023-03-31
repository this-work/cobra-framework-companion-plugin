/**
 * m-interaction
 */

import { common, background, theme } from '@this/cobra-framework/src/plugins/mixins';
import { spacingClass, spacingProps } from '@this/cobra-framework/src/plugins/mixins/spacing';

export default {

    inheritAttrs: false,

    name: 'm-interaction',

    mixins: [
        ...common,
        theme,
        background
    ],

    props: {
        id: Number,
        isQuiz: {
            type: Boolean,
            default: false
        },
        feedbacks: Object,
        heading: Object,

        backgroundPosition: {   // @CW - layoutArea oder backgroundPosition ?!?!?!? (erstmal per computed umgesetzt) !!!!!!!!
            type: String,
            default: 'page'
        },

        mode: {     // 'default' or 'stacked'
            type: String,
            default: 'default'
        },
        text: String,
        interaction: String,
        interactionProps: Object,
        ...spacingProps
    },

    data() {
        return {
            status: 'question', // 'question' or 'feedback' or 'resolved',
            questionResult: null
        };
    },

    computed: {

        layoutArea() {
            return this.backgroundPosition;
        },

        blockClasses() {
            return [
                { [this.modifier('type-' + this.mode)]: true },
                spacingClass('margin', 'top', this.spacingMarginTop),
                spacingClass('margin', 'bottom', this.spacingMarginBottom),
                { [this.modifier('choice-question')]: ['single-choice', 'multiple-choice'].includes(this.interaction) && this.interactionProps.answers.every(answer => !answer.asset) }
            ];
        },
        backgroundSizeClass() {
            return this.elementModifier('background', this.layoutArea);
        },
        interactionBackgroundStyle() {
            return this.backgroundImage ? { backgroundImage: `url('${this.backgroundImage}')` } : undefined;
        },
        questionSpacingClass() {
            return [
                spacingClass('padding', 'top', this.spacingPaddingTop),
                spacingClass('padding', 'bottom', this.spacingPaddingBottom)
            ];
        },
        _heading() {
            const headline =
                this.heading && this.heading.headline
                    ? this.heading.headline.replaceAll(/<[^>]*p>/g, '')
                    : undefined;

            return {
                ...this.heading,
                headline,
                headlineType: 'h3',
                alignment: 'custom'
            };
        },
        _interaction() {
            return 'i-' + this.interaction;
        },
        _interactionProps() {
            return { ...this.interactionProps, ...{
                id: this.id,
                spacingPaddingTop: this.spacingPaddingTop,
                spacingPaddingBottom: this.spacingPaddingBottom
            } };
        },
        feedbackProps() {
            return { feedbacks: this.feedbacks, ...{
                type: this.questionResult
            } };
        }

    },

    methods: {

        changeStatus(interactionResult) {

            if (this.isQuiz) {
                this.$emit('change', interactionResult);
                return;
            }

            this.status = 'feedback';
            this.questionResult = interactionResult ? 'positive' : 'negative';
        },

        retry() {
            this.$refs.interaction.retry();

            this.$nextTick(() => {
                this.status = 'question';
            });
        },

        resolveQuestion() {
            this.status = 'resolved';
        }

    }

};
