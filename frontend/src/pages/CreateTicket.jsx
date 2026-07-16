import "../css/ticket.css";
import usePageCSS from "../hooks/usePageCSS";


export default function CreateTicket() {
   usePageCSS("/css/ticket.css");  
  return (
    <div className="bg-black pt-20">
      <iframe
        src="https://centennialinfotech.tawk.help"
        title="Support Ticket"
        style={{
          width: "100%",
          height: "calc(100vh - 80px)",
          border: "none",
        }}
      />
    </div>
  );
}
