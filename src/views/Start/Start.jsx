import React, {Component} from 'react';
import queryString from 'query-string';
import './Start.css';
import login from '../../assets/scripts/login';
import endpoints from '../../assets/config/endpoints.js';
import Header from '../../components/header/header';
import Table from '../../components/table/table';



class Start extends Component {
    state = {
        socket: null,
        userData: {        
            firstName: 'Prénom',
            lastName: 'Nom',
            uid: 'bferbaiho',
            password: '333888'
        },
        boardList: []
    }

    componentDidMount(){
        const params = queryString.parse(window.location.search);
        const io = require('socket.io-client');
        const socket = io(`${endpoints.dev}`);
        login(
            {
                addBoard: this.addBoardToList.bind(this), 
                socket: socket
            }
        );
        socket.emit('getMyBoards', this.state.userData)
        this.setState({socket: socket});
    }


    createBoard(){
        if (this.state.socket){
            const socket = this.state.socket;
            socket.emit('createBoard', this.state.userData);
        }
    }

    addBoardToList(newList){
        this.setState({boardList: newList});
    }


    render(){
        
        return(
            <div className='startContainer'>
                <Header create={this.createBoard.bind(this)} dashboardUrl='' />
                <Table boardList={this.state.boardList} />
            </div>
        );
    };
};

export default Start;