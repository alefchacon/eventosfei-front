import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Evaluation from "../pages/Evaluation";

function CustomTabPanel(props) {
  const { children, value, index, fetch, onSelect, ...other } = props;

  useEffect(() => {
    const isSelected = index === value;
    if (isSelected && fetch) {
      onSelect(fetch);
    }
  }, [value]);

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs({ children, onSelect }) {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", height: "fit-content" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          variant="scrollable"
          sx={{
            width: "100%",
          }}
        >
          {children.map((tab, index) => (
            <Tab key={index} label={tab.props.label} {...a11yProps(index)} />
          ))}
        </Tabs>
      </Box>
      {children.map((tab, index) => (
        <CustomTabPanel
          key={index}
          value={value}
          index={index}
          fetch={tab.props.fetch}
          onSelect={onSelect}
        >
          {tab}
        </CustomTabPanel>
      ))}
    </Box>
  );
}
