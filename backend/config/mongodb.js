import mongoose from "mongoose";

const getMongoDbUri = (inputUri) => {
  const fallback = "mongodb://127.0.0.1:27017/trendify";
  const rawUri = (inputUri || "").trim();

  if (!rawUri) return fallback;

  try {
    const parsed = new URL(rawUri);
    const currentDbPath = parsed.pathname.replace(/\/+$/, "");

    // Force a valid DB name even when URI ends with "/" or has no DB segment.
    if (currentDbPath !== "/trendify") {
      parsed.pathname = "/trendify";
    }

    return parsed.toString();
  } catch {
    const withoutTrailingSlash = rawUri.replace(/\/+$/, "");
    return withoutTrailingSlash.endsWith("/trendify")
      ? withoutTrailingSlash
      : `${withoutTrailingSlash}/trendify`;
  }
};

const connectDB = async () => {
  try {
    const dbUri = getMongoDbUri(process.env.MONGODB_URI);

    if (mongoose.connection.readyState === 1) return true;

    await mongoose.connect(dbUri);
    console.log("MongoDB connected");
    return true;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    return false;
  }
};

export default connectDB;
