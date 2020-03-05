import React, { useState } from 'react';
import './App.css';
import axios from "axios";
import data from './finalData.json';

function App() {
  function calculateDistance(lat1, lon1, lat2, lon2) {
    let radlat1 = Math.PI * lat1 / 180
    let radlat2 = Math.PI * lat2 / 180
    let radlon1 = Math.PI * lon1 / 180
    let radlon2 = Math.PI * lon2 / 180
    let theta = lon1 - lon2
    let radtheta = Math.PI * theta / 180
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    return dist
  }

  function handleNameSubmit(event) {
    event.preventDefault();

    let restToPrint = data.filter(item => item.name.includes(name));

    let rest = restToPrint.map((item, index) => {
      return <h4> {item.name} </h4>
    })

    setRestaurants(
      <div>
        <h2>Restaurants filtered by name</h2>
        <div>{rest}</div>
      </div>
    );
  }

  async function handleAddressSubmit(event) {
    event.preventDefault();
    let response = await axios.get('https://api.opencagedata.com/geocode/v1/json?q=' + address + '&key=7d7d2cd269b5458daa390df7c2a547ce');
    let lat = response.data.results[0].geometry.lat;
    let lon = response.data.results[0].geometry.lng;

    let restToPrint = data.sort(function (a, b) {
      return calculateDistance(lat, lon, a.lat, a.lon) - calculateDistance(lat, lon, b.lat, b.lon);
    });

    console.log(restToPrint);

    setRestaurants(
      <div>
        <h2>Restaurants sorted by distance to your address</h2>
        <div>
          {restToPrint.map((item, index) => {
            return <h4> {item.name} </h4>
          })}
        </div>
      </div>
    );
  }

  let rest = data.map((item, index) => {
    return <h4> {item.name} </h4>
  })
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [restaurants, setRestaurants] = useState(rest);

  return (
    <div class="container demo">
      <div class="content">
        <div class="row">
          <h1 class="col-md-8 offset-md-2">Bib Michelin x Maitre Restaurateur</h1>
        </div>

        <div class="row">
          <button class="col-md-2 offset-md-5" onClick={() => setRestaurants()}>
            Remove restaurants
      </button>
        </div>
        <br />


        <div class="row">
          <div class="col-md-6 offset-md-3">
            <form onSubmit={handleNameSubmit}>
              <label>
                Search by name:
          <input type="text" value={name} onChange={e => setName(e.target.value)} />
              </label>
              <input type="submit" value="Submit" />
            </form>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6 offset-md-3">
            <form onSubmit={handleAddressSubmit}>
              <label>
                Search by Address:
          <input type="text" value={address} onChange={e => setAddress(e.target.value)} />
              </label>
              <input type="submit" value="Submit" />
            </form>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6 offset-md-3">
            {restaurants}
          </div>
        </div>

        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossorigin="anonymous"
        />
      </div>
    </div>
  );
}

export default App;
