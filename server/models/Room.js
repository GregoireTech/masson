

class Room {
    constructor(password){
        this.password = password;
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
    clearAll(){
        this.lines = [];
    }
};

exports.Room = Room;