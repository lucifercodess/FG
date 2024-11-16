import jwt from 'jsonwebtoken';

export const TokenAndCookie = async (userId, res) => {
  try {
    // Create JWT token
    const token = jwt.sign({ userId }, process.env.JWT, {
      expiresIn: '1d', // Token will expire in 1 day
    });

    // Set the cookie with the token
    res.cookie("fuckGram", token, {
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day expiration for the cookie
      httpOnly: true, // Prevents JS from accessing the cookie
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 0, msg: "Error in generating token" });
  }
};
