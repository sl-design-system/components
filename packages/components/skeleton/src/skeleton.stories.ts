import type { StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../register.js';

type Story = StoryObj;

export default {
  title: 'Skeleton'
};

export const API: Story = {
  args: {
    effect: 'pulse' // TODO: shimmer?
  }, // TODO: aria-label as well? a11y
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
          border-radius: 0.5rem;
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
          border-radius: 50%;
        }

        .body {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .body sl-skeleton {
          block-size: 0.5rem;
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
          border-radius: 0.5rem;
        }
      </style>
      <section>
        <div class="container">
          <div class="title">
            <sl-skeleton .effect=${effect} aria-label="loading avatar"></sl-skeleton>
            <sl-skeleton .effect=${effect} aria-label="loading header"></sl-skeleton>
          </div>
          <div class="body">
            <sl-skeleton .effect=${effect} aria-label="loading paragraph"></sl-skeleton>
            <sl-skeleton .effect=${effect} aria-label="loading paragraph"></sl-skeleton>
            <sl-skeleton .effect=${effect} aria-label="loading paragraph"></sl-skeleton>
          </div>
        </div>
      </section>
      <section>
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

// TODO: example of real loading

export const All: Story = {
  args: {
    width: '80%',
    height: '0.75rem',
    radius: '0.5rem'
  }, // TODO: background and shine colour?
  render: ({ width, height, radius }) =>
    html`
      <style>
        section {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
      </style>
      <section>
        <h2>No effect</h2>
        <sl-skeleton effect="none" style="width: ${width}; height: ${height}; border-radius: ${radius}"></sl-skeleton>
        <h2>Shimmer effect (default)</h2>
        <sl-skeleton style="width: ${width}; height: ${height}; border-radius: ${radius}"></sl-skeleton>
        <h2>Sheen effect</h2>
        <sl-skeleton effect="sheen" style="width: ${width}; height: ${height}; border-radius: ${radius}"></sl-skeleton>
        <h2>Pulse effect</h2>
        <sl-skeleton effect="pulse" style="width: ${width}; height: ${height}; border-radius: ${radius}"></sl-skeleton>
      </section>
    `
};
