import React, { Component } from 'react';
import './Room.css';
import { canvas } from '../../assets/JS/canvas';
//import studentRTC from '../../assets/JS/student';
//import teacherRTC from '../../assets/JS/teacher';

import Tools from '../../components/tools/tools';
import Canvas from '../../components/canvas/canvas';
import Controls from '../../components/controls/controls';

class Room extends Component {

    state = {
        loaded: false,
        width: null,
        height: null,
        roomName: this.props.room,
        socket: null
    }
    
    componentDidMount() {
        //Connect to room
        const io = require('socket.io-client');
        const socket = io('http://localhost:8080/rooms');
        if (this.state.roomName && socket) socket.emit('join', {room: this.props.room});
        // Setup width & height of the canvas
        const canvasContainer = document.getElementById('container');
        const canvasHeight = canvasContainer.offsetHeight;
        const canvasWidth = canvasContainer.offsetWidth;

        this.setState({
            width: canvasWidth,
            height: canvasHeight,
            loaded: true,
            socket: socket
        });


    }

    componentDidUpdate() {
        if (this.state.loaded && this.state.socket) {
            const socket = this.state.socket;
            canvas(socket);
        }
        //if (this.props.roomName) socket.join(this.props.roomName);
    }



    render() {
        let canvas;
        if (this.state.loaded) {
            canvas = <Canvas width={this.state.width} height={this.state.height} />
        } else {
            canvas = null;
        }
        return (
            <div className='globalContainer'>
                <Tools />
                <div id="container">
                    {canvas}
                </div>
                <Controls teacher={this.teacher} student={this.student} />
            </div>
        );
    };
};

export default Room;
