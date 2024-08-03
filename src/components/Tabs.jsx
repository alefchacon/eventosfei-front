import { useState, useEffect, isValidElement } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Evaluation from "../pages/Evaluation";

function CustomTabPanel({ children, value, index, onSelect }) {
  useEffect(() => {
    const isSelected = index === value;
    if (isSelected && onSelect) {
      onSelect();
    }
  }, [value]);

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  onSelect: PropTypes.func,
};

CustomTabPanel.defaultProps = {
  onSelect: null,
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

  children = children.filter((child) => isValidElement(child));

  return (
    <Box sx={{ width: "100%", height: "fit-content" }} className={"asdf"}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }} className={"asdf"}>
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
          onSelect={tab.props.onSelect}
        >
          {tab}
        </CustomTabPanel>
      ))}
    </Box>
  );
}
