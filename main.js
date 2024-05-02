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
  if (event.keyCode === 13) {
    if (id === "inputEmail") {
      document.getElementById("formulario").reset();
      document.getElementById("inputCliente").focus();
    } else {
      document.getElementById(id).focus();
    }
  }
}

// Función para cargar datos en Firebase y agregar a la tabla
function cargarDatos() {
  const fechaHora = new Date().toLocaleString();
  const numCliente = document.getElementById("inputCliente").value;
  const numRemito = document.getElementById("inputRemito").value;
  const numEtiqueta = document.getElementById("inputEtiqueta").value;
  const email = document.getElementById("inputEmail").value;

  if (fechaHora && numCliente && numRemito && numEtiqueta && email) {
    const nuevaEntradaRef = database.ref('registros').push();
    nuevaEntradaRef.set({
      fechaHora: fechaHora,
      numCliente: numCliente,
      numRemito: numRemito,
      numEtiqueta: numEtiqueta,
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
      row.innerHTML = `<td>${data.fechaHora}</td><td>${data.numRemito}</td><td>${data.numCliente}</td><td>${data.numEtiqueta}</td><td>${data.email}</td>`;
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