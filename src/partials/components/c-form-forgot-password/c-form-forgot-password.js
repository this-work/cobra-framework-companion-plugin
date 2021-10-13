/**
 * c-form-forgot-password
 */

import { common } from '@this/cobra-framework/src/plugins/mixins';

export default {

    name: 'c-form-forgot-password',

    mixins: [
        ...common
    ],

    props: {
        tag: {
            type: String,
            default: 'div'
        }
    },

    data() {
        return {
            message: null,
            valid: true,
            loading: false
        };
    },

    computed: {
        blockClasses() {
            return [
            ];
        }
    },

    methods: {
        async requestPasswordReset() {

            if (!this.loading) {

                this.loading = true;
                this.message = null;
                this.valid = true;

                try {

                    const { csrfTokenName, csrfTokenValue } = await this.$axios.$get('/api/csrf-token');

                    const response = await this.$axios.$post('/api/reset-password', {
                        loginName: this.$refs.loginName.value,
                        [csrfTokenName]: csrfTokenValue
                    });

                    if (response.success) {
                        this.loading = false;
                        this.message = this.$i18n.t('success');

                    }

                } catch (err) {
                    this.loading = false;
                    if (err.response.data.error) {
                        this.valid = false;
                        this.message = this.$i18n.t('failed');
                    } else {
                        this.message = err.message;
                    }
                }
            }

        }

    }
};
