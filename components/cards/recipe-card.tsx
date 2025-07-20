"use client";

import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Clock, Users, ChefHat, Flame, Heart, BookOpen, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BaseCard } from "./base-card";

interface RecipeCardProps {
  title: string;
  description?: string;
  url: string;
  image?: string;
  author?: string;
  prepTime?: string; // ISO 8601 duration or minutes
  cookTime?: string; // ISO 8601 duration or minutes
  totalTime?: string; // ISO 8601 duration or minutes
  servings?: number;
  difficulty?: "easy" | "medium" | "hard";
  cuisine?: string;
  category?: string; // breakfast, lunch, dinner, dessert, etc.
  calories?: number;
  rating?: number;
  reviewCount?: number;
  ingredients?: string[];
  tags?: string[];
  vegetarian?: boolean;
  vegan?: boolean;
  glutenFree?: boolean;
  onSave?: () => void;
  onCook?: () => void;
}

export function RecipeCard({
  title,
  description,
  url,
  image,
  author,
  prepTime,
  cookTime,
  totalTime,
  servings,
  difficulty,
  cuisine,
  category,
  calories,
  rating,
  reviewCount,
  ingredients,
  tags,
  vegetarian,
  vegan,
  glutenFree,
  onSave,
  onCook,
}: RecipeCardProps) {
  const formatTime = (time?: string) => {
    if (!time) return null;
    
    // If already in minutes format
    if (!time.includes('PT')) {
      return `${time} min`;
    }
    
    // Parse ISO 8601 duration
    const match = time.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (!match) return time;
    
    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} min`;
  };

  const getDifficultyColor = () => {
    switch (difficulty) {
      case "easy":
        return "text-green-600 bg-green-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "hard":
        return "text-red-600 bg-red-50";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`h-3 w-3 ${
              i < Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "fill-muted text-muted"
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <BaseCard source={url}>
      {/* Recipe Image - Fixed height */}
      <div className="relative h-48 overflow-hidden bg-muted">
        {image ? (
          <img
            src={image}
            alt={title}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Utensils className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        
        {/* Dietary Badges */}
        {(vegetarian || vegan || glutenFree) && (
          <div className="absolute top-3 left-3 flex gap-1">
            {vegan && (
              <span className="bg-green-600 text-white px-2 py-0.5 rounded-md text-xs font-bold">
                Vegan
              </span>
            )}
            {!vegan && vegetarian && (
              <span className="bg-green-500 text-white px-2 py-0.5 rounded-md text-xs font-bold">
                Vegetarian
              </span>
            )}
            {glutenFree && (
              <span className="bg-amber-600 text-white px-2 py-0.5 rounded-md text-xs font-bold">
                GF
              </span>
            )}
          </div>
        )}
        
        {/* Save Button */}
        {onSave && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 h-8 w-8 bg-white/90 hover:bg-white"
            onClick={onSave}
          >
            <Heart className="h-3 w-3" />
          </Button>
        )}
        
        {/* Time Badge */}
        {totalTime && (
          <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-0.5 rounded-md text-xs flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatTime(totalTime)}
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col">
        <CardHeader className="pb-2">
          <div className="space-y-1">
            {/* Category and Cuisine */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {category && (
                <span className="capitalize">{category}</span>
              )}
              {category && cuisine && <span>•</span>}
              {cuisine && (
                <span>{cuisine}</span>
              )}
            </div>
            
            <CardTitle className="line-clamp-2 text-lg">{title}</CardTitle>
            
            {author && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <ChefHat className="h-3 w-3" />
                {author}
              </p>
            )}
          </div>
        </CardHeader>

        {description && (
          <CardContent className="pt-0 pb-2">
            <CardDescription className="line-clamp-2 text-sm">{description}</CardDescription>
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

          {/* Recipe Info Grid */}
          <div className="grid grid-cols-3 gap-2 text-xs mb-2">
            {prepTime && (
              <div className="text-center">
                <p className="text-muted-foreground">Prep</p>
                <p className="font-medium">{formatTime(prepTime)}</p>
              </div>
            )}
            
            {cookTime && (
              <div className="text-center">
                <p className="text-muted-foreground">Cook</p>
                <p className="font-medium">{formatTime(cookTime)}</p>
              </div>
            )}
            
            {servings && (
              <div className="text-center">
                <p className="text-muted-foreground">Servings</p>
                <p className="font-medium">{servings}</p>
              </div>
            )}
          </div>

          {/* Difficulty and Calories */}
          <div className="flex items-center justify-between mb-2">
            {difficulty && (
              <span className={`px-2 py-0.5 rounded-md text-xs font-medium capitalize ${getDifficultyColor()}`}>
                {difficulty}
              </span>
            )}
            {calories && (
              <span className="text-xs text-muted-foreground">
                {calories} cal/serving
              </span>
            )}
          </div>

          {/* Ingredients Preview */}
          {ingredients && ingredients.length > 0 && (
            <div className="mb-2">
              <p className="text-xs font-medium mb-1">Key Ingredients:</p>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {ingredients.slice(0, 3).join(', ')}
                {ingredients.length > 3 && ` +${ingredients.length - 3} more`}
              </p>
            </div>
          )}

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-auto">
              {tags.slice(0, 2).map((tag, index) => (
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
          <Button variant="default" size="sm" className="flex-1 gap-1">
            <BookOpen className="h-3 w-3" />
            View Recipe
          </Button>
          {onCook && (
            <Button variant="outline" size="sm" className="gap-1" onClick={onCook}>
              <ChefHat className="h-3 w-3" />
              Cook
            </Button>
          )}
        </CardFooter>
      </div>
    </BaseCard>
  );
} 