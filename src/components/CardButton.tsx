import React from "react";
import { AiFillFilter } from "react-icons/ai";
import { Button } from "reactstrap";
interface Props {
  onClick?: (() => void) | undefined;
}
const CardButton = ({ onClick }: Props) => {
  return (
    <div className="d-flex justify-content-end">
      <Button outline color={"success"} onClick={onClick}>
        <AiFillFilter className="mr-2" size={23}></AiFillFilter>
        Filtro
      </Button>
    </div>
  );
};

export default CardButton;
