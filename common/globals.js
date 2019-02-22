let io = undefined;

const setIO = newIO => {

  io = newIO;

}

const getIO = () => io;


module.exports = {

  getIO,
  setIO

}
