import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server } from 'socket.io'

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketService implements OnGatewayConnection {
  @WebSocketServer() server: Server
  handleConnection(client: any, ...args: any[]) {
    console.log('CONNECTED TO WS')
  }
  sendPostUpdate(post: any) {
    this.server.emit('postUpdate', post)
  }
}
