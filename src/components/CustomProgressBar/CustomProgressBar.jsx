import './ProgressBar.scss';

const CustomProgressBar = ({ progress }) => {
    return (
        <div className="progress-bar-container">
            <div
                className="progress-bar-fill"
                style={{
                    '--progress': `${progress}%`
                }}
            ></div>
            <div
                className="progress-bar-label"
                // style={{
                //     '--progress': `${progress}%`
                // }}
            >
                {progress}%
            </div>
        </div>
    );
};

export default CustomProgressBar;
