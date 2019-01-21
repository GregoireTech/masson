import React from 'react';
import './start.css';

const start = (props) => {
    return(
        <div className='btnContainer'>
            <div className='button' onClick={props.start} >Start</div>
            
        </div>
    );
};

export default start;