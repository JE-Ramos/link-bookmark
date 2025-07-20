"use client";

import { useUser, SignOutButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, LogOut, Package, Heart, Clock, Shield } from "lucide-react";
import Link from "next/link";

interface ProfilePageProps {
  bookmarkCount?: number;
}

export function ProfilePage({ bookmarkCount = 0 }: ProfilePageProps) {
  const { user, isLoaded } = useUser();
  const adminStatus = useQuery(api.setup.getCurrentUserAdminStatus);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse space-y-4">
          <div className="h-24 w-24 bg-gray-200 rounded-full mx-auto" />
          <div className="h-4 bg-gray-200 rounded w-32 mx-auto" />
          <div className="h-4 bg-gray-200 rounded w-48 mx-auto" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Sign in Required</CardTitle>
            <CardDescription>
              Please sign in to view your profile
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const stats = [
    { label: "Bookmarks", value: bookmarkCount.toString(), icon: Heart },
    { label: "Orders", value: "0", icon: Package },
    { label: "Member Since", value: new Date(user.createdAt!).toLocaleDateString(), icon: Clock },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Profile Header */}
      <Card className="border-0 shadow-none bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24 ring-4 ring-white dark:ring-gray-800 shadow-xl">
              <AvatarImage src={user.imageUrl} alt={user.fullName || "Profile"} />
              <AvatarFallback className="text-xl font-semibold bg-black dark:bg-white text-white dark:text-black">
                {user.firstName?.charAt(0) || user.emailAddresses[0].emailAddress.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.fullName || "User"}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {user.emailAddresses[0].emailAddress}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-4 pb-4 text-center">
                <Icon className="h-5 w-5 mx-auto mb-2 text-gray-600 dark:text-gray-400" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {adminStatus?.isAdmin && (
          <Link href="/admin" className="block">
            <Button 
              variant="outline" 
              className="w-full justify-start"
            >
              <Shield className="mr-2 h-4 w-4" />
              Admin Dashboard
            </Button>
          </Link>
        )}
        
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={() => {/* TODO: Add settings navigation */}}
        >
          <Settings className="mr-2 h-4 w-4" />
          Account Settings
        </Button>
        
        <SignOutButton>
          <Button 
            variant="outline" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </SignOutButton>
      </div>

      {/* Footer Info */}
      <div className="text-center text-xs text-gray-500 dark:text-gray-400 pt-4">
        <p>Version 1.0.0</p>
        <p className="mt-1">© 2024 Link Bookmark</p>
      </div>
    </div>
  );
} 