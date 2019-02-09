import React from 'react'
import { GithubPicker } from 'react-color';

import './colorPicker.css';

const colorPicker = (props) => {

    const colorDiv = document.getElementById('colorDiv');
    const Xoffset = colorDiv.offsetLeft;
    const Yoffset = colorDiv.offsetTop + colorDiv.clientHeight + 5;
    const divStyle= { top: Yoffset, left: Xoffset }
    return (
        <div id="colorPicker" style={divStyle} >
            <GithubPicker
            color={props.chosenColor}
            onChangeComplete={props.colorChange}
            />
        </div>
    )
}

export default colorPicker;