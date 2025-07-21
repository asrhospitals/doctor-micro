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
    if (!user) return res.status(404).json({ message: "No User found" });

    //3. Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    //4. Handle Login Doctor roles
    if (user.role === "doctor") {
      const token = jwt.sign(
        { id: user.user_id, role: user.role, module: user.module },
        process.env.JWT_SECRET
        // { expiresIn: '1h' }
      );

      return res.status(200).json({
        success: true,
        token,
        id: user.user_id,
        role: user.role,
        module: user.module,
        hospitalid: user.hospitalid,
        username: user.firstName + " " + user.lastname,
      });
    }
  } catch (e) {
    return res.status(403).json({
      message: `Something went wrong , ${e}`,
    });
  }
};

module.exports = {
  login
};
