////////////////DATOS API

const urlBaseAPI = "https://dwallet.develotion.com/";
const urlBaseIMG = urlBaseAPI + "imgs/";
const urlBaseRubros = urlBaseAPI + "rubros.php/";
const urlShare = urlBaseAPI + "site/";
const urlObtenerCajeros = urlBaseAPI + "cajeros.php"

//////////////DATOS DE USUARIOS
let usuarioLogueado = false;
let usuarios = new Array();
let lat;
let long;
var latlngUsr;
var latlngCajero;
var map;

function Precarga() {
    let u1 = new Usuario("gbra", "abc123", 3218, 129833);
    usuarios.push(u1);
}

//////////////DATOS PARA IONIC
const INICIO = dqs("inicio");
const MENU = dqs("menuPrincipal");
const LOGIN = dqs("logIn");
const REGISTRO = dqs("registro");
const REAMOV = dqs("realizarMovimientos");
const LISMOV = dqs("listarMovimientos");
const CAJEROS = dqs("cajeros");
const COMPARTIR = dqs("compartir");
const ROUTER = dqs("router");
const alertaDecision = document.createElement('ion-alert');
const alertaInformacion = document.createElement('ion-alert');
const LOADING = document.createElement('ion-loading');
const MAPA = dqs("map");
