import User from "../models/User.js";

export const createUserService = async (userData) => {
    // Validate
    if (!userData.name || !userData.email) {
        throw new Error("Name and Email are required");
    }

    // Check Existing User
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
        throw new Error("User with this email already exists");
    }

    // Create User
    const user = await User.create(userData);

    // Return Response
    return {
        success: true,
        message: "User created successfully",
        user,
    }
}