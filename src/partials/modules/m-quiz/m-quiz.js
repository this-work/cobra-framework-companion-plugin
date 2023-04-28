/**
 * m-quiz
 */

import { common, background, theme } from '@this/cobra-framework/src/plugins/mixins';
import { shuffleArray } from '@this/cobra-framework-companion-plugin/src/plugins/vanilla/interaction-helper';
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
        tag: {
            type: String,
            default: 'div'
        },
        id: {
            type: [ Number, String ],
            required: true
        },
        heading: Object,
        feedbacks: Object,
        interactions: Array,
        mode: { // 'default' or 'stacked'
            type: String,
            default: 'default'
        },
        text: String,
        scroll: {
            type: Boolean,
            default: true
        },
        keyvisual: Object,
        ...spacingProps,

        props: {
            type: Object,
            default: () => ({})
        },
        randomize: {
            type: Boolean,
            default: function() {
                return this.props.randomize || false;
            }
        },
        limit: {
            type: Number,
            default: function() {
                return this.props.limit || Number.POSITIVE_INFINITY;
            }
        },
        passThreshold: {
            type: Number,
            default: function() {
                return this.props.passThreshold || 0.75;
            }
        }
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
            questions: this.getQuestions()
        };
    },

    computed: {

        blockClasses() {
            return [
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

        questionSpacingClasses() {
            return [
                spacingClass('padding', 'top', 'medium'),
                spacingClass('padding', 'bottom', this.spacingPaddingBottom)
            ];
        },

        questionSlots() {
            return this.questions[this.selectedQuestionIndex]?.data.slots;
        },

        questionLength() {
            return this.questions.length;
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
                labelTemplate: this.$t(`m-quiz--result`),
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
        getQuestions() {
            const questions = this.randomize ? shuffleArray(this.interactions) : this.interactions;

            return questions.slice(0, this.limit);
        },

        getQuestionProps(index) {
            return {
                ...this.questions[index].data.props,
                isQuiz: true,
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

        questionChange(result) {
            const selectedQuestion = this.questions[this.selectedQuestionIndex] || {};
            const questionText = selectedQuestion?.data?.props?.heading?.headline;
            const quizState = { questionText, result };

            this.quizStates.push(quizState);
            this.selectedQuestionIndex++;

            if (this.selectedQuestionIndex >= this.questions.length) {
                this.status = 'end';
                this.selectedQuestionIndex = undefined;

                this.reportResult({
                    id: this.id,
                    score: this.score / this.maxScore,
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
            this.questions = this.getQuestions();
            this.status = 'start';

            this.$nextTick(() => {
                this.$refs.interactions.forEach(interaction => interaction.retry());
                this.scrollToTop();
            });
        },

        headerHeight() {
            return document.querySelector('.f-header').getBoundingClientRect().height;
        },

        scrollToTop() {
            if (!this.scroll) {
                return;
            }

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
                    quizId: id,
                    score: score,
                    threshold: passThreshold,
                    evaluationResult: evaluationResult,
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
    },

    created() {
        this.$store.commit('quiz/init', {
            instance: this.$route.path.replaceAll('/', '') // besserer hash code wäre besser
        });
    }
};
