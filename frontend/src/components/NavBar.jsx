const Navbar = () => {
    return (
      <nav className="bg-gray-800 p-4 text-white w-full flex justify-between items-center">
        <h1 className="text-2xl font-bold">Survival Path</h1>
        <ul className="flex space-x-4">
          <li><a href="/" className="hover:underline">Home</a></li>
          <li><a href="/game" className="hover:underline">Play</a></li>
        </ul>
      </nav>
    );
  };

  export default Navbar;
