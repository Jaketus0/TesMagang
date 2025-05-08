if (process.env.NODE_ENV !== "test") {
    require("dotenv").config();
}

const express = require("express");

const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const products = require("./src/routes/router")

app.use(products);

if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, () => {
        console.log(`-> Listening on PORT: ${PORT}`);
    });
}