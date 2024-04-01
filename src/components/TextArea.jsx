import { useState, useMemo } from 'react'
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';


export default function TextArea (props) {
    const {
        question = "pregunta",
        placeholder = "pista",
    } = props
    const [text, setText] = useState("N/A")
    const [invalidText, setInvalidText] = useState(false)

    const [value, setValue] = useState();

    // Memo that returns true if value is "error"
    const hasError = useMemo(() => !isAlphanumeric(value), [value]);
  
    // Memo that returns a helper message if value is "error" or a blank string if not
    const getHelperText = useMemo(() => (
        isAlphanumeric(value) ? "" : "Sólo puede ingresar números y letras."),[value]
    );

    function handleChange(event) {
        setValue(event.target.value);
    }

    function isAlphanumeric(str) {
        return /^[a-zA-Z0-9 ,.¡!¿?'"]+$/.test(str);
      }

    return (
        <>
            <Typography variant='subtitle1'>{question}</Typography>
            <TextField
                multiline
                rows={4}
                variant="filled"
                helperText={getHelperText}
                placeholder={placeholder}
                onChange={handleChange}
                error={hasError}
            />
        </>
    );
}