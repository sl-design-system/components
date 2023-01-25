const codeContainers = document.querySelectorAll('.ds-code');

codeContainers.forEach(codeContainer => {
  if (navigator.clipboard) {
    const copyButton = document.createElement('button');

    copyButton.classList.add('ds-code__copy-button');
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
