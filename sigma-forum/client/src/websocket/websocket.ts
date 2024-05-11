import io from 'socket.io-client';

const socket = io('http://localhost:2282');

export default socket;
