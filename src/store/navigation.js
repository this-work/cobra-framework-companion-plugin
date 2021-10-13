export default ({store}) => {
    store.registerModule('navigation', {
        namespaced: true,
        state: () => ({
            list: {},
            visible: false
        }),
        mutations: {
            visible: function(state, bool) {
                state.visible = bool;
            },
            setList: function(state, navigation) {
                state.list = navigation;
            },
        },
        actions: {
            async get({ commit }, endpoint) {
                const data = await this.$axios.$get(endpoint);
                commit('setList', data );
            }
        }
    })
}
