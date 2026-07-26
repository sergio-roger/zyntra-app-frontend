import { describe, expect, it } from 'vitest';
import { buildChannelUrl } from '@features/youtube-analytics/utils/build-channel-url.util';

describe('buildChannelUrl', () => {
  it('builds a youtube.com url from a handle starting with @', () => {
    expect(buildChannelUrl('@somecompetitor')).toBe(
      'https://www.youtube.com/@somecompetitor',
    );
  });

  it('returns a full url unchanged', () => {
    expect(buildChannelUrl('https://www.youtube.com/@somecompetitor')).toBe(
      'https://www.youtube.com/@somecompetitor',
    );
  });

  it('adds the @ prefix for a bare handle', () => {
    expect(buildChannelUrl('somecompetitor')).toBe(
      'https://www.youtube.com/@somecompetitor',
    );
  });

  it('trims trailing slashes', () => {
    expect(buildChannelUrl('@somecompetitor/')).toBe(
      'https://www.youtube.com/@somecompetitor',
    );
  });
});
