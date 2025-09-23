import React, { useState, useEffect } from "react";
import { OnboardingData } from "./Onboarding";
import Button from "../ui/Button";
import { Input } from "../ui/input";
import { ArrowRightIcon } from "lucide-react";

interface ProfileEditScreenProps {
  onboardingData: OnboardingData;
  updateOnboardingData: (data: Partial<OnboardingData>) => void;
  nextStep: () => void;
}

const ProfileEditScreen: React.FC<ProfileEditScreenProps> = ({
  onboardingData,
  updateOnboardingData,
  nextStep,
}) => {
  const [name, setName] = useState(onboardingData.user?.name || "");
  const [email, setEmail] = useState(onboardingData.user?.email || "");
  const [profilePicture, setProfilePicture] = useState(
    onboardingData.user?.profilePicture || ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (onboardingData.user) {
      setName(onboardingData.user.name || "");
      setEmail(onboardingData.user.email || "");
      setProfilePicture(onboardingData.user.profilePicture || "");
    }
  }, [onboardingData.user]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      // Simulate upload for now
      const simulatedUrl = URL.createObjectURL(file);
      setProfilePicture(simulatedUrl);
      alert("Profile picture uploaded successfully (simulated)!");
    } catch (err: any) {
      setError(err.message || "Failed to upload profile picture");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, profilePicture }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      updateOnboardingData({ user: { name, email, profilePicture } });
      nextStep();
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Edit Your Profile
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center mb-6">
            {profilePicture ? (
              <img
                src={profilePicture}
                alt="Profile Preview"
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-300"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-4xl font-bold">
                ?
              </div>
            )}
            <label
              htmlFor="profile-picture-upload"
              className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition-colors"
            >
              Upload Profile Picture
            </label>
            <input
              id="profile-picture-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="name"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Name
            </label>
            <Input
              type="text"
              id="name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Email
            </label>
            <Input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors font-semibold"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditScreen;
