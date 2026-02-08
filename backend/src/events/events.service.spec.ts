import { EventsService } from './events.service';

describe('EventsService', () => {
  const service = new EventsService();

  it('returns all events sorted descending by timestamp', () => {
    const page = service.list({});
    expect(page.items).toHaveLength(10);
    expect(page.total).toBe(20);
    expect(page.items[0].id).toBe('evt-1020');
    expect(page.items[page.items.length - 1].id).toBe('evt-1011');
  });

  it('filters by minimum level', () => {
    const page = service.list({ minLevel: 'ERROR' });
    expect(page.total).toBe(4);
    expect(page.items).toHaveLength(4);
    expect(page.items.every((event) => event.level === 'ERROR')).toBe(true);
  });

  it('filters by from date', () => {
    const page = service.list({ from: '2026-02-03' });
    expect(page.total).toBe(10);
    expect(page.items).toHaveLength(10);
    expect(page.items[page.items.length - 1].id).toBe('evt-1011');
  });

  it('filters by to date', () => {
    const page = service.list({ to: '2026-02-02' });
    expect(page.total).toBe(10);
    expect(page.items).toHaveLength(10);
    expect(page.items[0].id).toBe('evt-1010');
  });

  it('paginates results', () => {
    const page = service.list({ page: 2, pageSize: 5 });
    expect(page.total).toBe(20);
    expect(page.items).toHaveLength(5);
    expect(page.items[0].id).toBe('evt-1015');
  });

  it('sorts by level ascending', () => {
    const page = service.list({ sortBy: 'level', sortDir: 'asc' });
    expect(page.items).toHaveLength(10);
    expect(page.items[0].level).toBe('DEBUG');
  });
});
