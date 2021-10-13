export default ({store}) => {
    store.registerModule('footer', {
        namespaced: true,
        state: () => ({
            list: {},
            visible: true
        }),
        mutations: {
            setList(state, navigation) {
                state.list = navigation;
            },
            show(state) {
                state.visible = true;
            },
            hide(state) {
                state.visible = false;
            }
        },
        actions: {
            async get({ commit }, endpoint) {
                const data = await this.$axios.$get(endpoint);
                commit('setList', data );
            }
        }
    })
}
