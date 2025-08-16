"use client";

import { useUser, SignOutButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, LogOut, Package, Heart, Clock, Shield } from "lucide-react";
import Link from "next/link";
import packageJson from "@/package.json";

export function ProfileContent() {
  const { user } = useUser();
  const adminStatus = useQuery(api.setup.getCurrentUserAdminStatus);
  const userCollection = useQuery(api.links.getUserCollection, {});
  
  const bookmarkCount = userCollection?.length || 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* User Profile Card */}
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.imageUrl} alt={user?.fullName || ""} />
              <AvatarFallback>
                {user?.firstName?.[0] || "U"}
                {user?.lastName?.[0] || ""}
              </AvatarFallback>
            </Avatar>
          </div>
          <CardTitle>{user?.fullName || "User"}</CardTitle>
          <CardDescription>{user?.primaryEmailAddress?.emailAddress}</CardDescription>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-gray-600 dark:text-gray-400" />
              <div>
                <p className="text-2xl font-bold">{bookmarkCount}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Bookmarks</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Heart className="h-8 w-8 text-gray-600 dark:text-gray-400" />
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Favorites</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-gray-600 dark:text-gray-400" />
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Reminders</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
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
        </CardContent>
      </Card>

      {/* Footer Info */}
      <div className="text-center text-xs text-gray-500 dark:text-gray-400 pt-4">
        <p>Version {packageJson.version}</p>
        <p className="mt-1">© {new Date().getFullYear()} {packageJson.name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</p>
      </div>
    </div>
  );
} 