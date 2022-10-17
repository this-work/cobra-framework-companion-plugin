<script>
/**
 * deprecated-c-choice-interaction
 */

/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */

import BaseInteraction from './BaseInteraction';

export default {

    name: 'deprecated-c-choice-interaction',

    mixins: [BaseInteraction],

    props: {
        selectMultiple: { type: Boolean, default: true }
    },

    provide() {
        return {
            choices: {
                register: this.registerChoice,
                unregister: this.unregisterChoice
            }
        };
    },

    data() {
        return {
            choices: []
        };
    },

    watch: {
        'isDisabled.interactable': {
            handler: function(newState, oldState) {
                this.choices.forEach(choice => choice.disabled = newState);
            }
        }
    },

    computed: {
        selectedChoices() {
            return this.choices.filter(({ selected = false }) => selected);
        },

        correctChoices() {
            return this.choices.filter(({ correct }) => correct);
        },

        evaluationResult() {
            if (this.correctChoices.length === 0) return false;
            if (this.selectedChoices.length !== this.correctChoices.length) return false;

            return this.selectedChoices
                .every(selectedChoice => this.correctChoices.includes(selectedChoice));
        },

        slotProps() {
            return {
                partOfQuiz: this.partOfQuiz,
                retry: this.retry,
                evaluate: this.evaluate,
                solve: this.solve,
                reset: this.reset,
                isDisabled: this.isDisabled,
                isFeedbackVisible: this.isFeedbackVisible,
                selectChoicesWhere: this.selectChoicesWhere.bind(this)
            };
        }
    },

    methods: {
        registerChoice(choice) {
            choice.$on('change', this.onChange);
            this.choices.push(choice);
        },
        unregisterChoice(choice) {
            choice.$off('change', this.onChange);
            this.choices = this.choices.filter(c => c === choice);
        },

        onChange(newValue, oldValue, instance, suppressEvent) {
            if (suppressEvent) return;
            if (!this.selectMultiple) {
                this.selectChoicesWhere(choice => choice === instance);
            }
            // console.log('onChange', newValue, oldValue, suppressEvent);
            this.interact(newValue, oldValue);
        },

        selectChoicesWhere(fn) {
            this.choices.forEach(choice => {
                choice.setSuppressEvent(true);
                choice.selected = typeof fn === 'function' ? fn(choice) : fn;
                this.$nextTick(() => { choice.setSuppressEvent(false); });
            });
        },

        reset() {
            this.selectChoicesWhere(false);

            BaseInteraction.methods.reset.call(this);
        },
        retry() {
            if (this.isDisabled.retry) return;
            this.selectChoicesWhere(false);

            BaseInteraction.methods.retry.call(this);
        },
        solve() {
            if (this.isDisabled.solve) return;
            this.selectChoicesWhere(choice => this.correctChoices.includes(choice));

            BaseInteraction.methods.solve.call(this);
        }
    },

    render() {
        return [...this?.$scopedSlots?.default(this.slotProps)];
    }

};
</script>
