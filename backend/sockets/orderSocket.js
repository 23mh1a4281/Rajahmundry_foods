let ioInstance;

export const initOrderSocket = (io) => {
  ioInstance = io;
  io.on('connection', (socket) => {
    // Client should emit 'join' with { userId }
    socket.on('join', ({ userId }) => {
      if (userId) {
        socket.join(`user_${userId}`);
      }
    });
    socket.on('disconnect', () => {});
  });
};

// Emit order update to relevant users
export const emitOrderUpdate = (order) => {
  if (!ioInstance) return;
  // Notify customer
  ioInstance.to(`user_${order.customer}`).emit('orderUpdate', order);
  // Notify restaurant owner
  ioInstance.to(`user_${order.restaurant}`).emit('orderUpdate', order);
  // Notify delivery boy if assigned
  if (order.deliveryBoy) {
    ioInstance.to(`user_${order.deliveryBoy}`).emit('orderUpdate', order);
  }
}; 