////////////////   GENERALES

function MenuOpciones() {
    dqs('menuOpciones').innerHTML = "";
    let token = localStorage.getItem('apikey');
    if (!token) {
        dqs('menuOpciones').innerHTML = `
            <ion-item href="/" onclick="CerrarMenu()"> Inicio </ion-item>
            <ion-item href="/login" onclick="CerrarMenu()"> Ingresar </ion-item>
            <ion-item href="/registro" onclick="ToRegistrarse()"> Registro </ion-item>
            `
    } else {
        dqs('menuOpciones').innerHTML = `
            <ion-item href="/" onclick="CerrarMenu()"> Inicio </ion-item>
            <ion-item href="/realizarmovimientos" onclick="CerrarMenu()"> Realizar movimientos </ion-item>
            <ion-item href="/listarmovimientos" onclick="CerrarMenu()"> Listar movimientos </ion-item>
            <ion-item href="/cajeros" onclick="CerrarMenu()"> Cajeros cercanos </ion-item>
            <ion-item href="/compartir" onclick="CerrarMenu()"> Compartir </ion-item>
            <ion-item href="/" onclick="MensajeAlertaDecision('¿Seguro que desea Cerrar sesión?','logout')">
                Cerrar sesion </ion-item>
            `
    }
}

function OcultarTodo() {
    INICIO.style.display = "none";
    LOGIN.style.display = "none"
    REGISTRO.style.display = "none";
    REAMOV.style.display = "none";
    LISMOV.style.display = "none";
    CAJEROS.style.display = "none";
    COMPARTIR.style.display = "none";
    MAPA.style.display = "none";
}

function LimpiarDatos() {
    dqs("pTxtAgregarMovimiento").innerHTML = "";
    dqs("regUsuario").value = "";
    dqs("regPassword").value = "";
    dqs('pTxtRegistro').innerHTML = "";
    dqs("usuario").value = "";
    dqs('password').value = "";
    dqs('pTxtLogin').innerHTML = "";
    dqs("pTxtListado").innerHTML = "";
    dqs("radioInput").value = "";
    dqs("sclDepto").value = "";
    if (document.getElementById('concepto') != null) {
        dqs('concepto').value = "";
        dqs('slcRubro').value = "";
        dqs('slcMedio').value = "";
        dqs('total').value = "";
        dqs('date').value = "";
    }
}

function MensajeAlertaDecision(msj, tipo, id) {
    alertaDecision.header = msj;
    alertaDecision.cssClass = 'custom-alert';
    alertaDecision.buttons = [
        {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'alert-button-cancel',
            handler: () => MensajeAlertaInfo('Alerta', 'La accion fue cancelada')
        },
        {
            text: "Confirmar",
            role: 'confirm',
            cssClass: 'alert-button-confirm',
            handler: () => Decision(tipo, id)
        }
    ];
    document.body.appendChild(alertaDecision);
    alertaDecision.present();
}

function Decision(tipo, id) {
    switch (tipo) {
        case "logout": LogOut(); break;
        case "eliminarGasto": FetchEliminarMovimiento(id); break;
        case 'agregarMov': AgregarMovimiento(); break;
    }
}

function MensajeAlertaInfo(titulo, mensaje) {
    CerrarMenu();
    alertaInformacion.cssClass = 'custom-alert';
    alertaInformacion.header = titulo;
    alertaInformacion.message = mensaje;
    alertaDecision.buttons = ["Confirmar"];
    document.body.appendChild(alertaInformacion);
    alertaInformacion.present();
}

async function MostrarLoading() {
    LOADING.message = "Cargando...";
    LOADING.duration = 0;
    LOADING.cssClass = 'custom-loading';
    document.body.appendChild(LOADING);
    await LOADING.present();
}

////////////////   REGISTRO

function CargarDeptos(departamentos) {
    for (let depto of departamentos) {
        dqs('sclDepto').innerHTML += `
           <ion-select-option value = ${depto.id}> ${depto.nombre}</ion-select-option>`
    }
    LOADING.dismiss();
}

function CargarLocalidades(localidades) {
    if (localidades !== undefined) {
        MostrarLoading();
        dqs("mostrarCuidades").style.display = "block";
        dqs('sclCiudad').innerHTML = "";
        for (let localidad of localidades) {
            dqs('sclCiudad').innerHTML += `
           <ion-select-option value = ${localidad.id}>${localidad.nombre}</ion-select-option>`
        }
    }
    LOADING.dismiss();
}

////////////////   MOVIMIENTOS

function TipoMovimiento() {
    let tipo = dqs('slcTipoMovimiento').value;
    dqs("cargaMovimiento").style.display = "block";

    const inputsMovimientoTop = `<br/>
                    <ion-item lines='none'><ion-label for="concepto" >Concepto</ion-label></ion-item>
                    <ion-item><ion-input type="text" id="concepto" placeholder="Ingrese"> </ion-input></ion-item>
                    <ion-item><ion-label for="slcRubro">Rubro</ion-label>
                        <ion-select interface="popover" placeholder="Seleccione" id="slcRubro">
                    </ion-item>`;

    const inputsMovimientoBottom = `
                    <ion-item lines='none'><ion-label for="total">Total</ion-label></ion-item>
                    <ion-item><ion-input type="number" id="total" placeholder="Ingrese"></ion-input></ion-item>
                    <ion-item lines='none'><ion-label for="date">Fecha de Gasto</ion-label></ion-item>
                    <ion-item lines='none'><ion-datetime presentation="date" prefer-wheel="true" id="date"></ion-datetime></ion-item>`


    if (tipo == "egreso") {
        dqs("btnAgregarMovimiento").style.display = "block";
        dqs('cargaMovimiento').innerHTML =`
            ${inputsMovimientoTop}
                 <ion-item>
                    <ion-label for="slcMedio">Medio</ion-label>
                    <ion-select interface="popover" placeholder="Seleccione" id="slcMedio">
                        <ion-select-option value='efectivo'> Efectivo </ion-select-option>
                        <ion-select-option value='debito'> Debito </ion-select-option>
                        <ion-select-option value='credito'> Credito </ion-select-option>
                    </ion-select>
                </ion-item><br/>
             ${inputsMovimientoBottom}`;
    } else if (tipo == 'ingreso') {
        dqs("btnAgregarMovimiento").style.display = "block";
        dqs('cargaMovimiento').innerHTML = `
            ${inputsMovimientoTop} 
             <ion-item>
                <ion-label for="slcMedio">Medio</ion-label>
                <ion-select interface="popover" placeholder="Seleccione" id="slcMedio">
                    <ion-select-option value='Efectivo'> Efectivo </ion-select-option>
                    <ion-select-option value='Banco'> Deposito </ion-select-option>    
                </ion-select>
             </ion-item><br/>
            ${inputsMovimientoBottom}`
    }
    CargarEventSelect('sclRubro');
    ListadoRubros(tipo);
}

function Rubro(rubros) {
    //funcion para agregar movimientos
    dqs('pTxtAgregarMovimiento').innerHTML = "";
    for (let item of rubros) {
        dqs('slcRubro').innerHTML += `
            <ion-select-option value=${item.id} > ${item.nombre} </ion-select-option>`
    }
    LOADING.dismiss();
}

function CargaTablaMovimientos
    (banderaEgreso, banderaIngreso, movimientoEgreso, movimientoIngreso, movimientos, gastos, ingresos) {
    //si los gastos o ingresos son ceros o el movimiento general es cero,
    //se borra la tabla que muestra el detalle de los movimientos o se despliega
    //la tabla con los datos
    if (banderaEgreso && movimientoEgreso.length == 0 ||
        banderaIngreso && movimientoIngreso.length == 0 ||
        movimientos.length == 0) {
        dqs('msjMovimiento').innerHTML = "";
        dqs("tablaMovimientos").innerHTML = "";
        dqs("pTxtListado").innerHTML = "No existen movimientos a detallar";
    } else {
        dqs('msjMovimiento').innerHTML = 'Los movimientos se listan por fecha ascendente';
        dqs("tablaMovimientos").innerHTML = "";
        for (let movimiento of InfoOrdenada(movimientos, 'fecha')) {
            dqs('tablaMovimientos').innerHTML += `
                <ion-list>
                  <ion-item-group>
                    <ion-item-divider>
                      <ion-label color="tertiary">${movimiento.tipo.toUpperCase()}</ion-label>
                    </ion-item-divider>
                    <ion-item>
                      <ion-label>Fecha: ${movimiento.fecha}</ion-label>
                    </ion-item>
                    <ion-item>
                      <ion-label>Concepto: ${movimiento.concepto}</ion-label>
                    </ion-item>
                    <ion-item >
                      <ion-label>Categoria: ${movimiento.categoria}</ion-label>
                    </ion-item>
                    <ion-item >
                      <ion-label>Medio: ${movimiento.medio}</ion-label>
                    </ion-item>
                     <ion-item >
                      <ion-label>Monto: ${movimiento.total}</ion-label>
                    </ion-item>
                    <ion-item>
                      <button style="color:red" onclick = "MensajeAlertaDecision('Esta seguro que desea eliminar el movimiento', 'eliminarGasto', id=${movimiento.id})">
                             ELIMINAR </button>
                    </ion-item>
                  </ion-item-group>
                </ion-list>`
        }
    }
    //esto muestra el balance general de la cuenta
    let balanceGeneral = ingresos - gastos;
    dqs("mostrarBalanceGeneralP").innerHTML = "";
    dqs("mostrarBalanceGeneralN").innerHTML = "";
    if (balanceGeneral >= 0) {
        dqs("mostrarBalanceGeneralP").innerHTML = balanceGeneral;
    } else {
        dqs("mostrarBalanceGeneralN").innerHTML = balanceGeneral;
    }
    dqs('mostrarIngresoTotal').innerHTML = ingresos;
    dqs('mostrarGastoTotal').innerHTML = gastos;
    LOADING.dismiss();
}

