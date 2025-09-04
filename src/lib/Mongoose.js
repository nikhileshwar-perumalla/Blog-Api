import mongoose from "mongoose";
import config from "../config/index.js";
import { logger } from "./winston.js";

const clientOptions = {
    // See MongoDB Node.js Driver options
    dbName: "blog_api",
    appName: "Blog_api",
    serverApi: {
        version: "1",
        strict: true,
        deprecationErrors: true,
    },
};

export const connectToDatabase = async () => {
    if (!config.MONGO_URI) {
        throw new Error("MONGO_URI is missing. Please set it in your environment.");
    }
    try {
        await mongoose.connect(config.MONGO_URI, clientOptions);
        logger.info("Connected to DB", {
            uri: config.MONGO_URI,
            options: clientOptions,
        });
    } catch (err) {
        if (err instanceof Error) {
            throw err;
        }
        logger.error("Error connecting to DB", err);
    }
};

export const DisconnectingFromDB = async () => {
    try {
        await mongoose.disconnect();
        logger.info("Disconnected from DB", {
            uri: config.MONGO_URI,
            options: clientOptions,
        });
    } catch (err) {
        if (err instanceof Error) {
            throw err;
        }
        logger.error("Error disconnecting", err);
    }
};