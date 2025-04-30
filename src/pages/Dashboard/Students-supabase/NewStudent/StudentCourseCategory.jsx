import { useEffect, useState } from 'react';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axiosWrapper from '../../../../utils/api';
import { API_URL } from '../../../../utils/apiUrl';
import ConfirmationBox from '@components/ConfirmationBox/ConfirmationBox';
import Loading from '@components/Loading/Loading';
import { Button, Row, Col, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import TextField from '@mui/material/TextField';

const CourseCategory = ({ value = [], onChange, token }) => {
    const { userInfo, userToken } = useSelector((state) => state?.auth);
    const role = userInfo?.role?.toLowerCase();
    const [allCategories, setAllCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCategoryList, setShowCategoryList] = useState(false);
    const [loading, setLoading] = useState(false);
    // New state for category creation modal
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);
    useEffect(() => {
        getAllCategories();
    }, []);

    const getAllCategories = async () => {
        try {
            setLoading(true);
            const response = await axiosWrapper('GET', `${API_URL.SUPABASE_GET_ALL_CATEGORIES}`, {}, token);
            const mapped = response?.data?.map((cat) => ({
                label: cat.name,
                value: cat.id
            }));
            setAllCategories(mapped);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCategories = allCategories.filter((cat) =>
        cat.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getCategoryLabel = (id) => {
        const match = allCategories.find((cat) => cat.value === id);
        return match ? match.label : id;
    };

    const handleCheckboxChange = (e, categoryValue) => {
        const updated = e.target.checked
            ? [...value, { label: getCategoryLabel(categoryValue), value: categoryValue }]
            : value.filter((val) => val.value !== categoryValue);
        onChange(updated);
    };

    const createCategory = async (categoryName) => {
        try {
            const response = await axiosWrapper(
                'POST',
                `${API_URL.SUPABASE_CREATE_CATEGORY}`,
                { name: categoryName, createdBy: userInfo?._id },
                userToken
            );

            const createdCategory = response?.data;
            return {
                label: createdCategory.name,
                value: createdCategory.id
            };
        } catch (error) {
            return null;
        }
    };

    const handleAddNewCategory = async () => {
        if (!newCategoryName.trim()) return;

        setIsCreatingCategory(true);
        try {
            const newCategory = await createCategory(newCategoryName);
            if (newCategory) {
                setAllCategories((prev) => [...prev, newCategory]);
                setShowCategoryModal(false);
                setNewCategoryName('');
            }
        } catch (error) {
            console.error('Error creating category:', error);
        } finally {
            setIsCreatingCategory(false);
        }
    };
    return (
        <>
            <div className="category_details">
                {/* <label htmlFor="">Course Category</label> */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ marginBottom: '5px', fontWeight: '500' }}>Course Category</label>
                    {/* <Button
                        variant="text-dark"
                        className="nwcat"
                        size="sm"
                        style={{ padding: 0 }}
                        onClick={() => setShowCategoryModal(true)}
                    >
                        + New Category
                    </Button> */}
                </div>
                <div className={`main-Category ${showCategoryList ? 'active' : ''}`}>
                    {/* Selected Categories */}
                    <div>
                        <div className="slect-input" onClick={() => setShowCategoryList(!showCategoryList)}>
                            {value.length > 0 ? (
                                value.map((cat) => (
                                    <span key={cat.value} className="slect_span selected">
                                        {cat.label}
                                    </span>
                                ))
                            ) : (
                                <span className="slect_span">Choose your courses</span>
                            )}
                            <div className="down-icon">
                                <FontAwesomeIcon icon={faChevronDown} className="down-arrow-icon" />
                            </div>
                        </div>
                    </div>

                    {/* Toggle Area */}
                    {showCategoryList && (
                        <>
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="category-search"
                            />

                            <div className="select-label">
                                {loading ? (
                                    <div>Loading categories...</div>
                                ) : (
                                    <>
                                        {filteredCategories.map((category) => (
                                            <label
                                                className="custom_check"
                                                key={category.value}
                                                style={{ display: 'block', marginBottom: '5px' }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={value.some((cat) => cat.value === category.value)}
                                                    onChange={(e) => handleCheckboxChange(e, category.value)}
                                                />
                                                <div className="custom_ckeck_wrap">
                                                    <span></span> {category.label}
                                                </div>
                                            </label>
                                        ))}
                                        {filteredCategories.length === 0 && (
                                            <div style={{ color: 'gray' }}>No categories found</div>
                                        )}
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
            {/* Add New Category Modal */}
            <Modal show={showCategoryModal} onHide={() => setShowCategoryModal(false)} centered className="coursemodal">
                <Modal.Header closeButton>
                    <Modal.Title>Add New Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="add-course-form Course-form" style={{ paddingTop: '0px' }}>
                        <div className="form-group">
                            {/* <label>Category Name</label> */}
                            {/* <input
                                type="text"
                                className="field-control my-3 white-important-bg"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                            />
                            <span>Category Name</span>
                        </label>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="text-black cancel-btn" onClick={() => setShowCategoryModal(false)}>
                        Cancel
                    </Button>
                                placeholder="Enter category name"
                            /> */}
                            <TextField
                                name="newCategoryName"
                                label="Category Name"
                                className="field-control white-important-bg"
                                variant="outlined"
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="category name"
                                inputProps={{ maxLength: 80 }}
                                helperText={`${newCategoryName.length || 0}/80`}
                                fullWidth
                            />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="cancel-btn" onClick={() => setShowCategoryModal(false)}>
                        Cancel
                    </Button>

                    <Button
                        className="submit-btn"
                        onClick={handleAddNewCategory}
                        disabled={!newCategoryName.trim() || isCreatingCategory}
                    >
                        {isCreatingCategory ? 'Creating...' : 'Create Category'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default CourseCategory;
