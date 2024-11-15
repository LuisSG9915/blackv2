// Generated by https://quicktype.io

export interface Cliente {
    id_cliente:         number;
    nombre:             string;
    domicilio:          string;
    ciudad:             string;
    estado:             string;
    colonia:            string;
    cp:                 string;
    rfc:                string;
    telefono:           string;
    email:              string;
    nombre_fiscal:      string;
    suspendido:         boolean;
    sucursal_origen:    number;
    num_plastico:       string;
    suc_asig_plast:     number;
    fecha_asig_plast:   string;
    usr_asig_plast:     string;
    plastico_activo:    boolean;
    fecha_nac:          string;
    correo_factura:     string;
    regimenFiscal:      string;
    claveRegistroMovil: string;
    fecha_alta: string
    fecha_act: string  
    //se agregaron 06-09-2023
    redsocial1:string;
    redSocial1?: string;
    redsocial2:string;
    redsocial3: string;
    recibirCorreo : false;
}
