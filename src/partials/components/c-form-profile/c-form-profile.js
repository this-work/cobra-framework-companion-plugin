/**
 * c-form-profile
 */

import { common } from '@this/cobra-framework/src/plugins/mixins';

export default {

    name: 'c-form-profile',

    mixins: [
        ...common
    ],

    props: {
        tag: {
            type: String,
            default: 'div'
        }
    }
};
