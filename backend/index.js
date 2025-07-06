const express = require('express');
const cors = require('cors');
const userAuth = require('./routes/userAuth');
const { withoutParameter } = require('./middleware/testware');
const http = require('http');
const socketHandler = require('./services/socketHandler');
const connectDB = require("./dbConnect");
const propertiesRoute = require('./routes/propertiesRoute');
const Properties = require('./models/Properties');
connectDB
const app = express();
const PORT = 4646;

const server = http.createServer(app);
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use("/uploads", express.static("uploads"));

app.use('/api/auth', userAuth);
app.use('/api/properties', propertiesRoute);
app.get('/', (req, res) => res.send("working . . ."));
socketHandler(server)

// Scheduled job to mark properties as 'Sold' when bidding ends
setInterval(async () => {
  const now = new Date();
  try {
    const result = await Properties.updateMany(
      { status: { $in: ['OnSell', 'Approved'] }, endBiddingTime: { $lt: now } },
      { $set: { status: 'Sold' } }
    );
    if (result.modifiedCount > 0) {
      console.log(`Updated ${result.modifiedCount} properties to Sold.`);
    }
  } catch (err) {
    console.error('Error updating property statuses:', err);
  }
}, 60 * 1000); // Runs every 1 minute

server.listen(PORT, () => {
  console.info(`Working on http://localhost:${PORT}`);
});
