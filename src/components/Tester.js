import { Button, Progress, Space, Upload, Typography, message } from "antd";
import { FileOutlined, CloudUploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useState } from "react";
const Tester = () => {

    const [files, setfiles] = useState({});
    const [errorMessage, setErrorMessage] = useState("");


    const handleFileUpload = async ({ file }) => {
        // console.log(file);
        const getFileObject = (progress, estimated) => {
            return {
                name: file.name,
                uid: file.uid,
                size: file.size,
                progress: progress,
                estimated: estimated || 0,

            };
        };

        // const formData = new FormData();
        // formData.append('file', file);
        // console.log("FormData:",formData);

        // console.log(file);
        const Obj = {
            fileId: file.uid,
            filepath: file.name,
            uploadMonth: '',
            uploadDay: '',
            uploadYear: '',
            uploadTime: file.lastModifiedDate,
            owner: '',
            size: file.size,
            expirationMonth: '',
            expirationDay: '',
            expirationYear: '',
            source: '',
            tags: '',
            projectId: ''

        }

        console.log(Obj);
        const req = await axios.post('http://localhost:8000/fileUpload', Obj, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
            onUploadProgress: (event) => {
                // console.log(event);
                setfiles(pre => {
                    return { ...pre, [file.uid]: getFileObject(event.progress, event.estimated) };
                })
            },
        });
        // console.log(req);



    };

    const totalSize = Object.values(files).reduce((total, current) => {
        // console.log(current)
        total = Math.floor(total + (current.size / (1024 * 1024))) //convert bytes to MB
        return total
    }, 0);

    const beforeUpload = (file) => {
        const maxFileSize = 250 * 1024 * 1024; // 250MB limit
        if (file.size > maxFileSize) {
            // Notify the user that the file size exceeds the limit
            message.error(`${file.name} file upload failed.`);
            console.error("File size exceeds the limit of 250MB");
            return false; // Prevent uploading files larger than 250MB
        }
        setErrorMessage("");
        return true; // Allow uploading files smaller than 250MB
    };



    const getTimeString = (timeInSeconds) => {
        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor(timeInSeconds / 60 - hours * 60);
        const seconds = Math.floor(timeInSeconds - minutes * 60 - hours * 3600);
        let timeString = `${seconds} sec`;
        if (minutes) {
            timeString = `${minutes} min ${timeString}`
        }
        if (hours) {
            timeString = `${hours} hrs ${timeString}`;
        }
        return timeString;
    };

    return (
        <Space direction="vertical" style={{ width: "100vw", display: "flex", justifyContent: "center", alignItems: "center", marginTop: 134, }}>
            {errorMessage && (<Typography.Text type="danger">{errorMessage}</Typography.Text>)}
            <Upload.Dragger
                data-testid="upload-input"
                multiple
                customRequest={handleFileUpload}
                showUploadList={false}
                beforeUpload={beforeUpload}
                style={{ width: 560, marginRight: 14 }}

            >
                <p className="ant-upload-drag-icon">
                    <CloudUploadOutlined style={{ fontSize: '80px', color: '#000' }} />
                </p>
                Drag and Drop files here OR <Button>Click to Upload</Button>
            </Upload.Dragger>
            <Typography.Text type="secondary" style={{ marginLeft: -280 }}>Total size: {totalSize} MB</Typography.Text>

            <div style={{ maxHeight: 190, overflowY: 'scroll', width: 575, paddingRight: 1, scrollbarWidth: 'thin' }}>
                {Object.values(files).map((file, index) => {
                    return (
                        <Space
                            direction="vertical"
                            style={{
                                backgroundColor: "rgba(0,0,0,0.05)",
                                width: 545,
                                padding: 7,
                                borderRadius: 8,
                                marginTop: 8,
                                marginBottom: 8
                            }}
                            key={index}
                        >
                            <Space>
                                <FileOutlined />
                                <Typography>{file.name}</Typography>
                                {file.estimated ? (<Typography.Text type="secondary">{" "} is being uploaded in {getTimeString(file.estimated)} seconds
                                </Typography.Text>) : (<Typography.Text type="secondary">{" "} is uploaded successfully.</Typography.Text>)}
                            </Space>
                            <Progress percent={Math.ceil(file.progress * 100)} />
                        </Space>
                    );

                })}
            </div>
        </Space>
    );
};
export default Tester;