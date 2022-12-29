const codeContainers = document.querySelectorAll('.ds-code');

// window.onload = () => {
// if (!codeContainers) {
//   return;
// }

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

// console.log('codeContainer', codeContainer);
// const copyButton = document.createElement('button');
// copyButton.classList.add('ds-code__copy-button');
// codeContainer.appendChild(copyButton);
//
// copyButton.onclick = () => {
//   copyCode();
// };
// };

// function copyCode(): void {
//   if (!codeElement?.textContent) {
//     return;
//   }
//   void navigator.clipboard.writeText(codeElement.textContent);
//   alert('Copied the text: ' + codeElement.textContent);
// }

async function copyCode(block: HTMLElement): Promise<void> {
  const code = block.querySelector('code');
  if (!code) {
    return;
  }
  const text = code.innerText;

  await navigator.clipboard.writeText(text);

  alert('Copied the text: ' + text);
}

// navigator.clipboard.writeText(copyText.value);

// Alert the copied text
// alert('Copied the text: ' + copyText.value);
