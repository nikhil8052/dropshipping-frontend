import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import PropTypes from 'prop-types';

const SemiCircularProgressBar = (props) => {
    return (
        <>
            <CircularProgressbar
                value={props.value}
                text={`${props.value}%`}
                circleRatio={0.5}
                styles={buildStyles({
                    rotation: -0.25,
                    trailColor: 'rgba(227, 245, 255, 1)',
                    pathColor: 'url(#gradient)',
                    textSize: '16px',
                    textColor: 'rgba(19, 19, 19, 1)'
                })}
            />
            <svg style={{ height: 0 }}>
                <defs>
                    <linearGradient id="gradient" gradientTransform="rotate(90)">
                        <stop offset="0%" stopColor="#00c7cc" />
                        <stop offset="100%" stopColor="#009cd8" />
                    </linearGradient>
                </defs>
            </svg>
        </>
    );
};

SemiCircularProgressBar.propTypes = {
    value: PropTypes.number.isRequired
};

export default SemiCircularProgressBar;
