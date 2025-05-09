if (process.env.NODE_ENV !== "test") {
    require("dotenv").config();
}

const express = require("express");
const swaggerUI = require("swagger-ui-express");
const swaggerDocs = require("./src/docs/swagger.json");
const routes = require("./src/routes/router")

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));
app.use(routes);

if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, () => {
        console.log(`-> Listening on PORT: ${PORT}`);
    });
}

module.exports = app;