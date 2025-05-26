# Date Field Keyboard Navigation

This document describes the keyboard navigation functionality implemented for the `sl-date-field` component as part of GitHub issue #2054.

## Overview

The date field component now supports comprehensive keyboard navigation that allows users to navigate between date segments (day, month, year) and modify values directly using the keyboard, without requiring mouse interaction.

## Features

### Segment Navigation
- **Left/Right Arrow Keys**: Navigate between date segments (day, month, year)
- **Tab**: Exit keyboard navigation mode and move to next focusable element
- **Escape**: Reset to the first segment and clear navigation state

### Value Modification
- **Up/Down Arrow Keys**: Increment/decrement the current segment value
- **Digit Keys (0-9)**: Direct numeric input with smart validation
- **Auto-advancement**: Automatic progression to next segment for obvious complete values

### Accessibility
- **ARIA Live Regions**: Screen reader announcements for navigation and value changes
- **Localized Messages**: Segment names and announcements respect the component's locale
- **Non-intrusive Feedback**: Polite announcements that don't interrupt user workflow

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `←` `→` | Navigate between date segments |
| `↑` `↓` | Increment/decrement current segment value |
| `0-9` | Direct digit input to current segment |
| `Tab` | Exit navigation mode |
| `Escape` | Reset to first segment |
| `Enter` | Confirm current value and exit navigation |

## Smart Input Behavior

### Day Segment
- Accepts values 1-31 with month-aware validation
- Auto-advances after typing digits > 3 (e.g., typing "4" immediately moves to next segment)
- Handles month boundary adjustments (e.g., Feb 30 becomes Feb 28/29)

### Month Segment
- Accepts values 1-12
- Auto-advances after typing digits > 1 (e.g., typing "2" moves to next segment)
- Automatically adjusts day values when changing to months with fewer days

### Year Segment
- Accepts 4-digit years (1900-2124)
- Century assumption for single digits (e.g., "5" becomes "2005")
- Smart leap year handling for February dates

## Edge Case Handling

### Leap Years
- Feb 29 in leap years automatically adjusts to Feb 28 when changing to non-leap years
- Leap year detection works correctly for century years (divisible by 400)

### Month Boundaries
- Jan 31 → Feb becomes Feb 28/29 depending on leap year
- Jan 31 → Apr becomes Apr 30
- Maintains the latest possible valid day for the target month

### Value Wrapping
- Day values wrap: 31 → 1, 1 → 31
- Month values wrap: 12 → 1, 1 → 12
- Year values wrap within the 1900-2124 range

## Accessibility Features

### Screen Reader Support
- Navigation announcements: "Now editing day: 15"
- Value change announcements: "Day changed to 16"
- Input feedback: "Day is now 5"
- Localized segment names based on component locale

### ARIA Implementation
- `aria-live="polite"` region for non-intrusive announcements
- `aria-atomic="true"` for complete message reading
- Hidden live region positioned off-screen for screen readers only

## Implementation Details

### Core Classes

#### `DateSegmentParser`
Parses formatted date strings into navigable segments with position and constraint information.

```typescript
interface DateSegment {
  type: 'day' | 'month' | 'year';
  value: number;
  min: number;
  max: number;
  position: { start: number; end: number };
  displayValue: string;
}
```

#### `DateField` Keyboard Navigation Methods
- `#navigateToSegment(index: number)`: Move to specific segment
- `#incrementSegment(direction: 1 | -1)`: Modify segment value
- `#handleDigitInput(digit: string)`: Process direct numeric input
- `#announceToScreenReader(message: string)`: Accessibility feedback

### Event Handling
The keyboard navigation system intercepts relevant keydown events while preserving normal browser behavior for other keys like Tab, Shift+Tab, and function keys.

## Testing

Comprehensive test coverage includes:
- Unit tests for `DateSegmentParser` functionality
- Integration tests for keyboard navigation
- Edge case testing (leap years, month boundaries)
- Accessibility testing for screen reader announcements
- Cross-browser compatibility testing

## Browser Support

The keyboard navigation feature uses standard web APIs and is compatible with:
- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- Minimal performance impact on existing functionality
- Lazy initialization of keyboard navigation on first focus
- Efficient segment parsing and highlighting using native DOM selection
- Debounced screen reader announcements to prevent spam

## Migration Guide

### Existing Code
No breaking changes - existing `sl-date-field` usage continues to work unchanged.

### New Features Available
```html
<!-- Keyboard navigation works automatically -->
<sl-date-field value="2024-03-15"></sl-date-field>

<!-- Works with different locales and formats -->
<sl-date-field
  value="2024-03-15"
  locale="en-GB"
  .dateTimeFormat="{ year: 'numeric', month: 'short', day: 'numeric' }">
</sl-date-field>
```

### Accessibility Considerations
- Screen reader users automatically receive navigation feedback
- No additional ARIA attributes needed on the component
- Announcements respect the component's locale setting

## Future Enhancements

Potential improvements for future releases:
- Custom keyboard shortcut configuration
- Additional date format support
- Enhanced validation feedback
- Integration with form validation libraries
- Undo/redo functionality for value changes
