const { getIO } = require('./SocketController');


const welcome = (req, res) =>{
    res.send("Hello")
}




module.exports = {
    welcome,
}