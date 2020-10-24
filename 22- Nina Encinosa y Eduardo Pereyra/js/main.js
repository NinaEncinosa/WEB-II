"use strict";
document.addEventListener("DOMContentLoaded", function() {
  CargarPropagandas();
  CargarInicio();
  let botonInicio = document.querySelectorAll(".js-LoadInicio");
  botonInicio.forEach(e=> e.addEventListener("click", CargarInicio));
  let botonMemes = document.querySelectorAll(".js-LoadMemes");
  botonMemes.forEach(e=> e.addEventListener("click", CargarMemes));
  let botonPersonajes = document.querySelectorAll(".js-LoadPersonajes");
  botonPersonajes.forEach(e=> e.addEventListener("click", CargarPersonajes));
  let botonInfo = document.querySelectorAll(".js-LoadInfo");
  botonInfo.forEach(e=> e.addEventListener("click", CargarInfo));
  let url = "http://web-unicen.herokuapp.com/api/groups/22/WikiSimpson";

  function Cargando() {
    let _contenedor = document.querySelector('.contenedor');
    _contenedor.innerHTML = "<h1 class:'cargando'>Loading...</h1>";
  }

  function CargarPropagandas() {
    let propagandas = document.querySelector(".propagandas");
    fetch("/tpespecial/html/propagandas.html").then( function(response){
      if(response.ok){
        response.text().then(t=> propagandas.innerHTML = t);
      }else{
        propagandas.innerHTML = "Error 404 file not found :("
      }
    }).catch(function(response){
      propagandas.innerHTML = "No se pudieron cargar las propagandas :("
    });
  }

  function CargarInicio(){
    let contenedor = document.querySelector(".contenedor");
    Cargando();
    fetch("/tpespecial/html/inicio.html").then( function(response){
      if(response.ok){
        response.text().then(t=> contenedor.innerHTML = t);
      }else{
        contenedor.innerHTML = "Error 404 file not found :(";
      }
    }).catch(function(response) {
      contenedor.innerHTML = "No estas conectado a internet :("
    });
  }

  function CargarMemes(){
    let contenedor = document.querySelector(".contenedor");
    Cargando();
    fetch("/tpespecial/html/memes.html").then( function(response){
      if(response.ok){
        response.text().then(t=> document.querySelector(".contenedor").innerHTML = t);
      }else{
        contenedor.innerHTML = "Error 404 file not found :(";
      }
    }).catch(function(response) {
      contenedor.innerHTML = "No estas conectado a internet :("
    });
  }

  function CargarPersonajes(){
    let contenedor = document.querySelector(".contenedor");
    Cargando();
    fetch("/tpespecial/html/personajes.html").then( function(response){
      if(response.ok){
        response.text().then(t=>{contenedor.innerHTML = t;
          let agregar = document.querySelector(".js-Agregar");
          agregar.addEventListener("click",AgregarFila);
          let x3 = document.querySelector(".js-x3");
          x3.addEventListener("click", function(e){
            for(let i = 0; i < 3; i++){
              AgregarFila();
            }
          });
        });
      }else{
        contenedor.innerHTML = "Error 404 file not found :(";
      }
    }).catch(function(response) {
      contenedor.innerHTML = "No estas conectado a internet :("
    });
  }

  function CargarInfo(){
    let contenedor = document.querySelector(".contenedor");
    Cargando();
    fetch("/tpespecial/html/info.html").then( function(response){
      if(response.ok){
        response.text().then(t=> document.querySelector(".contenedor").innerHTML = t);
      }else{
        contenedor.innerHTML = "Error 404 file not found :(";
      }
    }).catch(function(response) {
      contenedor.innerHTML = "No estas conectado a internet :("
    });
  }

  function AgregarFila() {
    let tablacontenedor = document.querySelector('.tabla-contenedor');
    fetch(url, {
      method: "GET",
      mode: 'cors',
    }).then(function(r){
      if(!r.ok){
        console.log("error")
      }
      return r.json()
    }).then(function (json) {
      console.log(json);
      Agregar(tablacontenedor);
      ImprimirTabla(json, tablacontenedor);
    }).catch(error => console.log(error))
  }

  function ImprimirTabla(json,tablacontenedor) {
    setTimeout(3000);
    for(let i = 0; i < json.WikiSimpson.length; i++){
        let personaje = json.WikiSimpson[i].thing.Personaje;
        let puntuacion = json.WikiSimpson[i].thing.Puntuacion;
        console.log(personaje);
        console.log(puntuacion);
        CrearTabla(tablacontenedor,personaje,puntuacion);
    }
    EliminarEditar(tablacontenedor);
  }

  function EliminarEditar(tablacontenedor) {
    let eliminar = tablacontenedor.querySelectorAll(".botoneliminar");
    let editar = tablacontenedor.querySelectorAll(".botoneditar");
    for(let j = 0; j < eliminar.length; j++){
      eliminar[j].addEventListener("click", c => EliminarJson(j));
      editar[j].addEventListener("click", c => EditarJson(j));
    }
    let boton = document.querySelector(".botones");
    let agregar = boton.querySelector(".js-Agregar");
    agregar.addEventListener("click", e => Agregar(tablacontenedor));
  }

  function Agregar(tablacontenedor) {
    let elegidopersonaje = document.querySelector('.personaje').value;
    let elegidopuntuacion = parseInt(document.querySelector('.puntuacion').value);
    if(Verificar(elegidopersonaje,elegidopuntuacion)){
      CrearThing(elegidopersonaje,elegidopuntuacion);
    }
  }

  function Verificar(personaje,puntuacion) {
    let verificar = true;
    if (personaje === " "){
      verificar = false;
    }
    if(puntuacion === 0){
      verificar = false;
    }
    return (verificar);
  }

  function CrearThing(personaje,puntuacion) {
    let WikiSimpsons = {
      "Personaje": personaje,
      "Puntuacion": puntuacion
    }
    let thing  = {
      thing : WikiSimpsons
    }
    fetch(url,{
      method:"POST",
      mode: 'cors',
      headers:{
        "Content-Type":"application/json"
      },
      "body":JSON.stringify(thing)
    }).catch(e => console.log(e))
  }

  function CrearTabla(tablacontenedor,personaje,puntuacion) {
    let clase = "";
    if(puntuacion === 10){
      let clase = "bueno";
    }
    if(puntuacion === 1){
      let clase = "malo";
    }
    tablacontenedor.innerHTML += "<tr class="+clase+"><td>"+personaje+"</td><td>"
                                  +puntuacion+"</td><td>"+
                                  "<button class='botoneliminar btn btn-outline-danger' type='button'></button>"+
                                  "<button class='botoneditar btn btn-outline-danger' type='button'></button>"+
                                  "</td><tr>";
  }

  function EliminarJson(id) {
    let tablacontenedor = document.querySelector('.tabla-contenedor');
    console.log("ELIMINO " + id);
    fetch(url).then(r => r.json()).then(function(json){
      let _id = json.WikiSimpson[id]._id;
      fetch(url+"/"+_id,{
        method:"DELETE",
        mode: 'cors',
        headers:{
          "Content-Type":"application/json"
        }
      }).catch(e => {console.log(e)
                  ImprimirTabla(json,tablacontenedor);
    })
    }).catch(error => console.log(error))
  }

  function EditarJson(id) {
    fetch(url).then(r => r.json()).then(function (json) {
      EditarJsonParte2(json, id);
    }).catch(error => console.log(error))
  }

  function EditarJsonParte2(json,id) {
   id = json.WikiSimpson[id]._id
    let tablacontenedor = document.querySelector(".tablacontenedor");
    let personaje = json.WikiSimpson[id].thing.personaje;
    let puntuacion = json.WikiSimpson[id].thing.puntuacion;
    tablacontenedor.querySelector('.personaje').selectedIndex = personaje;
    tablacontenedor.querySelector('.puntuacion').selectedIndex = puntuacion;
    tablacontenedor.querySelector('.js-Cambios').classList.remove("d-none");//??
    tablacontenedor.querySelector('.js-Agregar').classList.add("d-none");
    tablacontenedor.querySelector('.js-Cambios').addEventListener("click",
    e => EditarJsonParte3(json,id,tablacontenedor,personaje,puntuacion));
  }

  function EditarJsonParte3(json,id,tablacontenedor,personaje,puntuacion) {
    if(Verificar(tablacontenedor,personaje,puntuacion)){
      let personaje = tablacontenedor.querySelector(".personaje").selectedIndex;
      let puntuacion = tablacontenedor.querySelector(".puntuacion").selectedIndex;
      let WikiSimpsons = {
        "Personaje": personaje,
        "Puntuacion": puntuacion
      }
      let thing = {
        thing:WikiSimpsons
      }
      fetch(url + "/" + _id, {
        method:"PUT",
        mode: 'cors',
        headers:{
          "Content-Type":"application/json"
        },
        "body":JSON.stringify(thing)
      }).then(response => response.json()).catch(e => console.log(e))
      tablacontenedor.querySelector(".js-Agregar").classList.remove("d-none");
      tablacontenedor.querySelector(".js-Cambios").classList.add("d-none");
    }
  }
})
