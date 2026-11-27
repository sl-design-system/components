import { describe, expect, it } from 'vitest';
import { matchSuggestion } from './suggestion-matching.js';

describe('matchSuggestion', () => {
  it('ignores combining marks of decomposable letters', () => {
    expect(matchSuggestion('Örebro', 'ore')).to.deep.equal({
      start: 0,
      end: 3,
      prefix: true,
      complete: true
    });
    expect(matchSuggestion('Ålesund', 'ales')?.end).to.equal(4);
  });

  it('matches letters without a decomposition through their Latin equivalent', () => {
    expect(matchSuggestion('Łódź', 'lodz')?.end).to.equal(4);
    expect(matchSuggestion('Søren', 'soren')?.end).to.equal(5);
  });

  it('maps a partially typed letter expansion to the whole letter', () => {
    expect(matchSuggestion('Straße', 'stras')).to.deep.equal({
      start: 0,
      end: 5,
      prefix: true,
      complete: false
    });
  });
});
