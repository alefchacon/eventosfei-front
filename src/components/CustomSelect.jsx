import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Select, MenuItem, FormControl } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

const options = [
  { id: 1, name: "Auditorio" },
  { id: 2, name: "Audiovisual" },
  { id: 3, name: "Baño" },
];

function ConfirmationDialogRaw(props) {
  const { options, onClose, value: valueProp, open, ...other } = props;
  const [value, setValue] = React.useState(valueProp);
  const radioGroupRef = React.useRef(null);

  React.useEffect(() => {
    if (!open) {
      setValue(valueProp);
    }
  }, [valueProp, open]);

  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    onClose(value);
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <Dialog
      sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }}
      maxWidth="xs"
      TransitionProps={{ onEntering: handleEntering }}
      open={open}
      {...other}
    >
      <DialogTitle>Espacio</DialogTitle>
      <DialogContent dividers>
        <RadioGroup
          ref={radioGroupRef}
          aria-label="ringtone"
          name="ringtone"
          value={value}
          onChange={handleChange}
        >
          {options.map((option) => (
            <FormControlLabel
              value={option.id}
              key={option.id}
              control={<Radio />}
              label={option.name}
            />
          ))}
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Cancelar
        </Button>
        <Button onClick={handleOk}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
}

function Menu({ label = "label" }) {
  return (
    <ListItemButton>
      <Stack
        spacing={-2}
        paddingLeft={5}
        paddingRight={5}
        width={"100%"}
        display={"flex"}
        justifyContent={"center"}
      >
        <Typography variant="h6">{label}</Typography>
        <FormControl fullWidth>
          <Select
            id="demo-simple-select"
            value={10}
            label="Age"
            sx={{
              border: "none", // Remove border
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none", // Remove border specifically for outlined variant
              },
              "&:hover": {
                ".MuiOutlinedInput-notchedOutline": {
                  border: "none", // Ensure border stays removed on hover
                },
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                border: "none", // Remove border on focus
                boxShadow: "none", // Optional: remove focus shadow if desired
              },
              "& .MuiInputBase-input": {
                padding: "0",
                paddingTop: "10px",
              },
            }}
          >
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    </ListItemButton>
  );
}

ConfirmationDialogRaw.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  value: PropTypes.number.isRequired,
};

export default function ConfirmationDialog({ options }) {
  const [openModal, setOpenModal] = React.useState(false);
  const [value, setValue] = React.useState(1);

  const handleClickListItem = () => {
    setOpenModal(true);
  };

  const handleClose = (newValue) => {
    setOpenModal(false);

    if (newValue) {
      setValue(newValue);
    }
  };

  function convertValueToSpaceName(value) {
    return options.filter((option) => option.id === parseInt(value))[0].name;
  }

  return (
    <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
      <List component="div" role="group">
        <ListItemButton
          divider
          aria-haspopup="true"
          aria-controls="ringtone-menu"
          aria-label="phone ringtone"
          onClick={handleClickListItem}
        >
          <ListItemText
            primary="Espacio"
            secondary={convertValueToSpaceName(value)}
          />
        </ListItemButton>
        <Menu></Menu>
      </List>
    </Box>
  );
}
