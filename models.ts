
export interface Login {
    email: string;
    password: string;
}

export interface Register {
    nombre: string;
    apellido: string;
    email: string;
    password: string
}
export interface Confirmacion {
    anyo : number;
    mes  : number;
    dia  : number;
    hora : number;
    minutos: number
    usuariocitado:number;
}

export interface Citar{
    anyo : number;
    mes  : number;
    dia  : number;
    hora : number;
    idUsuario: number
    // minutos: number
    // usuariocitado:string;
    // email:string;
    // password:string

    
}




