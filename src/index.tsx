import React from "react";
import ReactDOM from "react-dom/client";
import InfiniteCanvas from "./InfiniteCanvas.tsx";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <InfiniteCanvas />
  </React.StrictMode>
);
