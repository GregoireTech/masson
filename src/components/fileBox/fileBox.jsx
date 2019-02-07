import React from 'react';
import './fileBox.css'

const fileBox = (props) => {
    const fileDescription = `${props.name} (${Math.round(props.size/1000)}kB)`;
    let options;
    if (props.downlading){
        options = null;
    } else {
        options = (
            <div id='fileBtnContainer'>
                <div className='fileBtn' id='fileOK' onClick={props.onAccept}>Accepter</div> 
                <div className='fileBtn' id='fileNOK' onClick={props.onRefuse}>Refuser</div> 
            </div>
        );
    }
    return (
        <div className='fileBox' id='fileBox'>
            <p className='fileContent'>   
                {fileDescription}
            </p>
            {options}
        </div>
    )
}

export default fileBox;