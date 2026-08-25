const cachedEmojis = /* @__PURE__ */ new Map(),
  cachedMessages = /* @__PURE__ */ new Map();
export class EmojiService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    cachedEmojis.clear();
    cachedMessages.clear();
  }
  async findEmojis(locale, query) {
    const emojis = await this.getEmojis(locale),
      q = query.toLowerCase();
    return emojis.filter(e => e.label.includes(q) || e.tags?.some(t => t.includes(q)));
  }
  async getEmojis(locale) {
    if (cachedEmojis.has(locale)) {
      return cachedEmojis.get(locale);
    }
    const response = await fetch(`${this.baseUrl}/${locale.toString()}/compact.json`);
    if (response.ok) {
      let emojis = await response.json();
      emojis = emojis.filter(emoji => typeof emoji.group === 'number' && emoji.group !== 2);
      cachedEmojis.set(locale, emojis);
      return emojis;
    } else {
      throw new Error(`Failed to load emoji data: ${response.statusText}`);
    }
  }
  async getEmojiMessages(locale) {
    if (cachedMessages.has(locale)) {
      return cachedMessages.get(locale);
    }
    const response = await fetch(`${this.baseUrl}/${locale.toString()}/messages.json`);
    if (response.ok) {
      const messages = await response.json();
      cachedMessages.set(locale, messages);
      return messages;
    } else {
      throw new Error(`Failed to load emoji messages: ${response.statusText}`);
    }
  }
  async getGroupedEmojis(locale) {
    const emojis = await this.getEmojis(locale),
      messages = await this.getEmojiMessages(locale);
    const results = /* @__PURE__ */ new Map();
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
//# sourceMappingURL=emoji-service.js.map
