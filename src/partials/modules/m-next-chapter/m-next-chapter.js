/**
 * m-next-chapter
 */

import { common, spacing, theme, background } from '@this/cobra-framework/src/plugins/mixins';

export default {

    name: 'm-next-chapter',

    mixins: [
        ...common,
        spacing,
        theme,
        background
    ],

    props: {
        layout: {
            type: String,
            default: 'l-0'
        },
        text: {
            type: String
        },
        overview: Object,
        nextChapter: Object
    },

    computed: {
        blockClasses() {
            return {
                [`${this.$options.name}--only-back`]: (!this.nextChapter)
            };
        },
        getSlotName() {
            return 'column-1';
        }
    },

    methods: {
    }
};
