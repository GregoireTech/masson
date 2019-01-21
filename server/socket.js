const iolib = require('socket.io');
const roomModel = require('./models/Room');
const Room = roomModel.Room;
let rooms = {};

// Start the socket server
function startIO(app) {
    io = iolib(app);
    io.on('connection', onConnection);
    io.of('/rooms').on('connection', connectToRoom);
    return io;
};



function onConnection(socket) {

    console.log('user connected');
    // ROOM FUNCTIONS

    // If the user wants to create a room
    socket.on('create_room', data => {
        // if the room does not exist, create it
        if (rooms.includes(data.roomName)) {
            const newRoom = new Room();
            newRoom.addUser(data.password);
            rooms[data.roomName] = newRoom;
            socket['room'] = data.roomName;
        }
        // if the room exists, inform user
        else {
            socket.to(socket.id).emit('already_exists');
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
        const newRoom = new Room ('zvdzv');
        newRoom.addUser();
        rooms[room.room] = newRoom;
        console.log(rooms[room.room]);
        if (rooms[room.room] != undefined) {
            if (rooms[room.room].usersCounter < 2) {
                socket.join(room.room);
                socket['room'] = room.room;
                console.log(socket['room']);
            } else {
                console.log('too many users');
            }; 
        } else {
            console.log('room does not exist');      
        };
    });

    // THE WHITEBOARD FUNCTIONALITIES
    socket.on('drawing', function (data) {
        socket.broadcast.emit('drawing', data);
        console.log(data);
    });

    socket.on('rectangle', function (data) {
        socket.broadcast.emit('rectangle', data);
        console.log(socket['room']);
        console.log(data);
    });

    socket.on('linedraw', function (data) {
        socket.broadcast.emit('linedraw', data);
        console.log(data);
    });

    socket.on('circledraw', function (data) {
        socket.broadcast.emit('circledraw', data);
        console.log(data);
    });

    socket.on('ellipsedraw', function (data) {
        socket.broadcast.emit('ellipsedraw', data);
        console.log(data);
    });

    socket.on('textdraw', function (data) {
        socket.broadcast.emit('textdraw', data);
        console.log(data);
    });

    socket.on('copyCanvas', function (data) {
        socket.broadcast.emit('copyCanvas', data);
        console.log(data);
    });

    socket.on('Clearboard', function (data) {
        socket.broadcast.emit('Clearboard', data);
        console.log(data);
    });

    // ON DISCONNECT
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

};


exports.start = startIO;