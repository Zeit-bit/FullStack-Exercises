import axios from "axios";
import { useEffect, useState } from "react";

const App = () => {
  const [input, setInput] = useState("");
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => {
        setCountries(response.data);
      });
  }, []);

  const contentToShow = countries.filter((c) => {
    const countryName = c.name.common.toLowerCase();
    return countryName.indexOf(input.toLowerCase()) !== -1;
  });

  return (
    <>
      <div>
        Find Countries:{" "}
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
      </div>
      <CountryContent contentToShow={contentToShow} />
    </>
  );
};

const CountryContent = ({ contentToShow }) => {
  if (contentToShow.length > 10) {
    return <div>Too many matches, specify another filter</div>;
  } else if (contentToShow.length > 1) {
    return (
      <div>
        {contentToShow.map((c) => (
          <li key={c.name.common}>{c.name.common}</li>
        ))}
      </div>
    );
  } else if (contentToShow.length === 1) {
    console.log(contentToShow);
    return (
      <div>
        <h2>{contentToShow[0].name.common}</h2>
        <ul>
          <li>Capital: {" " + contentToShow[0].capital}</li>
          <li>Area: {" " + contentToShow[0].area}</li>
        </ul>
        <h2>Languages</h2>
        <ul>
          {Object.values(contentToShow[0].languages).map(
            (l, i) => (
              <li key={i}>{l}</li>
            ),
            0
          )}
        </ul>
        <img
          src={contentToShow[0].flags.png}
          alt={contentToShow[0].flags.alt}
          style={{ width: "200px" }}
        ></img>
      </div>
    );
  } else {
    return <h2>No results</h2>;
  }
};

export default App;
