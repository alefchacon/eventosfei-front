import { useState } from 'react'
import {
    CardActionArea, 
    Button,
    Chip,
    Stack,
    styled
} from '@mui/material' 

function File({file}){

    return (
        <Button>{file.name}</Button>
    );
}

export default function UploadArea(){
    const [files, setFiles] = useState([])
    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
      });

      
    const parseFile = async (event) => {
        let droppedItems = [];

        if (event.dataTransfer.items) {
            [...event.dataTransfer.items].forEach((item, i) => {
                if (item.kind === "file") {
                    const file = item.getAsFile();
                    droppedItems.push(file)
                }
            });

        } else {
            [...event.dataTransfer.files].forEach((file, i) => {
                console.log(`… file[${i}].name = ${file.name}`);
            });
        }

        return droppedItems;
    }
    const dropHandler = async (event) => {
        event.preventDefault();

        const parsedFiles = await parseFile(event);
        
        setFiles(oldFiles => [...oldFiles, ...parsedFiles])

        //console.log(files)
    }

    function dragOverHandler (event){
        event.preventDefault();
    }

    return (
        <Stack display={'flex'}>
        <CardActionArea
            component="label"
            variant="contained"
            tabIndex={-1}
            className='upload-button'
            sx={{
                flexGrow: 1
            }}
        >
            <div 
                className="upload-button"
                onDrop={dropHandler}
                onDragOver={dragOverHandler}
            >
                Upload file
                <VisuallyHiddenInput type="file" multiple />
            </div>
        </CardActionArea>
        

        {files.map((file, index) => (
            <Chip key={index} variant='filled' label={file.name}></Chip>
        ))}
        <Button onClick={() => console.log(files)}>FILES</Button>
        </Stack>
    );
}