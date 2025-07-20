"use client";

import {
  ArticleCard,
  ProductCard,
  VideoCard,
  EventCard,
  RecipeCard,
  ProfileCard,
  BookCard,
  MusicCard,
  FlightCard,
  HotelCard,
} from "@/components/cards";

export default function CardsDemo() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Link Card Variations</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Beautiful card components for various link types with source website highlighting
          </p>
        </div>

        {/* Cards Grid - Masonry style */}
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {/* Flight Card - Direct Flight */}
          <div className="break-inside-avoid">
            <FlightCard
              airline="United Airlines"
              flightNumber="UA 857"
              departureAirport="San Francisco International"
              departureCode="SFO"
              arrivalAirport="London Heathrow"
              arrivalCode="LHR"
              departureTime="2024-03-15T22:30:00"
              arrivalTime="2024-03-16T16:45:00"
              duration="10h 15m"
              price="899"
              url="https://united.com/flights/sfo-lhr"
              class="economy"
              stops={0}
              aircraft="Boeing 787-9"
              baggage={{
                carry: "1 bag",
                checked: "1 bag (23kg)"
              }}
              onSave={() => console.log("Saved flight")}
            />
          </div>

          {/* Hotel Card - Luxury */}
          <div className="break-inside-avoid">
            <HotelCard
              name="The Ritz-Carlton, Tokyo"
              url="https://booking.com/hotel/ritz-carlton-tokyo"
              image="https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=500&fit=crop"
              location={{
                city: "Tokyo",
                country: "Japan",
                distance: "0.5 km from Tokyo Tower"
              }}
              rating={4.8}
              reviewCount={1250}
              price="450"
              originalPrice="580"
              checkIn="2024-04-01"
              checkOut="2024-04-05"
              guests={2}
              roomType="Deluxe King Room"
              amenities={["Free WiFi", "Spa", "Gym", "Pool", "Restaurant", "Bar"]}
              highlights={[
                "Stunning city views from 45th floor",
                "Michelin-starred restaurant",
                "24-hour concierge service"
              ]}
              cancellation="free"
              breakfast={true}
              onSave={() => console.log("Saved hotel")}
            />
          </div>

          {/* Article Card */}
          <div className="break-inside-avoid">
            <ArticleCard
              title="The Future of Web Development: Trends to Watch in 2024"
              description="Explore the latest trends shaping the web development landscape, from AI-powered tools to new frameworks and methodologies."
              url="https://techblog.com/article/future-web-dev-2024"
              image="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop"
              author="Jane Developer"
              publishedTime="2024-01-15T10:00:00Z"
              readingTime="5 min read"
              siteName="Tech Blog"
              section="Web Development"
              tags={["JavaScript", "React", "AI"]}
              viewCount={15420}
              commentCount={89}
              onBookmark={() => console.log("Bookmarked")}
              onShare={() => console.log("Shared")}
            />
          </div>

          {/* Flight Card - Connecting */}
          <div className="break-inside-avoid">
            <FlightCard
              airline="Emirates"
              flightNumber="EK 432"
              departureAirport="Dubai International"
              departureCode="DXB"
              arrivalAirport="Singapore Changi"
              arrivalCode="SIN"
              departureTime="2024-03-20T02:50:00"
              arrivalTime="2024-03-20T14:10:00"
              duration="7h 20m"
              price="1250"
              url="https://emirates.com/flights/dxb-sin"
              class="business"
              stops={0}
              aircraft="Airbus A380"
              baggage={{
                carry: "2 bags",
                checked: "2 bags (32kg each)"
              }}
              onSave={() => console.log("Saved flight")}
            />
          </div>

          {/* Product Card */}
          <div className="break-inside-avoid">
            <ProductCard
              title="Premium Wireless Headphones"
              description="Experience crystal-clear audio with our latest wireless headphones featuring industry-leading noise cancellation."
              url="https://amazon.com/dp/B08J4XYZ12"
              image="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop"
              price="199.99"
              originalPrice="299.99"
              currency="USD"
              availability="in stock"
              brand="AudioTech Pro"
              rating={4.5}
              reviewCount={1234}
              features={[
                "40-hour battery life",
                "Active noise cancellation",
                "Premium comfort"
              ]}
              freeShipping={true}
              warranty="2-year warranty"
              onAddToCart={() => console.log("Added to cart")}
              onAddToWishlist={() => console.log("Added to wishlist")}
            />
          </div>

          {/* Hotel Card - Budget */}
          <div className="break-inside-avoid">
            <HotelCard
              name="Holiday Inn Express Manhattan"
              url="https://hotels.com/holiday-inn-manhattan"
              image="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=500&fit=crop"
              location={{
                city: "New York",
                country: "USA",
                distance: "Times Square area"
              }}
              rating={4.2}
              reviewCount={890}
              price="120"
              checkIn="2024-05-10"
              checkOut="2024-05-12"
              guests={2}
              roomType="Standard Double"
              amenities={["Free WiFi", "Breakfast", "24-hour front desk"]}
              cancellation="partial"
              breakfast={true}
              onSave={() => console.log("Saved hotel")}
            />
          </div>

          {/* Video Card */}
          <div className="break-inside-avoid">
            <VideoCard
              title="Building a Modern React Application from Scratch"
              description="Learn how to build a complete React application with TypeScript, Tailwind CSS, and modern best practices."
              url="https://youtube.com/watch?v=dQw4w9WgXcQ"
              thumbnailUrl="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=450&fit=crop"
              duration="PT45M30S"
              uploadDate="2024-01-10T14:00:00Z"
              views={45320}
              likes={2100}
              channelName="Code Masters"
              channelAvatar="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop"
              keywords={["React", "TypeScript", "Web Development"]}
              onWatch={() => console.log("Watching")}
              onSave={() => console.log("Saved")}
            />
          </div>

          {/* Short Article Card */}
          <div className="break-inside-avoid">
            <ArticleCard
              title="Quick CSS Tips for Better Performance"
              url="https://css-tricks.com/performance-tips"
              author="Chris Coyier"
              publishedTime="2024-01-20T08:00:00Z"
              readingTime="3 min read"
              tags={["CSS", "Performance"]}
              viewCount={8200}
            />
          </div>

          {/* Flight Card - Budget */}
          <div className="break-inside-avoid">
            <FlightCard
              airline="Southwest Airlines"
              departureAirport="Los Angeles"
              departureCode="LAX"
              arrivalAirport="Las Vegas"
              arrivalCode="LAS"
              departureTime="2024-02-28T14:20:00"
              arrivalTime="2024-02-28T15:35:00"
              duration="1h 15m"
              price="89"
              url="https://southwest.com/flights/lax-las"
              class="economy"
              stops={0}
              baggage={{
                carry: "2 bags free",
                checked: "2 bags free"
              }}
              onSave={() => console.log("Saved flight")}
            />
          </div>

          {/* Product Card without image */}
          <div className="break-inside-avoid">
            <ProductCard
              title="USB-C Charging Cable (2-Pack)"
              url="https://amazon.com/dp/B07XYZ123"
              price="12.99"
              brand="TechBasics"
              rating={4.2}
              reviewCount={892}
              availability="in stock"
              freeShipping={true}
            />
          </div>

          {/* Event Card */}
          <div className="break-inside-avoid">
            <EventCard
              title="React Conference 2024"
              description="Join us for the premier React conference featuring talks from core team members and community leaders."
              url="https://reactconf.com/2024"
              image="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop"
              startDate="2024-06-15T09:00:00Z"
              endDate="2024-06-17T18:00:00Z"
              location={{
                name: "Moscone Center",
                city: "San Francisco",
                country: "USA"
              }}
              organizer="React Foundation"
              price="299"
              availability="available"
              attendeeCount={850}
              maxAttendees={1000}
              eventType="offline"
              tags={["React", "Conference"]}
              onRegister={() => console.log("Registering")}
            />
          </div>

          {/* Recipe Card */}
          <div className="break-inside-avoid">
            <RecipeCard
              title="Classic Italian Carbonara"
              description="A traditional Roman pasta dish with eggs, cheese, and guanciale."
              url="https://allrecipes.com/recipe/carbonara"
              image="https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&h=600&fit=crop"
              author="Chef Giovanni"
              prepTime="PT10M"
              cookTime="PT15M"
              totalTime="PT25M"
              servings={4}
              difficulty="easy"
              cuisine="Italian"
              calories={420}
              rating={4.8}
              reviewCount={567}
              tags={["pasta", "italian"]}
              onSave={() => console.log("Saved recipe")}
            />
          </div>

          {/* Video Card - Short form */}
          <div className="break-inside-avoid">
            <VideoCard
              title="60 Second CSS Animation Tutorial"
              url="https://youtube.com/watch?v=abc123"
              thumbnailUrl="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop"
              duration="1:02"
              uploadDate="2024-01-22T12:00:00Z"
              views={125000}
              channelName="Quick Tutorials"
              isLive={false}
            />
          </div>

          {/* Profile Card */}
          <div className="break-inside-avoid">
            <ProfileCard
              name="Sarah Johnson"
              username="sarahj_dev"
              bio="Full-stack developer passionate about building scalable web applications."
              url="https://github.com/sarahjohnson"
              avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop"
              role="Senior Software Engineer"
              company="TechCorp"
              location="San Francisco, CA"
              followersCount={12500}
              followingCount={890}
              skills={["React", "TypeScript", "Node.js"]}
              verified={true}
              onFollow={() => console.log("Following")}
            />
          </div>

          {/* Book Card */}
          <div className="break-inside-avoid">
            <BookCard
              title="Clean Code: A Handbook of Agile Software Craftsmanship"
              author="Robert C. Martin"
              url="https://amazon.com/dp/0132350882"
              coverImage="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=450&fit=crop"
              publisher="Prentice Hall"
              pageCount={464}
              rating={4.4}
              reviewCount={3892}
              price="44.99"
              format="hardcover"
              genre={["Programming", "Software Engineering"]}
              onBuy={() => console.log("Buying")}
            />
          </div>

          {/* Music Card */}
          <div className="break-inside-avoid">
            <MusicCard
              title="Midnight Dreams"
              artist="Luna Echo"
              album="Celestial Waves"
              url="https://open.spotify.com/track/6rqhFgbbKwnb9MLmUQDhG6"
              coverImage="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop"
              duration="234"
              releaseDate="2023-11-15"
              genre={["Electronic", "Ambient"]}
              plays={1543200}
              likes={45600}
              spotifyUrl="https://spotify.com/track/example"
              onPlay={() => console.log("Playing")}
              onLike={() => console.log("Liked")}
            />
          </div>

          {/* Live Video */}
          <div className="break-inside-avoid">
            <VideoCard
              title="Live Coding Session: Building a REST API"
              url="https://youtube.com/watch?v=live123"
              thumbnailUrl="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop"
              views={3420}
              channelName="DevStreams"
              isLive={true}
              onWatch={() => console.log("Watching live")}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 