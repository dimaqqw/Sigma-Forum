import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server } from 'socket.io'

@WebSocketGateway()
export class WebsocketGateway {
  @WebSocketServer()
  server: Server

  @SubscribeMessage('newComment')
  handleNewComment(client: any, data: any): void {
    this.server.emit('commentAdded', data)
  }
}
