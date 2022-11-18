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
        <h2 className="home__description">
          Fight global warming while pedaling.
        </h2>
      </div>
      <div className="steps">
        <div className="steps__container">
          <h3>STEP A</h3>
          <h2>Sensor</h2>
          <h4>Device</h4>
          <p>
            Users will enable the devices to start carbon measurement in their
            areas. The device will constantly upload the captured information.
          </p>
        </div>
        <div className="steps__container">
          <h3>STEP B</h3>
          <h2>Data</h2>
          <h4>Carbon neutrality</h4>
          <p>
            The information is classified and stored in the blockchain. This
            data will later help governments and companies in achieving carbon
            neutrality.
          </p>
        </div>
        <div className="steps__container">
          <h3>STEP C</h3>
          <h2>Cycli</h2>
          <h4>Support and get rewarded</h4>
          <p>
            For their constributions to our measurement efforts, each user will
            be able to exchange their captured data for our Cycli token in our
            website.
          </p>
        </div>
        <div className="steps__container">
          <h3>STEP D</h3>
          <h2>Rewards</h2>
          <h4>Get awesome benefits</h4>
          <p>
            Users will be able to exchange their Cycli tokens for benefits, NFTs
            and even FIAT money. They will also be able to exchange it for other
            toke
          </p>
        </div>
      </div>
      <CyclimateEvents>
        {events?.map((event, index) => (
          <CyclimateEvent key={index} event={event} />
        ))}
      </CyclimateEvents>
    </div>
  );
}
