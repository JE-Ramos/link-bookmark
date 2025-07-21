import { AddLinkDialog } from "./add-link-dialog";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  showAddButton?: boolean;
}

export function AppHeader({ title, subtitle, showAddButton = true }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-screen-xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-black to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
          
          {showAddButton && (
            <div className="transform transition-transform hover:scale-105 active:scale-95">
              <AddLinkDialog />
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 