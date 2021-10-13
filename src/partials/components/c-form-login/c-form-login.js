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

    computed: {
        blockClasses() {
            return [
            ];
        }
    },

    created() {

        const password = this.$route.params.password;

        if (password && password === 'new') {
            this.message = this.$i18n.t('success-new-password');
        }

    },

    methods: {
        async login() {

            if (!this.loading) {

                this.loading = true;
                this.message = null;
                this.valid = true;

                try {

                    const { csrfTokenName, csrfTokenValue } = await this.$axios.$get('/api/csrf-token');

                    await this.$auth.loginWith('craft', {
                        data: {
                            loginName: this.$refs.loginName.value,
                            password: this.$refs.password.value,
                            [csrfTokenName]: csrfTokenValue
                        }
                    });

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
