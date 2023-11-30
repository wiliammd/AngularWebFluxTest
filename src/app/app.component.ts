import { Component } from '@angular/core';
import { WebSocketAPI } from './WebSocketAPI';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  message: string;
  nome: string = null;
  temNome = false;
  receivedMessages: any[] = [];
  constructor(private webSocketService: WebSocketAPI) { }

  ngOnInit() {
    this.webSocketService.initializeWebSocketConnection();
    this.webSocketService.getMessages().subscribe((message) => {
      this.receivedMessages.push(message);
    });
  }

  iniciarConexao(){
    if(this.nome !== undefined && this.nome !== null ){
      this.receivedMessages = [];
      this.webSocketService.conectarComNome(this.nome);
      this.temNome = true;
    }else{
      alert('Por favor, insira seu nome')
    }
  }

  sendMessage() {
    this.webSocketService.enviarMensagem({sender:this.nome, content: this.message ,type:"CHAT"});
    this.message = '';
  }

  //funcao para gerar cor aleatorio de acordo com nome
  stringToColor(nome: string): string {
    // Função de hash simples
    let hash = 0;
    for (let i = 0; i < nome.length; i++) {
      hash = nome.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    // Componentes RGB baseados no hash
    const r = (hash & 0xFF0000) >> 16;
    const g = (hash & 0x00FF00) >> 8;
    const b = hash & 0x0000FF;
  
    // Construir a cor no formato hexadecimal
    const cor = `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
  
    return cor;
  }
}
