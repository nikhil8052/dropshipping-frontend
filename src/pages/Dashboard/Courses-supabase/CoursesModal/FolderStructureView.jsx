import Drop from '../../../../assets/images/droparrow.png';
import { useState } from 'react';

const FolderStructureView = ({ topics, unassignedLectures, onLectureSelect }) => {
    const [expandedFolders, setExpandedFolders] = useState({});
    const [activeLectureId, setActiveLectureId] = useState(null); // Track selected lecture

    const toggleFolder = (folderIndex) => {
        setExpandedFolders(prev => ({
            ...prev,
            [folderIndex]: !prev[folderIndex]
        }));
    };

    const handleLectureClick = (lecture) => {
        setActiveLectureId(lecture.id); // Mark as active
        onLectureSelect(lecture); // Trigger selection handler
    };

    return (
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
                                        className={`lecture-item ${activeLectureId === lecture.id ? 'active_lec' : ''}`}
                                        onClick={() => handleLectureClick(lecture)}
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
                            >
                                {lecture.name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default FolderStructureView;
