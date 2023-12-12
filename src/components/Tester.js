import { Button, Progress, Space, Upload, Typography } from "antd";
import { FileOutlined, CloudUploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useState } from "react";

const Tester = () => {

    const [files, setfiles] = useState({})
    const handleFileUpload = async ({ file }) => {
        // console.log(file);
        const getFileObject = (progress, estimated) => {
            return {
                name: file.name,
                uid: file.uid,
                progress: progress,
                estimated: estimated || 0,

            };
        };

        const formData = new FormData();
        formData.append('file', file);


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
        <Space direction="vertical" style={{ width: "100vw", display: "flex", justifyContent: "center", alignItems: "center", marginTop: 24, }}>
            <Upload.Dragger
                multiple
                customRequest={handleFileUpload}
                showUploadList={false}
                style={{ width: 545 }}
                beforeUpload={(file) => {
                    console.log(file)
                }}
            >
                <p className="ant-upload-drag-icon">
                    <CloudUploadOutlined style={{ fontSize: '80px', color: '#000' }} />
                </p>
                Drag and Drop files here OR <Button>Click to Upload</Button>
            </Upload.Dragger>
            <div style={{ maxHeight: 190, overflowY: 'scroll', width: 545, paddingRight: 1, scrollbarWidth: 'thin' }}>
                {Object.values(files).map((file, index) => {
                    return (
                        <Space
                            direction="vertical"
                            style={{
                                backgroundColor: "rgba(0,0,0,0.05)",
                                width: 500,
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