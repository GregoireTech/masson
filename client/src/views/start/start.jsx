import React from 'react';
import './start.css';

const start = (props) => {
    return(
        <div className='btnContainer'>
            <button onClick={props.student} id="student">Student</button>
            <button onClick={props.teacher} id="teacher">Teacher</button>
        </div>
    );
};

export default start;