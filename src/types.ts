interface ServerObj extends WebSocket{
  [key: string]: any,
  servername: string,
  chatHistory: string[],
}

interface Servers {
  [key: string]: ServerObj,
}

export type {
  ServerObj,
  Servers
}
