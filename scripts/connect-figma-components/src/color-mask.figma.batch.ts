import figma from 'figma';

export default {
  example: figma.code`<div></div>`,
  id: figma.batch.id,
  metadata: {
    props: {
      color: figma.batch.color,
      emphasis: figma.batch.emphasis
    }
  }
};
