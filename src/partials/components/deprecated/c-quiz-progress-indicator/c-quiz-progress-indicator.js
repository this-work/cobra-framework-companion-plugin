/**
 * deprecated-c-quiz-progress-indicator
 */
import { common, theme } from '@this/cobra-framework/src/plugins/mixins';
import _chunk from 'lodash.chunk';

export default {

    name: 'deprecated-c-quiz-progress-indicator',

    mixins: [ ...common, theme ],

    props: {
        score: { type: Number, default: 0 },
        maxScore: { type: Number, default: 0 },
        activeIndex: { type: Number, default: 0 },
        labelTemplate: { type: String },
        interactions: { type: Array },
        chunkSize: { type: Number, default: 10 }
    },

    computed: {
        states() {
            if (this.interactions) {
                return this.interactions.map(interaction => {
                    if (interaction && interaction.$refs) {
                        return interaction.$refs.interaction
                    } else {
                        return false;
                    };
                })
                    .map((interaction, index) => {
                        if (!interaction) {
                            return {
                                active: index === this.activeIndex,
                                success: false,
                                failed: false
                            };
                        }

                        return {
                            active: index === this.activeIndex,
                            // evaluated: interaction.state === 'EVALUATED',
                            success: interaction.state === 'EVALUATED' && interaction.evaluationResult,
                            failed: interaction.state === 'EVALUATED' && !interaction.evaluationResult
                        };
                    });
            } else {
                return false;
            }
        },

        stateChunks() {
            return _chunk(this.states, this.chunkSize);
        },

        labelText() {
            return this.labelTemplate
                .replace('{score}', this.score)
                .replace('{maxScore}', this.maxScore);
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
