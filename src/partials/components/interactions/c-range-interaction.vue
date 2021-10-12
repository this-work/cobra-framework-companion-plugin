<script>
/**
 * c-range-interaction
 */
import BaseInteraction from './BaseInteraction';

export default {

    name: 'c-range-interaction',

    mixins: [BaseInteraction],

    props: {
        unit: { type: String },
        minValue: { type: Number },
        maxValue: { type: Number },
        minLabel: { type: String },
        maxLabel: { type: String },
        initialValue: { type: Number },
        step: { type: Number },
        correctMinValue: { type: Number },
        correctMaxValue: { type: Number },
        correctValue: { type: Number },
        correctThreshold: { type: Number, default: 0 }
    },

    data() {
        return {
            value: this.$props.initialValue ?? this.minValue ?? 0
        };
    },

    computed: {
        evaluationResult() {
            if (this.value < this.minValue
                || this.value < this._correctMinValue
                || this.value > this.maxValue
                || this.value > this._correctMaxValue
            ) return false;

            return true;
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

        slotProps() {
            return {
                $props: this.$props,
                $data: this.$data,
                isFeedbackVisible: this.isFeedbackVisible,
                partOfQuiz: this.partOfQuiz,
                retry: this.retry,
                evaluate: this.evaluate,
                solve: this.solve,
                reset: this.reset,
                interact: this.interact,
                isDisabled: this.isDisabled
            };
        }
    },

    methods: {
        reset() {
            this.value = this.initialValue;

            BaseInteraction.methods.reset.call(this);
        },
        retry() {
            if (this.isDisabled.retry) return;
            this.value = this.initialValue;

            BaseInteraction.methods.retry.call(this);
        },
        solve() {
            if (this.isDisabled.solve) return;

            this.value = !isNaN(this.correctValue)
                ? this.correctValue
                : ((this.correctMaxValue - this.correctMinValue) / 2) + this.correctMinValue;

            BaseInteraction.methods.solve.call(this);
        }
    },

    render() {
        return [...this?.$scopedSlots?.default(this.slotProps)];
    }

};
</script>
