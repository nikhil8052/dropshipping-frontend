import { useSelector } from 'react-redux';

const Roadmap = () => {
    const { userInfo } = useSelector((state) => state?.auth);
    const roadMap = userInfo?.roadMap;
    return (
        <div className="roadmap-wrapper">
            {roadMap && roadMap === 'ROAD_MAP_ONE' ? (
                <iframe
                    style={{ border: '1px solid rgba(0, 0, 0, 0.1)', height: '100vh', width: '100%' }}
                    src="https://embed.figma.com/proto/meQPbSNlGpyYkPRM7MxXWA/DSAX-Roadmap-2.0?node-id=133-1490&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=111%3A940&show-proto-sidebar=0&embed-host=share"
                    allowFullScreen
                ></iframe>
            ) : (
                <iframe
                    style={{ border: '1px solid rgba(0, 0, 0, 0.1)', height: '100vh', width: '100%' }}
                    src="https://embed.figma.com/proto/meQPbSNlGpyYkPRM7MxXWA/DSAX-Roadmap-2.0?node-id=133-1490&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=111%3A940&show-proto-sidebar=0&embed-host=share"
                    allowFullScreen
                ></iframe>
            )}
        </div>
    );
};

export default Roadmap;
