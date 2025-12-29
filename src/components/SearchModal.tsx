import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import fundService from '../services/fundService';
import type { MutualFundScheme } from '../services/fundService';
import { Link, useNavigate } from "react-router-dom";


interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');
  const [results, setResults] = useState<MutualFundScheme[]>([]);
  const [loading, setLoading] = useState(false);

  const router = useNavigate();;

  // Debounce input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(query);
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch with abort support
  useEffect(() => {
    if (!debouncedValue) {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    setLoading(true);

    fundService
      .searchFunds(debouncedValue, controller.signal)
      .then((res) => {
        if (res.ok) {
          setResults(res.data);
        }else {
          console.error(res.error)
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') console.error(err);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [debouncedValue]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-start justify-center z-50"
      onClick={onClose}
    >
      <div
        className="
          border bg-white dark:bg-gray-800 mt-40 border-gray-300 
          dark:border-gray-700 text-gray-700 dark:text-gray-200 
          transition select-none w-[90%] max-w-xl p-5 rounded-2xl shadow-xl
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Search Funds</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input */}
        <div
          className="
            flex items-center gap-2 px-3 py-2 rounded-xl border
            bg-gray-100 dark:bg-[#1b1e25]
            border-gray-300 dark:border-gray-600
          "
        >
          <Search className="w-5 h-5 opacity-70" />
          <input
            autoFocus
            type="text"
            placeholder="Type fund name..."
            className="w-full bg-transparent outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Results */}
        <div className="mt-4 max-h-64 overflow-y-auto">
          {loading && (
            <div className="text-sm text-gray-500 dark:text-gray-400 p-3">
              Searching...
            </div>
          )}

          {!loading && results.length === 0 && (
            <div className="text-center text-lg text-gray-500 dark:text-gray-400 p-3">
              No Funds
            </div>
          )}

          {!loading &&
            results.map((fund) => (
              <div
                key={fund.scheme_name}
                onClick={() => {
                  router(`/mutual-funds/${fund.scheme_code}`);
                }}
                className="px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-[#1b1e25]"
              >
                {fund.scheme_name}
              </div>
            ))}
        </div>
        {!loading && debouncedValue && results.length > 0 && (
          <Link to={`/mf?q=${debouncedValue}`} className='mt-2 underline hover:text-gray-500'>View More</Link>
        )}
      </div>
    </div>
  );
}
