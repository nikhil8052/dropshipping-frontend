import { useEffect, useState, useDeferredValue, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community';
import { InputGroup, Form, Row, Col, Button } from 'react-bootstrap';
import Loading from '../Loading/Loading';
import Search from '../../assets/icons/Search.svg';
import './Table.scss';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import HeaderWithIcon from '../../components/HeaderWithIcon';
import add from '@icons/add_white.svg';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const gridComponents = {
    headerWithIcon: HeaderWithIcon
};

const Table = ({
    columns,
    tableData = [],
    width,
    onRowClicked,
    loading,
    children,
    inputLgSize = 6,
    childLgSize = 6,
    onExportCsv,
    exportFileName
}) => {
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const [search, setSearch] = useState('');
    const gridRef = useRef();

    const defferedSearch = useDeferredValue(search);
    const navigate = useNavigate();

    const onGridReady = (params) => {
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);
        params.columnApi.autoSizeAllColumns();

        updatePaginationInfo(params.api);

        // Listen to pagination change
        params.api.addEventListener('paginationChanged', () => {
            updatePaginationInfo(params.api);
        });
    };

    useEffect(() => {
        gridApi?.setQuickFilter(defferedSearch);
        const isDataEmpty = gridApi && gridApi?.getModel()?.getRowCount() === 0;
        if (isDataEmpty) {
            gridApi?.showNoRowsOverlay();
        } else {
            gridApi?.hideOverlay();
        }
    }, [defferedSearch, gridApi]);

    useEffect(() => {
        if (gridColumnApi) {
            gridColumnApi.setColumnPinned();
        }
    }, [gridColumnApi]);

    const onFilterTextChange = (event) => {
        setSearch(event.target.value);
    };

    const exportToCsv = () => {
        gridApi.exportDataAsCsv();
    };

    const [pageSize, setPageSize] = useState(20);

    const [paginationInfo, setPaginationInfo] = useState({
        from: 0,
        to: 0,
        total: 0,
    });

    const updatePaginationInfo = (api) => {
        const currentPage = api.paginationGetCurrentPage(); // 0-based
        const pageSize = api.paginationGetPageSize();
        const totalRows = api.paginationGetRowCount();

        if (totalRows === 0) {
            setPaginationInfo({ from: 0, to: 0, total: 0 });
            return;
        }

        const from = currentPage * pageSize + 1;
        const to = Math.min((currentPage + 1) * pageSize, totalRows);

        setPaginationInfo({ from, to, total: totalRows });
    };

    const handlePageSizeChange = (e) => {
        const newSize = Number(e.target.value);
        setPageSize(newSize);
        gridRef.current.api.paginationSetPageSize(newSize);
        updatePaginationInfo(gridRef.current.api);
    };

    useEffect(() => {
        if (gridApi) {
            updatePaginationInfo(gridApi);
        }
    }, [tableData, gridApi]);

    const gridOptions = {
        domLayout: 'autoHeight',
        suppressAutoSize: true,
        suppressColumnVirtualisation: false,
        suppressPaginationPanel: false,
        overlayLoadingTemplate: Loading,
        embedFullWidthRows: true,
        autoHeight: true,
        suppressRowTransform: true,
        overlayNoRowsTemplate: '<span>No data found</span>'
    };

    const { userInfo } = useSelector((state) => state?.auth);
    const role = userInfo?.role?.toLowerCase();
    const [showColumnSelect, setShowColumnSelect] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setShowColumnSelect(false);
            }
        };

        if (showColumnSelect) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showColumnSelect]);

    const handleCreateClick = () => {
        navigate(`/${role}/students-supabase/new`);
    };
    const handleEditClick = (studentId) => {
        navigate(`/${role}/students-supabase/edit`, {
            state: { studentId }
        });
    };

    return (
        <div className="ag-theme-alpine custom-table student-table" style={{ height: '100%', width: '100%' }}>
            <div className="top-bar">
                <div className=" student-table-row justify-content-between align-items-center row" >
                    <div className='col-sm-3 col-3 '>
                        {children}
                    </div>
                    <div className='col-sm-6 col-7'>
                        <InputGroup>
                            <InputGroup.Text>
                                <img src={Search} alt="Search" />
                            </InputGroup.Text>
                            <Form.Control
                                className="search-input"
                                type="text"
                                name="Search"
                                label="Search"
                                onChange={onFilterTextChange}
                                placeholder="Search"
                            />
                        </InputGroup>
                    </div>
                    <div className='col-sm-3 col-2 text-end'>
                        <Button className="add-button" onClick={handleCreateClick}>
                            <img className="mb-1" src={add} alt="add button" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="ag-theme-alpine" style={{ width: width ? width : '100%' }}>
                {loading ? (
                    <Loading />
                ) : (
                    <>


                        <AgGridReact
                            ref={gridRef}
                            gridOptions={gridOptions}
                            columnDefs={columns}
                            rowData={tableData}
                            animateRows={true}
                            rowSelection="multiple"
                            sizeRowsToFit
                            onGridReady={onGridReady}
                            loadingOverlayComponent={Loading}
                            onRowClicked={onRowClicked}
                            suppressMenuHide={true}
                            floatingFilter={true}
                            pagination={true}
                            paginationPageSize={pageSize}
                            rowClass="data-table-row"
                            headerClass="data-table-header"
                            suppressCellFocus={true}
                            suppressSizeToFit={true}
                            groupSelectsChildren={true}
                            suppressAggFuncInHeader={true}
                            rowHeight={57}
                            suppressMovableColumns={true}
                            components={gridComponents}
                        />
                        {gridApi && (<>
                            <div style={{ marginBottom: '10px' }}>
                                <label>
                                    Show rows:&nbsp;
                                    <select value={pageSize} onChange={handlePageSizeChange}>
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                        <option value={50}>50</option>
                                        <option value={100}>100</option>
                                    </select>
                                </label>
                            </div>

                            <div className="pagination-summary text-muted mt-2">
                                Showing <strong>{paginationInfo.from}</strong>–<strong>{paginationInfo.to}</strong> of <strong>{paginationInfo.total}</strong> records
                            </div>
                        </>
                        )}
                    </>
                )}
                {onExportCsv && (
                    <Button id={`${exportFileName}`} onClick={exportToCsv} className="d-none">
                        Export CSV
                    </Button>
                )}
            </div>
        </div>
    );
};

export default Table;
