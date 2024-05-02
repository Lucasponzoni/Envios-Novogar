$(document).ready(function () {

    // Agregar eventos para cambiar el enfoque con la tecla "Enter"
    $("#remitoInput").keydown(function (event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Evitar el envío del formulario si está dentro de un formulario
            $("#clienteInput").focus();
        }
    });

    $("#clienteInput").keydown(function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            $("#addressInput").focus();
        }
    });

    $("#addressInput").keydown(function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            $("#searchButton").click();
            $("#remitoInput").val('');
            $("#clienteInput").val('');
            $("#addressInput").val('');
            $("#remitoInput").focus();
        }
    });

    // Inicializar el mapa Leaflet
    var map = L.map('map').setView([-32.956, -60.642], 13);

    // Capa de mapa base de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);

    // ZONA CENTRO
    var coordinates = [
        [-32.971425, -60.621840],
        [-32.971692, -60.617840],
        [-32.963680, -60.619057],
        [-32.955450, -60.622209],
        [-32.949841, -60.625573],
        [-32.942662, -60.631633],
        [-32.936537, -60.638850],
        [-32.924546, -60.661190],
        [-32.912774, -60.672664],
        [-32.960253, -60.684497],
        [-32.971425, -60.621840]
    ];

    // Crear un polígono que conecte las coordenadas
    var polygon = L.polygon(coordinates, { color: 'red' }).addTo(map);
 

    // Opcionalmente, también puedes agregar una etiqueta al polígono
    polygon.bindPopup("Rosario Zona Centro");

    // Crear un tooltip con el texto que se mostrará sobre el polígono
    var tooltip = L.tooltip({
        permanent: true,
        direction: 'center',
        className: 'custom-tooltip',
        offset: [0, 0]
    }).setContent("Zona Centro - Novogar");

    // Asociar el tooltip al polígono
    polygon.bindTooltip(tooltip).openTooltip();

    // Nuevas coordenadas para el segundo polígono (en azul)
var coordinates2 = [
    [-32.971513, -60.621867],
    [-32.971524, -60.621680],
    [-32.972397, -60.617835],
    [-32.998087, -60.611751],
    [-33.001477, -60.618430],
    [-33.013621, -60.619008],
    [-33.015445, -60.625119],
    [-33.016383, -60.653412],
    [-33.014545, -60.664599],
    [-32.995891, -60.697614],
    [-32.970485, -60.716863],
    [-32.959514, -60.721097],
    [-32.958534, -60.691884],
    [-32.959018, -60.691489],
    [-32.959625, -60.687964]
];

// Crear un segundo polígono con las nuevas coordenadas (en azul)
var polygon2 = L.polygon(coordinates2, { color: 'blue' }).addTo(map);

// Opcionalmente, también puedes agregar una etiqueta al segundo polígono
polygon2.bindPopup("Rosario Zona Sur");

// Crear un tooltip con el texto que se mostrará sobre el segundo polígono
var tooltip2 = L.tooltip({
    permanent: true,
    direction: 'center',
    className: 'custom-tooltip',
    offset: [0, 0]
}).setContent("Zona Sur - Novogar");

// Asociar el tooltip al segundo polígono
polygon2.bindTooltip(tooltip2).openTooltip();

// Nuevas coordenadas para el tercer polígono (en púrpura)
var coordinates3 = [
    [-32.959498, -60.721004],
    [-32.958490, -60.691739],
    [-32.958968, -60.691414],
    [-32.960212, -60.684486],
    [-32.912121, -60.672605],
    [-32.892730, -60.683160],
    [-32.870339, -60.687875],
    [-32.872265, -60.699175],
    [-32.878584, -60.707501],
    [-32.883335, -60.711272],
    [-32.895461, -60.721314],
    [-32.908129, -60.724616],
    [-32.909812, -60.775772],
    [-32.924342, -60.777388],
    [-32.926914, -60.747733],
    [-32.926961, -60.743280],
    [-32.931172, -60.723164],
    [-32.949003, -60.721943],
    [-32.959480, -60.720939]
];

// Crear un tercer polígono con las nuevas coordenadas (en púrpura)
var polygon3 = L.polygon(coordinates3, { color: 'green' }).addTo(map);

// Opcionalmente, también puedes agregar una etiqueta al tercer polígono
polygon3.bindPopup("Rosario Zona Norte");

// Crear un tooltip con el texto que se mostrará sobre el tercer polígono
var tooltip3 = L.tooltip({
    permanent: true,
    direction: 'center',
    className: 'custom-tooltip',
    offset: [0, 0]
}).setContent("Zona Norte - Novogar");

// Asociar el tooltip al tercer polígono
polygon3.bindTooltip(tooltip3).openTooltip();

var addressList = []; // Almacenar las direcciones buscadas

// Función para buscar y mostrar la dirección en el mapa y lista de direcciones
$("#searchButton").click(function () {
    var address = $("#addressInput").val();
    var remito = $("#remitoInput").val(); // Obtener el remito
    var cliente = $("#clienteInput").val(); // Obtener el cliente

    if (address) {
        // Mostrar el spinner mientras se procesa
        $("#spinner").show();
        // Usar una API de geocodificación para convertir la dirección en coordenadas
        $.ajax({
            url: 'https://nominatim.openstreetmap.org/search',
            data: {
                q: address + ", Rosario, Santa Fe, Argentina", // Agregar "Rosario" a la búsqueda
                format: 'json',
                limit: 1,
            },
            success: function (data) {
                // Ocultar el spinner una vez que se complete la operación
                $("#spinner").hide();

                if (data.length > 0) {
                    var lat = parseFloat(data[0].lat);
                    var lon = parseFloat(data[0].lon);
                    map.setView([lat, lon], 13);

                    // Agregar un marcador en la ubicación encontrada
                    L.marker([lat, lon]).addTo(map);

                    // Determinar la zona y el color correspondiente
                    var zone = "";
                    var color = "";
                    if (polygon.getBounds().contains([lat, lon])) {
                        zone = "Zona Centro";
                        color = "red";
                    } else if (polygon2.getBounds().contains([lat, lon])) {
                        zone = "Zona Sur";
                        color = "blue";
                    } else if (polygon3.getBounds().contains([lat, lon])) {
                        zone = "Zona Norte";
                        color = "green";
                    }

            // Agregar la dirección, remito y cliente a la lista de direcciones
            addressList.push({ address: address, zone: zone, color: color, remito: remito, cliente: cliente });
            updateAddressList();
                } else {
                    alert('No se encontraron resultados para la dirección ingresada en Rosario.');
                }
            }
        });
    } else {
        alert('Por favor, ingresa una dirección.');
    }
});

function updateAddressList() {
    var listContainer = $("#addressList");
    listContainer.empty();

    if (addressList.length > 0) {
        listContainer.show();
    } else {
        listContainer.hide();
    }

    addressList.forEach(function (item, index) {
        var listItem = $("<div>");

        // Agregar un botón para eliminar la dirección
        var deleteButton = $("<button>").text("Eliminar").addClass("delete-button").click(function () {
            addressList.splice(index, 1);
            updateAddressList();
        });

        // Agregar un select con las opciones de zona
        var zoneSelect = $("<select>").addClass("select-button").on("change", function () {
            var newZone = $(this).val();
            addressList[index].zone = newZone;
            // Cambiar el color del círculo según la zona seleccionada
            if (newZone === "Zona Centro") {
                addressList[index].color = "red";
            } else if (newZone === "Zona Sur") {
                addressList[index].color = "blue";
            } else if (newZone === "Zona Norte") {
                addressList[index].color = "green";
            }
            updateAddressList();
        });

        // Agregar las opciones de zona al select
        var zoneOptions = ["Zona Centro", "Zona Sur", "Zona Norte"];
        zoneOptions.forEach(function (option) {
            var optionElement = $("<option>").attr("value", option).text(option);
            zoneSelect.append(optionElement);

            if (item.zone === option) {
                optionElement.prop('selected', true);
            }
        });

        var circleColor = item.color;

        var circle = $("<div>").css({
            width: "30px",
            height: "30px",
            borderRadius: "20px",
            backgroundColor: circleColor,
            display: "inline-block",
            marginRight: "10px",
            verticalAlign: "middle"
        });

        // Mostrar el remito y el cliente en la misma línea con un salto de línea antes de listItem.append(circle);
        var remitoClienteLine = $("<div>").addClass("remito-cliente-line");
        remitoClienteLine.html("Remito: " + item.remito + " - Cliente: " + item.cliente);
        listItem.append(remitoClienteLine);

// Agrega un contenedor para esta sección
var sectionContainer = $("<div>").addClass("section-container d-flex justify-content-between align-items-center");

// Agrega el salto de línea al contenedor
sectionContainer.append("<br>");
sectionContainer.append(circle);
sectionContainer.append(item.address.toUpperCase() + " - Rosario");
sectionContainer.append(zoneSelect);
sectionContainer.append(deleteButton);

// Agrega el contenedor completo a la lista de direcciones
listItem.append(sectionContainer);


        listContainer.append(listItem);
    });
}


// Llamar a la función para actualizar la lista de direcciones inicialmente
updateAddressList();
});