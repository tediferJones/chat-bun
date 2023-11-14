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
    clients: ServerWebSocket<{ username: string, color: string }>[],
  }
}

interface ResBody {
  errors: { [key: string]: string },
  username?: string,
  port?: number,
  color?: string,
}

interface FormInputs {
  [key: string]: string,
}

type UserAuth = undefined | {
  username: string,
  color: string,
}

////: interface UserAuth {
////:   status: boolean,
////:   username?: string,
////:   color?: string,
////: }

////: type UserAuth = { status: false } | { status: true, username: string, color: string }
////: type UserAuth = {
////:   status: boolean,
////:   username?: string,
////:   color?: string
////: } | {
////:   status: true,
////:   username: string,
////:   color: string
////: }

////: interface UserAuth {
////:   status: false | {
////:     username: string,
////:     color: string,
////:   }
////: }

export type {
  ServerObj,
  Servers,
  BackendServers,
  ResBody,
  FormInputs,
  UserAuth,
}
