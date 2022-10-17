<script>
/**
 * deprecated-c-choice
 */

/* eslint-disable no-unused-vars */
import { common } from '@this/cobra-framework/src/plugins/mixins';

export default {

    name: 'deprecated-c-choice',

    mixins: [...common],

    props: {
        correct: { type: Boolean, required: true, default: false },
        renderless: { type: Boolean, default: true }
    },

    inject: {
        choices: { from: 'choices', default: null }
    },

    data() {
        return {
            selected: false,
            disabled: false,
            readonly: false,
            value: null
        };
    },

    watch: {
        selected(newValue, oldValue) {
            if (this.suppressEvent) return;
            this.$emit('change', newValue, oldValue, this, this.suppressEvent);
        }
    },

    computed: {
        blockClasses() {
            return {
                [this.modifier('disabled')]: this.disabled,
                [this.modifier('readonly')]: this.readonly,
                [this.modifier('selected')]: this.selected
            };
        },
        slotProps() {
            return {
                $props: this.$props, // preserve reactivity
                $data: this.$data, // preserve reactivity
                methods: {
                    updateSelected: this.updateSelected
                }
            };
        }
    },

    methods: {
        updateSelected(value) {
            this.selected = value;
        },
        setSuppressEvent(value) {
            this.suppressEvent = value;
        }
    },

    created() {
        this.suppressEvent = false;
        this?.choices.register(this);
    },

    destroyed() {
        this?.choices.unregister(this);
    },

    render() {
        if (this.renderless) return this?.$scopedSlots?.default(this.slotProps);

        return (
            <span class={this.blockClasses}>
                {this?.$scopedSlots?.default(this.slotProps)}
            </span>
        );
    }

};
</script>

<style lang="scss">
.deprecated-c-choice {
    position: relative;
    cursor: pointer;

    &--selected {}

    &--disabled {
        cursor: not-allowed;
    }
}
</style>
