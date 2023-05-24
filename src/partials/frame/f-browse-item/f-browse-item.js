/**
 * f-browse-item
 */
import common from '@this/cobra-framework/src/plugins/mixins';

export default {
    name: 'f-browse-item',

    mixins: [
        ...common
    ],

    props: {
        tag: {
            type: String,
            default: 'label'
        },
        name: String|Number,
        checked: {
            type: Boolean,
            default: false
        },
        big: {
            type: Boolean,
            default: false
        },
        handleChange: {
            type: Function,
            default: () => {}
        }
    },

    data() {
        return {
            value: this.checked
        };
    },

    computed: {
        getClasses() {
            return [
                this.blockClasses,
                {
                    [this.modifier('big')]: this.big
                }
            ];
        },

        getLabelClasses() {
            return [
                this.element('label'),
                {
                    [this.elementModifier('label', 'big')]: this.big
                }
            ];
        }
    },

    watch: {
        checked(isChecked) {
            this.value = isChecked;
        }
    }
};
