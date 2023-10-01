import "./ventas.scss";
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns, userRows } from "../../datatablesource2";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Input } from "@mui/joy";
import Single6 from "../single6/Single6";
import Button from "@mui/joy/Button";
import Calendario from "../calendario/Calendario";
import BasicGrid from "../single6/Single6";
import Productos from "../productos/Productos1";
import axios from "axios";
import Check from "../check/Check";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import { DatePicker, Space } from "antd";
import { FormControlLabel, Checkbox } from "@material-ui/core";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';


const Datatable = ({ singleId }) => {
  const [selectedDni, setSelectedDni] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("");
  const [clientId, setClientId] = useState("");
  const [costumeIds, setCostumeIds] = useState([]);
  const [checkIn, setCheckIn] = useState([]);
  const [id, setId] = useState("");
  const [partialPayment, setPartialPayment] = useState("");
  const [reservationDate, setReservationDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [selectedCostumeIds, setSelectedCostumeIds] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [newConstant, setNewConstant] = useState(0);
  const [isInvoiceChecked, setIsInvoiceChecked] = useState(false);
  const [partialPaymentAmount, setPartialPaymentAmount] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [selectedQuantities, setSelectedQuantities] = useState({});
  const [open, setOpen] = useState(false);
  const [data2, setData2] = useState(null);
  const [clientName, setClientName] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [modalShouldOpenWithData, setModalShouldOpenWithData] = useState(false);
  const [requestData, setRequestData] = useState(null);
  const [productQuantities, setProductQuantities] = useState({});
  const navigate = useNavigate();


  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  function calculateTotalAmount(products) {
    let totalAmount = 0;
    products.forEach((product) => {
      totalAmount += product.nameProduct * product.quantity;
    });
    return totalAmount;
  }

  const handleInvoiceChange = (event) => {
    setIsInvoiceChecked(event.target.checked);
  };

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
  };
  const [data, setData] = useState(userRows);

  const actionColumn = [
    {
      field: "action",
      headerName: "Accion",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to="/user" style={{ textDecoration: "none" }}>
              <div className="viewButton">Detalles</div>
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row.id)}
            >
              Borrar
            </div>
          </div>
        );
      },
    },
  ];

  const handleCostumeSelect = (productId, quantity, price, nameProduct) => {
    const newProduct = {
      productId: productId,
      quantity: quantity,
      price: price,
      nameProduct: nameProduct,
    };
    setSelectedProducts([...selectedProducts, newProduct]);
    setProductQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: quantity,
    }));

    calculateTotalAmount([...selectedProducts, newProduct]);
  };
  const handleCheckInChange = (name, checked) => {
    if (checked) {
      setCheckIn([...checkIn, name]);
    } else {
      setCheckIn(checkIn.filter((item) => item !== name));
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("partialPayment", e.target.elements.partialPayment.value);
    // enviar formData al servidor
  };

  const [error, setError] = useState(null);

  const onCostumeSelect = (id) => {
    // Verificar si la ID ya está seleccionada
    if (!selectedCostumeIds.includes(id)) {
      // Añadir la ID seleccionada a la lista de IDs previamente seleccionadas
      const updatedIds = [...selectedCostumeIds, id];
      setSelectedCostumeIds(updatedIds);

      // Establecer el valor del estado costumeIds como un array de cadenas de texto
      const idsString = updatedIds.join(",");
      setCostumeIds(idsString);

      // Mostrar las IDs que se van sumando en la consola
      console.log(`IDs seleccionadas: ${idsString}`);
    }
  };

  const handleAccept = () => {
    const selectedRowsData = selectedRows.map((rowId) =>
      data.find((row) => row.id === rowId)
    );

    const products = selectedRowsData.map((row) => ({
      productId: row.id,
      quantity: selectedQuantities[row.id] || 1,
      price: row.price,
      nameProduct: row.nameProduct,
    }));

    const requestData = {
      type,
      clientId,
      products: selectedProducts,
      checkIn: checkIn.join(","),
    };

    const partialPaymentAmount = amount - partialPayment;

    setData2(requestData);
    console.log(data2);
    if (selectedProducts.length === 0) {
      alert("Seleccione al menos un producto para la venta.");
      return;
    }
    setModalShouldOpenWithData(true);
    setOpen(true);
  };


  const handleConfirmSale = () => {
    // Establece el estado de requestData
    setRequestData({
      type,
      clientId,
      products: selectedProducts,
      checkIn: checkIn.join(","),
    });
  };
  useEffect(() => {
    if (requestData !== null) {
      // Realiza acciones que dependan de requestData aquí
      axios
        .post(
          "https://disfracesrosario.up.railway.app/transactions/newTransactionSale",
          requestData
        )
        .then((response) => {
          const responseData = response.data;
          console.log(responseData);
          setOpen(true);  // abre el modal 


          const remitoData = {
            id: responseData.id,
            amount: responseData.amount,
            type: responseData.type,
            clientId: responseData.clientId,
            products: responseData.products,
            checkIn: responseData.checkIn,
            clientName: responseData.clientName,
            clientLastName: responseData.clientLastName,
            clientAdress: responseData.clientAdress,
            clientDocument: responseData.clientDocument,
            transactionDetails: responseData.transactionDetails,
            billPayment: responseData.billPayment,
            statusPayment: responseData.statusPayment,
            clientPhone: responseData.clientPhone,
          };

          const generateRemitoPDF = async (responseData) => {
            const pdfDoc = await PDFDocument.create();
            const page = pdfDoc.addPage([595.28, 841.89]);
            const { width, height } = page.getSize();
            const currentDate = new Date();
            const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1
              }/${currentDate.getFullYear()}`;

            // Cargar la imagen de fondo
            const imageUrl =
              "https://res.cloudinary.com/dnoiowgmm/image/upload/v1696116038/plantillaRemito_edit_2_1_jgbxfz_wy22w5.png"; // URL de la imagen o ruta local
            const imageBytes = await fetch(imageUrl).then((res) =>
              res.arrayBuffer()
            );
            const backgroundImage = await pdfDoc.embedPng(imageBytes);
            const fontSize = 9;
            // Agregar contenido al PDF utilizando la biblioteca pdf-lib
            page.drawImage(backgroundImage, { x: 0, y: 0, width: width, height: height, opacity: 1 });

            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
            page.setFont(font);
            page.setFontSize(fontSize);

            page.drawText(`Fecha: ${formattedDate}`, { x: 370, y: height - 195, fontSize });
            page.drawText(`Remito N°\n   ${responseData.id}`, { x: 390, y: height - 140, fontSize });
            page.drawText(`TOTAL : ${responseData.amount}`, { x: 365, y: height - 655, fontSize });
            page.drawText(`Nombre del cliente: ${responseData.clientName} ${responseData.clientLastName}`, { x: 100, y: height - 227, fontSize });
            page.drawText(`DNI: ${responseData.clientDocument}`, { x: 100, y: height - 241, fontSize });
            page.drawText(`Direccion: ${responseData.clientAdress}`, { x: 100, y: height - 255, fontSize });
            page.drawText(`Tipo: ${responseData.type}`, { x: 100, y: height - 269, fontSize });
            page.drawText(`Telefono: ${responseData.clientPhone}`, { x: 100, y: height - 284, fontSize });
            page.drawText(`identificafdor: ${responseData.clientId}`, { x: 100, y: height - 299, fontSize });
            page.drawText(`Observaciones:  ${responseData.detail}`, { x: 100, y: height - 670, fontSize });
            page.drawText("Detalles de la transacción:", { x: 10, y: height - 10, fontSize });



            responseData.transactionDetails.forEach((detail, index) => {
              page.drawText(`${detail.product}`, { x: 170, y: height - 360 - (20 * index), fontSize });
              page.drawText(`${detail.quantity}`, { x: 320, y: height - 360 - (20 * index), fontSize });
              page.drawText(`${detail.totalUnitario}`, { x: 365, y: height - 360 - (20 * index), fontSize });
              page.drawText(`${detail.totalProduct}`, { x: 425, y: height - 360 - (20 * index), fontSize });
              page.drawText(`${detail.productId}`, { x: 120, y: height - 360 - (20 * index), fontSize });
            });

            // Añadir más campos y detalles según sea necesario

            const pdfBytes = await pdfDoc.save();

            return pdfBytes;
          };

          const generatePDFPreview = async (pdfBytes) => {
            const pdfDataUri =
              "data:application/pdf;base64," +
              btoa(String.fromCharCode(...pdfBytes));

            const viewer = document.getElementById("pdf-viewer");
            viewer.src = pdfDataUri;
          };

          // Generar el PDF del remito
          generateRemitoPDF(responseData)
            .then((pdfBytes) => {
              // Generar la vista previa del PDF
              generatePDFPreview(pdfBytes);

              const blob = new Blob([pdfBytes], { type: "application/pdf" });

              // Descargar el PDF en el navegador del usuario
              //COMENTAR CUANDO NO SE QUIERE DESCARGAR PARA PROBAR
              const currentDateRem = new Date();
              const formattedDateRem = `${currentDateRem.getDate()}/${currentDateRem.getMonth() + 1}/${currentDateRem.getFullYear()}/
             ${currentDateRem.getHours()}Hs /  ${currentDateRem.getMinutes()}Min / ${currentDateRem.getSeconds()} Seg`;
              const fileName = `${responseData.clientName}_${responseData.clientLastName}_${formattedDateRem}_remito.pdf`;
              saveAs(blob, fileName);

              setCheckIn([]);
            })
            .catch((error) => {
              console.log("Error al generar el PDF:", error);
            });

          // Generar el remito utilizando remitoData
          console.log("Remito:", remitoData);

          setOpen(false);  // cierro el modal una vez terminada la venta
          setCheckIn([]);
          alert("Venta realizada correctamente");
          navigate('/');

        })
        .catch((error) => {
          alert(error.response.data.details);
          setError(error.response.data.details);
        });
    }
  }, [requestData]);

  const handleImageUrlChange = (url, clientIdValue) => {
    setImageUrl(url);
    setClientId(clientIdValue);
  };

  const handleSelect = (id, quantity, name, price) => {
    const updatedIds = [...selectedCostumeIds];
    const existingIndex = updatedIds.indexOf(id);

    if (existingIndex !== -1) {
      // Si el producto ya está seleccionado, actualiza la cantidad
      const updatedQuantities = { ...selectedQuantities };
      updatedQuantities[id] = quantity;
      setSelectedQuantities(updatedQuantities);
    } else {
      // Si el producto no está seleccionado, agrega el nuevo producto a la lista
      updatedIds.push(id);
      setSelectedCostumeIds(updatedIds);
      onCostumeSelect(id, quantity, name, price);
    }

    console.log(`IDs seleccionadas: ${updatedIds.join(", ")}`);
  };

  const handleSelectionChange = (selection) => {
    const selectedIds = selection.map((selectedRow) => selectedRow.id);
    handleSelect(selectedIds);
  };

  const handleIdChange = (id) => {
    setClientId(id);
  };

  const handleNameChange = (name) => {
    setClientName(name);
  };

  const handleCancel = () => {
    alert('la pagina se reiniciará para volver a cargar el pedido, este pedido no será registrado')
    window.location.reload(); // Recarga la página
  };

  return (
    <div className="datatable">
      {error && <p>{error}</p>}
      <Button variant="contained" endIcon={<SendIcon />}>
        <a href="/">Volver</a>
      </Button>
      <div className="info-cliente">
        <BasicGrid
          onImageUrlChange={handleImageUrlChange}
          onIdChange={handleIdChange}
          onNameChange={handleNameChange}
        />
      </div>
      <div className="id"></div>
      <div className="id"></div>
      <div className="tabla">
        <Productos
          onCostumeSelect={handleCostumeSelect}
          selectedQuantities={productQuantities}
        />
      </div>
      <div className="info"></div>
      <div className="botones">
        <TextField
          color="info"
          select
          label="Tipo"
          variant="outlined"
          value={type}
          onChange={handleTypeChange}
          style={{ minWidth: "100px" }}
        >
          <MenuItem value="mercado_pago">Mercado Pago</MenuItem>
          <MenuItem value="efectivo">Efectivo</MenuItem>
          <MenuItem value="tarjeta">Tarjeta</MenuItem>
          <MenuItem value="factura electronica">
            Factura electronica (Marcar Casillero)
          </MenuItem>
        </TextField>
      </div>

      <div className="check">
        <div className="check">
          <div className="invoice">
            <FormControlLabel
              control={
                <Checkbox
                  checked={isInvoiceChecked}
                  onChange={handleInvoiceChange}
                  name="invoice"
                  color="primary"
                />
              }
              label="Facturación Electrónica"
            />
            {isInvoiceChecked && (
              <Button variant="outlined" color="info">
                <a
                  target="_blank"
                  href="https://auth.afip.gob.ar/contribuyente_/login.xhtml?action=SYSTEM&system=rcel"
                >
                  Generar Factura
                </a>
              </Button>
            )}
          </div>
          <Check name="Banco" onCheckInChange={handleCheckInChange} />
          <Check name="Remito" onCheckInChange={handleCheckInChange} />
        </div>
      </div>

      <div className="final">
        <Button onClick={handleAccept} color="primary">
          Aceptar
        </Button>
        <Dialog open={open} onClose={() => setOpen(false)}>
          {/* Contenido del modal */}
          <DialogTitle>Confirmación de la venta</DialogTitle>
          <DialogContent>
            {modalShouldOpenWithData && data2 && (
              <div>
                <h3>Verifique que los datos de la venta sean correctos:</h3>
                <p>Monto: {data2.clientName}</p>
                <p>Tipo: {data2.type}</p>
                <p>Identificador de cliente: {data2.clientId}</p>
                <p>Productos:</p>
                <ul>
                  {data2.products &&
                    data2.products.map((product, index) => (
                      <li key={index}>
                        {product.nameProduct} {product.price}, Cantidad:{" "}
                        {product.quantity} {product.quantity * product.nameProduct}
                      </li>
                    ))}
                </ul>
                <p>Monto total: {calculateTotalAmount(data2.products)}</p>
              </div>
            )}
          </DialogContent>


          <DialogActions>
            <Button onClick={(handleCancel)} color="primary">
              Cancelar
            </Button>
            <Button onClick={handleConfirmSale} color="primary">
              Confirmar venta
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default Datatable;