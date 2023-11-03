import { Server, ServerWebSocket } from "bun"

interface ServerObj extends WebSocket {
  [key: string]: any,
  servername: string,
  chatHistory: string[],
}

interface Servers {
  [key: string]: ServerObj,
}

interface BackendServers {
  [key: string]: {
    server: Server,
    clients: ServerWebSocket<{ username: string }>[],
  }
}

interface ResBody {
  // status?: boolean,
  // errors?: string[],
  errors: string[],
  username?: string,
  port?: number,
}

export type {
  ServerObj,
  Servers,
  BackendServers,
  ResBody,
}
