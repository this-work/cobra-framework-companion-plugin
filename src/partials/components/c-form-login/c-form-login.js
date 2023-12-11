/**
 * c-form-login
 */

import { common } from '@this/cobra-framework/src/plugins/mixins';

export default {

    name: 'c-form-login',

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

    created() {

        const password = this.$route.params.password;

        if (password && password === 'new') {
            this.message = this.$i18n.t('c-form-login--success-new-password');
        }

    },

    methods: {
        async login() {

            if (!this.loading) {

                this.loading = true;
                this.message = null;
                this.valid = true;

                try {

                    sessionStorage.clear();

                    const { csrfTokenName, csrfTokenValue } = await this.$axios.$get('/api/session-info');

                    await this.$auth.loginWith(this.$config.AUTH_STRATEGY, {
                        data: {
                            'loginName': this.$refs.loginName.value,
                            'password': this.$refs.password.value,
                            [csrfTokenName]: csrfTokenValue
                        }
                    });

                } catch (err) {
                    this.loading = false;
                    this.valid = false;
                    if (err.response.data) {
                        if (err.response.data.hasOwnProperty('errorCode') && err.response.data.errorCode === 'invalid_credentials') {
                            this.message = this.$i18n.t('c-form-login--failed');
                        } else {
                            this.message = err.response.data.message;
                        }
                    } else {
                        this.message = err.message;
                    }
                }

            }

        }

    }
};
