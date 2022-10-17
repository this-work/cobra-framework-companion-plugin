/**
 * m-quiz
 */

import { common, background, theme } from '@this/cobra-framework/src/plugins/mixins';
import { cloneDeep, shuffleArray } from '@this/cobra-framework/src/plugins/vanilla/helperFunctions';
import { spacingClass, spacingProps } from '@this/cobra-framework/src/plugins/mixins/spacing';

export default {

    inheritAttrs: false,

    name: 'm-quiz',

    mixins: [
        ...common,
        theme,
        background
    ],

    props: {
        tag: { type: String, default: 'div' },
        id: { type: [ Number, String ], required: true },
        limit: { type: Number, default: Number.POSITIVE_INFINITY, validator(value) { return value >= 0; } },
        passThreshold: { type: Number, default: 0.75 },
        heading: Object,
        feedbacks: Object,
        interactions: Array,        // questions: Array,
        backgroundPosition: {   // layoutArea: {
            type: String,
            default: 'page'
        },
        mode: {     // 'default' or 'stacked'
            type: String,
            default: 'default'
        },
        scroll: { type: Boolean, default: true },
        keyvisual: Object,
        ...spacingProps
    },

    data() {
        return {
            status: 'start', // 'start' or 'in progress' or 'end'
            selectedQuestionIndex: null,
            quizStates: [],
            questionKey: 1,
            scrollOptions: {
                duration: 300,
                easing: [ 0.42, 0.0, 0.58, 1.0 ],
                offset: 22,
                force: true,
                cancelable: false
            },
            spacingObj: {
                spacingMarginTop: 'none',
                spacingPaddingTop: this.spacingPaddingTop,
                spacingMarginBottom: 'none',
                spacingPaddingBottom: this.spacingPaddingBottom
            }
        };
    },

    computed: {

        blockClasses() {
            return [
                // { [`${this.block}--layout-area-${this.backgroundPosition}`]: true },
                spacingClass('margin', 'top', this.spacingMarginTop),
                spacingClass('margin', 'bottom', this.spacingMarginBottom)
            ];
        },

        descriptionSpacingClasses() {
            return [
                spacingClass('padding', 'top', this.spacingPaddingTop),
                spacingClass('padding', 'bottom', this.spacingPaddingBottom)
            ];
        },

        backgroundSizeClass() {
            return this.elementModifier('background', this.backgroundPosition);
        },

        transitionName() {
            return this.status === 'start' ? 'slide--right' : 'slide--left';
        },

        transitionNameQuiz() {
            return this.status === 'start' ? 'quiz-slide--right' : 'quiz-slide--left';
        },

        shuffeledQuestions() {
            return shuffleArray(this.interactions);
        },

        startProps() {
            const test = {

                heading: {
                    ...this.heading,
                    subline: this.quizDescription(),
                    headlineTag: 'span',
                    headlineType: 'h1',
                    alignment: 'center'
                },
                theme: this.theme,
                mode: this.mode,
                backgroundPosition: this.backgroundPosition, // this.layoutArea,
                backgroundImage: this.backgroundImage,
                ...this.spacingObj
            };

            return test;
        },

        // questionProps() {
        //     return {
        //         isQuiz: true,
        //         ...this.shuffeledQuestions[this.selectedQuestionIndex].data.props,
        //         mode: this.mode,
        //         backgroundPosition: this.backgroundPosition
        //
        //         // theme: this.theme,
        //         // interactionLayout: this.interactionLayout,
        //         // layoutArea: this.layoutArea,
        //         // ...this.spacingObj
        //     };
        // },

        buttonLabelStartQuiz() {
            return this.$t('m-quiz--button-start-quiz');
        },

        questionSlots() {
            return this.shuffeledQuestions[this.selectedQuestionIndex]?.data.slots;
        },

        questionLength() {
            return this.shuffeledQuestions.length;
        },

        maxScore() {
            return this.questionLength;
        },

        score() {
            return this.quizStates?.filter( question => question.result).length;
        },

        minScore() {
            return Math.round(this.maxScore * this.passThreshold);
        },

        quizPassed() {
            return this.score / this.maxScore >= this.passThreshold;
        },

        progressIndicator() {
            return {
                score: this.score,
                maxScore: this.questionLength,
                activeIndex: this.selectedQuestionIndex,
                labelTemplate: this.$t(`m-quiz--result`),    //this.$t(`${this.$options.name}--result`),
                states: this.quizStates,
                questionLength: this.questionLength,
                theme: this.theme
            };
        },

        feedbackProps() {
            const feedbackType = this.quizPassed ? 'positive' : 'negative';

            return {
                ...this.feedbacks[feedbackType],
                feedbackType,
                progressIndicator: this.progressIndicator
            };
        }

    },

    methods: {

        getQuestionProps(index) {
            return {
                isQuiz: true,
                // ...this.shuffeledQuestions[this.selectedQuestionIndex].data.props,
                ...this.shuffeledQuestions[index].data.props,
                mode: this.mode,
                backgroundPosition: this.backgroundPosition
            };
        },

        quizDescription() {
            return this.$t('m-quiz--introduction-text')
                .replace('{maxScore}', this.maxScore.toString())
                .replace('{minScore}', this.minScore.toString());
        },

        startQuiz() {
            this.selectedQuestionIndex = 0;
            this.status = 'in progress';

            this.$nextTick(() => {
                this.scrollToTop();
            });
        },

        questionChange(state) {

            this.quizStates.push(cloneDeep({ result: state }));

            this.questionKey++;

            if (++this.selectedQuestionIndex >= this.shuffeledQuestions.length) {
                this.selectedQuestionIndex = undefined;
                this.status = 'end';
                const score = this.score / this.maxScore;

                this.reportResult({
                    id: this.id,
                    score,
                    passThreshold: this.passThreshold,
                    evaluationResult: this.quizPassed
                });

            }

            this.$nextTick(() => {
                this.scrollToTop();
            });
        },

        retry() {
            this.quizStates = [];
            this.$store.commit('interaction/reset', {
                id: this.id,
                instance: this.$route.path.replaceAll('/', ''), // besserer hash code wäre besser
            });

            shuffleArray(this.interactions);

            this.status = 'start';
            this.$nextTick(() => {
                this.scrollToTop();
            });
        },

        headerHeight() {
            return document.querySelector('.f-header').getBoundingClientRect().height;
        },

        scrollToTop() {
            if (!this.scroll) return;

            const { duration, offset, ...scrollOptions } = this.scrollOptions;

            this.$scrollTo(
                this.$refs.quiz.$el || this.$refs.quiz,
                duration,
                {
                    offset: -(this.headerHeight() + offset),
                    ...scrollOptions
                }
            );
        },

        reportResult({ id, score, passThreshold, evaluationResult }) {

            return this.trackAttempt({ id, score, passThreshold, evaluationResult });

        },
        async trackAttempt({ id, score, passThreshold, evaluationResult }) {

            try {
                const { csrfTokenName, csrfTokenValue } = await this.$axios.$get('/api/csrf-token');

                const result = await this.$axios.$post('/api/v1/quiz/track-attempt', {
                    'quizId': id,
                    'score': score,
                    'threshold': passThreshold,
                    'evaluationResult': evaluationResult,
                    [csrfTokenName]: csrfTokenValue
                });

                if (!result.success) {
                    console.log(result.error);
                }

            } catch (err) {

                if (err.response.data.error) {
                    console.log(err.response.data.error);
                } else {
                    console.log(err.message);
                }
            }
        }

    }

};
