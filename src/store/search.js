export default ({store}) => {
    store.registerModule('search', {
        namespaced: true,
        state: () => ({
            loading: true,
            tags: [],
            relatedTags: [],
            searchResults: []
        }),
        mutations: {
            loading: function(state, bool) {
                state.loading = bool;
            },
            setTags: function(state, tags) {
                state.tags = tags;
            },
            setRelatedTags: function(state, tags) {
                state.relatedTags = tags;
            },
            setSearchResults: function(state, results) {
                state.searchResults = results;
            }
        },
        actions: {
            async getTags({ commit }, endpoint) {

                const { data } = await this.$axios.get(endpoint);

                commit('setTags', data.data.map(item => {
                    return {
                        'key': item.id,
                        'value': item.title
                    };
                }));
            },
            async getRelatedTags({ commit, state }, categories, endpoint) {

                if (categories.length > 0) {
                    const { data } = await this.$axios.get(endpoint, {
                        params: {
                            catids: categories.join(',')
                        }
                    });

                    const filteredTags = [];
                    data.data.forEach(item => {
                        filteredTags.push(state.tags.find(tag => tag.key === item ));
                    });

                    commit('setRelatedTags', filteredTags );
                }

            },
            async getSearchResults({ commit }, given) {

                const { data } = await this.$axios.get(given.endpoint, {
                    params: {
                        q: given.tags.map(tag => {
                            return tag['value'];
                        }).filter(item => item !== undefined).join(' ')
                    }
                });

                commit('setSearchResults', data.data );

            }
        }
    })
}
