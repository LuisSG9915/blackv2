import React, { useState } from "react";
import SidebarHorizontal from "../components/SidebarHorizontal";
import { Button, Row } from "reactstrap";

function Webluetooth() {
  const [device, setDevice] = useState<BluetoothDevice>();

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
        if (device.gatt) {
          const server = await device.gatt.connect();
          const service = await server.getPrimaryService("49535343-fe7d-4ae5-8fa9-9fafd205e455");
          const characteristic = await service.getCharacteristic("49535343-8841-43f4-a8d4-ecbe34729bb3");

          const textoAImprimir = "Hola, mundo";
          const textoBytes = new TextEncoder().encode(textoAImprimir);

          await characteristic.writeValue(textoBytes);
          await server.disconnect();

          alert("¡Impresión exitosa!");
          console.log("Impresión exitosa");
        } else {
          alert("El objeto 'gatt' es undefined");
          console.error("El objeto 'gatt' es undefined");
        }
      } catch (error) {
        alert("Error al imprimir: " + error);
        console.error("Error al imprimir:", error);
      }
    } else {
      alert("Por favor, selecciona un dispositivo Bluetooth primero.");
      console.error("Por favor, selecciona un dispositivo Bluetooth primero.");
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
