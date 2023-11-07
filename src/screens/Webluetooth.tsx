import React, { useState } from "react";
import SidebarHorizontal from "../components/SidebarHorizontal";
import { Button, Row } from "reactstrap";

function Webluetooth() {
  const [device, setDevice] = useState(null);

  async function connectToDevice() {
    try {
      const selectedDevice = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
      });
      setDevice(selectedDevice);
    } catch (error) {
      console.error("Error al conectar al dispositivo:", error);
    }
  }

  async function imprimirHolaMundo() {
    if (device) {
      try {
        const server = await device.gatt.connect();

        // Obtener el servicio de la impresora (reemplaza 'service-uuid' con el UUID del servicio real)
        const service = await server.getPrimaryService("49535343-fe7d-4ae5-8fa9-9fafd205e455");

        // Obtener la característica de escritura de la impresora (reemplaza 'characteristic-uuid' con el UUID de la característica real)
        const characteristic = await service.getCharacteristic("49535343-8841-43f4-a8d4-ecbe34729bb3");

        // Preparar los datos a imprimir
        const textoAImprimir = "Hola, mundo";

        // Convertir el texto en bytes (esto puede variar según la impresora)
        const textoBytes = new TextEncoder().encode(textoAImprimir);

        // Escribir los datos en la característica de escritura
        await characteristic.writeValue(textoBytes);

        // Cerrar la conexión
        await server.disconnect();

        alert("Impresión exitosa");
      } catch (error) {
        alert("Error al imprimir:", error);
      }
    } else {
      alert("Por favor, selecciona un dispositivo Bluetooth primero.");
    }
  }

  return (
    <>
      <Row>
        <SidebarHorizontal />
      </Row>
      <h1>Web Bluetooth</h1>

      <Button onClick={connectToDevice}>Seleccionar Dispositivo Bluetooth</Button>
      <Button onClick={imprimirHolaMundo}>Imprimir Hola Mundo</Button>
    </>
  );
}

export default Webluetooth;
