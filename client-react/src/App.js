import logo from "./logo.svg";
import "./App.css";
import getGoogleAuthUrl from "./utils/getGoogleUrls";

function App() {
  const link = getGoogleAuthUrl();
  console.log(link);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a className="App-link" href={link} target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
