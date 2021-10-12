<template>
    <div :class="blockClasses" v-if="visible">
        <slot name="default" v-bind="{ $props, $data }">
            <c-icon
                :class="element('icon')"
                v-bind="iconAttrs"
            />
            <c-heading
                :class="element('heading')"
                v-if="headline"
                :headline="headline"
                headline-tag="span"
                headline-type="h1"
                alignment="center"
            />
            <c-text
                :class="element('text')"
                v-if="text"
                :text="text"
            />

            <c-quiz-progress-indicator
                :class="element('progress-indicator')"
                v-bind="progressIndicator"
                :theme="theme"
            />

            <c-button
                v-bind="button"
                :class="element('button')"
                @click.native="$emit('retry', $event )"
            />

        </slot>

    </div>
</template>

<script>
/**
 * c-quiz
 */
import BaseFeedback from './BaseFeedback';
export default {

    name: 'c-quiz-feedback',

    mixins: [BaseFeedback],

    props: {
        // go see more props on BaseFeedback

        progressIndicator: { type: Object },
        button: { type: Object },
        theme: { type: String }
    },

    computed: {
        iconAttrs() {
            const icon = {
                size: '140px',
                borderRadius: '50%',
                fill: 'white',
                padding: '10'
            };

            if (this.feedbackType === 'positive') {
                Object.assign(icon, {
                    background: this.$style.success,
                    name: 'check'
                });
            }

            if (this.feedbackType === 'negative') {
                Object.assign(icon, {
                    background: this.$style.error,
                    name: 'close'
                });
            }

            if (this.feedbackType === 'solution') {
                Object.assign(icon, {
                    background: this.$style.darkDeco,
                    name: 'eye'
                });
            }

            return icon;
        }
    }
};
</script>

<style module lang="scss">
:global {
    .c-quiz-feedback {
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        padding: spacing('44') 0;

        > * + * {
            @include responsive-spacing( $properties: margin-top, $spacing-map: (default: '27', s: '44') );
        }

        &__heading {
            @include below('s') {
                margin-top: spacing('16');
            }
        }

        &__text {
            text-align: center;
        }

        &__button {
            @include responsive-spacing( $properties: margin-top, $spacing-map: (default: '44', s: '71') );
        }

        &__progress-indicator {
            width: 100%;
        }
    }
}
:export {
    success: _base-color('success');
    error: _base-color('error');
    darkDeco: _base-color('dark-deco');
}
</style>
