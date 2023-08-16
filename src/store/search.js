export default ({ store }) => {
    store.registerModule('search', {
        namespaced: true,
        state: () => ({
            tags: [],
            types: [],
            searchCategories: [],
            searchResults: []
        }),
        mutations: {
            setTags: function(state, tags) {
                state.tags = tags;
            },
            setTypes: function(state, types) {
                state.types = types;
            },
            setSearchCategories: function(state, results) {
                state.searchCategories = results;
            },
            setSearchResults: function(state, results) {
                state.searchResults = results;
            }
        },
        actions: {

            async fetch({ commit, state }, { query = '*', selectedTags, customFilter, customAggregation } = {}) {

                const response = await this.$elastic.search(query, {
                    fields: ['*'],
                    queryFields: this.$config.API_ELASTIC_SEARCH_QUERY_FIELDS,
                    index: this.$config.API_ELASTIC_SEARCH_PREFIX + this.$i18n.localeProperties.siteId
                }, {
                    'aggs': {
                        'categories': {
                            'terms': {
                                'field': 'categories',
                                'size': 100
                            }
                        },
                        'types': {
                            'terms': {
                                'field': 'type',
                                'size': 100
                            }
                        },
                        ...customAggregation
                    },
                    'filter': {
                        'bool': {
                            'must': [
                                {
                                    'term': {
                                        'searchable': true
                                    }
                                }
                            ],
                            ...customFilter
                        }
                    }
                });

                if (response && response.aggregations && response.aggregations.categories) {

                    commit('setTags', response.aggregations.categories.buckets.map(tag => {
                        return {
                            'key': tag.key.replace(/[^a-zA-Z]+/g, '').toLowerCase(),
                            'count': tag.doc_count,
                            'value': tag.key
                        };
                    }).filter(tag => {
                        if (selectedTags) {
                            return !selectedTags.map(selectedTag => selectedTag.replace(/[^a-zA-Z]+/g, '').toLowerCase()).includes(tag.key);
                        }
                        return true;
                    }).sort((a, b) => {

                        const sortIndexA = state.searchCategories.indexOf(a.value.toLowerCase());
                        const sortIndexB = state.searchCategories.indexOf(b.value.toLowerCase());

                        return (sortIndexA > -1 ? sortIndexA : Number.MAX_VALUE) - (sortIndexB > -1 ? sortIndexB : Number.MAX_VALUE);

                    }));
                }

                if (response && response.aggregations && response.aggregations.types) {
                    commit('setTypes', response.aggregations.types.buckets);
                }

                if (response && response.hits && response.hits.hits) {

                    const accessgroups = Object.keys(JSON.parse(sessionStorage.getItem('accessgroups')));
                    const userGroups = Object.values(JSON.parse(sessionStorage.getItem('usergroups')));

                    let searchResults;

                    if (userGroups.indexOf('admin') >= 0 || userGroups.indexOf('editor') >= 0) {

                        searchResults = response.hits.hits.map(hit => {
                            const tile = hit._source;
                            delete tile.accessgroupVisibility;
                            delete tile.accessgroupPopup;
                            return tile;
                        });

                    } else {

                        searchResults = response.hits.hits.filter(hit => {
                            return accessgroups.some(id => hit._source.accessgroups.includes(parseInt(id)))
                                || (!accessgroups.some(id => hit._source.accessgroups.includes(parseInt(id)))
                                    && hit._source.accessgroupVisibility === 'locked');
                        }).map(hit => {
                            const tile = hit._source;
                            if (!accessgroups.some(id => tile.accessgroups.includes(parseInt(id)))) {
                                tile.locked = true;
                                tile.popup = JSON.parse(tile.accessgroupPopup);
                            }

                            delete tile.accessgroupVisibility;
                            delete tile.accessgroupPopup;

                            return tile;
                        });

                    };

                    commit('setSearchResults', searchResults);

                }

                return response;

            },

            async categories({ commit }, endpoint) {
                const data = await this.$axios.$get(endpoint);
                commit('setSearchCategories', data.data.map(category => {
                    return category.title.toLowerCase();
                }) );
            }

        }
    });
};
