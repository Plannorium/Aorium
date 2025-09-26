"use client";
import React, { useState, useEffect } from "react";
import { Twitter, BarChart2Icon } from "lucide-react";
import Button from "../ui/Button";
import Card from "../ui/Card";
// import ConnectAccountModal from "./ConnectAccountModal"; // Removed import

interface SocialPerformanceWidgetProps {
  setIsModalOpen: (isOpen: boolean) => void;
}

const SocialPerformanceWidget: React.FC<SocialPerformanceWidgetProps> = ({ setIsModalOpen }) => {
  const [twitterData, setTwitterData] = useState(null);

  useEffect(() => {
    const fetchTwitterData = async () => {
      try {
        const res = await fetch("/api/twitter?username=TwitterDev"); // using a default username for now
        if (res.ok) {
          const data = await res.json();
          setTwitterData(data);
        }
      } catch (error) {
        console.error("Error fetching Twitter data:", error);
      }
    };
    fetchTwitterData();
  }, []);

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-semibold text-text-dark">
            Social Performance
          </h2>
          <p className="text-gray-600">
            Track your social media performance metrics.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
        >
          Connect Accounts
        </Button>
      </div>

      {twitterData ? (
        <div>
          <div className="flex items-center mb-4">
            <Twitter className="mr-2" />
            <h3 className="text-lg font-semibold text-text-dark">
              Twitter Performance
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card variant="default" className="p-4">
              <h4 className="text-sm text-gray-500">Followers</h4>
              <p className="text-2xl font-bold">
                {twitterData.followers_count}
              </p>
            </Card>
            <Card variant="default" className="p-4">
              <h4 className="text-sm text-gray-500">Following</h4>
              <p className="text-2xl font-bold">
                {twitterData.following_count}
              </p>
            </Card>
            <Card variant="default" className="p-4">
              <h4 className="text-sm text-gray-500">Tweets</h4>
              <p className="text-2xl font-bold">{twitterData.tweet_count}</p>
            </Card>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">
            Connect your social media accounts to see your performance metrics.
          </p>
        </div>
      )}
    </Card>
  );
};

export default SocialPerformanceWidget;
