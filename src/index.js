import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import App from "./App";
import { ReleaseContextProvider } from "./storage/release-context";
import { CommitContextProvider } from "./storage/commit-context";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ReleaseContextProvider>
    <CommitContextProvider>
      <App />
    </CommitContextProvider>
  </ReleaseContextProvider>
);
