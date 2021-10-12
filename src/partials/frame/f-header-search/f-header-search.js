/**
 * f-search
 */

import { common } from '@this/cobra-framework/src/plugins/mixins';

/**
 *
 * @param {string} key
 * @param {string} value
 */
export function updateUrlQuery(key, value) {

    const baseUrl = [ location.protocol, '//', location.host, location.pathname ].join('');

    let params = '';

    if (value.length > 0) {

        const urlQueryString = document.location.search;
        const newParam = key + '=' + value;
        params = '?' + newParam;

        if (urlQueryString) {

            const keyRegex = new RegExp('([\?&])' + key + '[^&]*');

            if (urlQueryString.match(keyRegex) !== null) {
                params = urlQueryString.replace(keyRegex, '$1' + newParam);
            } else {
                params = urlQueryString + '&' + newParam;
            }

        }

    }

    window.history.replaceState({}, '', baseUrl + params);

}

export default {

    name: 'f-header-search',

    mixins: [
        ...common
    ],

    props: {
    },

    data() {
        return {
            selectedTags: [],
            selectedExistingTags: [],
            tags: this.$store.state.search.tags,
            expandedTags: false,
            showExpandedTagsToggle: false,
            forceTransition: null
        };
    },

    computed: {
        blockClasses() {
            return [];
        },
        tagsClasses() {
            const className = this.$options.name;

            return {
                [`${className}__tags`]: true,
                [`${className}__tags--expanded`]: this.expandedTags
            };
        }
    },

    beforeMount() {

        this.$store.commit('last-visited/updateQuery', {});

        if (this.$route.query.selectedTags) {

            this.addTagsFromUriString(this.$route.query.selectedTags);

        } else {
            this.$store.dispatch('search/getSearchResults', []).then(() => {
                this.$store.commit('search/loading', false);
                this.$nuxt.$loading.finish();
            });

        }
    },

    mounted() {

        if (this.$store.state.search.loading) {
            this.$nuxt.$loading.start();
        }

        if (process.client) {
            this.$nextTick(() => {
                this.checkExpandedTagsToogleVisibility();
            });
            window.addEventListener('resize', this.checkExpandedTagsToogleVisibility);
            window.addEventListener('resize', this.forceTagTransition);
        }
    },

    beforeDestroy() {
        this.$store.commit('search/setSearchResults', []);
        this.$store.commit('search/loading', true);

        if (process.client) {
            window.removeEventListener('resize', this.checkExpandedTagsToogleVisibility);
            window.removeEventListener('resize', this.forceTagTransition);
        }
    },

    methods: {
        close() {
            window.history.back();
        },

        addTag(item) {
            if (!this.selectedTags.some(tag => tag.key === item.key)) {
                this.selectedTags.push({
                    key: item.key,
                    value: item.value
                });
                this.updateQuery();
            }
        },

        addTagsFromUriString(uriString) {

            const preSelectedTags = [];

            uriString.split(',').forEach(item => {
                if (!this.$store.state.search.tags.some(tag => {
                    if (tag.value === item) {
                        preSelectedTags.push({
                            key: tag.key,
                            value: item
                        });
                        return true;
                    }
                })) {
                    preSelectedTags.push({
                        key: '',
                        value: item
                    });
                }
            });
            this.selectedTags = preSelectedTags;

        },

        removeAllTags() {
            this.selectedTags = [];
            this.updateData();
        },

        updateData() {
            this.$store.commit('search/loading', true);
            this.$nuxt.$loading.start();
            this.updateTags();
            this.updateQuery();
            this.updateSearchResult();
        },

        updateTags() {
            if (this.selectedTags.length > 0 && this.selectedTags.some(tag => tag.key.length > 0)) {

                const tempSelectedExistingTags = this.selectedTags.map(tag => {
                    if (tag['key'].length > 0) {
                        return tag['key'];
                    }
                }).filter(item => item !== undefined);

                this.$store.dispatch('search/getRelatedTags', tempSelectedExistingTags).then(() => {
                    this.selectedExistingTags = tempSelectedExistingTags;
                    this.tags = this.$store.state.search.relatedTags;
                    this.$nextTick(() => {
                        this.checkExpandedTagsToogleVisibility();
                    });
                });

            } else {

                this.selectedExistingTags = [];
                this.tags = this.$store.state.search.tags;
                this.$nextTick(() => {
                    this.checkExpandedTagsToogleVisibility();
                });
            }

        },

        updateSearchResult() {

            this.$store.dispatch('search/getSearchResults', this.selectedTags).then(() => {
                this.$store.commit('search/loading', false);
                this.$nuxt.$loading.finish();
            });

        },

        updateQuery() {
            const parts = [];
            for ( let i = 0; i < this.selectedTags.length; ++i ) {
                parts.push(encodeURIComponent(this.selectedTags[i].value));
            }

            updateUrlQuery('selectedTags', parts.join(','));

            if (parts.length > 0) {
                this.$store.commit('last-visited/updateQuery', {
                    'selectedTags': decodeURIComponent(parts.join(','))
                });
            } else {
                this.$store.commit('last-visited/updateQuery', {});
            }

        },

        toggleExpandedTags() {
            this.expandedTags = !this.expandedTags;
        },

        checkExpandedTagsToogleVisibility() {

            this.showExpandedTagsToggle = false;

            document.querySelectorAll('[data-search-tag-pill]').forEach(element => {

                if (parseInt(element.offsetTop) > 10) {
                    this.showExpandedTagsToggle = true;
                }

            });

        },

        forceTagTransition() {
            this.$nextTick(() => {
                this.forceTransition = new Date().getMilliseconds();
            });
        }

    }
};
