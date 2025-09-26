"use client";
import React, { useState } from "react";
import SocialPerformanceWidget from "../../components/dashboard/SocialPerformanceWidget";
import ConnectAccountModal from "../../components/dashboard/ConnectAccountModal";

const SocialPerformancePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConnectTwitter = async () => {
    try {
      // The actual connection logic is handled by redirecting to /api/twitter/auth
      // This is handled in the ConnectAccountModal
      // We just close the modal here
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error connecting to Twitter:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <SocialPerformanceWidget setIsModalOpen={setIsModalOpen} />
      <ConnectAccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConnectTwitter={handleConnectTwitter}
      />
    </div>
  );
};

export default SocialPerformancePage;
