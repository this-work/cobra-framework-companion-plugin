/**
 * c-quiz-progress-indicator
 */
import { common, theme } from '@this/cobra-framework/src/plugins/mixins';
import _chunk from 'lodash.chunk';

export default {

    name: 'c-quiz-progress-indicator',

    mixins: [ ...common, theme ],

    props: {
        score: { type: Number, default: 0 },
        maxScore: { type: Number, default: 0 },
        activeIndex: { type: Number, default: 0 },
        labelTemplate: { type: String },
        states: { type: Array, required: true },
        questionLength: { type: Number, required: true }
    },

    computed: {
        indicatorStates() {
            if (!this.states) {
                return false;
            }

            const indicatorStates = this.states.map((state, index) => ({
                active: index === this.activeIndex,
                success: state.result,
                failed: !state.result
            }));

            for (let i = indicatorStates.length; i < this.questionLength; i++) {
                indicatorStates.push({
                    active: i === this.activeIndex,
                    success: false,
                    failed: false
                });
            }

            return indicatorStates;
        },

        labelText() {
            return this.labelTemplate
                .replace('{score}', this.score.toString())
                .replace('{maxScore}', this.maxScore.toString());
        }
    },

    methods: {
        mapObjectKeys(obj, fn) {
            const entries = Object
                .entries(obj)
                .map(([ key, value ]) => [ fn(key), value ]);

            return Object.fromEntries(entries);
        },

        stateClasses(state) {
            return {
                [this.element('state')]: true,
                ...this.mapObjectKeys(state, key => this.elementModifier('state', key))
            };
        }
    }
};
