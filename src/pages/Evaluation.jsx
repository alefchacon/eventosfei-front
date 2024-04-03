import { useState } from 'react'
import TextField from '@mui/material/TextField';
import RadioGroup from '../components/RadioGroup.jsx'
import Rating from '../components/Rating.jsx'
import Progress from '../components/Progress.jsx'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CreateEvaluation from '../api/EvaluationApi.js';
import ItemUpload from '../components/ItemUpload.jsx';
import TextArea from '../components/TextArea.jsx';
import Divider from '@mui/material/Divider';


import Typography from '@mui/material/Typography';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >

          <Box sx={{ p: 3 }}>
            <div>{children}</div>
          </Box>
        
      </div>
    );
  }

export default function Form () {
    const [value, setValue] = useState(0);

    const [attentionRating, setAttentionRating] = useState(0);
    const [spaceRating, setSpaceRating] = useState(0);
    const [computerCenterRating, setComputerCenterRating] = useState(0);
    const [resourcesRating, setResourcesRating] = useState(0);
    const [communicationRating, setCommunicationRating] = useState(0);

    const handleChangePage = (pageIndex) => {
        setValue(pageIndex)
    };

    async function createEvaluation(){
        const evaluation = {
            calificacionAtencion: attentionRating,
            razonCalificacionAtencion : document.querySelector('#attentionRatingReason').value,
            calificacionComunicacion: parseInt(communicationRating),
            mejorasApoyo : document.querySelector('#supportImprovements').value,
            calificacionEspacio: spaceRating,
            problemasEspacio : document.querySelector('#spaceProblems').value,
            calificacionCentroComputo: computerCenterRating,
            razonCalificacionCentroComputo : document.querySelector('#computerCenterRatingReason').value,
            calificacionRecursos: resourcesRating,
            razonCalificacionRecursos : document.querySelector('#resourcesRatingReason').value,
            problemaRecursos : document.querySelector('#resourcesProblems').value,
            mejorasRecursos : document.querySelector('#resourcesImprovements').value,
            adicional : document.querySelector('#additional').value,
            idEvento: 1
        }
        //console.log(await CreateEvaluation(evaluation))
        const evidences = document.querySelector('#evidences').files;
        for(var i = 0; i < evidences.length; i++) {
            console.log("Filename: " + evidences[i].name);
        }
    }

    return (
        <div>
            <div className='form'>
                <Box
                    noValidate
                    autoComplete="off"
                    //bgcolor='red'
                    sx = {{
                        flexGrow: 1,
                    }}
                >

                <CustomTabPanel value={value} index={4}>
                    <div className="form-page">
                    <Typography variant='h5'>Coordinación de Eventos Académicos</Typography>

                        <Rating 
                            question="¿Cómo calificaría la atención recibida por parte de la Coordinación de Eventos Académicos?                            " 
                            setRating={setAttentionRating}></Rating>
                        <TextArea 
                            question='Por favor, explique los factores que contribuyeron a su calificación anterior                            '
                            placeholder='Los maestros me atendieron rápida y amablemente...'
                        />
                        <RadioGroup onRadioChange={setCommunicationRating}></RadioGroup>
                        <TextArea 
                            question='¿Hubo algún aspecto en el que el apoyo de la Coordinación de Eventos pudiera haber mejorado? (Describa brevemente)'
                            placeholder='Nada, todo estuvo perfecto.'
                        />
                    </div>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={3}>
                    <div className="form-page">
                        <Rating setRating={setSpaceRating}></Rating>
                        <TextField
                            id="spaceProblems"
                            label="Multiline"
                            multiline
                            maxRows={4}
                            variant="filled"
                        />
                    </div>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={2}>
                    <div className="form-page">
                        <Rating setRating={setComputerCenterRating}></Rating>
                        <TextField
                            id="computerCenterRatingReason"
                            label="Multiline"
                            multiline
                            maxRows={4}
                            variant="filled"
                        />
                        <Rating setRating={setResourcesRating}></Rating>

                        <TextField
                            id="resourcesRatingReason"
                            label="Multiline"
                            multiline
                            maxRows={4}
                            variant="filled"
                        />
                        <TextField
                            id="resourcesProblems"
                            label="Multiline"
                            multiline
                            maxRows={4}
                            variant="filled"
                        />
                        <TextField
                            id="resourcesImprovements"
                            label="Multiline"
                            multiline
                            maxRows={4}
                            variant="filled"
                        />
                    </div>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <input type="file" multiple id='evidences'/>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={0}>
                    <div className="form-page">
                        <TextField
                            id="additional"
                            label="Multiline"
                            multiline
                            maxRows={4}
                            variant="filled"
                        />
                        <Button variant="contained" onClick={() => createEvaluation()}>Enviar</Button>
                    </div>
                </CustomTabPanel>
                </Box>


                <Progress props={{asdf: "asdf", qwer: "qwer"}} changePage={handleChangePage}></Progress>
            </div>
        </div>
    );
}