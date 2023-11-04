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
  errors: string[],
  username?: string,
  port?: number,
}

interface FormInputs {
  [key: string]: string,
}

interface UserAuth {
  status: boolean,
  username: string,
}

export type {
  ServerObj,
  Servers,
  BackendServers,
  ResBody,
  FormInputs,
  UserAuth,
}
