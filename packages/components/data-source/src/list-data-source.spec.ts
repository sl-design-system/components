import { type Person, getPeople } from '@sl-design-system/example-data';
import { beforeEach, describe, expect, it } from 'vitest';
import { ListDataSource, type ListDataSourceItem } from './list-data-source.js';

class TestListDataSource extends ListDataSource<Person> {
  override get items() {
    return [];
  }

  override size: number;
  override totalSize: number;

  constructor(size: number) {
    super({});

    this.size = size;
    this.totalSize = size;
  }

  override expandGroup(id: unknown): void {
    console.log('expand group', id);
  }

  override collapseGroup(id: unknown): void {
    console.log('collapse group', id);
  }

  override toggleGroup(id: unknown): void {
    console.log('toggle group', id);
  }

  override isGroupCollapsed(_id: unknown): boolean {
    return false;
  }

  override reorder(
    _item: ListDataSourceItem<Person>,
    _relativeItem: ListDataSourceItem<Person>,
    _position: 'before' | 'after' | 'replace'
  ): void {
    // empty
  }

  override update(): void {
    // empty
  }
}

describe('ListDataSource', () => {
  let ds: TestListDataSource;

  beforeEach(async () => {
    const { total } = await getPeople();

    ds = new TestListDataSource(total);
  });

  it('should not group by by default', () => {
    expect(ds.groupBy).to.be.undefined;
  });

  it('should group by after setting one', () => {
    ds.setGroupBy('profession');

    expect(ds.groupBy).to.equal('profession');
  });

  it('should not group by after removing it', () => {
    ds.setGroupBy('profession');
    ds.removeGroupBy();

    expect(ds.groupBy).to.be.undefined;
  });
});
