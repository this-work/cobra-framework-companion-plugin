/**
 * f-browse-level
 */
import common from '@this/cobra-framework/src/plugins/mixins';

export default {
    name: 'f-browse-level',

    mixins: [
        ...common
    ],

    props: {
        tag: {
            type: String,
            default: 'div'
        },

        name: String|Number,

        menu: {
            type: Array,
            default: () => []
        }
    },

    data() {
        return {
            selectedItem: undefined
        };
    },

    computed: {
        hasSelectedItem() {
            return this.selectedItem !== undefined;
        },

        selectedItemHasSubMenu() {
            return this.selectedItem?.menu?.length;
        },

        selectedItemHasLinks() {
            return this.selectedItem?.links?.length;
        },

        getListClasses() {
            return [
                this.element('list'),
                {
                    [this.elementModifier('list', 'hasSelectedChild')]: this.hasSelectedItem
                }
            ];
        },

        getItemClasses() {
            return [
                this.element('item'),
                {
                    [this.elementModifier('item', 'currentLevel')]: !this.hasSelectedItem
                }
            ];
        },

        getSubMenuProps() {
            const { id: name, menu } = this.selectedItem;

            return {
                key: `mainmenu-${name}`,
                menu,
                name
            };
        },

        getLinkListProps() {
            const { id, links } = this.selectedItem;

            return {
                key: `links-${id}`,
                links
            };
        }
    },

    methods: {
        selectItem(item) {
            this.selectedItem = item;
        }
    }
};
