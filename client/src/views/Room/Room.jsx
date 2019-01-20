import React, { Component } from 'react';
import './Room.css';
import {canvas} from '../../assets/JS/canvas';
import student from '../../assets/JS/student';
import teacher from '../../assets/JS/teacher';

import Tools from '../../components/tools/tools';
import Canvas from '../../components/canvas/canvas';
import Controls from '../../components/controls/controls';

class Room extends Component {

    state = {
        loaded: false,
        width: null,
        height: null,
        roomName: this.props.user
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
        
    }

    student(){
        student();
    }
    teacher(){
        teacher();
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
                <Controls teacher={this.teacher} student={this.student} />
            </div>
        );
    };
};

export default Room;
