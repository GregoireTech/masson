// External modules
import React, { Component } from 'react';
import queryString from 'query-string';
// Config
import endpoints from '../../assets/config/endpoints.js';
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
        const socket = io(`${endpoints.prod}rooms`);
        // Setup actions if join succeeds OK
        socket.on('joinSuccess', () => {
            console.log('joinSuccess');
            this.setState({
                loaded: true,
                socket: socket
            });
        });
        // Setup actions if join fails
        socket.on('joinFail', error => {
            alert(error);
        });
        // Send join request
        if (socket) {
            console.log('sending join request');
            socket.emit('join', {room: roomName, pin: pin});
            
        }
        // Setup width & height of the canvas
        this.setCanvas();
        //window.addEventListener('resize', this.setCanvas.bind(this));


    }
    
    componentDidUpdate() {
        if (this.state.loaded && this.state.socket) {
            const socket = this.state.socket;
            canvas(socket, this.state.pickedColor);
            webRTC(socket);
        }
    }

    setCanvas(){
        const socket = this.state.socket;
        const canvasContainer = document.getElementById('container');
        const canvasHeight = canvasContainer.offsetHeight;
        const canvasWidth = canvasContainer.offsetWidth;
        this.setState({
            width: canvasWidth,
            height: canvasHeight
        });
        if(socket) {
            socket.emit('getRoomLines');
        }
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
