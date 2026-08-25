declare global {
  interface Window {
    SLDSConfig: {
      config: ConfigSettings;
    };
  }
}
export type ConfigSettings = object;
export declare class Config {
  #private;
  static setConfig(settings: ConfigSettings): void;
  static getConfigSetting<T>(key: keyof ConfigSettings): Promise<T>;
}
