/**
 * m-multiple-choice-interaction
 */

import { common, theme, background } from '@this/cobra-framework/src/plugins/mixins';
import { spacingProps, spacingClass } from '@this/cobra-framework/src/plugins/mixins/spacing';

export default {

    name: 'm-multiple-choice-interaction',

    mixins: [ ...common, theme, background ],

    props: {
        ...spacingProps,
        layout: { type: String, default: 'l-12' },
        alignment: String,
        points: Number,
        retries: Number,
        answers: Array,
        buttons: Object,
        feedbacks: Object,
        question: Object,
        type: String,

        scroll: { type: Boolean, default: true }
    },

    data() {
        return {
            uid: Math.floor(Date.now() * Math.random()).toString(16)
        };
    },

    computed: {
        headingLayout() {
            if (this.alignment === 'center') {
                return { layout: 'l-1-10-1', slot: 'column-2' };
            }

            return { layout: 'l-10-2', slot: 'column-1' };
        },
        interactionLayout() {
            if (this.hasAnswerImages) {
                return { layout: 'l-12', slot: 'column-1' };
            }

            if (this.alignment === 'center') {
                return { layout: 'l-2-8-2', slot: 'column-2' };
            }

            return { layout: 'l-10-2', slot: 'column-1' };
        },
        shuffledAnswers() {
            return this.answers.sort((a, b) => 0.5 - Math.random());
        },
        hasAnswerImages() {
            if (!this.answers) {
                return false;
            }

            return this.answers.some(this.hasAnswerImage);
        }
    },

    methods: {
        spacingClass,

        hasAnswerImage(answer) {
            return answer.asset && answer.asset.image;
        }
    }
};
