import './statcard.scss';

const StatCard = ({ title, value, icon }) => {
    return (
        <>
            {icon ? (
                <div className="stacked-card-wrapper">
                    <div className="stacked-card">
                        <img src={icon} className="stat-icon" alt="stat-icon" />
                        <p className="stat-description">{title}</p>
                    </div>
                    <div className="stat-summary">
                        <p className="stat-value">{value}</p>
                    </div>
                </div>
            ) : (
                <div className="stat-card">
                    <div className="stat-summary">
                        <p className="stat-description">{title}</p>
                        <p className="stat-value">{value}</p>
                    </div>
                </div>
            )}
        </>
    );
};
export default StatCard;
