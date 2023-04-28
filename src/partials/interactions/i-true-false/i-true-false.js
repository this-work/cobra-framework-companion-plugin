/**
 * i-true-false
 */

import { common } from '@this/cobra-framework/src/plugins/mixins';
import interaction from '../../../plugins/mixins/interaction';

export default {

    name: 'i-true-false',

    mixins: [
        ...common,
        interaction
    ],

    props: {
        answers: Array
    },

    computed: {

        blockClasses() {
            return {
                [`interaction`]: true,
                [`${this.$options.name}--readonly`]: this.resolved
            };
        },

        markedAnswers() {
            if (this.resolved) {
                return this.answers.map(answer => !!answer.correct);
            }

            return this.answers.map(answer => this.$store.getters['quiz/interactionSelection'](this.id).includes(answer));
        }

    },

    methods: {

        evaluate(answer) {
            this.$store.commit('quiz/updateInteraction', {
                id: this.id,
                selection: [answer],
                result: !!answer.correct
            });

            this.$emit('evaluated', !!answer.correct);
        },

        retry() {
            this.$store.commit('quiz/resetInteraction', { id: this.id });
        }
    }

};
