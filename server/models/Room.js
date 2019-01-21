

class Room {
    constructor(password){
        this.password;
        this.usersCounter = 0;
        this.lines = [];
    }

    addUser(){   
        this.usersCounter++;
    }
    addLine(type, path){
        const newLine = {
            type: type,
            path: path
        }
        this.lines.push(newLine);
    }
};

exports.Room = Room;