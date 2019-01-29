import React, {Component} from 'react';
import queryString from 'query-string';
import './Start.css';
import login from '../../assets/JS/login';
import endpoints from '../../assets/config/endpoints.js';
import Header from '../../components/header/header';
import Table from '../../components/table/table';



class Start extends Component {
    state = {
        socket: null,
        userData: {        
            firstName: 'Prénom',
            lastName: 'Nom'
        },
        roomList: []
    }

    componentDidMount(){
        const params = queryString.parse(window.location.search);
        const io = require('socket.io-client');
        const socket = io(`${endpoints.prod}`);
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
        
        return(
            <div className='startContainer'>
                <Header create={this.createRoom.bind(this)} dashboardUrl='' />
                <Table roomList={this.state.roomList} />
            </div>
        );
    };
};

export default Start;