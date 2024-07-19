import { type CompactEmoji, type GroupMessage, type Locale, type MessagesDataset } from 'emojibase';

export type Emoji = CompactEmoji;
export type EmojiGroup = GroupMessage;
export type Messages = MessagesDataset;
export type SupportedLocale = Locale;

const cachedEmojis = new Map<Intl.LocalesArgument, Emoji[]>(),
  cachedMessages = new Map<Intl.LocalesArgument, MessagesDataset>();

export class EmojiService {
  constructor(public readonly baseUrl: string) {
    cachedEmojis.clear();
    cachedMessages.clear();
  }

  async findEmojis(locale: SupportedLocale, query: string): Promise<Emoji[]> {
    const emojis = await this.getEmojis(locale),
      q = query.toLowerCase();

    return emojis.filter(e => e.label.includes(q) || e.tags?.some(t => t.includes(q)));
  }

  async getEmojis(locale: SupportedLocale): Promise<Emoji[]> {
    if (cachedEmojis.has(locale)) {
      return cachedEmojis.get(locale)!;
    }

    const response = await fetch(`${this.baseUrl}/${locale.toString()}/compact.json`);

    if (response.ok) {
      let emojis = (await response.json()) as Emoji[];

      // Filter out the component group and the ungrouped emojis
      emojis = emojis.filter(emoji => typeof emoji.group === 'number' && emoji.group !== 2);

      cachedEmojis.set(locale, emojis);

      return emojis;
    } else {
      throw new Error(`Failed to load emoji data: ${response.statusText}`);
    }
  }

  async getEmojiMessages(locale: SupportedLocale): Promise<Messages> {
    if (cachedMessages.has(locale)) {
      return cachedMessages.get(locale)!;
    }

    const response = await fetch(`${this.baseUrl}/${locale.toString()}/messages.json`);

    if (response.ok) {
      const messages = (await response.json()) as Messages;

      cachedMessages.set(locale, messages);

      return messages;
    } else {
      throw new Error(`Failed to load emoji messages: ${response.statusText}`);
    }
  }

  async getGroupedEmojis(locale: SupportedLocale): Promise<Map<EmojiGroup, Emoji[]>> {
    const emojis = await this.getEmojis(locale),
      messages = await this.getEmojiMessages(locale);

    const results = new Map<EmojiGroup, Emoji[]>();

    for (const group of messages.groups) {
      if (typeof group.order === 'number' && group.key !== 'component') {
        results.set(
          group,
          emojis.filter(e => e.group === group.order)
        );
      }
    }

    return results;
  }
}
