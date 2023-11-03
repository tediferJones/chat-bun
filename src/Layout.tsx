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
        <link rel="stylesheet" href="/style.css" />
        <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Ubuntu%20Mono'/>
        <script src="https://kit.fontawesome.com/0db2e99dd7.js" crossOrigin="anonymous"></script>
      </head>
      <body className='bg-gray-900 text-white text-lg'>
        <div className="App" role="main">
            {props.children}
        </div>
      </body>
    </html>
  );
}
