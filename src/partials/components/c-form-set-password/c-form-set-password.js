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
        },
        passwordFormat: {
            type: RegExp,
            default: () => /.{6,}/
        }
    },

    data() {
        return {
            tokensVerified: false,
            message: null,
            valid: true,
            code: null,
            id: null,
            loading: false,
            showPassword: false,
            errors: {}
        };
    },

    async created() {

        this.message = this.$i18n.t('c-form-set-password--wait');
        const { code, id } = this.$route.query;

        try {

            if (!code || !id) {
                throw new Error(this.$i18n.t('c-form-set-password--failed'));
            }

            const response = await this.$axios.$get('/api/verify-user-token?timestamp=' + new Date().getTime(), {
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

    computed: {
        blockClasses() {
            return [
            ];
        },
        passwordInputType() {
            return this.showPassword ? 'text' : 'password';
        },
        visibilityIcon() {
            return this.showPassword ? 'visibility' : 'visibility-off';
        },
        visibilityTitle() {
            return this.showPassword ? this.$t( 'c-form-register--hide-password') : this.$t('c-form-register--show-password');
        },
        inputsHaveErrors() {
            return !this.valid || Object.keys(this.errors).length > 0;
        }
    },

    methods: {
        toggleShowPassword() {
            this.showPassword = !this.showPassword;
        },

        async setPassword(event) {

            if (!this.loading) {

                this.loading = true;
                this.message = null;
                this.valid = true;
                this.errors = {};

                if (!this.validateInputs(event.target)) {
                    this.message = this.getErrorMessages();
                    this.valid = false;
                    this.triggerMessageBoxTransition();
                    this.loading = false;
                    return;
                }

                try {

                    const { csrfTokenValue } = await this.$axios.$get('/api/session-info?cachebuster=' + Date.now());

                    const response = await this.$axios.$post('/api/set-password', {
                        code: this.code,
                        id: this.id,
                        newPassword: this.$refs.password.value,
                        'CRAFT_CSRF_TOKEN': csrfTokenValue
                    });

                    if (response.error) {
                        throw new Error(response.error);
                    }

                    if (response.success === true || response.status === "active") {
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
                    this.triggerMessageBoxTransition();
                }
            }
        },

        validateInputs(form) {
            const inputs = Array.from(form.elements);
            const checkedMatches = [];

            const results = inputs.map(input => {
                if (input.dataset.hasOwnProperty('validateRequired')) {
                    if (input.value === '' || input.type === 'checkbox' && !input.checked) {
                        this.errors[input.name] = this.$t(`c-form-register--error-blank-field`);
                        return false;
                    }
                }

                if (input.dataset.hasOwnProperty('validatePassword')) {
                    if (!this.passwordFormat.test(input.value)) {
                        this.errors[input.name] = this.$t('c-form-register--error-wrong-password-format');
                        return false;
                    }
                }

                if (input.dataset.hasOwnProperty('validateMatch') && !checkedMatches.includes(input.dataset.validateMatch)) {
                    const validateMatchValue = input.dataset.validateMatch;
                    const matches = inputs.filter(element => element.dataset.validateMatch === validateMatchValue);
                    checkedMatches.push(validateMatchValue);

                    if (!matches.every(match => match.value === input.value)) {
                        this.errors[input.name] = this.$t('c-form-register--error-passwords-do-not-match');
                        return false;
                    }
                }

                return true;
            });

            return results.every(bool => bool);
        },

        triggerMessageBoxTransition() {
            const message = this.message;
            this.message = null;
            this.$nextTick(() => {
                this.message = message;
            });
        },

        removeError(name) {
            if (this.errors[name]) {
                const errors = { ...this.errors };
                delete errors[name];
                this.errors = errors;
            }

            return true;
        },

        getErrorMessages() {
            if (Object.keys(this.errors).length === 0) return;

            let errors = [];
            for (const [key, value] of Object.entries(this.errors)) {
                if (errors.includes(value)) continue;

                errors.push(value);
            }

            return `<p>${errors.join('</p><p>')}</p>`;
        }
    }
};
