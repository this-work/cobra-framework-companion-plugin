<script>
export default {
    name: 'transition-feedback',

    functional: true,

    props: {
        moduleElement: {
            type: [ String, Boolean ],
            default: false
        },

        backgroundElement: {
            type: [ String, Boolean ],
            default: false
        },


        affectedElementSizeSource: {
            type: [ String, Boolean ],
            default: false
        },

        feedback: {
            type: [ String, Boolean ],
            default: false
        },
    },

    render(createElement, context) {

        const transitionName = 'feedback';

        const data = {

            props: {
                name: transitionName,
                // appear: true
            },

            on: {
                beforeEnter(element) {
                    element.style.visibility = 'hidden';
                },

                enter(element, done) {
                    const module = element.closest(context.props.moduleElement);
                    const sizeSource = module.querySelector(context.props.affectedElementSizeSource);
                    const background = module.querySelector(context.props.backgroundElement);

                    const beforeHeight = getComputedStyle(sizeSource).height;

                    background.style.opacity = 0;
                    getComputedStyle(background).opacity

                    background.classList.add(transitionName + '__change-opacity');
                    element.style.minHeight = '1px';

                    requestAnimationFrame(() => {

                        const { height } = getComputedStyle(element);

                        // background.style.removeProperty('opacity');
                        background.style.opacity = 1;
                        element.style.height = beforeHeight;
                        element.style.minHeight = height;
                        element.style.removeProperty('visibility');
                        getComputedStyle(element).height;

                        setTimeout(() => {
                            done();
                        }, 400);
                    });
                },

                afterEnter(element) {
                    element.style.removeProperty('height');
                    element.style.removeProperty('min-height');

                    const module = element.closest(context.props.moduleElement);
                    const background = module.querySelector(context.props.backgroundElement);
                    background.classList.remove(transitionName + '__change-opacity');
                },

                leave(element, done) {

                    const module = element.closest(context.props.moduleElement);
                    const sizeSource = module.querySelector(context.props.affectedElementSizeSource);
                    const background = module.querySelector(context.props.backgroundElement);

                    const beforeHeight = getComputedStyle(sizeSource).height;

                    background.style.opacity = 1;
                    getComputedStyle(background).opacity

                    background.classList.add(transitionName + '__change-opacity');

                    const { height } = getComputedStyle(element);

                    element.style.minHeight = height;
                    element.style.height = beforeHeight;

                    requestAnimationFrame(() => {

                        background.style.opacity = 0;
                        element.style.minHeight = '1px';
                        element.style.removeProperty('visibility');
                        getComputedStyle(element).height;

                        setTimeout(() => {
                            // background.style.removeProperty('opacity');
                            done();
                        }, 400);
                    });
                }
            }
        };

        return createElement(`transition`, data, context.children);
    }
};
</script>

<style lang="scss">

.feedback {

    &__change-opacity {
        transition: opacity 300ms !important;
    }

    &-enter,
    &-leave-to {
        opacity: 0;
        transform: translateY(-60px);
    }

    &-enter-to,
    &-leave {
        opacity: 1;
        transform: translateY(0);
    }

    &-enter-active,
    &-leave-active {
        transition: opacity 300ms, transform 300ms, min-height 300ms !important;
    }

}
</style>

