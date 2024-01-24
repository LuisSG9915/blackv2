import React, { useState, useEffect } from "react";
import { DownOutlined } from "@ant-design/icons";
import type { TableColumnsType } from "antd";
import { Badge, Dropdown, Space, Table } from "antd";
import { jezaApi } from "../../api/jezaApi";
import { blue } from "@ant-design/colors";
import { gray } from "@ant-design/colors";
import { cyan } from "@ant-design/colors";
import { purple } from "@ant-design/colors";
import Select from "react-select";
import SidebarHorizontal from "../../components/SidebarHorizontal";
import {
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Button,
  Container,
  Input,
  Label,
  UncontrolledAccordion,
} from "reactstrap";

interface Producto {
  descripcion: string;
  cantidad: string;
  precio: string;
  costoInsumos: string;
  auxiliar: string;
  promoDescuento: string;
}

interface Cliente {
  idempleado: number;
  fecha: string;
  cliente: string;
  venta_Total: string;
  medioDePago: string;
  producto: Producto;
}

interface Nomina {
  clave_empleado: number;
  nombre: string;
  colaborador: string;
  puesto: string;
  ventaServicio: string;
  descProducto: string;
  com35Servicio: string;
  desc5: string;
  descNominaProducto: string;
  com10Producto: string;
  com5Estilista: string;
  sueldoBase: string;
  totalPagar: string;
  cliente: Cliente;
}

const ReporteToolARBOL_C: React.FC = () => {
  const [data, setData] = useState<Nomina[]>([]);
  const getDATOS = async () => {
    try {
      const response = await jezaApi.get("/sp_repoComisiones1_Json?suc=%&f1=2024-01-21&f2=2024-01-22&estilista=%");
      const responseData = response.data;

      // Procesamiento de datos
      const processedData = responseData
        .map((item: any) => {
          try {
            const jsonData = JSON.parse(item.json);
            const nominas: Nomina[] = jsonData.nomina;
            return nominas;
          } catch (error) {
            console.error("Error parsing JSON for item with id", item.id, ":", error);
            return [];
          }
        })
        .flat();

      console.log("Processed Data:", processedData);

      // Filtrar duplicados (este es un ejemplo, ajusta según tus necesidades)
      const filteredData = processedData.filter(
        (item, index, array) => array.findIndex((i) => i.clave_empleado === item.clave_empleado) === index
      );

      // Agrupar por clave_empleado
      const groupedData: Record<number, Nomina[]> = filteredData.reduce((grouped, item) => {
        const key = item.clave_empleado;
        if (!grouped[key]) {
          grouped[key] = [];
        }
        grouped[key].push(item);
        return grouped;
      }, {} as Record<number, Nomina[]>);

      // Convertir el objeto agrupado en un array
      const groupedArray: Nomina[] = Object.values(groupedData).flat();

      setData(groupedArray);
    } catch (error) {
      console.error("Error fetching or parsing data:", error);
    }
  };

  // useEffect(() => {
  //   getDATOS();
  // }, []);
  const headerStylePrincipal = {
    background: gray[6],
    color: "white",
  };

  const headerStyleSecundaria = {
    background: cyan[7],
    color: "white",
  };

  const headerStyleTercera = {
    background: purple[4],
    color: "white",
  };

  const expandedRowRenderCliente = (record: Nomina) => {
    const cliente = record.cliente;

    const columnsCliente: TableColumnsType<Cliente> = [
      { title: "Fecha", dataIndex: "fecha", key: "fecha" },
      { title: "Cliente", dataIndex: "cliente", key: "cliente" },
      { title: "Venta Total", dataIndex: "venta_Total", key: "venta_Total" },
      { title: "Medio de Pago", dataIndex: "medioDePago", key: "medioDePago" },
    ];

    const dataCliente: Cliente[] = [cliente];

    return (
      <Table
        columns={columnsCliente}
        expandable={{
          expandedRowRender: expandedRowRenderProducto,
        }}
        dataSource={dataCliente}
        pagination={false}
        components={{
          header: {
            cell: (props) => <th {...props} style={headerStyleSecundaria} />,
          },
        }}
      />
    );
  };

  const expandedRowRenderProducto = (cliente: Cliente) => {
    const producto = cliente?.producto;

    // Verificar si hay datos de producto antes de intentar renderizar la tabla
    if (!producto) {
      return null; // Si no hay datos, devolver null para que no se muestre la tabla
    }

    const columnsProducto: TableColumnsType<Producto> = [
      { title: "Descripción", dataIndex: "descripcion", key: "descripcion" },
      { title: "Cantidad", dataIndex: "cantidad", key: "cantidad" },
      { title: "Precio", dataIndex: "precio", key: "precio" },
      { title: "Costo de Insumos", dataIndex: "costoInsumos", key: "costoInsumos" },
      { title: "Auxiliar", dataIndex: "auxiliar", key: "auxiliar" },
      { title: "Promo Descuento", dataIndex: "promoDescuento", key: "promoDescuento" },
    ];

    const dataProducto: Producto[] = [producto];

    return (
      <Table
        columns={columnsProducto}
        dataSource={dataProducto}
        pagination={false}
        components={{
          header: {
            cell: (props) => <th {...props} style={headerStyleTercera} />,
          },
        }}
      />
    );
  };

  const columnsPrincipal: TableColumnsType<Nomina> = [
    { title: "Clave Empleado", dataIndex: "clave_empleado", key: "clave_empleado" },
    { title: "Nombre", dataIndex: "nombre", key: "nombre" },
    { title: "colaborador", dataIndex: "colaborador", key: "colaborador" },
    { title: "puesto", dataIndex: "puesto", key: "puesto" },
    { title: "ventaServicio", dataIndex: "ventaServicio", key: "ventaServicio" },
    { title: "descProducto", dataIndex: "descProducto", key: "descProducto" },
    { title: "com35Servicio", dataIndex: "com35Servicio", key: "com35Servicio" },
    { title: "descNominaProducto", dataIndex: "descNominaProducto", key: "descNominaProducto" },
    { title: "com10Producto", dataIndex: "com10Producto", key: "com10Producto" },
    { title: "com5Estilista", dataIndex: "com5Estilista", key: "com5Estilista" },
    { title: "sueldoBase", dataIndex: "sueldoBase", key: "sueldoBase" },
    { title: "totalPagar", dataIndex: "totalPagar", key: "totalPagar" },
    // Otros campos según tu estructura de datos
  ];

  return (
    <>
      <SidebarHorizontal></SidebarHorizontal>
      <Container>
        {" "}
        <UncontrolledAccordion defaultOpen="1">
          <AccordionItem>
            <AccordionHeader targetId="1">Filtros</AccordionHeader>
            <AccordionBody accordionId="1">
              <div className="formulario">
                <div>
                  <Label>Fecha inicial:</Label>
                  <Input
                    type="date"
                    name="fechaInicial"
                    // value={formulario.fechaInicial}
                    //onChange={handleChange}
                    // disabled={!data[0]?.f1}
                    bsSize="sm"
                  />
                </div>

                <div>
                  <Label>Fecha final:</Label>
                  <Input
                    type="date"
                    name="fechaFinal"
                    //value={formulario.fechaFinal}
                    //onChange={handleChange}
                    // disabled={!data[0]?.f2}
                    bsSize="sm"
                  />
                </div>
                <div>
                  <Label>Sucursal:</Label>
                  <Input
                    type="select"
                    name="sucursal"
                    //value={formulario.sucursal}
                    // onChange={handleChange}
                    bsSize="sm"
                  >
                    <option value="">Seleccione la sucursal</option>

                    {/* {dataSucursales.map((item) => (
                       // <option value={item.sucursal}>{item.nombre}</option>
                      ))} */}
                  </Input>
                </div>
                <div>
                  <Label>Estilista:</Label>

                  <Select
                    menuPlacement="top"
                    name="estilista"
                    // options={optionsEstilista}
                    //value={optionsEstilista.find((option) => option.value === formulario.estilista)}
                    // onChange={(selectedOption) => {
                    // Aquí actualizas el valor en el estado form
                    //  setFormulario((prevState) => ({
                    //   ...prevState,
                    //     estilista: selectedOption ? selectedOption.value : "", // 0 u otro valor predeterminado
                    //   }));
                    //  }}
                    placeholder="--Selecciona una opción--"
                  />
                </div>
              </div>
              <br />
              <Space style={{ width: "100%", justifyContent: "flex-end" }}>
                <Button onClick={() => getDATOS()}>Consultar</Button>
              </Space>
            </AccordionBody>
          </AccordionItem>
        </UncontrolledAccordion>
      </Container>

      <Table
        columns={columnsPrincipal.map((column) => ({ ...column, className: "principal-header" }))}
        expandable={{
          expandedRowRender: expandedRowRenderCliente,
        }}
        dataSource={data.map((record) => ({ ...record, key: record.clave_empleado }))}
        size="small"
        style={{ background: blue[10] }}
        components={{
          header: {
            cell: (props) => <th {...props} style={headerStylePrincipal} />,
          },
        }}
        scroll={{ y: 700 }}
      />
    </>
  );
};

export default ReporteToolARBOL_C;
