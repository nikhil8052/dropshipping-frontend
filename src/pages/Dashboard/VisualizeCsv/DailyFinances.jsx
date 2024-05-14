import { useEffect, useState } from 'react';
import Table from '@components/Table/Table';
import { Button, Col, Container, Row } from 'react-bootstrap';
import ConfirmationBox from '@components/ConfirmationBox/ConfirmationBox';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import TextExpand from '@components/TextExpand/TextExpand';
import uploadSimple from '@icons/UploadSimpleBack.svg';
import pdfExport from '@icons/picture_as_pdf.svg';
import { dailyFinances } from '../../../data/data';
import { FileUploader } from 'react-drag-drop-files';
const fileTypes = ['csv'];

const DailyFinances = () => {
    const [uploadFileModal, setUploadFileModal] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingCRUD, setLoadingCRUD] = useState(false);
    const [studentsData, setStudentsData] = useState(null);
    const [file, setFile] = useState(null);

    useEffect(() => {
        // Fetch data from API here
        fetchData();
    }, []);

    const fetchData = async () => {
        // Later we will replace this with actual API call
        try {
            setLoading(true);

            setStudentsData(dailyFinances);
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

    const handleCloseFileModal = () => {
        setUploadFileModal(false);
    };

    const handleUploadClick = (id) => {
        // Handle delete action here
        setSelectedRowId(id);
        setUploadFileModal(true);
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
            cellRenderer: TextExpand
        },
        {
            headerName: 'Revenue',
            field: 'revenue',
            filter: 'agSetColumnFilter',
            sortable: true,
            unSortIcon: true,
            wrapText: true,
            autoHeight: true,
            resizable: false,
            cellRenderer: TextExpand
        },
        {
            headerName: 'Orders',
            field: 'orders',
            filter: 'agSetColumnFilter',
            sortable: true,
            unSortIcon: true,
            wrapText: true,
            autoHeight: true,
            resizable: false,
            cellRenderer: TextExpand
        },
        {
            headerName: 'Ad Spend',
            field: 'adSpend',
            filter: 'agSetColumnFilter',
            sortable: true,
            unSortIcon: true,
            wrapText: true,
            autoHeight: true,
            resizable: false,
            cellRenderer: TextExpand
        },
        {
            headerName: 'ROAS',
            field: 'roas',
            filter: 'agSetColumnFilter',
            sortable: true,
            unSortIcon: true,
            wrapText: true,
            autoHeight: true,
            resizable: false,
            cellRenderer: TextExpand
        },
        {
            headerName: 'Refunds',
            field: 'refunds',
            filter: 'agSetColumnFilter',
            sortable: true,
            unSortIcon: true,
            wrapText: true,
            autoHeight: true,
            resizable: false,
            cellRenderer: TextExpand
        },
        {
            headerName: 'COG',
            field: 'cog',
            filter: 'agSetColumnFilter',
            sortable: true,
            unSortIcon: true,
            wrapText: true,
            autoHeight: true,
            resizable: false,
            cellRenderer: TextExpand
        },
        {
            headerName: 'Profit/Loss',
            field: 'profitLoss',
            filter: 'agSetColumnFilter',
            sortable: true,
            unSortIcon: true,
            wrapText: true,
            autoHeight: true,
            resizable: false,
            cellRenderer: TextExpand
        },
        {
            headerName: '% Margin',
            field: 'margin',
            filter: 'agSetColumnFilter',
            sortable: true,
            unSortIcon: true,
            wrapText: true,
            autoHeight: true,
            resizable: false,
            cellRenderer: TextExpand
        }
    ];

    const handleChange = (file) => {
        setFile(file);
    };

    return (
        <div className="students-product-page">
            <>
                <Helmet>
                    <title>Visualize Csv | Drop Ship Academy</title>
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
                            </>
                        }
                        onConfirm={handleUploadSubmit}
                        customFooterClass="custom-footer-class"
                        nonActiveBtn="cancel-button"
                        activeBtn="delete-button"
                        activeBtnTitle="Delete"
                    />
                )}
                <Table
                    columns={columns}
                    inputLgSize={4}
                    childLgSize={8}
                    tableData={studentsData}
                    onRowClicked={handleRowClick}
                    loading={loading}
                    handleCreateClick
                    children={
                        <Row className="mb-3 g-2">
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
                            <Col md={12} lg={6} xl={6} xxl={3}>
                                <Button className="add-button w-100" onClick={handleUploadClick}>
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
                        </Row>
                    }
                />
            </>
        </div>
    );
};

export default DailyFinances;
