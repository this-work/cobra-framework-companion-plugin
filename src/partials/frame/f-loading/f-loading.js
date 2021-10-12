/**
 * f-loading
 */

export default {

    name: 'f-loading',

    data: () => ({
        loading: false
    }),

    methods: {
        start() {
            this.loading = true;
        },
        finish() {
            this.loading = false;
        }
    }
};
