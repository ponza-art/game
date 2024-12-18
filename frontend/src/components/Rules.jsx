const Rules = () => (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">Game Rules</h1>
      <ul className="list-disc text-left ml-8 space-y-2">
        <li>Players take turns playing cards to move forward or gain points.</li>
        <li>The first player to reach square 20 wins the game.</li>
        <li>Cards have effects: Move, Bonus, Penalty, Event, and Mind Play.</li>
        <li>Use strategy to move forward or hinder opponents.</li>
        <li>Play ends when a player reaches square 20 or the last card is drawn.</li>
      </ul>
      <button
        onClick={() => window.history.back()}
        className="mt-6 px-4 py-2 bg-gray-600 text-white rounded shadow"
      >
        Back
      </button>
    </div>
  );
  
  export default Rules;
  