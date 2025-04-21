import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import axiosWrapper from '../../../utils/api';
import { API_URL } from '../../../utils/apiUrl';
import { useSelector } from 'react-redux';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SearchIcon from '../../../assets/images/search.png'


const CourseCategory = () => {
  const { userToken } = useSelector((state) => state?.auth);
  const [allCategories, setAllCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCategoryList, setShowCategoryList] = useState(false);

  const schema = Yup.object({
    category: Yup.array().min(1, 'Please select at least one category'),
  });

  useEffect(() => {
    getAllCategories();
  }, []);

  const getAllCategories = async () => {
    try {
      const response = await axiosWrapper('GET', `${API_URL.GET_ALL_CATEGORIES}`, {}, userToken);
      const mapped = response?.data?.map((cat) => ({
        label: cat.name,
        value: cat._id,
      }));
      setAllCategories(mapped);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredCategories = allCategories.filter((cat) =>
    cat.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryLabel = (id) => {
    const match = allCategories.find((cat) => cat.value === id);
    return match ? match.label : id;
  };

  return (
    <Formik
      initialValues={{ category: [] }}
      validationSchema={schema}
      onSubmit={(values) => {
        console.log('Selected category IDs:', values.category);
      }}
    >
      {({ values, setFieldValue }) => {
        const isAnySelected = values.category.length > 0;

        const handleCheckboxChange = (e, value) => {
          const updated = e.target.checked
            ? [...values.category, value]
            : values.category.filter((val) => val !== value);
          setFieldValue('category', updated);
        };

        return (
          <Form className='category_details'>
            {/* Label */}
            <label htmlFor="">Course Category</label>

            <div className={`main-Category ${showCategoryList ? 'active' : ''}`}>
              {/* Selected Categories */}
              <div>
                <div
                  className='slect-input'
                  onClick={() => setShowCategoryList(!showCategoryList)}
                >
                  {isAnySelected ? (
                    values.category.map((id) => (
                      <span key={id} className={`slect_span ${isAnySelected ? 'selected' : ''}`}>
                        {getCategoryLabel(id)}
                      </span>
                    ))
                  ) : (
                    <span className='slect_span'>Choose your courses</span>

                  )}
                   <div className='down-icon'>
                  <FontAwesomeIcon icon={faChevronDown} className="down-arrow-icon" />
                </div>
                </div>
               
              </div>

              {/* Toggle Area */}
              {showCategoryList && (
                <>
                <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <img src={SearchIcon} alt="" />
                </div>
                  <div>
                    <div className='select-label'>
                      {filteredCategories.map((category) => (
                        <label
                          className='custom_check'
                          key={category.value}
                          style={{ display: 'block', marginBottom: '5px' }}
                        >
                          <input
                            type="checkbox"
                            value={category.value}
                            checked={values.category.includes(category.value)}
                            onChange={(e) => handleCheckboxChange(e, category.value)}
                          />
                          <div className='custom_ckeck_wrap'>
                            <span></span> {category.label}
                          </div>
                        </label>
                      ))}
                    </div>

                    {filteredCategories.length === 0 && (
                      <div style={{ color: 'gray' }}>No categories found</div>
                    )}
                  </div>
                </>
              )}
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default CourseCategory;
