"use client";

import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Plane, Calendar, Clock, MapPin, Users, Luggage, CreditCard, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BaseCard } from "./base-card";

interface FlightCardProps {
  title?: string; // e.g., "New York to London"
  url: string;
  airline: string;
  flightNumber?: string;
  departureAirport: string;
  departureCode: string;
  arrivalAirport: string;
  arrivalCode: string;
  departureTime: string;
  arrivalTime: string;
  duration?: string;
  price?: string;
  currency?: string;
  class?: "economy" | "premium economy" | "business" | "first";
  stops?: number;
  aircraft?: string;
  baggage?: {
    carry?: string;
    checked?: string;
  };
  onBook?: () => void;
  onSave?: () => void;
}

export function FlightCard({
  title,
  url,
  airline,
  flightNumber,
  departureAirport,
  departureCode,
  arrivalAirport,
  arrivalCode,
  departureTime,
  arrivalTime,
  duration,
  price,
  currency = "USD",
  class: flightClass = "economy",
  stops = 0,
  aircraft,
  baggage,
  onBook,
  onSave,
}: FlightCardProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (priceValue: string) => {
    const num = parseFloat(priceValue);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const getClassColor = () => {
    switch (flightClass) {
      case "first":
        return "text-amber-600 bg-amber-50";
      case "business":
        return "text-black dark:text-white bg-black/5 dark:bg-white/5";
      case "premium economy":
        return "text-purple-600 bg-purple-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const displayTitle = title || `${departureCode} → ${arrivalCode}`;

  return (
    <BaseCard source={url} contentType="flight">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{airline}</span>
            {flightNumber && (
              <span className="text-xs text-muted-foreground">• {flightNumber}</span>
            )}
          </div>
          <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${getClassColor()}`}>
            {flightClass}
          </span>
        </div>
        
        <CardTitle className="text-xl">{displayTitle}</CardTitle>
      </CardHeader>

      <CardContent className="pt-0 pb-3">
        {/* Flight Route */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{formatTime(departureTime)}</p>
            <p className="text-sm font-medium">{departureCode}</p>
            <p className="text-xs text-muted-foreground">{departureAirport}</p>
            <p className="text-xs text-muted-foreground mt-1">{formatDate(departureTime)}</p>
          </div>
          
          <div className="flex-1 px-4">
            <div className="relative">
              <div className="border-t-2 border-dashed border-muted-foreground/30"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2">
                <Plane className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="text-center mt-2">
              {duration && (
                <p className="text-xs text-muted-foreground">{duration}</p>
              )}
              <p className="text-xs font-medium">
                {stops === 0 ? "Direct" : `${stops} stop${stops > 1 ? 's' : ''}`}
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-2xl font-bold">{formatTime(arrivalTime)}</p>
            <p className="text-sm font-medium">{arrivalCode}</p>
            <p className="text-xs text-muted-foreground">{arrivalAirport}</p>
            <p className="text-xs text-muted-foreground mt-1">{formatDate(arrivalTime)}</p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="space-y-2 text-xs">
          {aircraft && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Plane className="h-3 w-3" />
              <span>Aircraft: {aircraft}</span>
            </div>
          )}
          
          {baggage && (
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Luggage className="h-3 w-3" />
                <span>Carry-on: {baggage.carry || "Not included"}</span>
              </div>
              {baggage.checked && (
                <span>Checked: {baggage.checked}</span>
              )}
            </div>
          )}
        </div>

        {/* Price */}
        {price && (
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">{formatPrice(price)}</span>
            </div>
            <span className="text-xs text-muted-foreground">per person</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 gap-2">
        <a href={url} target="_blank" rel="noopener noreferrer" className="flex-1">
          <Button variant="default" size="sm" className="w-full gap-1">
            <TrendingUp className="h-3 w-3" />
            View Deal
          </Button>
        </a>
        {onSave && (
          <Button variant="ghost" size="icon" onClick={onSave} className="h-8 w-8">
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
      </CardFooter>
    </BaseCard>
  );
} 