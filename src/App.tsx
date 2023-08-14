import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Container, FormGroup } from "reactstrap";
import { useNavigate } from "react-router-dom";
import SidebarHorizontal from "./components/SidebarHorizontal";
import { Usuario } from "./models/Usuario";
import { useReactToPrint } from "react-to-print";
import { AnyAction } from "@reduxjs/toolkit";
import { Br, Cut, Line, Printer, render, Row, Text } from "react-thermal-printer";
import { connect } from "node:net";
import { useMutation } from "@tanstack/react-query";

const App = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<Usuario[]>([]);
  const componentRef = useRef();
  const [content, setContent] = useState("¡Hola, mundo!");
  // useEffect(() => {
  //   const item = localStorage.getItem("userLoggedv2");
  //   if (item !== null) {
  //     try {
  //       const parsedItem = JSON.parse(item);
  //       setForm(parsedItem);
  //     } catch (error) {
  //       console.error("Error parsing JSON:", error);
  //       // Mostrar un alert en caso de error
  //       alert("Error al cargar los datos de sesión. Por favor, vuelve a iniciar sesión.");
  //       // Otra opción es usar una librería de notificaciones como "sweetalert2" para mostrar un mensaje más estilizado
  //       // import Swal from "sweetalert2";
  //       // Swal.fire({
  //       //   icon: "error",
  //       //   title: "Error",
  //       //   text: "Error al cargar los datos de sesión. Por favor, vuelve a iniciar sesión.",
  //       // });
  //     }
  //   } else {
  //     // Handle the case where "userLoggedv2" is not present in localStorage
  //     // For example, you might want to set a default value for the form in this case
  //     console.log("userLoggedv2 not found in localStorage");
  //   }
  // }, []);

  interface TicketPrintProps {
    children: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  }
  const Ticket: React.FC<AnyAction> = () => {
    return (
      <div>
        <h2>Ticket de compra</h2>
        <p>Fecha: 21 de junio de 2023</p>
        <p>Producto: Zapatos</p>
        <p>Precio: $50.00</p>
      </div>
    );
  };
  // const handleDirectPrint = async () => {
  //   const device = new escpos.USB();
  //   // const device  = new escpos.Network('localhost');
  //   // const device  = new escpos.Serial('/dev/usb/lp0');
  //   const options = { encoding: "GB18030" /* default */ };
  //   const printer = new escpos.Printer(device, options);
  //   await device.open(function (error) {
  //     printer
  //       .font("A")
  //       .align("CT")
  //       .style("BU")
  //       .size(1, 1)
  //       .text("The quick brown fox jumps over the lazy dog")
  //       .text("敏捷的棕色狐狸跳过懒狗")
  //       .barcode("1234567", "EAN8")
  //       .table(["One", "Two", "Three"])
  //       .qrimage("https://github.com/song940/node-escpos", function (err) {
  //         cut();
  //         close();
  //       });
  //   });
  // };
  // const TicketPrint: React.FC<TicketPrintProps> = ({ children }) => {
  //   const componentRef = useRef<HTMLDivElement>(null);

  //   const handlePrint = useReactToPrint({
  //     content: () => componentRef.current,
  //   });

  //   return (
  //     <div>
  //       <div ref={componentRef}>{children}</div>
  //       <button onClick={handlePrint}>Imprimir ticket</button>
  //     </div>
  //   );
  // };

  // const receipt = (
  //   <Printer type="epson" width={42} characterSet="korea" debug={true}>
  //     <Text size={{ width: 2, height: 2 }}>9,500원</Text>
  //     <Text bold={true}>결제 완료</Text>
  //     <Br />
  //     <Line />
  //     <Row left="결제방법" right="체크카드" />
  //     <Row left="카드번호" right="123456**********" />
  //     <Row left="할부기간" right="일시불" />
  //     <Row left="결제금액" right="9,500" />
  //     <Row left="부가세액" right="863" />
  //     <Row left="공급가액" right="8,637" />
  //     <Line />
  //     <Row left={<Text bold={true}>맛있는 옥수수수염차 X 2</Text>} right="11,000" />
  //     <Text> 옵션1(500)/옵션2/"메모"</Text>
  //     <Row left=" (-) 할인" right="- 500" />
  //     <Br />
  //     <Line />
  //     <Row left={<Text bold={true}>합계</Text>} right={<Text underline="1dot-thick">9,500</Text>} />
  //     <Row left="(-) 할인 2%" right="- 1,000" />
  //     <Line />
  //     <Row left="대표" right="김대표" />
  //     <Row left="사업자등록번호" right="000-00-00000" />
  //     <Row left="대표번호" right="0000-0000" />
  //     <Row left="주소" right="어디시 어디구 어디동 몇동몇호" />
  //     <Row
  //       gap={1}
  //       left={<Text size={{ width: 2, height: 2 }}>포</Text>}
  //       center={<Text size={{ width: 2, height: 2 }}>알로하 포케 맛있는 거</Text>}
  //       right="X 15"
  //     />
  //     <Line />
  //     <Br />
  //     <Text align="center">Wifi: some-wifi / PW: 123123</Text>
  //     <Cut />
  //   </Printer>
  // );

  // const [port, setPort] = useState<SerialPort>();
  // const { mutateAsync: print, isLoading: isPrinting } = useMutation(async () => {
  //   let _port = port;
  //   if (_port == null) {
  //     _port = await navigator.serial.requestPort();
  //     await _port.open({ baudRate: 9600 });
  //     setPort(_port);
  //   }

  //   const writer = _port.writable?.getWriter();
  //   if (writer != null) {
  //     const data = await render(receipt);

  //     await writer.write(data);
  //     writer.releaseLock();
  //   }
  // });

  return (
    <>
      <SidebarHorizontal />
      {/* <TicketPrint>
        <Ticket />
      </TicketPrint> */}
      {/* <div>{receipt}</div>
      <div style={{ marginTop: 24 }}>
        <button disabled={isPrinting} onClick={() => print()}>
          {isPrinting ? "프린트 중..." : "프린트"}
        </button>
      </div> */}
    </>
  );
};

export default App;
