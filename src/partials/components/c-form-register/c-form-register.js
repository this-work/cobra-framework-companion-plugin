/**
 * c-form-register
 */

import { common } from '@this/cobra-framework/src/plugins/mixins';

export default {

    name: 'c-form-register',

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
            loading: false,
            message: '',
            showPassword: false,
            showAlreadyRegistered: false,
            formData: null,
            errors: {},
            valid: true,
            scrollOptions: {
                duration: 300,
                easing: [ 0.42, 0.0, 0.58, 1.0 ],
                offset: 22,
                force: true,
                cancelable: false
            }
        };
    },

    computed: {
        blockClasses() {
            return [
            ];
        },
        formIsVisible() {
            return !this.valid || this.message && this.inputsHaveErrors || !this.message && !this.inputsHaveErrors ;
        },
        inputsHaveErrors() {
            return Object.keys(this.errors).length > 0;
        },
        passwordInputType() {
            return this.showPassword ? 'text' : 'password';
        },
        visibilityIcon() {
            return this.showPassword ? 'visibility' : 'visibility-off';
        },
        visibilityTitle() {
            return this.showPassword ? this.$t( 'c-form-register--hide-password') : this.$t('c-form-register--show-password');
        }
    },

    methods: {

        toggleShowPassword() {
            this.showPassword = !this.showPassword;
        },

        async sendRegistration(event) {
            if (this.loading) return;

            this.loading = true;
            this.valid = true;
            this.message = '';
            this.showAlreadyRegistered = false;
            this.errors = {};

            if (!this.validateInputs(event.target)) {
                this.message = this.getErrorMessages();
                this.valid = false;
                this.loading = false;
                const { duration, offset, ...scrollOptions } = this.scrollOptions;
                this.$nextTick(() => {
                    this.$scrollTo(
                        this.$refs.messageBox.$el || this.$refs.messageBox,
                        duration, { offset: -offset, ...scrollOptions }
                    );
                });
                return;
            }

            this.formData = this.createFormDataObject(event.target);

            try {

                const { csrfTokenValue } = await this.$axios.$get('/api/session-info?cachebuster=' + Date.now());

                await this.$axios.$post('/api/register', {
                    email: this.formData.email,
                    password: this.formData['new-password'],
                    fullName: `${this.formData.firstname} ${this.formData.lastname}`,
                    fields: {
                        salutation: this.formData.salutation
                    },
                    CRAFT_CSRF_TOKEN: csrfTokenValue
                });

                this.message = this.$t('c-form-register--success');

            } catch (err) {
                this.message = this.getResponseErrorMessage(err);
                this.valid = false;
            }

            this.loading = false;
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

                if (input.dataset.hasOwnProperty('validateEmail')) {
                    const format = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!format.test(input.value)) {
                        this.errors[input.name] = this.$t('c-form-register--error-invalid-email');
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

        createFormDataObject(form) {
            const inputs = Array.from(form.elements);
            const formDataObject = {};

            inputs.forEach(input => {
                if (!input.name) return;

                let value = input.value;

                if (input.type === 'checkbox') {
                    if (!input.checked) return;
                    value = 'yes';
                }

                formDataObject[input.name] = value;
            });

            return formDataObject;
        },

        getResponseErrorMessage(err) {

            setTimeout(() => {
                const { duration, offset, ...scrollOptions } = this.scrollOptions;
                this.$scrollTo(
                    this.$refs.messageBox.$el || this.$refs.messageBox,
                    duration, { offset: -offset, ...scrollOptions }
                );
            });

            if (err && err.response && err.response.data && err.response.data.error ) {
                return this.$t('c-form-register--error-occurred');
            }

            const errors = err && err.response && err.response.data
                ? err.response.data.errors
                : {};

            if (errors.email) {
                this.showAlreadyRegistered = true;
                this.errors.email = this.$t('c-form-register--error-forgot-password-headline');
                return `<p>${this.$t('c-form-register--error-forgot-password-headline')}</p>`;
            }

            return this.$t('c-form-register--error-occurred');
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
        },

        resetPasswordClicked() {
            sessionStorage.setItem('forgot-password-email-address', this.formData.email);
            this.$router.push(this.localePath('/forgot-password'));
        }
    }
};
