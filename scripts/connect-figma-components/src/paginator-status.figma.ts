// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=2640-93857
// source=packages/components/paginator/src/status.ts
// component=PaginatorStatus
import figma from 'figma';
import { checkStringProperty } from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const highRange = Number.parseInt(
      checkStringProperty(instance.getString('High Range'), 'High Range'),
      1
    ),
    lowRange = Number.parseInt(
      checkStringProperty(instance.getString('Low Range'), 'Low Range'),
      10
    ),
    totalItems = Number.parseInt(
      checkStringProperty(instance.getString('Total Range'), 'Total Range'),
      100
    ),
    pageSize = highRange - lowRange - 1,
    page = Math.max(Math.ceil(highRange / pageSize) - 1, 0);

  return figma.code`
    <sl-paginator-status
      page="${page}"
      page-size="${pageSize}"
      total-items="${totalItems}"
    ></sl-paginator-status>
  `;
}

export default {
  example: getExample(),
  id: 'paginator-status'
};
