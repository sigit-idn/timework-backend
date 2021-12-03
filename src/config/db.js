const { connect } = require("mongoose");

const connectDb = async () => {
  try {
    console.warn("Connecting to MongoDB...");
    await connect(process.env.MONGO_LOCAL_URI);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectDb;
