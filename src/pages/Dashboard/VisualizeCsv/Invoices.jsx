import { useEffect, useState } from 'react';
import Table from '@components/Table/Table';
import { Button, Col, Container, Row } from 'react-bootstrap';
import ConfirmationBox from '@components/ConfirmationBox/ConfirmationBox';
import { Helmet } from 'react-helmet';
import TextExpand from '@components/TextExpand/TextExpand';
import uploadSimple from '@icons/UploadSimpleBack.svg';
import csvExport from '@icons/csv.svg';
import { API_URL } from '../../../utils/apiUrl';
import DateRenderer from '@components/DateFormatter/DateFormatter';
import { FileUploader } from 'react-drag-drop-files';
import axiosWrapper from '@utils/api';
import { useSelector } from 'react-redux';
const fileTypes = ['csv'];

const Invoices = ({ studentId }) => {
    const token = useSelector((state) => state?.auth?.userToken);
    const [selectedRowId, setSelectedRowId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingCRUD, setLoadingCRUD] = useState(false);
    const [invoicesData, setInvoicesData] = useState(null);
    const [uploadFileModal, setUploadFileModal] = useState(false);
    const [file, setFile] = useState(null);
    const [dateFilters, setDateFilters] = useState({
        from: '',
        to: ''
    });

    useEffect(() => {
        // Fetch data from API here
        fetchData();
    }, [dateFilters, studentId]);

    const fetchData = async () => {
        setLoading(true);
        const queryParams = new URLSearchParams(dateFilters).toString();
        const url = `${API_URL.GET_ALL_INVOICES}?${queryParams}${studentId ? `&createdBy=${studentId}` : ''}`;
        const response = await axiosWrapper('get', url, {}, token);
        setInvoicesData(response.data);
        setLoading(false);
    };

    const handleRowClick = (event) => {
        // Handle row click event here
        if (selectedRowId === event.data._id) {
            setSelectedRowId(null);
            return;
        }
        setSelectedRowId(event.data._id);
    };

    const handleCloseFileModal = () => {
        setUploadFileModal(false);
    };

    const handleUploadClick = () => {
        setUploadFileModal(true);
    };

    /*eslint-disable */
    const columns = [
        {
            headerName: 'Date',
            field: 'date',
            filter: 'agSetColumnFilter',
            sortable: true,
            unSortIcon: true,
            wrapText: true,
            autoHeight: true,
            resizable: false,
            cellRenderer: DateRenderer
        },
        {
            headerName: 'Amount',
            field: 'amount',
            filter: 'agSetColumnFilter',
            sortable: true,
            unSortIcon: true,
            wrapText: true,
            autoHeight: true,
            resizable: false,
            cellRenderer: TextExpand
        },
        {
            headerName: 'Category',
            field: 'category',
            filter: 'agSetColumnFilter',
            sortable: true,
            unSortIcon: true,
            wrapText: true,
            autoHeight: true,
            resizable: false,
            cellRenderer: TextExpand
        },
        {
            headerName: 'Business',
            field: 'business',
            filter: 'agSetColumnFilter',
            sortable: true,
            unSortIcon: true,
            wrapText: true,
            autoHeight: true,
            resizable: false,
            cellRenderer: TextExpand
        },
        {
            headerName: 'Facture',
            field: 'facture',
            filter: 'agSetColumnFilter',
            sortable: true,
            unSortIcon: true,
            wrapText: true,
            autoHeight: true,
            resizable: false,
            cellRenderer: TextExpand
        },
        {
            headerName: 'Notes',
            field: 'notes',
            filter: 'agSetColumnFilter',
            sortable: true,
            unSortIcon: true,
            wrapText: true,
            autoHeight: true,
            resizable: false,
            cellRenderer: TextExpand
        }
    ];

    const handleUploadSubmit = async () => {
        setLoadingCRUD(true);
        try {
            const filePath = 'uploads' + file.split('/uploads')[1];
            await axiosWrapper('POST', API_URL.UPLOAD_INVOICES_CSV, { filePath }, token);
            fetchData();
        } catch (error) {
        } finally {
            setLoadingCRUD(false);
            setUploadFileModal(false);
        }
    };

    const handleChange = async (file) => {
        const formData = new FormData();
        formData.append('files', file);
        formData.append('name', file.name);

        const mediaFile = await axiosWrapper('POST', API_URL.UPLOAD_MEDIA, formData, '', true);
        setFile(mediaFile.data[0].path);
    };

    const handleDateChange = ({ target: input }) => {
        setDateFilters((prev) => ({
            ...prev,
            [input.name]: input.value
        }));
    };

    const handleExport = async () => {
        document.getElementById('invoices').click();
    };

    return (
        <div className="students-product-page">
            <>
                <Helmet>
                    <title>Visualize Csv | Dropship Academy</title>
                </Helmet>
                {uploadFileModal && (
                    <ConfirmationBox
                        show={uploadFileModal}
                        onClose={handleCloseFileModal}
                        loading={loadingCRUD}
                        title="Attach File"
                        body={
                            <>
                                <Container className="pt-5">
                                    <Row>
                                        <Col md={12}>
                                            <div className="add-quiz-file">
                                                <h4>Attach File</h4>
                                                <FileUploader
                                                    multiple={false}
                                                    handleChange={handleChange}
                                                    name="file"
                                                    types={fileTypes}
                                                    label="Drag and drop a file or browse"
                                                />
                                                <p>
                                                    {file ? (
                                                        `File name: ${file.name || file.split('-')[1]}`
                                                    ) : (
                                                        <span>
                                                            Drag and drop a file or <strong>browse file</strong>
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                        </Col>
                                    </Row>
                                </Container>
                            </>
                        }
                        onConfirm={handleUploadSubmit}
                        customFooterClass="custom-footer-class"
                        nonActiveBtn="cancel-button"
                        activeBtn="yes-button"
                        activeBtnTitle="Attach File"
                        cancelButtonTitle="Cancel"
                    />
                )}
                <Table
                    columns={columns}
                    inputLgSize={4}
                    childLgSize={8}
                    tableData={invoicesData}
                    onRowClicked={handleRowClick}
                    loading={loading}
                    handleCreateClick
                    children={
                        <Row className={`mb-3 g-2 ${studentId ? 'justify-content-end' : ''}`}>
                            <Col md={12} lg={6} xl={6} xxl={3}>
                                <div className="d-flex justify-content-even align-items-center from-filter">
                                    <span className="me-2">From:</span>
                                    <input
                                        value={dateFilters.from}
                                        onChange={handleDateChange}
                                        className="field-control"
                                        type="date"
                                        max={dateFilters.to}
                                        name="from"
                                    />
                                </div>
                            </Col>
                            <Col md={12} lg={6} xl={6} xxl={3}>
                                <div className="d-flex justify-content-even align-items-center">
                                    <span className="me-2">To:</span>
                                    <input
                                        value={dateFilters.to}
                                        onChange={handleDateChange}
                                        className="field-control"
                                        type="date"
                                        name="to"
                                        min={dateFilters.from}
                                    />
                                </div>
                            </Col>
                            {!studentId && (
                                <>
                                    <Col md={12} lg={6} xl={6} xxl={3}>
                                        <Button className="add-button w-100" onClick={handleExport}>
                                            <span className="me-2">Export</span>
                                            <img src={csvExport} alt="" />
                                        </Button>
                                    </Col>
                                    <Col md={12} lg={6} xl={6} xxl={3}>
                                        <Button className="add-button w-100" onClick={handleUploadClick}>
                                            <span className="me-2">Upload File</span>
                                            <img src={uploadSimple} alt="" />
                                        </Button>
                                    </Col>
                                </>
                            )}
                        </Row>
                    }
                    onExportCsv={true}
                    exportFileName="invoices"
                />
            </>
        </div>
    );
};

export default Invoices;
