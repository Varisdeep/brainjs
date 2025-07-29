// API route handler for user registration
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// POST /api/register
export async function POST(req: Request) {
  try {
    // Parse request body
    const { name, email, password } = await req.json();

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;

    // ✅ Specify the database name
    const db = client.db("stockmarketDatabase");

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists." },
        { status: 409 }
      );
    }

    // Hash the password securely
    const hashedPassword = await hash(password, 12);

    // Insert new user
    const result = await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      role: "user", // Default role
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      userId: result.insertedId,
    });
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

