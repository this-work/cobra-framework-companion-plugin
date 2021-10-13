/**
 * m-quiz-feedback
 */

import { common, spacing, theme, background } from '@this/cobra-framework/src/plugins/mixins';
import BaseFeedback from '../../components/interactions/BaseFeedback';

export default {

    name: 'm-quiz-feedback',

    mixins: [
        ...common,
        spacing,
        theme,
        background,

        BaseFeedback
    ],

    watch: {
        visible: {
            immediate: true,
            handler: function(newValue) {
                this.$emit('visible', newValue);
            }
        }
    },

    props: {
        progressIndicator: { type: Object },
        button: { type: Object }
    },

    computed: {

        iconAttrs() {
            const icon = {
                size: '140px',
                borderRadius: '50%',
                fill: 'white',
                padding: '10'
            };

            if (this.feedbackType === 'positive') {
                Object.assign(icon, {
                    background: this.$style.success,
                    name: 'check'
                });
            }

            if (this.feedbackType === 'negative') {
                Object.assign(icon, {
                    background: this.$style.error,
                    name: 'close'
                });
            }

            if (this.feedbackType === 'solution') {
                Object.assign(icon, {
                    background: this.$style.darkDeco,
                    name: 'visibility'
                });
            }

            return icon;
        }

    },

    methods: {
    }
};
