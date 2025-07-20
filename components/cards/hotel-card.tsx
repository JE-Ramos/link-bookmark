"use client";

import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { MapPin, Star, Calendar, Users, Wifi, Car, Coffee, Dumbbell, Waves, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BaseCard } from "./base-card";

interface HotelCardProps {
  name: string;
  url: string;
  image?: string;
  location: {
    address?: string;
    city: string;
    country: string;
    distance?: string; // e.g., "2.5 km from city center"
  };
  rating?: number;
  reviewCount?: number;
  price?: string;
  originalPrice?: string;
  currency?: string;
  priceUnit?: string; // e.g., "per night"
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  roomType?: string;
  amenities?: string[];
  highlights?: string[];
  cancellation?: "free" | "non-refundable" | "partial";
  breakfast?: boolean;
  onBook?: () => void;
  onSave?: () => void;
}

export function HotelCard({
  name,
  url,
  image,
  location,
  rating,
  reviewCount,
  price,
  originalPrice,
  currency = "USD",
  priceUnit = "per night",
  checkIn,
  checkOut,
  guests,
  roomType,
  amenities,
  highlights,
  cancellation = "partial",
  breakfast,
  onBook,
  onSave,
}: HotelCardProps) {
  const formatPrice = (priceValue: string) => {
    const num = parseFloat(priceValue);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return null;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getRatingLabel = (rating: number) => {
    if (rating >= 4.5) return "Excellent";
    if (rating >= 4) return "Very Good";
    if (rating >= 3.5) return "Good";
    return "Fair";
  };

  const getCancellationColor = () => {
    switch (cancellation) {
      case "free":
        return "text-green-600 bg-green-50";
      case "non-refundable":
        return "text-red-600 bg-red-50";
      default:
        return "text-amber-600 bg-amber-50";
    }
  };

  const getAmenityIcon = (amenity: string) => {
    const lower = amenity.toLowerCase();
    if (lower.includes("wifi") || lower.includes("internet")) return <Wifi className="h-3 w-3" />;
    if (lower.includes("parking") || lower.includes("car")) return <Car className="h-3 w-3" />;
    if (lower.includes("breakfast") || lower.includes("coffee")) return <Coffee className="h-3 w-3" />;
    if (lower.includes("gym") || lower.includes("fitness")) return <Dumbbell className="h-3 w-3" />;
    if (lower.includes("pool") || lower.includes("spa")) return <Waves className="h-3 w-3" />;
    return null;
  };

  const nights = calculateNights();
  const discount = originalPrice && price
    ? Math.round(((parseFloat(originalPrice) - parseFloat(price)) / parseFloat(originalPrice)) * 100)
    : null;

  return (
    <BaseCard source={url} contentType="hotel">
      {/* Hotel Image */}
      {image && (
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={image}
            alt={name}
            className="object-cover w-full h-full"
          />
          {discount && (
            <div className="absolute top-2 left-2">
              <span className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                -{discount}% OFF
              </span>
            </div>
          )}
          {onSave && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 bg-white/80 hover:bg-white"
              onClick={onSave}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
            </Button>
          )}
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="line-clamp-2 text-lg leading-tight">{name}</CardTitle>
            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{location.city}, {location.country}</span>
              {location.distance && (
                <span>• {location.distance}</span>
              )}
            </div>
          </div>
          
          {rating && (
            <div className="text-right">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-sm">{rating.toFixed(1)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {getRatingLabel(rating)}
              </p>
              {reviewCount && (
                <p className="text-xs text-muted-foreground">
                  {reviewCount.toLocaleString()} reviews
                </p>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0 pb-3">
        {/* Stay Details */}
        {(checkIn || checkOut || guests || roomType) && (
          <div className="bg-muted/50 rounded-lg p-3 mb-3 space-y-2">
            {checkIn && checkOut && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span>{formatDate(checkIn)} - {formatDate(checkOut)}</span>
                </div>
                {nights && (
                  <span className="font-medium">{nights} night{nights !== 1 ? 's' : ''}</span>
                )}
              </div>
            )}
            
            <div className="flex items-center gap-4 text-sm">
              {guests && (
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3 text-muted-foreground" />
                  <span>{guests} guest{guests !== 1 ? 's' : ''}</span>
                </div>
              )}
              {roomType && (
                <span className="text-muted-foreground">{roomType}</span>
              )}
            </div>
          </div>
        )}

        {/* Highlights */}
        {highlights && highlights.length > 0 && (
          <div className="mb-3">
            {highlights.slice(0, 3).map((highlight, index) => (
              <p key={index} className="text-xs text-green-600 flex items-start gap-1 mb-1">
                <span>✓</span>
                <span>{highlight}</span>
              </p>
            ))}
          </div>
        )}

        {/* Amenities */}
        {amenities && amenities.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {amenities.slice(0, 5).map((amenity, index) => {
              const icon = getAmenityIcon(amenity);
              return (
                <div key={index} className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                  {icon}
                  <span>{amenity}</span>
                </div>
              );
            })}
            {amenities.length > 5 && (
              <span className="text-xs text-muted-foreground px-2 py-1">
                +{amenities.length - 5} more
              </span>
            )}
          </div>
        )}

        {/* Cancellation and Breakfast */}
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium px-2 py-1 rounded-md ${getCancellationColor()}`}>
            {cancellation === "free" ? "Free Cancellation" : 
             cancellation === "non-refundable" ? "Non-refundable" : "Partial Refund"}
          </span>
          {breakfast && (
            <span className="text-xs font-medium px-2 py-1 rounded-md bg-black/5 dark:bg-white/5 text-black dark:text-white">
              Breakfast Included
            </span>
          )}
        </div>

        {/* Price */}
        {price && (
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{formatPrice(price)}</span>
              {originalPrice && price !== originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{priceUnit}</p>
            {nights && price && (
              <p className="text-sm font-medium mt-1">
                Total: {formatPrice((parseFloat(price) * nights).toString())}
              </p>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 gap-2">
        <a href={url} target="_blank" rel="noopener noreferrer" className="flex-1">
          <Button variant="default" size="sm" className="w-full gap-1">
            <CreditCard className="h-3 w-3" />
            View Deal
          </Button>
        </a>
      </CardFooter>
    </BaseCard>
  );
} 