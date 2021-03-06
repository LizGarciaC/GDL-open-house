import React from "react";
import MapComponent from "./MapComponent";
import Filters from "./Filters";
import { Link } from "react-router-dom";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";

class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      loadedPlaces: [],
      filteredPlaces: [],
      filters: {
        // -1 es el estado inicial
        priceFilter: -1,
        ratingFilter: -1
      }
    };
  }

  setLoadedPlaces = loadedPlaces => {
    this.setState({ loadedPlaces });
  };

  setFilter = e => {
    const { value, name } = e.target;

    let newFilters = { [name]: Number(value) };
    if (name === "priceFilter") {
      newFilters.ratingFilter = this.state.filters.ratingFilter;
    } else {
      newFilters.priceFilter = this.state.filters.priceFilter;
    }
    this.setState({ filters: newFilters }, this.setFilteredPlaces);
  };

  setFilteredPlaces = () => {
    // traer solo los que cumplen las condiciones
    const filteredPlaces = this.state.loadedPlaces.filter(e => {
      const priceFilter =
        this.state.filters.priceFilter > -1
          ? e.price_level <= this.state.filters.priceFilter
          : true;
      const ratingFilter =
        this.state.filters.ratingFilter > -1
          ? e.rating >= this.state.filters.ratingFilter
          : true;
      return priceFilter && ratingFilter;
    });
    this.setState({ filteredPlaces });
  };

  getGroupedPlaces = () => {
    let placesInGroupsOfTwo = [];

    this.state.filteredPlaces.forEach((place, i) => {
      if (i % 3 === 0) {
        placesInGroupsOfTwo.push([place]);
      } else {
        let lastArray = placesInGroupsOfTwo[placesInGroupsOfTwo.length - 1];
        lastArray.push(place);
      }
    });
    return placesInGroupsOfTwo;
  };

  render() {
    window.filteredPlaces = this.state.filteredPlaces;
    return (
      <div>
        <h2 style={{backgroundColor: "#E19B5F", width: "100%", height: "100%", textAlign:"center", fontSize:"70px", fontFamily:'Palatino Linotype', color:"red"}}>FOOD FINDER</h2>
          <MapComponent
            mainLocation={this.props.mainLocation}
            filteredPlaces={this.state.filteredPlaces}
            loadedPlaces={this.state.loadedPlaces}
            setLoadedPlaces={this.setLoadedPlaces}
            setFilteredPlaces={this.setFilteredPlaces}
          />
        <Filters filters={this.state.filters} setFilter={this.setFilter} />

        <div className="container" style={{ marginTop: "20px" }}>
          {this.getGroupedPlaces().map((places, i) => (
            <div className="row" key={`places${i}`}>
              {places.map((place, i2) => (
                <div
                  className="col-md card"
                  key={`place${i2}`}
                  style={{ margin: "5px", paddingTop: "5px" }}
                >
                  {place.photos && place.photos.length > 0 ? (
                    <img
                      className="card-img-top"
                      src={place.photos[0].getUrl()}
                      alt={place.name}
                    />
                  ) : (
                    ""
                  )}

                  <div className="card-body">
                    <h6 className="card-title">{place.name}</h6>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Home;
