import { fixture } from '@sl-design-system/vitest-browser-lit';
import { userEvent } from '@vitest/browser/context';
import { html } from 'lit';
import { spy, stub } from 'sinon';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import '../register.js';
import { Upload } from './upload.js';

describe('sl-upload', () => {
  let el: Upload;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-upload></sl-upload>`);
    });

    it('should render correctly', () => {
      expect(el).to.exist;
      expect(el).to.be.an.instanceof(Upload);
    });

    it('should have an input element', () => {
      expect(el.input).to.exist;
      expect(el.input.type).to.equal('file');
    });

    it('should not be disabled by default', () => {
      expect(el.disabled).to.be.undefined;
      expect(el).not.to.have.attribute('disabled');
    });

    it('should not be required by default', () => {
      expect(el.required).to.be.undefined;
      expect(el).not.to.have.attribute('required');
    });

    it('should allow multiple files by default', () => {
      expect(el.multiple).to.be.false;
    });

    it('should have drag-drop enabled by default', () => {
      expect(el.dragDrop).to.be.true;
    });

    it('should have no files by default', () => {
      expect(el.files).to.be.an('array').that.is.empty;
      expect(el.value).to.be.an('array').that.is.empty;
    });

    it('should have default size', () => {
      expect(el.size).to.be.undefined;
      expect(el).not.to.have.attribute('size');
    });
  });

  describe('properties', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-upload></sl-upload>`);
    });

    it('should set disabled property', async () => {
      el.disabled = true;
      await el.updateComplete;

      expect(el).to.have.attribute('disabled');
      expect(el.input.disabled).to.be.true;
    });

    it('should set required property', async () => {
      el.required = true;
      await el.updateComplete;

      expect(el).to.have.attribute('required');
      expect(el.input.required).to.be.true;
    });

    it('should set multiple property', async () => {
      el.multiple = true;
      await el.updateComplete;

      expect(el.input.multiple).to.be.true;
    });

    it('should set accept property', async () => {
      el.accept = 'image/*';
      await el.updateComplete;

      expect(el.input.accept).to.equal('image/*');
    });

    it('should set size property', async () => {
      el.size = 'lg';
      await el.updateComplete;

      expect(el).to.have.attribute('size', 'lg');
    });

    it('should set drag-drop property', async () => {
      el.dragDrop = false;
      await el.updateComplete;

      expect(el.dragDrop).to.be.false;
    });

    it('should set max-size property', async () => {
      el.maxSize = 1024 * 1024; // 1MB
      await el.updateComplete;

      expect(el.maxSize).to.equal(1024 * 1024);
    });
  });

  describe('file selection', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-upload></sl-upload>`);
    });

    it('should open file picker when dropzone is clicked', async () => {
      const clickSpy = spy(el.input, 'click');
      const dropzone = el.shadowRoot!.querySelector('.dropzone') as HTMLElement;

      await userEvent.click(dropzone);

      expect(clickSpy).to.have.been.calledOnce;
    });

    it('should not open file picker when disabled', async () => {
      el.disabled = true;
      await el.updateComplete;

      const clickSpy = spy(el.input, 'click');
      const dropzone = el.shadowRoot!.querySelector('.dropzone') as HTMLElement;

      await userEvent.click(dropzone);

      expect(clickSpy).to.not.have.been.called;
    });

    it('should handle file selection', async () => {
      const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);

      // Simulate file selection
      Object.defineProperty(el.input, 'files', {
        value: dataTransfer.files,
        writable: false
      });

      el.input.dispatchEvent(new Event('change'));
      await el.updateComplete;

      expect(el.files).to.have.lengthOf(1);
      expect(el.files[0].name).to.equal('test.txt');
    });

    it('should emit change event when files are selected', async () => {
      const changeSpy = spy();
      el.addEventListener('sl-change', changeSpy);

      const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);

      Object.defineProperty(el.input, 'files', {
        value: dataTransfer.files,
        writable: false
      });

      el.input.dispatchEvent(new Event('change'));
      await el.updateComplete;

      expect(changeSpy).to.have.been.calledOnce;
    });
  });

  describe('multiple files', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-upload multiple></sl-upload>`);
    });

    it('should accept multiple files', async () => {
      const file1 = new File(['content1'], 'test1.txt', { type: 'text/plain' });
      const file2 = new File(['content2'], 'test2.txt', { type: 'text/plain' });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file1);
      dataTransfer.items.add(file2);

      Object.defineProperty(el.input, 'files', {
        value: dataTransfer.files,
        writable: false
      });

      el.input.dispatchEvent(new Event('change'));
      await el.updateComplete;

      expect(el.files).to.have.lengthOf(2);
    });

    it('should only accept first file when multiple is false', async () => {
      el.multiple = false;
      await el.updateComplete;

      const file1 = new File(['content1'], 'test1.txt', { type: 'text/plain' });
      const file2 = new File(['content2'], 'test2.txt', { type: 'text/plain' });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file1);
      dataTransfer.items.add(file2);

      Object.defineProperty(el.input, 'files', {
        value: dataTransfer.files,
        writable: false
      });

      el.input.dispatchEvent(new Event('change'));
      await el.updateComplete;

      expect(el.files).to.have.lengthOf(1);
      expect(el.files[0].name).to.equal('test1.txt');
    });
  });

  describe('file validation', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-upload accept="image/*"></sl-upload>`);
    });

    it('should filter files by accept attribute', async () => {
      const imageFile = new File(['image'], 'test.png', { type: 'image/png' });
      const textFile = new File(['text'], 'test.txt', { type: 'text/plain' });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(imageFile);
      dataTransfer.items.add(textFile);

      Object.defineProperty(el.input, 'files', {
        value: dataTransfer.files,
        writable: false
      });

      el.input.dispatchEvent(new Event('change'));
      await el.updateComplete;

      expect(el.files).to.have.lengthOf(1);
      expect(el.files[0].name).to.equal('test.png');
    });

    it('should filter files by max size', async () => {
      el.maxSize = 100; // 100 bytes
      await el.updateComplete;

      const smallFile = new File(['x'.repeat(50)], 'small.txt', { type: 'text/plain' });
      const largeFile = new File(['x'.repeat(200)], 'large.txt', { type: 'text/plain' });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(smallFile);
      dataTransfer.items.add(largeFile);

      Object.defineProperty(el.input, 'files', {
        value: dataTransfer.files,
        writable: false
      });

      el.input.dispatchEvent(new Event('change'));
      await el.updateComplete;

      expect(el.files).to.have.lengthOf(1);
      expect(el.files[0].name).to.equal('small.txt');
    });
  });

  describe('drag and drop', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-upload></sl-upload>`);
    });

    it('should set drag-over attribute on dragenter', () => {
      const dragEvent = new DragEvent('dragenter', {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer()
      });

      el.dispatchEvent(dragEvent);

      expect(el).to.have.attribute('drag-over');
    });

    it('should remove drag-over attribute on dragleave', () => {
      const dragEnter = new DragEvent('dragenter', {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer()
      });
      el.dispatchEvent(dragEnter);

      const dragLeave = new DragEvent('dragleave', {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer()
      });
      el.dispatchEvent(dragLeave);

      expect(el).not.to.have.attribute('drag-over');
    });

    it('should handle file drop', async () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);

      const dropEvent = new DragEvent('drop', {
        bubbles: true,
        cancelable: true,
        dataTransfer
      });

      el.dispatchEvent(dropEvent);
      await el.updateComplete;

      expect(el.files).to.have.lengthOf(1);
      expect(el.files[0].name).to.equal('test.txt');
      expect(el).not.to.have.attribute('drag-over');
    });

    it('should not handle drag events when dragDrop is false', async () => {
      el.dragDrop = false;
      await el.updateComplete;

      const dragEvent = new DragEvent('dragenter', {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer()
      });

      el.dispatchEvent(dragEvent);

      expect(el).not.to.have.attribute('drag-over');
    });

    it('should not handle drag events when disabled', async () => {
      el.disabled = true;
      await el.updateComplete;

      const dragEvent = new DragEvent('dragenter', {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer()
      });

      el.dispatchEvent(dragEvent);

      expect(el).not.to.have.attribute('drag-over');
    });
  });

  describe('file removal', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-upload multiple></sl-upload>`);
      
      const file1 = new File(['content1'], 'test1.txt', { type: 'text/plain' });
      const file2 = new File(['content2'], 'test2.txt', { type: 'text/plain' });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file1);
      dataTransfer.items.add(file2);

      Object.defineProperty(el.input, 'files', {
        value: dataTransfer.files,
        writable: false
      });

      el.input.dispatchEvent(new Event('change'));
      await el.updateComplete;
    });

    it('should display remove buttons for files', () => {
      const removeButtons = el.shadowRoot!.querySelectorAll('.remove-button');
      expect(removeButtons).to.have.lengthOf(2);
    });

    it('should remove file when remove button is clicked', async () => {
      const removeButton = el.shadowRoot!.querySelector('.remove-button') as HTMLButtonElement;
      await userEvent.click(removeButton);

      expect(el.files).to.have.lengthOf(1);
      expect(el.files[0].name).to.equal('test2.txt');
    });

    it('should emit change event when file is removed', async () => {
      const changeSpy = spy();
      el.addEventListener('sl-change', changeSpy);

      const removeButton = el.shadowRoot!.querySelector('.remove-button') as HTMLButtonElement;
      await userEvent.click(removeButton);

      expect(changeSpy).to.have.been.calledOnce;
    });

    it('should not show remove buttons when disabled', async () => {
      el.disabled = true;
      await el.updateComplete;

      const removeButtons = el.shadowRoot!.querySelectorAll('.remove-button');
      expect(removeButtons).to.have.lengthOf(0);
    });
  });

  describe('form integration', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-upload required></sl-upload>`);
    });

    it('should be invalid when required and no files selected', () => {
      el.updateValidity();
      expect(el.valid).to.be.false;
    });

    it('should be valid when required and files are selected', async () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);

      Object.defineProperty(el.input, 'files', {
        value: dataTransfer.files,
        writable: false
      });

      el.input.dispatchEvent(new Event('change'));
      await el.updateComplete;

      el.updateValidity();
      expect(el.valid).to.be.true;
    });

    it('should return files as formValue', async () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);

      Object.defineProperty(el.input, 'files', {
        value: dataTransfer.files,
        writable: false
      });

      el.input.dispatchEvent(new Event('change'));
      await el.updateComplete;

      expect(el.formValue).to.deep.equal(el.files);
    });
  });
});
