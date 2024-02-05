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
            loading: false,
            email: ''
        };
    },

    created() {
        if (!sessionStorage.getItem('forgot-password-email-address')) return;

        this.email = sessionStorage.getItem('forgot-password-email-address');
        sessionStorage.removeItem('forgot-password-email-address');
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

                    const { csrfTokenValue } = await this.$axios.$get('/api/session-info?cachebuster=' + Date.now());

                    await this.$axios.$post('/api/reset-password', {
                        loginName: this.email,
                        'CRAFT_CSRF_TOKEN': csrfTokenValue
                    });

                    this.loading = false;
                    this.message = this.$i18n.t('c-form-forgot-password--success');

                } catch (err) {
                    this.loading = false;
                    this.valid = false;
                    if (err.response.data.message) {
                        this.message = this.$i18n.t('c-form-forgot-password--failed');
                    } else {
                        this.message = err.message;
                    }
                }
            }

        }

    }
};
