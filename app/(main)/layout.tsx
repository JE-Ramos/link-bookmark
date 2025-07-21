import { BottomNavigation } from "@/components/bottom-navigation";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="min-h-screen bg-white dark:bg-black pb-24">
        {children}
      </div>
      <BottomNavigation />
    </>
  );
} 