/**
 * c-input-selectionbutton
 */

import { common } from '@this/cobra-framework/src/plugins/mixins';

export default {

    name: 'c-input-selectionbutton',

    inheritAttrs: false,

    mixins: [
        ...common
    ],

    props: {
        tag: {
            type: String,
            default: 'div'
        },
        label: String,
        icon: String,
        iconPosition: {
            type: String,
            default: 'right'
        }
    },

    computed: {
        checked() {
            return this.$refs.input.checked;
        }
    },

    methods: {
        change(checked) {
            this.$emit('change', checked);
        }
    }
};
