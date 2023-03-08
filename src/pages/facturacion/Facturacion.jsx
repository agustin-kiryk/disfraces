import "./facturacion.scss";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import IconButton from '@mui/material/IconButton';

const Featured = () => {
  return (
    <div className="featured">
     
      <div className="bottom">
        <div className="featuredChart">
        </div>
        <p className="title">Ingresos Totales del Mes</p>
        <p className="amount">$100.000</p>

        <p className="desc">
        </p>
        <div className="summary">
          <div className="item">
            <div className="itemResult negative">
            </div>
          </div>
          <div className="item">
            <div className="itemResult positive">
            </div>
          </div>
          <div className="item">
            <div className="itemResult positive">
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Featured;
