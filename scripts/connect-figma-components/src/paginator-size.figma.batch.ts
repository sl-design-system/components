// source=packages/components/paginator/src/page-size.ts
// component=PaginatorPageSize
import figma from 'figma';
import { type InstanceHandle, checkStringProperty } from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const itemLabel = checkStringProperty(instance.getString('Items Label'), 'Items Label'),
    select = instance.findInstance('Pages Dropdown [sl-select]') as InstanceHandle,
    selectedValue = Number(checkStringProperty(select.getString('value'), 'value')),
    pageSize = Number.isInteger(selectedValue) && selectedValue > 0 ? selectedValue : 10,
    pageSizes = [...new Set([10, 20, 50, pageSize])].sort((first, second) => first - second),
    labelLiteral = JSON.stringify(itemLabel);

  return figma.code`
    <sl-paginator-page-size
      id="page-size"
      page-size="${pageSize}"
      page-sizes="${JSON.stringify(pageSizes)}"
    ></sl-paginator-page-size>
    <script>
      document.getElementById('page-size').itemLabel = ${labelLiteral};
    </script>
  `;
}

export default {
  example: getExample(),
  id: figma.batch.id
};
