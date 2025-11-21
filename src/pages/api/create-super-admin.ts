import type { NextApiRequest, NextApiResponse } from "next";
import { signUpWithEmailAndPassword } from "@/lib/firebase/auth";
import { setDocument, getDocument } from "@/lib/firebase/firestore";
import { ROLE_PERMISSIONS } from "@/lib/roles";
import { Timestamp } from "firebase/firestore";

interface CreateSuperAdminRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  companyName?: string;
  contactNumber?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { 
      firstName, 
      lastName, 
      email, 
      password, 
      companyName = "VChase Admin", 
      contactNumber = "" 
    }: CreateSuperAdminRequest = req.body;

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ 
        error: "First name, last name, email, and password are required" 
      });
    }

    // Check if user with this email already exists
    const existingUser = await getDocument("users", email);
    if (existingUser.data) {
      return res.status(409).json({ 
        error: "User with this email already exists" 
      });
    }

    // Create Firebase Auth account
    const authResult = await signUpWithEmailAndPassword(
      email,
      password,
      `${firstName} ${lastName}`
    );

    if (authResult.error) {
      return res.status(400).json({ 
        error: "Failed to create auth account", 
        details: authResult.error 
      });
    }

    if (!authResult.user) {
      return res.status(500).json({ 
        error: "Auth account created but user object is null" 
      });
    }

    // Get super admin permissions
    const permissions = ROLE_PERMISSIONS["super_admin"] || [];

    // Create user profile in Firestore
    const userProfile = {
      id: authResult.user.uid,
      email: email,
      firstName: firstName,
      lastName: lastName,
      companyName: companyName,
      contactNumber: contactNumber,
      userType: "super_admin",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      profileImage: authResult.user.photoURL || "",
      isActive: true,
      isVerified: true,
      verificationStatus: "approved" as const,
      verifiedAt: Timestamp.now(),
      verifiedBy: "system",
      permissions: permissions,
      isApproved: true,
      status: "active",
    };

    await setDocument("users", authResult.user.uid, userProfile);

    return res.status(201).json({
      success: true,
      message: "Super admin account created successfully",
      data: {
        id: authResult.user.uid,
        email: email,
        firstName: firstName,
        lastName: lastName,
        userType: "super_admin",
        permissions: permissions,
      },
    });
  } catch (error) {
    console.error("Error creating super admin:", error);
    return res.status(500).json({
      error: "Failed to create super admin account",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
