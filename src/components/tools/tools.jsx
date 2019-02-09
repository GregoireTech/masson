import React, { Component } from 'react';

import ColorPicker from '../colorPicker/colorPicker';
import './tools.css';

class Tools extends Component {

    state = {
        activeTool: null,
        chosenColor: '345678',
        showPicker: false
    }

    setActiveTool(e){
        if (this.state.activeTool !== null){
            document.getElementById(this.state.activeTool).classList.remove('activeTool');
        }
        e.target.classList.add('activeTool');
        this.setState({ activeTool: e.target.id });
    }
    
    handleColorChange(color){
        const colorDiv = document.getElementById('colorDiv');
        const chosenColor = color.hex;
        colorDiv.style.background = chosenColor;
        this.setState({chosenColor: chosenColor, showPicker: false});
    }
    togglePicker(){
        const showPicker = !this.state.showPicker;
        this.setState({showPicker: showPicker});
    }

    render (){
        const pickerItem = (
            <ColorPicker
            color={this.state.chosenColor}
            colorChange={this.handleColorChange.bind(this)}
            />
        );
        const toolList = [
            {
            id: 'Pencil',
            name:'pencil'
        },
            {
            id: 'Rectangle',
            name:'rect'
        },
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
            name:'erase'
        }
        ]
        let toolItems = toolList.map(tool => {
            let toolUrl = require(`../../assets/icons/tools/${tool.name}.svg`); 
            return (
                <img key={tool.name} src={toolUrl} alt={tool.name} id={tool.id} onClick={this.setActiveTool.bind(this)}/>
            );
        });

        return(
            <div className="toolsContainer">
                {toolItems}
                <div id='colorDiv' onClick={this.togglePicker.bind(this)}>
                </div>
                {this.state.showPicker? pickerItem : null}
                <label htmlFor="chooseSize" data-translation="waiting">Taille</label>
                <input type="range" id="chooseSize" defaultValue="10" min="1" max="50" step="1" className="rangeChooser" />
                <label htmlFor="chooseOpacity" data-translation="waiting">Opacité</label>
                <input type="range" id="chooseOpacity" defaultValue="1" min="0.2" max="1" step="0.1" className="rangeChooser" />

            </div> 
        );
    }
};

export default Tools;