import { useEffect, useState } from 'react';
import Table from '@components/Table/Table';
import { Button, Col, Container, Row } from 'react-bootstrap';
import ConfirmationBox from '@components/ConfirmationBox/ConfirmationBox';
import { Helmet } from 'react-helmet';
import axiosWrapper from '@utils/api';
import toast from 'react-hot-toast';
import TextExpand from '@components/TextExpand/TextExpand';
import uploadSimple from '@icons/UploadSimpleBack.svg';
import csvExport from '@icons/csv.svg';
import { API_URL } from '../../../../utils/apiUrl';
import ProductDetail from './ProductDetail';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { FileUploader } from 'react-drag-drop-files';
import DateRenderer from '@components/DateFormatter/DateFormatter';
import { useSelector } from 'react-redux';

const fileTypes = ['csv'];

const StudentsTrainingProduct = ({ studentId }) => {
    const token = useSelector((state) => state?.auth?.userToken);
    const [selectedRowId, setSelectedRowId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingCRUD, setLoadingCRUD] = useState(false);
    const [studentsData, setStudentsData] = useState(null);
    const [expanded, setExpanded] = useState(false);
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
        const url = `${API_URL.GET_ALL_PRODUCTS}?${queryParams}${studentId ? `&createdBy=${studentId}` : ''}`;
        const response = await axiosWrapper('get', url, {}, token);
        setStudentsData(response.data);
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

    const toggleExpand = (event) => {
        event.stopPropagation();
        setExpanded(!expanded);
    };
    const handleUploadClick = () => {
        setUploadFileModal(true);
    };

    const handleCloseFileModal = () => {
        setUploadFileModal(false);
    };
    /*eslint-disable */

    const NameRenderer = (props) => (
        <div key={props.data._id}>
            <div className="d-flex align-items-center gap-2">
                {props.data.avatarUrl ? (
                    <img src={props.data.avatarUrl} alt={props.data.productName} className="avatar-image" />
                ) : (
                    <FontAwesomeIcon size="2xl" icon={faCircleUser} color="rgba(200, 202, 216, 1)" />
                )}
                <div
                    style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: expanded ? 'normal' : 'nowrap',
                        cursor: 'pointer'
                    }}
                    onClick={toggleExpand}
                >
                    {props.value}
                </div>
            </div>
        </div>
    );
    /*eslint-disable */

    const columns = [
        {
            headerName: 'Product Name',
            field: 'productName',
            filter: 'agSetColumnFilter',
            sortable: true,
            unSortIcon: true,
            wrapText: true,
            autoHeight: true,
            cellRenderer: NameRenderer,
            resizable: false
        },
        {
            headerName: 'Run Date',
            field: 'runDate',
            filter: 'agSetColumnFilter',
            sortable: true,
            unSortIcon: true,
            wrapText: true,
            autoHeight: true,
            cellRenderer: DateRenderer,
            resizable: false
        },
        {
            headerName: 'BER',
            field: 'ber',
            filter: 'agSetColumnFilter',
            sortable: true,
            unSortIcon: true,
            wrapText: true,
            autoHeight: true,
            cellRenderer: TextExpand,
            resizable: false
        },
        {
            headerName: 'Status',
            field: 'status',
            filter: 'agSetColumnFilter',
            sortable: true,
            unSortIcon: true,
            resizable: false,
            cellRenderer: ({ data: rowData }) => {
                const status = rowData.status;
                return (
                    <div className={`${status} status`} key={rowData._id}>
                        {status}
                    </div>
                );
            }
        },
        {
            headerName: 'Created By',
            field: 'createdBy.name',
            filter: 'agSetColumnFilter',
            sortable: true,
            unSortIcon: true,
            wrapText: true,
            autoHeight: true,
            cellRenderer: TextExpand,
            resizable: false
        }
    ];

    const handleUploadSubmit = async () => {
        setLoadingCRUD(true);
        try {
            const filePath = 'uploads' + file.split('/uploads')[1];
            await axiosWrapper('POST', API_URL.UPLOAD_PRODUCTS_CSV, { filePath }, token);
            setFile(null);
            fetchData();
        } catch (error) {
            toast.error(error);
        } finally {
            setLoadingCRUD(false);
            setUploadFileModal(false);
        }
        setLoadingCRUD(false);
    };

    const handleChange = async (file) => {
        const formData = new FormData();
        formData.append('files', file);
        formData.append('name', file.name);

        const mediaFile = await axiosWrapper('POST', API_URL.UPLOAD_MEDIA, formData, '', true);

        setFile(mediaFile.data[0].path);
    };

    const handleDateChange = ({ target: input }) => {
        setDateFilters((pre) => ({
            ...pre,
            [input.name]: input.value
        }));
    };

    const handleExportProducts = async () => {
        document.getElementById('training-products').click();
    };

    return (
        <div className="students-product-page">
            {selectedRowId ? (
                <>
                    <ProductDetail selectedRowId={selectedRowId} setSelectedRowId={setSelectedRowId} />
                </>
            ) : (
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
                                                    label="hello"
                                                />
                                                <p>
                                                    {file ? (
                                                        `File name: ${file.name || file.split('-')[1]}`
                                                    ) : (
                                                        <span>
                                                            Drag an drop a file or <strong> browse file</strong>
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                        </Col>
                                        <Button className="sample-file-btn">
                                            <FontAwesomeIcon className="me-2" icon={faArrowDown} /> Download Sample File
                                        </Button>
                                    </Row>
                                </Container>
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
                        tableData={studentsData}
                        onRowClicked={handleRowClick}
                        loading={loading}
                        children={
                            <Row className={`mb-3 g-2 ${studentId ? 'justify-content-end' : ''}`}>
                                <Col md={12} lg={6} xl={6} xxl={3}>
                                    <div className=" d-flex justify-content-even align-items-center from-filter ">
                                        <span className="me-2"> From: </span>
                                        <input
                                            value={dateFilters.from}
                                            onChange={handleDateChange}
                                            className="field-control"
                                            type="date"
                                            max={dateFilters.to}
                                            name="from"
                                            id=""
                                        />
                                    </div>
                                </Col>
                                <Col md={12} lg={6} xl={6} xxl={3}>
                                    <div className=" d-flex justify-content-even align-items-center">
                                        <span className="me-2"> To: </span>
                                        <input
                                            value={dateFilters.to}
                                            onChange={handleDateChange}
                                            className="field-control"
                                            type="date"
                                            name="to"
                                            min={dateFilters.from}
                                            id=""
                                        />
                                    </div>
                                </Col>
                                {!studentId && (
                                    <>
                                        <Col md={12} lg={6} xl={6} xxl={3}>
                                            <Button className="add-button w-100" onClick={handleExportProducts}>
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
                        exportFileName="training-products"
                    />
                </>
            )}
        </div>
    );
};

export default StudentsTrainingProduct;
