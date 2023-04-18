import type { Attrs, MarkSpec, NodeSpec } from 'prosemirror-model';
export declare type EditorMarks = 'link' | 'em' | 'strong' | 'code' | 'underline' | 'strikethrough' | 'subscript' | 'superscript';
export declare type EditorNodes = 'doc' | 'paragraph' | 'blockquote' | 'horizontalRule' | 'heading' | 'codeBlock' | 'text' | 'image' | 'hardBreak' | 'listItem' | 'orderedList' | 'bulletList';
export declare const isEmpty: (obj: Record<string, unknown>) => boolean;
export declare const removeEntries: (obj: Record<string, unknown>, predicate: (key: string) => boolean) => Record<string, string>;
export declare const removeEmptyEntries: (obj: Record<string, unknown>) => Record<string, string>;
export declare const commonAttributes: () => Attrs;
export declare const marks: Record<EditorMarks, MarkSpec>;
export declare const nodes: Record<EditorNodes, NodeSpec>;
