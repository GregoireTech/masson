import React from 'react';
import './tools.css';

const tools = (props) => {
    return(
        <div class="toolsContainer">
            <button type="button" class="btn btn-warning btn-sm" value="pencil" id="pencil-button">Pencil</button>
            <button type="button" class="btn btn-warning btn-sm" value="rect" id="rect-button">Rectangle</button>
            <button type="button" class="btn btn-warning btn-sm" value="circle" id="circle-button">Circle</button>
            <button type="button" class="btn btn-warning btn-sm" value="ellipse" id="ellipse-button">Ellipse</button>
            <button type="button" class="btn btn-warning btn-sm" value="line" id="line-button">Line</button>
            <button type="button" class="btn btn-warning btn-sm" value="text" id="text-button">Text</button>
            <button type="button" class="btn btn-warning btn-sm" id="clear-all">Clear All</button>
            <label for="colour">Colour : </label>
            <input id="colour-picker" value="#000000" class="jscolor {width:243, height:150, position:'right',
            borderColor:'#FFF', insetColor:'#FFF', backgroundColor:'#666'}"/>
            <span class="form-group" >
                <label for="line-Width">Thickness: </label>
                <select class="form-control" id="line-Width">
                <option>2</option>
                <option>4</option>
                <option>6</option>
                <option>8</option>
                <option>10</option>
                <option>12</option>
                <option>14</option>
                </select>
            </span>
            <span class="form-group" >
                <label for="draw-text-font-family">Font: </label>
                <select class="form-control" id="draw-text-font-family">
                <option value="Arial">Arial</option>
                <option value="Verdana" selected>Verdana</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
                <option value="serif">serif</option>
                <option value="sans-serif">sans-serif</option>
                </select>
            </span>
            <span class="form-group" >
                <label for="draw-text-font-size">Font Size: </label>
                <select class="form-control" id="draw-text-font-size">
                <option value="16">16 Px</option>
                <option value="18">18 Px</option>
                <option value="20">20 Px</option>
                <option value="22">22 Px</option>
                <option value="24">24 Px</option>
                <option value="26">26 Px</option>
                <option value="28">28 Px</option>
                <option value="30">30 Px</option>
                <option value="32" selected>32 Px</option>
                <option value="34">34 Px</option>
                <option value="36">36 Px</option>
                <option value="38">38 Px</option>
                <option value="40">40 Px</option>
                </select>
            </span>
        </div>
    );
};

export default tools;