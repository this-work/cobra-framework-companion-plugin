/**
 * i-fill-the-blanks
 */

import { common } from '@this/cobra-framework/src/plugins/mixins';
import interaction from '../../../plugins/mixins/interaction';
import { cloneDeep, shuffleArray } from '@this/cobra-framework/src/plugins/vanilla/helperFunctions';

export default {

    name: 'i-fill-the-blanks',

    mixins: [
        ...common,
        interaction
    ],

    props: {
        text: String,
        layoutArea: {
            type: String,
            default: 'page'
        },
    },

    data() {
        return {
            buttonLabelEvaluate: this.$t('interactions--button-evaluate'),
            content: this.createContent(),
            dropdownStatus: []
        };
    },

    computed: {

        blockClasses() {
            return {
                [`interaction`]: true,
                [`${this.$options.name}--readonly`]: this.resolved
            };
        },

        _content() {
            if (this.resolved) return this.createContent(true);

            this.dropdownStatus = this.createDropdownStatus(this.content);
            return this.content;
        },

        allDropdownsAnswered() {
            return this._content.filter(dropdown => dropdown.hasSelectedAnswer === true).length === this._content.filter(item => item.dropdown).length;
        },

        evaluatedResult() {
            return this._content.every(dropdown => {
                if (typeof dropdown.text === 'string') return true;

                const selectedAnswer = dropdown.dropdown.find(option => option.label === dropdown.selectedAnswerLabel);
                return dropdown.hasSelectedAnswer && selectedAnswer?.correct;
            });
        }

    },

    methods: {

        createContent(resolve = false) {
            const content = [];

            const regexText = /([^}{]*)(?:{{([^}{]+)}})?/g;
            const regexOptions = /[^|]+/g;

            const matches = this.text.matchAll(regexText);
            for (const match of matches) {

                if (match[1].trim()) {
                    content.push({ text: match[1].trim() });
                }

                if (match[2]) {
                    const dropdown = [];
                    let firstItem = true;

                    const answers = match[2].matchAll(regexOptions);
                    for (const answer of answers) {
                        dropdown.push({
                            correct: firstItem,
                            label: answer[0].trim(),
                            selectable: true,
                            selected: resolve && firstItem
                        });

                        if (firstItem) firstItem = false;
                    }

                    if (dropdown.length > 0) {
                        content.push({
                            dropdown: resolve ? dropdown : shuffleArray(dropdown),
                            selectedAnswerLabel: resolve ? dropdown[0].label : '',
                            hasSelectedAnswer: resolve
                        });
                    }
                }
            }

            return content;
        },

        createDropdownStatus(content) {
            return content.map(() => ({ open: false }));
        },

        isOpen(index) {
            return this.dropdownStatus[index]?.open;
        },

        toggleOpen(index) {
            if (this.resolved) return;

            const dropdownOpening = !this.dropdownStatus[index]?.open;
            this.dropdownStatus.forEach((item, _index) => item.open = (_index === index) ? dropdownOpening : false );

            if (dropdownOpening) {
                this.addEventClickOutside();
            } else {
                this.removeEventClickOutside();
            }
        },

        addEventClickOutside() {
            document.addEventListener('click', this.checkClickOutside);
        },

        removeEventClickOutside() {
            document.removeEventListener('click', this.checkClickOutside);
        },

        checkClickOutside(event) {
            if (!event.path.some( item => this.$refs.dropsdowns.includes(item))) {
                this.dropdownStatus.forEach(item => item.open = false);
                this.removeEventClickOutside();
            }
        },

        handleAnswerSelection(dropdown, dropdownIndex, answer) {
            if (!answer.selectable || this.resolved) return;

            const clearSelection = dropdown.hasSelectedAnswer && dropdown.selectedAnswerLabel === answer.label;
            this.dropdownStatus[dropdownIndex].open = false;
            dropdown.selectedAnswerLabel = !clearSelection ? answer.label : '';
            dropdown.hasSelectedAnswer = !clearSelection;
            this.evaluationPermitted = this.allDropdownsAnswered;
            this.removeEventClickOutside();

            this.$store.commit('interaction/update', {
                id: this.id,
                state: {
                    selection: cloneDeep(this._content)
                }
            });
        },

        retry() {
            this.evaluationPermitted = false;
            this.content = this.createContent();

            this.$store.commit('interaction/update', {
                id: this.id,
                state: {
                    selection: null,
                    result: null
                }
            });
        },

        evaluate() {
            this.$store.commit('interaction/update', {
                id: this.id,
                state: {
                    result: this.evaluatedResult
                }
            });

            this.$emit('evaluated', this.evaluatedResult);
        }

    }

};
