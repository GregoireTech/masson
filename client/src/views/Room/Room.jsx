import React, { Component } from 'react';
import './Room.css';
import {canvas} from '../../assets/JS/canvas';

import Tools from '../../components/tools/tools';
import Canvas from '../../components/canvas/canvas';
import Controls from '../../components/controls/controls';

class Room extends Component {

    state = {
        loaded: false,
        width: null,
        height: null
    }

    componentDidMount(){
        const canvasContainer = document.getElementById('container');
        const canvasHeight = canvasContainer.offsetHeight;
        const canvasWidth = canvasContainer.offsetWidth;
        this.setState({
            width: canvasWidth,
            height: canvasHeight,
            loaded: true
        });
        canvas();
    }

    render() {
        let canvas;
        if (this.state.loaded){
            canvas =  <Canvas width={this.state.width} height={this.state.height} />
        } else {
            canvas =  null;
        }
        return (
            <div className='globalContainer'>
                <Tools />
                <div id="container">
                    {canvas}
                </div>
                }
                <Controls />
            </div>
        );
    };
};

export default Room;
