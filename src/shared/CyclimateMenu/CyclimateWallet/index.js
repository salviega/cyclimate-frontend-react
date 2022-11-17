import "./CyclimateWallet.scss";
import React from "react";
import { useAuth } from "../../../hooks/context";

export function CyclimateWallet() {
  const [loading, setLoading] = React.useState(false);
  const auth = useAuth();

  const connectWallet = async () => {
    if (auth.user.walletAddress === "Connect wallet") {
      await auth.login();
      setLoading(false);
    } else {
      await auth.logout();
      setLoading(false);
    }
  };

  return (
    <button className="button-wallet" onClick={connectWallet}>
      {loading
        ? "loading..."
        : auth.user.walletAddress !== "Connect wallet"
        ? "..." + String(auth.user.walletAddress).slice(36)
        : "Connect wallet"}
    </button>
  );
}
