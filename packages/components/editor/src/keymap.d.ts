import type { Schema } from 'prosemirror-model';
import type { Command } from 'prosemirror-state';
import type { EditorMarks, EditorNodes } from './schema.js';
export declare const buildKeymap: (schema: Schema<EditorNodes, EditorMarks>) => {
    [key: string]: Command;
};
export declare const buildListKeymap: (schema: Schema<EditorNodes, EditorMarks>) => {
    [key: string]: Command;
};
