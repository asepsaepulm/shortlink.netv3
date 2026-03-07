'use client';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';

export default function ResultTable({ results }) {
  const t = useTranslations('table');

  const copyAll = () => {
    const text = results.map((r) => r.short).join('\n');
    navigator.clipboard.writeText(text);
    toast.success('Semua URL disalin!');
  };

  const exportCSV = () => {
    const csv = ['Original URL,Short URL', ...results.map((r) => `${r.original},${r.short}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'links.csv';
    a.click();
  };

  return (
    <div className="mt-6 bg-gray-800 rounded-xl overflow-hidden">
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-700">
        <span className="text-sm text-gray-400">{results.length} link dipersingkat</span>
        <div className="flex gap-2">
          <button onClick={copyAll} className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded text-white">
            📋 {t('copy_all')}
          </button>
          <button onClick={exportCSV} className="text-xs bg-green-700 hover:bg-green-600 px-3 py-1.5 rounded text-white">
            📥 {t('export')}
          </button>
        </div>
      </div>
      <div className="divide-y divide-gray-700 max-h-80 overflow-y-auto">
        {results.map((r, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3 text-sm">
            <span className="text-gray-400 truncate max-w-[200px]">{r.original}</span>
            <div className="flex items-center gap-2">
              <a href={r.short} target="_blank" className="text-blue-400 hover:underline">
                {r.short}
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(r.short);
                  toast.success('Disalin!');
                }}
                className="text-gray-500 hover:text-white text-xs bg-gray-700 px-2 py-1 rounded"
              >
                Copy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
