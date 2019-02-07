// External modules
import React, { Component } from 'react';
import queryString from 'query-string';
// Config
import endpoints from '../../assets/config/endpoints.js';
// Scripts
import boardScript from '../../assets/scripts/board/board';
import webRTC from '../../assets/scripts/webRTC';
import fileShare from '../../assets/scripts/fileShare';
// React components
import Tools from '../../components/tools/tools';
import Controls from '../../components/controls/controls';
import Invite from '../../components/modal/modal';
import Backdrop from '../../components/backdrop/backdrop';
import Board from '../../components/board/board';
import FileBox from '../../components/fileBox/fileBox';
// Helpers functions
import checkNavigator from '../../helpers/checkNavigator';
// Stylesheet
import './Room.css';

class Room extends Component {

    state = {
        loaded: true,
        boardId: null,
        pin: null,
        socket: null,
        guest: null,
        modal: false,
        initiator: null,
        receivedFile: null
    }
    
    componentDidMount() {
        // get URL Params
        const params = queryString.parse(window.location.search);
        const boardId = params.id;
        const pin = params.pin;
        // Verify that the navigator is compatible
        if(checkNavigator()){
            //Connect to room
            const io = require('socket.io-client');
            const socket = io(`${endpoints.dev}boards`);
            
            // Send join request
            if (socket && boardId) {
                // Setup actions if join succeeds OK
                socket.on('joinSuccess', (data) => {
                    console.log('joinSuccess');
                    this.setState({
                        boardId: boardId,
                        pin: pin,
                        loaded: true,
                        socket: socket
                    });
                    boardScript(socket, this.state.boardId);
                    webRTC(socket, data.boardReady, data.iceServers);
                    fileShare(socket, this.onDownloadComplete.bind(this));
                    
                });
                socket.on('joinFail', error => {
                    alert(error);
                });
                // Setup actions if join fails
                
                console.log('sending join request');
                socket.emit('join', {id: boardId, pin: pin});
            };
        } else {
            alert("Votre navigateur n'est pas compatible avec cette apllication. Merci d'utiliser Chrome ou Safari." )
        }
    };
    
    componentDidUpdate() {
        if (this.state.loaded && this.state.socket) {
            const socket = this.state.socket;
            socket.on('reconnect', () => {
                socket.emit('joinboard', {room: this.state.boardId, pin: this.state.pin})
            });
            socket.on('fileTransferRequest', data => {
                //console.log('fileTransferRequest');
                const fileData = JSON.parse(data);
                const file = {
                    name: fileData.name,
                    size: fileData.size,
                    downloading: false
                };
                this.setState({receivedFile: file});
            });
            socket.on('message', (data) => {
                alert(data.msg);
            });
        };
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

    onFileAccepted(){
        //console.log(e.target);
        const socket = this.state.socket;
        socket.emit('fileTransferAccepted');
        const file = this.state.receivedFile;
        file.downloading = true;
    }

    onFileRefused(){
        const socket = this.state.socket;
        this.setState({receivedFile: null});
        socket.emit('message', {msg: 'Votre interlocuteur a refusé le fichier'});
    }

    onDownloadComplete(){
        const socket = this.state.socket;
        this.setState({receivedFile: null});
        socket.emit('message', {msg: 'Votre interlocuteur a bien reçu le fichier'});
    }



    render() {
        let board = null;
        const boardContainer = document.getElementById('boardContainer');
        if (boardContainer){
            board = <Board width='1' height='1' />
        }
        let fileItem = null;
        if(this.state.receivedFile !== null){
            const file = this.state.receivedFile;
            fileItem = (
                <FileBox
                name={file.name}
                size={file.size}
                downloading={file.downloading}
                onAccept={this.onFileAccepted.bind(this)}
                onRefuse={this.onFileRefused.bind(this)}
                />
            );
        }
        return (
            <div className='globalContainer' id='globalContainer'>
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
                <div id="boardContainer">
                    {board}
                </div>
                <Controls 
                    teacher={this.teacher} 
                    student={this.student} 
                    openModal={this.toggleModal.bind(this)}
                />
                {fileItem}
            </div>
        );
    };
};

export default Room;
