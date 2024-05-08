// Inicializar Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBIXlgOct2UzkrZbZYbyHu6_NbLDzTqqig",
  authDomain: "despachos-novogar.firebaseapp.com",
  databaseURL: "https://despachos-novogar-default-rtdb.firebaseio.com",
  projectId: "despachos-novogar",
  storageBucket: "despachos-novogar.appspot.com",
  messagingSenderId: "346020771441",
  appId: "1:346020771441:web:c4a29c0db4200352080dd0",
  measurementId: "G-64DDP7D6Q2"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Función para cambiar el foco al siguiente input o resetear al primero
function nextInput(event, id) {
  if (event.key === "Enter") { // Si se presiona la tecla Enter
    event.preventDefault(); // Detener el comportamiento predeterminado del formulario
    
    const inputEtiqueta = document.getElementById("inputEtiqueta");
    const inputBulto = document.getElementById("inputBulto");
    const numEtiqueta = inputEtiqueta.value.trim(); // Obtener el valor del input y eliminar espacios en blanco
    const numBulto = inputBulto.value.trim(); // Obtener el valor del input y eliminar espacios en blanco
    
    if (id === "inputEmail") { // Si el foco está en el último input (email)
      document.getElementById("formulario").reset();
      document.getElementById("inputCliente").focus(); // Reiniciar el formulario y colocar el foco en el primer input (cliente)
    } else {
      if (id === "inputEtiqueta") { // Si el foco está en el input de etiqueta
        if (numEtiqueta.startsWith("36")) { // Si el número de etiqueta comienza con "36"
          inputBulto.value = "1"; // Colocar automáticamente "1" en el input de bulto
          document.getElementById("inputRemito").focus(); // Colocar el foco en el input de remito
          return; // Salir de la función, evitando el resto de las validaciones
        } else {
          const ultimoDigito = numEtiqueta.slice(-2); // Obtener los últimos dos dígitos del número de etiqueta
          if (!isNaN(ultimoDigito)) { // Si los últimos dos dígitos son numéricos
            inputBulto.value = parseInt(ultimoDigito); // Colocar el valor numérico en el input de bulto
          }
        }
      }

      if (!numBulto) { // Si el campo de bulto está vacío
        alert("Por favor, ingrese el número de bulto."); // Mostrar mensaje de alerta
        return; // Salir de la función
      }

      if (id === "inputBulto") { // Si el foco está en el input de bulto
        document.getElementById("inputRemito").focus(); // Colocar el foco en el input de remito
      } else {
        document.getElementById(id).focus(); // Colocar el foco en el siguiente input
      }
    }
  }
}

// Agregar un evento de escucha para el formulario en su conjunto
document.getElementById("formulario").addEventListener("keypress", function(event) {
  nextInput(event, event.target.id); // Llamar a la función nextInput cuando se presione una tecla en el formulario
});


// Función para cargar datos en Firebase y agregar a la tabla
function cargarDatos() {
  const fechaHora = new Date().toLocaleString();
  const numEtiqueta = document.getElementById("inputEtiqueta").value;
  const numBulto = document.getElementById("inputBulto").value;
  const numCliente = document.getElementById("inputCliente").value;
  const numRemito = document.getElementById("inputRemito").value;
  const email = document.getElementById("inputEmail").value;

  if (fechaHora && numCliente && numBulto && numRemito && numEtiqueta && email) {
    const nuevaEntradaRef = database.ref('registros').push();
    nuevaEntradaRef.set({
      numEtiqueta: numEtiqueta,
      numBulto: numBulto,
      fechaHora: fechaHora,
      numCliente: numCliente,
      numRemito: numRemito,
      email: email
    }).then(() => {
      console.log("Datos guardados correctamente.");
      // Limpiar campos después de guardar
      document.getElementById("formulario").reset();
      document.getElementById("inputCliente").focus();
    }).catch(error => {
      console.error("Error al guardar datos:", error);
    });
  } else {
    console.error("Los campos no pueden estar vacíos.");
  }
}

// Función para obtener los registros desde Firebase y mostrar en la tabla con paginación
function cargarRegistrosPaginacion(page) {
  const registrosRef = database.ref('registros');
  registrosRef.limitToLast(5 * page).once('value', function(snapshot) {
    const registros = snapshot.val();
    const paginatedRegistros = Object.entries(registros).reverse().slice(0, 5); // Obtener los últimos 5 registros
    document.getElementById("tablaBody").innerHTML = "";
    paginatedRegistros.forEach(([key, data]) => {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${data.fechaHora}</td><td>${data.numEtiqueta}</td><td>${data.numBulto}</td><td>${data.numCliente}</td><td>${data.numRemito}</td><td>${data.email}</td>`;
      document.getElementById("tablaBody").appendChild(row);
    });

    // Paginación
    const totalPages = Math.ceil(Object.keys(registros).length / 5);
    document.getElementById("pagination").innerHTML = "";
    for (let i = 1; i <= totalPages; i++) {
      const li = document.createElement("li");
      li.className = `page-item ${page === i ? 'active' : ''}`;
      li.innerHTML = `<a class="page-link" href="#" onclick="cargarRegistrosPaginacion(${i})">${i}</a>`;
      document.getElementById("pagination").appendChild(li);
    }
  });
}

// Cargar registros inicialmente con paginación
cargarRegistrosPaginacion(1);

