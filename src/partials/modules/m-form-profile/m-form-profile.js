/**
 * m-form-profile
 */

import { common, spacing, theme, background } from '@this/cobra-framework/src/plugins/mixins';

export default {

    name: 'm-form-profile',

    mixins: [
        ...common,
        spacing,
        theme,
        background
    ],

    props: {
        heading: Object
    },

    data() {
        return {
            loading: false,
            formData: null,
            errors: {}
        };
    },

    methods: {
        async submitForm(event) {

            const formData = new FormData(event.target);

            const userData = await this.$axios.$post('api/register', {
                'email': this.$auth.user.email,
                'salutation': formData.get('salutation'),
                'name': formData.get('firstname') + ' ' + formData.get('lastname'),
                'role': this.$auth.user.roles.toString() || '-',
                'updateUser': '1',
                [sessionStorage.getItem('csrfTokenName')]: sessionStorage.getItem('csrfTokenValue')
            }).catch(error => {
                console.log(error);
            });

            this.$auth.setUser({ ...this.$auth.user, ...userData });

            const craftSession = await this.$axios.$get('/api/session-info');

            sessionStorage.setItem('csrfTokenName', craftSession.csrfTokenName);
            sessionStorage.setItem('csrfTokenValue', craftSession.csrfTokenValue);

            window.location.href=window.location.href;

        }
    }
};
