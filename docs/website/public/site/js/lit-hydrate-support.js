import "./chunk-T2T6Q22Z.js";

// ../../node_modules/lit-html/lit-html.js
var t;
var i = window;
var s = i.trustedTypes;
var e = s ? s.createPolicy("lit-html", { createHTML: (t4) => t4 }) : void 0;
var o = `lit$${(Math.random() + "").slice(9)}$`;
var n = "?" + o;
var l = `<${n}>`;
var h = document;
var r = (t4 = "") => h.createComment(t4);
var d = (t4) => null === t4 || "object" != typeof t4 && "function" != typeof t4;
var u = Array.isArray;
var c = (t4) => u(t4) || "function" == typeof (null == t4 ? void 0 : t4[Symbol.iterator]);
var v = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
var a = /-->/g;
var f = />/g;
var _ = RegExp(`>|[ 	
\f\r](?:([^\\s"'>=/]+)([ 	
\f\r]*=[ 	
\f\r]*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
var m = /'/g;
var p = /"/g;
var $ = /^(?:script|style|textarea|title)$/i;
var g = (t4) => (i3, ...s3) => ({ _$litType$: t4, strings: i3, values: s3 });
var y = g(1);
var w = g(2);
var x = Symbol.for("lit-noChange");
var b = Symbol.for("lit-nothing");
var T = /* @__PURE__ */ new WeakMap();
var A = h.createTreeWalker(h, 129, null, false);
var E = (t4, i3) => {
  const s3 = t4.length - 1, n3 = [];
  let h3, r2 = 2 === i3 ? "<svg>" : "", d3 = v;
  for (let i4 = 0; i4 < s3; i4++) {
    const s4 = t4[i4];
    let e3, u4, c3 = -1, g2 = 0;
    for (; g2 < s4.length && (d3.lastIndex = g2, u4 = d3.exec(s4), null !== u4); )
      g2 = d3.lastIndex, d3 === v ? "!--" === u4[1] ? d3 = a : void 0 !== u4[1] ? d3 = f : void 0 !== u4[2] ? ($.test(u4[2]) && (h3 = RegExp("</" + u4[2], "g")), d3 = _) : void 0 !== u4[3] && (d3 = _) : d3 === _ ? ">" === u4[0] ? (d3 = null != h3 ? h3 : v, c3 = -1) : void 0 === u4[1] ? c3 = -2 : (c3 = d3.lastIndex - u4[2].length, e3 = u4[1], d3 = void 0 === u4[3] ? _ : '"' === u4[3] ? p : m) : d3 === p || d3 === m ? d3 = _ : d3 === a || d3 === f ? d3 = v : (d3 = _, h3 = void 0);
    const y2 = d3 === _ && t4[i4 + 1].startsWith("/>") ? " " : "";
    r2 += d3 === v ? s4 + l : c3 >= 0 ? (n3.push(e3), s4.slice(0, c3) + "$lit$" + s4.slice(c3) + o + y2) : s4 + o + (-2 === c3 ? (n3.push(void 0), i4) : y2);
  }
  const u3 = r2 + (t4[s3] || "<?>") + (2 === i3 ? "</svg>" : "");
  if (!Array.isArray(t4) || !t4.hasOwnProperty("raw"))
    throw Error("invalid template strings array");
  return [void 0 !== e ? e.createHTML(u3) : u3, n3];
};
var C = class {
  constructor({ strings: t4, _$litType$: i3 }, e3) {
    let l3;
    this.parts = [];
    let h3 = 0, d3 = 0;
    const u3 = t4.length - 1, c3 = this.parts, [v2, a3] = E(t4, i3);
    if (this.el = C.createElement(v2, e3), A.currentNode = this.el.content, 2 === i3) {
      const t5 = this.el.content, i4 = t5.firstChild;
      i4.remove(), t5.append(...i4.childNodes);
    }
    for (; null !== (l3 = A.nextNode()) && c3.length < u3; ) {
      if (1 === l3.nodeType) {
        if (l3.hasAttributes()) {
          const t5 = [];
          for (const i4 of l3.getAttributeNames())
            if (i4.endsWith("$lit$") || i4.startsWith(o)) {
              const s3 = a3[d3++];
              if (t5.push(i4), void 0 !== s3) {
                const t6 = l3.getAttribute(s3.toLowerCase() + "$lit$").split(o), i5 = /([.?@])?(.*)/.exec(s3);
                c3.push({ type: 1, index: h3, name: i5[2], strings: t6, ctor: "." === i5[1] ? M : "?" === i5[1] ? k : "@" === i5[1] ? H : S });
              } else
                c3.push({ type: 6, index: h3 });
            }
          for (const i4 of t5)
            l3.removeAttribute(i4);
        }
        if ($.test(l3.tagName)) {
          const t5 = l3.textContent.split(o), i4 = t5.length - 1;
          if (i4 > 0) {
            l3.textContent = s ? s.emptyScript : "";
            for (let s3 = 0; s3 < i4; s3++)
              l3.append(t5[s3], r()), A.nextNode(), c3.push({ type: 2, index: ++h3 });
            l3.append(t5[i4], r());
          }
        }
      } else if (8 === l3.nodeType)
        if (l3.data === n)
          c3.push({ type: 2, index: h3 });
        else {
          let t5 = -1;
          for (; -1 !== (t5 = l3.data.indexOf(o, t5 + 1)); )
            c3.push({ type: 7, index: h3 }), t5 += o.length - 1;
        }
      h3++;
    }
  }
  static createElement(t4, i3) {
    const s3 = h.createElement("template");
    return s3.innerHTML = t4, s3;
  }
};
function P(t4, i3, s3 = t4, e3) {
  var o2, n3, l3, h3;
  if (i3 === x)
    return i3;
  let r2 = void 0 !== e3 ? null === (o2 = s3._$Co) || void 0 === o2 ? void 0 : o2[e3] : s3._$Cl;
  const u3 = d(i3) ? void 0 : i3._$litDirective$;
  return (null == r2 ? void 0 : r2.constructor) !== u3 && (null === (n3 = null == r2 ? void 0 : r2._$AO) || void 0 === n3 || n3.call(r2, false), void 0 === u3 ? r2 = void 0 : (r2 = new u3(t4), r2._$AT(t4, s3, e3)), void 0 !== e3 ? (null !== (l3 = (h3 = s3)._$Co) && void 0 !== l3 ? l3 : h3._$Co = [])[e3] = r2 : s3._$Cl = r2), void 0 !== r2 && (i3 = P(t4, r2._$AS(t4, i3.values), r2, e3)), i3;
}
var V = class {
  constructor(t4, i3) {
    this.u = [], this._$AN = void 0, this._$AD = t4, this._$AM = i3;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  v(t4) {
    var i3;
    const { el: { content: s3 }, parts: e3 } = this._$AD, o2 = (null !== (i3 = null == t4 ? void 0 : t4.creationScope) && void 0 !== i3 ? i3 : h).importNode(s3, true);
    A.currentNode = o2;
    let n3 = A.nextNode(), l3 = 0, r2 = 0, d3 = e3[0];
    for (; void 0 !== d3; ) {
      if (l3 === d3.index) {
        let i4;
        2 === d3.type ? i4 = new N(n3, n3.nextSibling, this, t4) : 1 === d3.type ? i4 = new d3.ctor(n3, d3.name, d3.strings, this, t4) : 6 === d3.type && (i4 = new I(n3, this, t4)), this.u.push(i4), d3 = e3[++r2];
      }
      l3 !== (null == d3 ? void 0 : d3.index) && (n3 = A.nextNode(), l3++);
    }
    return o2;
  }
  p(t4) {
    let i3 = 0;
    for (const s3 of this.u)
      void 0 !== s3 && (void 0 !== s3.strings ? (s3._$AI(t4, s3, i3), i3 += s3.strings.length - 2) : s3._$AI(t4[i3])), i3++;
  }
};
var N = class {
  constructor(t4, i3, s3, e3) {
    var o2;
    this.type = 2, this._$AH = b, this._$AN = void 0, this._$AA = t4, this._$AB = i3, this._$AM = s3, this.options = e3, this._$Cm = null === (o2 = null == e3 ? void 0 : e3.isConnected) || void 0 === o2 || o2;
  }
  get _$AU() {
    var t4, i3;
    return null !== (i3 = null === (t4 = this._$AM) || void 0 === t4 ? void 0 : t4._$AU) && void 0 !== i3 ? i3 : this._$Cm;
  }
  get parentNode() {
    let t4 = this._$AA.parentNode;
    const i3 = this._$AM;
    return void 0 !== i3 && 11 === t4.nodeType && (t4 = i3.parentNode), t4;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t4, i3 = this) {
    t4 = P(this, t4, i3), d(t4) ? t4 === b || null == t4 || "" === t4 ? (this._$AH !== b && this._$AR(), this._$AH = b) : t4 !== this._$AH && t4 !== x && this.g(t4) : void 0 !== t4._$litType$ ? this.$(t4) : void 0 !== t4.nodeType ? this.T(t4) : c(t4) ? this.k(t4) : this.g(t4);
  }
  O(t4, i3 = this._$AB) {
    return this._$AA.parentNode.insertBefore(t4, i3);
  }
  T(t4) {
    this._$AH !== t4 && (this._$AR(), this._$AH = this.O(t4));
  }
  g(t4) {
    this._$AH !== b && d(this._$AH) ? this._$AA.nextSibling.data = t4 : this.T(h.createTextNode(t4)), this._$AH = t4;
  }
  $(t4) {
    var i3;
    const { values: s3, _$litType$: e3 } = t4, o2 = "number" == typeof e3 ? this._$AC(t4) : (void 0 === e3.el && (e3.el = C.createElement(e3.h, this.options)), e3);
    if ((null === (i3 = this._$AH) || void 0 === i3 ? void 0 : i3._$AD) === o2)
      this._$AH.p(s3);
    else {
      const t5 = new V(o2, this), i4 = t5.v(this.options);
      t5.p(s3), this.T(i4), this._$AH = t5;
    }
  }
  _$AC(t4) {
    let i3 = T.get(t4.strings);
    return void 0 === i3 && T.set(t4.strings, i3 = new C(t4)), i3;
  }
  k(t4) {
    u(this._$AH) || (this._$AH = [], this._$AR());
    const i3 = this._$AH;
    let s3, e3 = 0;
    for (const o2 of t4)
      e3 === i3.length ? i3.push(s3 = new N(this.O(r()), this.O(r()), this, this.options)) : s3 = i3[e3], s3._$AI(o2), e3++;
    e3 < i3.length && (this._$AR(s3 && s3._$AB.nextSibling, e3), i3.length = e3);
  }
  _$AR(t4 = this._$AA.nextSibling, i3) {
    var s3;
    for (null === (s3 = this._$AP) || void 0 === s3 || s3.call(this, false, true, i3); t4 && t4 !== this._$AB; ) {
      const i4 = t4.nextSibling;
      t4.remove(), t4 = i4;
    }
  }
  setConnected(t4) {
    var i3;
    void 0 === this._$AM && (this._$Cm = t4, null === (i3 = this._$AP) || void 0 === i3 || i3.call(this, t4));
  }
};
var S = class {
  constructor(t4, i3, s3, e3, o2) {
    this.type = 1, this._$AH = b, this._$AN = void 0, this.element = t4, this.name = i3, this._$AM = e3, this.options = o2, s3.length > 2 || "" !== s3[0] || "" !== s3[1] ? (this._$AH = Array(s3.length - 1).fill(new String()), this.strings = s3) : this._$AH = b;
  }
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t4, i3 = this, s3, e3) {
    const o2 = this.strings;
    let n3 = false;
    if (void 0 === o2)
      t4 = P(this, t4, i3, 0), n3 = !d(t4) || t4 !== this._$AH && t4 !== x, n3 && (this._$AH = t4);
    else {
      const e4 = t4;
      let l3, h3;
      for (t4 = o2[0], l3 = 0; l3 < o2.length - 1; l3++)
        h3 = P(this, e4[s3 + l3], i3, l3), h3 === x && (h3 = this._$AH[l3]), n3 || (n3 = !d(h3) || h3 !== this._$AH[l3]), h3 === b ? t4 = b : t4 !== b && (t4 += (null != h3 ? h3 : "") + o2[l3 + 1]), this._$AH[l3] = h3;
    }
    n3 && !e3 && this.j(t4);
  }
  j(t4) {
    t4 === b ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, null != t4 ? t4 : "");
  }
};
var M = class extends S {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t4) {
    this.element[this.name] = t4 === b ? void 0 : t4;
  }
};
var R = s ? s.emptyScript : "";
var k = class extends S {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t4) {
    t4 && t4 !== b ? this.element.setAttribute(this.name, R) : this.element.removeAttribute(this.name);
  }
};
var H = class extends S {
  constructor(t4, i3, s3, e3, o2) {
    super(t4, i3, s3, e3, o2), this.type = 5;
  }
  _$AI(t4, i3 = this) {
    var s3;
    if ((t4 = null !== (s3 = P(this, t4, i3, 0)) && void 0 !== s3 ? s3 : b) === x)
      return;
    const e3 = this._$AH, o2 = t4 === b && e3 !== b || t4.capture !== e3.capture || t4.once !== e3.once || t4.passive !== e3.passive, n3 = t4 !== b && (e3 === b || o2);
    o2 && this.element.removeEventListener(this.name, this, e3), n3 && this.element.addEventListener(this.name, this, t4), this._$AH = t4;
  }
  handleEvent(t4) {
    var i3, s3;
    "function" == typeof this._$AH ? this._$AH.call(null !== (s3 = null === (i3 = this.options) || void 0 === i3 ? void 0 : i3.host) && void 0 !== s3 ? s3 : this.element, t4) : this._$AH.handleEvent(t4);
  }
};
var I = class {
  constructor(t4, i3, s3) {
    this.element = t4, this.type = 6, this._$AN = void 0, this._$AM = i3, this.options = s3;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t4) {
    P(this, t4);
  }
};
var L = { P: "$lit$", A: o, M: n, C: 1, L: E, R: V, D: c, V: P, I: N, H: S, N: k, U: H, B: M, F: I };
var z = i.litHtmlPolyfillSupport;
null == z || z(C, N), (null !== (t = i.litHtmlVersions) && void 0 !== t ? t : i.litHtmlVersions = []).push("2.4.0");
var Z = (t4, i3, s3) => {
  var e3, o2;
  const n3 = null !== (e3 = null == s3 ? void 0 : s3.renderBefore) && void 0 !== e3 ? e3 : i3;
  let l3 = n3._$litPart$;
  if (void 0 === l3) {
    const t5 = null !== (o2 = null == s3 ? void 0 : s3.renderBefore) && void 0 !== o2 ? o2 : null;
    n3._$litPart$ = l3 = new N(i3.insertBefore(r(), t5), t5, void 0, null != s3 ? s3 : {});
  }
  return l3._$AI(t4), l3;
};

// ../../node_modules/lit-html/directive.js
var t2 = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 };

// ../../node_modules/lit-html/directive-helpers.js
var { I: l2 } = L;
var t3 = (o2) => null === o2 || "object" != typeof o2 && "function" != typeof o2;
var n2 = (o2, l3) => void 0 === l3 ? void 0 !== (null == o2 ? void 0 : o2._$litType$) : (null == o2 ? void 0 : o2._$litType$) === l3;
var e2 = (o2) => void 0 === o2.strings;

// ../../node_modules/lit-html/experimental-hydrate.js
var { R: i2, D: a2, V: s2, I: c2, F: d2 } = L;
var f2 = (e3, t4, r2 = {}) => {
  if (void 0 !== t4._$litPart$)
    throw Error("container already contains a live render");
  let n3, o2;
  const l3 = [], i3 = document.createTreeWalker(t4, NodeFilter.SHOW_COMMENT, null, false);
  let a3;
  for (; null !== (a3 = i3.nextNode()); ) {
    const t5 = a3.data;
    if (t5.startsWith("lit-part")) {
      if (0 === l3.length && void 0 !== n3)
        throw Error("there must be only one root part per container");
      o2 = p2(e3, a3, l3, r2), null != n3 || (n3 = o2);
    } else if (t5.startsWith("lit-node"))
      h2(a3, l3, r2);
    else if (t5.startsWith("/lit-part")) {
      if (1 === l3.length && o2 !== n3)
        throw Error("internal error");
      o2 = u2(a3, o2, l3);
    }
  }
  console.assert(void 0 !== n3, "there should be exactly one root part in a render container"), t4._$litPart$ = n3;
};
var p2 = (t4, r2, l3, d3) => {
  let f3, p3;
  if (0 === l3.length)
    p3 = new c2(r2, null, void 0, d3), f3 = t4;
  else {
    const e3 = l3[l3.length - 1];
    if ("template-instance" === e3.type)
      p3 = new c2(r2, null, e3.instance, d3), e3.instance.u.push(p3), f3 = e3.result.values[e3.instancePartIndex++], e3.templatePartIndex++;
    else if ("iterable" === e3.type) {
      p3 = new c2(r2, null, e3.part, d3);
      const t5 = e3.iterator.next();
      if (t5.done)
        throw f3 = void 0, e3.done = true, Error("Unhandled shorter than expected iterable");
      f3 = t5.value, e3.part._$AH.push(p3);
    } else
      p3 = new c2(r2, null, e3.part, d3);
  }
  if (f3 = s2(p3, f3), f3 === x)
    l3.push({ part: p3, type: "leaf" });
  else if (t3(f3))
    l3.push({ part: p3, type: "leaf" }), p3._$AH = f3;
  else if (n2(f3)) {
    const e3 = "lit-part " + m2(f3);
    if (r2.data !== e3)
      throw Error("Hydration value mismatch: Unexpected TemplateResult rendered to part");
    {
      const e4 = c2.prototype._$AC(f3), t5 = new i2(e4, p3);
      l3.push({ type: "template-instance", instance: t5, part: p3, templatePartIndex: 0, instancePartIndex: 0, result: f3 }), p3._$AH = t5;
    }
  } else
    a2(f3) ? (l3.push({ part: p3, type: "iterable", value: f3, iterator: f3[Symbol.iterator](), done: false }), p3._$AH = []) : (l3.push({ part: p3, type: "leaf" }), p3._$AH = null == f3 ? "" : f3);
  return p3;
};
var u2 = (e3, t4, r2) => {
  if (void 0 === t4)
    throw Error("unbalanced part marker");
  t4._$AB = e3;
  const n3 = r2.pop();
  if ("iterable" === n3.type && !n3.iterator.next().done)
    throw Error("unexpected longer than expected iterable");
  if (r2.length > 0)
    return r2[r2.length - 1].part;
};
var h2 = (e3, t4, n3) => {
  var o2;
  const i3 = /lit-node (\d+)/.exec(e3.data), a3 = parseInt(i3[1]), c3 = null !== (o2 = e3.previousElementSibling) && void 0 !== o2 ? o2 : e3.parentElement;
  if (null === c3)
    throw Error("could not find node for attribute parts");
  c3.removeAttribute("defer-hydration");
  const f3 = t4[t4.length - 1];
  if ("template-instance" !== f3.type)
    throw Error("internal error");
  {
    const e4 = f3.instance;
    for (; ; ) {
      const t5 = e4._$AD.parts[f3.templatePartIndex];
      if (void 0 === t5 || t5.type !== t2.ATTRIBUTE && t5.type !== t2.ELEMENT || t5.index !== a3)
        break;
      if (t5.type === t2.ATTRIBUTE) {
        const o3 = new t5.ctor(c3, t5.name, t5.strings, f3.instance, n3), i4 = e2(o3) ? f3.result.values[f3.instancePartIndex] : f3.result.values, a4 = !(o3.type === t2.EVENT || o3.type === t2.PROPERTY);
        o3._$AI(i4, o3, f3.instancePartIndex, a4), f3.instancePartIndex += t5.strings.length - 1, e4.u.push(o3);
      } else {
        const t6 = new d2(c3, f3.instance, n3);
        s2(t6, f3.result.values[f3.instancePartIndex++]), e4.u.push(t6);
      }
      f3.templatePartIndex++;
    }
  }
};
var m2 = (e3) => {
  const t4 = new Uint32Array(2).fill(5381);
  for (const r2 of e3.strings)
    for (let e4 = 0; e4 < r2.length; e4++)
      t4[e4 % 2] = 33 * t4[e4 % 2] ^ r2.charCodeAt(e4);
  return btoa(String.fromCharCode(...new Uint8Array(t4.buffer)));
};

// ../../node_modules/lit-element/experimental-hydrate-support.js
globalThis.litElementHydrateSupport = ({ LitElement: s3 }) => {
  const e3 = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(s3), "observedAttributes").get;
  Object.defineProperty(s3, "observedAttributes", { get() {
    return [...e3.call(this), "defer-hydration"];
  } });
  const h3 = s3.prototype.attributeChangedCallback;
  s3.prototype.attributeChangedCallback = function(t4, i3, s4) {
    "defer-hydration" === t4 && null === s4 && n3.call(this), h3.call(this, t4, i3, s4);
  };
  const n3 = s3.prototype.connectedCallback;
  s3.prototype.connectedCallback = function() {
    this.hasAttribute("defer-hydration") || n3.call(this);
  };
  const o2 = s3.prototype.createRenderRoot;
  s3.prototype.createRenderRoot = function() {
    return this.shadowRoot ? (this._$AG = true, this.shadowRoot) : o2.call(this);
  };
  const r2 = Object.getPrototypeOf(s3.prototype).update;
  s3.prototype.update = function(s4) {
    const e4 = this.render();
    r2.call(this, s4), this._$AG ? (this._$AG = false, f2(e4, this.renderRoot, this.renderOptions)) : Z(e4, this.renderRoot, this.renderOptions);
  };
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
//# sourceMappingURL=lit-hydrate-support.js.map
