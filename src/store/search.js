export default ({ store }) => {

    let user = {};

    const slugify = str =>
        str.replace(/[^a-zA-Z]+/g, '').toLowerCase();

    const checkUserAccess = ({ accessgroups }) => {
        if (!user.hasOwnProperty('roles')) {
            return true;
        }
        return Object.keys(user.roles).some(id => accessgroups.includes(parseInt(id)));
    };

    const isSuperUser = () => {
        const superUserGroups = $config.SUPERUSERGROUPS || [
            'admin',
            'editor'
        ];
        return superUserGroups.some(groupname => user.groups.indexOf(groupname) !== -1);
    };

    const prepareTile = (
        {
            _source: tile,
            _id: id
        },
        { lockWhenNoAccess = false }
    ) => {

        tile['id'] = id;

        const userHasAccess = checkUserAccess(tile);

        if (lockWhenNoAccess && !userHasAccess) {
            tile.locked = true;
            tile.popup = JSON.parse(tile.accessgroupPopup);
        }

        delete tile.accessgroupVisibility;
        delete tile.accessgroupPopup;

        return tile;
    };

    const getIndex = (categories, { value }) => {
        const index = categories.indexOf(value.toLowerCase());

        return index !== -1 ? index : Number.MAX_VALUE;
    };

    const _extractTypes = response =>
        response?.aggregations?.types?.buckets || [];

    const _extractTags = (response, selectedTags, categories) => {
        const { buckets } = response?.aggregations?.categories;

        if (!buckets) {
            return [];
        }

        return buckets
            .filter(({ key }) => !selectedTags.includes(key))
            .map(({ doc_count: count, key }) => ({
                key: slugify(key),
                count,
                value: key
            }))
            .sort((a, b) => getIndex(categories, a) - getIndex(categories, b));
    };

    const _extractSearchResults = (response) => {

        const { hits } = response?.hits;

        if (!hits) {
            return [];
        }

        if (isSuperUser()) {
            return hits.map(prepareTile);
        }

        return hits
            .filter(({ _source }) => {
                const { accessgroupVisibility } = _source;
                const userHasAccess = checkUserAccess(_source);

                return userHasAccess || (!userHasAccess && accessgroupVisibility === 'locked');
            })
            .map(hit => prepareTile(hit, { lockWhenNoAccess: true }));
    };

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
            searchCategories: function(state, results) {
                state.searchCategories = results;
            },
            setSearchResults: function(state, results) {
                state.searchResults = results;
            }
        },

        getters: {
            getSearchResultsByType: state => filterType =>
                state.searchResults.filter(({ type }) => type === filterType)
        },

        actions: {

            async fetch(
                { commit, state },
                {
                    query = '*',
                    selectedTags = [],
                    customFilter,
                    customAggregation
                } = {}
            ) {
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

                user = this.$auth.user;

                const tags = _extractTags(response, selectedTags, state.searchCategories);


                if (tags) {
                    commit('setTags', tags);
                }

                const types = _extractTypes(response);

                if (types) {
                    commit('setTypes', types);
                }

                const searchResults = _extractSearchResults(response);

                if (searchResults) {
                    commit('setSearchResults', searchResults);
                }

                return response;
            }
        }
    });
};
