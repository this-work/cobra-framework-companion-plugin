/**
 * i-value-slider
 */

import { common } from '@this/cobra-framework/src/plugins/mixins';
import interaction from '../../../plugins/mixins/interaction';

export default {

    name: 'i-value-slider',

    mixins: [
        ...common,
        interaction
    ],

    props: {
        unit: String,
        minValue: Number,
        maxValue: Number,
        minLabel: String,
        maxLabel: String,
        initialValue: Number,
        step: Number,
        correctMinValue: Number,
        correctMaxValue: Number,
        correctValue: Number,
        correctThreshold: {
            type: Number,
            default: 0
        }
    },

    data() {
        return {
            buttonLabelEvaluate: this.$t('interactions--button-evaluate'),
            value: this.getValue(this.$props.resolved)
        };
    },

    computed: {

        blockClasses() {
            return {
                [`interaction`]: true,
                [`${this.$options.name}--readonly`]: this.resolved
            };
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
        },

        evaluatedResult() {
            return this.value >= this.minValue
                && this.value >= this._correctMinValue
                && this.value <= this.maxValue
                && this.value <= this._correctMaxValue;
        }

    },

    methods: {

        focus() {
            this.evaluationPermitted = true;
        },

        getValue(resolved) {
            if (resolved) return this.correctValue;
            if (this.initialValue) return this.initialValue;
            if (this.minValue) return this.minValue;

            return 0;
        },

        retry() {
            this.evaluationPermitted = false;

            if (this.initialValue) {
                this.value = this.initialValue;
            }
            else if (this.minValue) {
                this.value = this.minValue;
            }
            else {
                this.value = 0;
            }

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
                    selection: [this.value],
                    result: this.evaluatedResult
                }
            });

            this.$emit('evaluated', this.evaluatedResult);
        }

    },

    watch: {
        resolved(newValue) {
            this.value = this.getValue(newValue);
        }
    }

};
