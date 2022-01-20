export const interactionState = {
    INITIAL: 'INITIAL',
    INTERACTED: 'INTERACTED',
    EVALUATED: 'EVALUATED',
    SOLVED: 'SOLVED'
};

export default {

    provide() {
        return {
            feedbacks: {
                register: this.registerFeedback,
                unregister: this.unregisterFeedback
            }
        };
    },

    inject: {
        quiz: { from: 'quiz', default: null }
    },

    props: {
        retries: { type: Number, default: -1 },
        points: { type: Number, default: 1 }
    },

    data() {
        return {
            state: interactionState.INITIAL,
            isDisabled: {
                retry: false,
                solve: false,
                evaluate: false,
                interactable: false
            },
            feedbacks: [],
            _retries: this.$props.retries
        };
    },

    computed: {
        partOfQuiz() {
            return this.quiz !== null;
        },
        isFeedbackVisible() {
            return this.feedbacks.some(feedback => feedback.$data.visible);
        }
    },

    watch: {
        state: {
            immediate: true,
            handler: function(newState, oldState) {

                const canRetry = this.$props.retries >= 0
                    ? this.$data._retries == 0
                    : false;

                switch (newState) {
                    case (interactionState.INITIAL):
                        this.feedbackVisibilityWhere(false);
                        this.isDisabled = { retry: true, solve: false, evaluate: true, interactable: false };
                        break;
                    case (interactionState.INTERACTED):
                        this.isDisabled = { retry: canRetry, solve: false, evaluate: false, interactable: false };
                        break;
                    case (interactionState.SOLVED):
                        this.feedbackVisibilityWhere(({ feedbackType }) => feedbackType === 'solution');
                        this.isDisabled = { retry: canRetry, solve: true, evaluate: true, interactable: true };
                        break;
                    case (interactionState.EVALUATED):
                        const feedback = this.evaluationResult ? 'positive' : 'negative';
                        this.feedbackVisibilityWhere(({ feedbackType }) => feedbackType === feedback);
                        this.isDisabled = { retry: canRetry, solve: false, evaluate: true, interactable: true };
                        break;
                }

                this.$emit('change', {
                    newState,
                    oldState,
                    interaction: this,
                    evaluationResult: this.evaluationResult
                });
            }
        }
    },

    methods: {
        registerFeedback(feedback) {
            if (this.partOfQuiz) return;
            this.feedbacks.push(feedback);
        },
        unregisterFeedback(feedback) {
            if (this.partOfQuiz) return;
            this.feedbacks = this.feedbacks.filter(c => c === feedback);
        },

        feedbackVisibilityWhere(fn) {
            this.feedbacks
                .forEach(feedback => {
                    feedback.visible = typeof fn === 'function'
                        ? fn(feedback)
                        : fn;
                });
        },

        reset() {
            this.state = interactionState.INITIAL;
            this.$data._retries = this.retries;
        },
        retry() {
            if (this.isDisabled.retry) return;
            this.$data._retries--;
            this.state = interactionState.INITIAL;
        },
        evaluate() {
            if (this.isDisabled.evaluate) return;
            this.state = interactionState.EVALUATED;
        },
        interact() {
            if (this.isDisabled.interactable) return;
            this.state = interactionState.INTERACTED;
        },
        solve() {
            if (this.isDisabled.solve) return;
            this.state = interactionState.SOLVED;
        }
    },

    created() {
        if (this && this.quiz) {
            this.quiz.registerInteraction(this);
        }
    },

    destroyed() {
        if (this && this.quiz) {
            this.quiz.unregisterInteraction(this);
        }
    }
};
