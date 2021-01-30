import React, { useState, useEffect } from "react";
import Infobox from "./Infobox";
import Linegraph from "./Linegraph";
import Map from "./Map";
import Table from "./Table";
import "./App.css";
import "leaflet/dist/leaflet.css";
// import { v4 as uuidv4 } from "uuid";
import { Select, MenuItem, FormControl, CardContent, Card } from "@material-ui/core";

function App() {
  const [countries, setcountries] = useState([]);
  const [country, setcountry] = useState("worldwide");
  const [countryInfo, setcountryInfo] = useState({});
  const [tableData, settableData] = useState([]);
  // const [mapCenter, setmapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  // const [mapZoom, setmapZoom] = useState(3);
  const [mapData, setmapData] = useState([3, [34.80746, -40.4796]]);
  const [mapcountry, setmapcountry] = useState([]);
  const [casesType, setcasesType] = useState("cases");
  useEffect(() => {
    let fetchingDataFromDiseaseWorldwide = () => {
      fetch("https://disease.sh/v3/covid-19/all")
        .then((response) => response.json())
        .then((data) => setcountryInfo(data));
    };
    fetchingDataFromDiseaseWorldwide();
  }, []);

  useEffect(() => {
    let fetchingDataFromDiseaseSh = () => {
      fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          let countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));

          let sortedData = data.sort((a, b) => b.cases - a.cases);
          settableData(sortedData);
          setcountries(countries);
          setmapcountry(data);
        });
    };
    fetchingDataFromDiseaseSh();
  }, [countries]);
  const onCountryChange = (e) => {
    let countryCode = e.target.value;
    let url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.countryInfo) {
          setmapData([4, [data.countryInfo.lat, data.countryInfo.long]]);
          // setmapZoom(4);
          // setmapCenter([data.countryInfo.lat, data.countryInfo.long]);
        } else {
          setmapData([3, [34.80746, -40.4796]]);
          // setmapZoom(3);
          // setmapCenter([34.80746, -40.4796]);
        }
        setcountry(countryCode);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="App">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>

          <FormControl onChange={onCountryChange}>
            <Select variant="outlined" value={country}>
              <MenuItem value="worldwide">Worldwide</MenuItem>
              console.log(countries[0])
              {countries.map((country, i) => (
                // console.log()
                <MenuItem key={i} value={country.value}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <Infobox
            isRed
            active={casesType === "cases"}
            onClick={(e) => setcasesType("cases")}
            title="Caronavirus Cases"
            cases={countryInfo.todayCases}
            total={countryInfo.cases}
          />
          <Infobox
            active={casesType === "recovered"}
            onClick={(e) => setcasesType("recovered")}
            title="Recovered"
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered}
          />
          <Infobox
            isRed
            active={casesType === "deaths"}
            onClick={(e) => setcasesType("deaths")}
            title="Death"
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths}
          />
        </div>
        <Map casesType={casesType} countries={mapcountry} mapData={mapData} />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3>Worldwide New Cases</h3>
          <Linegraph casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
