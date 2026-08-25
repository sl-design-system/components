const defaultConfig = {};
export class Config {
  static setConfig(settings) {
    window.SLDSConfig = {
      config: settings
    };
  }
  static async getConfigSetting(key) {
    const config = await this.#waitForWindowProperty();
    return config[key];
  }
  static async #waitForWindowProperty() {
    let tries = 0;
    return await new Promise(resolve => {
      const checkProperty = () => {
        if (window.SLDSConfig?.config && Object.keys(window.SLDSConfig.config).length > 0) {
          resolve(window.SLDSConfig.config);
        } else if (tries > 10) {
          console.warn('Could not find config, are you sure this is set in the setup?');
          resolve(defaultConfig);
        } else {
          setTimeout(checkProperty, 100);
          tries++;
        }
      };
      checkProperty();
    });
  }
}
//# sourceMappingURL=config.js.map
