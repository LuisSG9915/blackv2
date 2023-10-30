import React from "react";
import { FormGroup, Input, Label } from "reactstrap";
interface Props {
  handleChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => void;
  labelName: string;
  inputName: string;
  value?: string | number | readonly string[] | undefined;
  type?: "text" | "password" | "checkbox" | "number" | "date";
  disabled?: boolean;
  defaultChecked?: boolean | undefined;
  defaultValue?: string | number | readonly string[] | undefined;
  placeholder?: string | undefined

}
function CFormGroupInput({ handleChange, inputName, labelName, value, type, disabled, defaultChecked, defaultValue, placeholder }: Props) {
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
      />
    </FormGroup>
  );
}

export default CFormGroupInput;
