const User = require("../../model/relationalModels/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Hospital = require("../../model/relationalModels/hospitalMaster");
const Nodal = require("../../model/relationalModels/nodalMaster");

// A. Doctor Authentication
const login = async (req, res) => {
  try {
    //1. Request By User
    const { username, password } = req.body;
    
    console.log("Login attempt for username:", username);

    //2. Find user
    const user = await User.findOne({
      where: { username },
      include: [
        {
          model: Hospital,
          attributes: ["id", "hospitalname"],
        },
        {
          model: Nodal,
          attributes: ["id", "nodalname"],
        },
      ],
    });
    
    if (!user) {
      console.log("No user found with username:", username);
      return res.status(404).json({ message: "No User found" });
    }

    console.log("User found:", user.username, "Role:", user.role);

    //3. Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch for user:", username);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("Password matched for user:", username);

    //4. Handle Login Doctor roles
    if (user.role === "doctor") {
      console.log("Processing doctor login...");
      
      // Debug the JWT secret
      const jwtSecret = process.env.JWT_SECRET || "my-secret-key";
      console.log("JWT Secret exists:", !!jwtSecret);
      console.log("JWT Secret length:", jwtSecret ? jwtSecret.length : 0);
      console.log("JWT Secret value:", jwtSecret); // Remove this in production!
      
      // Debug the payload
      const payload = { 
        id: user.user_id, 
        role: user.role, 
        module: user.module 
      };
      console.log("JWT Payload:", payload);
      
      try {
        const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
        console.log("Token generated successfully");
        
        return res.status(200).json({
          success: true,
          token,
          id: user.user_id,
          role: user.role,
          module: user.module,
          hospitalid: user.hospitalid,
          username: user.firstName + " " + user.lastname,
        });
      } catch (jwtError) {
        console.error("JWT Error:", jwtError.message);
        throw jwtError;
      }
    } else {
      console.log("User role is not doctor:", user.role);
      return res.status(403).json({ message: "Access denied for non-doctor users" });
    }
  } catch (e) {
    console.error("Login error:", e);
    return res.status(500).json({
      message: `Something went wrong: ${e.message}`,
    });
  }
};

module.exports = {
  login
};