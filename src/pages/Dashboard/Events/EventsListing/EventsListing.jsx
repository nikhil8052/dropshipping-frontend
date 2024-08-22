import { useCallback, useEffect, useState } from 'react';
import { Col, Dropdown, Form, InputGroup, Row } from 'react-bootstrap';
import Search from '@icons/Search.svg';
import MeetingCard from '@components/MeetingCard/MeetingCard';
import Pagination from '@components/Pagination/Pagination';
import { useNavigate } from 'react-router-dom';
import downArrow from '@icons/down-arrow.svg';
import axiosWrapper from '@utils/api';
import * as types from '../../../../redux/actions/actionTypes';
import { API_URL } from '@utils/apiUrl';
import Loading from '@components/Loading/Loading';
import '../../../../styles/Events.scss';
import '../../../../styles/Common.scss';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from '../../../../utils/common';

const EventsListing = () => {
    const options = ['All Events', 'Upcoming Events', 'Past Events'];
    const [currentPage, setCurrentPage] = useState(1);
    const [eventsData, setEventsData] = useState([]);
    const token = useSelector((state) => state?.auth?.userToken);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const allListingsChange = useSelector((state) => state.root.allListingsChange);

    const [querySearch, setQuerySearch] = useState({
        dateTime: 'All Events',
        search: '',
        page: 1,
        limit: 6
    });

    const handleOptionChange = (option) => {
        setQuerySearch((prev) => ({ ...prev, dateTime: option }));
        setCurrentPage(1);
        dispatch({ type: types.ALL_RECORDS, data: { keyOfData: 'allListingsChange', data: true } });
    };

    const itemsPerPage = 6;

    const totalPages = Math.ceil(eventsData.length / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    // Get current items for the current page
    const currentItems = eventsData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) || [];

    const handleCardClick = (eventId) => {
        navigate('/student/events/detail', { state: { eventId } });
    };

    useEffect(() => {
        fetchData(querySearch, currentPage);
    }, [currentPage]);

    useEffect(() => {
        if (allListingsChange) {
            fetchData(querySearch);
        }
    }, [allListingsChange]);

    ////////////////// Handlers ////////////////////
    const fetchData = async (query, page = 1) => {
        const searchParams = new URLSearchParams();
        searchParams.append('page', page);
        for (const key in query) {
            if (query[key] !== '') {
                searchParams.append(key, query[key]);
            }
        }
        try {
            setLoading(true);
            const response = await axiosWrapper(
                'GET',
                `${API_URL.GET_ALL_EVENTS_FOR_STUDENT}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`,
                {},
                token
            );
            const events = response?.data?.data;
            setEventsData(events);
            setLoading(false);
            dispatch({ type: types.ALL_RECORDS, data: { keyOfData: 'allListingsChange', data: false } });
        } catch (error) {
            return;
        } finally {
            setLoading(false);
        }
    };

    const debouncedSearch = useCallback(
        debounce(() => {
            dispatch({ type: types.ALL_RECORDS, data: { keyOfData: 'allListingsChange', data: true } });
        }, 500),
        []
    );
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        const copyQuerySearch = { ...querySearch };
        copyQuerySearch[name] = value;
        setQuerySearch(copyQuerySearch);
        if (name === 'search') {
            debouncedSearch();
        } else {
            dispatch({ type: types.ALL_RECORDS, data: { keyOfData: 'allListingsChange', data: true } });
        }
    };

    return (
        <div className="events-listing-wrapper">
            {loading ? (
                <Loading centered={true} />
            ) : (
                <>
                    <Row className="mb-3 justify-content-between">
                        <Col lg={4}>
                            <InputGroup>
                                <InputGroup.Text>
                                    <img src={Search} alt="Search" />
                                </InputGroup.Text>
                                <Form.Control
                                    className="search-input"
                                    type="text"
                                    name="search"
                                    label="Search"
                                    value={querySearch.search}
                                    onChange={handleInputChange}
                                    placeholder="Search"
                                    autoFocus
                                />
                            </InputGroup>
                        </Col>
                        <Col lg={4}>
                            <div className="d-flex justify-content-end">
                                <Dropdown className="dropdown-button-fix ms-3 responsive-btn">
                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                        <span className="me-2">{querySearch.dateTime}</span>
                                        <img src={downArrow} alt="Down arrow" />
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        {options.map((option) => (
                                            <Dropdown.Item
                                                key={option}
                                                onClick={() => handleOptionChange(option)}
                                                eventKey={option}
                                            >
                                                <span className="event-name">{option}</span>
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </Col>
                    </Row>
                    {eventsData.length === 0 ? (
                        <div className="no-data-wrapper">No Data Found.</div>
                    ) : (
                        <>
                            <Row>
                                {currentItems.map((meeting) => (
                                    <Col
                                        key={meeting._id || meeting.id}
                                        xs={12}
                                        sm={6}
                                        md={12}
                                        lg={6}
                                        xl={4}
                                        className="mb-4"
                                    >
                                        <MeetingCard
                                            isClickable={true}
                                            meeting={meeting}
                                            handleCardClick={handleCardClick}
                                        />
                                    </Col>
                                ))}
                            </Row>
                            {/* Pagination */}
                            <div className="d-flex justify-content-end">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default EventsListing;
