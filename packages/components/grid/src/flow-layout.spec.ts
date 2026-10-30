import {
  ArrayListDataSource,
  FetchListDataSource,
  type FetchListDataSourceCallbackResult
} from '@sl-design-system/data-source';
import { spy } from 'sinon';
import { beforeEach, describe, expect, it } from 'vitest';
import { GridFlowLayout } from './flow-layout.js';

describe('GridFlowLayout', () => {
  class TestLayout extends GridFlowLayout {
    get scrollSize(): number {
      this._updateScrollSize();
      return this._scrollSize;
    }
  }

  let layout: TestLayout;
  const measurements = {
    0: { width: 200, height: 38, marginTop: 0, marginRight: 0, marginBottom: 0, marginLeft: 0 },
    1: { width: 200, height: 100, marginTop: 0, marginRight: 0, marginBottom: 0, marginLeft: 0 }
  };

  beforeEach(() => {
    layout = new TestLayout(() => undefined);
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

  it('should discard offscreen measurements when nested record content changes in place', () => {
    const items = [
        { id: 1, details: { text: 'Short text' } },
        { id: 2, details: { text: 'Previously wrapped text' } }
      ],
      dataSource = new ArrayListDataSource(items);
    layout.items = dataSource.items;
    layout.updateItemSizes(measurements);

    items[1].details.text = 'Short text';
    dataSource.update();
    layout.items = dataSource.items;

    layout.updateItemSizes({ 0: measurements[0] });

    expect(layout._metricsCache.getChildSize(1)).to.be.undefined;
  });

  it('should detect content edits when the items array and wrappers are retained', () => {
    const items = [
        { id: 1, text: 'Short' },
        { id: 2, text: 'Long' }
      ],
      dataSource = new ArrayListDataSource(items);
    layout.items = dataSource.items;
    layout.updateItemSizes(measurements);

    items[1].text = 'Short';
    layout.items = dataSource.items;

    layout.updateItemSizes({ 0: measurements[0] });

    expect(layout._metricsCache.getChildSize(1)).to.be.undefined;
  });

  it('should apply a real scroll extent increase of three pixels', () => {
    layout.items = [{ id: 1 }, { id: 2 }];
    layout.updateItemSizes({ 0: measurements[0], 1: measurements[0] });

    expect(layout.scrollSize).to.equal(76);

    layout.updateItemSizes({ 1: { ...measurements[0], height: 41 } });

    expect(layout.scrollSize).to.equal(79);
    expect(layout.scrollSize).to.equal(79);
  });

  it('should retain measurements for unchanged cyclic data and detect later edits', () => {
    const details: { text: string; self?: unknown } = { text: 'Original' };
    details.self = details;
    const dataSource = new ArrayListDataSource([{ id: 1 }, { id: 2, details }], {
      selects: 'multiple'
    });
    layout.items = dataSource.items;
    layout.updateItemSizes(measurements);

    dataSource.select(dataSource.items[0]);
    dataSource.update();
    layout.items = dataSource.items;
    layout.updateItemSizes({ 0: measurements[0] });

    expect(layout._metricsCache.getChildSize(1)).to.equal(100);

    details.text = 'Updated';
    dataSource.update();
    layout.items = dataSource.items;
    layout.updateItemSizes({ 0: measurements[0] });

    expect(layout._metricsCache.getChildSize(1)).to.be.undefined;
  });

  it('should detect a date changed in place in a measured record', () => {
    const date = new Date('2026-01-01T00:00:00Z'),
      dataSource = new ArrayListDataSource([{ id: 1 }, { id: 2, date }]);
    layout.items = dataSource.items;
    layout.updateItemSizes(measurements);

    date.setUTCDate(2);
    dataSource.update();
    layout.items = dataSource.items;
    layout.updateItemSizes({ 0: measurements[0] });

    expect(layout._metricsCache.getChildSize(1)).to.be.undefined;
  });

  it('should invalidate conservatively without invoking application getters', () => {
    const getter = spy(() => 'Text'),
      item = Object.defineProperty({ id: 2 }, 'text', { get: getter }),
      dataSource = new ArrayListDataSource([{ id: 1 }, item]);
    layout.items = dataSource.items;
    layout.updateItemSizes(measurements);

    dataSource.update();
    layout.items = dataSource.items;
    layout.updateItemSizes({ 0: measurements[0] });

    expect(layout._metricsCache.getChildSize(1)).to.be.undefined;
    expect(getter).not.to.have.been.called;
  });

  it('should bound snapshot traversal when each row references a shared collection', () => {
    type Record = { id: number; parent?: { children: Record[] } };
    const readProperty = spy(Reflect.getOwnPropertyDescriptor),
      children: Record[] = Array.from(
        { length: 2000 },
        (_, id) => new Proxy({ id }, { getOwnPropertyDescriptor: readProperty })
      ),
      parent = { children };
    children.forEach(child => (child.parent = parent));
    const dataSource = new ArrayListDataSource(children, { selects: 'multiple' });
    layout.items = dataSource.items;
    readProperty.resetHistory();
    layout.updateItemSizes(measurements);

    // Snapshot work must not grow with the shared collection's size per measured row.
    expect(readProperty.callCount).to.be.lessThan(1000);

    readProperty.resetHistory();
    dataSource.select(dataSource.items[0]);
    dataSource.update();
    layout.items = dataSource.items;
    layout.updateItemSizes({ 0: measurements[0] });

    expect(readProperty.callCount).to.be.lessThan(100);
    expect(layout._metricsCache.getChildSize(1)).to.be.undefined;
  });

  it('should invalidate deeply nested records without overflowing the stack', () => {
    let data: { child?: unknown } = {};
    for (let depth = 0; depth < 10000; depth++) {
      data = { child: data };
    }
    const dataSource = new ArrayListDataSource([{ id: 1 }, { id: 2, data }]);
    layout.items = dataSource.items;

    expect(() => layout.updateItemSizes(measurements)).not.to.throw();

    dataSource.update();
    layout.items = dataSource.items;
    layout.updateItemSizes({ 0: measurements[0] });

    expect(layout._metricsCache.getChildSize(1)).to.be.undefined;
  });

  it('should not enumerate an oversized shared object again for each measured row', () => {
    const ownKeys = spy(Reflect.ownKeys),
      shared = new Proxy(
        Object.fromEntries(Array.from({ length: 2000 }, (_, index) => [`field${index}`, index])),
        { ownKeys }
      ),
      dataSource = new ArrayListDataSource([
        { id: 1, shared },
        { id: 2, shared }
      ]);
    layout.items = dataSource.items;
    layout.updateItemSizes(measurements);

    expect(ownKeys).to.have.been.calledOnce;

    dataSource.update();
    layout.items = dataSource.items;
    layout.updateItemSizes({ 0: measurements[0] });

    expect(ownKeys).to.have.been.calledOnce;
    expect(layout._metricsCache.getChildSize(1)).to.be.undefined;
  });

  it('should apply a real scroll extent decrease of three pixels', () => {
    layout.items = [{ id: 1 }, { id: 2 }];
    layout.updateItemSizes({ 0: measurements[0], 1: measurements[0] });

    expect(layout.scrollSize).to.equal(76);

    layout.updateItemSizes({ 1: { ...measurements[0], height: 35 } });

    expect(layout.scrollSize).to.equal(73);
    expect(layout.scrollSize).to.equal(73);
  });
});
