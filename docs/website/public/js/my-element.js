"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyElement = void 0;
var lit_1 = require("lit");
var decorators_js_1 = require("lit/decorators.js");
var MyElement = /** @class */ (function (_super) {
    __extends(MyElement, _super);
    function MyElement() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // Define reactive properties--updating a reactive property causes
        // the component to update.
        _this.greeting = "Hello";
        _this.planet = "World";
        return _this;
    }
    // The render() method is called any time reactive properties change.
    // Return HTML in a string template literal tagged with the `html`
    // tag function to describe the component's internal DOM.
    // Expressions can set attribute values, property values, event handlers,
    // and child nodes/text.
    MyElement.prototype.render = function () {
        return (0, lit_1.html)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      <span @click=", "\n        >", "\n        <span class=\"planet\">", "</span>\n      </span>\n    "], ["\n      <span @click=", "\n        >", "\n        <span class=\"planet\">", "</span>\n      </span>\n    "])), this.togglePlanet, this.greeting, this.planet);
    };
    // Event handlers can update the state of @properties on the element
    // instance, causing it to re-render
    MyElement.prototype.togglePlanet = function () {
        this.planet = this.planet === "World" ? "Mars" : "World";
    };
    // Styles are scoped to this element: they won't conflict with styles
    // on the main page or in other components. Styling API can be exposed
    // via CSS custom properties.
    MyElement.styles = (0, lit_1.css)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    :host {\n      display: inline-block;\n      padding: 10px;\n      background: lightgray;\n    }\n    .planet {\n      color: var(--planet-color, blue);\n    }\n  "], ["\n    :host {\n      display: inline-block;\n      padding: 10px;\n      background: lightgray;\n    }\n    .planet {\n      color: var(--planet-color, blue);\n    }\n  "])));
    __decorate([
        (0, decorators_js_1.property)()
    ], MyElement.prototype, "greeting", void 0);
    __decorate([
        (0, decorators_js_1.property)()
    ], MyElement.prototype, "planet", void 0);
    MyElement = __decorate([
        (0, decorators_js_1.customElement)("my-element")
    ], MyElement);
    return MyElement;
}(lit_1.LitElement));
exports.MyElement = MyElement;
var templateObject_1, templateObject_2;
//# sourceMappingURL=my-element.js.map