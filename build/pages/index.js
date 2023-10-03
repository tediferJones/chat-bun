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
        children: [
          jsx_dev_runtime.jsxDEV("div", {
            className: "flex justify-around items-center bg-blue-400 p-4",
            children: [
              jsx_dev_runtime.jsxDEV("h1", {
                className: "bg-red-900 p-4",
                children: "React SSR w/ Bun"
              }, undefined, false, undefined, this),
              jsx_dev_runtime.jsxDEV("a", {
                href: "/",
                children: "home"
              }, undefined, false, undefined, this),
              jsx_dev_runtime.jsxDEV("a", {
                href: "/example",
                children: "example page"
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this),
          jsx_dev_runtime.jsxDEV("div", {
            className: "App",
            role: "main",
            children: props.children
          }, undefined, false, undefined, this)
        ]
      }, undefined, true, undefined, this)
    ]
  }, undefined, true, undefined, this);
}

// pagesmodules/scheduler/cjs
var jsx_dev_runtime2 = __toESM(require_jsx_dev_runtime(), 1);
function Greeter({ username }) {
  return jsx_dev_runtime2.jsxDEV("div", {
    className: "flex justify-center p-8 m-2 bg-purple-400 text-2xl text-white font-bold",
    children: jsx_dev_runtime2.jsxDEV("h1", {
      children: [
        "Hello, ",
        username
      ]
    }, undefined, true, undefined, this)
  }, undefined, false, undefined, this);
}

// pagesmodules/schedu
var jsx_dev_runtime3 = __toESM(require_jsx_dev_runtime(), 1);
function index() {
  return jsx_dev_runtime3.jsxDEV(Layout, {
    title: "Welcome",
    children: [
      jsx_dev_runtime3.jsxDEV("h1", {
        children: "THE REAL HOME PAGE"
      }, undefined, false, undefined, this),
      jsx_dev_runtime3.jsxDEV(Greeter, {
        username: "TIMMY"
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
}
export {
  index as default
};
