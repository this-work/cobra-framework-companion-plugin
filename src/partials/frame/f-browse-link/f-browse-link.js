/**
 * f-browse-link
 */

import { common } from '@this/cobra-framework/src/plugins/mixins';

export default {

    name: 'f-browse-link',

    mixins: [
        ...common
    ],

    inheritAttrs: false,

    props: {
        label: {
            type: String
        },
        to: {
            type: String
        },
        href: {
            type: String
        },
        locked: {
            type: Boolean,
            default: false
        }
    },

    computed: {
        blockClasses() {
            return {
                [`${this.block}--locked`]: this.locked
            };
        },
        tag() {
            if (this.to && !this.locked) {
                return 'nuxt-link';
            }
            return 'a';
        },
        attributes() {
            if (this.locked) {
                return { href: 'javascript:void(0)' };
            }
            return {
                ...(this.to && { to: this.to }),
                ...(this.href && !this.to && { href: this.href })
            };
        },
        popup() {
            return {
                headline: 'Dieser Inhalt ist für dich leider nicht verfügbar',
                text: '<p>Vielen Dank für dein Interesse an unseren E-Learning-Inhalten, die exklusiv für Mitarbeiter:innen in der Wasserwirtschaft verfügbar sind.</p>\n<p>Bist du Mitarbeiter:in in einem wasserwirtschaftlichen Betrieb, der noch nicht registriert ist? Dann nutze bitte das nachfolgende Formular, um einen Zugang zu beantragen.</p>',
                buttonLabel: 'Anfragen'
            };
        }
    },

    methods: {
        checkForLocked(event) {
            if (this.locked) {
                event.preventDefault();
                this.$refs.popup.open();
            }
        }
    }
};
