import type { Command, Transaction } from 'prosemirror-state';
export type DispatchFn = (tr: Transaction) => void;
export declare const setHTML: (content: string) => Command;
