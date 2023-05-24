export default ({store}) => {
    store.registerModule('companion', {
        namespaced: true,
        state: () => ({
            layout: ''
        }),
        mutations: {
            layout: (state, layout) => state.layout = layout
        },
        getters: {
            layout(state) {
                return state.layout;
            }
        }
    })
}
