const interactionInitialData = {
    result: undefined,
    selection: []
};
const _findInteraction = (interactions, id) =>
    interactions.find(interaction => interaction.id === id);

export default ({store}) => {
    store.registerModule('quiz', {
        namespaced: true,
        state: () => ({
            instance: null,
            interactions: []
        }),
        getters: {
            interaction: state => id =>
                _findInteraction(state.interactions, id),

            interactionSelection: (state, getters) => id =>
                getters.interaction(id)?.selection || [],

            interactionResult: (state, getters) => id =>
                getters.interaction(id)?.result
        },
        mutations: {
            init: (state, { instance }) => {
                state.instance = instance;
                state.interactions = [];
            },

            addInteraction: (state, { id }) => {
                if (state.interactions.some(interaction => interaction.id === id)) {
                    return;
                }

                state.interactions.push({ ...interactionInitialData, id });
            },

            updateInteraction: (state, { id, result, selection }) => {
                const interaction = _findInteraction(state.interactions, id);

                if (!interaction) {
                    return;
                }

                if (result !== undefined) {
                    interaction.result = result;
                }

                if (selection !== undefined) {
                    interaction.selection = selection;
                }
            },

            resetInteraction: (state, { id }) => {
                const interaction = _findInteraction(state.interactions, id);

                if (!interaction) {
                    return;
                }

                interaction.result = interactionInitialData.result;
                interaction.selection = interactionInitialData.selection;
            }
        }
    })
}
