import './statcard.scss';

const StatCard = ({ title, value }) => {
    return (
        <div className="stat-card">
            <div className="stat-summary">
                <p className="stat-description">{title}</p>
                <p className="stat-value">{value}</p>
            </div>
        </div>
    );
};
export default StatCard;
