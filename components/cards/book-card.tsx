"use client";

import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Book, Calendar, User, Star, BookOpen, Tag, FileText, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BaseCard } from "./base-card";

interface BookCardProps {
  title: string;
  description?: string;
  url: string;
  coverImage?: string;
  author: string;
  isbn?: string;
  publisher?: string;
  publishDate?: string;
  pageCount?: number;
  language?: string;
  genre?: string[];
  rating?: number;
  reviewCount?: number;
  price?: string;
  currency?: string;
  format?: "hardcover" | "paperback" | "ebook" | "audiobook";
  series?: string;
  seriesNumber?: number;
  awards?: string[];
  onBuy?: () => void;
  onPreview?: () => void;
}

export function BookCard({
  title,
  description,
  url,
  coverImage,
  author,
  isbn,
  publisher,
  publishDate,
  pageCount,
  language,
  genre,
  rating,
  reviewCount,
  price,
  currency = "USD",
  format = "hardcover",
  series,
  seriesNumber,
  awards,
  onBuy,
  onPreview,
}: BookCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (priceValue: string) => {
    const num = parseFloat(priceValue);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(num);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-3 w-3 ${
              i < Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "fill-muted text-muted"
            }`}
          />
        ))}
      </div>
    );
  };

  const getFormatIcon = () => {
    switch (format) {
      case "ebook":
        return <FileText className="h-3 w-3" />;
      case "audiobook":
        return <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
        </svg>;
      default:
        return <Book className="h-3 w-3" />;
    }
  };

  return (
    <BaseCard source={url}>
      <div className="flex h-full">
        {/* Book Cover - Fixed width */}
        <div className="w-32 flex-shrink-0">
          <div className="relative h-48 bg-muted">
            {coverImage ? (
              <img
                src={coverImage}
                alt={title}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Book className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
            
            {/* Awards Badge */}
            {awards && awards.length > 0 && (
              <div className="absolute top-2 left-2">
                <span className="bg-yellow-500 text-white px-1 py-0.5 rounded text-xs font-bold">
                  🏆
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Book Details */}
        <div className="flex-1 flex flex-col">
          <CardHeader className="pb-2">
            <div className="space-y-1">
              {series && (
                <p className="text-xs text-muted-foreground">
                  {series} {seriesNumber && `#${seriesNumber}`}
                </p>
              )}
              <CardTitle className="text-base line-clamp-2">{title}</CardTitle>
              <div className="flex items-center gap-1 text-xs">
                <User className="h-3 w-3 text-muted-foreground" />
                <span className="font-medium line-clamp-1">{author}</span>
              </div>
            </div>
          </CardHeader>

          {description && (
            <CardContent className="pt-0 pb-2">
              <CardDescription className="line-clamp-2 text-xs">{description}</CardDescription>
            </CardContent>
          )}

          <CardContent className="flex-1 pb-3">
            {/* Rating */}
            {rating && (
              <div className="flex items-center gap-2 mb-2">
                {renderStars(rating)}
                <span className="text-xs text-muted-foreground">
                  {rating.toFixed(1)} {reviewCount && `(${reviewCount})`}
                </span>
              </div>
            )}

            {/* Book Details Grid */}
            <div className="space-y-1 text-xs mb-2">
              {publisher && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Publisher</span>
                  <span className="font-medium truncate ml-2">{publisher}</span>
                </div>
              )}
              
              {publishDate && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Published</span>
                  <span className="font-medium">{new Date(publishDate).getFullYear()}</span>
                </div>
              )}
              
              {pageCount && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pages</span>
                  <span className="font-medium">{pageCount}</span>
                </div>
              )}
            </div>

            {/* Format and Price */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1 text-xs">
                {getFormatIcon()}
                <span className="capitalize">{format}</span>
              </div>
              {price && (
                <span className="text-sm font-bold text-primary">
                  {formatPrice(price)}
                </span>
              )}
            </div>

            {/* Genres */}
            {genre && genre.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {genre.slice(0, 2).map((g, index) => (
                  <span
                    key={index}
                    className="bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded text-xs"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}
          </CardContent>

          <CardFooter className="pt-0 pb-4 gap-2">
            {onPreview && (
              <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={onPreview}>
                <BookOpen className="h-3 w-3" />
                Preview
              </Button>
            )}
            <Button variant="default" size="sm" className={onPreview ? "flex-1" : "w-full"} onClick={onBuy}>
              <Tag className="h-3 w-3" />
              Buy
            </Button>
          </CardFooter>
        </div>
      </div>
    </BaseCard>
  );
} 