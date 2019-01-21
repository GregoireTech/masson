import React from 'react';
import './tools.css';

const tools = (props) => {
    return(
        <div className="toolsContainer">
            <button type="button" className="btn btn-warning btn-sm" value="pencil" id="pencil-button">Pencil</button>
            <button type="button" className="btn btn-warning btn-sm" value="rect" id="rect-button">Rectangle</button>
            <button type="button" className="btn btn-warning btn-sm" value="circle" id="circle-button">Circle</button>
            <button type="button" className="btn btn-warning btn-sm" value="ellipse" id="ellipse-button">Ellipse</button>
            <button type="button" className="btn btn-warning btn-sm" value="line" id="line-button">Line</button>
            <button type="button" className="btn btn-warning btn-sm" value="text" id="text-button">Text</button>
            <button type="button" className="btn btn-warning btn-sm" id="clear-all">Clear All</button>
            <label htmlFor="colour">Colour : </label>
            {/* defaultValue was value before in color picker */}
            <input id="colour-picker" defaultValue="#000000" className="jscolor {width:243, height:150, position:'right',
            borderColor:'#FFF', insetColor:'#FFF', backgroundColor:'#666'}"/>
            <span className="form-group" >
                <label htmlFor="line-Width">Thickness: </label>
                <select className="form-control" id="line-Width">
                <option>2</option>
                <option>4</option>
                <option>6</option>
                <option>8</option>
                <option>10</option>
                <option>12</option>
                <option>14</option>
                </select>
            </span>
            <span className="form-group" >
                <label htmlFor="draw-text-font-family">Font: </label>
                <select className="form-control" id="draw-text-font-family" defaultValue='Verdana'>
                <option value="Arial">Arial</option>
                <option value="Verdana">Verdana</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
                <option value="serif">serif</option>
                <option value="sans-serif">sans-serif</option>
                </select>
            </span>
            <span className="form-group" >
                <label htmlFor="draw-text-font-size">Font Size: </label>
                <select className="form-control" id="draw-text-font-size" defaultValue='32'>
                <option value="16">16 Px</option>
                <option value="18">18 Px</option>
                <option value="20">20 Px</option>
                <option value="22">22 Px</option>
                <option value="24">24 Px</option>
                <option value="26">26 Px</option>
                <option value="28">28 Px</option>
                <option value="30">30 Px</option>
                <option value="32">32 Px</option>
                <option value="34">34 Px</option>
                <option value="36">36 Px</option>
                <option value="38">38 Px</option>
                <option value="40">40 Px</option>
                </select>
            </span>
            <button type="button" className="btn btn-warning btn-sm" id="send_rtc_button">1. Send Visio</button>
            <button type="button" className="btn btn-warning btn-sm" id="accept_rtc_button">2. Accept Visio</button>
            
        </div>
    );
};

export default tools;