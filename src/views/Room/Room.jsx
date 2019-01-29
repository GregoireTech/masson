// External modules
import React, { Component } from 'react';
import queryString from 'query-string';
// Config
import endpoints from '../../assets/config/endpoints.js';
// Scripts
import { canvas } from '../../assets/JS/canvas';
import {initiator} from '../../assets/JS/initiator';
import {receiver} from '../../assets/JS/receiver';
import webRTC from '../../assets/JS/webRTC';
// React components
import Tools from '../../components/tools/tools';
import Canvas from '../../components/canvas/canvas';
import Controls from '../../components/controls/controls';
import Invite from '../../components/modal/modal';
import Backdrop from '../../components/backdrop/backdrop';
// Stylesheet
import './Room.css';

class Room extends Component {

    state = {
        loaded: false,
        roomName: 'greg',
        socket: null,
        guest: null,
        modal: false,
        initiator: null
    }
    
    componentDidMount() {
        // get URL Params
        const params = queryString.parse(window.location.search);
        const roomName = params.id;
        const pin = params.pin;
        //Connect to room
        const io = require('socket.io-client');
        const socket = io(`${endpoints.dev}rooms`);

        // Send join request
        if (socket) {
            // Setup actions if join succeeds OK
            socket.on('joinSuccess', (data) => {
                console.log('joinSuccess');
                this.setState({
                    loaded: true,
                    socket: socket,
                    initiator: data.roomReady
                });
                socket.emit('getRoomLines');
            });
            // Setup actions if join fails
            socket.on('joinFail', error => {
                alert(error);
            });
            socket.on('setVisioStatus', data => {
                this.setState({visioStatus: data.status});
            })
            console.log('sending join request');
            socket.emit('join', {room: roomName, pin: pin});
            
            
        };
        // Setup width & height of the canvas
        //this.setCanvas();
        window.addEventListener('resize', this.resizeCanvas.bind(this));
    };
    
    componentDidUpdate() {
        console.log('component updated');
        if (this.state.loaded && this.state.socket) {
            const socket = this.state.socket;
            canvas(socket);
            if(this.state.initiator !== null){
                webRTC(socket, this.state.initiator);
            } 
            socket.on('peerLeft', () => {
                console.log('peer disconnected');
                this.setState({initiator: false});
                this.forceUpdate();
                //window.location.reload();
            });
        };
    };

    resizeCanvas(){
        const socket = this.state.socket;
        const canvasContainer = document.getElementById('container');
        const canvas1 = document.getElementById('imageView');
        const canvas2 = document.getElementById('imageTemp');
        if (canvasContainer && canvas){
            canvas1.height = canvasContainer.offsetHeight;
            canvas1.width = canvasContainer.offsetWidth;
            canvas2.height = canvasContainer.offsetHeight;
            canvas2.width = canvasContainer.offsetWidth;
            if(socket){
                socket.emit('getRoomLines');
            }
        }
    };

    sendInvite(){
        const guest = this.state.guest;
        console.log(guest);
        const socket = this.state.socket;
        if(guest && socket){
        socket.emit('inviteGuest', {email: guest});
        socket.on('inviteRes', (res) => {
            console.log('email response:', res);
        });
        } else { 
            alert('Il y a eu une erreur, merci de réessayer');
        }
        this.setState({modal: false});
    };

    guestInputChanged(e){
        const email = e.target.value;
        this.setState({guest: email});
    }

    toggleModal(){
        const previous = this.state.modal;
        this.setState({
            modal: !previous
        });
    }


    render() {

        let canvas = null;
        const canvasContainer = document.getElementById('container');
        if (canvasContainer){
            const canvasHeight = canvasContainer.offsetHeight;
            const canvasWidth = canvasContainer.offsetWidth;
            canvas = <Canvas width={canvasWidth} height={canvasHeight} />
        }
        return (
            <div className='globalContainer'>
                <Backdrop click={this.toggleModal.bind(this)} show={this.state.modal} />
                <Invite 
                    show={this.state.modal}
                    inputChanged={this.guestInputChanged.bind(this)} 
                    inputValue={this.state.guest}
                    closeModal={this.toggleModal.bind(this)}
                    sendInvite={this.sendInvite.bind(this)}
                    valid={this.state.validEmail}
                />
                <Tools />
                <div id="container">
                    {canvas}
                </div>
                <Controls 
                    teacher={this.teacher} 
                    student={this.student} 
                    openModal={this.toggleModal.bind(this)}
                />
            </div>
        );
    };
};

export default Room;
