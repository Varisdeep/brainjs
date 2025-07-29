"use client";
import { useState } from 'react';

interface StockDataPoint {
  date: string;
  price: number;
  volume: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
}

interface DataLoaderProps {
  onDataLoaded: (data: StockDataPoint[]) => void;
  symbol: string;
}

export default function DataLoader({ onDataLoaded, symbol }: DataLoaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [dataSource, setDataSource] = useState<'file' | 'api' | 'sample'>('sample');

  // Sample data for demonstration
  const sampleData: StockDataPoint[] = [
    { date: '2024-01-01', price: 150.25, volume: 2500000, open: 149.50, high: 152.00, low: 148.75, close: 150.25 },
    { date: '2024-01-02', price: 152.80, volume: 2800000, open: 150.25, high: 154.20, low: 149.80, close: 152.80 },
    { date: '2024-01-03', price: 151.40, volume: 2200000, open: 152.80, high: 153.50, low: 150.20, close: 151.40 },
    { date: '2024-01-04', price: 153.90, volume: 3100000, open: 151.40, high: 155.00, low: 150.90, close: 153.90 },
    { date: '2024-01-05', price: 155.20, volume: 2900000, open: 153.90, high: 156.50, low: 153.20, close: 155.20 },
    { date: '2024-01-08', price: 157.80, volume: 3200000, open: 155.20, high: 158.90, low: 154.80, close: 157.80 },
    { date: '2024-01-09', price: 156.40, volume: 2400000, open: 157.80, high: 158.20, low: 155.10, close: 156.40 },
    { date: '2024-01-10', price: 158.90, volume: 3500000, open: 156.40, high: 160.00, low: 156.00, close: 158.90 },
    { date: '2024-01-11', price: 160.50, volume: 3800000, open: 158.90, high: 161.80, low: 158.20, close: 160.50 },
    { date: '2024-01-12', price: 162.30, volume: 4200000, open: 160.50, high: 163.50, low: 160.00, close: 162.30 },
    { date: '2024-01-15', price: 164.80, volume: 4500000, open: 162.30, high: 165.90, low: 161.80, close: 164.80 },
    { date: '2024-01-16', price: 163.20, volume: 2800000, open: 164.80, high: 165.20, low: 162.10, close: 163.20 },
    { date: '2024-01-17', price: 165.90, volume: 3900000, open: 163.20, high: 167.00, low: 162.80, close: 165.90 },
    { date: '2024-01-18', price: 167.50, volume: 4100000, open: 165.90, high: 168.80, low: 165.20, close: 167.50 },
    { date: '2024-01-19', price: 169.20, volume: 4400000, open: 167.50, high: 170.50, low: 166.80, close: 169.20 },
    { date: '2024-01-22', price: 171.80, volume: 4800000, open: 169.20, high: 172.90, low: 168.50, close: 171.80 },
    { date: '2024-01-23', price: 173.40, volume: 5200000, open: 171.80, high: 174.80, low: 171.20, close: 173.40 },
    { date: '2024-01-24', price: 175.90, volume: 5500000, open: 173.40, high: 176.90, low: 172.80, close: 175.90 },
    { date: '2024-01-25', price: 177.60, volume: 5800000, open: 175.90, high: 178.80, low: 175.20, close: 177.60 },
    { date: '2024-01-26', price: 179.20, volume: 6100000, open: 177.60, high: 180.50, low: 176.80, close: 179.20 },
    { date: '2024-01-29', price: 181.80, volume: 6400000, open: 179.20, high: 182.90, low: 178.50, close: 181.80 },
    { date: '2024-01-30', price: 183.40, volume: 6700000, open: 181.80, high: 184.80, low: 181.20, close: 183.40 },
    { date: '2024-01-31', price: 185.90, volume: 7000000, open: 183.40, high: 186.90, low: 182.80, close: 185.90 },
    { date: '2024-02-01', price: 187.60, volume: 7300000, open: 185.90, high: 188.80, low: 185.20, close: 187.60 },
    { date: '2024-02-02', price: 189.20, volume: 7600000, open: 187.60, high: 190.50, low: 186.80, close: 189.20 },
    { date: '2024-02-05', price: 191.80, volume: 7900000, open: 189.20, high: 192.90, low: 188.50, close: 191.80 },
    { date: '2024-02-06', price: 193.40, volume: 8200000, open: 191.80, high: 194.80, low: 191.20, close: 193.40 },
    { date: '2024-02-07', price: 195.90, volume: 8500000, open: 193.40, high: 196.90, low: 192.80, close: 195.90 },
    { date: '2024-02-08', price: 197.60, volume: 8800000, open: 195.90, high: 198.80, low: 195.20, close: 197.60 },
    { date: '2024-02-09', price: 199.20, volume: 9100000, open: 197.60, high: 200.50, low: 196.80, close: 199.20 },
    { date: '2024-02-12', price: 201.80, volume: 9400000, open: 199.20, high: 202.90, low: 198.50, close: 201.80 },
    { date: '2024-02-13', price: 203.40, volume: 9700000, open: 201.80, high: 204.80, low: 201.20, close: 203.40 },
    { date: '2024-02-14', price: 205.90, volume: 10000000, open: 203.40, high: 206.90, low: 202.80, close: 205.90 },
    { date: '2024-02-15', price: 207.60, volume: 10300000, open: 205.90, high: 208.80, low: 205.20, close: 207.60 },
    { date: '2024-02-16', price: 209.20, volume: 10600000, open: 207.60, high: 210.50, low: 206.80, close: 209.20 },
    { date: '2024-02-19', price: 211.80, volume: 10900000, open: 209.20, high: 212.90, low: 208.50, close: 211.80 },
    { date: '2024-02-20', price: 213.40, volume: 11200000, open: 211.80, high: 214.80, low: 211.20, close: 213.40 },
    { date: '2024-02-21', price: 215.90, volume: 11500000, open: 213.40, high: 216.90, low: 212.80, close: 215.90 },
    { date: '2024-02-22', price: 217.60, volume: 11800000, open: 215.90, high: 218.80, low: 215.20, close: 217.60 },
    { date: '2024-02-23', price: 219.20, volume: 12100000, open: 217.60, high: 220.50, low: 216.80, close: 219.20 },
    { date: '2024-02-26', price: 221.80, volume: 12400000, open: 219.20, high: 222.90, low: 218.50, close: 221.80 },
    { date: '2024-02-27', price: 223.40, volume: 12700000, open: 221.80, high: 224.80, low: 221.20, close: 223.40 },
    { date: '2024-02-28', price: 225.90, volume: 13000000, open: 223.40, high: 226.90, low: 222.80, close: 225.90 },
    { date: '2024-02-29', price: 227.60, volume: 13300000, open: 225.90, high: 228.80, low: 225.20, close: 227.60 },
    { date: '2024-03-01', price: 229.20, volume: 13600000, open: 227.60, high: 230.50, low: 226.80, close: 229.20 },
    { date: '2024-03-04', price: 231.80, volume: 13900000, open: 229.20, high: 232.90, low: 228.50, close: 231.80 },
    { date: '2024-03-05', price: 233.40, volume: 14200000, open: 231.80, high: 234.80, low: 231.20, close: 233.40 },
    { date: '2024-03-06', price: 235.90, volume: 14500000, open: 233.40, high: 236.90, low: 232.80, close: 235.90 },
    { date: '2024-03-07', price: 237.60, volume: 14800000, open: 235.90, high: 238.80, low: 235.20, close: 237.60 },
    { date: '2024-03-08', price: 239.20, volume: 15100000, open: 237.60, high: 240.50, low: 236.80, close: 239.20 },
    { date: '2024-03-11', price: 241.80, volume: 15400000, open: 239.20, high: 242.90, low: 238.50, close: 241.80 },
    { date: '2024-03-12', price: 243.40, volume: 15700000, open: 241.80, high: 244.80, low: 241.20, close: 243.40 },
    { date: '2024-03-13', price: 245.90, volume: 16000000, open: 243.40, high: 246.90, low: 242.80, close: 245.90 },
    { date: '2024-03-14', price: 247.60, volume: 16300000, open: 245.90, high: 248.80, low: 245.20, close: 247.60 },
    { date: '2024-03-15', price: 249.20, volume: 16600000, open: 247.60, high: 250.50, low: 246.80, close: 249.20 },
    { date: '2024-03-18', price: 251.80, volume: 16900000, open: 249.20, high: 252.90, low: 248.50, close: 251.80 },
    { date: '2024-03-19', price: 253.40, volume: 17200000, open: 251.80, high: 254.80, low: 251.20, close: 253.40 },
    { date: '2024-03-20', price: 255.90, volume: 17500000, open: 253.40, high: 256.90, low: 252.80, close: 255.90 },
    { date: '2024-03-21', price: 257.60, volume: 17800000, open: 255.90, high: 258.80, low: 255.20, close: 257.60 },
    { date: '2024-03-22', price: 259.20, volume: 18100000, open: 257.60, high: 260.50, low: 256.80, close: 259.20 },
    { date: '2024-03-25', price: 261.80, volume: 18400000, open: 259.20, high: 262.90, low: 258.50, close: 261.80 },
    { date: '2024-03-26', price: 263.40, volume: 18700000, open: 261.80, high: 264.80, low: 261.20, close: 263.40 },
    { date: '2024-03-27', price: 265.90, volume: 19000000, open: 263.40, high: 266.90, low: 262.80, close: 265.90 },
    { date: '2024-03-28', price: 267.60, volume: 19300000, open: 265.90, high: 268.80, low: 265.20, close: 267.60 },
    { date: '2024-03-29', price: 269.20, volume: 19600000, open: 267.60, high: 270.50, low: 266.80, close: 269.20 },
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError('');

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        let data: StockDataPoint[] = [];

        if (file.name.endsWith('.csv')) {
          // Parse CSV
          const lines = content.split('\n');
          const headers = lines[0].split(',').map(h => h.trim());
          
          for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim()) {
              const values = lines[i].split(',').map(v => v.trim());
              const row: Record<string, string> = {};
              headers.forEach((header, index) => {
                row[header] = values[index];
              });
              
              data.push({
                date: row.date || row.Date || row.DATE,
                price: parseFloat(row.price || row.Price || row.PRICE || row.close || row.Close || row.CLOSE),
                volume: parseInt(row.volume || row.Volume || row.VOLUME),
                open: parseFloat(row.open || row.Open || row.OPEN),
                high: parseFloat(row.high || row.High || row.HIGH),
                low: parseFloat(row.low || row.Low || row.LOW),
                close: parseFloat(row.close || row.Close || row.CLOSE)
              });
            }
          }
        } else if (file.name.endsWith('.json')) {
          // Parse JSON
          const jsonData = JSON.parse(content);
          if (Array.isArray(jsonData)) {
            data = jsonData.map(item => ({
              date: item.date || item.Date || item.DATE,
              price: parseFloat(item.price || item.Price || item.PRICE || item.close || item.Close || item.CLOSE),
              volume: parseInt(item.volume || item.Volume || item.VOLUME),
              open: parseFloat(item.open || item.Open || item.OPEN),
              high: parseFloat(item.high || item.High || item.HIGH),
              low: parseFloat(item.low || item.Low || item.LOW),
              close: parseFloat(item.close || item.Close || item.CLOSE)
            }));
          }
        }

        if (data.length >= 50) {
          onDataLoaded(data);
        } else {
          setError('File must contain at least 50 data points');
        }
          } catch {
      setError('Error parsing file. Please check the format.');
    } finally {
      setIsLoading(false);
    }
    };

    reader.readAsText(file);
  };

  const handleSampleData = () => {
    setIsLoading(true);
    setError('');
    
    // Simulate loading delay
    setTimeout(() => {
      onDataLoaded(sampleData);
      setIsLoading(false);
    }, 1000);
  };

  const handleApiData = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate API call with sample data
      await new Promise(resolve => setTimeout(resolve, 1500));
      onDataLoaded(sampleData);
    } catch {
      setError('Failed to load data from API');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">Load Historical Data</h4>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data Source
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setDataSource('sample')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                dataSource === 'sample' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Sample Data
            </button>
            <button
              onClick={() => setDataSource('file')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                dataSource === 'file' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Upload File
            </button>
            <button
              onClick={() => setDataSource('api')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                dataSource === 'api' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              API Data
            </button>
          </div>
        </div>

        {dataSource === 'sample' && (
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-800 mb-3">
              Load sample historical data for {symbol} (90 days of realistic data)
            </p>
            <button
              onClick={handleSampleData}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'Load Sample Data'}
            </button>
          </div>
        )}

        {dataSource === 'file' && (
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-green-800 mb-3">
              Upload CSV or JSON file with at least 50 data points
            </p>
            <div className="space-y-2">
              <p className="text-xs text-gray-600">
                <strong>CSV Format:</strong> date,price,volume,open,high,low,close
              </p>
              <p className="text-xs text-gray-600">
                <strong>JSON Format:</strong> Array of objects with date, price, volume fields
              </p>
            </div>
            <input
              type="file"
              accept=".csv,.json"
              onChange={handleFileUpload}
              disabled={isLoading}
              className="mt-3 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        )}

        {dataSource === 'api' && (
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm text-purple-800 mb-3">
              Load data from external API (simulated)
            </p>
            <button
              onClick={handleApiData}
              disabled={isLoading}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50"
            >
              {isLoading ? 'Loading from API...' : 'Load API Data'}
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 