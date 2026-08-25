import { type CompactEmoji, type GroupMessage, type Locale, type MessagesDataset } from 'emojibase';
export type Emoji = CompactEmoji;
export type EmojiGroup = GroupMessage;
export type Messages = MessagesDataset;
export type SupportedLocale = Locale;
export declare class EmojiService {
  readonly baseUrl: string;
  constructor(baseUrl: string);
  findEmojis(locale: SupportedLocale, query: string): Promise<Emoji[]>;
  getEmojis(locale: SupportedLocale): Promise<Emoji[]>;
  getEmojiMessages(locale: SupportedLocale): Promise<Messages>;
  getGroupedEmojis(locale: SupportedLocale): Promise<Map<EmojiGroup, Emoji[]>>;
}
