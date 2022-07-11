/**
 * c-timebox
 */

import { common } from '../../../plugins/mixins';

export default {

    name: 'c-timebox',

    mixins: [
        ...common
    ],

    props: {
        tag: {
            type: String,
            default: 'span'
        },
        readingTime: {
            type: String,
            default: null
        },
        completed: {
            type: Boolean,
            default: false
        }
    },

    computed: {
        blockClasses() {
            const className = this.$options.name;
            return {
                [`${className}--readed`]: this.readed
            };
        }
    },

    methods: {

    }
};
