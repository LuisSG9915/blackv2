import React from "react";
import { CardTitle, CardText, Input } from "reactstrap";
interface Props {
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
  nombre: string;
}
function CardInput({ onChange, nombre }: Props) {
  return (
    <div className="col-sm">
      <CardTitle tag="h5">{nombre}</CardTitle>
      <CardText>
        <Input type="text" onChange={onChange}></Input>
      </CardText>
    </div>
  );
}

export default CardInput;
