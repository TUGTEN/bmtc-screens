import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ResultList from './result-list.jsx';
import ResultPlatform from './result-platform.jsx';
import {BMTC_API_ENDPOINT, CORS_ANYWHERE} from '../utils/constants.js';
import stopIcon from '../assets/images/signpost-fill.svg';
import openLinkIcon from '../assets/images/arrow-square-out-thin.svg';

const ResultStop = ({ name, stop }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [busDataList, setBusDataList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [busDataFiltered, setBusDataFiltered] = useState(null);
    const [initialLoading, setInitialLoading] = useState(true);

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    useEffect(() => {
        let intervalId;
        if (isExpanded) {
            const fetchBusData = async () => {
                if(initialLoading) {
                    setLoading(true);
                }
                try {
                    console.log(CORS_ANYWHERE);
                    console.log(BMTC_API_ENDPOINT);
                    const response = await fetch(`https://cors-anywhere-gie7.onrender.com/https://bmtcmobileapistaging.amnex.com/WebAPI/GetMobileTripsData/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ 'stationid': stop.stop_id, 'triptype': 1 }),
                    });
                    console.log(response);
                    const data = (await response.json())['data'];
                    console.log(data);
                    setBusDataList(data ? data : []);
                } catch (error) {
                    console.error('Error fetching bus data:', error);
                } finally {
                    setInitialLoading(false);
                    setLoading(false);
                }
            };

            fetchBusData();
            intervalId = setInterval(fetchBusData, 30000);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isExpanded, stop.stop_id]);

    const handleSearchChange = (e) => {
        const newSearchText = e.target ? e.target.value : (e.value ? e.value : '');
        setSearchText(newSearchText);
        setBusDataFiltered(newSearchText.replaceAll(' ', '') === '' ? null :
        busDataList.filter((busData) =>
                (
                    busData.routeno.toLowerCase().includes(newSearchText.toLowerCase())
                    || busData.tostationname.toLowerCase().includes(newSearchText.toLowerCase())
                    || busData.busno.toLowerCase().includes(newSearchText.toLowerCase())
                )
        )
        );
    };

    // const filteredPlatforms = () => {
    //     const platformComponents = [];
    //     const accountedBusData = new Set();
    //
    //     if (stop.platforms) {
    //         Object.entries(stop.platforms).forEach(([platformId, platformData]) => {
    //             const platformRoutes = platformData.routes;
    //             const filteredBusData = busDataList.filter((bus) => {
    //                 const matches = platformRoutes[bus.routeno];
    //                 if (matches) {
    //                     accountedBusData.add(bus.routeno);
    //                 }
    //                 return matches;
    //             });
    //
    //             platformComponents.push(
    //                 <ResultPlatform key={platformId} name={`Platform ${platformId}`} busDataList={filteredBusData} />
    //             );
    //         });
    //     }
    //
    //     const unaccountedBusData = busDataList.filter((bus) => !accountedBusData.has(bus.routeno));
    //     if (unaccountedBusData.length > 0) {
    //         platformComponents.push(
    //             <ResultPlatform key="unknown" name="Unknown Platform" busDataList={unaccountedBusData} />
    //         );
    //     }
    //
    //     return platformComponents;
    // };

    return (
        <div className={`result-stop${isExpanded ? '-expanded' : ''}`}>
            <div
                className="stop-bar"
                onClick={toggleExpanded}
            >
                <div className="results-stop-name">
                    <img src={stopIcon} className="icon24" alt="stop icon"/>
                    <span>{name}</span>
                    <div className="results-stop-id">#{stop.stop_id}</div>
                </div>
            </div>
            {isExpanded &&
                // Open in google maps, blue button with white text.
                (
                <div className="google-maps-stop-button" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${stop.stop_lat},${stop.stop_lon}`, '_blank')}>
                    Open in Google Maps
                    <img src={openLinkIcon} className='icon24'/>
                </div>
            )}
            {isExpanded &&
                (loading && initialLoading ? (
                <div className="loading-stop-results">Loading...</div>
            ) : (
                <div className={"stop-results-loaded"}>
                    <input
                        type="text"
                        placeholder="Search Results..."
                        value={searchText}
                        onChange={handleSearchChange}
                        className="stops-search-input"
                    />
                    {(busDataFiltered !== null) && (busDataFiltered !== undefined) ? (<ResultList busDataList={busDataFiltered} />) : <ResultList busDataList={busDataList} />}
                </div>
                ))}
        </div>
    );
};

ResultStop.propTypes = {
    name: PropTypes.string.isRequired,
    stop: PropTypes.shape({
        platforms: PropTypes.objectOf(
            PropTypes.shape({
                coordinates: PropTypes.arrayOf(PropTypes.number),
                routes: PropTypes.objectOf(PropTypes.string),
            })
        ),
        stop_lat: PropTypes.number.isRequired,
        stop_lon: PropTypes.number.isRequired,
        stop_id: PropTypes.number.isRequired,
    }).isRequired,
};

export default ResultStop;
