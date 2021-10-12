/**
 * m-value-slider-interaction
 */

import { common, theme, background } from '@this/cobra-framework/src/plugins/mixins';
import { spacingProps, spacingClass } from '@this/cobra-framework/src/plugins/mixins/spacing';

export default {

    name: 'm-value-slider-interaction',

    mixins: [ ...common, theme, background ],

    props: {
        ...spacingProps,

        layout: { type: String, default: 'l-12' },
        alignment: String,
        type: String,
        question: Object,
        answers: Array,
        buttons: Object,
        feedbacks: Object,

        points: { type: Number },
        retries: { type: Number },
        minValue: { type: Number },
        maxValue: { type: Number },
        minLabel: { type: String },
        maxLabel: { type: String },
        step: { type: Number },
        initialValue: { type: Number },
        correctMinValue: { type: Number },
        correctMaxValue: { type: Number },
        correctValue: { type: Number },
        correctThreshold: { type: Number },

        unit: { type: String },

        scroll: { type: Boolean, default: true }
    },

    computed: {
        headingLayout() {
            return { layout: 'l-1-10-1', slot: 'column-2' };
        },
        interactionLayout() {
            return { layout: 'l-2-8-2', slot: 'column-2' };
        },

        _correctMinValue() {
            return !isNaN(this.correctMinValue)
                ? this.correctMinValue
                : this.correctValue - this.correctThreshold;
        },
        _correctMaxValue() {
            return !isNaN(this.correctMaxValue)
                ? this.correctMaxValue
                : this.correctValue + this.correctThreshold;
        }
    },

    methods: {
        spacingClass
    }

};
