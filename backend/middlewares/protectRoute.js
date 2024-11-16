import jwt from 'jsonwebtoken';
import User from '../model/user.model.js'; 

export const protectRoute = async (req, res, next) => {
  // Retrieve the token from cookies
  const token = req.cookies['fuckGram'];

  if (!token) {
    return res.status(401).json({ code: 0, msg: "Unauthorized, no token found" });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT); // Ensure the correct secret is used

    if (!decoded) {
      return res.status(401).json({ code: 0, msg: "Unauthorized, token is invalid" });
    }

    // Find the user associated with the token
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ code: 0, msg: "Unauthorized, user not found" });
    }

    // Attach the user to the request object for further use
    req.user = user;
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    console.log('Error in authentication route:', error.message); // Log the error message for debugging
    return res.status(500).json({ code: 0, msg: "Server error in authentication route" });
  }
};
