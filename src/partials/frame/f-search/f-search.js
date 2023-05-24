/**
 * f-search
 */

import { common } from '@this/cobra-framework/src/plugins/mixins';
import { getElasticsearchQueryString, getUriParams, updateUriParams } from '@this/cobra-framework-companion-plugin/src/plugins/vanilla/search-helper';

export default {
    name: 'f-search',

    mixins: [
        ...common
    ],

    data() {
        return {
            selectedTags: [],
            tagTransitionKey: null
        };
    },

    computed: {
        tagsClasses() {
            return {
                [`${this.$options.name}__tags`]: true
            };
        },

        tags() {
            this.triggerTagTransition();
            return this.$store.state.search.tags;
        }
    },

    created() {
        const urlQuery = getUriParams();

        if (!urlQuery.tags) {
            return;
        }

        this.selectedTags = urlQuery.tags.split(',').map(selectedTag => ({
            'key': selectedTag.replace(/[^a-zA-Z]+/g, '').toLowerCase(),
            'value': selectedTag
        }));
    },

    mounted() {
        if (process.client) {
            window.addEventListener('resize', this.triggerTagTransition);
        }
    },

    beforeDestroy() {
        this.$store.commit('search/setSearchResults', []);

        if (process.client) {
            window.removeEventListener('resize', this.triggerTagTransition);
        }
    },

    methods: {

        addTag({ key, value }) {
            if (this.selectedTags.map(({ key }) => key).includes(key)) {
                return;
            }
            this.selectedTags.push({ key, value });
            this.updateQuery();
        },

        removeAllTags() {
            this.selectedTags = [];
            this.updateData();
        },

        async updateData() {
            this.updateQuery();

            const options = {
                query: getElasticsearchQueryString(),
                selectedTags: (getUriParams()['tags'] ? getUriParams()['tags'].split(',') : undefined)
            };
            await this.$store.dispatch('search/fetch', options);

        },

        updateQuery() {
            const parts = [];

            for ( let i = 0; i < this.selectedTags.length; ++i ) {
                parts.push(encodeURIComponent(this.selectedTags[i].value));
            }

            updateUriParams('tags', parts.join(','));

        },

        triggerTagTransition() {
            this.tagTransitionKey = 'transition-' + new Date().getMilliseconds();
        }
    }
};
