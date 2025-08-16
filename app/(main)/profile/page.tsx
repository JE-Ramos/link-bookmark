import { Metadata } from "next";
import { AppHeader } from "@/components/shared/app-header";
import { ProfileContent } from "./components/profile-content";
import { BRAND_NAME } from "@/lib/constants/brand";

export const metadata: Metadata = {
  title: `Profile | ${BRAND_NAME}`,
  description: "Manage your account and settings",
};

export default function ProfilePage() {
  return (
    <>
      <AppHeader 
        title="Profile"
        subtitle="Your account"
        showAddButton={false}
      />
      <main className="max-w-screen-xl mx-auto px-4 py-6">
        <ProfileContent />
      </main>
    </>
  );
} 