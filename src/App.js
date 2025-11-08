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
      .then((data) => {
        setCountries(data);
        setError(""); // clear error if success
      })
      .catch(() => setError("Failed to fetch countries"));
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
      .then((data) => {
        setStates(data);
        setError(""); // clear any previous error
      })
      .catch(() => setError("Failed to fetch states"));
  }, [selCountry]);

  // Fetch cities based on selected state
  useEffect(() => {
    if (!selCountry || !selState) return;
    setError("");
    fetch(
      `https://location-selector.labs.crio.do/country=${encodeURIComponent(
        selCountry
      )}/state=${encodeURIComponent(selState)}/cities`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch cities");
        return res.json();
      })
      .then((data) => {
        setCities(data);
        setError("");
      })
      .catch(() => setError("Failed to fetch cities"));
  }, [selCountry, selState]);

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h1>City Selector</h1>

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
            <option key={country} value={country}>
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
            <option key={state} value={state}>
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
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: "20px", fontWeight: "bold" }}>
        {selCountry && selState && selCity
          ? `You selected ${selCity}, ${selState}, ${selCountry}`
          : "Please select a location"}
      </div>
    </div>
  );
};

export default App;
