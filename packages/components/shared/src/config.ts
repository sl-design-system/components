declare global {
  interface Window {
    SLDSConfig: {
      config: ConfigSettings;
    };
  }
}

export type AvatarShape = 'circle' | 'square';
export type AvatarConfig = {
  shape: AvatarShape;
  badgeGapWidth: number;
};

export interface ConfigSettings {
  avatar: AvatarConfig;
}

export class Config {
  static setConfig(settings: ConfigSettings): void {
    window.SLDSConfig = {
      config: settings
    };
  }

  static async getConfigSetting<T>(key: keyof ConfigSettings): Promise<T> {
    const config: ConfigSettings = await this.#waitForWindowProperty();
    return config[key] as T;
  }

  static async #waitForWindowProperty(): Promise<ConfigSettings> {
    return new Promise<ConfigSettings>(resolve => {
      const checkProperty = (): void => {
        if (window.SLDSConfig?.config && Object.keys(window.SLDSConfig.config).length > 0) {
          resolve(window.SLDSConfig.config);
        } else {
          setTimeout(checkProperty, 100); // check again in 100ms
        }
      };
      checkProperty();
    });
  }
}
