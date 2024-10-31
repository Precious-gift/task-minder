import { useState } from "react";
import "./DropArea.css";
import { Typography } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
const DropArea = ({ onDrop }) => {
  const [showDrop, setShowDrop] = useState(false);
  return (
    <section
      className={`${showDrop ? "drop_area" : "hide_drop"} last:flex-grow`}
      onDragEnter={() => setShowDrop(true)}
      onDragLeave={() => setShowDrop(false)}
      onDrop={() => {
        onDrop();
        setShowDrop(false);
      }}
      onDragOver={(e) => e.preventDefault()}
    >
      <Typography variant="h6">
        <AddRoundedIcon />
      </Typography>
    </section>
  );
};
export default DropArea;
