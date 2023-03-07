class Usuario{
    constructor(usr, pass, idDep, idCiudad){
        this.usuario = usr;
        this.password = pass;
        this.idDepartamento = idDep;
        this.idCiudad = idCiudad;

    }
}

class LoginDTO{
    constructor(u,p){
        this.usuario=u;
        this.password=p;
    }
}

class Movimiento {
    constructor(id, concepto, rubro, medio, total, fecha) {
        this.idUsuario = id;
        this.concepto = concepto;
        this.categoria = rubro;
        this.total = total;
        this.medio = medio;
        this.fecha = fecha;
    }
}

