////////////////   LOGIN

function Validar_Ingresar(usuario, password) {
    if (usuario == "" || password == "") {
        MensajeAlertaInfo("Error", 'Alguno de los datos se encuentra vacio. Verifique');
    } else {
        usuario.toLowerCase();
        let user = new LoginDTO(usuario, password);
        Login(user);
    }
}

////////////////   REGISTRO

function Validar_Registrar(usuario, password, departamento, ciudad) {
    if (usuario == "" || password == "" || departamento == "" || ciudad == "") {
        MensajeAlertaInfo("Error", 'Alguno de los datos se encuentra vacio. Verifique');
    } else if (password.length < 6) {
        MensajeAlertaInfo("Error", "El password debe de contener al menos 6 caracteres");
    } else {
        let usu = new Usuario(usuario, password, departamento, ciudad);
        Registro(usu);
    }
}

////////////////   MOVIMIENTOS

function Validar_Ingresar_Movimiento(id, concepto, rubro, medio, total, fecha) {
    if (concepto == "" || rubro == "" || medio == "" || total == 0 || total == "") {
        MensajeAlertaInfo("Error", "Verifique haber ingresado todos los datos");
    } else if (!Validar_Fecha(fecha)) {
        MensajeAlertaInfo("Error", "Verifique haber ingresado una fecha igual o anterior a la actual");
    } else {
        let movimiento = new Movimiento(Number(id), concepto, Number(rubro), medio, total, fecha);
        FetchAgregarMovimiento(movimiento);
    }
}

function Validar_Fecha(date) {
    var fIng = new Date(date)
    if (fIng > Date.now()) { return false } else { return true; }  
}

////////////////   CAJEROS

function ValidarRadio(radioUsr) {
    if (radioUsr == "" || radioUsr <= 0) { return false } else { return true }
}
