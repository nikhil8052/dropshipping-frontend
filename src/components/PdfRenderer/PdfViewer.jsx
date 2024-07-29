import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
import './PdfModal.scss';
import '../../styles/Common.scss';

const PdfModal = ({ file }) => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setPageNumber(1);
    };

    const goToPrevPage = () => setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 1));
    const goToNextPage = () => setPageNumber((prevPageNumber) => Math.min(prevPageNumber + 1, numPages));

    let url;
    if (typeof file === 'object' && file instanceof File) {
        url = URL.createObjectURL(file);
    } else if (typeof file === 'string') {
        url = '' + file;
    }

    return (
        <div className="pdf-viewer">
            <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
                <Page pageNumber={pageNumber} width={800} renderTextLayer={false} renderAnnotationLayer={false} />
            </Document>
            <div className="page-controls">
                <button type="button" onClick={goToPrevPage} disabled={pageNumber <= 1}>
                    Previous
                </button>
                <span>
                    Page {pageNumber} of {numPages}
                </span>
                <button type="button" onClick={goToNextPage} disabled={pageNumber >= numPages}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default PdfModal;
