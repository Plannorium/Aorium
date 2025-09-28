import * as React from "react";

interface WelcomeEmailProps {
  name: string;
}

export const WelcomeEmail: React.FC<Readonly<WelcomeEmailProps>> = ({
  name,
}) => (
  <div>
    <h1>Welcome, {name}!</h1>
    <p>Thanks for signing up for Aorium. We're excited to have you on board!</p>
  </div>
);
