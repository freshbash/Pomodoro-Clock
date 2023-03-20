import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faPlay, faPause, faRefresh } from '@fortawesome/free-solid-svg-icons';

function App() {
  return (
    <div>
      <FontAwesomeIcon icon={faPlus} />
      <FontAwesomeIcon icon={faMinus} />
      <FontAwesomeIcon icon={faPlay} />
      <FontAwesomeIcon icon={faPause} />
      <FontAwesomeIcon icon={faRefresh} />
      <div>Hello, world!</div>
    </div>
  );
}

export default App;
