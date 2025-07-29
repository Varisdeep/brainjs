import Link from "next/link";
import Navigation from "@/components/Navigation";

export default function Home() {
  return (
    <div>
      <Navigation />
      
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>StockAnalytics Platform</h1>
          <p>Advanced stock prediction and analytics with AI-powered insights</p>
          <div className="flex gap-6 justify-center">
            <Link href="/login" className="btn-primary">
              Get Started
            </Link>
            <Link href="/register" className="btn-secondary">
              Sign Up
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="p-8">
        <div className="container">
          <div className="text-center mb-8">
            <h2 className="dashboard-title">Why Choose StockAnalytics?</h2>
            <p className="dashboard-subtitle">
              Powerful features designed for modern trading and analysis
            </p>
          </div>
          
          <div className="grid grid-3">
            <div className="card feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI-Powered Predictions</h3>
              <p>Advanced machine learning algorithms provide accurate stock price predictions and trend analysis.</p>
            </div>
            
            <div className="card feature-card">
              <div className="feature-icon">📊</div>
              <h3>Real-Time Analytics</h3>
              <p>Live market data and comprehensive analytics to help you make informed trading decisions.</p>
            </div>
            
            <div className="card feature-card">
              <div className="feature-icon">📈</div>
              <h3>Advanced Charts</h3>
              <p>Interactive charts and visualizations with technical indicators and pattern recognition.</p>
            </div>
            
            <div className="card feature-card">
              <div className="feature-icon">🔐</div>
              <h3>Secure Authentication</h3>
              <p>Enterprise-grade security with role-based access control and secure user management.</p>
            </div>
            
            <div className="card feature-card">
              <div className="feature-icon">📱</div>
              <h3>Responsive Design</h3>
              <p>Beautiful, modern interface that works perfectly on desktop, tablet, and mobile devices.</p>
            </div>
            
            <div className="card feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Lightning Fast</h3>
              <p>Optimized performance with real-time updates and instant data processing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="p-8">
        <div className="container">
          <div className="text-center">
            <div className="card gradient-blue text-white">
              <h2 className="text-4xl font-bold mb-6">Ready to Start?</h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of traders using StockAnalytics for better investment decisions
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/register" className="btn-primary">
                  Create Account
                </Link>
                <Link href="/login" className="btn-secondary">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="p-8 text-center text-gray-600">
        <div className="container">
          <p>&copy; 2024 StockAnalytics. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
