<template>
    <div :class="blockClasses" v-if="visible">
        <slot name="default" v-bind="{ $props, $data }">
            <layout :layout="this.image ? 'l-6-1-5' : 'l-12'">

                <template #column-1>
                    <div
                        :class="[element('icon-heading'), 'c-heading', 'c-heading--h2']"
                        v-if="icon !== 'none' || headline"
                    >

                        <div
                            v-if="icon !== 'none'"
                            :class="iconClass"
                        >
                            <c-icon
                                :name="iconName"
                            />
                        </div>

                        <c-heading
                            :class="element('heading')"
                            v-if="headline"
                            :headline="headline"
                            headline-tag="h2"
                            headline-type="h3"
                        />
                    </div>
                    <c-text
                        :class="element('text')"
                        v-if="text"
                        :text="text"
                    />
                    <div
                        :class="element('actions')"
                        v-if="slotHasContent('actions')"
                    >
                        <slot name="actions"></slot>
                    </div>
                </template>

                <template #column-3>
                    <c-image
                        :class="element('image')"
                        v-if="image"
                        v-bind="image"
                    />
                </template>

            </layout>
        </slot>
    </div>
</template>

<script>
/**
 * c-quiz
 */
import BaseFeedback from './BaseFeedback';
import slotMixin from '@this/cobra-framework/src/plugins/mixins/slot';

export default {

    name: 'c-feedback',

    mixins: [ BaseFeedback, slotMixin ],

    props: {
        image: { type: Object, default: null }
    },

    computed: {
        blockClasses() {
            return {
                [`${this.block}--layout-with-image`]: !!this.image
            };
        },

        computedIcon() {
            if (this.icon) return this.icon;
            const icon = {
                positive: 'correct',
                negative: 'wrong',
                solution: 'solution'
            };
            return icon[this.feedbackType];
        },
        iconName() {
            switch (this.computedIcon) {
                case 'correct':
                    return 'check';
                case 'wrong':
                    return 'close';
                case 'solution':
                    return 'eye';
            }
            return '';
        },
        iconClass() {
            const icon = this.computedIcon;
            return [ this.element('icon'), this.elementModifier('icon', icon ) ];
        }
    }
};
</script>

<style lang="scss">
.c-feedback {
    position: relative;
    padding: 0;
    @include responsive-spacing('medium', $properties: padding-top padding-bottom);


    &::before {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%) translateY(-100%);
        border: 15px solid transparent;
        border-top: 0;

        @include color-theme('feedback-arrow');
    }

    &__icon-heading {
        display: flex;
        flex-flow: row nowrap;
    }

    &__icon {
        flex: 0 0 auto;
        align-items: center;
        justify-content: center;
        width: unitize(44px);
        height: unitize(44px);
        margin-right: spacing('16');
        padding: spacing('10');
        border-radius: 50%;
        svg {
            display: block;
            width: unitize(24px);
            height:unitize(24px);
        }
        &--correct{
            background: color('success');
            color: color('white');
        }
        &--wrong{
            background: color('error');
            color: color('white');
        }
        &--solution{
            @include color-theme('feedback-solution-icon');
        }
    }

    &__heading {
        flex: 1 1 auto;

        .c-heading__headline {
            line-height: unitize(44px);
        }
    }

    &__text {
    }

    &__actions {
        display: flex;
        flex-flow: row wrap;
        align-items: flex-start;
        margin-top: spacing('27');
        @include responsive-spacing($properties: margin-top, $spacing-map: ('default': '27', 'xl': '44'));

        & > * + * {
            margin-left: spacing('10');
        }
    }

    .l-6-1-5__column-1,
    .l-6-1-5__column-3 {
        align-self: center;
    }

    &__image {
        @include responsive-spacing($properties: margin-top, $spacing-map: (default: '27', s: '0'));
    }
}
</style>

<style module lang="scss">
:export {
    iconSize: unitize(44px);
    success: _base-color('success');
    error: _base-color('error');
    darkDeco: _base-color('dark-deco');
}
</style>
