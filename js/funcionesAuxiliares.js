function Inicio() {
    OcultarTodo();
    ToInicio();
    Eventos();
    Precarga();
}

function Eventos() {
    ROUTER.addEventListener("ionRouteDidChange", Navegar);
    dqs('sclDepto').addEventListener('ionChange', FetchLocalidades);
    MenuOpciones();
    //funcionalidades
    dqs("btnRegistrar").addEventListener('click', TomarDatosRegistro);
    dqs("btnLoguear").addEventListener('click', TomarDatosLogin);
    dqs('slcFiltro').addEventListener('ionChange', ModificarListado);
    dqs('slcTipoMovimiento').addEventListener('ionChange', TipoMovimiento);
    dqs("btnAgregarMovimiento").addEventListener('click', ConsultaAgregarMov);
    dqs("btnBusqueda").addEventListener('click', BusquedaCajero);
    dqs("btnCompartir").addEventListener('click', Compartir);
}

function Navegar(event) {
    OcultarTodo();
    LimpiarDatos();
    let ruta;
    if (typeof (event) != 'string') { ruta = event.detail.to; } else { ruta = event;  }
    switch (ruta) {
        case "/": INICIO.style.display = "block"; break;
        case "/login": LOGIN.style.display = "block"; break;
        case "/registro": ToRegistrarse(); break;
        case "/realizarmovimientos": REAMOV.style.display = "block"; dqs('slcTipoMovimiento').value = ""
            dqs("cargaMovimiento").style.display = "none"; dqs('pTxtAgregarMovimiento').innerHTML = "";
            dqs("btnAgregarMovimiento").style.display = "none"; break;
        case "/listarmovimientos": LISMOV.style.display = "block"; ModificarListado("total"); break;
        case "/cajeros": OcultarTodo(); CAJEROS.style.display = "block"; LimpiarDatos(); break;
        case "/compartir": COMPARTIR.style.display = "block"; break;
    }
}

function CerrarMenu() {
    MENU.close();
}

function dqs(id) {
    return document.querySelector('#' + id)
}

function InfoOrdenada(array, datoAcomparar) {
    if (datoAcomparar == 'fecha') {
        array.sort((dato1, dato2) => new Date(Date.parse(dato1.fecha)) - new Date(Date.parse(dato2.fecha)))
    } else if (datoAcomparar == 'localidad') {
        array.sort((dato1, dato2) => dato1.nombre.localeCompare(dato2.nombre))
    }
    return array;
}

function Catalogar(rubroGastos, rubroIngresos, movimientos, tipoMovimiento) {
    for (let itemRubro of rubroGastos) {
        for (let itemMovimiento of movimientos.movimientos) {
            if (itemMovimiento.categoria == itemRubro.id) {
                itemMovimiento.tipo = "Egreso";
                itemMovimiento.categoria = itemRubro.nombre;
            }
        }
    }
    for (let itemRubro of rubroIngresos) {
        for (let itemMovimiento of movimientos.movimientos) {
            if (itemMovimiento.categoria == itemRubro.id) {
                itemMovimiento.tipo = itemRubro.tipo;
                itemMovimiento.categoria = itemRubro.nombre;
            }
        }
    }
    PreCargaMovimientos(movimientos, tipoMovimiento);
}

function PreCargaMovimientos(movimientosCatalogados, tipoMovimiento) {
    const { movimientos } = movimientosCatalogados;
    const { gastos, ingresos } = MontoTotal(movimientos);
    LimpiarDatos();
    let movimientoEgreso = [];
    let movimientoIngreso = [];
    let banderaEgreso = false;
    let banderaIngreso = false;
    //genero arreglo de gastos o ingresos segun se solicite a partir de los movimientos totales
    if (tipoMovimiento == "egresos") {
        banderaEgreso = true;
        for (let movimiento of movimientos) {
            if (movimiento.tipo == "Egreso") {
                movimientoEgreso.push(movimiento);
            }
        }
    } else if (tipoMovimiento == "ingresos") {
        banderaIngreso = true;
        for (let movimiento of movimientos) {
            if (movimiento.tipo == "ingreso") {
                movimientoIngreso.push(movimiento)
            }
        }
    }
    //si se piden gastos o ingresos, se vacia el array que ingresa por parametros
    //y se agregan los gastos o ingresos segun se solicite
    if (movimientoEgreso.length != 0) {
        movimientos.length = 0;
        for (let item of movimientoEgreso) {
            movimientos.push(item)
        }
    } else if (movimientoIngreso.length != 0) {
        movimientos.length = 0;
        for (let item of movimientoIngreso) {
            movimientos.push(item)
        }
    }
    CargaTablaMovimientos(banderaEgreso, banderaIngreso, movimientoEgreso, movimientoIngreso, movimientos, gastos, ingresos);
}

function ModificarListado(evento) {
    let tipo = evento;
    if (evento != "total") { tipo = evento.detail.value }
    if (tipo == 'egresos') {
        FetchListadoMovimientos('egresos');
    } else if (tipo == 'ingresos') {
        FetchListadoMovimientos('ingresos');
    } else {
        FetchListadoMovimientos("total");
    }
}

function MontoTotal(movimientos) {
    //permite calcular el balance general de la cuenta
    let gastos = 0;
    let ingresos = 0;
    let _aux = {};
    movimientos.forEach(movimiento => {
        if (movimiento.tipo == "Egreso") {
            gastos += movimiento.total
        } else {
            ingresos += movimiento.total
        }
    })
    _aux.gastos = gastos;
    _aux.ingresos = ingresos;
    return _aux;
}

function CargarEventSelect(msj) {
    //cuando se crea el select del agregar movimiento, el select tiene valor nulo
    //por eso solo se llama al aEL cuando el valor del select != null para que no 
    //exista alarma
    switch (msj) {
        case 'sclRubro': if (document.getElementById('sclRubro') != null) {
            dqs("slcRubro").addEventListener('ionChange', ListadoRubros)}; break;
    }
}