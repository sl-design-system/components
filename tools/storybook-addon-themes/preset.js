function managerEntries(entry = []) {
  return [...entry, require.resolve('./register')];
}

function previewHead(head) {
  return `
    ${head}
    <style>
      body { 
        background: var(--sl-body-background, #fff);
        color: var(--sl-body-foreground, #333);
      }
    </style>
  `;
}

module.exports = { managerEntries, previewHead };
