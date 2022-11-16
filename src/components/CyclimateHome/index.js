import "./CyclimateHome.scss";
import React from "react";
import logo from "../../assets/images/logo-Cyclimate.png";
import { CyclimateEvent } from "./CyclimateEvent";
import { CyclimateEvents } from "./CyclimateEvents";
import { CyclimateLoading } from "../../shared/CyclimateLoading";

export function CyclimateHome({ items: events, loading, error }) {
  return (
    <div className="home">
      <div className="home__start_page">
        <img src={logo} alt="logo" className="home__logo" />
        <h1 className="home__title">Cyclimate</h1>
        <h2 className="home__description">Explore, connect, fun.</h2>
      </div>
      <CyclimateEvents>
        {events?.map((event, index) => (
          <CyclimateEvent key={index} event={event} />
        ))}
      </CyclimateEvents>
    </div>
  );
}
