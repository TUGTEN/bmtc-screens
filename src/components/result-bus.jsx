import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import openLinkIcon from '../assets/images/arrow-square-out-thin.svg';
import busIcon from '../assets/images/bus-fill.svg';

const ResultBus = ({ busData }) => {
    const [minutesRemaining, setMinutesRemaining] = useState(null);

    useEffect(() => {
        if (busData && busData.arrivaltime) {
            // Regular expression to match the date and time format (e.g., '23-11-2024 09:55:00')
            const regex = /(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})/;
            const match = busData.arrivaltime.match(regex);
            if (match) {
                // Destructure the matched values into day, month, year, hours, minutes, and seconds
                const [ , day, month, year, hours, minutes, seconds ] = match;
                // Create a new Date object using the parsed values in ISO format
                const arrivalTime = new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`);
                const currentTime = new Date();
                // Calculate the time difference in milliseconds and ensure it is not negative
                const timeDifference = Math.max(arrivalTime - currentTime, 0);
                // Convert the time difference from milliseconds to minutes
                const remainingMinutes = Math.floor(timeDifference / (1000 * 60));
                // Update the state with the remaining minutes
                setMinutesRemaining(remainingMinutes);
            }
        }
    }, [busData]);
    return (
        <div className="result-bus" >
            <img src={busIcon} className='icon24' alt='bus icon' />
            {/* Route number with a fixed width and no wrapping, allowing horizontal scrolling if overflow occurs */}
            <span className="route-number">{busData.routeno}</span>
            {/* To station name with a flexible width, allowing horizontal scrolling if overflow occurs */}
            <span className="station-name">{busData.tostationname}</span>
            {/* Bus number with no wrapping, fixed width no overflow */}
            <span className="bus-number">{busData.busno}</span>
            {/* Display remaining minutes until arrival or '...' if not available, fixed width no overflow */}
            <span className="time-arrive">
        {minutesRemaining !== null
            ? `${minutesRemaining}m` // Display remaining minutes
            : '...'} {/* Placeholder while calculating */}
      </span>
            {/* Button to open an external link, with an icon, fixed width no overflow */}
            <button className='open-in-bmtc' onClick={() => window.open(`https://bmtcwebportal.amnex.com/commuter/track-a-bus?busno=${busData.busno}&vehicleid=${busData.vehicleid}`, '_blank')}>
                <img src={openLinkIcon} alt="Open Link" className="icon24" />
            </button>
        </div>
    );
};

ResultBus.propTypes = {
    busData: PropTypes.shape({
        routeno: PropTypes.string.isRequired, // Route number of the bus
        routename: PropTypes.string, // Route name (optional)
        fromstationname: PropTypes.string, // From station name (optional)
        tostationname: PropTypes.string.isRequired, // To station name
        vehicleid: PropTypes.number.isRequired, // Vehicle ID (optional)
        busno: PropTypes.string.isRequired, // Bus number
        arrivaltime: PropTypes.string.isRequired, // Arrival time in 'dd-mm-yyyy hh:mm:ss' format
        devicestatusflag: PropTypes.number, // Device status flag (optional)
        devicestatusnameflag: PropTypes.string, // Device status name (optional)
    }).isRequired,
};

export default ResultBus;