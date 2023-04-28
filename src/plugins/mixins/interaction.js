import { spacingClass, spacingProps } from '@this/cobra-framework/src/plugins/mixins/spacing';

export default {

    inheritAttrs: false,

    props: {
        id: {
            type: Number,
            default: Math.floor(Math.random() * 10000)
        },
        tag: {
            type: String,
            default: 'div'
        },
        resolved: {
            type: Boolean,
            default: false
        },
        ...spacingProps
    },

    data() {
        return {
            evaluationPermitted: false
        };
    },

    mounted() {
        this.$store.commit('quiz/addInteraction', { id: this.id });
    },

    computed: {
        blockClasses() {
            return [
                spacingClass('padding', 'top', this.spacingPaddingTop),
                spacingClass('padding', 'bottom', this.spacingPaddingBottom)
            ];
        }
    }

};
