import type { NextApiRequest, NextApiResponse } from "next";
import { collection, query, where, getDocs, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

interface CreateAdminRequest {
  name: string;
  email: string;
  password: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, password }: CreateAdminRequest = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    // Check if admin with this email already exists
    const q = query(
      collection(db, "userTable"),
      where("email", "==", email),
      where("userType", "==", "admin")
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return res.status(409).json({ error: "Admin with this email already exists" });
    }

    // Create admin user
    const adminData = {
      name,
      email,
      password, // In production, hash this password
      userType: "admin",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, "userTable"), adminData);

    return res.status(201).json({
      success: true,
      message: "Admin user created successfully",
      id: docRef.id,
      data: {
        id: docRef.id,
        name,
        email,
        userType: "admin",
      },
    });
  } catch (error) {
    console.error("Error creating admin:", error);
    return res.status(500).json({
      error: "Failed to create admin user",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

