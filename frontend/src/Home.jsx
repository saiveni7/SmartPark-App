import "./App.css";

function Home({ onStart }) {
  return (
    <div className="home-bg">
      <div className="home-card">
        <h1>🚗 SmartPark System</h1>
        <p>Smart Parking Management System</p>

        <button onClick={onStart}>🚀 Get Started</button>
      </div>
    </div>
  );
}

export default Home;