import { useEffect, useState } from 'react';
import Table from '@components/Table/Table';
import { Button, Col, Container, Row } from 'react-bootstrap';
import ConfirmationBox from '@components/ConfirmationBox/ConfirmationBox';
import { Helmet } from 'react-helmet';
import axiosWrapper from '@utils/api';
import { toast } from 'react-toastify';
import TextExpand from '@components/TextExpand/TextExpand';
import uploadSimple from '@icons/UploadSimpleBack.svg';
import pdfExport from '@icons/picture_as_pdf.svg';
import { invoicesData } from '../../../data/data';
import { FileUploader } from 'react-drag-drop-files';
import DateRenderer from '@components/DateFormatter/DateFormatter';
const fileTypes = ['csv'];

const Invoices = ({ studentId }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingCRUD, setLoadingCRUD] = useState(false);
    const [studentsData, setStudentsData] = useState(null);
    const [expanded, setExpanded] = useState(false);
    const [uploadFileModal, setUploadFileModal] = useState(false);
    const [file, setFile] = useState(null);

    useEffect(() => {
        // Fetch data from API here
        fetchData();
    }, []);

    const fetchData = async () => {
        // Later we will replace this with actual API call
        try {
            setLoading(true);

            setStudentsData(invoicesData);
        } catch (error) {
            return;
        } finally {
            setLoading(false);
        }
    };

    const handleRowClick = (event) => {
        // Handle row click event here
        if (selectedRowId === event.data.id) {
            setSelectedRowId(null);
            return;
        }
        setSelectedRowId(event.data.id);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
    };

    const handleDeleteSubmit = async () => {
        try {
            setLoadingCRUD(true);
            const data = await axiosWrapper(
                'delete',
                `${import.meta.env.VITE_JSONPLACEHOLDER}/posts/${selectedRowId}}`
            );
            toast.success(data?.message || 'Item deleted successfully');
        } catch (error) {
            return;
        } finally {
            setLoadingCRUD(false);
            setShowDeleteModal(false);
        }
    };

    const toggleExpand = (event) => {
        // Specifically in this component, we need to prevent the event from propagating to the parent element
        event.stopPropagation();
        setExpanded(!expanded);
    };

    /*eslint-disable */

    const NameRenderer = (props) => (
        <div key={props.data.id}>
            <div className="d-flex align-items-center gap-2">
                <img src={props.data.avatarUrl} alt={props.data.productName} className="avatar" />
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
    const handleUploadClick = () => {
        setUploadFileModal(true);
    };

    const handleCloseFileModal = () => {
        setUploadFileModal(false);
    };

    const handleUploadSubmit = async (e) => {
        try {
            setLoadingCRUD(true);
            const file = e.target.files[0];
            if (!file || !file.type.startsWith('image/')) {
                // Display an error or handle the invalid file selection
                toast.error('Invalid file selected. Please choose an CSV file.');
                return;
            }

            const image = new Image();
            image.src = window.URL.createObjectURL(file);
            image.onload = () => {
                toast.success('File uploaded successfully!', {
                    icon: '🎉',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff'
                    }
                });

                setFile(file);
                // Upload File through API
            };
        } catch (error) {
            return;
        } finally {
            setLoadingCRUD(false);
        }
    };

    const handleChange = (file) => {
        setFile(file);
    };

    return (
        <div className="students-product-page">
            <>
                <Helmet>
                    <title>Visualize Csv | Dropship Academy</title>
                </Helmet>

                {showDeleteModal && (
                    <ConfirmationBox
                        show={showDeleteModal}
                        onClose={handleCloseDeleteModal}
                        loading={loadingCRUD}
                        title="Delete Student"
                        body="Are you sure you want to delete this Student?"
                        onConfirm={handleDeleteSubmit}
                        customFooterClass="custom-footer-class"
                        nonActiveBtn="cancel-button"
                        activeBtn="delete-button"
                        activeBtnTitle="Delete"
                    />
                )}

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
                                                multiple={true}
                                                handleChange={handleChange}
                                                name="file"
                                                types={fileTypes}
                                                label="hello"
                                            />
                                            <p>
                                                {file ? (
                                                    `File name: ${file[0].name}`
                                                ) : (
                                                    <span>
                                                        Drag an drop a file or <strong> browse file</strong>
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </Col>
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
                                    <input className="field-control" type="date" name="" id="" />
                                </div>
                            </Col>
                            <Col md={12} lg={6} xl={6} xxl={3}>
                                <div className=" d-flex justify-content-even align-items-center">
                                    <span className="me-2"> To: </span>
                                    <input className="field-control" type="date" name="" id="" />
                                </div>
                            </Col>
                            {!studentId && (
                                <>
                                    <Col md={12} lg={6} xl={6} xxl={3}>
                                        <Button className="add-button w-100">
                                            <span className="me-2">Export</span>
                                            <img src={pdfExport} alt="" />
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
                />
            </>
        </div>
    );
};

export default Invoices;
