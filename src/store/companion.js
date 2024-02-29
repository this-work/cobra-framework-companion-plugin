export default ({store}) => {
    store.registerModule('companion', {
        namespaced: true,
        state: () => ({
            layout: '',
            entryId: 0
        }),
        mutations: {
            layout: (state, layout) => state.layout = layout,
            entryId: (state, entryId) => state.entryId = parseInt(entryId)
        },
        getters: {
            layout(state) {
                return state.layout;
            },
            entryId(state) {
                return state.entryId;
            }
        }
    })
}
