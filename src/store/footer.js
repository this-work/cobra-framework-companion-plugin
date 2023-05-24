export default ({store}) => {
    store.registerModule('footer', {
        namespaced: true,
        state: () => ({
            visible: true,
            theme: 'light'
        }),
        mutations: {
            settings: (state, payload) => {
                state.visible = payload.visible === undefined ? true : payload.visible;
                state.theme = payload.theme || 'light';
            }
        },
        getters: {
            visible: state => state.visible,
            theme: state => state.theme
        }
    })
}
