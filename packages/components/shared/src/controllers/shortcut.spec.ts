import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ShortcutController } from './shortcut.js';

const mockHost = {
  addController: vi.fn(),
  removeController: vi.fn()
} as unknown as Parameters<(typeof ShortcutController)['prototype']['bind']>[0] & {
  addController: ReturnType<typeof vi.fn>;
};

function createController(): ShortcutController {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
  return new ShortcutController(mockHost as unknown as any);
}

function mockPlatform(platform: string): void {
  vi.spyOn(navigator, 'platform', 'get').mockReturnValue(platform);
}

describe('ShortcutController', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('renderAsLabel', () => {
    describe('on Mac', () => {
      beforeEach(() => mockPlatform('MacIntel'));

      it('renders $mod as ⌘', () => {
        expect(createController().renderAsLabel('$mod+k')).toBe('⌘k');
      });

      it('renders Shift as ⇧', () => {
        expect(createController().renderAsLabel('Shift+k')).toBe('⇧k');
      });

      it('renders Control as ⌃', () => {
        expect(createController().renderAsLabel('Control+k')).toBe('⌃k');
      });

      it('renders Alt as ⌥', () => {
        expect(createController().renderAsLabel('Alt+k')).toBe('⌥k');
      });

      it('renders combined modifiers', () => {
        expect(createController().renderAsLabel('$mod+Shift+k')).toBe('⌘⇧k');
      });

      it('strips Key prefix from key names', () => {
        expect(createController().renderAsLabel('$mod+KeyK')).toBe('⌘K');
      });

      it('strips Digit prefix from key names', () => {
        expect(createController().renderAsLabel('$mod+Digit1')).toBe('⌘1');
      });
    });

    describe('on non-Mac', () => {
      beforeEach(() => mockPlatform('Win32'));

      it('renders $mod as ⌃', () => {
        expect(createController().renderAsLabel('$mod+k')).toBe('⌃k');
      });

      it('renders Shift as ⇧', () => {
        expect(createController().renderAsLabel('Shift+k')).toBe('⇧k');
      });

      it('renders Control as ⌃', () => {
        expect(createController().renderAsLabel('Control+k')).toBe('⌃k');
      });

      it('renders Alt as ⌥', () => {
        expect(createController().renderAsLabel('Alt+k')).toBe('⌥k');
      });

      it('renders combined modifiers', () => {
        expect(createController().renderAsLabel('$mod+Shift+k')).toBe('⌃⇧k');
      });
    });
  });

  describe('renderAsText', () => {
    describe('on Mac', () => {
      beforeEach(() => mockPlatform('MacIntel'));

      it('renders $mod as Meta', () => {
        expect(createController().renderAsText('$mod+k')).toBe('Meta+k');
      });

      it('passes through Shift unchanged', () => {
        expect(createController().renderAsText('Shift+k')).toBe('Shift+k');
      });

      it('passes through Control unchanged', () => {
        expect(createController().renderAsText('Control+k')).toBe('Control+k');
      });

      it('strips Key prefix from key names', () => {
        expect(createController().renderAsText('$mod+KeyK')).toBe('Meta+K');
      });

      it('strips Digit prefix from key names', () => {
        expect(createController().renderAsText('$mod+Digit1')).toBe('Meta+1');
      });
    });

    describe('on non-Mac', () => {
      beforeEach(() => mockPlatform('Win32'));

      it('renders $mod as Ctrl', () => {
        expect(createController().renderAsText('$mod+k')).toBe('Ctrl+k');
      });

      it('renders combined modifiers', () => {
        expect(createController().renderAsText('$mod+Shift+k')).toBe('Ctrl+Shift+k');
      });
    });
  });
});
