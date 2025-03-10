import { useState } from "react";

const Statistics = ({ good, neutral, bad, all }) => {
  let states = [good, neutral, bad, all];
  for (let i = 0; i < 4; i++) {
    if (states[i] !== 0) {
      return (
        <>
          <h2>Statistics</h2>
          <table>
            <tbody>
              <StatisticLine text="Good " value={good} />
              <StatisticLine text="Neutral " value={neutral} />
              <StatisticLine text="Bad " value={bad} />
              <StatisticLine text="All " value={all} />
              <StatisticLine
                text="Average "
                value={all === 0 ? 0 : (good * 1 + bad * -1) / all}
              />
              <StatisticLine
                text="Positive "
                value={(all === 0 ? 0 : (good * 100) / all) + " %"}
              />
            </tbody>
          </table>
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

const Button = ({ onClick, text }) => {
  return <button onClick={onClick}>{text}</button>;
};

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [all, setAll] = useState(0);

  const Increase = (UpdateState, currentState) => {
    UpdateState(currentState + 1);
    setAll(all + 1);
  };

  return (
    <div>
      <h1>Give Feedback</h1>
      <Button onClick={() => Increase(setGood, good)} text="Good" />
      <Button onClick={() => Increase(setNeutral, neutral)} text="Neutral" />
      <Button onClick={() => Increase(setBad, bad)} text="Bad" />
      <Statistics good={good} neutral={neutral} bad={bad} all={all} />
    </div>
  );
};

export default App;
