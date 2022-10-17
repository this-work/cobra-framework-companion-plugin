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
        this.$store.commit('interaction/add', {
            id: this.id,
            instance: this.$route.path.replaceAll('/', ''), // besserer hash code wäre besser
            state: {
                options: {
                    ...this.$props
                },
                selection: null     // []
            }
        });
    },

    computed: {
        blockClasses() {
            return {
                [spacingClass('padding', 'top', this.spacingPaddingTop)]: true,
                [spacingClass('padding', 'bottom', this.spacingPaddingBottom)]: true
            };
        }
    }

};
