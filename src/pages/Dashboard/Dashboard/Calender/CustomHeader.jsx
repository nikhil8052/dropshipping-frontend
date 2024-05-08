const CustomHeader = ({ label, date }) => {
    const todayDate = date.getDate();
    return (
        <div className="rbc-header">
            <div className="rbc-row">
                <div className="rbc-header-label">
                    {label} {todayDate}{' '}
                </div>
            </div>
        </div>
    );
};
export default CustomHeader;
