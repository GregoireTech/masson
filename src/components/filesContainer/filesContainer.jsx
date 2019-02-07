import React from 'react';

import FileBox from '../fileBox/fileBox';
import './filesContainer.css';

const filesContainer = (props) => {
    const items = props.files.map((file, index) => {
        console.log(file);
        return (
            <FileBox
            key={index}
            name={file.name}
            size={file.size}
            downloading={file.downloading}
            onAccept={props.fileAccepted}
            index={index}
            />
        );
    });

    return(
        <div id="filesContainer">
            {items}
        </div>
    )
}

export default filesContainer;