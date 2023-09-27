import {
Layout
} from "../../chunk-576b140a924b9591.js";
import {
__toESM,
require_jsx_dev_runtime
} from "../../chunk-ba72fa687bba2094.js";

// pages/testes/scheduler/cj
var jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
function Test(props) {
  return jsx_dev_runtime.jsxDEV(Layout, {
    title: "get the params",
    children: [
      jsx_dev_runtime.jsxDEV("div", {
        children: "Test page with params"
      }, undefined, false, undefined, this),
      jsx_dev_runtime.jsxDEV("div", {
        children: JSON.stringify(props)
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
}
export {
  Test as default
};
