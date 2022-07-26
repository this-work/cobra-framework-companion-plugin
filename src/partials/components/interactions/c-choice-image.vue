<template>
    <figure
        tabindex="0"
        @click="toggle"
        @touchend.prevent="toggle"
        @keydown.space.prevent=""
        @keydown.enter.prevent=""
        @keyup.space="toggle"
        @keyup.enter="toggle"
        :class="[ blockClasses, {
            [`${block}--disabled`]: disabled,
            [`${block}--selected`]: selected,
            [`${block}--readonly`]: readonly
        } ]"
    >
        <c-image
            :class="element('image')"
            v-bind="image"
            :overlay="true"
        />
        <span
            :class="element('label')"
            v-html="text"
        />
    </figure>
</template>

<script>
import { common } from '@this/cobra-framework/src/plugins/mixins';

export default {
    mixins: [...common],

    name: 'c-choice-image',

    props: {
        disabled: { type: Boolean },
        selected: { type: Boolean },
        readonly: { type: Boolean },
        image: { type: Object },
        text: { type: String }
    },

    model: {
        prop: 'selected',
        event: 'change'
    },

    methods: {
        toggle() {
            if (this.disabled || this.readonly) return;

            this.$emit('change', !this.selected);
        }
    }
};
</script>

<style lang="scss">
.c-choice-image {
    position: relative;

    &:focus {
      @include color-theme('focus');
    }

    &__label {
        z-index: zindex(300);
        color: color('white');
        position: absolute;
        @include responsive-font('choice-image-label');
        bottom: spacing('10');
        left: spacing('10');
        right: spacing('10');

        @include above('s') {
            bottom: spacing('16');
            left: spacing('16');
            right: spacing('16');
        }

        > *:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6) {
            @include responsive-font('choice-image-label');
        }


    }

    &__image {
        transition: transition(opacity);
        position: relative;
        border-radius: 5px;
        overflow: hidden;

        &::after {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            pointer-events: none;
            transition: transition(opacity);
            background: rgba(0,0,0, 0.25);
            z-index: zindex(100);
            opacity: 0;
        }
    }

    &--selected {
        .c-choice-image__image {
            &::after {
                opacity: 1;
            }
        }
    }

    &--disabled {
        .c-choice-image__image {
            opacity: 0.5;
        }
    }

}
</style>
