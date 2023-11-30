import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
export class WebSocketAPI {
    private stompClient;
    private messagesSubject = new Subject<any>();

  constructor() { }
  initializeWebSocketConnection() {
    const serverUrl = 'http://localhost:8080/ws';
    const ws = new SockJS(serverUrl);
    this.stompClient = Stomp.over(ws);
    this.stompClient.connect({}, () => {
      this.stompClient.subscribe('/topic/public', (message) => {
        const body = JSON.parse(message.body);
        this.messagesSubject.next(body);
      });
    });
  }

  conectarComNome(nome) {
    this.stompClient.send('/app/chat.addUser', {}, JSON.stringify({sender: nome, type: 'JOIN'}));
    // this.stompClient.connect({}, (message) => {
    //   this.stompClient.subscribe('/topic/public', JSON.stringify({sender: nome, type: 'JOIN'}));
    //   this.messagesSubject.next(JSON.parse(message.body))
    // });
  }

  enviarMensagem(message) {
    this.stompClient.send('/app/chat.sendMessage', {}, JSON.stringify(message));
  }

  getMessages() {
    return this.messagesSubject.asObservable();
  }
}