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

                    const { csrfTokenValue } = await this.$axios.$get('/api/session-info');

                    await this.$axios.$post('/api/reset-password', {
                        loginName: this.$refs.loginName.value,
                        'CRAFT_CSRF_TOKEN': csrfTokenValue
                    });

                    this.loading = false;
                    this.message = this.$i18n.t('c-form-forgot-password--success');

                } catch (err) {
                    this.loading = false;
                    if (err.response.data.error) {
                        this.valid = false;
                        this.message = this.$i18n.t('c-form-forgot-password--failed');
                    } else {
                        this.message = err.message;
                    }
                }
            }

        }

    }
};
