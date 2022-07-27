export default ({ store }) => {
    store.registerModule('search', {
        namespaced: true,
        state: () => ({
            tags: [],
            types: [],
            searchResults: []
        }),
        mutations: {
            setTags: function(state, tags) {
                state.tags = tags;
            },
            setTypes: function(state, types) {
                state.types = types;
            },
            setSearchResults: function(state, results) {
                state.searchResults = results;
            }
        },
        actions: {

            async fetch({ commit }, { query = '*', selectedTags, customFilter, customAggregation } = {}) {

                const response = await this.$elastic.search(query, {
                    fields: ['*'],
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
                    }));
                }

                if (response && response.aggregations && response.aggregations.types) {
                    commit('setTypes', response.aggregations.types.buckets);
                }

                if (response && response.hits && response.hits.hits) {
                    commit('setSearchResults', response.hits.hits.map(hit => {
                        return hit._source;
                    }));
                }

                return response;

            }

        }
    });
};
