/**
 * i-sortable-list
 */

import Vue from 'vue';

import { common } from '@this/cobra-framework/src/plugins/mixins';
import interaction from '../../../plugins/mixins/interaction';
import { shuffleArray, addClassToHtmlTag, removeClassFromHtmlTag } from '@this/cobra-framework/src/plugins/vanilla/helperFunctions';
import { disableCursorGrabbing, enableCursorGrabbing } from "@this/cobra-framework/src/plugins/vanilla/cursor-grabbing";

export default {

    name: 'i-sortable-list',

    mixins: [
        ...common,
        interaction
    ],

    props: {
        items: Array
    },

    data() {
        return {
            buttonLabelEvaluate: this.$t('interactions--button-evaluate'),
            draggableOptions: {
                animation: 300,
                disabled: false,
                forceFallback: true,
                ghostClass: `${this.$options.name}__item--selected`
            },
            shuffledItems: this.createShuffledItems()
        };
    },

    computed: {

        blockClasses() {
            return {
                [`interaction`]: true,
                [`${this.$options.name}--readonly`]: this.resolved
            };
        },

        _shuffledItems() {
            if (this.resolved) {
                return this.createDraggableList(this.items);
            }

            return this.shuffledItems;
        },

        evaluatedResult() {
            return this._shuffledItems.every((item, index) => item.text === this.items[index]);
        }
    },

    methods: {

        createShuffledItems() {
            return this.createDraggableList( shuffleArray([...this.items]));
        },

        createDraggableList(array) {
            return array.map((item, index) => ({ id: index + 1, text: item }));
        },

        onStart() {
            enableCursorGrabbing();
        },

        onEnd() {
            disableCursorGrabbing();
        },

        onUpdate() {
            this.$store.commit('interaction/update', {
                id: this.id,
                state: {
                    selection: [...this.shuffledItems]
                }
            });

            this.evaluationPermitted = true;
        },

        evaluate() {
            this.$store.commit('interaction/update', {
                id: this.id,
                state: {
                    result: this.evaluatedResult
                }
            });

            this.$emit('evaluated', this.evaluatedResult);
        },

        retry() {
            this.shuffledItems = this.createShuffledItems();

            this.$store.commit('interaction/update', {
                id: this.id,
                state: {
                    selection: null,
                    result: null
                }
            });

            this.evaluationPermitted = false;
        }
    }

};
