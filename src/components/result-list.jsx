import PropTypes from 'prop-types';
import ResultBus from './result-bus.jsx';

const ResultList = ({ busDataList }) => {
    return (
        <div className="result-list" >
            <div className="result-list-headers">
                <span className="route-number">Route</span>
                <span className="station-name">Destination</span>
                <span className="bus-number">Reg No.</span>
                <span className="time-arrive">ETA</span>
            </div>
            {busDataList.map((busData, index) => (
                <ResultBus key={index} busData={busData}/>
            ))}
        </div>
    );
};

ResultList.propTypes = {
    busDataList: PropTypes.arrayOf(
        PropTypes.shape({
            routeno: PropTypes.string.isRequired,
            routename: PropTypes.string,
            fromstationname: PropTypes.string,
            tostationname: PropTypes.string.isRequired,
            vehicleid: PropTypes.number,
            busno: PropTypes.string.isRequired,
            arrivaltime: PropTypes.string.isRequired,
            devicestatusflag: PropTypes.number,
            devicestatusnameflag: PropTypes.string,
        })
    ).isRequired,
};

export default ResultList;