import {
__toESM,
require_jsx_dev_runtime
} from "../chunk-63abc4cc02303101.js";

// pagesmodules/s
var jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
function Layout(props) {
  return jsx_dev_runtime.jsxDEV("html", {
    children: [
      jsx_dev_runtime.jsxDEV("head", {
        children: [
          jsx_dev_runtime.jsxDEV("meta", {
            charSet: "utf-8"
          }, undefined, false, undefined, this),
          jsx_dev_runtime.jsxDEV("link", {
            rel: "icon",
            href: "/favicon.ico"
          }, undefined, false, undefined, this),
          jsx_dev_runtime.jsxDEV("meta", {
            name: "viewport",
            content: "width=device-width, initial-scale=1"
          }, undefined, false, undefined, this),
          jsx_dev_runtime.jsxDEV("meta", {
            name: "theme-color",
            content: "#000000"
          }, undefined, false, undefined, this),
          jsx_dev_runtime.jsxDEV("meta", {
            name: "description",
            content: "Web site created using create-react-app"
          }, undefined, false, undefined, this),
          jsx_dev_runtime.jsxDEV("link", {
            rel: "apple-touch-icon",
            href: "/logo192.png"
          }, undefined, false, undefined, this),
          jsx_dev_runtime.jsxDEV("title", {
            children: props.title
          }, undefined, false, undefined, this),
          jsx_dev_runtime.jsxDEV("link", {
            rel: "stylesheet",
            href: "/output.css"
          }, undefined, false, undefined, this)
        ]
      }, undefined, true, undefined, this),
      jsx_dev_runtime.jsxDEV("body", {
        children: jsx_dev_runtime.jsxDEV("div", {
          className: "App",
          role: "main",
          children: props.children
        }, undefined, false, undefined, this)
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
}

// pagesmodules/scheduler/cjs/sched
var jsx_dev_runtime2 = __toESM(require_jsx_dev_runtime(), 1);
function NewConnection(props) {
  return jsx_dev_runtime2.jsxDEV("div", {
    children: [
      jsx_dev_runtime2.jsxDEV("label", {
        children: "Username"
      }, undefined, false, undefined, this),
      jsx_dev_runtime2.jsxDEV("input", {
        className: "border-gray-500 border-4",
        type: "text"
      }, undefined, false, undefined, this),
      jsx_dev_runtime2.jsxDEV("label", {
        children: "Servername"
      }, undefined, false, undefined, this),
      jsx_dev_runtime2.jsxDEV("input", {
        className: "border-gray-500 border-4",
        type: "number"
      }, undefined, false, undefined, this),
      jsx_dev_runtime2.jsxDEV("button", {
        className: "bg-blue-500 p-4",
        onClick: (e) => {
          console.log(e);
        },
        children: "Connect"
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
}

// pagesmodules/schedu
var jsx_dev_runtime3 = __toESM(require_jsx_dev_runtime(), 1);
function index() {
  return jsx_dev_runtime3.jsxDEV(Layout, {
    title: "Welcome",
    children: [
      jsx_dev_runtime3.jsxDEV("h1", {
        children: "Chat, but with bun"
      }, undefined, false, undefined, this),
      jsx_dev_runtime3.jsxDEV(NewConnection, {}, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
}
export {
  index as default
};
