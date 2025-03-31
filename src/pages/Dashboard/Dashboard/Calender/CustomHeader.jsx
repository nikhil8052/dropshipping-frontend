import { useIsMediumScreen } from '../../../../utils/mediaQueries';
const CustomHeader = ({ label }) => {
    const isMediumScreen = useIsMediumScreen();
    // Commenting for future refer
    // const todayDate = date.getDate();
    return (
        <div className="rbc-header">
            <div className="rbc-row">
                <div className="rbc-header-label">{isMediumScreen ? label.charAt(0) : label}</div>
            </div>
        </div>
    );
};
export default CustomHeader;
