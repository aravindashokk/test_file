import React from 'react';
import { CloudUploadOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
const { Dragger } = Upload;
const props = {
    name: 'file',
    multiple: true,
    action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    onChange(info) {
        const { status } = info.file;
        if (status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
    onDrop(e) {
        console.log('Dropped files', e.dataTransfer.files);
    },
};
const Tester = () => (

    <div style={{width:"100vw", display: "flex", justifyContent:"center", alignItems:"center", marginTop: 24}}>
        <Dragger {...props}
        style={{width:500}}>
            <p className="ant-upload-drag-icon">
                <CloudUploadOutlined style={{ fontSize: '70px', color: '#000' }} />
            </p>
            <p className="ant-upload-text">Drag and Drop files here or Upload file</p>
        </Dragger>
    </div>


);
export default Tester;