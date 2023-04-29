import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';


function ClientHistory() {
  const [clientData, setClientData] = useState(null);
  const url = window.location.href;
  const id = url.split("/").pop(); // Obtener la id de la URL actual


  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        `https://disfracesrosario.up.railway.app/costumes/${id}/history`
      );
      setClientData(result.data);
    };
    fetchData();
  }, [id]);
  
  return (
    <div>
      {clientData && (
        <table>
          <thead>
            <tr>
              <th style={{ padding: "0 10px" }}>Nombre</th>
              <th style={{ padding: "0 10px" }}>Apellido</th>
              <th style={{ padding: "0 10px" }}>ID Transaccion</th>
              <th style={{ padding: "0 10px" }}>Precio</th>
              <th style={{ padding: "0 10px" }}>Forma de pago</th>
              <th style={{ padding: "0 10px" }}>Nombre disfraz</th>
              <th style={{ padding: "0 10px" }}>Fecha de entrega</th>
              <th style={{ padding: "0 10px" }}>Tipo de Factura</th>
              <th style={{ padding: "0 10px" }}>Factura</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "0 10px" }}>{clientData.clientName}</td>
              <td style={{ padding: "0 10px" }}>{clientData.clientLastName}</td>
            </tr>
            {clientData.transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td></td>
                <td></td>
                <td  style={{ padding: "7px 40px" }}>{transaction.id}</td>
                <td  style={{ padding: "7px 10px" }}>{transaction.amount}</td>
                <td  style={{ padding: "7px 25px" }}>{transaction.type}</td>
                <td  style={{ padding: "7px 10px" }}>{transaction.names[0]}</td>
                <td  style={{ padding: "7px 10px" }}>{transaction.reservationDate}</td>
                <td  style={{ padding: "7px 10px" }}>{transaction.deadline}</td>
                <td  style={{ padding: "7px 10px" }}>{transaction.checkIn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ClientHistory;