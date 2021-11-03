/**
 * c-form-set-password
 */

import { common } from '@this/cobra-framework/src/plugins/mixins';

export default {

    name: 'c-form-set-password',

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
            tokensVerified: false,
            password: '',
            message: null,
            valid: true,
            code: null,
            id: null,
            loading: false
        };
    },

    async created() {

        this.message = this.$i18n.t('c-form-set-password--wait');

        const { code, id } = this.$route.query;

        try {

            if (!code || !id) {
                throw new Error(this.$i18n.t('c-form-set-password--failed'));
            }

            const response = await this.$axios.$get('/api/verify-user-token', {
                params: { code, id }
            });

            Object.assign(this.$data, {
                tokensVerified: response.verified,
                message: response.error,
                valid: response.verified,
                code,
                id
            });

        } catch (err) {
            if (err.response && err.response.data.error) {
                this.message = err.response.data.error;
                this.valid = false;
            } else {
                this.message = err.message;
                this.valid = false;
            }
        }

    },

    methods: {

        async setPassword() {

            if (!this.loading) {

                this.loading = true;

                try {

                    this.message = null;
                    this.valid = true;

                    if (!this.code || !this.id) {
                        throw new Error(this.$i18n.t('c-form-set-password--failed'));
                    }

                    const { csrfTokenName, csrfTokenValue } = await this.$axios.$get('/api/csrf-token');

                    const response = await this.$axios.$post('/api/set-password', {
                        code: this.code,
                        id: this.id,
                        newPassword: this.$refs.password.value,
                        [csrfTokenName]: csrfTokenValue
                    });

                    if (response.error) {
                        throw new Error(response.error);
                    }

                    if (response.success === true) {
                        this.$router.push({ name: 'login___' + this.$i18n.locale, params: { 'password': 'new' } });
                    }

                } catch (err) {
                    this.loading = false;
                    this.valid = false;
                    if (err.response && err.response.data.error) {
                        this.message = err.response.data.error;
                    } else {
                        this.message = err.message;
                    }
                }
            }
        }
    }
};
