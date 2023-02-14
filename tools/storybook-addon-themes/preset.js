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
        font: var(--sl-text-body-md-normal);
      }
    </style>
  `;
}

module.exports = { managerEntries, previewHead };
