export default ({store}) => {
    store.registerModule('header', {
        namespaced: true,
        state: () => ({
            type: 'default',
            playlistNavigationList: {}
        }),
        mutations: {
            type: function(state, type) {
                state.type = type;
            },
            setPlaylistNavigationList: function(state, navigation) {
                state.playlistNavigationList = navigation;
            }
        }
    })
}
