import Drop from '../../../../assets/images/droparrow.png';
import { useState } from 'react';

const FolderStructureView = ({ topics, unassignedLectures, onLectureSelect }) => {
    const [expandedFolders, setExpandedFolders] = useState({});
  
    const toggleFolder = (folderIndex) => {
      setExpandedFolders(prev => ({
        ...prev,
        [folderIndex]: !prev[folderIndex]
      }));
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
                    className="lecture-item"
                    onClick={() => onLectureSelect(lecture)}
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
                  className="lecture-item"
                  onClick={() => onLectureSelect(lecture)}
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
