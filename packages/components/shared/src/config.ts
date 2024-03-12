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

const defaultConfig: ConfigSettings = {
  avatar: {
    shape: 'circle',
    badgeGapWidth: 2
  }
};

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
    let tries = 0;
    return await new Promise<ConfigSettings>(resolve => {
      const checkProperty = (): void => {
        if (window.SLDSConfig?.config && Object.keys(window.SLDSConfig.config).length > 0) {
          resolve(window.SLDSConfig.config);
        } else if (tries > 10) {
          console.warn('Could not find config, are you sure this is set in the setup?');
          resolve(defaultConfig);
        } else {
          setTimeout(checkProperty, 100); // check again in 100ms
          tries++;
        }
      };
      checkProperty();
    });
  }
}
