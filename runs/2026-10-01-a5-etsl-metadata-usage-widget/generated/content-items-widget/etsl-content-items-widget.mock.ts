import { type ContentItemsWidgetModel } from './etsl-content-items-widget.js';

/**
 * The Content items widget's 26 metrics, transcribed from the Figma design.
 *
 * Two deliberate fidelity notes, both reproduced verbatim rather than corrected:
 * - row 4 reads "asnwer", the design's own misspelling of "answer";
 * - row 11 reads "Match - Multiple  response" with a double space.
 *
 * `percent` is the measured bar length from the design, which is *not* a function of `count`
 * (manifest OQ9) — e.g. three different metrics with count 9 have three different lengths.
 * The counts sum to 166 while the design's header reads 164; both are reproduced as designed
 * (manifest OQ16). The real page would fetch this; the root owns that fetch.
 */
export const contentItemsWidgetMock: ContentItemsWidgetModel = {
  metrics: [
    { label: 'Text', count: 40, percent: 30.3 },
    { label: 'Choice', count: 31, percent: 24.8 },
    { label: 'Arrange', count: 15, percent: 14.5 },
    { label: 'Fill in - Open question model asnwer', count: 14, percent: 13.7 },
    { label: 'Fill in - Open question short response', count: 9, percent: 11.5 },
    { label: 'Fill in - Open question long response', count: 9, percent: 11.5 },
    { label: 'Fill in - Drop', count: 9, percent: 11.8 },
    { label: 'Fill in - Write text on image', count: 8, percent: 10.7 },
    { label: 'Fill in - Correct the text', count: 6, percent: 9.2 },
    { label: 'Match - Single response', count: 3, percent: 5.0 },
    { label: 'Match - Multiple  response', count: 3, percent: 4.6 },
    { label: 'Match - Matrix', count: 2, percent: 3.1 },
    { label: 'Match - Cloze combi', count: 2, percent: 3.4 },
    { label: 'Match - Gap match', count: 2, percent: 3.1 },
    { label: 'Match - Drag image', count: 2, percent: 3.1 },
    { label: 'Match - Match in categories', count: 1, percent: 1.5 },
    { label: 'Select - Select in categories', count: 1, percent: 1.5 },
    { label: 'Select - Right option', count: 1, percent: 1.5 },
    { label: 'Select - Words', count: 1, percent: 1.5 },
    { label: 'Select - Hotspot', count: 1, percent: 1.5 },
    { label: 'Select - Click on image', count: 1, percent: 1.5 },
    { label: 'Flash card', count: 1, percent: 1.5 },
    { label: 'External - External interaction', count: 1, percent: 1.5 },
    { label: 'External - External text', count: 1, percent: 1.5 },
    { label: 'Generic', count: 1, percent: 1.5 },
    { label: 'Folio', count: 1, percent: 1.5 }
  ]
};
