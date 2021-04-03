import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App";
import { FlickerProvider } from "./hooks/flicker";
import { MessageProvider } from "./hooks/messages";
import { FocusProvider } from "./hooks/focus";

fetch(`${process.env.PUBLIC_URL}/messages.json`)
  .then((response) => response.json())
  .then((loadedData) => {
    ReactDOM.render(
      <React.StrictMode>
        <FocusProvider>
          <FlickerProvider>
            <MessageProvider messages={loadedData}>
              <App />
            </MessageProvider>
          </FlickerProvider>
        </FocusProvider>
      </React.StrictMode>,
      document.getElementById("root")
    );
  });
