const codeContainers = document.querySelectorAll('.ds-code');

codeContainers.forEach(codeContainer => {
  if (navigator.clipboard) {
    const copyButton = document.createElement('sl-button');
    const copyButtonIcon = document.createElement('sl-icon');

    copyButton.classList.add('ds-code__copy-button');
    copyButton.setAttribute('fill', 'outline');
    copyButton.setAttribute('size', 'md');
    copyButton.setAttribute('icon-only', 'icon-only');
    copyButton.setAttribute('aria-label', 'Copy the code');

    copyButtonIcon.setAttribute('name', 'far-copy');

    copyButton.appendChild(copyButtonIcon);
    codeContainer.appendChild(copyButton);

    copyButton.onclick = async () => {
      await copyCode(codeContainer as HTMLElement);
    };
  }
});

async function copyCode(block: HTMLElement): Promise<void> {
  const code = block.querySelector('code');
  if (!code) {
    return;
  }
  const text = code.innerText;

  await navigator.clipboard.writeText(text);
}
