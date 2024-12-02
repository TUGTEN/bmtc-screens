import { useState } from 'react';
import PropTypes from 'prop-types';
import ResultList from './result-list.jsx';
import platformIcon from '../assets/images/signpost.svg';

const ResultPlatform = ({ name, busDataList }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="result-platform">
            <div
                className="platform-bar"
                onClick={() => {setIsExpanded(!isExpanded)}}>
                <img className="icon24" src={platformIcon} alt='platform icon' />
                {name}
            </div>
            {isExpanded && <ResultList busDataList={busDataList} />}
        </div>
    );
};

ResultPlatform.propTypes = {
    name: PropTypes.string.isRequired,
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

export default ResultPlatform;
