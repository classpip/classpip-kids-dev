import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-juego-puzzle',
  templateUrl: './juego-puzzle.page.html',
  styleUrls: ['./juego-puzzle.page.scss']
})
export class JuegoPuzzlePage implements OnInit {

  isDisabled= true;
  isDisabled2= true;
  isDisabled3= true;
  correcto= false;
  ayuda = false;
  mode_easy = false;
  mode_medium = false;
  mode_hard = false;
  mode_insane = false;
  score = 0;

  constructor(
    public navCtrl: NavController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit(): void {

    CANVAS = document.getElementById('canvas')
    CONTEXT = CANVAS.getContext("2d")
  
    HELPER_CANVAS = document.getElementById('helperCanvas')
    HELPER_CONTEXT = HELPER_CANVAS.getContext("2d")
  
    addEventListeners()
    this.setFondo
    addEventListeners()
    this.setDifficulty
    addEventListeners()
  
    //if (MINION == true) {
     IMAGE.src = '../assets/img/pikachu.jpg' 
    //} else if (POKEMON == true) {
     // IMAGE.src = '../assets/imgs/pikachu.jpg'
   // }
    
  
    IMAGE.onload = function () {
      handleResize()
      window.addEventListener('resize', handleResize)
      initializePieces(SIZE.rows, SIZE.columns)
      updateGame()
    }
    
  }


  setDifficulty() {
    this.isDisabled = true;
    this.isDisabled2 = true;
    this.isDisabled3 = true;
    

    let diff = (<HTMLInputElement>document.getElementById('difficulty')).value
    SELECTED_PIECE = null;
    switch (diff) {
      case "Facil":
        initializePieces(3, 3)
        break
      case "Media":
        initializePieces(5, 5)
        break
      case "Dificil":
        initializePieces(10, 10)
        break
      case "Muy Dificil":
        initializePieces(25, 25)
        break

    }

  }

  setFondo() {
    this.isDisabled = true;
    this.isDisabled2 = true;
    this.isDisabled3 = true;

    let diff = (<HTMLInputElement>document.getElementById('fondo')).value
    SELECTED_PIECE = null;
    switch (diff) {
      case "Pokemon":
        IMAGE.src = '../assets/imgs/pikachu.jpg'
        break 
      case "Minions":
        IMAGE.src = '../assets/imgs/minions.jpg'
        break
      case "Mario Bros":
        IMAGE.src = '../assets/imgs/mario.jpg'
        break
    }

  }

  start() {
    this.isDisabled = false;
    this.isDisabled2 = false;
    this.isDisabled3 = false;
    START_TIME = new Date().getTime()
    END_TIME = null
    randomizePieces()
    document.getElementById("menuItems").style.display = "none"
    document.getElementById("endScreen").style.display = "none"
  }

  async restart() {
    let alert = await this.alertCtrl.create({
      
      header: 'Seguro que quieres reiniciar partida?',
      buttons: [
        { 
          text: 'NO',
          role: 'NO',
          handler: () => {
            
          }
        },
        {
          text: 'SI',
          role: 'SI',
          handler: () => {
            START_TIME = new Date().getTime()
            END_TIME = null
            randomizePieces()
            document.getElementById("menuItems").style.display = "none"
          }
        }
      ]
    });
    await alert.present();
    
  }

  async showAlert() {
    let alert = await this.alertCtrl.create({
      header: 'INFORMACIÓN',
      message: 'Al apretar el icono de ? se abrirá una cuestion relacionada con alguna asignatura. En el caso de contestar correctamente se colocara una pieza aleatoria en el puzzle. Ten en cuenta que tu puntuacion se vaera afectada si utilizas la ayuda y solo dispondras de un intento. Buena suerte!',
      buttons: ['OK']
    }); await alert.present();

  }

  async showQuest() {
    this.isDisabled3 = true;
    let alert = await this.alertCtrl.create({
      header: 'QUESTION',
      message: 'Capital de España?',
      buttons: [
        {
          text: 'Madrid',
          role: 'Madrid',
          handler: () => {
            this.ayuda = true;
            ColocarPieza3()
          },
        },
        {
          text: 'Barcelona',
          handler: () => {
            
          },
        },
        {
          text: 'Valencia',
          handler: () => {
            
          },
        },
      ],
      

    }); await alert.present();
    
  }

}


let CANVAS = null
let CONTEXT = null
let IMAGE = new Image()
let HELPER_CANVAS = null
let HELPER_CONTEXT = null
let SCALER = 0.6
let SIZE = { x: 0, y: 0, width: 0, height: 0, rows: 3, columns: 3 }
let PIECES = []
let SELECTED_PIECE = null
let START_TIME = null
let END_TIME = null
let TIME = null

let POP_SOUND = new Audio("../assets/sounds/pop.mp3")
POP_SOUND.volume = 0.5

let COMPLETE_SOUND = new Audio("../assets/sounds/complete.mp3")
COMPLETE_SOUND.volume = 0.2


function updateTime() {
  let now = new Date().getTime()
  if (START_TIME != null) {
    if (END_TIME != null) {
      TIME = document.getElementById("time")
      TIME.innerHTML = formatTime(END_TIME - START_TIME)
    }
    else {
      TIME = document.getElementById("time")
      TIME.innerHTML = formatTime(now - START_TIME)
    }
    //console.log(TIME);

  }
}

function isComplete() {
  for (let i = 0; i < PIECES.length; i++) {
    if (PIECES[i].correct == false) {
      return false
    }
  }
  
  return true
}

function formatTime(miliseconds) {
  let seconds = Math.floor(miliseconds / 1000)
  let s = Math.floor(seconds % 60)
  let m = Math.floor(seconds % (60 * 60) / 60)
  let h = Math.floor(seconds % (60 * 60 * 24) / (60 * 60))

  let formattedTime = h.toString().padStart(2, "0")
  formattedTime += ":"
  formattedTime += m.toString().padStart(2, "0")
  formattedTime += ":"
  formattedTime += s.toString().padStart(2, "0")

  return formattedTime
}

function addEventListeners() {
  CANVAS.addEventListener("mousedown", onMouseDown)
  CANVAS.addEventListener("mousemove", onMouseMove)
  CANVAS.addEventListener("mouseup", onMouseUp)
  CANVAS.addEventListener("touchstart", onTouchStart)
  CANVAS.addEventListener("touchmove", onTouchMove)
  CANVAS.addEventListener("touchend", onTouchEnd)
}

function onTouchStart(evt) {
  let loc = {
    x: evt.touches[0].clientX,
    y: evt.touches[0].clientY
  }
  onMouseDown(loc)
}

function onTouchMove(evt) {
  let loc = {
    x: evt.touches[0].clientX,
    y: evt.touches[0].clientY
  }
  onMouseMove(loc)
}

function onTouchEnd() {
  onMouseUp()
}

function onMouseDown(evt) {
  const imgData = HELPER_CONTEXT.getImageData(evt.x, evt.y, 1, 1)
  if (imgData.data[3] == 0) {
    return
  }
  const clickedColor = "rgb(" + imgData.data[0] + "," + imgData.data[1] + "," + imgData.data[2] + ")"
  SELECTED_PIECE = getPressedPieceByColor(evt, clickedColor)
  //SELECTED_PIECE = getPressedPiece(evt)
  if (SELECTED_PIECE != null) {
    const index = PIECES.indexOf(SELECTED_PIECE)
    if (index > -1) {
      PIECES.splice(index, 1)
      PIECES.push(SELECTED_PIECE)
    }
    SELECTED_PIECE.offset = {
      x: evt.x - SELECTED_PIECE.x,
      y: evt.y - SELECTED_PIECE.y
    }
    SELECTED_PIECE.correct = false
  }
}

function onMouseMove(evt) {
  if (SELECTED_PIECE != null) {
    SELECTED_PIECE.x = evt.x - SELECTED_PIECE.offset.x
    SELECTED_PIECE.y = evt.y - SELECTED_PIECE.offset.y
    //console.log(SELECTED_PIECE.x)
  }
}

function onMouseUp() {
  if (SELECTED_PIECE != null) {
    if (SELECTED_PIECE.isClose()) {
      SELECTED_PIECE.snap()
      if (isComplete() && END_TIME == null) {
        let now = new Date().getTime()
        END_TIME = now
        COMPLETE_SOUND.play()
        showEndScreen();
        
      }
    }
    //console.log("Entra");
    SELECTED_PIECE = null
  }
}

/*function getPressedPiece(loc) {

  for (let i = PIECES.length - 1; i >= 0; i--) {
    if (loc.x > PIECES[i].x && loc.x < PIECES[i].x + PIECES[i].width &&
      loc.y - 56 > PIECES[i].y && loc.y - 56 < PIECES[i].y + PIECES[i].height) {
      //console.log('PIECE => X: ' + PIECES[i].x + '  Y: ' + PIECES[i].y);
      return PIECES[i]

    }
  }
  return null
}*/

function getPressedPieceByColor(loc, color) {
  //console.log('MOUSE => X: ' + loc.x + '  Y: ' + loc.y);

  for (let i = PIECES.length - 1; i >= 0; i--) {
    if (PIECES[i].color == color) {
      console.log("ENTRA");
      
      return PIECES[i]
    }
  }
  return null
}

function handleResize() {
  CANVAS.width = window.innerWidth
  CANVAS.height = window.innerHeight

  HELPER_CANVAS.width = window.innerWidth
  HELPER_CANVAS.height = window.innerHeight

  let resizer = SCALER * Math.min(
    window.innerWidth / IMAGE.width,
    window.innerHeight / IMAGE.height)

  SIZE.width = resizer * IMAGE.width
  SIZE.height = resizer * IMAGE.height
  SIZE.x = window.innerWidth / 2 - SIZE.width / 2
  SIZE.y = window.innerHeight / 2 - SIZE.height / 2


}

function updateGame() {
  CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height)
  HELPER_CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height)

  CONTEXT.globalAlpha = 0.5
  CONTEXT.drawImage(IMAGE,
    SIZE.x, SIZE.y,
    SIZE.width, SIZE.height)
  CONTEXT.globalAlpha = 1;

  for (let i = 0; i < PIECES.length; i++) {
    PIECES[i].draw(CONTEXT)
    PIECES[i].draw(HELPER_CONTEXT, false)
  }

  updateTime()
  window.requestAnimationFrame(updateGame)
}

function getRandomColor() {
  const red = Math.floor(Math.random() * 255)
  const green = Math.floor(Math.random() * 255)
  const blue = Math.floor(Math.random() * 255)

  return "rgb(" + red + "," + green + "," + blue + ")"
}

function initializePieces(rows, cols) {
  SIZE.rows = rows
  SIZE.columns = cols

  PIECES = []
  const uniqueRandomColors = []
  for (let i = 0; i < SIZE.rows; i++) {
    for (let j = 0; j < SIZE.columns; j++) {
      let color = getRandomColor()
      while (uniqueRandomColors.includes(color)) {
        color = getRandomColor()
      }

      PIECES.push(new Piece(i, j, color))
    }
  }

  let cnt = 0
  for (let i = 0; i < SIZE.rows; i++) {
    for (let j = 0; j < SIZE.columns; j++) {
      const piece = PIECES[cnt]
      if (i == SIZE.rows - 1) {
        piece.bottom = null
      }
      else {
        const sgn = (Math.random() - 0.5) < 0 ? -1 : 1
        piece.bottom = sgn * (Math.random() * 0.4 + 0.3)
      }

      if (j == SIZE.columns - 1) {
        piece.right = null
      }
      else {
        const sgn = (Math.random() - 0.5) < 0 ? -1 : 1
        piece.right = sgn * (Math.random() * 0.4 + 0.3)
      }

      if (j == 0) {
        piece.left = null
      }
      else {
        piece.left = -PIECES[cnt - 1].right
      }

      if (i == 0) {
        piece.top = null
      }
      else {
        piece.top = -PIECES[cnt - SIZE.columns].bottom
      }
      cnt++
    }
  }

}

/*function GetPieza(){
  const randomElement = PIECES[Math.floor(Math.random() * PIECES.length)];
  console.log(randomElement);
}*/

function ColocarPieza3(){
  const rdmnumber = Math.floor(Math.random() * 5);
  //const randomElement = PIECES[Math.floor(Math.random() * PIECES.length)];
  
  if(rdmnumber == 0){
    PIECES[0].x = 75
    PIECES[0].y = 249,125
  } else if(rdmnumber == 1){

  }else if(rdmnumber == 1){
    PIECES[1].x = 75
    PIECES[1].y = 249,125
  }
  
}

function randomizePieces() {
  for (let i = 0; i < PIECES.length; i++) {
    let loc = {
      x: Math.random() * (CANVAS.width - PIECES[i].width),
      y: Math.random() * (CANVAS.height - PIECES[i].height)
    }
    PIECES[i].x = loc.x
    PIECES[i].y = loc.y
    PIECES[i].correct = false
  }
}
class Piece {
  rowIndex: number
  colIndex: number
  x: number
  y: number
  width: number
  height: number
  xCorrect: number
  yCorrect: number
  correct: boolean
  top: number
  right: number
  left: number
  bottom: number
  color: any

  constructor(rowIndex, colIndex, color) {
    this.rowIndex = rowIndex
    this.colIndex = colIndex
    this.x = SIZE.x + SIZE.width * this.colIndex / SIZE.columns
    this.y = SIZE.y + SIZE.height * this.rowIndex / SIZE.rows
    this.width = SIZE.width / SIZE.columns
    this.height = SIZE.height / SIZE.rows
    this.xCorrect = this.x
    this.yCorrect = this.y
    this.correct = true
    this.color = color
  }
  draw(context: any, useImage = true) {
    context.beginPath()

    const sz = Math.min(this.width, this.height)
    const neck = 0.1 * sz
    const tabWidth = 0.2 * sz
    const tabHeight = 0.2 * sz

    //context.rect(this.x, this.y, this.width, this.height)
    //from top left
    context.moveTo(this.x, this.y)
    //to top right
    if (this.top) {
      context.lineTo(this.x + this.width * Math.abs(this.top) - neck, this.y)

      context.bezierCurveTo(
        this.x + this.width * Math.abs(this.top) - neck,
        this.y - tabHeight * Math.sign(this.top) * 0.2,

        this.x + this.width * Math.abs(this.top) - tabWidth,
        this.y - tabHeight * Math.sign(this.top),

        this.x + this.width * Math.abs(this.top),
        this.y - tabHeight * Math.sign(this.top)
      )

      context.bezierCurveTo(
        this.x + this.width * Math.abs(this.top) + tabWidth,
        this.y - tabHeight * Math.sign(this.top),

        this.x + this.width * Math.abs(this.top) + neck,
        this.y - tabHeight * Math.sign(this.top) * 0.2,

        this.x + this.width * Math.abs(this.top) + neck, this.y
      )
    }
    context.lineTo(this.x + this.width, this.y)
    //to bottom right
    if (this.right) {
      context.lineTo(this.x + this.width, this.y + this.height * Math.abs(this.right) - neck)

      context.bezierCurveTo(
        this.x + this.width - tabHeight * Math.sign(this.right) * 0.2,
        this.y + this.height * Math.abs(this.right) - neck,

        this.x + this.width - tabHeight * Math.sign(this.right),
        this.y + this.height * Math.abs(this.right) - tabWidth,

        this.x + this.width - tabHeight * Math.sign(this.right),
        this.y + this.height * Math.abs(this.right)
      )

      context.bezierCurveTo(
        this.x + this.width - tabHeight * Math.sign(this.right),
        this.y + this.height * Math.abs(this.right) + tabWidth,

        this.x + this.width - tabHeight * Math.sign(this.right) * 0.2,
        this.y + this.height * Math.abs(this.right) + neck,

        this.x + this.width,
        this.y + this.height * Math.abs(this.right) + neck
      )

    }
    context.lineTo(this.x + this.width, this.y + this.height)
    //to bottom left
    if (this.bottom) {
      context.lineTo(this.x + this.width * Math.abs(this.bottom) + neck, this.y + this.height)

      context.bezierCurveTo(
        this.x + this.width * Math.abs(this.bottom) + neck,
        this.y + this.height + tabHeight * Math.sign(this.bottom) * 0.2,

        this.x + this.width * Math.abs(this.bottom) + tabWidth,
        this.y + this.height + tabHeight * Math.sign(this.bottom),

        this.x + this.width * Math.abs(this.bottom),
        this.y + this.height + tabHeight * Math.sign(this.bottom)
      )

      context.bezierCurveTo(
        this.x + this.width * Math.abs(this.bottom) - tabWidth,
        this.y + this.height + tabHeight * Math.sign(this.bottom),

        this.x + this.width * Math.abs(this.bottom) - neck,
        this.y + this.height + tabHeight * Math.sign(this.bottom) * 0.2,

        this.x + this.width * Math.abs(this.bottom) - neck,
        this.y + this.height
      )
    }
    context.lineTo(this.x, this.y + this.height)
    //to top left
    if (this.left) {
      context.lineTo(this.x, this.y + this.height * Math.abs(this.left) + neck)

      context.bezierCurveTo(
        this.x + tabHeight * Math.sign(this.left) * 0.2,
        this.y + this.height * Math.abs(this.left) + neck,

        this.x + tabHeight * Math.sign(this.left),
        this.y + this.height * Math.abs(this.left) + tabWidth,

        this.x + tabHeight * Math.sign(this.left),
        this.y + this.height * Math.abs(this.left)
      )

      context.bezierCurveTo(
        this.x + tabHeight * Math.sign(this.left),
        this.y + this.height * Math.abs(this.left) - tabWidth,

        this.x + tabHeight * Math.sign(this.left) * 0.2,
        this.y + this.height * Math.abs(this.left) - neck,

        this.x,
        this.y + this.height * Math.abs(this.left) - neck
      )
    }

    context.lineTo(this.x, this.y)

    context.save()
    context.clip()

    const scaledTabHeight =
      Math.min(IMAGE.width / SIZE.columns,
        IMAGE.height / SIZE.rows) * tabHeight / sz

    if (useImage) {
      context.drawImage(IMAGE,
        this.colIndex * IMAGE.width / SIZE.columns - scaledTabHeight,
        this.rowIndex * IMAGE.height / SIZE.rows - scaledTabHeight,
        IMAGE.width / SIZE.columns + scaledTabHeight * 2,
        IMAGE.height / SIZE.rows + scaledTabHeight * 2,
        this.x - tabHeight,
        this.y - tabHeight,
        this.width + tabHeight * 2,
        this.height + tabHeight * 2)
    }
    else {
      context.fillStyle = this.color
      context.fillRect(this.x - tabHeight, this.y - tabHeight, this.width + tabHeight * 2, this.height * tabHeight * 2)
    }

    context.restore()

    context.stroke()
  }

  isClose() {
    if (distance({ x: this.x, y: this.y },
      { x: this.xCorrect, y: this.yCorrect }) < this.width / 6) {
      return true
    }
    return false
  }

  snap() {
    this.x = this.xCorrect
    this.y = this.yCorrect
    this.correct = true
    POP_SOUND.play()
  }

}

function distance(p1, p2) {
  return Math.sqrt(
    (p1.x - p2.x) * (p1.x - p2.x) +
    (p1.y - p2.y) * (p1.y - p2.y)
  );
}

function showEndScreen() {
  //let time=Math.floor((END_TIME-START_TIME)/1000);
  let puntos;
  let ayuda;
  let now = new Date().getTime()
  END_TIME = now
  let tiempo = Math.round(END_TIME-START_TIME)/1000
  if (SIZE.rows == 3 && SIZE.columns == 3) {
     puntos = 9
     /*if (tiempo <= 40) {
      puntos = puntos*1.2
     }*/
  } else if (SIZE.rows == 5 && SIZE.columns == 5){
    puntos = 25
  } else if (SIZE.rows == 10 && SIZE.columns == 10) {
    puntos = 100
  } else if (SIZE.rows ==25 && SIZE.columns == 25) {
    puntos = 625
  }

  if (ayuda == 'SI') {
    puntos = puntos -10;
  }

  ayuda = 'NO' 

  document.getElementById("modo").innerHTML="Piezas colocadas: "+ puntos;
  document.getElementById("tiempo").innerHTML="Tiempo: "+ tiempo;
  document.getElementById("ayuda").innerHTML="Ayuda: "+ ayuda;

  document.getElementById("endScreen").style.display="block";
  document.getElementById("time").style.display="block";
}


/*function showScores(){
  document.getElementById("endScreen").style.display="none";
  document.getElementById("scoresScreen").style.display="block";
  document.getElementById("scoresContainer").innerHTML="Loading...";
  //getScores();
}*/

/*function closesScores(){
  document.getElementById("endScreen").style.display="block";
  document.getElementById("scoresScreen").style.display="none";
}*/

/*function getScores(){
  fetch ("sever.php".then(function(response) {
      response.json().then(function(data) {
          console.log(data);
      });
  });

}*/

/*function formatScores(data) {
  let html="<table style='widht:100%;text-align:center;'>";
  html+="<tr style='bckground:rgb(123,146,196);color:white'>";
  html+="<td></td><td><b>Easy</b></td><td><b>Time</b></td></tr>";

}*/

