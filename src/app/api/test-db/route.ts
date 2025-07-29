// Database connection test API route

import { NextResponse } from "next/server";

// Dynamically import MongoDB client to avoid build-time issues
const getClientPromise = async () => {
  const { default: clientPromise } = await import("@/lib/mongodb");
  return clientPromise;
};

export async function GET() {
  try {
    const clientPromise = await getClientPromise();
    const client = await clientPromise;
    const db = client.db("stockmarketDatabase");
// Optional: change this to your actual DB name

    const collections = await db.listCollections().toArray();

    return NextResponse.json({
      success: true,
      message: "Connected to MongoDB successfully!",
      collections: collections.map((col: { name: string }) => col.name),
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    return NextResponse.json(
      { success: false, message: "MongoDB connection failed." },
      { status: 500 }
    );
  }
}
