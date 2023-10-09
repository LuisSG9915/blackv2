import React, { useEffect, useState } from "react";

function BluetoothPrint() {
  const [selectedDevice, setSelectedDevice] = useState<BluetoothDevice | null>(null);
  const connect = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
      });
      setSelectedDevice(device);
    } catch (error) {
      console.error("Error connecting to Bluetooth device:", error);
    }
  };
  return (
    <div>
      <button onClick={connect}>Press for information</button>
      <p>I have something in here...</p>
      {selectedDevice && (
        <div>
          <h2>Selected Device Information:</h2>
          <p>Name: {selectedDevice.name}</p>
          <p>ID: {selectedDevice.id}</p>
          {/* Add more device information as needed */}
        </div>
      )}
    </div>
  );
}
export default BluetoothPrint;
