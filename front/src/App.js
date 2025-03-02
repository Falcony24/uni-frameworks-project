import axios from 'axios';
import './App.css';

const port = process.env.PORT || 3000;

const apiCall = () => {
  axios.get('http://localhost:' + port).then((data) => {
    console.log(data)
  })
}

function App() {
  return (
      <div className="App">
        <header className="App-header">

          <button onClick={apiCall}>Make API Call</button>

        </header>
      </div>
  );
}

export default App;
