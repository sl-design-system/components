function managerEntries(entry = []) {
  return [...entry, require.resolve('./register')];
}

function previewHead(head) {
  return `
    ${head}
    <style>
      body { 
        background: var(--sl-color-body-background);
        color: var(--sl-color-body-foreground);
      }
    </style>
  `;
}

module.exports = { managerEntries, previewHead };
