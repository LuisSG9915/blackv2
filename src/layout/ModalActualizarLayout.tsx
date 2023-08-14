import { Modal, ModalHeader, ModalBody, FormGroup, ModalFooter } from "reactstrap";
import CButton from "../components/CButton";
import { Medico } from "../models/Medico";
import { Forma } from "../hooks/useReadHook";

interface Props {
  children: JSX.Element | JSX.Element[];
  modalActualizar: boolean;
  editar: (dato: Medico) => void;
  cerrarModalActualizar: () => void;
  form: Forma;
  nombreActualizar: string;
}

function ModalActualizarLayout({
  children,
  modalActualizar,
  cerrarModalActualizar,
  editar,
  form,
  nombreActualizar,
}: Props) {
  return (
    <Modal isOpen={modalActualizar}>
      <ModalHeader>
        <div>
          <h3>{nombreActualizar}</h3>
        </div>
      </ModalHeader>
      <ModalBody>{children}</ModalBody>
      <ModalFooter>
        <CButton color="primary" onClick={() => editar(form)} text="Editar" />
        <CButton color="danger" onClick={cerrarModalActualizar} text="Cancelar" />
      </ModalFooter>
    </Modal>
  );
}

export default ModalActualizarLayout;
