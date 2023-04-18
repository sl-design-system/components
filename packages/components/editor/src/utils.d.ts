import type { Node, Schema } from 'prosemirror-model';
import type { EditorState } from 'prosemirror-state';
export declare const createContentNode: (schema: Schema, value?: string) => Node;
export declare const getHTML: (state: EditorState) => string;
