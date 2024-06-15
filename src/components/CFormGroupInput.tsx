import React from "react";
import { FormGroup, Input, Label } from "reactstrap";
interface Props {
  handleChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => void;
  labelName: string;
  inputName: string;
  value?: string | number | readonly string[] | undefined;
  type?: "text" | "password" | "checkbox" | "number" | "date" | "select" | "textarea";
  disabled?: boolean;
  defaultChecked?: boolean | undefined;
  defaultValue?: string | number | readonly string[] | undefined;
  placeholder?: string | undefined
  minlength?: number;
  maxlength?: number;
}
function CFormGroupInput({ handleChange, inputName, labelName, value, type, disabled, defaultChecked, defaultValue, placeholder, minlength, maxlength }: Props) {
  return (
    <FormGroup>
      <Label>{labelName}</Label>
      <Input
        className="form-control"
        name={inputName}
        type={type ? type : "text"}
        onChange={handleChange}
        value={value}
        disabled={disabled}
        defaultChecked={defaultChecked}
        defaultValue={defaultValue}
        placeholder={placeholder}
        minLength={minlength} // Usar la propiedad minLength del input para limitar la longitud mínima
        maxLength={maxlength} // Usar la 
      />
    </FormGroup>
  );
}

export default CFormGroupInput;
