const iolib = require('socket.io');
const roomModel = require('./models/Room');
const Room = roomModel.Room;
const teacherModel = require('./models/Teacher');
const Teacher = teacherModel.Teacher;
let rooms = {};
let roomList = [];
let teachers = {};
let teacherList = [];

// Start the socket server
function startIO(app) {
    io = iolib(app);
    io.on('connection', onConnection);
    io.of('/rooms').on('connection', connectToRoom);
    return io;
};

const sendRoomList = (socket, userName) => {
    const roomNames = teachers[userName].rooms;
    let myRooms = [];
    console.log(rooms)
    for (name of roomNames) {
        console.log(name);
        const room = {
            name: rooms[name].name,
            string: rooms[name].string
        };
        myRooms.push(room);
    }
    console.log(myRooms);
    io.to(`${socket.id}`).emit('setRoomList', {
        myRooms
    });

}

const checkIfRoom = (socket, callback) => {
    if (socket['room'] !== undefined) {
        return callback;
    }
}

const generateId = () => {
    const date = JSON.stringify(new Date());
    const random = JSON.stringify(Math.floor(Math.random() * Math.floor(100)));
    const id = date + random;
    return id;
}

const createTeacher = (socket, data) => {
    const newTeacher = new Teacher(data.firstName, data.lastName);
    teachers[newTeacher.name] = newTeacher;
    io.to(`${socket.id}`).emit('teacherCreated', data);
}

function onConnection(socket) {
    console.log(socket.id, 'user connected');
    // To create a new teacher
    socket.on('newTeacher', data => {
        console.log('newTeach', data);
        createTeacher(socket, data);
    });

    // ROOM FUNCTIONS
    // When the teacher connected, we get a request for his rooms
    socket.on('getRooms', data => {
        console.log('getRooms', data);
        const userName = data.firstName + data.lastName;
        if (teachers[userName]) {
            sendRoomList(socket, userName);
        } else {
            createTeacher(socket, data);
        }
    });

    // If the user wants to create a room
    socket.on('createRoom', (data) => {
        console.log('create');
        const userName = data.firstName + data.lastName;
        const roomId = generateId();
        const newRoom = new Room(roomId);
        if (!teachers[userName]) createTeacher(socket, data);
        let teacher = teachers[userName];
        teacher.addRoom(roomId);
        rooms[roomId] = newRoom;
        sendRoomList(socket, userName);
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
                socket.emit('getRoomLines', {
                    lines: rooms[room.room].lines
                });
            } else {
                console.log('too many users');
            };
        } else {
            console.log('room does not exist');
        };
    });

    // THE WHITEBOARD FUNCTIONALITIES
    socket.on('drawing', function (data) {
        checkIfRoom(socket, function (socket, data) {
            socket.to(socket['room']).emit('drawing', data);
            rooms[socket['room']].addLine('drawing', data);
        });
        console.log(data);
    });

    socket.on('rectangle', function (data) {
        checkIfRoom(socket, function (socket, data) {
            socket.to(socket['room']).emit('rectangle', data);
            console.log(socket['room']);
            rooms[socket['room']].addLine('rectangle', data);
            console.log(data);
        });
    });

    socket.on('linedraw', function (data) {
        checkIfRoom(socket, function (socket, data) {
            socket.to(socket['room']).emit('linedraw', data);
            rooms[socket['room']].addLine('linedraw', data);
            console.log(data);
        });
    });

    socket.on('circledraw', function (data) {
        checkIfRoom(socket, function (socket, data) {
            socket.to(socket['room']).emit('circledraw', data);
            rooms[socket['room']].addLine('circledraw', data);
            console.log(data);
        });
    });

    socket.on('ellipsedraw', function (data) {
        checkIfRoom(socket, function (socket, data) {
            socket.to(socket['room']).emit('ellipsedraw', data);
            rooms[socket['room']].addLine('ellipsedraw', data);
            console.log(data);
            console.log(rooms[socket['room']]);
        });
    });

    socket.on('textdraw', function (data) {
        checkIfRoom(socket, function (socket, data) {
            socket.to(socket['room']).emit('textdraw', data);
            rooms[socket['room']].addLine('textdraw', data);
            console.log(data);
        });
    });

    socket.on('copyCanvas', function (data) {
        checkIfRoom(socket, function (socket, data) {
            socket.to(socket['room']).emit('copyCanvas', data);
            rooms[socket['room']].addLine('copyCanvas', data);
            console.log(data);
        });
    });

    socket.on('Clearboard', function (data) {
        checkIfRoom(socket, function (socket, data) {
            socket.to(socket['room']).emit('Clearboard', data);
            rooms[socket['room']].clearAll();
            console.log(data);
        });
    });

    // ON DISCONNECT
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

};


exports.start = startIO;