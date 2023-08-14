import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Ticket } from "./Ticket";

interface TicketPrintProps {
  children: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
}

export const TicketPrint: React.FC<TicketPrintProps> = () => {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div>
      <Ticket ref={componentRef} />
      <button onClick={handlePrint}>Imprimir ticket</button>
    </div>
  );
};
