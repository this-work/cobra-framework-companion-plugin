/**
 * m-true-false-interaction
 */

import { common, theme, background } from '@this/cobra-framework/src/plugins/mixins';
import { spacingProps, spacingClass } from '@this/cobra-framework/src/plugins/mixins/spacing';

export default {

    name: 'm-true-false-interaction',

    mixins: [ ...common, theme, background ],

    props: {
        ...spacingProps,

        layout: { type: String, default: 'l-12' },
        alignment: { type: String, default: 'center' },
        points: Number,
        retries: Number,
        answers: Array,
        buttons: Object,
        feedbacks: Object,
        question: Object,
        type: String,

        scroll: { type: Boolean, default: true }
    },

    computed: {

        headingLayout() {
            return { layout: 'l-1-10-1', slot: 'column-2' };
        },
        interactionLayout() {
            return { layout: 'l-2-8-2', slot: 'column-2' };
        }

    },

    methods: {
        spacingClass,

        selectAndEvaluate(index) {
            this.$refs.interaction.choices[index].selected = true;

            this.$nextTick(() => {
                this.$refs.interaction.evaluate();
            });
        }
    }
};
