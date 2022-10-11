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
Object.defineProperty(exports, "__esModule", { value: true });
var lit_1 = require("lit");
var DemoGreeter = /** @class */ (function (_super) {
    __extends(DemoGreeter, _super);
    function DemoGreeter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DemoGreeter.prototype.render = function () {
        return (0, lit_1.html)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Hello <b>", "<slot></slot></b>!"], ["Hello <b>", "<slot></slot></b>!"])), this.name);
    };
    DemoGreeter.styles = (0, lit_1.css)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    b { color: red; }\n  "], ["\n    b { color: red; }\n  "])));
    DemoGreeter.properties = {
        name: {},
    };
    return DemoGreeter;
}(lit_1.LitElement));
customElements.define('demo-greeter', DemoGreeter);
var templateObject_1, templateObject_2;
//# sourceMappingURL=demo-greeter.js.map