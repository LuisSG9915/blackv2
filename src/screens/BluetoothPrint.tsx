import React, { useState } from "react";

function BluetoothPrint() {
  const [bluetoothDevice, setBluetoothDevice] = useState(null);
  const [printService, setPrintService] = useState(null);

  const connectToDevice = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ["print_service_uuid"], // Replace with your service UUID
      });

      const server = await device.gatt.connect();
      const service = await server.getPrimaryService("print_service_uuid"); // Replace with your service UUID

      setBluetoothDevice(device);
      setPrintService(service);
    } catch (error) {
      console.error("Error connecting to Bluetooth device:", error);
    }
  };

  const printHTML = async (html) => {
    if (printService) {
      try {
        const characteristic = await printService.getCharacteristic("print_characteristic_uuid"); // Replace with your characteristic UUID

        const encoder = new TextEncoder("utf-8");
        const data = encoder.encode(html);

        await characteristic.writeValue(data);
      } catch (error) {
        console.error("Error writing data to Bluetooth device:", error);
      }
    } else {
      console.error("Bluetooth service not initialized.");
    }
  };

  return (
    <div>
      <button onClick={connectToDevice}>Connect to Bluetooth Device</button>
      <button onClick={() => printHTML("<html><body><h1>Hello, Bluetooth Printing!</h1></body></html>")}>Print HTML</button>
    </div>
  );
}

export default BluetoothPrint;
