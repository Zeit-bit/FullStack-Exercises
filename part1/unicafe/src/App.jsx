import { useState } from "react";

const Statistics = ({ good, neutral, bad, all }) => {
  let states = [good, neutral, bad, all];
  for (let i = 0; i < 4; i++) {
    if (states[i] !== 0) {
      return (
        <>
          <h2>Statistics</h2>
          <ul>
            <li>Good: {good}</li>
            <li>Neutral: {neutral}</li>
            <li>Bad: {bad}</li>
            <li>All: {all}</li>
            <li>Average: {all === 0 ? 0 : (good * 1 + bad * -1) / all}</li>
            <li>Positive: {all === 0 ? 0 : (good * 100) / all} %</li>
          </ul>
        </>
      );
    }
  }

  return (
    <>
      <h2>Statistics</h2>
      <p>No Feedback yet</p>
    </>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [all, setAll] = useState(0);

  const Increase = (updateState, currentState) => {
    updateState(currentState + 1);
    setAll(all + 1);
  };

  return (
    <div>
      <h1>Give Feedback</h1>
      <button onClick={() => Increase(setGood, good)}>Good</button>
      <button onClick={() => Increase(setNeutral, neutral)}>Neutral</button>
      <button onClick={() => Increase(setBad, bad)}>Bad</button>
      <Statistics good={good} neutral={neutral} bad={bad} all={all} />
    </div>
  );
};

export default App;
