/**
 * i-assign-table
 */

import { common } from '@this/cobra-framework/src/plugins/mixins';
import interaction from '../../../plugins/mixins/interaction';
import {
    cloneDeep,
    shuffleArray
} from '../../../plugins/vanilla/interaction-helper';
import { disableCursorGrabbing, enableCursorGrabbing } from '../../../plugins/vanilla/cursor-grabbing';

export default {

    name: 'i-assign-table',

    mixins: [
        ...common,
        interaction
    ],

    props: {
        items: Array,
        disableShuffle: {
            type: Boolean,
            default: false
        },
        layoutArea: {
            type: String,
            default: 'page'
        }
    },

    data() {
        return {
            buttonLabelEvaluate: this.$t('interactions--button-evaluate'),
            draggableOptions: {
                animation: 200,
                sort: true,
                forceFallback: true,
                ghostClass: `${this.$options.name}__item--selected`
            },
            shuffledItems: this.createDraggableObject(this.items),

            imageAspectRatios: { 0: '531:398' }
        };
    },

    computed: {

        blockClasses() {
            return {
                [`interaction`]: true,
                [`${this.$options.name}--readonly`]: this.resolved,
                [`${this.$options.name}--size-small`]: this.items.length > 2 || this.answersHaveImages,
                [`${this.$options.name}--answer-count-${this.items.length}`]: true
            };
        },

        _shuffledItems() {
            if (this.resolved) return this.createResolvedDraggableObject(this.shuffledItems.questions);

            return this.shuffledItems;
        },

        evaluatedResult() {
            return this._shuffledItems.questions.every(({ question }, index) => {
                return parseInt(question[0].id) === parseInt(this._shuffledItems.selectedAnswers[index].answer[1].id);
            });
        },

        answersHaveImages() {
            return this._shuffledItems.answers.some( answer => {
                return answer.answer.some(item => item.image);
            });
        },

        answersHaveImagesOnly() {
            return this._shuffledItems.answers.every( answer => {
                return answer.answer.every(item => item.image);
            });
        }

    },

    methods: {

        createResolvedDraggableObject(questions) {
            const newQuestions = questions.map(({ question }) => {
                const questionItem = question[0];

                return {
                    question: [
                        {
                            id: questionItem.id,
                            text: questionItem.text,
                            image: questionItem.image
                        }
                    ]
                };
            });

            const answers = questions.map(({ question }) => {
                const questionItem = question[0];
                const answer = this.items.find( ({ drop, drag }) => drop.text === questionItem.text && drop.image === questionItem.image );

                return {
                    answer: [
                        {
                            id: questionItem.id,
                            text: answer.drag.text,
                            image: answer.drag.image,
                            type: 'placeholder'
                        }
                    ]
                };
            });

            const selectedAnswers = questions.map(({ question }) => {
                const questionItem = question[0];
                const answer = this.items.find( ({ drop, drag }) => drop.text === questionItem.text && drop.image === questionItem.image );

                return {
                    answer: [
                        {
                            id: questionItem.id,
                            text: answer.drag.text,
                            image: answer.drag.image,
                            type: 'placeholder'
                        },
                        {
                            id: questionItem.id,
                            text: answer.drag.text,
                            image: answer.drag.image,
                            type: 'draggable'
                        }
                    ]
                };
            });

            return { questions: newQuestions, answers, selectedAnswers };
        },

        createDraggableObject(array) {

            const questions = array.map(({ drop, drag }, index) => ({
                question: [
                    {
                        id: index + 1,
                        text: drop.text,
                        image: drop.image
                    }
                ]
            }));

            if (!this.disableShuffle) {
                shuffleArray(questions);
            }

            const answers = array.map(({ drop, drag }, index) => ({
                answer: [
                    {
                        id: index + 1,
                        text: drag.text,
                        image: drag.image,
                        type: 'placeholder'
                    },
                    {
                        id: index + 1,
                        text: drag.text,
                        image: drag.image,
                        type: 'draggable'
                    }
                ]
            }));
            shuffleArray(answers);

            const selectedAnswers = array.map(({ drop, drag }, index) => ({
                answer: [
                    {
                        id: index + 1,
                        text: drag.text,
                        image: drag.image,
                        type: 'placeholder'
                    }
                ]
            }));

            return { questions, answers, selectedAnswers };
        },

        configurateImages(image) {
            return {
                ...image,
                aspectRatios: this.answersHaveImagesOnly ? this.imageAspectRatios : image.aspectRatios,
                inline: true,
                objectFit: 'cover',
                lazyload: false
            };
        },

        onStart() {
            enableCursorGrabbing();
        },

        onEnd() {
            disableCursorGrabbing();
        },

        onChange() {
            this.$store.commit('interaction/update', {
                id: this.id,
                state: {
                    selection: [cloneDeep(this._shuffledItems)]
                }
            });

            this.evaluationPermitted = this._shuffledItems.selectedAnswers.every(({ answer }) => answer.length === 2);
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
            this.shuffledItems = this.createDraggableObject(this.items);

            this.$store.commit('interaction/update', {
                id: this.id,
                state: {
                    selection: null,
                    result: null
                }
            });

            this.$nextTick(() => {
                this.resetScrollbar();
                this.evaluationPermitted = false;
            });
        },

        resetScrollbar() {
            this.$refs.questionsWrapper?.scrollTo(0, 0);
        }

    },

    watch: {
        resolved() {
            this.$nextTick(() => {
                this.resetScrollbar();
            });
        }
    }

};
