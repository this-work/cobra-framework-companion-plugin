/**
 * f-search
 */

import { common } from '@this/cobra-framework/src/plugins/mixins';
import { getElasticsearchQueryString, getUriParams, updateUriParams } from '@this/cobra-framework-companion-plugin/src/plugins/vanilla/search-helper';

export default {

    name: 'f-header-search',

    mixins: [
        ...common
    ],

    data() {
        return {
            selectedTags: [],
            selectedExistingTags: [],
            expandedTags: false,
            showExpandedTagsToggle: false,
            forceTransition: null
        };
    },

    computed: {
        tagsClasses() {
            return {
                [`${this.$options.name}__tags`]: true,
                [`${this.$options.name}__tags--expanded`]: this.expandedTags
            };
        },


        tags() {
            return this.$store.state.search.tags;
        }
    },

    created() {
        const urlQuery = getUriParams();
        if (urlQuery.tags) {
            this.selectedTags = urlQuery.tags.split(',').map(selectedTag => {
                return {
                    'key': selectedTag.replace(/[^a-zA-Z]+/g, '').toLowerCase(),
                    'value': selectedTag
                };
            });
        }
    },
    mounted() {
        if (process.client) {

            this.$nextTick(() => {
                this.checkExpandedTagsToogleVisibility();
            });

            setTimeout(() => { this.checkExpandedTagsToogleVisibility() }, 350);
            setTimeout(() => { this.checkExpandedTagsToogleVisibility() }, 1000);

            window.addEventListener('resize', this.checkExpandedTagsToogleVisibility);
            window.addEventListener('resize', this.forceTagTransition);
        }
    },

    beforeDestroy() {

        this.$store.commit('search/setSearchResults', []);

        if (process.client) {
            window.removeEventListener('resize', this.checkExpandedTagsToogleVisibility);
            window.removeEventListener('resize', this.forceTagTransition);
        }

    },

    methods: {
        close() {
            window.history.back();
            document.querySelector('main').style.opacity = 0;
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

        removeAllTags() {
            this.selectedTags = [];
            this.updateData();
        },

        async updateData() {
            this.updateQuery();
            await this.$store.dispatch('search/fetch', { query: getElasticsearchQueryString(), selectedTags: (getUriParams()['tags'] ? getUriParams()['tags'].split(',') : undefined) } );
            this.$nextTick(() => {
                this.checkExpandedTagsToogleVisibility();
            });
        },

        updateQuery() {
            const parts = [];
            for ( let i = 0; i < this.selectedTags.length; ++i ) {
                parts.push(encodeURIComponent(this.selectedTags[i].value));
            }
            updateUriParams('tags', parts.join(','));
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
