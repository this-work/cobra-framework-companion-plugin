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
                [`interaction`]: true
            };
        },

        markedAnswers() {
            if (this.resolved) {
                return this.answers.map(answer => !!answer.correct);
            }

            return this.answers.map(answer => this.$store.getters['interaction/selection'](this.id).includes(answer));
        }

    },

    methods: {

        evaluate(answer) {
            this.$store.commit('interaction/update', {
                id: this.id,
                state: {
                    selection: [answer],
                    result: !!answer.correct
                }
            });

            this.$emit('evaluated', !!answer.correct);
        },

        retry() {
            this.$store.commit('interaction/update', {
                id: this.id,
                state: {
                    selection: null,
                    result: null
                }
            });
        }
    }

};
