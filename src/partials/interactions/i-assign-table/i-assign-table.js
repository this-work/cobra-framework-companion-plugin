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
import debounce from 'lodash.debounce';
import Vue from 'vue';

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
                animation: 300,
                sort: true,
                forceFallback: true,
                ghostClass: `${this.$options.name}__item--selected`,
                scrollSensitivity: 150,
                fallbackTolerance: 1
            },
            shuffledItems: this.createDraggableObject(this.items),
            imageAspectRatios: { 0: '531:398' },
            resizeFunction: null,
            observer: null
        };
    },

    mounted() {
        setTimeout(() => {
            this.resizeElements();

            this.observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    this.resizeElements();
                });
            });

            this.observer.observe(this.$el);

            setTimeout(() => {
                this.resizeElements();
            }, 200);

        }, 20);

        this.resizeFunction = debounce(this.resizeElements, 20);
        window.addEventListener('resize', this.resizeFunction);
    },

    updated() {
        setTimeout(() => {
            this.resizeElements();
        }, 20);
    },

    beforeDestroy() {
        window.removeEventListener('resize', this.resizeFunction);

        if (this.observer) {
            this.observer.unobserve(this.$el);
        }
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
                return parseInt(question[0].id) === parseInt(this._shuffledItems.selectedAnswers[index].answer[0].id);
            });
        },

        answersHaveImages() {
            return this.items.some(item => item.drag.image);
        },

        answersHaveImagesOnly() {
            return this.items.every(item => item.drag.image);
        }

    },

    methods: {

        fixAutoScrollBug(eventOrTarget) {
            const target = eventOrTarget.target || eventOrTarget;

            if (target.scrollWidth > target.offsetWidth && target.scrollLeft === 0) {
                target.scrollLeft -= 1;
            } else if (target.scrollWidth > target.offsetWidth && target.scrollLeft === target.scrollWidth) {
                target.scrollLeft += 1;
            }
        },

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
                    answer: []
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
                            type: 'draggable'
                        }
                    ]
                };
            });

            return { questions: newQuestions, answers, selectedAnswers };
        },

        createDraggableObject(array) {

            let questions;
            let answers;

            do {

                questions = array.map(({drop, drag}, index) => ({
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

                answers = array.map(({drop, drag}, index) => ({
                    answer: [
                        {
                            id: index + 1,
                            text: drag.text,
                            image: drag.image,
                            type: 'draggable'
                        }
                    ]
                }));
                shuffleArray(answers);

            } while (questions.length > 2 && questions.every(({ question }, index) => parseInt(question[0].id) === parseInt(answers[index].answer[0].id)));

            const selectedAnswers = array.map(({ drop, drag }, index) => ({
                answer: []
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
            this.$store.commit('quiz/updateInteraction', {
                id: this.id,
                selection: [cloneDeep(this._shuffledItems)]
            });

            this.evaluationPermitted = this._shuffledItems.selectedAnswers.every(({ answer }) => answer.length > 0);
        },

        evaluate() {
            this.$store.commit('quiz/updateInteraction', {
                id: this.id,
                result: this.evaluatedResult
            });

            this.$emit('evaluated', this.evaluatedResult);
        },

        retry() {
            this.shuffledItems = this.createDraggableObject(this.items);
            this.$store.commit('quiz/resetInteraction', { id: this.id });

            this.$nextTick(() => {
                this.resetScrollbar();
                this.evaluationPermitted = false;
            });
        },

        resetScrollbar() {
            if (this.$refs.questionsWrapper && this.$refs.questionsWrapper.SimpleBar) {
                this.$refs.questionsWrapper.SimpleBar.getScrollElement().scrollLeft = 0;
            }
        },

        resizeElements() {

            if (!this.$refs.answerlists || this.$refs.answerlists.length === 0) {
                return;
            }

            let answerlist = this.$refs.answerlists;
            if (this.$refs.answerlists.length && this.$refs.answerlists[0] instanceof Vue) {
                answerlist = this.$refs.answerlists.map( element => element.$el );
            }

            this.$el.style.minHeight = this.$el.clientHeight + 'px';

            const elememts = [ ...answerlist, ...this.$refs.answeritems ];
            elememts.forEach(element => element.style.removeProperty('height'));

            const highestOffsetHeight = Math.max(...this.$refs.answeritems.map(element => element.offsetHeight));
            elememts.forEach(element => element.style.height = highestOffsetHeight + 'px');

            this.$el.style.removeProperty('min-height');
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
