"use client";
import { useState } from 'react';
import * as brain from 'brain.js';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import DataLoader from './DataLoader';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
);

interface StockDataPoint {
  date: string;
  price: number;
  volume: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
}

interface PredictionResult {
  symbol: string;
  currentPrice: number;
  predictedPrice: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
  recommendation: string;
  technicalIndicators: {
    ma5Ratio: number;
    ma10Ratio: number;
    volumeRatio: number;
    volatility: number;
    momentum: number;
  };
  historicalData: StockDataPoint[];
  predictionDate: string;
  pastMonths: {
    month: string;
    avgPrice: number;
    change: number;
    volume: number;
  }[];
  upcomingPredictions: {
    date: string;
    price: number;
    confidence: number;
  }[];
}

export default function StockPredictor() {
  const [symbol, setSymbol] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [error, setError] = useState('');
  const [historicalData, setHistoricalData] = useState<StockDataPoint[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Sample stock data for demonstration
  const sampleStocks = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corporation' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
    { symbol: 'TSLA', name: 'Tesla Inc.' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation' },
    { symbol: 'META', name: 'Meta Platforms Inc.' },
    { symbol: 'NFLX', name: 'Netflix Inc.' }
  ];

  // Generate more realistic synthetic historical data for training (removed unused function)

  // Train the neural network with enhanced features
  const trainModel = (historicalData: Array<{
    price: number;
    volume: number;
    marketCap: number;
    pe: number;
    dividend: number;
    dayOfWeek: number;
    month: number;
    trend: number;
    volatility: number;
  }>) => {
    const net = new brain.NeuralNetwork();

    // Prepare training data with more features
    const trainingData = [];
    for (let i = 10; i < historicalData.length - 1; i++) {
      // Calculate technical indicators
      const price = historicalData[i].price;
      const prevPrice = historicalData[i - 1].price;
      const priceChange = (price - prevPrice) / prevPrice;
      const volume = historicalData[i].volume;
      const avgVolume = historicalData.slice(i - 5, i).reduce((sum, d) => sum + d.volume, 0) / 5;
      const volumeRatio = volume / avgVolume;
      
      // Moving averages
      const ma5 = historicalData.slice(i - 5, i).reduce((sum, d) => sum + d.price, 0) / 5;
      const ma10 = historicalData.slice(i - 10, i).reduce((sum, d) => sum + d.price, 0) / 10;
      const ma5Ratio = price / ma5;
      const ma10Ratio = price / ma10;
      
      const input = [
        price / 1000, // Normalized current price
        priceChange, // Price change percentage
        volumeRatio, // Volume ratio
        historicalData[i].pe / 100, // Normalized P/E
        historicalData[i].dividend / 10, // Normalized dividend
        historicalData[i].trend, // Cumulative trend
        historicalData[i].volatility, // Volatility
        ma5Ratio, // 5-day moving average ratio
        ma10Ratio, // 10-day moving average ratio
        (historicalData[i].dayOfWeek) / 7, // Day of week
        (historicalData[i].month) / 12, // Month
        Math.sin(historicalData[i].dayOfWeek * Math.PI / 3.5) // Cyclical encoding for day
      ];

      const output = [
        historicalData[i + 1].price / 1000 // Next day's normalized price
      ];

      trainingData.push({ input, output });
    }

    // Train the network with more iterations for better accuracy
    net.train(trainingData, {
      iterations: 5000,
      errorThresh: 0.003,
      learningRate: 0.1,
      log: false
    });

    return net;
  };

  // Handle data loading
  const handleDataLoaded = (data: StockDataPoint[]) => {
    setHistoricalData(data);
    setDataLoaded(true);
    setError('');
  };

  // Make prediction
  const predictStock = async () => {
    if (!symbol.trim()) {
      setError('Please enter a stock symbol');
      return;
    }

    if (!dataLoaded) {
      setError('Please load historical data first');
      return;
    }

    setIsLoading(true);
    setError('');
    setPrediction(null);

    try {
      // Use loaded historical data
      const dataForTraining = historicalData.map((item, index) => ({
        price: item.price,
        volume: item.volume,
        marketCap: item.price * (Math.random() * 1000000 + 500000),
        pe: Math.random() * 50 + 10,
        dividend: Math.random() * 5,
        dayOfWeek: new Date(item.date).getDay(),
        month: new Date(item.date).getMonth(),
        trend: index > 0 ? (item.price - historicalData[index - 1].price) / historicalData[index - 1].price : 0,
        volatility: index > 0 ? Math.abs((item.price - historicalData[index - 1].price) / historicalData[index - 1].price) : 0
      }));
      
      // Train the model
      const model = trainModel(dataForTraining);
      
      // Get current data (last entry)
      const currentData = dataForTraining[dataForTraining.length - 1];
      const prevData = dataForTraining[dataForTraining.length - 2];
      
      // Calculate technical indicators for prediction
      const price = currentData.price;
      const prevPrice = prevData.price;
      const priceChange = (price - prevPrice) / prevPrice;
      const volume = currentData.volume;
      const avgVolume = historicalData.slice(-5).reduce((sum, d) => sum + d.volume, 0) / 5;
      const volumeRatio = volume / avgVolume;
      
      // Moving averages
      const ma5 = historicalData.slice(-5).reduce((sum, d) => sum + d.price, 0) / 5;
      const ma10 = historicalData.slice(-10).reduce((sum, d) => sum + d.price, 0) / 10;
      const ma5Ratio = price / ma5;
      const ma10Ratio = price / ma10;
      
      // Prepare input for prediction with enhanced features
      const input = [
        price / 1000, // Normalized current price
        priceChange, // Price change percentage
        volumeRatio, // Volume ratio
        currentData.pe / 100, // Normalized P/E
        currentData.dividend / 10, // Normalized dividend
        currentData.trend, // Cumulative trend
        currentData.volatility, // Volatility
        ma5Ratio, // 5-day moving average ratio
        ma10Ratio, // 10-day moving average ratio
        (new Date().getDay()) / 7, // Day of week
        (new Date().getMonth()) / 12, // Month
        Math.sin((new Date().getDay()) * Math.PI / 3.5) // Cyclical encoding for day
      ];

      // Make prediction
      const result = model.run(input) as number[];
      const predictedPrice = result[0] * 1000; // Denormalize
      
      // Calculate confidence and trend
      const confidence = Math.min(95, Math.max(60, 100 - Math.abs(predictedPrice - currentData.price) / currentData.price * 100));
      const trend = predictedPrice > currentData.price ? 'up' : predictedPrice < currentData.price ? 'down' : 'stable';
      
      // Generate recommendation
      let recommendation = '';
      if (trend === 'up' && confidence > 80) {
        recommendation = 'Strong Buy';
      } else if (trend === 'up' && confidence > 70) {
        recommendation = 'Buy';
      } else if (trend === 'down' && confidence > 80) {
        recommendation = 'Strong Sell';
      } else if (trend === 'down' && confidence > 70) {
        recommendation = 'Sell';
      } else {
        recommendation = 'Hold';
      }

      // Generate past months data
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const pastMonths = [];
      for (let i = 5; i >= 0; i--) {
        const monthIndex = (new Date().getMonth() - i + 12) % 12;
        const monthData = historicalData.slice(i * 15, (i + 1) * 15);
        const avgPrice = monthData.reduce((sum, d) => sum + d.price, 0) / monthData.length;
        const change = ((avgPrice - currentData.price) / currentData.price) * 100;
        const volume = monthData.reduce((sum, d) => sum + d.volume, 0) / monthData.length;
        
        pastMonths.push({
          month: months[monthIndex],
          avgPrice: avgPrice,
          change: change,
          volume: volume
        });
      }

      // Generate upcoming predictions for next 7 days
      const upcomingPredictions = [];
      const today = new Date();
      for (let i = 1; i <= 7; i++) {
        const futureDate = new Date(today);
        futureDate.setDate(today.getDate() + i);
        
        // Simple prediction model for future dates
        const dailyChange = (predictedPrice - currentData.price) / 7;
        const futurePrice = currentData.price + (dailyChange * i);
        const futureConfidence = Math.max(confidence - (i * 2), 50); // Confidence decreases over time
        
        upcomingPredictions.push({
          date: futureDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          price: futurePrice,
          confidence: futureConfidence
        });
      }

      setPrediction({
        symbol: symbol.toUpperCase(),
        currentPrice: currentData.price,
        predictedPrice: predictedPrice,
        confidence: confidence,
        trend: trend,
        recommendation: recommendation,
        technicalIndicators: {
          ma5Ratio: ma5Ratio,
          ma10Ratio: ma10Ratio,
          volumeRatio: volumeRatio,
          volatility: currentData.volatility,
          momentum: currentData.trend
        },
        historicalData: historicalData,
        predictionDate: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        pastMonths: pastMonths,
        upcomingPredictions: upcomingPredictions
      });

    } catch (error) {
      setError('Failed to generate prediction. Please try again.');
      console.error('Prediction error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Stock Predictor</h3>
          <p className="text-sm text-gray-600">Powered by Brain.js Neural Network</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Data Loader */}
        <DataLoader onDataLoaded={handleDataLoaded} symbol={symbol} />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stock Symbol
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder="Enter stock symbol (e.g., AAPL)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={predictStock}
              disabled={isLoading || !dataLoaded}
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </div>
              ) : !dataLoaded ? (
                'Load Data First'
              ) : (
                'Predict'
              )}
            </button>
          </div>
        </div>

        {/* Quick Symbols */}
        <div>
          <p className="text-sm text-gray-600 mb-2">Popular stocks:</p>
          <div className="flex flex-wrap gap-2">
            {sampleStocks.map((stock) => (
              <button
                key={stock.symbol}
                onClick={() => setSymbol(stock.symbol)}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors duration-200"
              >
                {stock.symbol}
              </button>
            ))}
          </div>
        </div>

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

        {prediction && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
            <div className="text-center mb-4">
              <h4 className="text-xl font-bold text-gray-800 mb-2">{prediction.symbol}</h4>
              <p className="text-sm text-gray-600 mb-3">Prediction Date: {prediction.predictionDate}</p>
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Current Price</p>
                  <p className="text-lg font-semibold text-gray-800">${prediction.currentPrice.toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Predicted Price</p>
                  <p className={`text-lg font-semibold ${
                    prediction.trend === 'up' ? 'text-green-600' : 
                    prediction.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    ${prediction.predictedPrice.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Confidence</p>
                <p className="text-lg font-semibold text-blue-600">{prediction.confidence.toFixed(1)}%</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Trend</p>
                <p className={`text-lg font-semibold ${
                  prediction.trend === 'up' ? 'text-green-600' : 
                  prediction.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {prediction.trend.toUpperCase()}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Recommendation</p>
                <p className={`text-lg font-semibold ${
                  prediction.recommendation.includes('Buy') ? 'text-green-600' : 
                  prediction.recommendation.includes('Sell') ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  {prediction.recommendation}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4">
              <h5 className="font-semibold text-gray-800 mb-2">Market Analysis</h5>
              <p className="text-sm text-gray-600">
                Based on historical price patterns, volume analysis, and market indicators, 
                our neural network predicts a {prediction.trend}ward movement for {prediction.symbol} 
                with {prediction.confidence.toFixed(1)}% confidence. 
                {prediction.recommendation === 'Strong Buy' && ' This represents a strong buying opportunity.'}
                {prediction.recommendation === 'Buy' && ' Consider adding to your portfolio.'}
                {prediction.recommendation === 'Hold' && ' Maintain current position.'}
                {prediction.recommendation === 'Sell' && ' Consider reducing exposure.'}
                {prediction.recommendation === 'Strong Sell' && ' Consider exiting position.'}
              </p>
            </div>

            {/* Technical Indicators */}
            <div className="bg-white rounded-lg p-4 mt-4">
              <h5 className="font-semibold text-gray-800 mb-3">Technical Indicators</h5>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-1">MA5 Ratio</p>
                  <p className={`text-sm font-semibold ${
                    prediction.technicalIndicators.ma5Ratio > 1 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {prediction.technicalIndicators.ma5Ratio.toFixed(3)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-1">MA10 Ratio</p>
                  <p className={`text-sm font-semibold ${
                    prediction.technicalIndicators.ma10Ratio > 1 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {prediction.technicalIndicators.ma10Ratio.toFixed(3)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-1">Volume Ratio</p>
                  <p className={`text-sm font-semibold ${
                    prediction.technicalIndicators.volumeRatio > 1 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {prediction.technicalIndicators.volumeRatio.toFixed(2)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-1">Volatility</p>
                  <p className="text-sm font-semibold text-blue-600">
                    {(prediction.technicalIndicators.volatility * 100).toFixed(2)}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-1">Momentum</p>
                  <p className={`text-sm font-semibold ${
                    prediction.technicalIndicators.momentum > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {(prediction.technicalIndicators.momentum * 100).toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Past Months Performance */}
            <div className="bg-white rounded-lg p-4 mt-4">
              <h5 className="font-semibold text-gray-800 mb-3">Past 6 Months Performance</h5>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {prediction.pastMonths.map((month, index) => (
                  <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">{month.month}</p>
                    <p className="text-sm font-semibold text-gray-800">${month.avgPrice.toFixed(2)}</p>
                    <p className={`text-xs font-medium ${
                      month.change > 0 ? 'text-green-600' : month.change < 0 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {month.change > 0 ? '+' : ''}{month.change.toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Vol: {(month.volume / 1000000).toFixed(1)}M
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Predictions */}
            <div className="bg-white rounded-lg p-4 mt-4">
              <h5 className="font-semibold text-gray-800 mb-3">Upcoming 7 Days Predictions</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {prediction.upcomingPredictions.map((pred, index) => (
                  <div key={index} className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-gray-600 mb-1">{pred.date}</p>
                    <p className="text-sm font-semibold text-blue-800">${pred.price.toFixed(2)}</p>
                    <p className="text-xs text-blue-600 font-medium">
                      {pred.confidence.toFixed(0)}% confidence
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Chart */}
            <div className="bg-white rounded-lg p-4 mt-4">
              <h5 className="font-semibold text-gray-800 mb-3">Price History & Prediction</h5>
              <div className="h-64">
                <Line 
                  data={{
                    labels: prediction.historicalData.map((_, index) => `Day ${index + 1}`),
                    datasets: [
                      {
                        label: 'Historical Price',
                        data: prediction.historicalData.map(d => d.price),
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4,
                        fill: true
                      },
                      {
                        label: 'Predicted Price',
                        data: [...prediction.historicalData.map(() => null), prediction.predictedPrice],
                        borderColor: prediction.trend === 'up' ? '#10b981' : prediction.trend === 'down' ? '#ef4444' : '#6b7280',
                        backgroundColor: 'transparent',
                        borderDash: [5, 5],
                        pointBackgroundColor: prediction.trend === 'up' ? '#10b981' : prediction.trend === 'down' ? '#ef4444' : '#6b7280',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 6
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top' as const,
                      },
                      title: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: false,
                        grid: {
                          color: 'rgba(0, 0, 0, 0.1)',
                        },
                      },
                      x: {
                        grid: {
                          display: false,
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>

            {/* Volume Chart */}
            <div className="bg-white rounded-lg p-4 mt-4">
              <h5 className="font-semibold text-gray-800 mb-3">Volume Analysis</h5>
              <div className="h-48">
                <Bar 
                  data={{
                    labels: prediction.historicalData.slice(-20).map((_, index) => `Day ${index + 1}`),
                    datasets: [
                      {
                        label: 'Volume',
                        data: prediction.historicalData.slice(-20).map(d => d.volume / 1000000),
                        backgroundColor: prediction.technicalIndicators.volumeRatio > 1 
                          ? 'rgba(16, 185, 129, 0.8)' 
                          : 'rgba(239, 68, 68, 0.8)',
                        borderRadius: 4,
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                      title: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: 'Volume (Millions)'
                        },
                        grid: {
                          color: 'rgba(0, 0, 0, 0.1)',
                        },
                      },
                      x: {
                        grid: {
                          display: false,
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 