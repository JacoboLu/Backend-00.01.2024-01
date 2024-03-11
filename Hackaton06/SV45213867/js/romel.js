class Telefono {
    constructor(numeroSerie, imei, marca, reportado) {
        this.numeroSerie = numeroSerie;
        this.imei = imei;
        this.marca = marca;
        this.reportado = reportado;
        this.diagnostico = null;
        this.autorizacion = false;
        this.abono = 0;
        this.reparacion = {
            repuestos: [],
            estado: 'En revisión',
            estacionTrabajo: 'Estación de revisión'
        };
    }

    asignarDiagnostico(diagnostico) {
        this.diagnostico = diagnostico;
    }

    darAutorizacion(abono) {
        if (this.autorizacion) {
            alert("El usuario ya ha dado autorización.");
            return;
        }

        if (abono >= 0.5 * this.reparacionCosto()) {
            this.abono = abono;
            this.autorizacion = true;
            alert("Autorización recibida. El servicio puede continuar.");
        } else {
            alert("El abono no cumple con el 50% requerido.");
        }
    }

    reparacionCosto() {
        return 100; // Ejemplo: costo fijo de $100
    }

    guardarEnWebStorage() {
        sessionStorage.setItem(this.numeroSerie, JSON.stringify(this));
    }

    static cargarDesdeWebStorage(numeroSerie) {
        const storedTelefono = sessionStorage.getItem(numeroSerie);
        if (storedTelefono) {
            const telefonoObj = JSON.parse(storedTelefono);
            const telefono = new Telefono(
                telefonoObj.numeroSerie,
                telefonoObj.imei,
                telefonoObj.marca,
                telefonoObj.reportado
            );
            telefono.diagnostico = telefonoObj.diagnostico;
            telefono.autorizacion = telefonoObj.autorizacion;
            telefono.abono = telefonoObj.abono;
            telefono.reparacion = telefonoObj.reparacion;
            return telefono;
        }
        return null;
    }
}

class Diagnostico {
    constructor(descripcion) {
        this.descripcion = descripcion;
    }
}

function agregarTelefono() {
    const numeroSerie = document.getElementById("numeroSerie").value;
    const telefonoExistente = Telefono.cargarDesdeWebStorage(numeroSerie);

    if (telefonoExistente) {
        alert("¡Atención! Este teléfono ya está registrado.");
        return;
    }

    const imei = document.getElementById("imei").value;
    const marca = document.getElementById("marca").value;
    const reportado = document.getElementById("reportado").value === "si";

    const telefono = new Telefono(numeroSerie, imei, marca, reportado);

    if (telefono.reportado) {
        alert("¡Atención! Este teléfono está reportado. Se llamará a la policía.");
        return;
    }

    const primerDiagnosticoDescripcion = document.getElementById("primerDiagnostico").value;
    const abono = parseFloat(document.getElementById("abono").value);

    const primerDiagnostico = new Diagnostico(primerDiagnosticoDescripcion);

    telefono.asignarDiagnostico(primerDiagnostico);
    telefono.darAutorizacion(abono);

    // Guardar el teléfono en el Web Storage (sessionStorage)
    telefono.guardarEnWebStorage();

    // Mostrar el teléfono en la tabla
    mostrarTelefonoEnTabla(telefono);
}

function mostrarTelefonoEnTabla(telefono) {
    const tablaTelefonosBody = document.getElementById("tablaTelefonosBody");
    const fila = document.createElement("tr");
    fila.innerHTML = `
                <td>${telefono.numeroSerie}</td>
                <td>${telefono.imei}</td>
                <td>${telefono.marca}</td>
                <td>${telefono.diagnostico ? telefono.diagnostico.descripcion : 'Pendiente'}</td>
                <td>${telefono.reparacion.estado}</td>
                <td>${telefono.abono}</td>
            `;
    tablaTelefonosBody.appendChild(fila);
}
