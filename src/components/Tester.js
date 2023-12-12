import { Button, Progress, Space, Upload, Typography } from "antd";
import { FileOutlined, CloudUploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useState } from "react";

const Tester = () => {

    const [files, setfiles] = useState({})
    const [maxSize, setmaxSize] = useState(false)
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

        const formData = new FormData();
        formData.append('file', file);

        const totalSize = Object.values(files).reduce((total, current) => {
            total += current.size / (1024 * 1024); // convert bytes to MB
            return total;
        }, 0);

        // Check if adding the current file exceeds the limit
        if ((totalSize + file.size / (1024 * 1024)) > 250) {
            setmaxSize(true);
            return; // Prevent further processing
        }


        const req = await axios.post('http://localhost:8000/fileUpload', formData, {
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

    const totalSize = Object.values(files).reduce((total,current)=>{
        // console.log(current)
        total=Math.floor(total+(current.size/(1024*1024))) //convert bytes to MB
        return total
    },0);

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
            <Upload.Dragger
                multiple
                customRequest={handleFileUpload}
                showUploadList={false}
                style={{ width: 560, marginRight: 14 }}
                disabled={maxSize}
            >
                <p className="ant-upload-drag-icon">
                    <CloudUploadOutlined style={{ fontSize: '80px', color: '#000' }} />
                </p>
                Drag and Drop files here OR <Button>Click to Upload</Button>
            </Upload.Dragger>
            {maxSize ? (<Typography.Text type="danger" style={{marginLeft:-280}}>Total size exceeds 250MB</Typography.Text>) 
            : (<Typography.Text type="secondary" style={{marginLeft:-280}}>Total size: {totalSize} MB</Typography.Text>)}
            
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