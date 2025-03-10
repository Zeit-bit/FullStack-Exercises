import { useState } from "react";

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const Increase = (updateState, currentState) => {
    updateState(currentState + 1);
  };

  return (
    <div>
      <h1>Give Feedback</h1>
      <button onClick={() => Increase(setGood, good)}>Good</button>
      <button onClick={() => Increase(setNeutral, neutral)}>Neutral</button>
      <button onClick={() => Increase(setBad, bad)}>Bad</button>
      <h2>Statistics</h2>
      <ul>
        <li>Good: {good}</li>
        <li>Neutral: {neutral}</li>
        <li>Bad: {bad}</li>
      </ul>
    </div>
  );
};

export default App;
