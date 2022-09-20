/**
 * c-tile
 */

import { common } from '@this/cobra-framework/src/plugins/mixins';
import { SwiperSlide } from 'vue-awesome-swiper';
import { completed } from '@this/cobra-framework-companion-plugin/src/plugins/vanilla/status-helper';

export default {

    name: 'c-tile',

    inheritAttrs: false,

    components: {
        SwiperSlide
    },

    mixins: [
        ...common
    ],

    props: {
        tag: {
            type: String,
            default: 'div'
        },
        id: Number,
        mainCategories: Array,
        type: {
            type: String,
            default: 'default'
        },
        readingTime: {
            type: String,
            default: null
        },
        locked: {
            type: Boolean,
            default: false
        },
        popup: Object,
        image: Object,
        overline: String,
        headline: String,
        url: String,
        externalUrl: String
    },

    data() {
        return {
            quizAspectRatio: { 0: '166:226', 380: '350:476', 768: '275:374', 1000: '322:438', 1200: '256:347' }
        };
    },

    computed: {
        blockClasses() {
            const className = this.$options.name;
            return {
                [`${className}--type-${this.type}`]: true,
                [`${className}--locked`]: this.locked
            };
        },
        aspectRatios() {

            if (this.type === 'quiz') {
                return this.quizAspectRatio;
            }

            if (this.image && this.image.aspectRatios) {
                return this.image.aspectRatios;
            }

            return {};
        },
        completed() {
            return completed(this.id);
        }
    },

    methods: {
        checkForModal(event) {
            if (this.popup) {
                event.preventDefault();
                this.$refs.popup.open();
            }
        }
    }
};
