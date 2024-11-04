import mongoose from "mongoose";

export const connectDatabase = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "docStract",
    })
    .then((con) => console.log(`Database Connected with ${con.connection.host}`))
    .catch((err) => console.log(err));
};