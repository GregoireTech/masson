import React from 'react';
import './help.css';

const help = (props) => {
    let helpClass;
    props.show? helpClass = 'help show' : helpClass = 'help noShow';
    return(
        <div className={helpClass}>
            <embed href='https//:www.google.com'/>
            <div className='helpBtn' onClick={props.close} >Close</div>
        </div>
    );
};

export default help;