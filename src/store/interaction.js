export default ({ store }) => {
    store.registerModule('interaction', {
        namespaced: true,
        state: () => ({
            instance: null,
            states: []
        }),
        getters: {
            getState: state => id => {
                return state.states.find(interaction => interaction.id === id)?.state;
            },

            options: (state, getters) => id => {
                return getters.getState(id)?.options;
            },

            selection: (state, getters) => id => {
                return getters.getState(id)?.selection || [];
            },

            result: (state, getters) => id => {
                return getters.getState(id)?.result;
            },

            getStates: state => {
                return state.states;
            }
        },
        mutations: {
            add: (state, { instance, id, state: interactionState }) => {
                if (state.instance !== instance) {
                    state.instance = instance;
                    state.states = [];
                }

                if (!state.states.some(state => state.id === id)) {
                    state.states.push({
                        id,
                        state: interactionState
                    });
                }
            },

            update: (state, { id, state: { options, selection, result } }) => {
                const interactionState = state.states.find(state => state.id === id).state;

                if (typeof options !== 'undefined') interactionState.options = options;
                if (typeof selection !== 'undefined') interactionState.selection = selection;
                if (typeof result !== 'undefined') interactionState.result = result;
            },

            reset: (state, { instance, id, state: interactionState }) => {
                state.states.forEach(state => {
                    state.state.selection = null;
                    state.state.result = null;
                });
            }
        },
    });
};
