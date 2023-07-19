import type { StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../register.js';

type Story = StoryObj;

export default {
  title: 'Skeleton'
};

export const API: Story = {
  render: () =>
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
        <!--        <sl-skeleton effect="none"></sl-skeleton>-->
        <!--        <sl-skeleton></sl-skeleton>-->
        <!--        <sl-skeleton effect="sheen"></sl-skeleton>-->
        <!--        <sl-skeleton effect="pulse"></sl-skeleton>-->
        <div class="container">
          <div class="title">
            <sl-skeleton effect="none"></sl-skeleton>
            <sl-skeleton effect="none"></sl-skeleton>
          </div>
          <div class="body">
            <sl-skeleton effect="none"></sl-skeleton>
            <sl-skeleton effect="none"></sl-skeleton>
            <sl-skeleton effect="none"></sl-skeleton>
          </div>
        </div>
      </section>
      <section>
        <div class="container-images">
          <sl-skeleton effect="none"></sl-skeleton>
          <sl-skeleton effect="none"></sl-skeleton>
          <sl-skeleton effect="none"></sl-skeleton>
          <sl-skeleton effect="none"></sl-skeleton>
          <sl-skeleton effect="none"></sl-skeleton>
        </div>
      </section>
    `
};

export const All: Story = {
  render: () =>
    html`
      <style>
        section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
      </style>
      <section>
        <sl-skeleton effect="none"></sl-skeleton>
        <sl-skeleton></sl-skeleton>
        <sl-skeleton effect="sheen"></sl-skeleton>
        <sl-skeleton effect="pulse"></sl-skeleton>
      </section>
    `
};
