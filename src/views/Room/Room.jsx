// External modules
import React, { Component } from 'react';
import queryString from 'query-string';
// Scripts
import { canvas } from '../../assets/JS/canvas';
import webRTC from '../../assets/JS/webRTC';
// React components
import Tools from '../../components/tools/tools';
import Canvas from '../../components/canvas/canvas';
import Controls from '../../components/controls/controls';
// Stylesheet
import './Room.css';

class Room extends Component {

    state = {
        loaded: false,
        width: null,
        height: null,
        roomName: 'greg',
        socket: null,
        pickedColor: '#345678'
    }
    
    componentDidMount() {
        // get URL Params
        const params = queryString.parse(window.location.search);
        const roomName = params.id;
        const pin = params.pin;
        //Connect to room
        const io = require('socket.io-client');
        const socket = io('http://localhost:8080/rooms');
        if (this.state.roomName && socket) {
            socket.emit('join', {room: roomName, pin: pin});
            socket.on('joinSuccess', () => {
                this.setState({
                    loaded: true,
                    socket: socket
                });
            });
            socket.on('joinFail', error => {
                console.log('error',error);
            })
        }
        // Setup width & height of the canvas
        this.setCanvaSize();
        //window.addEventListener('resize', this.setCanvaSize.bind(this));


    }
    
    componentDidUpdate() {
        if (this.state.loaded && this.state.socket) {
            const socket = this.state.socket;
            canvas(socket, this.state.pickedColor);
            webRTC(socket);
        }
    }

    setCanvaSize(){
        const canvasContainer = document.getElementById('container');
        const canvasHeight = canvasContainer.offsetHeight;
        const canvasWidth = canvasContainer.offsetWidth;
        this.setState({
            width: canvasWidth,
            height: canvasHeight
        });
    }

    changeColor(e){
        console.log('change color to: ', e.target.value);
        this.setState({pickedColor: e.target.value});
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
                <Tools 
                    color={this.state.pickedColor} 
                    colorChanged={this.changeColor.bind(this)} 
                />
                <div id="container">
                    {canvas}
                </div>
                <Controls 
                    teacher={this.teacher} 
                    student={this.student} 
                />
            </div>
        );
    };
};

export default Room;
