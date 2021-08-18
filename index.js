const express = require("express");
const app = express();
const config = require("./src/config");
const cors = require("cors")
const errorMiddleware = require("./src/middleware/error");
app.use(cors());
app.use(express.json());

require("./src/routers")(app);

app.use(errorMiddleware);
app.listen(config.app.port, () => {
  console.log(`Server stated on port: ${config.app.port}`);
})


