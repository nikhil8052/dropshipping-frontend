import './Pagination.scss';

const Pagination = ({ currentPage, totalPages, onPageChange, customClass = '' }) => {
    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className={`pagination-custom ${customClass}`}>
            <button
                className={`page-button ${currentPage === 1 ? 'disabled' : ''}`}
                onClick={handlePrevious}
                disabled={currentPage === 1}
                type="button"
            >
                &lt;
            </button>
            <div className="page-info">
                Page {currentPage} of {totalPages}
            </div>
            <button
                className={`page-button ${currentPage === totalPages ? 'disabled' : ''}`}
                onClick={handleNext}
                disabled={currentPage === totalPages}
                type="button"
            >
                &gt;
            </button>
        </div>
    );
};

export default Pagination;
