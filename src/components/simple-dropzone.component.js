/*please start the server file before starting the application server file is located on root directory 
of this project named server.js and install the necessary imports mentiond on the server file*/

/*please install necessary modules to make the application work 
react
react-toastify
react-dropzone-uploader
html5-file-selector
command to start the appplication = npm start
*/
import React from "react";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dropzone from 'react-dropzone-uploader'
import 'react-dropzone-uploader/dist/styles.css'
import { getDroppedOrSelectedFiles } from 'html5-file-selector'

toast.configure()

const SimpleDropZone = () => {

    // Payload data and url to upload files
    const getUploadParams = ({ file }) => {
        const body = new FormData();
        body.append('dataFiles', file);
        return { url: 'http://localhost:3001/uploadmultifile', body }
    }

    // Return the current status of files being uploaded with customised taosts.
    const handleChangeStatus = ({ meta, file }, status) => {
        console.log(status, meta, file)
        if (status === 'headers_received') {
            toast.success(`${meta.name} uploaded! sucessfully!`)
        } else if (status === 'Failed to load resource') {
            toast.error(`${meta.name}, sorry upload failed...`)
        } else if (status === 'exception_upload') {
            toast.warning(`${meta.name}, please check your server...`)
        }
    }

    // Return array of uploaded files after submit button is clicked
    const handleSubmit = (files, allFiles) => {
        console.log(files.map(f => f.meta))
        allFiles.forEach(f => f.remove())

    }

    //customize the choose files and add more file to upload buttons
    const getFilesFromEvent = e => {
        return new Promise(resolve => {
            getDroppedOrSelectedFiles(e).then(chosenFiles => {
                resolve(chosenFiles.map(f => f.fileObject))
            })
        })
    }

    const InputChooseFile = ({ accept, onFiles, files, getFilesFromEvent }) => {
        const text = files.length > 0 ? 'Add more files' : 'Select or Drag Files'

        const buttonStyle = {
            backgroundColor: '#7CFC00',
            color: '#000000',
            cursor: 'grab',
            margin: 20,
            padding: 20,
            borderRadius: 30
        }

        return (
            <label style={buttonStyle}>
                {text}
                <input
                    style={{ display: 'none' }}
                    type="file"
                    accept={accept}
                    multiple
                    onChange={e => {
                        getFilesFromEvent(e).then(chosenFiles => {
                            onFiles(chosenFiles)
                        })
                    }}
                />
            </label>
        )
    }

    //rendering the dropzone and other components
    return (
        <React.Fragment>
            <ToastContainer position="bottom-right" />
            <Dropzone
                getUploadParams={getUploadParams}
                onChangeStatus={handleChangeStatus}
                onSubmit={handleSubmit}
                accept="image/*, .pdf, video/*, audio/*"
                InputComponent={InputChooseFile}
                getFilesFromEvent={getFilesFromEvent}
                classNames
                disabled={files => files.some(f => ['preparing', 'getting_upload_params', 'uploading'].includes(f.meta.status))}

                //styling the dropbox and labels
                styles={{
                    dropzone: { Height: 300, top: '5%', position: "sticky" },
                    dropzoneActive: { borderColor: 'red', backgroundColor: 'orange' },
                    dropzoneReject: { borderColor: '#F19373', backgroundColor: '#F1BDAB' },

                }}
            />
        </React.Fragment>
    )
};

export default SimpleDropZone;