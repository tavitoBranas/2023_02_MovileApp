///////////////////   LOGIN

function Login(user) {
    if (!navigator.onLine) { MensajeAlertaInfo("Error", "Verifique su conexion a internet") }
    else {
        MostrarLoading();
        fetch(`${urlBaseAPI}login.php`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            }).then(function (response) {
                return response.json();
            }).then(function (info) {
                if (info.codigo == 200) {
                    LOADING.dismiss();
                    OcultarTodo();
                    localStorage.setItem("apikey", info.apiKey);
                    localStorage.setItem("usuario", user.usuario);
                    localStorage.setItem("id", Number(info.id))
                    usuarioLogueado = true;
                    MenuOpciones();
                    document.getElementById("usuario").value = "";
                    document.getElementById("password").value = "";
                    INICIO.style.display = "block";
                    dqs('msjBienvenida').innerHTML = `Bienvenid@ ${localStorage.getItem('usuario')}`;
                } else {
                    LOADING.dismiss();
                    MensajeAlertaInfo("Error", info.mensaje);
                }
            }).catch(function (error) {
                LOADING.dismiss();
                MensajeAlertaInfo("Error", error); 
            })
    }
}

///////////////////   REGISTRO

//obtencion de departamentos

const FetchDepartamentos = async () => {
    if (!navigator.onLine) { MensajeAlertaInfo("Error", "Verifique su conexion a internet") }
    else {
        try {
            MostrarLoading()
            const call = await fetch(`${urlBaseAPI}departamentos.php`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
            const response = await call.json();
            if (response.codigo == 200) {
                const { departamentos } = response;
                CargarDeptos(InfoOrdenada(departamentos, 'localidad'));
            } else {
                LOADING.dismiss();
                MensajeAlertaInfo("Error", response.mensaje);
            }
        }
        catch (error) {
            LOADING.dismiss();
            MensajeAlertaInfo("Error", error); 
        }
    }
}

//obtencion de localidades

function FetchLocalidades(evento) {
    if (!navigator.onLine) { MensajeAlertaInfo("Error", "Verifique su conexion a internet") }
    else {
        MostrarLoading();
        let id = evento.detail.value;
        fetch(`${urlBaseAPI}ciudades.php?idDepartamento=${id}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            }).then(function (response) {
                return response.json();
            }).then(function (info) {
                if (info.codigo == 200) {
                    CargarLocalidades(InfoOrdenada(info.ciudades, 'localidad'));
                } else {
                    LOADING.dismiss();
                    MensajeAlertaInfo("Error", info.mensaje);
                }
            }).catch(function (error) {
                LOADING.dismiss();
                MensajeAlertaInfo("Error", error); 
            })
    }
}

//registro de usuarios

function Registro(usuario) {
    if (!navigator.onLine) { MensajeAlertaInfo("Error", "Verifique su conexion a internet") }
    else {
        MostrarLoading();
        fetch(`${urlBaseAPI}usuarios.php`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usuario)
            }).then(function (response) {
                return response.json();
            }).then(function (info) {
                if (info.codigo == 200) {
                    LOADING.dismiss();
                    MensajeAlertaInfo("Registro exitoso", "Ingrese para continuar");
                    ToInicio();
                } else {
                    LOADING.dismiss();
                    MensajeAlertaInfo("Error", info.mensaje);
                }
            }).catch(function (error) {
                LOADING.dismiss();
                MensajeAlertaInfo("Error", error); 
            })
    }
}

///////////////////   MOVIMIENTOS

function ListadoRubros(tipoBusqueda, optionalArray, tipoMovimiento) {
    let rubroGasto = [];
    let rubroIngreso = [];
    if (!navigator.onLine) { MensajeAlertaInfo("Error", "Verifique su conexion a internet") }
    else if (localStorage.getItem('apikey')) {
        fetch(`${urlBaseAPI}rubros.php`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': localStorage.getItem('apikey')
                },
            }).then(function (response) {
                return response.json();
            }).then(function (info) {
                if (info.codigo == 200) {
                    for (let item of info.rubros) {
                        if (item.tipo == "gasto") {
                            rubroGasto.push(item)
                        } else {
                            rubroIngreso.push(item)
                        }
                    }
                    //aca envia la info de rubros para cargar movimientos
                    if (tipoBusqueda == "egreso") { Rubro(rubroGasto); }
                    else if (tipoBusqueda == "ingreso") { Rubro(rubroIngreso); }
                    //aca cataloga gastos para mostrar en el Listado de movimientos
                    else if (tipoBusqueda == 'catalogar') {
                        Catalogar(rubroGasto, rubroIngreso, optionalArray, tipoMovimiento);
                    }
                } else {
                    LOADING.dismiss();
                    MensajeAlertaInfo("Error", info.mensaje);
                }
            }).catch(function (error) {
                LOADING.dismiss();
                MensajeAlertaInfo("Error", error); 
            })

    } else {
        MensajeAlertaInfo("Error", "No existe usuario registrado. Por favor ingrese al sistema");
        Inicio();
    }
}

function FetchAgregarMovimiento(movimiento) {
    if (!navigator.onLine) { MensajeAlertaInfo("Error", "Verifique su conexion a internet") }
    else if (localStorage.getItem('apikey')) {
        MostrarLoading();
        fetch(`${urlBaseAPI}movimientos.php`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': localStorage.getItem('apikey')
                },
                body: JSON.stringify(movimiento)
            }).then(function (response) {
                return response.json();
            }).then(function (info) {
                if (info.codigo == 200) {
                    LOADING.dismiss();
                    LimpiarDatos();
                    Navegar('/realizarmovimientos');
                    MensajeAlertaInfo("Transaccion exitosa", "Movimiento agregado correctamente");
                } else {
                    LOADING.dismiss();
                    MensajeAlertaInfo("Error", info.mensaje);
                }
            }).catch(function (error) {
                LOADING.dissmiss();
                MensajeAlertaInfo("Error", error); 
            })
    } else {
        MensajeAlertaInfo("Error", "No existe usuario registrado. Por favor ingrese al sistema");
        Inicio();
    }
}

function FetchListadoMovimientos(tipo) {
    if (!navigator.onLine) { MensajeAlertaInfo("Error", "Verifique su conexion a internet") }
    else if (localStorage.getItem('apikey')) {
        MostrarLoading();
        fetch(`${urlBaseAPI}movimientos.php?idUsuario=${localStorage.getItem('id')}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': localStorage.getItem('apikey')
                },
            })
            .then(function (response) {
                return response.json();
            }).then(function (movimientos) {
                if (movimientos.codigo == 200) {
                    ListadoRubros('catalogar', movimientos, tipo);
                }
                else {
                    LOADING.dismiss();
                    MensajeAlertaInfo("Error", movimientos.mensaje);
                }
            }).catch(function (error) {
                LOADING.dismiss();
                MensajeAlertaInfo("Error", error); 
            })
    } else {
        MensajeAlertaInfo("Error", "No existe usuario registrado. Por favor ingrese al sistema");
        Inicio();
    }
}

function FetchEliminarMovimiento(id) {
    if (!navigator.onLine) { MensajeAlertaInfo("Error", "Verifique su conexion a internet") }
    else if (localStorage.getItem('apikey')) {
        MostrarLoading();
        let contenidoBody = { "idMovimiento": Number(id) };
        fetch(`${urlBaseAPI}movimientos.php`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': localStorage.getItem('apikey')
                },
                body: JSON.stringify(contenidoBody)
            }).then(function (response) {
                return response.json();
            }).then(function (respuesta) {
                if (respuesta.codigo == 200) {
                    LOADING.dismiss();
                    MensajeAlertaInfo("Transaccion exitosa", "Movimiento eliminado correctamente");
                    FetchListadoMovimientos();
                    dqs('slcFiltro').value = 'total';
                }
                else {
                    LOADING.dismiss();
                    MensajeAlertaInfo("Error", respuesta.mensaje)
                }
            }).catch(function (error) {
                LOADING.dismiss();
                MensajeAlertaInfo("Error", error); 
            })
    } else {
        MensajeAlertaInfo("Error", "No existe usuario registrado. Por favor ingrese al sistema");
        Inicio();
    }
}

///////////////////   CAJEROS

function fetchCajeros(radio) {
    if (!navigator.onLine) { MensajeAlertaInfo("Error", "Verifique su conexion a internet") }
    else {
        MostrarLoading();
        fetch(urlObtenerCajeros, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(function (response) {
            if (response.status == 200) {
                return response.json();
            }
        }).then(function (infoCajeros) {
            let listaCajeros = infoCajeros.cajeros;
            let depositos;
            let pesos;
            let dolares;
            let tipoCajero;
            for (let cajero of listaCajeros) {
                latlngCajero = L.latLng(cajero.latitud, cajero.longitud);
                if (cajero.disponible != 0 && latlngUsr.distanceTo(latlngCajero) <= radio) {
                    if (cajero.pos == 1) { tipoCajero = "Pos" } else { tipoCajero = "Cajero" }
                    if (cajero.depositos == 1) { depositos = "Acepta depositos"; } else { depositos = "No acepta depositos"; }
                    if (cajero.tienePesos == 1) { pesos = "Puede retirar pesos"; } else { pesos = "No permite retirar pesos"; }
                    if (cajero.tieneDolares == 1) { dolares = "Puede retirar dolares"; } else { dolares = "No permite retirar dolares"; }
                    L.marker([`${cajero.latitud}`, `${cajero.longitud}`])
                        .addTo(map)
                        .bindPopup(`<strong> ${tipoCajero} ${cajero.idCajero}</strong><br><span>${depositos}</span><br><span>${pesos}</span><br><span>${dolares}</span>`)
                }
            }
            LOADING.dismiss();
            MensajeAlertaInfo('Detalle', `Se muestran los Cajeros y Pos disponibles en un radio de ${radio} metros`);
        })
        .catch (function (error) {
            LOADING.dismiss();
            MAPA.style.display = "none";
            MensajeAlertaInfo("Error", error); 
        })
    }
}

// IMPORTANTE
//navigator.onLine ONLY APPLIES TO BROWSER
//Como alternativa se podria emplear esta logica para testear internet en android
//if (error == "TypeError: Failed to fetch") {
//    MensajeAlertaInfo("Error", "Verifique conexion a internet");
//} else { MensajeAlertaInfo("Error", error); } 
