import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
// import uploadImg from "../assets/uploadImg.png";

const fileTypes = ["JPG", "PNG", "PDF"];

function Uploader() {
    const [file, setFile] = useState(null);
    const handleChange = (file) => {
        setFile(file);
        console.log('changes', file);
    };

    console.log(file);
    return (
        <div className="App">
            <h1>File upload</h1>
            <FileUploader
                multiple={true}
                // children={
                //     <div className="box">
                //         <img src={uploadImg} width={60} height={60} alt="" />
                //         <p>Upload or drop a file right here</p>
                //     </div>
                // }
                hoverTitle="Drop here"
                handleChange={handleChange}
                name="file"
                types={fileTypes}
            />
            <p>{file ? `File name: ${file[0].name}` : "No files uploaded."}</p>
            <button onClick={() => setFile(null)}>Clear File</button>
        </div>
    );
}

export default Uploader;