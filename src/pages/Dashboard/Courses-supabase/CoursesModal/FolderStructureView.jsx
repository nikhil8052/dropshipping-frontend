import Drop from '../../../../assets/images/droparrow.png';
import { useState, useEffect } from 'react';

const FolderStructureView = ({ topics, unassignedLectures, onLectureSelect ,selectedLectureId }) => {
    const [expandedFolders, setExpandedFolders] = useState({});
    const [activeLectureId, setActiveLectureId] = useState(null);
    const [activeLectureIdFirst, setActiveLectureIdFirst] = useState(false);

    // Open all folders by default on initial load
    useEffect(() => {
        const initialExpanded = {};
        topics.forEach((_, index) => {
            initialExpanded[index] = true;
        });
        setExpandedFolders(initialExpanded);

        if(!activeLectureIdFirst){
            if (topics.length > 0 && topics[0].lectures.length > 0) {
                setActiveLectureId(topics[0].lectures[0].id);
                onLectureSelect(topics[0].lectures[0]); 
                setActiveLectureIdFirst(true);

            } 
            else if (unassignedLectures.length > 0) {
                console.log(unassignedLectures.length);
                setActiveLectureId(unassignedLectures[0].id);
                onLectureSelect(unassignedLectures[0]);
                setActiveLectureIdFirst(true);

            }
        }
    }, [topics, unassignedLectures, onLectureSelect]);

    const toggleFolder = (folderIndex) => {
        setExpandedFolders(prev => ({
            ...prev,
            [folderIndex]: !prev[folderIndex]
        }));
    };

    const handleLectureClick = (lecture) => {
        setActiveLectureId(lecture.id);
        onLectureSelect(lecture);
    };

    return (
        <div className="admin-left-sec">
        <div className="course-left">
            {topics.map((topic, topicIndex) => (
                <div className="folder-detail" key={topic.id}>
                    <div
                        className="drop-box"
                        style={{ cursor: 'pointer' }}
                        onClick={() => toggleFolder(topicIndex)}
                    >
                        <h3>{topic.name}</h3>
                        <div className={`folder-dropdown ${expandedFolders[topicIndex] ? 'open rotated' : ''}`}>
                            <img src={Drop} alt="" />
                        </div>
                    </div>

                    {expandedFolders[topicIndex] && (
                        <div className="detail-box">
                            <ul>
                                {topic.lectures.map(lecture => (
                                    <li
                                        key={lecture.id}
                                        className={`lecture-item ${activeLectureId === lecture.id ? 'active_lecture' : ''}`}
                                        onClick={() => handleLectureClick(lecture)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {lecture.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ))}

            {unassignedLectures.length > 0 && (
                <div className="detail-box">
                    <ul>
                        {unassignedLectures.map(lecture => (
                            <li
                                key={lecture.id}
                                className={`lecture-item ${activeLectureId === lecture.id ? 'active_lecture' : ''}`}
                                onClick={() => handleLectureClick(lecture)}
                                style={{ cursor: 'pointer' }}
                            >
                                {lecture.name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
        </div>
    );
};

export default FolderStructureView;
