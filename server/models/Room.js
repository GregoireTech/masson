

class Room {
    constructor(name, password){
        this.name = name;
        this.password = password;
        this.string = `id=${name}&&pass=${password}`
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