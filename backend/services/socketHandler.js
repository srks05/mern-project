const socketIo = require('socket.io');
const Properties = require('../models/Properties');
const Bids = require('../models/Bids');

let productQuantity = 10; 

module.exports = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type"],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.emit('productQuantity', productQuantity);

    socket.on('buyProduct', (userName) => {
      if (productQuantity > 0) {
        productQuantity -= 1;
        console.log(`${userName} bought a product, remaining qty:`, productQuantity);

        io.emit('productQuantity', productQuantity);
        io.emit('message', `${userName} bought a product! Remaining quantity: ${productQuantity}`);
      } else {
        io.emit('message', 'Sorry, the product is out of stock!');
      }
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });

    
    socket.on('placeBid', async (bidData) => {
      try {
        const { propertyId, bidAmount, buyerName, bidId } = bidData;

        
        const updatedProperty = await Properties.findByIdAndUpdate(
          propertyId,
          { soldPrice: bidAmount },
          { new: true }
        );

        if (!updatedProperty) {
          socket.emit('bidError', { message: 'Property not found' });
          return;
        }

        
        io.emit('bidUpdate', {
          propertyId,
          soldPrice: bidAmount,
          buyerName,
          bidId
        });

      } catch (error) {
        console.error('Error handling bid:', error);
        socket.emit('bidError', { message: 'Error processing bid' });
      }
    });
  });
};
