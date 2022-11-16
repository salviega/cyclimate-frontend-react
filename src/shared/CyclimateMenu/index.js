import "./CyclimateMenu.scss";
import bbva from "../../assets/images/logo-bbva.png";
import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/context";

export function CyclimateMenu(props) {
  const auth = useAuth();
  const privateRoutes = true;

  return (
    <header>
      <nav className="menu">
        <div className="menu-left">
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <figure>
              <img src={bbva} alt="logo" />
            </figure>
          </Link>
        </div>
        <div className="menu-center">
          {privateRoutes &&
          auth.user.walletAddress === "Connect wallet" ? null : (
            <>
              <p className="menu-center__item">
                <NavLink to="/">Home</NavLink>
              </p>
              <p className="menu-center__item">
                <NavLink
                  className={({ isActive }) => {
                    return isActive ? "menu-center__item--active" : "";
                  }}
                  to="/maker"
                >
                  Benefits
                </NavLink>
              </p>
              <p className="menu-center__item">
                <NavLink
                  className={({ isActive }) => {
                    return isActive ? "menu-center__item--active" : "";
                  }}
                  to="/marketplace"
                >
                  Marketplace
                </NavLink>
              </p>
              <p className="menu-center__item">
                <NavLink
                  className={({ isActive }) => {
                    return isActive ? "menu-center__item--active" : "";
                  }}
                  to="/gateway"
                >
                  Gateway
                </NavLink>
              </p>
              <p className="menu-center__item">
                <NavLink
                  className={({ isActive }) => {
                    return isActive ? "menu-center__item--active" : "";
                  }}
                  to="/faucet"
                >
                  Faucet
                </NavLink>
              </p>
              <p className="menu-center__item">
                <NavLink
                  className={({ isActive }) => {
                    return isActive ? "menu-center__item--active" : "";
                  }}
                  to="/dashboard"
                >
                  Dashboard
                </NavLink>
              </p>
            </>
          )}
        </div>
        {props.children}
      </nav>
    </header>
  );
}
