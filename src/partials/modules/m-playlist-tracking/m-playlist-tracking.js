/**
 * m-playlist-tracking
 */

import { common, spacing, theme, background } from '@this/cobra-framework/src/plugins/mixins';

export default {

    name: 'm-playlist-tracking',

    mixins: [
        ...common,
        spacing,
        theme,
        background
    ],

    props: {
        text: {
            type: String
        },
        playlistId: {
            type: Number
        },
        completed: {
            type: Boolean,
            default: false
        }
    },

    computed: {
        blockClasses() {
            return [
            ];
        }
    },

    methods: {
        async trackReadPlaylist(checked) {

            document.dispatchEvent(new CustomEvent('track-playlist', { detail: {
                    playlist: this.playlistId,
                    completed: checked
                } }));

            if (!process.client) return;

            try {

                const { csrfTokenName, csrfTokenValue } = await this.$axios.$get('/api/csrf-token');

                await this.$axios.$post('/api/playlist/track-completion-state', {
                    'playlistId': this.playlistId,
                    'completed': checked,
                    [csrfTokenName]: csrfTokenValue
                });

            } catch (err) {
                console.log(err);
            }


        }
    }
};
