import { channelIdFromChzzkLink } from './channel-id';

describe('Chzzk channel id extraction', () => {
  const id = 'a'.repeat(32);

  it('extracts only a direct channel URL', () => {
    expect(channelIdFromChzzkLink(`https://chzzk.naver.com/${id}/`)).toBe(id);
    expect(channelIdFromChzzkLink(`https://chzzk.naver.com/${id}?ref=share`)).toBe(id);
  });

  it('does not guess from other URLs', () => {
    expect(channelIdFromChzzkLink(`https://other.example/${id}`)).toBeUndefined();
    expect(channelIdFromChzzkLink(`https://chzzk.naver.com/video/${id}`)).toBeUndefined();
    expect(channelIdFromChzzkLink('https://chzzk.naver.com/nickname')).toBeUndefined();
  });
});
