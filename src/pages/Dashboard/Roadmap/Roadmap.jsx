import { useSelector } from 'react-redux';

const Roadmap = () => {
    const { userInfo } = useSelector((state) => state?.auth);
    const roadMap = userInfo?.roadMap;
    return (
        <div>
            {roadMap && roadMap === 'ROAD_MAP_ONE' ? (
                <iframe
                    style={{ border: '1px solid rgba(0, 0, 0, 0.1)', height: '100vh' }}
                    width="100%"
                    src="https://embed.figma.com/proto/01uoPVBv0iiDkEUqLCbQ0m/DSAX-Roadmap?node-id=54618-8529&scaling=min-zoom&content-scaling=fixed&page-id=54618%3A8526&embed-host=share"
                    allowFullScreen
                ></iframe>
            ) : (
                <iframe
                    style={{ border: '1px solid rgba(0, 0, 0, 0.1)', height: '100vh' }}
                    width="100%"
                    src="https://embed.figma.com/proto/01uoPVBv0iiDkEUqLCbQ0m/DSAX-Roadmap?node-id=54618-8529&scaling=min-zoom&content-scaling=fixed&page-id=54618%3A8526&embed-host=share"
                    allowFullScreen
                ></iframe>
            )}
        </div>
    );
};

export default Roadmap;
