import { useEffect, useState, useDeferredValue } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community';
import { InputGroup, Form, Row, Col } from 'react-bootstrap';
import Loading from '../Loading/Loading';
import Search from '../../assets/icons/Search.svg';

import './Table.scss';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const Table = ({ columns, tableData, width, onRowClicked, loading, children }) => {
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const [search, setSearch] = useState('');

    const defferedSearch = useDeferredValue(search);

    const onGridReady = (params) => {
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);
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

    return (
        <div className="ag-theme-alpine custom-table" style={{ height: '100%', width: '100%' }}>
            <Row className="mb-3">
                <Col lg={6} md={12}>
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
                </Col>
                <Col lg={6} md={12}>
                    {children}
                </Col>
            </Row>
            <div className="ag-theme-alpine" style={{ width: width ? width : '100%' }}>
                {loading ? (
                    <Loading />
                ) : (
                    <AgGridReact
                        gridOptions={gridOptions}
                        columnDefs={columns}
                        rowData={tableData} // Concatenate empty rows
                        animateRows={true}
                        rowSelection="multiple"
                        sizeRowsToFit
                        onGridReady={onGridReady}
                        loadingOverlayComponent={Loading}
                        onRowClicked={onRowClicked}
                        suppressMenuHide={true}
                        floatingFilter={true}
                        pagination={true}
                        paginationPageSize={10}
                        rowClass="data-table-row"
                        headerClass="data-table-header"
                        suppressCellFocus={true}
                        suppressSizeToFit={true}
                        groupSelectsChildren={true}
                        suppressAggFuncInHeader={true}
                        rowHeight={57}
                        suppressMovableColumns={true}
                    />
                )}
            </div>
        </div>
    );
};

export default Table;
