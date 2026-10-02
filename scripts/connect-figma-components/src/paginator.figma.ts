// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=2654-121519
import figma from 'figma';
import { checkBooleanProperty, checkEnum } from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const size = checkEnum(instance.getEnum('↕️ - Size', { SM: 'sm', MD: 'md', LG: 'lg' }) ?? 'md'),
    width = checkEnum<'xs' | 'sm' | 'md' | 'lg'>(
      instance.getEnum('↔︎ Width', { XS: 'xs', SM: 'sm', MD: 'md', LG: 'lg' } as const) ?? 'md'
    ),
    emphasis = checkEnum(
      instance.getEnum('Emphasis', { Bold: 'bold', Outline: 'subtle' }) ?? 'subtle'
    ),
    overflowStart = checkBooleanProperty(instance.getBoolean('Overflow start'), 'Overflow start'),
    overflowEnd = checkBooleanProperty(instance.getBoolean('Overflow end'), 'Overflow end');

  const maxVisiblePages = { xs: 6, sm: 7, md: 9, lg: 11 }[width],
    halfVisiblePages = Math.floor(maxVisiblePages / 2),
    maxPagesWithoutOverflow = halfVisiblePages * 2,
    pageCount =
      overflowStart && overflowEnd
        ? maxVisiblePages * 2 + 2
        : overflowStart
          ? maxVisiblePages + 1
          : overflowEnd
            ? maxPagesWithoutOverflow + 1
            : maxPagesWithoutOverflow,
    page = overflowStart ? (overflowEnd ? maxVisiblePages : pageCount - 1) : 0,
    pageSize = 10,
    totalItems = pageCount * pageSize;

  return figma.code`
		<sl-paginator
			emphasis="${emphasis}"
			page="${page}"
			page-size="${pageSize}"
			size="${size}"
			total-items="${totalItems}"
			width="${width}"
		></sl-paginator>
	`;
}

export default {
  example: getExample(),
  id: 'paginator'
};
