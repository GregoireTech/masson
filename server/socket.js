const iolib = require('socket.io');
const roomModel = require('./models/Room');
const Room = roomModel.Room;
let rooms = {};
let roomList = [];

// Start the socket server
function startIO(app) {
    io = iolib(app);
    io.on('connection', onConnection);
    io.of('/rooms').on('connection', connectToRoom);
    return io;
};


function onConnection(socket) {

    io.to(`${socket.id}`).emit('setRoomList',{roomList : roomList});
    console.log(socket.id, 'user connected');
    // ROOM FUNCTIONS

    // If the user wants to create a room
    socket.on('createRoom', data => {
        // if the room does not exist, create it
        if (!roomList.includes(data.roomName)) {
            const newRoom = new Room('333');
            newRoom.addUser(data.password);
            rooms[data.roomName] = newRoom;
            socket['room'] = data.roomName;
            roomList.push(data.roomName);
            socket.emit('setRoomList', {roomList : roomList});
        }
        // if the room exists, inform user DOES NOT WORK
        else {
            console.log('already exists', socket.id);
            socket.emit('impossible', 'already_exists');
        }
    });

    socket.on('joinRoom', data => {
        if (roomList.includes(data.roomName)){
            console.log(rooms[data.roomName]);
            if(rooms[data.roomName].usersCounter < 2){
                if(rooms[data.roomName].password === data.password){
                    console.log('ok to join');
                    socket.emit('okToJoin', {roomName: data.roomName});
                } else {
                    socket.emit('impossible', 'wrong_password');
                }

            } else {
                socket.emit('impossible', 'room_full');
            }
        } else {
            socket.emit('impossible', 'room_not_found');
        }
    });


}
////////////////////////////////////////////////
//           ONCE CONNECTED TO A ROOM         //
////////////////////////////////////////////////
function connectToRoom(socket) {

    console.log('user in rooms');
    socket.on('join', (room) => {
        console.log(room, rooms);
        if (rooms[room.room] != undefined) {
            if (rooms[room.room].usersCounter < 2) {
                socket.join(room.room);
                socket['room'] = room.room;
                console.log(socket['room'], 'connected');
                socket.emit('getRoomLines', {lines: rooms[room.room].lines});
            } else {
                console.log('too many users');
            }; 
        } else {
            console.log('room does not exist');      
        };
    });

    // THE WHITEBOARD FUNCTIONALITIES
    socket.on('drawing', function (data) {
        socket.to(socket['room']).emit('drawing', data);
        rooms[socket['room']].addLine('drawing', data);
        console.log(data);
    });

    socket.on('rectangle', function (data) {
        socket.to(socket['room']).emit('rectangle', data);
        console.log(socket['room']);
        rooms[socket['room']].addLine('rectangle', data);
        console.log(data);
    });

    socket.on('linedraw', function (data) {
        socket.to(socket['room']).emit('linedraw', data);
        rooms[socket['room']].addLine('linedraw', data);
        console.log(data);
    });

    socket.on('circledraw', function (data) {
        socket.to(socket['room']).emit('circledraw', data);
        rooms[socket['room']].addLine('circledraw', data);
        console.log(data);
    });

    socket.on('ellipsedraw', function (data) {
        socket.to(socket['room']).emit('ellipsedraw', data);
        rooms[socket['room']].addLine('ellipsedraw', data);
        console.log(data);
        console.log(rooms[socket['room']]);
    });

    socket.on('textdraw', function (data) {
        socket.to(socket['room']).emit('textdraw', data);
        rooms[socket['room']].addLine('textdraw', data);
        console.log(data);
    });

    socket.on('copyCanvas', function (data) {
        socket.to(socket['room']).emit('copyCanvas', data);
        rooms[socket['room']].addLine('copyCanvas', data);
        console.log(data);
    });

    socket.on('Clearboard', function (data) {
        
        socket.to(socket['room']).emit('Clearboard', data);
        rooms[socket['room']].clearAll();
        console.log(data);
    });

    // ON DISCONNECT
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

};


exports.start = startIO;