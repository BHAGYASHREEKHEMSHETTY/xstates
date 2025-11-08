import React, { useEffect, useState } from "react";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selCountry, setSelCountry] = useState("");
  const [selState, setSelState] = useState("");
  const [selCity, setSelCity] = useState("");
  const [error, setError] = useState("");

  // Fetch countries
  useEffect(() => {
    fetch("https://location-selector.labs.crio.do/countries")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch countries");
        return res.json();
      })
      .then((data) => setCountries(data))
      .catch((err) => setError(err.message || "Something went wrong"));
  }, []);

  // Fetch states based on selected country
  useEffect(() => {
    if (!selCountry) return;
    setError("");

    fetch(`https://location-selector.labs.crio.do/country=${selCountry}/states`)
    
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch states");
        return res.json();
      })
      .then((data) => setStates(data))
      .catch((err) => setError(err.message || "Something went wrong"));
  }, [selCountry]);

  // Fetch cities based on selected state
  useEffect(() => {
    if (!selCountry || !selState) return;
    setError("");

    fetch(
  `https://location-selector.labs.crio.do/country=${encodeURIComponent(selCountry)}/state=${encodeURIComponent(selState)}/cities`
)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch cities");
        return res.json();
      })
      .then((data) => setCities(data))
      .catch((err) => setError(err.message || "Something went wrong"));
  }, [selCountry, selState]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "20px" }}>
        Select Location
      </h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        {/* Country Dropdown */}
        <select
          value={selCountry}
          onChange={(e) => {
            setSelCountry(e.target.value);
            setSelState("");
            setSelCity("");
            setStates([]);
            setCities([]);
          }}
        >
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option value={country} key={country}>
              {country}
            </option>
          ))}
        </select>

        {/* State Dropdown */}
        <select
          value={selState}
          onChange={(e) => {
            setSelState(e.target.value);
            setSelCity("");
            setCities([]);
          }}
          disabled={!selCountry}
        >
          <option value="">Select State</option>
          {states.map((state) => (
            <option value={state} key={state}>
              {state}
            </option>
          ))}
        </select>

        {/* City Dropdown */}
        <select
          value={selCity}
          onChange={(e) => setSelCity(e.target.value)}
          disabled={!selState}
        >
          <option value="">Select City</option>
          {cities.map((city) => (
            <option value={city} key={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: "20px", fontWeight: "bold" }}>
        {selCity && selState && selCountry ? (
          <p>
            You selected {selCity}, {selState}, {selCountry}
          </p>
        ) : (
          <p>Please select a location</p>
        )}
      </div>
    </div>
  );
};

export default App;
