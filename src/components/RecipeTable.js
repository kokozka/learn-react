import { useState, useEffect } from 'react';
import { Table, Tooltip } from 'antd';
import apiRequest from '../api/common.js';

/* TODO:
    - memo api requests
*/
function RecipeTable(props) {
    // TODO - fix 5 times called constructor

    const [isLoading, setIsLoading] = useState(false);
    const [table, setTable] = useState();
    const [pagination, setPagination] = useState();
    const [columns, setColumns] = useState();
    const [data, setData] = useState();

    useEffect(() => {
        if (props.recipe && props.recipe.colDefId && props.recipe.dataApiPath) {
            setIsLoading(true);
            Promise.all([
                apiRequest('tableType?id='+ props.recipe.colDefId)
                    .then(res => {
                        if (!res || !res.length) {
                            return resetTable();
                        }
                        const data = res[0];

                        setTable({
                            title: () => <>{data.table.title}<small style={{display:'block'}}>{data.table.description}</small></>,
                            footer: () => data.table.footer
                        });
                        setPagination(Object.assign(pagination || {}, {pageSize: data.table.perpage}));
                        setColumns(data.columns.sort((a, b) => a.order - b.order)
                            .map(column => {
                                const out = {
                                    dataIndex: column.dataIndex,
                                    ellipsis: column.ellipsis,
                                    title: column.tooltip ? () => <Tooltip title={column.tooltip}>{column.title}</Tooltip> : column.title,
                                    width: column.width,
                                    filtered: true
                                }

                                // TODO: use filterMultiple?
                                if (Array.isArray(column.filters) && column.filters.length) {
                                    out.filters = column.filters;
                                    out.filterMultiple = false;
                                }

                                if (column.sortable) {
                                    out.sorter = true;
                                }
                                return out;
                            }));
                    }),
                loadData()
            ])
                .catch(() => resetTable())
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            return resetTable();
        }
    }, [props.recipe]);

    function onChange(pagination, filters, sorter, extras) {
        setIsLoading(true);
        loadData(filters, sorter, pagination)
            .finally(() => setIsLoading(false));
    }

    function resetTable(params) {
        setTable();
        setColumns();
        setPagination();
        setData();
    }

    function loadData(filters, sorter, pagination) {
        /* sortable/filtered request
        {
            "tableId": int,
            "size": 20, //number of displayed elements
            "totalElements": 12,
            "totalPages": 1,
            "number": 0, // actual page,
            "filter": {
                value: "London",
                column: "name"
            },
            "sort": {
                column: "name",
                type: "asc/ desc, other paremaeter"
            } 
        }
        */
        const params = new URLSearchParams();
        if (filters) {
            const filtersParam = [];
            for (const [key, filter] of Object.entries(filters)) {
                filtersParam.push({column: key, value: filter});
            }
            params.set('filter', JSON.stringify(filtersParam));
        }

        sorter && params.set('sort', JSON.stringify({
            column: sorter.field,
            type: sorter.order
        }));

        if (pagination) {
            pagination && params.set('size', pagination.pageSize);
            pagination && params.set('totalElements', pagination.current * pagination.pageSize - pagination.pageSize);
            pagination && params.set('totalPages', 1);
            pagination && params.set('number', pagination.current);
        }

        return apiRequest(props.recipe.dataApiPath +'?'+ params.toString())
            .then(res => {
                if (!res || !res.rows) {
                    return setData();
                }
                setData(res.rows);
                return res.rows.length;
            })
            .then(rowsCount => setPagination(Object.assign(pagination || {}, {total: rowsCount || 0})));
    }

    return (
        <Table {...table}
            columns={columns}
            dataSource={data}
            onChange={onChange}
            pagination={pagination}
            loading={isLoading} />
    );
}

export default RecipeTable;