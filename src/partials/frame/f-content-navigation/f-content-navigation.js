/**
 * f-content-navigation
 */

import { common } from '@this/cobra-framework/src/plugins/mixins';
import { enablePageScrolling, disablePageScrolling } from '@this/cobra-framework/src/plugins/vanilla/scroll-blocker';

export default {

    name: 'f-content-navigation',

    mixins: [
        ...common
    ],

    props: {
        title: {
            type: String
        },
        collection: {
            type: Object
        },
        anchors: {
            type: Array
        }
    },

    data() {
        return {
            visible: false
        };
    },

    methods: {
        open() {
            document.addEventListener('click', this.checkClickOutside);
            window.setTimeout(() => {
                disablePageScrolling([
                    { element: document.body, property: 'right'}
                ]);
            }, 0);

            this.visible = true;
        },
        close() {
            document.removeEventListener('click', this.checkClickOutside);
            setTimeout(() => {
                enablePageScrolling(true);
            }, 0);

            this.visible = false;
            this.$emit('close');
        },
        checkClickOutside(event) {
            if (event) {
                if (event.target.closest('[class*="f-content"]')) {
                    return;
                }
                this.close();
            }
        }
    }
};
