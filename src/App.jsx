import './assets/styles/main.scss';
import SearchBar from './components/search-bar.jsx';
import {useState} from 'react';
import Results from './components/results.jsx';

function App() {
    const [searchResults, setSearchResults] = useState([]);
    return (
        <div className='screens-app'>
            <SearchBar
            setSearchResults={setSearchResults}
            />
            <Results
                searchResults={searchResults}
            />
        </div>
    )
}

export default App;
