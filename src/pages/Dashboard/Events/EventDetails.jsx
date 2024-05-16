// import { useEffect, useRef, useState } from 'react';
import CaretRight from '@icons/CaretRight.svg';
import 'react-quill/dist/quill.snow.css';
import Card from '@components/Card/Card';
import LinkIcon from '@icons/link.svg';
import DummyProfileIcon from '@icons/dummy-profile-icon.svg';
import dotOptions from '@icons/dot-options.svg';
import { trimLongText } from '../../../utils/common';

import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const EventDetails = () => {
    const { userInfo } = useSelector((state) => state?.auth);
    const role = userInfo?.role;
    const location = useLocation();
    const eventId = location.state?.eventId;
    const navigate = useNavigate();
    const images = [
        'https://randomuser.me/api/portraits/men/1.jpg',
        'https://randomuser.me/api/portraits/men/1.jpg',
        'https://randomuser.me/api/portraits/men/1.jpg',
        'https://randomuser.me/api/portraits/men/1.jpg',
        'https://randomuser.me/api/portraits/men/1.jpg'
    ];

    return (
        <div className="event-details-section">
            <div className="new-coach-page-wrapper">
                <div className="title-top">
                    <span onClick={() => navigate(`/${role}/events`)} style={{ cursor: 'pointer' }}>
                        Events <img src={CaretRight} alt=">" />
                    </span>{' '}
                    {eventId ? 'Event Details' : 'Create New Event'}
                </div>
                <Card cardType="large">
                    <div className="event-detail-top">
                        <div className="card-profile-img">
                            {/* <img src={CaretRight} alt="" /> */}
                            AG
                        </div>
                        <div className="meeting-details">
                            <h1>Ada Guyen(Coach)</h1>
                            <h2>Meeting ID : 226326</h2>
                            <p>Password : 4K22MJ7</p>
                        </div>
                    </div>
                    <div className="meeting-detail-body ">
                        <h1>
                            Topic: <span>Detailed meeting about the new course description, their time frame.</span>
                        </h1>
                        <div className="time-detail">
                            <h1>
                                Date & Time: <span>Feb 2, 2024 19:28 </span>
                            </h1>
                            <p>Central Standard Time (GMT-6)</p>
                        </div>
                    </div>
                    <div className="main-row-meeting-link">
                        <div className="icon-stack d-dflex">
                            {images.slice(0, 4).map((image, index) => (
                                <img
                                    key={index}
                                    src={'https://randomuser.me/api/portraits/men/1.jpg'}
                                    alt={`Profile ${index + 1}`}
                                    className="profile-icon"
                                />
                            ))}
                            <div className="profile-icon">
                                <p className="total mt-2"> +{Math.max(0, images.length - 4)}</p>
                            </div>
                        </div>
                        <div className="meeting-link ">
                            <img src={LinkIcon} alt="pinn" />
                            <a href="_blank">
                                {trimLongText(
                                    ' https://www.google.com/url?q=https://zoom.us/j/97697547647?pwd%3DUytOUjFlUTlPRjYvbmJnQ0pvZ2RDU/',
                                    100
                                )}
                            </a>
                        </div>
                        <div className="personal-meeting-btn d-flex">
                            <div className="d-flex profile-icon">
                                <img src={DummyProfileIcon} alt="icon" />
                                <div>
                                    <h1>Ada Guyen</h1>
                                    <p>Host</p>
                                </div>
                            </div>

                            <img src={dotOptions} alt="dotOptions" className="dotOptions" />
                        </div>
                    </div>
                    <div className="event-detail-footer">
                        <button type="button" className="edit" onClick={() => navigate(`/${role}/events/edit`)}>
                            Edit
                        </button>
                        <button type="button" className="join">
                            Join Meeting
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default EventDetails;
