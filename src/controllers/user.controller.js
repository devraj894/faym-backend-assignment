import { createUserService } from "../services/user.service.js";

export const createUser = async (req, res) => {
    try {
        const userData = req.body;
        const result = await createUserService(userData);
        return res.status(201).json(result);
    } catch(err) {
        console.error(err);
        return res.status(500).json({ success: false, message: err.message });
    }
}