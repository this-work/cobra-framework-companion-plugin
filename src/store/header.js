export default ({store}) => {
    store.registerModule('header', {
        namespaced: true,
        state: () => ({
            visible: true,
            theme: 'light',
            navigation: true,
            close: false,
            closeUrl: '/',
            back: false,
            backUrl: null
        }),
        mutations: {
            navigation: (state, payload) => {
                state.navigation = payload.navigation === undefined ? true : payload.navigation;
            },
            settings: (state, payload) => {
                state.visible = payload.visible === undefined ? true : payload.visible;
                state.theme = payload.theme || 'light';
                state.navigation = payload.navigation === undefined ? true : payload.navigation;
                state.close = payload.close === undefined ? false : payload.close;
                state.closeUrl = payload.close === undefined ? '/' : payload.closeUrl;
                state.back = payload.back === undefined ? false : payload.back;
                state.backUrl = payload.backUrl === undefined ? null : payload.backUrl;
            }
        },
        getters: {
            visible: state => state.visible,
            theme: state => state.theme,
            navigation: state => state.navigation,
            close: state => state.close,
            closeUrl: state => state.closeUrl,
            back: state => state.back,
            backUrl: state => state.backUrl,
        }
    })
}
