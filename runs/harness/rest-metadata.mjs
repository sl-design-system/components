/**
 * The `get_metadata` shape, rebuilt from a stored REST capture.
 *
 * `T-NOJIRA-figma-ingestion-04` has to walk fourteen designs, and every `get_metadata` call it
 * would make is a call somebody has to sit through. The REST captures `T-NOJIRA-figma-ingestion-06`
 * took already hold the document — **more of it than MCP ever returned** — so the walk can take its
 * tree from disk and spend its live calls on the one tool REST cannot reach.
 *
 * **Validated against the real thing.** For a8's frame, every one of the **98 ids `get_metadata`
 * returned is present** in the 116 this produces. The extra eighteen are inside `334:20594`, the
 * detached frame named `sl-avatar` that MCP stopped short of. A replay that sees more of the design
 * than the live tool did can under-report nothing.
 *
 * It stops at instance boundaries because the live tool does, and because that is what makes the
 * probe set the outermost instances rather than every instance in the file — 706 across the
 * fourteen rather than ten thousand.
 */

/**
 * REST node types to the tags `get_metadata` emits. Anything unlisted keeps its lowercased REST
 * type: a tag this map has not met is better carried through than renamed to something the
 * traversal's `LEAF_TAGS` and `PROBEABLE_TAGS` would misread.
 */
export const METADATA_TAG = /** @type {Record<string, string>} */ ({
  COMPONENT_SET: 'component-set',
  BOOLEAN_OPERATION: 'boolean-operation',
  REGULAR_POLYGON: 'polygon'
});

/** @param {string} type */
export const tagFor = type => METADATA_TAG[type] ?? type.toLowerCase().replace(/_/g, '-');

/** @param {string} value */
const escape = value =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * @typedef {{
 *   id: string;
 *   type?: string;
 *   name?: string;
 *   visible?: boolean;
 *   absoluteBoundingBox?: { x: number; y: number; width: number; height: number } | null;
 *   children?: RestNode[];
 * }} RestNode
 */

/**
 * One node and its subtree, as metadata XML.
 *
 * @param {RestNode} node
 * @param {{ stopAtInstances?: boolean; depth?: number }} [options]
 * @returns {string}
 */
export const metadataXml = (node, { stopAtInstances = true, depth = 0 } = {}) => {
  const tag = tagFor(node.type ?? 'frame'),
    box = node.absoluteBoundingBox,
    pad = '  '.repeat(depth);

  const attributes = [
    `id="${escape(node.id)}"`,
    `name="${escape(node.name ?? '')}"`,
    ...(box
      ? [`x="${box.x}"`, `y="${box.y}"`, `width="${box.width}"`, `height="${box.height}"`]
      : []),
    // REST omits `visible` when it is true, so only `false` is hidden — the same reading
    // `collectNodes` makes, and getting it backwards would hide the design.
    ...(node.visible === false ? ['hidden="true"'] : [])
  ].join(' ');

  // The boundary: an instance is announced and not expanded, which is what the live tool does
  // and what makes a mapped instance prunable rather than already walked.
  const atBoundary = stopAtInstances && depth > 0 && node.type === 'INSTANCE',
    children = atBoundary ? [] : (node.children ?? []);

  if (!children.length) return `${pad}<${tag} ${attributes} />`;

  const inner = children
    .map(child => metadataXml(child, { stopAtInstances, depth: depth + 1 }))
    .join('\n');

  return `${pad}<${tag} ${attributes}>\n${inner}\n${pad}</${tag}>`;
};

/**
 * Finds a node anywhere in a stored capture and renders it.
 *
 * **It throws when the node is not there.** The live tool answers an unknown id with `No node could
 * be found`, which `parseMetadata` refuses; a replay that quietly returned an empty frame instead
 * would turn a missing node into a leaf, which is the substitution this whole plan exists to
 * remove.
 *
 * @param {Record<string, { document: RestNode } | null>} nodes The `nodes` map of a REST capture
 * @param {string} nodeId
 * @returns {string}
 */
export const metadataOf = (nodes, nodeId) => {
  /** @param {RestNode} node @returns {RestNode | null} */
  const find = node => {
    if (node.id === nodeId) return node;

    for (const child of node.children ?? []) {
      const hit = find(child);

      if (hit) return hit;
    }

    return null;
  };

  for (const entry of Object.values(nodes)) {
    if (!entry) continue;

    const hit = find(entry.document);

    if (hit) return metadataXml(hit);
  }

  throw new Error(`No node could be found for the provided nodeId: ${nodeId}`);
};
