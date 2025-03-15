import axios from "axios";
import { useEffect, useState } from "react";

const App = () => {
  const [input, setInput] = useState("");
  const [countries, setCountries] = useState([]);
  const [wmoCodes, setWmoCodes] = useState([]);

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => {
        setCountries(response.data);
      });

    axios
      .get(
        "https://gist.githubusercontent.com/stellasphere/9490c195ed2b53c707087c8c2db4ec0c/raw/76b0cb0ef0bfd8a2ec988aa54e30ecd1b483495d/descriptions.json"
      )
      .then((response) => {
        setWmoCodes(response.data);
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
      <CountryContent
        contentToShow={contentToShow}
        setInput={setInput}
        wmoCodes={wmoCodes}
      />
    </>
  );
};

const CountryContent = ({ contentToShow, setInput, wmoCodes }) => {
  const [weatherInfo, setWeatherInfo] = useState([]);
  const [location, setLocation] = useState([]);

  useEffect(() => {
    if (location.length > 0) {
      const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${location[0]}&longitude=${location[1]}&current=temperature_2m,weather_code,wind_speed_10m,is_day`;
      axios.get(weatherURL).then((response) => {
        setWeatherInfo(response.data);
      });
    }
  }, [location]);

  if (contentToShow.length > 10) {
    return <div>Too many matches, specify another filter</div>;
  } else if (contentToShow.length > 1) {
    return (
      <div>
        {contentToShow.map((c) => (
          <li key={c.name.common}>
            {c.name.common}{" "}
            <button onClick={() => setInput(c.name.common)}>Show</button>
          </li>
        ))}
      </div>
    );
  } else if (contentToShow.length === 1) {
    const country = contentToShow[0];
    const locationInfo = [
      country.capitalInfo.latlng[0],
      country.capitalInfo.latlng[1],
    ];

    if (location.toString() !== locationInfo.toString()) {
      setLocation(locationInfo);
    }

    let temperature = null;
    let wind = null;
    let imageFromWmoCode = null;
    let wmoCodeDescription = null;

    if (Object.values(weatherInfo).length > 0) {
      const weatherCurrent = weatherInfo.current;
      const weatherUnits = weatherInfo.current_units;
      temperature = `${weatherCurrent.temperature_2m} ${weatherUnits.temperature_2m}`;
      wind = `${weatherCurrent.wind_speed_10m} ${weatherUnits.wind_speed_10m}`;
      const wmoCode = weatherCurrent.weather_code;
      if (weatherCurrent.is_day === 1) {
        imageFromWmoCode = wmoCodes[wmoCode].day.image;
        wmoCodeDescription = wmoCodes[wmoCode].day.description;
      } else {
        imageFromWmoCode = wmoCodes[wmoCode].night.image;
        wmoCodeDescription = wmoCodes[wmoCode].night.description;
      }
    }

    return (
      <div>
        <h2>{country.name.common}</h2>
        <ul>
          <li>Capital: {" " + country.capital}</li>
          <li>Area: {" " + country.area + " km2"}</li>
        </ul>
        <h2>Languages</h2>
        <ul>
          {Object.values(country.languages).map(
            (l, i) => (
              <li key={i}>{l}</li>
            ),
            0
          )}
        </ul>
        <img
          src={country.flags.png}
          alt={country.flags.alt}
          style={{ width: "200px" }}
        ></img>
        <h2>Weather in {country.capital}</h2>
        <p>Temperature: {temperature}</p>
        <img
          src={imageFromWmoCode}
          alt={wmoCodeDescription}
          style={{ width: "150px" }}
        />
        <p>Wind: {wind}</p>
      </div>
    );
  }
};

export default App;
