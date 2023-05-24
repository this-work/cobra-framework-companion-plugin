import Gateway from '@/plugins/gateway';

export default ({store}) => {
    store.registerModule('navigations', {
        namespaced: true,
        state: () => ({
            main: [],
            footer: [],
            buildKey: 0
        }),
        mutations: {
            main: (state, main) => state.main = main.hasOwnProperty('menu') ? main.menu : main.links,
            footer: (state, footer) => state.footer = footer.links,
            buildKey: (state, buildKey) => state.buildKey = buildKey,
        },
        getters: {
            main(state) {
                return state.main;
            },
            footer(state) {
                return state.footer;
            },
            buildKey(state) {
                return state.buildKey;
            },
        },
        actions: {
            updateBuildKey({ commit }) {
                commit('buildKey', Date.now() );
            },

            async fetch({ commit, state, dispatch }, { name, force = false }) {

                if (state[name].length <= 0 || force) {
                    const connection = new Gateway({
                        context: this,
                        process: process,
                        type: 'navigations',
                        path: '/' + name
                    });
                    const navigationCollection = await connection.getContent();

                    dispatch('updateBuildKey');

                    commit(name, navigationCollection );
                }

            }
        }
    })
}
