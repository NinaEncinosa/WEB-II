"use strict";
let aciertosActual = 0;
let erroresActual = 0;
let aciertosTotales = 0;
let erroresTotales = 0;
let numPartida = 0;
let creaCartas = true; //Si es verdadero cada vez que comienza una partida nueva cambia los dorsos
let creaBoolean = true; //Permite crear el arreglo con las cartas una sola vez
let arrConDorsos = Array(); //Es un arreglo que ayuda para mostrar correctamente las cartas relacionado con las respuestas
let arregloBoolean = Array(); //Arreglo con los numeros al azar que luego es utilzado para mostrar cartas (arreglo logico)

let btn = document.getElementById("botoncomienzo");
btn.addEventListener("click",comienzaJuego);

let conf = document.getElementById("botonconfirmar");
conf.addEventListener("click",checkeaCartas);

function eligeTiempo(){ //Con esta funcion elige el tiempo
  let segs;
  let tiempo = document.getElementsByName("tiempo");
  for (let i = 0; i < tiempo.length; i++){
    if(tiempo[i].checked){
      segs = tiempo[i].value;
    }
  }
  return segs;
}

function timer(i){ //Pasa el tiempo(cuenta regresiva)
  let tiempo = setTimeout('muestraArrConDorsos()',i);
  console.log(i);
  muestraArregloConMarcas();
}

function muestraArregloConMarcas(){ //Muestra las cartas para jugar
  let arregloImg = document.querySelectorAll('.marcas');
  creaArrBoolean();
  for ( let i = 0; i <= 4; i++){
    arregloImg[0].src = '../images/carta1.jpg';
    let x = arregloBoolean[i] ;
    if (x === 1){
      arregloImg[i].src = '../images/carta1.jpg';
    }
    else{
      arregloImg[i].src = '../images/carta2.jpg';
    }
  }
}

function creaArrBoolean(){ //Crea el arreglo boolean llenandolo con random (-1 y 1) la primera vez
  if(creaBoolean === true){
    for (let i = 0; i <= 4; i++){
      arregloBoolean[0] = 1; //siempre tiene marca la primera
      let opc = random();
      if(opc === 1 ){
        arregloBoolean[i] = 1;
      }
      else{
        arregloBoolean[i] = -1;
      }
    }
    creaBoolean = false;
  }
  else {
    invierteArrBoolean();
  }
}

function random (){ //Devuelve un numero random entre 1 o 0
  let num = Math.floor((Math.random())*2);
  return num;
}

function invierteArrBoolean(){ //Invierta el arreglo logico
  for(let i = 1; i <= 4; i++){
    arregloBoolean[i] = arregloBoolean[i] * (-1);
  }
}

function comienzaJuego(){
  ocultarTiempo();
  let segs = eligeTiempo();
  timer(segs);//Llama a la funcion que muestra las cartas
  ocultarOpciones();
}

function ocultarTiempo() { //Oculta las opciones del tiempo
  let selectorTiempo = document.querySelector('.selectorTiempo');
  selectorTiempo.classList.toggle("ocultarTiempo");
  let botoncomenzar = document.getElementById('botoncomienzo')
  botoncomenzar.classList.toggle("ocultarTiempo");
}

function ocultarOpciones() { //Oculta todas las opciones para si elegir si tiene o no a Homero
  let botones = document.querySelectorAll(".botones");
  for(let i = 0; i < 5; i++){
      botones[i].classList.toggle("ocultar");
  }
  let boton = document.querySelector(".boton");
    boton.classList.toggle("ocultar");
}

function crearArrConDorsos(){ //Crea el arreglo CartasConDorsos llenandolo con 0
  for (let i = 0; i <= 4; i++){
    arrConDorsos[i] = 0;
    creaCartas = false;
  }
}

function checkeaCartas(){ //Comprueba las resputas del usuario con respecto a las cartas
  for (let i = 0; i <= 4; i++){
    let rtaenarreglo = arregloBoolean[i];
    let radioBtn = document.getElementsByName("carta"+i);
    for (let j = 0; j < radioBtn.length; j++){
      let respuestaUsuario = radioBtn[j].value;
      if((radioBtn[j].checked)&&(respuestaUsuario == 1)){
        if (rtaenarreglo === 1){ //Responde bien, tiene a Homero
            arrConDorsos[i] = 1;
            aciertosActual += 1;
            aciertosTotales += 1;
            radioBtn[j].checked = false;
        }
        else{ //Pone que tiene a Homero y no tiene
          if((respuestaUsuario == 1)&&(rtaenarreglo == -1)){
            erroresActual += 1;
            erroresTotales += 1;
          }
          }
        }
        else{
          if((radioBtn[j].checked)&&(respuestaUsuario == -1)){
            if (rtaenarreglo == -1) {  //Responde bien que no tiene a Homero y no suma aciertos
                arrConDorsos[i] = 2;
                radioBtn[j].checked = false;
            }else {
              erroresActual += 1;  //Pone que no tiene Homero y tiene
              erroresTotales += 1;
            }
          }
          ocultarOpcion();
      }
    }
  }

    muestraArrConDorsos();
    if(checkeaSiQuedanCartasPorAdivinar()===false){
      Gano();
    }
    innerTabla();
}

function muestraArrConDorsos(){ //Muestra los dorsos y las cartas ya adivinadas durante la jugada
  let arregloImg = document.querySelectorAll('.marcas');
  if(creaCartas === true){
    crearArrConDorsos();
  }
  for ( let i = 0; i <= 4; i++){
    let x = arrConDorsos[i] ;
    if (x === 0){
      arregloImg[i].src = '../images/carta.jpg';
    }
    else{
      if (x === 1) {
        arregloImg[i].src = '../images/carta1.jpg';
      }else {
        arregloImg[i].src = '../images/carta2.jpg';
      }

    }
  }
}

function checkeaSiQuedanCartasPorAdivinar(){ //Asegura que no queden cartas por adivinar y avisa
  let quedanCartas = true;
  if(cuentaCartasConMarca(arrConDorsos) === cuentaCartasConMarca(arregloBoolean)){
    quedanCartas = false;
  }
  return quedanCartas;
}

function Gano() { //Gano el juego y llama todas las funciones para reiniciar el juego
  actualizaJugada();
  ocultarOpciones();
  invierteArrBoolean();
  comienzaJuego();
  console.log("TERMINO EL JUEGO");
  alert("Ganaste!!");
}

function innerTabla() { //Imprime los resultados en las tablas
//Actuales
  //Aciertos
  console.log("aciertosactual: " + aciertosActual);
  let _aciertos = document.getElementById('aciertos')
  _aciertos.innerHTML = aciertosActual;
  //Errores
  console.log("erroresactual " + erroresActual);
  let _errores = document.getElementById('errores')
  _errores.innerHTML = erroresActual;

//Totales
  //Aciertos
  console.log("aciertostotales: " + aciertosTotales);
  let _aciertos_totales = document.getElementById('aciertos_totales')
  _aciertos_totales.innerHTML = aciertosTotales;
  //Errores
  console.log("errorestotal " + erroresTotales);
  let _errores_totales = document.getElementById('errores_totales')
  _errores_totales.innerHTML = erroresTotales;

  console.log(" ");
}

function cuentaCartasConMarca(arr){ //Cuenta las cartas con Homero
  let cantidad = 0;
  for (let i = 0; i <= 4; i++){
    if (arr[i] === 1){
      cantidad = cantidad + 1;
    }
  }
  return cantidad;
}

function actualizaJugada(){ //Reinicia valores
  creaCartas = true;
  limpiarBotones();
  ocultarOpciones();
  ocultarOpcion();
  actualizaTablas();
}

function ocultarOpcion() { //Oculta la opcion para elegir si tiene o no Homero
  let botones = document.querySelectorAll(".botones");
  for (let i = 0; i < 5; i++ ){
    if((arrConDorsos[i] === 1)||(arrConDorsos[i] === 2)){
      botones[i].classList.add("ocultar");
    }
  }
}


 function limpiarBotones() { //Limpia el checked de los radio button de las opciones de las cartas
   let botones = document.querySelectorAll(".botones");
   for (let i = 0; i <= 4; i++){
     botones[i].classList.remove("ocultar");
     let radioBtn = document.getElementsByName("carta"+i);
     for (let j = 0; j < radioBtn.length; j++){
       radioBtn[j].checked = false;
     }
   }
 }

 function actualizaTablas() { //Agrega los resultados a la tabla de historial partida
   numPartida += 1;
   let historialPartidas = document.getElementById('historial_partidas');
   historialPartidas.innerHTML += "<tr>"+"<td>"+numPartida+"</td>"+"<td>"+aciertosActual+"/"+erroresActual+"</td>"+"</tr>";
   aciertosActual = 0;
   erroresActual = 0;
 }
