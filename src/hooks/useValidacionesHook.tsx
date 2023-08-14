import { SetStateAction, useState } from "react";
interface Props {
  getInfo: () => void;
}

const useValidacionesHook = ({ getInfo }: Props) => {
  const [filtroValor, setFiltroValor] = useState("");

  const validaciones = (e: { target: { value: SetStateAction<string> } }) => {
    setFiltroValor(e.target.value);
    if (e.target.value === "") {
      getInfo();
    }
  };

  return { filtroValor, validaciones, setFiltroValor };
};

export default useValidacionesHook;
