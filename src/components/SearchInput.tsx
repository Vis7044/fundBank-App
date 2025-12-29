import { Search } from 'lucide-react';

interface SearchTriggerInputProps {
  value?: string;
  onOpen: () => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  onOpen,
  placeholder = 'Search mutual funds...',
  className = '',
}: SearchTriggerInputProps) {
  return (
    <div
      onClick={onOpen}
      className={`flex items-center gap-1 px-3 py-2 w-[200px] rounded-3xl border cursor-pointer
     bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition select-none
        ${className}`}
    >
      <Search className="w-5 h-5 opacity-70" />
      <span className="text-gray-500 dark:text-gray-400 text-sm">{placeholder}</span>
    </div>
  );
}
