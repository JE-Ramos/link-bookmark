"use client";

import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Users, Ticket, Video, DollarSign, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BaseCard } from "./base-card";

interface EventCardProps {
  title: string;
  description?: string;
  url: string;
  image?: string;
  startDate: string;
  endDate?: string;
  location?: {
    name: string;
    address?: string;
    city?: string;
    country?: string;
  };
  virtualLocation?: string;
  organizer?: string;
  price?: string;
  currency?: string;
  availability?: "available" | "sold out" | "limited";
  attendeeCount?: number;
  maxAttendees?: number;
  eventType?: "online" | "offline" | "hybrid";
  tags?: string[];
  onRegister?: () => void;
  onShare?: () => void;
}

export function EventCard({
  title,
  description,
  url,
  image,
  startDate,
  endDate,
  location,
  virtualLocation,
  organizer,
  price,
  currency = "USD",
  availability = "available",
  attendeeCount,
  maxAttendees,
  eventType = "offline",
  tags,
  onRegister,
  onShare,
}: EventCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatPrice = (priceValue: string) => {
    if (priceValue === "0" || priceValue.toLowerCase() === "free") {
      return "Free";
    }
    const num = parseFloat(priceValue);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(num);
  };

  const getAvailabilityColor = () => {
    switch (availability) {
      case "sold out":
        return "text-destructive";
      case "limited":
        return "text-yellow-600";
      default:
        return "text-green-600";
    }
  };

  const getEventTypeIcon = () => {
    switch (eventType) {
      case "online":
        return <Video className="h-3 w-3" />;
      case "hybrid":
        return (
          <>
            <MapPin className="h-3 w-3" />
            <Video className="h-3 w-3" />
          </>
        );
      default:
        return <MapPin className="h-3 w-3" />;
    }
  };

  const isSameDay = startDate && endDate && 
    new Date(startDate).toDateString() === new Date(endDate).toDateString();

  return (
    <BaseCard source={url}>
      {/* Event Image - Fixed height */}
      <div className="relative h-48 overflow-hidden bg-muted">
        {image ? (
          <img
            src={image}
            alt={title}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Calendar className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        {/* Event Type Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            {getEventTypeIcon()}
            <span className="capitalize">{eventType}</span>
          </span>
        </div>
        
        {/* Price Badge */}
        {price && (
          <div className="absolute top-3 right-3">
            <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-bold">
              {formatPrice(price)}
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col">
        <CardHeader className="pb-2">
          <div className="space-y-1">
            {/* Date and Time */}
            <div className="flex items-start gap-2 text-primary">
              <Calendar className="h-4 w-4 mt-0.5" />
              <div className="text-xs font-medium">
                <p>{formatDate(startDate)}</p>
                <p className="text-muted-foreground">
                  {formatTime(startDate)}
                  {endDate && !isSameDay && ` - ${formatDate(endDate)}`}
                  {endDate && isSameDay && ` - ${formatTime(endDate)}`}
                </p>
              </div>
            </div>
            
            <CardTitle className="text-lg line-clamp-2">{title}</CardTitle>
            
            {organizer && (
              <p className="text-xs text-muted-foreground">by {organizer}</p>
            )}
          </div>
        </CardHeader>

        {description && (
          <CardContent className="pt-0 pb-2">
            <CardDescription className="line-clamp-2 text-sm">{description}</CardDescription>
          </CardContent>
        )}

        <CardContent className="flex-1 pb-3">
          {/* Location */}
          {(location || virtualLocation) && (
            <div className="flex items-start gap-2 mb-2">
              <MapPin className="h-3 w-3 text-muted-foreground mt-0.5" />
              <div className="text-xs">
                {location && (
                  <div>
                    <p className="font-medium line-clamp-1">{location.name}</p>
                    {location.address && (
                      <p className="text-muted-foreground line-clamp-1">{location.address}</p>
                    )}
                    {(location.city || location.country) && (
                      <p className="text-muted-foreground">
                        {[location.city, location.country].filter(Boolean).join(', ')}
                      </p>
                    )}
                  </div>
                )}
                {virtualLocation && (
                  <p className="text-muted-foreground">{virtualLocation}</p>
                )}
              </div>
            </div>
          )}

          {/* Attendance Info */}
          <div className="flex items-center gap-3 text-xs">
            {attendeeCount !== undefined && (
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3 text-muted-foreground" />
                <span>{attendeeCount} attending</span>
              </div>
            )}
            
            {maxAttendees && (
              <div className={`flex items-center gap-1 ${getAvailabilityColor()}`}>
                <Ticket className="h-3 w-3" />
                <span>
                  {availability === "sold out" 
                    ? "Sold Out" 
                    : availability === "limited" 
                    ? "Limited" 
                    : `${maxAttendees - (attendeeCount || 0)} left`}
                </span>
              </div>
            )}
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded-md text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-0 pb-4 gap-2">
          <Button 
            variant={availability === "sold out" ? "secondary" : "default"} 
            size="sm"
            className="flex-1 gap-1"
            disabled={availability === "sold out"}
          >
            {availability === "sold out" ? (
              "Sold Out"
            ) : (
              <>
                <Ticket className="h-3 w-3" />
                {price === "0" || price?.toLowerCase() === "free" ? "Register Free" : "Get Tickets"}
              </>
            )}
          </Button>
          {onShare && (
            <Button variant="ghost" size="icon" onClick={onShare} className="h-8 w-8">
              <Share2 className="h-3 w-3" />
            </Button>
          )}
        </CardFooter>
      </div>
    </BaseCard>
  );
} 