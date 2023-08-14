import React from "react";
import { Alert } from "reactstrap";

interface props {
  onDismiss: () => void;
  visible: boolean;
  error: boolean;
  text?: string;
}

function AlertComponent({ error, onDismiss, visible, text }: props) {
  return (
    <Alert color={error ? "danger" : "success"} isOpen={visible} toggle={onDismiss}>
      {text ? text : "Registro realizado con éxito"}
    </Alert>
  );
}

export default AlertComponent;
