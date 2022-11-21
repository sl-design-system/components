import {
  __publicField
} from "./chunk-T2T6Q22Z.js";

// ../../node_modules/@11ty/is-land/is-land.js
var islandOnceCache = /* @__PURE__ */ new Map();
var _Island = class extends HTMLElement {
  constructor() {
    super();
    this.ready = new Promise((resolve) => {
      this.readyResolve = resolve;
    });
  }
  static getParents(el, stopAt = false) {
    let nodes = [];
    while (el) {
      if (el.matches && el.matches(_Island.tagName)) {
        if (stopAt && el === stopAt) {
          break;
        }
        if (Conditions.hasConditions(el)) {
          nodes.push(el);
        }
      }
      el = el.parentNode;
    }
    return nodes;
  }
  static async ready(el) {
    let parents = _Island.getParents(el);
    if (parents.length === 0) {
      return;
    }
    let imports = await Promise.all(parents.map((el2) => el2.wait()));
    if (imports.length) {
      return imports[0];
    }
  }
  forceFallback() {
    if (window.Island) {
      Object.assign(_Island.fallback, window.Island.fallback);
    }
    for (let selector in _Island.fallback) {
      let components = Array.from(this.querySelectorAll(selector)).reverse();
      for (let node of components) {
        if (!node.isConnected || node.localName === _Island.tagName) {
          continue;
        }
        let p = _Island.ready(node);
        _Island.fallback[selector](p, node, _Island.prefix);
      }
    }
  }
  wait() {
    return this.ready;
  }
  async connectedCallback() {
    if (Conditions.hasConditions(this)) {
      this.forceFallback();
    }
    await this.hydrate();
  }
  getTemplates() {
    return this.querySelectorAll(`template[${_Island.attr.template}]`);
  }
  replaceTemplates(templates) {
    for (let node of templates) {
      if (_Island.getParents(node, this).length > 0) {
        continue;
      }
      let value = node.getAttribute(_Island.attr.template);
      if (value === "replace") {
        let children = Array.from(this.childNodes);
        for (let child of children) {
          this.removeChild(child);
        }
        this.appendChild(node.content);
        break;
      } else {
        let html = node.innerHTML;
        if (value === "once" && html) {
          if (islandOnceCache.has(html)) {
            node.remove();
            return;
          }
          islandOnceCache.set(html, true);
        }
        node.replaceWith(node.content);
      }
    }
  }
  async hydrate() {
    let conditions = [];
    if (this.parentNode) {
      conditions.push(_Island.ready(this.parentNode));
    }
    let attrs = Conditions.getConditions(this);
    for (let condition in attrs) {
      if (Conditions.map[condition]) {
        conditions.push(Conditions.map[condition](attrs[condition], this));
      }
    }
    await Promise.all(conditions);
    this.replaceTemplates(this.getTemplates());
    let mod;
    let importScript = this.getAttribute(_Island.attr.import);
    if (importScript) {
      mod = await import(importScript);
    }
    if (mod) {
      let fn = _Island.autoinit[this.getAttribute(_Island.attr.autoInitType) || importScript];
      if (fn) {
        await fn.call(this, mod);
      }
    }
    this.readyResolve({});
    this.setAttribute(_Island.attr.ready, "");
    this.querySelectorAll(`[${_Island.attr.defer}]`).forEach((node) => node.removeAttribute(_Island.attr.defer));
  }
};
var Island = _Island;
__publicField(Island, "tagName", "is-land");
__publicField(Island, "prefix", "is-land--");
__publicField(Island, "attr", {
  autoInitType: "autoinit",
  import: "import",
  template: "data-island",
  ready: "ready",
  defer: "defer-hydration"
});
__publicField(Island, "fallback", {
  ":not(:defined):not([defer-hydration])": (readyPromise, node, prefix) => {
    let cloned = document.createElement(prefix + node.localName);
    for (let attr of node.getAttributeNames()) {
      cloned.setAttribute(attr, node.getAttribute(attr));
    }
    let shadowroot = node.shadowRoot;
    if (!shadowroot) {
      let tmpl = node.querySelector(":scope > template[shadowroot]");
      if (tmpl) {
        shadowroot = node.attachShadow({ mode: "open" });
        shadowroot.appendChild(tmpl.content.cloneNode(true));
      }
    }
    if (shadowroot) {
      cloned.attachShadow({ mode: shadowroot.mode }).append(...shadowroot.childNodes);
    }
    cloned.append(...node.childNodes);
    node.replaceWith(cloned);
    return readyPromise.then(() => {
      if (cloned.shadowRoot) {
        node.shadowRoot.append(...cloned.shadowRoot.childNodes);
      }
      node.append(...cloned.childNodes);
      cloned.replaceWith(node);
    });
  }
});
__publicField(Island, "autoinit", {
  "petite-vue": function(library) {
    library.createApp().mount(this);
  },
  "vue": function(library) {
    library.createApp().mount(this);
  },
  "svelte": function(mod) {
    new mod.default({ target: this });
  },
  "svelte-ssr": function(mod) {
    new mod.default({ target: this, hydrate: true });
  },
  "preact": function(mod) {
    mod.default(this);
  }
});
var _Conditions = class {
  static hasConditions(node) {
    return Object.keys(_Conditions.getConditions(node)).length > 0;
  }
  static getConditions(node) {
    let map = {};
    for (let key of Object.keys(_Conditions.map)) {
      if (node.hasAttribute(`on:${key}`)) {
        map[key] = node.getAttribute(`on:${key}`);
      }
    }
    return map;
  }
  static visible(noop, el) {
    if (!("IntersectionObserver" in window)) {
      return;
    }
    return new Promise((resolve) => {
      let observer = new IntersectionObserver((entries) => {
        let [entry] = entries;
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);
          resolve();
        }
      });
      observer.observe(el);
    });
  }
  static idle() {
    let onload = new Promise((resolve) => {
      if (document.readyState !== "complete") {
        window.addEventListener("load", () => resolve(), { once: true });
      } else {
        resolve();
      }
    });
    if (!("requestIdleCallback" in window)) {
      return onload;
    }
    return Promise.all([
      new Promise((resolve) => {
        requestIdleCallback(() => {
          resolve();
        });
      }),
      onload
    ]);
  }
  static interaction(eventOverrides, el) {
    let events = ["click", "touchstart"];
    if (eventOverrides) {
      events = (eventOverrides || "").split(",").map((entry) => entry.trim());
    }
    return new Promise((resolve) => {
      function resolveFn(e) {
        resolve();
        for (let name of events) {
          el.removeEventListener(name, resolveFn);
        }
      }
      for (let name of events) {
        el.addEventListener(name, resolveFn, { once: true });
      }
    });
  }
  static media(query) {
    let mm = {
      matches: true
    };
    if (query && "matchMedia" in window) {
      mm = window.matchMedia(query);
    }
    if (mm.matches) {
      return;
    }
    return new Promise((resolve) => {
      mm.addListener((e) => {
        if (e.matches) {
          resolve();
        }
      });
    });
  }
  static saveData(expects) {
    if (!("connection" in navigator) || navigator.connection.saveData === (expects !== "false")) {
      return Promise.resolve();
    }
    return new Promise(() => {
    });
  }
};
var Conditions = _Conditions;
__publicField(Conditions, "map", {
  visible: _Conditions.visible,
  idle: _Conditions.idle,
  interaction: _Conditions.interaction,
  media: _Conditions.media,
  "save-data": _Conditions.saveData
});
if ("customElements" in window) {
  window.customElements.define(Island.tagName, Island);
  window.Island = Island;
}
var ready = Island.ready;
//# sourceMappingURL=is-land.js.map
