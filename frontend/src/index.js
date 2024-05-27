import { StrictMode } from "react";
import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./redux/app/store";
import App from "./App";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "./apps/utilities/errorPage";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
//import '../src/public/web/css/custom.css';
//import '../src/public/web/css/sidebar.css';
//import '../src/public/web/css/global.css';

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
    <Provider store={store}>
      <ErrorBoundary fallback={<ErrorPage />}>
        <App />
      </ErrorBoundary>
    </Provider>
  </StrictMode>
);

reportWebVitals();
