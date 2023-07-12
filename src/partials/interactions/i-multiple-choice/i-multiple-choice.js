/**
 * i-multiple-choice
 */

import { common } from '@this/cobra-framework/src/plugins/mixins';
import interaction from '../../../plugins/mixins/interaction';
import { shuffleArray } from '../../../plugins/vanilla/interaction-helper';

export default {

    name: 'i-multiple-choice',

    mixins: [
        ...common,
        interaction
    ],

    props: {
        answers: Array,
        disableShuffle: {
            type: Boolean,
            default: false
        },
        layoutArea: {
            type: String,
            default: 'page'
        }
    },

    data() {
        return {
            buttonLabelEvaluate: this.$t('i--button-evaluate'),
            shuffledAnswers: this.shuffleAnswers([...this.answers])
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
            return this.answers[0].image || this.answers[0].asset ? this.answers[0].asset.image : false;
        },

        markedAnswers() {
            return this.correctSelection || this.shuffledAnswers.map(answer =>
                this.$store.getters['quiz/interactionSelection'](this.id).includes(answer)
            );
        },

        correctSelection() {
            if (this.resolved) return this.shuffledAnswers.map(answer => !!answer.correct);
        },

        correctAnswers() {
            return this.answers.filter(answer => answer.correct);
        },

        correctAnswersSelected() {
            return this.$store.getters['quiz/interactionSelection'](this.id).filter(answer => answer.correct);
        },

        evaluatedResult() {
            return this.correctAnswersSelected.length === this.$store.getters['quiz/interactionSelection'](this.id).length
                && this.correctAnswersSelected.length === this.correctAnswers.length;
        },

        comparedSelection() {
            if (!this.$store.getters['quiz/interactionSelection'](this.id) || !this.correctSelection) return;

            return this.shuffledAnswers.map(answer => {
                const isSelected = this.$store.getters['quiz/interactionSelection'](this.id).includes(answer);
                const isCorrect = answer.correct;
                return isCorrect && isSelected || !isCorrect && !isSelected;
            });
        }

    },

    methods: {

        shuffleAnswers(answers) {
            return this.disableShuffle ? answers : shuffleArray(answers);
        },

        selectionChanged(answer) {
            let selection;

            if (this.$store.getters['quiz/interactionSelection'](this.id).includes(answer)) {
                selection = this.$store.getters['quiz/interactionSelection'](this.id).filter(selectionAnswer => selectionAnswer !== answer);
            } else {
                selection = [...this.$store.getters['quiz/interactionSelection'](this.id)];
                selection.push(answer);
            }

            this.$store.commit('quiz/updateInteraction', {
                id: this.id,
                selection
            });

            this.evaluationPermitted = this.markedAnswers.filter(selection => selection).length !== 0;
        },

        retry() {
            this.evaluationPermitted = false;
            this.shuffledAnswers = this.shuffleAnswers([...this.answers]);
            this.$store.commit('quiz/resetInteraction', { id: this.id });
        },

        evaluate() {
            this.$store.commit('quiz/updateInteraction', {
                id: this.id,
                result: this.evaluatedResult
            });

            this.$emit('evaluated', this.evaluatedResult);
        }

    }

};
