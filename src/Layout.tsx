import Navbar from './components/Navbar';
// import React from 'react';

// <link rel="manifest" href="/manifest.json" />
// <img src={"/bunlogo.svg"} className="App-logo" alt="logo" />
// <link rel="stylesheet" href="/index.css" />

export default function Layout(props: { title: string; children: React.ReactNode }) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Web site created using create-react-app"
        />
        <link rel="apple-touch-icon" href="/logo192.png" />
        <title>{props.title}</title>
        <link rel="stylesheet" href="/output.css" />
      </head>
      <body>
        <div className="App" role="main">
            {props.children}
        </div>
      </body>
    </html>
  );
}
