import React from 'react';
//import ColorPicker from 'react-input-color';
import './tools.css';

const tools = (props) => {


    const toolList = [
        {
        id: 'pencil-button',
        name:'pencil'
    },
        {
        id: 'rect-button',
        name:'rect'
    },
        {
        id: 'circle-button',
        name:'circle'
    },
        {
        id: 'ellipse-button',
        name:'ellipse'
    },
        {
        id: 'line-button',
        name:'line'
    },
        {
        id: 'text-button',
        name:'text'
    },
        {
        id: 'clear-all',
        name:'clear-all'
    }
    
]

    let tools = toolList.map(tool => {
        let toolUrl = require(`../../assets/icons/tools/${tool.name}.svg`); 
        return (
            <img key={tool.name} src={toolUrl} alt={tool.name} id={tool.id}/>
        );
    });

    return(
        <div className="toolsContainer">
            {tools}
            <span className="form-group" >
            Colour :
            <br/>
            <input 
                id='colour-picker'
                type='color' 
                value={props.color}
                onChange={props.colorChanged}
            />
                {/* <ColorPicker 
            value={props.color}
            defaultValue="#345678"
            onChange={props.colorChange}
            /> */}
            </span>
            <span className="form-group" >
                Thickness:
                <br/>
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
                Font:
                <br/>
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
                Font Size:
                <br/>
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
        </div>
    );
};

export default tools;