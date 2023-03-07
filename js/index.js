Inicio();

////////////////   LOGIN   ////////////////

function ToInicio() {
    OcultarTodo();
    INICIO.style.display = "block";
    if (localStorage.getItem("usuario") != null) {
        dqs('msjBienvenida').innerHTML = `Bienvenid@ ${localStorage.getItem('usuario')}`;
        usuarioLogueado = true;
    } else {
        dqs('msjBienvenida').innerHTML = ``;
        usuarioLogueado = false;
    }
}

function ToLogin() {
    OcultarTodo();
    LimpiarDatos();
}

function TomarDatosLogin() {
    let u = dqs("usuario").value.trim();
    let p = dqs("password").value.trim();
    Validar_Ingresar(u, p);
}

/////////////////////////////// REGISTRO   ////////////////

function ToRegistrarse() {
    CerrarMenu();
    OcultarTodo();
    MenuOpciones();
    REGISTRO.style.display = "block";
    LimpiarDatos();
    dqs("mostrarCuidades").style.display = "none";
    FetchDepartamentos();
}

function TomarDatosRegistro() {
    let usr = dqs("regUsuario").value.trim();
    let pass = dqs("regPassword").value.trim();
    let dep = Number(dqs("sclDepto").value);
    let ciu = Number(dqs("sclCiudad").value);
    Validar_Registrar(usr, pass, dep, ciu);
}

/////////////////////////////// MOVIMIENTOS   ////////////////

function ConsultaAgregarMov() {
    MensajeAlertaDecision('Confirma que desea agregar este movimiento', 'agregarMov');
}

function AgregarMovimiento() {
    let id = Number(localStorage.getItem("id"));
    if (document.getElementById('concepto') != null) {
        let concepto = dqs('concepto').value.trim();
        let rubro = dqs('slcRubro').value;
        let medio = dqs('slcMedio').value;
        let total = Math.abs(dqs('total').value);
        let fecha = dqs('date').value;
        Validar_Ingresar_Movimiento(id, concepto, rubro, medio, total, fecha);
    }
}

function ListarMovimientos() {
    OcultarTodo();
    dqs("cabezalTablaMovimientos").innerHTML = "";
    dqs("tablaMovimientos").innerHTML = "";
    dqs('resumenMovimientos').style.display = 'none';
    FetchListadoMovimientos();
}

/////////////////////////////// CAJEROS   ////////////////

function BusquedaCajero() {
    getLocation();
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(mostrarUbicacion)
    } else {
        MensajeAlertaInfo("Dispositivo no soporta gps");
    }
}

function mostrarUbicacion(position) {
    lat = position.coords.latitude;
    long = position.coords.longitude;
    latlngUsr = L.latLng(lat, long);
    let radioUsr = dqs("radioInput").value;
    if (!ValidarRadio(radioUsr)) {
        MensajeAlertaInfo("Error", "Ingrese un valor mayor a 0");
        MAPA.style.display = "none";
    } else if (typeof (map) == "object") {
        map = map.remove();
        CrearMapa(radioUsr);
    } else { CrearMapa(radioUsr); }
}

function CrearMapa(radioUsr) {
    if (!navigator.onLine) {
        MensajeAlertaInfo("Error", "Verifique su conexion a internet");
        MAPA.style.display = "none";
    } else {
        MAPA.style.display = "block";
        map = L.map('map').setView([lat, long], 17);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 15,
            minZoom: 7
        }).addTo(map);
        var circle = L.circle([lat, long], {
            color: 'green',
            fillColor: '#00FF00',
            fillOpacity: 0.2,
            radius: radioUsr
        }).addTo(map);
        L.marker([lat, long]).addTo(map).bindPopup('<strong>Usted </strong><br><span>Esta es su ubicacion</span>').openPopup();
        fetchCajeros(radioUsr);
    }
}

/////////////////////////////// COMPARTIR   ////////////////

function Compartir() {
    Capacitor.Plugins.Share.share({
        title: 'Enviar',
        text: 'Compartir Dwallet con contactos',
        url: 'https://dwallet.develotion.com/site/',
        dialogTitle: 'Gracias por compartir'
    })
}

///////////////////////////////   LOG OUT

function LogOut() {
    CerrarMenu();
    usuarioLogueado = false;
    localStorage.clear();
    MenuOpciones();
    ToInicio();
}