import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <Link to="/about">About</Link>
      <h1>Welcome to East Gallery</h1>
      <p>This is the home page.</p>
      <div className="h-screen flex items-center justify-center bg-bla ck">
        <h1 className="text-5xl font-bold text-cyan-400">Tailwind شغال 🔥</h1>
      </div>
    </div>
  );
};

export default Home;
