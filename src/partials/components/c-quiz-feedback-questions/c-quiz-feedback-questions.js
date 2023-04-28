/**
 * c-quiz-feedback-questions
 */

import { common } from '@this/cobra-framework/src/plugins/mixins';

export default {

    name: 'c-quiz-feedback-questions',

    mixins: [
        ...common
    ],

    props: {
        questions: {
            type: Array,
            required: true
        }
    },

    methods: {
        getQuestionClasses(result) {
            const markerModifier = result ? 'correct' : 'incorrect';

            return [
                this.element('answer-marker'),
                this.elementModifier('answer-marker', markerModifier)
            ];
        },

        getQuestionIcon(result) {
            return result ? 'check' : 'close';
        }
    }
};
