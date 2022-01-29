const mongoose = require("mongoose");
const { MongoURL } = global.client.settings;

mongoose.connect(MongoURL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
});

mongoose.connection.on("connected", () => console.log("Database başarılı bir şekilde bağlandı"));
mongoose.connection.on("error", () => console.error("Database bağlantısında bir problem yaşandı"));