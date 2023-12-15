import { Button, Progress, Space, Upload, Typography, message } from "antd";
import { FileOutlined, CloudUploadOutlined, CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons'; // Added CheckCircleOutlined
import axios from 'axios';
import { useState } from "react";

const Tester = () => {
    const [files, setFiles] = useState({});
    const [errorMessage, setErrorMessage] = useState("");

    const handleFileUpload = async ({ file }) => {
        const getFileObject = (progress, estimated) => {
            return {
                name: file.name,
                uid: file.uid,
                size: file.size,
                progress: progress,
                estimated: estimated || 0,
                isError: false, // Flag to indicate error
            };
        };

        const metadata = {
            filepath: file.name,
            owner: 'me', // Add owner information here
            expiration: {
                month: 1, // Add expiration month here
                day: 1, // Add expiration day here
                year: 2024, // Add expiration year here
                timezone: '', // Add timezone here
            },
            tags: ["file"],
            projectId: file.uid,
        };

        const formData = new FormData();
        formData.append('file', file);
        formData.append('metadata', JSON.stringify(metadata));

        try {
            const response = await axios.post('http://localhost:8000/fileUpload', formData, {
                onUploadProgress: (event) => {
                    setFiles(prevFiles => ({
                        ...prevFiles,
                        [file.uid]: getFileObject(event.progress, event.estimated)
                    }));
                },
            });

            if (response.status >= 200 && response.status < 300) {
                setFiles(prevFiles => ({
                    ...prevFiles,
                    [file.uid]: {
                        ...prevFiles[file.uid],
                        color: '#52c41a', 
                        success: true, 
                    }
                }));
            } else {
                setFiles(prevFiles => ({
                    ...prevFiles,
                    [file.uid]: { ...prevFiles[file.uid], color: 'red', isError: true }
                }));
                setErrorMessage(`${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            setFiles(prevFiles => ({
                ...prevFiles,
                [file.uid]: { ...prevFiles[file.uid], color: 'red', isError: true }
            }));
            setErrorMessage(error.message);
        }
    };

    const totalSize = Object.values(files).reduce((total, current) => {
        total = Math.floor(total + (current.size / (1024 * 1024))); // Convert bytes to MB
        return total;
    }, 0);

    const beforeUpload = (file) => {
        const maxFileSize = 250 * 1024 * 1024; // 250MB limit
        if (file.size > maxFileSize) {
            message.error(`${file.name} file upload failed (exceeds 250MB)`);
            console.error("File size exceeds the limit of 250MB");
            return false;
        }
        setErrorMessage("");
        return true;
    };

    const getTimeString = (timeInSeconds) => {
        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor(timeInSeconds / 60 - hours * 60);
        const seconds = Math.floor(timeInSeconds - minutes * 60 - hours * 3600);
        let timeString = `${seconds} sec`;
        if (minutes) {
            timeString = `${minutes} min ${timeString}`;
        }
        if (hours) {
            timeString = `${hours} hrs ${timeString}`;
        }
        return timeString;
    };

    return (
        <Space direction="vertical" style={{ width: "100vw", display: "flex", justifyContent: "center", alignItems: "center", marginTop: 134 }}>
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
                {Object.values(files).map((file, index) => (
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
                            {file.estimated ? (
                                <Typography.Text type="secondary">
                                    {" "} is being uploaded in {getTimeString(file.estimated)} seconds
                                </Typography.Text>
                            ) : (
                                <Typography.Text type="secondary">
                                    {file.isError ? " upload failed" : "uploaded successfully"}
                                </Typography.Text>
                            )}
                        </Space>
                        <Progress
                            percent={Math.ceil(file.progress * 100)}
                            strokeColor={file.success ? '#52c41a' : file.color}
                            format={() =>
                                file.isError ? (
                                    <CloseCircleOutlined style={{ color: 'red' }} />
                                ) : (<CheckCircleOutlined style={{ color: '#52c41a' }} /> )
                                
                            }
                        />
                    </Space>
                ))}
            </div>
        </Space>
    );
};

export default Tester;
