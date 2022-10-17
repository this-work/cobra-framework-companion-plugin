<script>
/**
 * Functional Component to sort slots first when given as an array of slot names
 */
export default {
    name: 'deprecated-c-dom-order',
    functional: true,
    props: {
        order: { type: Array, default: () => [] }
    },
    render(createElement, { props, scopedSlots }) {
        const { order = [] } = props;
        const comparator = ([aKey], [bKey]) => {
            const aKeyIndex = order.indexOf(aKey);
            const bKeyIndex = order.indexOf(bKey);

            if (aKeyIndex >= 0 && bKeyIndex >= 0) {
                return aKeyIndex < bKeyIndex ? -1 : 1;
            }
            if (aKeyIndex >= 0 && bKeyIndex === -1) { return -1; }
            if (aKeyIndex === -1 && bKeyIndex >= 0) { return 1; }
            if (aKey === 'default') { return 1; }
            if (bKey === 'default') { return -1; }

            return 0;
        };
        // console.log(scopedSlots);

        const orderedSlots = Object
            .entries(scopedSlots)
            .sort(comparator)
            .map(([ , slot ]) => slot());

        return [...orderedSlots];
    }
};
</script>
