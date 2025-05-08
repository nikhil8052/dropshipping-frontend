import Drop from '../../../assets/images/droparrow.png';
import { useState, useEffect } from 'react';
import checkicon from '../../../assets/images/Check.svg';
import checkicon2 from '../../../assets/images/check2.svg';
import { Tooltip } from 'react-tooltip';

const EnrollFolderStructure = ({ 
  topics, 
  unassignedLectures, 
  filteredLectures,
  onLectureSelect, 
  selectedLectureId,  // Prop that tracks the currently selected lecture
  userInfo,
  markLectureAsCompleted,
  accessRestricted
}) => {
    const [expandedFolders, setExpandedFolders] = useState({});

    // Open all folders by default on initial load
    useEffect(() => {
        const initialExpanded = {};
        topics.forEach((_, index) => {
            initialExpanded[index] = true;
        });
        setExpandedFolders(initialExpanded);

        // Automatically select the first lecture only if no lecture has been selected yet
        if (!selectedLectureId) {
            const firstLecture = topics.length > 0 && topics[0].lectures.length > 0 
                ? topics[0].lectures[0] 
                : unassignedLectures[0];

            if (firstLecture) {
                console.log('firstLecture',firstLecture)
                onLectureSelect(firstLecture);  // Notify parent about the first selection
            }
        }
    }, [topics, unassignedLectures, onLectureSelect, selectedLectureId]);

    const toggleFolder = (folderIndex) => {
        setExpandedFolders(prev => ({
            ...prev,
            [folderIndex]: !prev[folderIndex]
        }));
    };

    const isLectureAccessible = (lectureIndex) => {
        if (accessRestricted) return false;
        if (lectureIndex === 0) return true;
        
        const prevLecture = filteredLectures[lectureIndex - 1];
        return prevLecture?.completedBy?.includes(userInfo?.id) || 
               !filteredLectures[lectureIndex]?.quiz?.mcqs?.length;
    };

    return (
        <div className="admin-left-sec">
            <div className="course-left">
                {topics.map((topic, topicIndex) => (
                    <div className="folder-detail" key={topic.id}>
                        <div className="drop-box" onClick={() => toggleFolder(topicIndex)}>
                            <h3>{topic.name}</h3>
                            <div className={`folder-dropdown ${expandedFolders[topicIndex] ? 'rotated' : ''}`}>
                                <img src={Drop} alt="toggle" />
                            </div>
                        </div>

                        {expandedFolders[topicIndex] && (
                            <div className="detail-box">
                                <ul>
                                    {topic.lectures.map(lecture => {
                                        const lectureIndex = filteredLectures.findIndex(l => l.id === lecture.id);
                                        return (
                                            <li
                                                key={lecture.id}
                                                className={`lecture-item ${lecture.id === selectedLectureId ? 'active_lecture' : ''}`}
                                                onClick={() => onLectureSelect(lecture)}
                                                style={{ 
                                                    cursor: isLectureAccessible(lectureIndex) ? 'pointer' : 'not-allowed',
                                                    opacity: isLectureAccessible(lectureIndex) ? 1 : 0.6
                                                }}
                                            >
                                                {lecture.name}
                                                {lecture.lecture_progress[0]?.is_completed ? (
                                                    <img className='checkimg' src={checkicon} alt="Completed"
                                                        data-tooltip-id="my-tooltip2" 
                                                        data-tooltip-content="Already completed"/>
                                                ) : null}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        )}
                    </div>
                ))}

                {unassignedLectures.length > 0 && (
                    <div className="detail-box">
                        <ul>
                            {unassignedLectures.map(lecture => {
                                const lectureIndex = filteredLectures.findIndex(l => l.id === lecture.id);
                                return (
                                    <li
                                        key={lecture.id}
                                        className={`lecture-item ${lecture.id === selectedLectureId ? 'active_lecture' : ''}`}
                                        onClick={() => onLectureSelect(lecture)}
                                        style={{ 
                                            cursor: isLectureAccessible(lectureIndex) ? 'pointer' : 'not-allowed',
                                            opacity: isLectureAccessible(lectureIndex) ? 1 : 0.6
                                        }}
                                    >
                                        {lecture.name}
                                        {lecture.lecture_progress[0]?.is_completed ? (
                                            <img className='checkimg' src={checkicon} alt="Completed"
                                                data-tooltip-id="my-tooltip2" 
                                                data-tooltip-content="Already completed"/>
                                        ) : null}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
                <Tooltip id="my-tooltip2" />
            </div>
        </div>
    );
};

export default EnrollFolderStructure;
