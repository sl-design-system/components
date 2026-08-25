import { type Command, type Transaction } from 'prosemirror-state';
export type DispatchFn = (tr: Transaction) => void;
export declare const setHTML: (content: string) => Command;
