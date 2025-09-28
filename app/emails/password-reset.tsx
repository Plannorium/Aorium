import * as React from "react";

interface PasswordResetEmailProps {
  resetUrl: string;
}

export const PasswordResetEmail: React.FC<
  Readonly<PasswordResetEmailProps>
> = ({ resetUrl }) => (
  <div>
    <h1>Reset Your Password</h1>
    <p>
      You are receiving this email because you (or someone else) have requested
      the reset of the password for your account.
    </p>
    <p>
      Please click on the following link, or paste this into your browser to
      complete the process within one hour of receiving it:
    </p>
    <a href={resetUrl}>{resetUrl}</a>
    <p>
      If you did not request this, please ignore this email and your password
      will remain unchanged.
    </p>
  </div>
);
