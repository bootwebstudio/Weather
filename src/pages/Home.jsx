import { Link } from "react-router-dom";

// Assets
import HomeImage from "../assets/Home.png";

const Home = () => {
  return (
    <div className="w-full h-screen p-6 text-center flex flex-col gap-8 items-center justify-center font-[Quicksand]">
      <img
        src={HomeImage}
        alt="Weather"
        className="w-[75%] md:w-1/2 xl:w-1/4"
      />
      <p className="md:w-3/4 xl:w-2/4 text-lg md:text-xl font-semibold leading-tight text-stone-600">
        Access accurate, real-time weather data. Start exploring temperatures,
        forecasts, and more in just one click.
      </p>
      <Link
        to="/weather"
        className="p-4 px-10 text-lg md:text-xl xl:text-lg font-semibold leading-none rounded-full text-white bg-blue-500 hover:bg-blue-800 transition duration-200"
      >
        Get Started
      </Link>
    </div>
  );
};

export default Home;
