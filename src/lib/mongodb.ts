import { MongoClient } from "mongodb";

// MongoDB connection configuration
const options = {
  tls: true,
  // tlsAllowInvalidCertificates: false, // Keep false for production; uncomment to debug SSL issues only
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // To prevent multiple connections in development
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getMongoClient(): Promise<MongoClient> {
  if (!process.env.MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable in .env.local");
  }

  const uri = process.env.MONGODB_URI;

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  } else {
    if (!clientPromise) {
      client = new MongoClient(uri, options);
      clientPromise = client.connect();
    }
    return clientPromise;
  }
}

export default getMongoClient();
