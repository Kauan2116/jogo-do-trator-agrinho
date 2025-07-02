let personagem;
let moedas = [];
let pontuacao;
let velocidade;
let tamanhoMoeda = 20;
let cenarioAtual = "campo"; // "campo" ou "cidade"
let jogoConcluido = false;
let mostrarMensagemFinal = false;
let mostrarMensagemCarga = false;
let jogoFinalizado = false;

let mercado;

function setup() {
  createCanvas(600, 400);
  personagem = new Personagem();
  pontuacao = 0;
  velocidade = 5;

  for (let i = 0; i < 5; i++) {
    moedas.push(new Moeda());
  }

  mercado = new Mercado(width - 150, height/2 + 30, 120, 80);
}

function draw() {
  if (pontuacao >= 30 && !jogoConcluido) {
    cenarioAtual = "cidade";
    jogoConcluido = true;
    moedas = [];
    mostrarMensagemFinal = true;

    // Trocar personagem para caminhão amarelo
    personagem = new Caminhao();
  }

  if (cenarioAtual === "campo") {
    desenharCampo();
  } else {
    desenharCidade();
    mercado.mostrar();

    if (jogoConcluido && !jogoFinalizado && mostrarMensagemCarga === false) {
      // Esperando clique para sumir a mensagem final e mostrar mensagem de carga
    }

    if (!jogoFinalizado) {
      // Verificar colisão com mercado
      if (personagem.colidiuCom(mercado)) {
        jogoFinalizado = true;
        mostrarMensagemFinal = false;
        mostrarMensagemCarga = false;
      }
    }
  }

  personagem.mostrar();
  personagem.mover();

  if (!jogoConcluido) {
    for (let i = moedas.length - 1; i >= 0; i--) {
      moedas[i].mostrar();

      if (personagem.pegarMoeda(moedas[i])) {
        moedas.splice(i, 1);
        pontuacao++;
        moedas.push(new Moeda());

        if (pontuacao % 5 === 0) {
          velocidade += 0.5;
        }
      }
    }
  }

  // Mostrar pontuação
  textSize(32);
  fill(0);
  textAlign(LEFT, BASELINE);
  text("Pontos: " + pontuacao, 10, 30);

  // Mensagens
  if (mostrarMensagemFinal) {
    textSize(36);
    fill(255, 0, 0);
    textAlign(CENTER, CENTER);
    text("Parabéns! Você colheu tudo", width / 2, height / 2);
  } else if (mostrarMensagemCarga) {
    textSize(32);
    fill(0, 100, 255);
    textAlign(CENTER, CENTER);
    text("Agora leve a carga até o mercado", width / 2, height / 2);
  }

  if (jogoFinalizado) {
    background(220, 240, 255, 200); // Fundo semi-transparente para destacar mensagem
    textSize(23);
    fill(0, 150, 0);
    textAlign(CENTER, CENTER);
    text(
      "Parabéns, você terminou todo o serviço!\n\n" +
      "Essa é uma das importâncias do campo para a cidade,\n" +
      "e a tecnologia das máquinas!",
      width / 2,
      height / 2
    );
  }
}

function mousePressed() {
  if (mostrarMensagemFinal) {
    mostrarMensagemFinal = false;
    mostrarMensagemCarga = true;
  } else if (mostrarMensagemCarga) {
    mostrarMensagemCarga = false;
  } else if (jogoFinalizado) {
    // Aqui poderia reiniciar o jogo ou não fazer nada
  }
}

function desenharCampo() {
  background(135, 206, 235); // Céu azul claro

  fill(34, 139, 34); // Chão verde
  noStroke();
  rect(0, height / 2, width, height / 2);
}

function desenharCidade() {
  // Céu claro (dia)
  background(135, 206, 250);

  // Rua
  fill(100);
  rect(0, height/2 + 50, width, 80);

  // Calçadas
  fill(200, 200, 200);
  rect(0, height/2 + 30, width, 20);
  rect(0, height/2 + 130, width, 20);

  // Prédios coloridos variados
  fill(150, 75, 0);
  rect(30, height/2 - 130, 70, 180);

  fill(100, 149, 237);
  rect(110, height/2 - 160, 60, 210);

  fill(220, 20, 60);
  rect(190, height/2 - 120, 80, 160);

  fill(255, 140, 0);
  rect(290, height/2 - 140, 90, 180);

  fill(50, 205, 50);
  rect(400, height/2 - 110, 70, 150);

  fill(72, 61, 139);
  rect(480, height/2 - 170, 90, 210);

  // Janelas
  fill(255, 255, 224);
  for(let b of [30, 110, 190, 290, 400, 480]){
    for(let y = height/2 - 120; y < height/2 + 20; y += 40){
      rect(b+10, y, 20, 30);
      rect(b+40, y, 20, 30);
    }
  }

  // Árvores na calçada
  fill(139, 69, 19);
  for(let x=80; x < width; x += 100){
    rect(x, height/2 + 10, 15, 40);
    fill(34, 139, 34);
    ellipse(x+7, height/2 + 10, 50, 50);
    fill(139, 69, 19);
  }
}

// Classe base para o personagem
class Personagem {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
    this.tamanho = 40;
    this.cor = color(200, 0, 0);
  }

  mostrar() {
    fill(this.cor);
    rect(this.x - 30, this.y - 15, 60, 30); // corpo

    fill(100);
    rect(this.x + 5, this.y - 25, 25, 20); // cabine

    fill(0);
    ellipse(this.x - 20, this.y + 15, 30, 30);
    ellipse(this.x + 20, this.y + 15, 30, 30);

    fill(50);
    ellipse(this.x - 20, this.y + 15, 20, 20);
    ellipse(this.x + 20, this.y + 15, 20, 20);
  }

  mover() {
    if (keyIsDown(LEFT_ARROW)) this.x -= velocidade;
    if (keyIsDown(RIGHT_ARROW)) this.x += velocidade;
    if (keyIsDown(UP_ARROW)) this.y -= velocidade;
    if (keyIsDown(DOWN_ARROW)) this.y += velocidade;

    this.x = constrain(this.x, 40, width - 40);
    this.y = constrain(this.y, 40, height - 40);
  }

  pegarMoeda(moeda) {
    let d = dist(this.x, this.y, moeda.x, moeda.y);
    return d < this.tamanho / 2 + moeda.tamanho / 2;
  }

  colidiuCom(obj) {
    // Colisão retangular simples
    return !(this.x + this.tamanho/2 < obj.x ||
             this.x - this.tamanho/2 > obj.x + obj.largura ||
             this.y + this.tamanho/2 < obj.y ||
             this.y - this.tamanho/2 > obj.y + obj.altura);
  }
}

// Caminhão amarelo após colher as plantações
class Caminhao extends Personagem {
  constructor() {
    super();
    this.cor = color(255, 204, 0); // amarelo
  }

  mostrar() {
    fill(this.cor);
    rect(this.x - 40, this.y - 20, 80, 40); // corpo maior

    // cabine (cinza claro)
    fill(180);
    rect(this.x + 15, this.y - 35, 40, 25);

    // Rodas pretas
    fill(0);
    ellipse(this.x - 25, this.y + 20, 35, 35);
    ellipse(this.x + 25, this.y + 20, 35, 35);

    // detalhes das rodas
    fill(80);
    ellipse(this.x - 25, this.y + 20, 25, 25);
    ellipse(this.x + 25, this.y + 20, 25, 25);
  }
}

// Classe Moeda como plantações de milho
class Moeda {
  constructor() {
    this.x = random(width);
    this.y = random(height / 2, height - 20);
    this.tamanho = tamanhoMoeda;
  }

  mostrar() {
    stroke(0, 100, 0);
    strokeWeight(2);
    line(this.x, this.y, this.x, this.y - 20);

    noStroke();
    fill(34, 139, 34);
    ellipse(this.x - 5, this.y - 10, 10, 5);
    ellipse(this.x + 5, this.y - 15, 10, 5);

    fill(255, 223, 0);
    ellipse(this.x, this.y - 25, 8, 16);
  }
}

// Mercado para entregar a carga
class Mercado {
  constructor(x, y, largura, altura) {
    this.x = x;
    this.y = y;
    this.largura = largura;
    this.altura = altura;
  }

  mostrar() {
    fill(200, 0, 0);
    rect(this.x, this.y, this.largura, this.altura);

    fill(255);
    textSize(12);
    textAlign(CENTER, CENTER);
    text("Super Mercado", this.x + this.largura / 2, this.y + 20);
    text("Qualidade", this.x + this.largura / 2, this.y + 40);

    // Porta
    fill(150, 75, 0);
    rect(this.x + this.largura / 2 - 20, this.y + this.altura - 40, 40, 40);
  }
}