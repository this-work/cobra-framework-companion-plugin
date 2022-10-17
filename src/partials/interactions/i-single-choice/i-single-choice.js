/**
 * i-single-choice
 */

import { common } from '@this/cobra-framework/src/plugins/mixins';
import interaction from '../../../plugins/mixins/interaction';
import { shuffleArray } from '@this/cobra-framework/src/plugins/vanilla/helperFunctions';

export default {

    name: 'i-single-choice',

    mixins: [
        ...common,
        interaction
    ],

    props: {
        answers: Array,
        layoutArea: {
            type: String,
            default: 'page'
        },
    },

    data() {
        return {
            buttonLabelEvaluate: this.$t('interactions--button-evaluate'),
            shuffledAnswers: shuffleArray([...this.answers])
        };
    },

    computed: {

        blockClasses() {
            return {
                [`interaction`]: true,
                [`${this.$options.name}--readonly`]: this.resolved,
                [`${this.$options.name}--${this.withImages ? 'with' : 'without'}-images`]: true,
                [`${this.$options.name}--image-count-${this.shuffledAnswers.length}`]: this.withImages
            };
        },

        withImages() {
            return this.answers[0].image || this.answers[0].asset?.image;
        },

        markedAnswers() {
            return this.correctSelection || this.shuffledAnswers.map(answer =>
                this.$store.getters['interaction/selection'](this.id).includes(answer)
            );
        },

        correctSelection() {
            if (this.resolved) return this.shuffledAnswers.map(answer => !!answer.correct);
        },

        correctAnswers() {
            return this.answers.filter(answer => answer.correct);
        },

        correctAnswersSelected() {
            return this.$store.getters['interaction/selection'](this.id).filter(answer => answer.correct);
        },

        evaluatedResult() {
            return this.correctAnswersSelected.length === this.$store.getters['interaction/selection'](this.id).length
                && this.correctAnswersSelected.length === this.correctAnswers.length;
        },

        comparedSelection() {
            if (!this.$store.getters['interaction/selection'](this.id) || !this.correctSelection) return;

            return this.shuffledAnswers.map(answer => {
                const isSelected = this.$store.getters['interaction/selection'](this.id).includes(answer);
                const isCorrect = answer.correct;
                return isCorrect && isSelected || !isCorrect && !isSelected;
            });
        }

    },

    methods: {

        selectionChanged(answer) {
            this.$store.commit('interaction/update', {
                id: this.id,
                state: {
                    selection: [answer]
                }
            });

            this.evaluationPermitted = true;
        },

        retry() {
            this.evaluationPermitted = false;
            this.shuffledAnswers = shuffleArray([...this.answers]);

            this.$store.commit('interaction/update', {
                id: this.id,
                state: {
                    selection: null,
                    result: null
                }
            });
        },

        evaluate() {
            this.$store.commit('interaction/update', {
                id: this.id,
                state: {
                    result: this.evaluatedResult
                }
            });

            this.$emit('evaluated', this.evaluatedResult);
        }

    }

};
