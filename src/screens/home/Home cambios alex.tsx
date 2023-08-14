// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button, Col, Container, FormGroup, Input, Label, Row } from "reactstrap";
// import imagenBackground from "../../assets/perritos.jpg";
// import { useUsuarios } from "../../hooks/getsHooks/useUsuarios";
// import AlertComponent from "../../components/AlertComponent";
// import { jezaApi } from "../../api/jezaApi";
// import { UserResponse } from "../../models/Home";
// function Home() {
//   const navigate = useNavigate();
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState(false);

//   const handleUsernameChange = (event: { target: { value: React.SetStateAction<string> } }) => {
//     setUsername(event.target.value);
//   };

//   const handlePasswordChange = (event: { target: { value: React.SetStateAction<string> } }) => {
//     setPassword(event.target.value);
//   };

//   const { dataUsuarios } = useUsuarios();

//   // const handleNavigation = () => {
//   //   jezaApi.get(`/UsuarioPass?usuario=${username}&pass=${password}`).then((response) => {
//   //     console.log(response.data);
//   //     localStorage.setItem("userLoggedv2", JSON.stringify(response.data));
//   //     if (response.data[0].acceso === 1) {
//   //       navigate("/app");
//   //     }
//   //   });
//   //   return;
//   //   const filtrado = dataUsuarios.filter((dataUsuarios) => dataUsuarios.usuario === username && dataUsuarios.password === password);
//   //   if (filtrado.length > 0) {
//   //     localStorage.setItem("userLogged", JSON.stringify(filtrado));
//   //     console.log(filtrado);
//   //     navigate("/app");
//   //   } else {
//   //     setError(true);
//   //     setVisible(true);
//   //     setTimeout(() => {
//   //       setVisible(false);
//   //     }, 3000);
//   //   }
//   const handleNavigation = () => {
//     jezaApi.get(`/UsuarioPass?usuario=${username}&pass=${password}`)
//       .then((response) => {
//         console.log(response.data);
//         if (response.data[0].acceso === 1) {
//           localStorage.setItem("userLoggedv2", JSON.stringify(response.data));

//             navigate("/app");

//         } else {
//           setError(true);
//           setVisible(true);
//           setTimeout(() => {
//             setVisible(false);
//           }, 3000);
//         }
//       })
//       .catch((error) => {
//         console.error("Error al obtener los datos del usuario:", error);
//         setError(true);
//         setVisible(true);
//         setTimeout(() => {
//           setVisible(false);
//         }, 3000);
//       });

//   };

//   const [visible, setVisible] = useState(false);
//   const onDismiss = () => setVisible(false);

//   return (
//     <>
//       <Row className="contenedor">
//         <Col
//           md={"4"}
//           style={{
//             backgroundImage: `url(${imagenBackground})`,
//             backgroundSize: "cover",
//             backgroundRepeat: "no-repeat",
//             backgroundPosition: "center",
//           }}
//         ></Col>
//         <Col
//           className="contenedor"
//           md={"8"}
//           style={{
//             padding: 50,
//             paddingRight: "15%",
//             paddingLeft: "15%",
//             flex: 1,
//             backgroundColor: "white",
//             borderBottomLeftRadius: 15,
//             borderTopLeftRadius: 15,
//           }}
//         >
//           <h3 style={{ textAlign: "center" }}>Ingrese Sesión</h3>
//           <br />
//           <FormGroup floating>
//             <Input id="username" name="username" placeholder="Usuario" onChange={handleUsernameChange} type="text" bsSize="sm" />
//             <Label for="username">Usuario</Label>
//           </FormGroup>
//           <br />
//           <FormGroup floating>
//             <Input
//               onKeyDown={(event) => {
//                 if (event.key === "Enter") {
//                   handleNavigation();
//                 }
//               }}
//               id="password"
//               name="password"
//               placeholder="Contraseña"
//               onChange={handlePasswordChange}
//               type="password"
//               bsSize="sm"
//             />
//             <Label for="password">Contraseña</Label>
//           </FormGroup>
//           <br />
//           <br />
//           <Button title="Ingresar sesión" name="aa" onClick={handleNavigation}>
//             Ingrese sesión
//           </Button>
//           <br />
//           <br />
//           <AlertComponent error={error} onDismiss={onDismiss} visible={visible} text="Credenciales incorrectas, favor de ingresarlas nuevamente" />
//         </Col>
//       </Row>
//     </>
//   );
// }

// export default Home;

// //----------------------------------------------------------------------------------------
// // import React, { useState, useEffect } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { Button, Col, Container, FormGroup, Input, Label, Row } from "reactstrap";
// // // import imagenBackground from "../../assets/perritos.jpg";
// // import barberoImage from "../../assets/barbero.jpg";
// // import lavadoImage from "../../assets/lavado.jpg";
// // import perritosImage from "../../assets/perritos.jpg";
// // import corteImage from "../../assets/corte.jpg";
// // import inventImage from "../../assets/invent.jpg";
// // import setupImage from "../../assets/setup.jpg";
// // import peinadoImage from "../../assets/peinado.jpg";

// // import { useUsuarios } from "../../hooks/getsHooks/useUsuarios";
// // import AlertComponent from "../../components/AlertComponent";
// // import { jezaApi } from "../../api/jezaApi";
// // function Home() {
// //   const [imageIndex, setImageIndex] = useState(0);
// //   const images = [barberoImage, lavadoImage, perritosImage, corteImage, inventImage, setupImage, peinadoImage];

// //   useEffect(() => {
// //     // localStorage.removeItem("userLogged");
// //     localStorage.removeItem("userLoggedv2");
// //   }, []);

// //   useEffect(() => {
// //     const interval = setInterval(() => {
// //       setFade(true);
// //       const timeout = setTimeout(() => {
// //         setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
// //         setFade(false);
// //       }, 1000);
// //       return () => clearTimeout(timeout);
// //     }, 4000);

// //     return () => clearInterval(interval);
// //   }, [images.length]);

// //   const [fade, setFade] = useState(false);

// //   const backgroundImageStyle = {
// //     backgroundImage: `url(${images[imageIndex]})`,
// //     backgroundSize: "cover",
// //     backgroundRepeat: "no-repeat",
// //     backgroundPosition: "center",
// //     transition: "opacity 1s ease-in-out",
// //     opacity: fade ? 0 : 1,
// //   };
// //   const navigate = useNavigate();
// //   const [username, setUsername] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [error, setError] = useState(false);

// //   const handleUsernameChange = (event: { target: { value: React.SetStateAction<string> } }) => {
// //     setUsername(event.target.value);
// //   };

// //   const handlePasswordChange = (event: { target: { value: React.SetStateAction<string> } }) => {
// //     setPassword(event.target.value);
// //   };

// //   const { dataUsuarios } = useUsuarios();

// //   const handleNavigation = () => {
// //     jezaApi.get(`/UsuarioPass?usuario=${username}&pass=${password}`).then((response) => {
// //       console.log(response.data);
// //       const filtrado = dataUsuarios.filter(
// //         (dataUsuarios) => dataUsuarios.usuario === username && dataUsuarios.password === password
// //       );
// //       // localStorage.setItem("userLogged", JSON.stringify(filtrado));
// //       localStorage.setItem("userLoggedv2", JSON.stringify(response.data));
// //       if (response.data[0].acceso === 1) {
// //         navigate("/app");
// //       } else {
// //         setError(true);
// //         setVisible(true);
// //         setTimeout(() => {
// //           setVisible(false);
// //         }, 3000);
// //       }
// //     });
// //     return;
// //     const filtrado = dataUsuarios.filter(
// //       (dataUsuarios) => dataUsuarios.usuario === username && dataUsuarios.password === password
// //     );
// //     if (filtrado.length > 0) {
// //       localStorage.setItem("userLogged", JSON.stringify(filtrado));
// //       console.log(filtrado);
// //       navigate("/app");
// //     } else {
// //       setError(true);
// //       setVisible(true);
// //       setTimeout(() => {
// //         setVisible(false);
// //       }, 3000);
// //     }
// //   };

// //   const [visible, setVisible] = useState(false);

// //   const onDismiss = () => setVisible(false);

// //   return (
// //     <>
// //       <Row className="contenedor" style={{}}>
// //         <Col md="4" style={backgroundImageStyle}></Col>
// //         <Col
// //           className="contenedor"
// //           md={"8"}
// //           style={{
// //             padding: 50,
// //             paddingRight: "15%",
// //             paddingLeft: "15%",
// //             flex: 1,
// //             backgroundColor: "white",
// //             borderBottomLeftRadius: 15,
// //             borderTopLeftRadius: 15,
// //           }}
// //         >
// //           <h3 style={{ textAlign: "center" }}>Inicio de Sesión</h3>
// //           <br />
// //           <FormGroup floating>
// //             <Input
// //               id="username"
// //               name="username"
// //               placeholder="Usuario"
// //               onChange={handleUsernameChange}
// //               type="text"
// //               bsSize="sm"
// //             />
// //             <Label for="username">Usuario</Label>
// //           </FormGroup>
// //           <br />
// //           <FormGroup floating>
// //             <Input
// //               onKeyDown={(event) => {
// //                 if (event.key === "Enter") {
// //                   handleNavigation();
// //                 }
// //               }}
// //               id="password"
// //               name="password"
// //               placeholder="Contraseña"
// //               onChange={handlePasswordChange}
// //               type="password"
// //               bsSize="sm"
// //             />
// //             <Label for="password">Contraseña</Label>
// //           </FormGroup>
// //           <br />
// //           <br />
// //           <Button title="Ingresar sesión" name="aa" onClick={handleNavigation}>
// //             Ingrese sesión
// //           </Button>
// //           <br />
// //           <br />
// //           <AlertComponent
// //             error={error}
// //             onDismiss={onDismiss}
// //             visible={visible}
// //             text="Credenciales incorrectas, favor de ingresarlas nuevamente"
// //           />
// //         </Col>
// //       </Row>
// //     </>
// //   );
// // }

// // export default Home;
