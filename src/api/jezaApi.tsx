import axios from "axios";

export const jezaApi = axios.create({
  baseURL: "https://cbinfo.no-ip.info:9089",
  //baseURL: "http://cbinfo.no-ip.info:9083",
  headers: {
    "Content-Type": "text/plain; charset=UTF-8; application/json",
    // "Content-Type": "application/json",
    Accept: "*",
  },
});

// import axios from "axios";

// export const jezaApi = axios.create({
//   baseURL: "https://cbinfo.no-ip.info:9089", vite
//   headers: {
//     "Content-Type": "text/plain; charset=UTF-8; application/json",
//     // "Content-Type": "application/json",
//     Accept: "*",
//   },
// });
