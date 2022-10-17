<script>
import BaseInteraction, { interactionState } from './BaseInteraction';

/**
 * deprecated-c-quiz
 */
export default {

    name: 'deprecated-c-quiz',

    mixins: [BaseInteraction],

    props: {
        id: { type: [ Number, String ], required: true },
        randomize: { type: Boolean, default: false },
        limit: { type: Number, default: Number.POSITIVE_INFINITY, validator(value) { return value >= 0; } },

        passThreshold: { type: Number, default: 0.75 },
        labels: { type: Object },
        tag: { type: String, default: 'div' }
    },

    provide() {
        return {
            quiz: {
                registerInteraction: this.registerInteraction,
                unregisterInteraction: this.unregisterInteraction
            }
        };
    },

    data() {
        return {
            interactions: []
        };
    },

    computed: {
        maxPoints() {
            return this.interactions.reduce((sum, interaction) => sum + interaction.points, 0);
        },

        evaluatedInteractions() {
            return [].concat(this.interactions)
                .filter(({ state }) => state === 'EVALUATED');
        },

        unevaluatedInteractions() {
            return [].concat(this.interactions)
                .filter(({ state }) => state !== 'EVALUATED');
        },

        correctEvaluatedInteractions() {
            return this.evaluatedInteractions
                .filter(({ evaluationResult }) => evaluationResult);
        },

        falseEvaluatedInteractions() {
            return this.evaluatedInteractions
                .filter(({ evaluationResult }) => !evaluationResult);
        },
        score() {
            const points = this.correctEvaluatedInteractions.reduce((sum, { points }) => sum + points, 0);

            return points / this.maxPoints;
        },

        evaluationResult() {
            return this.score >= this.passThreshold;
        },

        slotProps() {
            return {
                randomize: this.randomize,
                limit: this.limit,
                interactions: this.interactions,
                isDisabled: this.isDisabled,
                retry: this.retry,
                correctEvaluatedInteractions: this.correctEvaluatedInteractions,
                falseEvaluatedInteractions: this.falseEvaluatedInteractions,
                score: this.score,
                maxPoints: this.maxPoints
            };
        }
    },

    methods: {
        registerInteraction(interaction) {
            interaction.$on('change', this.handleInteractionChanged);
            this.interactions.push(interaction);
        },
        unregisterInteraction(interaction) {
            interaction.$off('change', this.handleInteractionChanged);
            this.interactions = this.interactions.filter(i => i !== interaction);
        },
        handleInteractionChanged() {
            if (this.interactions.every(({ state }) => state === interactionState.INITIAL)) { this.state = interactionState.INITIAL; return; }
            if (this.interactions.every(({ state }) => state === interactionState.SOLVED)) { this.state = interactionState.SOLVED; return; }
            if (this.interactions.every(({ state }) => state === interactionState.EVALUATED)) { this.evaluate(); return; }

            this.state = interactionState.INTERACTED;
        },

        reset() {
            BaseInteraction.methods.reset.call(this);
            this.interactionsInvoke('reset');
        },
        retry() {
            BaseInteraction.methods.retry.call(this);
            this.interactionsInvoke('retry');
        },
        solve() {
            BaseInteraction.methods.solve.call(this);
            this.interactionsInvoke('solve');
        },
        evaluate() {
            BaseInteraction.methods.evaluate.call(this);
        },

        interactionsInvoke(action) {
            this.interactions
                .forEach(interaction => interaction[action]());
        }

    },

    render() {
        if (!this.$scopedSlots.default) return;

        // trim tagless vnodes
        // const vnodes = this.$scopedSlots.default({});
        // .filter(({ tag }) => tag);

        // vnodes = this.randomize
        //     ? shuffle(vnodes)
        //     : vnodes;

        // console.log(vnodes);
        // vnodes = vnodes.slice(0, this.limit);

        // if (this.renderless) return this?.$scopedSlots?.default(this.slotProps);

        const Component = `${this.tag}`;

        return (
            <Component class={this.blockClasses}>
                {this?.$scopedSlots?.default(this.slotProps)}
            </Component>
        );
    }

};
</script>
