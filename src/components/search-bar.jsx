import {useState} from 'react';
import PropTypes from 'prop-types';
import {STOPS} from '../utils/constants.js';
import {getCurrentLocation, getDistance} from '../utils';
import navigationArrow from '../assets/images/navigation-arrow-duotone.svg';
import magnifyingGlass from '../assets/images/magnifying-glass.svg';
function SearchBar({setSearchResults}) {
    const locationThreshold = 0.2; // 200 meters
    const [searchValue, setSearchValue] = useState('');
    const [currentPosition, setCurrentPosition] = useState(null);
    const [positionToggled, setPositionToggled] = useState(false);
    // Handle search term change and update items
    const handleSearchChange = (e) => {
        const searchTerm = e.target ? e.target.value : e.value;
        const newSearchTerm = searchTerm ? searchTerm : '';
        setSearchValue(newSearchTerm);
        const searchFilter = newSearchTerm.length > 1 ? newSearchTerm : '';
        setSearchResults(searchFilter.replaceAll(' ', '') === '' ? [] :
            Object.keys(STOPS).filter((item) =>
            item.toLowerCase().includes(searchFilter.toLowerCase())
        ));
    };
    const handlePlatformsLocations = (platforms, coords) => {
        const actualThreshold = locationThreshold + (coords.accuracy/1000);
        if(!platforms){
            return false;
        }
        for(const platform of Object.values(platforms)) {
            if(!platform.coords){
                return false;
            }
            const distance = getDistance(platform.coords[1], platform.coords[0], coords.latitude, coords.longitude);
            console.log('DISTANCE');
            console.log(distance);
            if(actualThreshold >= distance) {
                return true;
            }
        }
        return false;
    };
    const handleStopLocation = (stopData, coords) => {
        const actualThreshold = locationThreshold + (coords.accuracy/1000);
        if(!stopData || !stopData.stop_lat || !stopData.stop_lon) {
            return false;
        }
        const distance = getDistance(coords.latitude, coords.longitude, stopData.stop_lat, stopData.stop_lon);
        // console.log('DISTANCE');
        // console.log(distance);
        return actualThreshold >= distance;

    };
    // Handle search by current location
    const handleLocationSearch =  () => {
        // console.log('inside location search');
        // Placeholder logic for location-based search
        if(positionToggled) {
            setCurrentPosition(null);
            setPositionToggled(false);
            handleSearchChange(searchValue);
        } else {
            getCurrentLocation(setCurrentPosition);
        }
    };
    if(currentPosition && !positionToggled) {
        const coords = currentPosition.coords;
        console.log(STOPS);
        const items =
            Object.entries(STOPS).reduce((acc, [key, value]) =>
                {
                    console.log(acc);
                    if (!Array.isArray(value)) {
                        console.error(`Expected 'value' to be an array for key ${key}, but got:`, value);
                        return acc; // Skip if value is not an array
                    }
                    value.forEach((item) => {
                        // console.log(`ITEM ${key}`);
                        if(acc.includes(key)){
                            return acc;
                        }
                        if(item.platforms) {
                            if(handlePlatformsLocations(item.platforms, coords)) {
                                console.log(`PUSHING ${key}`);
                                acc.push(key);
                            }
                        }
                        if(handleStopLocation(item, coords)) {
                            console.log(`PUSHING ${key}`);
                            acc.push(key);
                        }
                    });
                    return acc;
                }, []
            );
        console.log(`ITEMS`);
        console.log(items);
        setPositionToggled(true);
        setSearchResults(items ? items : []);
    }

    return (
        <div className="search-bar">
            <img
                src={magnifyingGlass}
                alt="SearchBar Icon"
                className="icon24-search"
            ></img>
            <input
                type="text"
                placeholder="Search Stops..."
                value={searchValue}
                onChange={handleSearchChange}
                className="search-input"
            />
            <button onClick={handleLocationSearch} className="location-button">
                <img
                    src={navigationArrow}
                    alt="User Location Input Icon"
                    className="icon24"
                />
            </button>
        </div>
    )
}

SearchBar.propTypes = {
    setSearchResults: PropTypes.func.isRequired,
}

export default SearchBar;