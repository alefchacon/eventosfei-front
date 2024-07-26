import ListItemButton from "@mui/material/ListItemButton";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import DownloadIcon from "@mui/icons-material/Download";

export default function FileItem({ fileObject }) {
  function downloadFile(fileObject) {
    const binaryString = atob(fileObject.file);

    const len = binaryString.length;
    const byteArray = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      byteArray[i] = binaryString.charCodeAt(i);
    }

    const blob = new Blob([byteArray], { type: fileObject.type });

    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileObject.name;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  }

  return (
    <ListItemButton divider onClick={() => downloadFile(fileObject)}>
      <ListItem>
        <ListItemText primary={fileObject.name}></ListItemText>
        <DownloadIcon color="primary"></DownloadIcon>
      </ListItem>
    </ListItemButton>
  );
}
