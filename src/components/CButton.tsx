import React from "react";
import { IconType } from "react-icons/lib";
import { Button } from "reactstrap";
interface Props {
  color: string;
  onClick: (arg0?: string | undefined) => void;
  text: string;
  icon?: IconType;
}
function CButton({ color, onClick, text, icon }: Props) {
  return (
    <Button color={color} onClick={() => onClick()}>
      {text}
    </Button>
  );
}

export default CButton;
