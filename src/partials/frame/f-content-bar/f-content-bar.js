/**
 * f-content-bar
 */

import { common } from '@this/cobra-framework/src/plugins/mixins';

export default {

    name: 'f-content-bar',

    mixins: [
        ...common
    ],

    props: {
        id: {
            type: [String, Number]
        },
        title: {
            type: String
        },
        collection: {
            type: Object
        },
        anchors: {
            type: Array
        },
        previousPage: {
            type: Object
        },
        nextPage: {
            type: Object
        }
    },

    computed: {
        blockClasses() {
            return [
            ];
        },
        pageShortcuts() {
            return this.previousPage || this.nextPage;
        },
    },

    methods: {
        buttonClass(link) {
            if (link) {
                return this.element('button');
            }
            return [
                this.element('button'),
                this.element('button--disabled')
            ];

        },
        getAttribute(object, property) {
            if (!object || !object.hasOwnProperty(property)) {
                return;
            }
            return object[property];
        }
    }
};
