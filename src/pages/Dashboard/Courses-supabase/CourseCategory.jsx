import { useEffect, useState } from 'react';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axiosWrapper from '../../../utils/api';
import { API_URL } from '../../../utils/apiUrl';

const CourseCategory = ({ value = [], onChange, token }) => {
  const [allCategories, setAllCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCategoryList, setShowCategoryList] = useState(false);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className='category_details'>
      <label htmlFor="">Course Category</label>
      <div className={`main-Category ${showCategoryList ? 'active' : ''}`}>
        {/* Selected Categories */}
        <div>
          <div
            className='slect-input'
            onClick={() => setShowCategoryList(!showCategoryList)}
          >
            {value.length > 0 ? (
              value.map((cat) => (
                <span key={cat.value} className='slect_span selected'>
                  {cat.label}
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
                      className='custom_check'
                      key={category.value}
                      style={{ display: 'block', marginBottom: '5px' }}
                    >
                      <input
                        type="checkbox"
                        checked={value.some(cat => cat.value === category.value)}
                        onChange={(e) => handleCheckboxChange(e, category.value)}
                      />
                      <div className='custom_ckeck_wrap'>
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
  );
};

export default CourseCategory;