/**
 * c-change-password
 */

import { common } from '@this/cobra-framework/src/plugins/mixins';

export default {

    name: 'c-change-password',

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
            loading: false
        };
    },

    methods: {
        async changePassword() {
            if (!this.loading) {

                this.loading = true;
                this.message = null;

                try {

                    const { csrfTokenValue } = await this.$axios.$get('/api/session-info');

                    await this.$axios.$post('/api/reset-password', {
                        loginName: this.$auth.user.email,
                        'CRAFT_CSRF_TOKEN': csrfTokenValue
                    });

                    this.loading = false;
                    this.message = this.$i18n.t('c-form-forgot-password--success');

                } catch (err) {
                    this.loading = false;
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
