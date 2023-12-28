import type { StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../register.js';

type Story = StoryObj;

export default {
  title: 'Skeleton'
};

export const API: Story = {
  args: {
    effect: 'shimmer'
  },
  argTypes: {
    effect: {
      control: 'inline-radio',
      options: ['none', 'shimmer', 'sheen', 'pulse']
    }
  },
  render: ({ effect }) =>
    html`
      <style>
        section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .container {
          display: grid;
          gap: 1rem;
          width: 60%;
        }

        .container sl-skeleton {
          block-size: 1.25rem;
        }

        .title {
          display: grid;
          grid-template-columns: auto 1fr;
          align-items: center;
          gap: 0.5rem;
        }

        .title sl-skeleton:first-of-type {
          aspect-ratio: 1;
          block-size: 2.5rem;
        }

        .body {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .body sl-skeleton {
          block-size: 1rem;
          inline-size: 80%;
        }

        .body sl-skeleton:first-of-type {
          inline-size: 100%;
        }

        .body sl-skeleton:last-of-type {
          inline-size: 60%;
        }

        .container-images {
          display: grid;
          gap: 2rem;
          grid-auto-columns: 1fr;
          grid-auto-flow: column;
          margin-top: 2rem;
        }

        .container-images sl-skeleton {
          block-size: 8rem;
        }
      </style>
      <section aria-label="Loading">
        <div class="container">
          <div class="title">
            <sl-skeleton variant="circle" .effect=${effect}></sl-skeleton>
            <sl-skeleton .effect=${effect}></sl-skeleton>
          </div>
          <div class="body">
            <sl-skeleton .effect=${effect}></sl-skeleton>
            <sl-skeleton .effect=${effect}></sl-skeleton>
            <sl-skeleton .effect=${effect}></sl-skeleton>
          </div>
        </div>
      </section>
      <section aria-label="Loading pictures">
        <div class="container-images">
          <sl-skeleton .effect=${effect}></sl-skeleton>
          <sl-skeleton .effect=${effect}></sl-skeleton>
          <sl-skeleton .effect=${effect}></sl-skeleton>
          <sl-skeleton .effect=${effect}></sl-skeleton>
          <sl-skeleton .effect=${effect}></sl-skeleton>
        </div>
      </section>
    `
};

export const All: Story = {
  args: {
    width: '80%'
  },
  render: ({ width }) =>
    html`
      <style>
        section {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        sl-skeleton {
          height: 1rem;
        }
      </style>
      <section>
        <h2>No effect</h2>
        <sl-skeleton effect="none" style="width: ${width};"></sl-skeleton>
        <h2>Shimmer effect (default)</h2>
        <sl-skeleton style="width: ${width};"></sl-skeleton>
        <h2>Sheen effect</h2>
        <sl-skeleton effect="sheen" style="width: ${width};"></sl-skeleton>
        <h2>Pulse effect</h2>
        <sl-skeleton effect="pulse" style="width: ${width};"></sl-skeleton>
      </section>
    `
};

export const LoadingImage: Story = {
  args: {
    effect: 'shimmer'
  },
  argTypes: {
    effect: {
      control: 'inline-radio',
      options: ['none', 'shimmer', 'sheen', 'pulse']
    }
  },
  render: ({ effect }) => {
    setTimeout(() => {
      const image = document.querySelector('img');
      if (image) {
        image.style.opacity = '1';
      }
    }, 7000);
    return html`
      <style>
        section {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .picture {
          position: relative;
          display: flex;
          width: 20%;
          height: 20%;
        }

        sl-skeleton {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        img {
          width: 100%;
          aspect-ratio: 1 / 1;
          border-radius: var(--sl-border-radius-skeleton-default);
          opacity: 0;
          transition: opacity 2s;
          z-index: 1;
        }
      </style>
      <section>
        <div class="picture" aria-label="Loading picture with New York buildings">
          <img
            src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="city"
          />
          <sl-skeleton .effect=${effect}></sl-skeleton>
        </div>
      </section>
    `;
  }
};
