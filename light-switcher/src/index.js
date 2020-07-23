import React from "react";
import ReactDOM from "react-dom";
import "./styles.css";
import { SERVER_URL } from './constants';

function App() {
  const [darkMode, setDarkMode] = React.useState(getInitialMode());
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    localStorage.setItem("dark", JSON.stringify(darkMode));
    postData();
  }, [darkMode]);

  function getInitialMode() {
    getInitialValue();
    const isReturningUser = "dark" in localStorage;
    const savedMode = JSON.parse(localStorage.getItem("dark"));
    const userPrefersDark = getPrefColorScheme();
    // if mode was saved --> dark / light
    if (isReturningUser) {
      return savedMode;
      // if preferred color scheme is dark --> dark
    } else if (userPrefersDark) {
      return true;
      // otherwise --> light
    } else {
      return false;
    }
    // return savedMode || false;
  }

  function getInitialValue() {
    fetch(SERVER_URL + "/get-toggle").then(response => response.json()).then(data => {
      setCount(data.count);
    });
  }
  function postData() {
    console.log(darkMode);
    fetch(SERVER_URL + "/toggle?darkMode=" + darkMode,).then(function (response) {
      return response.json();
    }).then(function (data) {
      if (darkMode) {
        setCount(count + 1);
      }
    });
  }

  function getPrefColorScheme() {
    if (!window.matchMedia) return;

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  return (
    <div className={darkMode ? "dark-mode" : "light-mode"}>
      <nav>
        <div className="toggle-container">
          <span style={{ color: darkMode ? "grey" : "yellow" }}>☀︎</span>
          <span className="toggle">
            <input
              checked={darkMode}
              onChange={() => setDarkMode(prevMode => !prevMode)}
              id="checkbox"
              className="checkbox"
              type="checkbox"
            />
            <label htmlFor="checkbox" />
          </span>
          <span style={{ color: darkMode ? "slateblue" : "grey" }}>☾</span>
          {/* <button onClick={() => setDarkMode(prevMode => !prevMode)}>
          Toggle
        </button> */}
        </div>
      </nav>
      <main>
        <center>
          <h2>{darkMode ? "Dark Mode" : "Light Mode"}</h2>
          <h3>Total times toggled: <span>{count}</span></h3>
        </center>
      </main>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
