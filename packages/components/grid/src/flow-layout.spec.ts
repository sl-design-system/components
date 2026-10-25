import {
  ArrayListDataSource,
  FetchListDataSource,
  type FetchListDataSourceCallbackResult
} from '@sl-design-system/data-source';
import { spy } from 'sinon';
import { beforeEach, describe, expect, it } from 'vitest';
import { GridFlowLayout } from './flow-layout.js';

describe('GridFlowLayout', () => {
  let layout: GridFlowLayout;
  const measurements = {
    0: { width: 200, height: 38, marginTop: 0, marginRight: 0, marginBottom: 0, marginLeft: 0 },
    1: { width: 200, height: 100, marginTop: 0, marginRight: 0, marginBottom: 0, marginLeft: 0 }
  };

  beforeEach(() => {
    layout = new GridFlowLayout(() => undefined);
  });

  it('should stop comparing unloaded placeholders without requesting every page', () => {
    const request = Promise.withResolvers<FetchListDataSourceCallbackResult<{ id: number }>>(),
      fetchPage = spy(() => request.promise),
      dataSource = new FetchListDataSource({ fetchPage, size: 1000, pageSize: 10 });

    // Only the first page is in use while its fetch is still pending.
    void dataSource.items[0];
    layout.items = dataSource.items;
    layout.updateItemSizes(measurements);

    dataSource.update();
    layout.items = dataSource.items;

    expect(fetchPage).to.have.been.calledOnce;

    layout.updateItemSizes({ 0: measurements[0] });
    expect(layout._metricsCache.getChildSize(1)).to.be.undefined;
  });

  it('should discard offscreen measurements when records are replaced under the same IDs', () => {
    const dataSource = new ArrayListDataSource([
      { id: 1, text: 'Short text' },
      { id: 2, text: 'Previously wrapped text' }
    ]);
    layout.items = dataSource.items;
    layout.updateItemSizes(measurements);

    dataSource.setData([
      { id: 1, text: 'Updated short text' },
      { id: 2, text: 'Short text' }
    ]);
    dataSource.update();
    layout.items = dataSource.items;

    // Only the visible row has been measured again; the offscreen row is stale.
    layout.updateItemSizes({ 0: measurements[0] });
    expect(layout._metricsCache.getChildSize(0)).to.equal(38);
    expect(layout._metricsCache.getChildSize(1)).to.be.undefined;
  });

  it('should retain offscreen measurements when only selection wrappers change', () => {
    const dataSource = new ArrayListDataSource([{ id: 1 }, { id: 2 }], { selects: 'multiple' });
    layout.items = dataSource.items;
    layout.updateItemSizes(measurements);

    dataSource.select(dataSource.items[0]);
    dataSource.update();
    layout.items = dataSource.items;

    layout.updateItemSizes({ 0: measurements[0] });
    expect(layout._metricsCache.getChildSize(1)).to.equal(100);
  });
});
