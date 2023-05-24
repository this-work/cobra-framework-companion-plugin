/**
 * c-toast
 */

import { common } from '@this/cobra-framework/src/plugins/mixins';

export default {

    name: 'c-toast',

    timer: null,

    mixins: [
        ...common
    ],

    props: {
        tag: {
            type: String,
            default: 'div'
        },
        duration: {
            type: Number,
            default: 3000
        }

    },

    data() {
        return {
            visible: false
        };
    },

    methods: {
        show() {
            this.visible = true;
            clearTimeout(this.$options.timer);
            this.$options.timer = setTimeout(() => {
                this.visible = false;
            }, this.duration);
        }
    }
};
