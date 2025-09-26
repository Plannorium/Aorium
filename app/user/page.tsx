import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { getUser } from "../lib/user";
import { redirect } from "next/navigation";

export default async function UserProfile() {
  const { user } = await getUser();
  if (!user) {
    redirect("/auth/login");
  }
  console.log(user, "user");

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-[#D4AF37] mb-8">User Profile</h1>

      <Card className="p-6 mb-6">
        <div className="flex items-start space-x-6">
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-neutral-light mb-2">
              {user?.name || "User"}
            </h2>
            <p className="text-neutral-light/80 mb-4">{user?.email}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm font-medium text-neutral-light/60 mb-1">
                  Account Created
                </h3>
                <p className="text-neutral-light">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-neutral-light/60 mb-1">
                  Last Updated
                </h3>
                <p className="text-neutral-light">
                  {user?.updatedAt
                    ? new Date(user.updatedAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button variant="outline">Edit Profile</Button>
              <Button variant="secondary">Change Password</Button>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-neutral-light mb-4">
          Account Details
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-neutral-light/60 mb-1">
              Email Verification
            </h3>
            <div className="flex items-center">
              <span className="text-green-400 mr-2">Verified</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-neutral-light/60 mb-1">
              Onboarding Status
            </h3>
            <div className="flex items-center">
              {user?.onboarding?.completed ? (
                <span className="text-green-400">Completed</span>
              ) : (
                <span className="text-secondary">
                  Step {user?.onboarding?.step || 1} of 5
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
