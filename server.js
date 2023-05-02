require("express-async-errors");

const migrationsRun = require("./src/database/sqlite/migrations");

const AppError = require("./src/utils/AppError");

const uploadConfig = require("./src/configs/upload");

const express = require("express");

const routes = require("./src/routes");

const cors = require("cors");

migrationsRun();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/files", express.static(uploadConfig.UPLOAD_FOLDER));

app.use(routes);

app.use((error, request, response, next) => {
    if(error instanceof AppError) {
        return response.status(error.statusCode).json({
            status: "error",
            message: error.message
        })

    };

    console.error(error);

    return response.status(500).json({
        status: "error",
        message: "Internal Server Error"
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));