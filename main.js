// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Función para cargar datos
function cargarDatos() {
  const cliente = document.getElementById('clienteInput').value;
  const remito = document.getElementById('remitoInput').value;
  const etiqueta = document.getElementById('etiquetaInput').value;
  const email = document.getElementById('emailInput').value;

  const timestamp = new Date().toLocaleString();

  // Guardar datos en Firebase
  database.ref('datos').push({
    fecha: timestamp,
    cliente: cliente,
    remito: remito,
    etiqueta: etiqueta,
    email: email
  });

  // Limpiar los campos de entrada
  document.getElementById('clienteInput').value = '';
  document.getElementById('remitoInput').value = '';
  document.getElementById('etiquetaInput').value = '';
  document.getElementById('emailInput').value = '';
}

// Función para mostrar datos en la tabla
function mostrarDatos(fecha, cliente, remito, etiqueta, email) {
  const tableBody = document.getElementById('dataBody');
  const newRow = `<tr>
                    <td>${fecha}</td>
                    <td>${remito}</td>
                    <td>${cliente}</td>
                    <td>${etiqueta}</td>
                    <td>${email}</td>
                  </tr>`;
  tableBody.insertAdjacentHTML('afterbegin', newRow);
}

// Mostrar spinner mientras se cargan los datos
const spinner = document.getElementById('spinner');
spinner.style.display = 'block';

// Escuchar cambios en la base de datos de Firebase y mostrarlos
database.ref('datos').on('child_added', (snapshot) => {
  const data = snapshot.val();
  mostrarDatos(data.fecha, data.cliente, data.remito, data.etiqueta, data.email);

  // Ocultar spinner una vez que se cargan los datos
  spinner.style.display = 'none';
});

// Enviar datos a Firebase al cargar la página
window.addEventListener('load', () => {
  cargarDatos();
});
