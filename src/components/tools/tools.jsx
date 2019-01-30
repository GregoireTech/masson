import React from 'react';

import './tools.css';

const tools = (props) => {

    const toolList = [
        {
        id: 'Pencil',
        name:'pencil'
    },
        {
        id: 'Rectangle',
        name:'rect'
    },
    //     {
    //     id: 'circle-button',
    //     name:'circle'
    // },
    //     {
    //     id: 'ellipse-button',
    //     name:'ellipse'
    // },
        {
        id: 'Straight line',
        name:'line'
    },
        {
        id: 'Text',
        name:'text'
    },
        {
        id: 'Eraser',
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
                id='chooseColor'
                type='color'
                defaultValue='#345678' 
            /> 

            </span>
            <label htmlFor="chooseSize" data-translation="waiting">Size</label>
          <input type="range" id="chooseSize" defaultValue="10" min="1" max="50" step="1" className="rangeChooser" />
          <label htmlFor="chooseOpacity" data-translation="waiting">Opacity</label>
          <input type="range" id="chooseOpacity" defaultValue="1" min="0.2" max="1" step="0.1" className="rangeChooser" />
            {/* <span className="form-group" >
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
            </span> */}
        </div> 
    );
};

export default tools;