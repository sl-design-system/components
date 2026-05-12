/// <reference types="@figma/code-connect/figma-types" />
import figma from 'figma';

export default {
  example: figma.code``,
  id: figma.batch.id,
  metadata: {
    props: {
      color: figma.batch.color,
      emphasis: figma.batch.emphasis
    }
  }
};
