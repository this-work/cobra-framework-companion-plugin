
import { common } from '@this/cobra-framework/src/plugins/mixins';

export default {

    mixins: [...common],

    props: {
        feedbackType: {
            type: String,
            required: true,
            validator(value) {
                return [ 'positive', 'negative', 'solution' ].includes(value);
            }
        },
        headline: { type: String, default: null },
        text: { type: String, default: null },
        icon: { type: String, default: null }
    },

    inject: {
        feedbacks: { from: 'feedbacks', default: null }
    },

    data() {
        return {
            visible: false
        };
    },

    created() {
        if (this.feedbacks) {
            this.feedbacks.register(this);
        }
    },

    destroyed() {
        if (this.feedbacks) {
            this.feedbacks.unregister(this);
        }
    }

};
