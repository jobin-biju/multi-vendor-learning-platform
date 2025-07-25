const sgMail = require('@sendgrid/mail');
const crypto = require('crypto');
const { vendorLoginModel } = require('../model/form.model');


sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await vendorLoginModel.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.tokenExpiration = Date.now() + 3600000; // 1 hour
    await user.save();

    // Frontend URL
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    const msg = {
      to: user.email,
      from: 'rifamolbrkt@gmail.com', // Must be a verified sender in SendGrid
      subject: 'Password Reset Request',
      html: `
        <h2>Password Reset</h2>
        <p>Click <a href="${resetLink}">here</a> to reset your password.</p>
        <p>This link is valid for 1 hour.</p>
      `
    };

    await sgMail.send(msg);
    res.json({ message: 'Reset link sent to email.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send reset link.' });
  }
};

// RESET PASSWORD (No Hashing)
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  console.log("Incoming token:", token);
  console.log("New password:", password);

  try {
    const user = await vendorLoginModel.findOne({
      resetToken: token,
      tokenExpiration: { $gt: Date.now() }
    });

    if (!user) {
      console.log("Token expired or user not found");
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.password = password;
    user.resetToken = undefined;
    user.tokenExpiration = undefined;
    await user.save();

    console.log("Password reset successful");
    res.json({ message: 'Password successfully reset.' });
  }  catch (err) {
  console.error("❌ Error during password reset:", err.message);
  console.error(err); // full object
  res.status(500).json({ message: 'Failed to reset password.' });
}
};
