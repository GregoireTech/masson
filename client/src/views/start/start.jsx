import React, {Component} from 'react';
import queryString from 'query-string';
import './Start.css';
import login from '../../assets/JS/login';
import {Link} from 'react-router-dom';



class Start extends Component {
    state = {
        socket: null,
        userData: {        
            firstName: 'Greg',
            lastName: 'Claise'
        },
        roomList: []
    }

    componentDidMount(){
        const params = queryString.parse(window.location.search);
        console.log(params);
        const io = require('socket.io-client');
        const socket = io('http://localhost:8080/');
        login(
            {
                addRoom: this.addRoomToList.bind(this), 
                socket: socket
            }
        );
        socket.emit('getRooms', this.state.userData)
        this.setState({socket: socket});
    }


    createRoom(){
        if (this.state.socket){
            const socket = this.state.socket;
            socket.emit('createRoom', this.state.userData);
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
                    <div className="room" key={index} >
                        <p className='roomName'>{room.name}
                            <Link to={`/rooms/?${room.string}`} >
                                <button className='btn joinBtn'>Rejoindre</button>
                            </Link>
                        </p>
                    </div>
                );
            });
        } else {
            rooms = (<div className="room">Il n'y a pas encore de rooms, créez-en une.</div> );
        }
        return(
            <div className='startContainer'>
                <h2>Whiteboard collaboratif des Cours Masson</h2>
                <p>Rejoignez l'une des rooms ci-dessous ou créez-en une.
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