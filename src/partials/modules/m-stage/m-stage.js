/**
 * m-stage
 */

import { common, spacing, theme, background, alignment } from '@this/cobra-framework/src/plugins/mixins';
export default {

    name: 'm-stage',

    mixins: [
        ...common,
        spacing,
        theme,
        background,
        alignment
    ],

    props: {
        mode: {
            type: String,
            default: 'overflow',
            validate: value => [ 'overflow', 'stacked' ].includes(value)
        },
        order: {
            type: String,
            default: 'media-first',
            validate: value => [ 'media-first', 'text-first' ].includes(value)
        },
        image: Object,
        video: Object,
        heading: Object,
        layoutArea: {
            type: String,
            default: 'viewport'
        }
    },

    data() {
        return {
            headingHidden: false
        };
    },

    computed: {
        blockClasses() {
            const className = this.$options.name;

            return {
                [`${className}--order-${this.order}`]: true,
                [`${className}--mode-${this.mode}`]: true,
                [`${className}--hide-heading`]: this.headingHidden
            };
        }
    },

    methods: {

        startedFromPoster() {
            if (this.mode === 'overflow') {
                this.headingHidden = true;
            }
        },

        endVideo() {
            if (this.mode === 'overflow') {
                this.headingHidden = false;
            }
        },

        getLayoutName() {
            if (this.alignment === 'right') {
                return 'l-2-10';
            } else if (this.alignment === 'center') {
                return 'l-1-10-1';
            } else {
                return 'l-10-2';
            }
        },
        getSlotName() {
            if (this.getLayoutName() === 'l-1-10-1' || this.getLayoutName() === 'l-2-10') {
                return 'column-2';
            } else {
                return 'column-1';
            }
        },
        getMediaWidth() {
            if (this.layoutArea === 'page' || this.mode === 'stacked') {
                return 'module-page';
            } else if (this.layoutArea === 'content') {
                return 'module-content';
            } else {
                return 'module-viewport';
            }
        },
        getMediaComponent() {
            if (this.video) {
                return 'c-video';
            } else if (this.image) {
                return 'c-image';
            } else {
                return false;
            }
        },
        getMediaData() {
            if (this.video) {
                return this.video;
            } else if (this.image) {
                return this.image;
            } else {
                return false;
            }
        }
    }
};
