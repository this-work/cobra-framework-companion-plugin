/**
 * f-navigation
 */

import { common } from '@this/cobra-framework/src/plugins/mixins';

export default {

    name: 'f-navigation',

    mixins: [
        ...common
    ],

    data() {
        return {
            activePageId: null
        };
    },

    props: {
        list: {
            type: Array,
            default: () => [
                {
                    id: 1,
                    name: 'index',
                    icon: 'home',
                    path: '/'
                },
                {
                    id: 2,
                    name: 'browse',
                    icon: 'menu',
                    path: '/browse'
                },
                {
                    id: 3,
                    name: 'search',
                    icon: 'search',
                    path: '/search'
                }
            ]
        },
        elasticAnimationDuration: {
            type: Number,
            default: 400
        },
        elasticAnimationFactor: {
            type: Number,
            default: 140
        }
    },

    mounted() {
        this.moveBackgroundShapeToTarget();

        setTimeout(this.moveBackgroundShapeToTarget(), 300);

        setTimeout(this.moveBackgroundShapeToTarget(), 600);

        setTimeout(this.moveBackgroundShapeToTarget(), 1000);

        window.addEventListener('resize', this.moveBackgroundShapeToTarget);
    },

    destroyed() {
        window.removeEventListener('resize', this.moveBackgroundShapeToTarget);
    },


    watch: {
        '$route'(to, from) {

            const fromPage = from.name.split('___')[0];
            const toPage = to.name.split('___')[0];

            if (fromPage === toPage) {
                let $target;
                if (this.$refs.hasOwnProperty('navigation' + toPage.charAt(0).toUpperCase() + toPage .slice(1))) {
                    $target = this.$refs['navigation' + toPage.charAt(0).toUpperCase() + toPage .slice(1)][0].$el;
                }
                setTimeout(() => this.moveBackgroundShapeToTarget($target), 600);
            } else {
                setTimeout(() => this.animateLinkBackground(toPage), 100);
            }
        }
    },

    methods: {

        animateLinkBackground(targetName) {

            if (!this.$refs.hasOwnProperty('navigation' + targetName.charAt(0).toUpperCase() + targetName .slice(1))) {
                this.$refs.elasticShape.style.transition = `opacity ${this.elasticAnimationDuration}ms`;
                this.$refs.elasticShape.style.opacity = '0';
                this.activePageId = null;
                return;
            }

            const target = this.list.find(item => item.name === targetName);
            const $target = this.$refs['navigation' + targetName.charAt(0).toUpperCase() + targetName .slice(1)][0].$el;

            if (this.activePageId === null) {
                this.$refs.elasticShape.style.transition = `opacity ${this.elasticAnimationDuration}ms`;
                this.moveBackgroundShapeToTarget($target);
                return;
            }

            if (target.id !== this.activePageId) {
                let moveDirection = 'flex-start';

                if (target.id > this.activePageId) {
                    moveDirection = 'flex-end';
                }

                this.$refs.elasticShape.style.justifyContent = moveDirection;
                this.$refs.elasticShape.style.transition = `all ${this.elasticAnimationDuration}ms`;

                this.$refs.elasticShapeBackground.style.transition = `width ${this.elasticAnimationDuration / 2}ms`;
                this.$refs.elasticShapeBackground.style.width = `${this.elasticAnimationFactor}%`;
                setTimeout(() => {
                    this.$refs.elasticShapeBackground.style.width = '100%';
                }, this.elasticAnimationDuration / 2);

                this.moveBackgroundShapeToTarget($target);

            }

        },

        moveBackgroundShapeToTarget($target) {

            if (this.$el) {

                if (!$target || $target instanceof Event) {
                    $target = this.$el.querySelector('.nuxt-link-exact-active');
                }

                if (!$target) {
                    this.activePageId = null;
                    this.$refs.elasticShape.style.opacity = '0';
                    return;
                }

                const targetOffset = $target.getBoundingClientRect().left;
                const navigationListOffset = this.$refs.navigationList.getBoundingClientRect().left;

                this.$refs.elasticShape.style.opacity = '1';
                this.$refs.elasticShape.style.left = (targetOffset - navigationListOffset) + 'px';
                this.$refs.elasticShape.style.width = $target.offsetWidth + 'px';

                this.activePageId = parseInt($target.dataset.index);

            }

        }
    }
};
