import React, {Component} from 'react';
import './Start.css';
import login from '../../assets/JS/login';



class Start extends Component {
    state = {
        socket: null,
        roomList: []
    }

    componentDidMount(){
        const io = require('socket.io-client');
        const socket = io('http://localhost:8080/');
        login(
            {
                addRoom: this.addRoomToList.bind(this), 
                join: this.props.join.bind(this),
                socket: socket});
        this.setState({socket: socket});

    }


    createRoom(){
        const newRoom = document.getElementById('number').value;
        console.log(newRoom);
        if (newRoom !== "" && this.state.socket){
        const socket = this.state.socket;
        socket.emit('createRoom', {roomName: newRoom});
        }
    }
    joinRoom(){
        const room = document.getElementById('number').value;
        console.log(room);
        if (room !== "" && this.state.socket){
        const socket = this.state.socket;
        socket.emit('joinRoom', {roomName: room, password: '333'});
        }
    }

    addRoomToList(newList){
        this.setState({roomList: newList});
    }






    render(){
        let rooms;
        if (this.state.roomList !== []){
            rooms = this.state.roomList.map((room, index) => {
                return (
                    <li className="room" key={index} >
                        <p className='roomName'>{room}</p>
                        <button className='btn joinBtn'>Rejoindre</button>
                    </li>
                );
            });
        } else {
            rooms = (<li className="room" id="noRoom">Il n'y a pas encore de rooms, créez-en une.</li> );
        }
        return(
            <div className='startContainer'>
                <h2>Whiteboard collaboratif des Cours Masson</h2>
                <p>Rejoignez l'une des rooms ci-dessous ou créez-en une.</p>
                <p>
                    <input type="text" id='number' placeholder="Room number (3 chiffres)" />
                    <button className='joinBtn btn' onClick={this.joinRoom.bind(this)} >Join!</button> 
                    <button className='createBtn btn' onClick={this.createRoom.bind(this)}>Créer!</button> 
                </p>
                <div className='roomsContainer'>
                    <ul className='roomList'>
                        {rooms}
                    </ul>
                </div>
            </div>
        );
    };
};

export default Start;