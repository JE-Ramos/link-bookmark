"use client";

import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { MapPin, Link, Mail, Twitter, Github, Linkedin, Calendar, Users, Briefcase, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BaseCard } from "./base-card";

interface ProfileCardProps {
  name: string;
  username?: string;
  bio?: string;
  url: string;
  avatar?: string;
  coverImage?: string;
  role?: string;
  company?: string;
  location?: string;
  email?: string;
  website?: string;
  joinDate?: string;
  followersCount?: number;
  followingCount?: number;
  skills?: string[];
  social?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
  verified?: boolean;
  isPro?: boolean;
  onFollow?: () => void;
  onMessage?: () => void;
}

export function ProfileCard({
  name,
  username,
  bio,
  url,
  avatar,
  coverImage,
  role,
  company,
  location,
  email,
  website,
  joinDate,
  followersCount,
  followingCount,
  skills,
  social,
  verified,
  isPro,
  onFollow,
  onMessage,
}: ProfileCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long',
      year: 'numeric'
    });
  };

  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <BaseCard source={url}>
      {/* Cover Image */}
      <div className="relative h-24 bg-gradient-to-r from-primary/20 to-primary/10">
        {coverImage && (
          <img
            src={coverImage}
            alt=""
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Avatar */}
        <div className="absolute -bottom-10 left-4">
          <div className="relative">
            {avatar ? (
              <img
                src={avatar}
                alt={name}
                className="w-20 h-20 rounded-full border-4 border-background object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full border-4 border-background bg-muted flex items-center justify-center">
                <span className="text-xl font-bold text-muted-foreground">
                  {name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            
            {/* Verified Badge */}
            {verified && (
              <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1">
                <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        </div>
        
        {/* Pro Badge */}
        {isPro && (
          <div className="absolute top-2 right-2">
            <span className="bg-yellow-500 text-white px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
              <Award className="h-3 w-3" />
              PRO
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col">
        <CardHeader className="pt-14 pb-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{name}</CardTitle>
            </div>
            {username && (
              <p className="text-xs text-muted-foreground">@{username}</p>
            )}
            {role && (
              <div className="flex items-center gap-1 text-xs">
                <Briefcase className="h-3 w-3 text-muted-foreground" />
                <span>{role}</span>
                {company && <span className="text-muted-foreground">at {company}</span>}
              </div>
            )}
          </div>
        </CardHeader>

        {bio && (
          <CardContent className="pt-0 pb-2">
            <CardDescription className="line-clamp-2 text-sm">{bio}</CardDescription>
          </CardContent>
        )}

        <CardContent className="flex-1 pb-3">
          {/* Contact & Location Info */}
          <div className="space-y-1 text-xs">
            {location && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{location}</span>
              </div>
            )}
            {website && (
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Link className="h-3 w-3" />
                <span className="truncate">{website.replace(/^https?:\/\//, '')}</span>
              </a>
            )}
            {joinDate && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>Joined {formatDate(joinDate)}</span>
              </div>
            )}
          </div>

          {/* Stats */}
          {(followersCount !== undefined || followingCount !== undefined) && (
            <div className="flex items-center gap-3 mt-3 text-xs">
              {followersCount !== undefined && (
                <div>
                  <span className="font-bold">{formatCount(followersCount)}</span>
                  <span className="text-muted-foreground ml-1">Followers</span>
                </div>
              )}
              {followingCount !== undefined && (
                <div>
                  <span className="font-bold">{formatCount(followingCount)}</span>
                  <span className="text-muted-foreground ml-1">Following</span>
                </div>
              )}
            </div>
          )}

          {/* Skills */}
          {skills && skills.length > 0 && (
            <div className="mt-3">
              <div className="flex flex-wrap gap-1">
                {skills.slice(0, 4).map((skill, index) => (
                  <span
                    key={index}
                    className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded-md text-xs"
                  >
                    {skill}
                  </span>
                ))}
                {skills.length > 4 && (
                  <span className="text-xs text-muted-foreground px-1">
                    +{skills.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Social Links */}
          {social && (social.twitter || social.github || social.linkedin) && (
            <div className="flex items-center gap-2 mt-3">
              {social.twitter && (
                <a
                  href={social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Twitter className="h-3 w-3" />
                </a>
              )}
              {social.github && (
                <a
                  href={social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Github className="h-3 w-3" />
                </a>
              )}
              {social.linkedin && (
                <a
                  href={social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Linkedin className="h-3 w-3" />
                </a>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-0 pb-4 gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            View Profile
          </Button>
          {onFollow && (
            <Button size="sm" onClick={onFollow} className="flex-1 gap-1">
              <Users className="h-3 w-3" />
              Follow
            </Button>
          )}
          {onMessage && (
            <Button variant="ghost" size="icon" onClick={onMessage} className="h-8 w-8">
              <Mail className="h-3 w-3" />
            </Button>
          )}
        </CardFooter>
      </div>
    </BaseCard>
  );
} 