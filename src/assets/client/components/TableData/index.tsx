import axios from "axios";
import { useEffect, useState } from "react";

import { DataPagination } from "./DataPagination";
import { DataSearch } from "./DataSearch";
import { DataList } from "./DataList";
import type { ConfigColumns } from "datatables.net-dt";
import type { DataTableSlots } from "datatables.net-react";

interface TableDataProps {
  url: string;
  columns: ConfigColumns[];
  slots?: DataTableSlots;
}

export const TableData = ({ url, columns, slots }: TableDataProps) => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalRecords: 0,
  });

  let fetched = 1;
  const fetchData = (search?: string) => {
    if (fetched > 1) return;
    fetched += 1;

    const start = (pagination.currentPage - 1) * pagination.pageSize;
    const length = pagination.pageSize;

    const params = new URLSearchParams();
    params.append("start", start.toString());
    params.append("length", length.toString());
    if (search) params.append("search", search);
    const apiUrl = `${url}?${params.toString()}`;

    axios
      .get(apiUrl, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.status === 200) {
          setData(res.data.data);
          setPagination((prev) => ({
            ...prev,
            totalRecords: res.data.recordsFiltered,
          }));
        }
      })
      .catch((err) => alert(err));
  };

  useEffect(() => {
    if (!fetched) fetchData();
  }, []);

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  return (
    <>
      <DataSearch onSearch={fetchData} />
      <DataList data={data} columns={columns} slots={slots} />
      <DataPagination
        currentPage={pagination.currentPage || 1}
        totalRecords={pagination.totalRecords || 0}
        pageSize={pagination.pageSize || 10}
        onPageChange={handlePageChange}
      />
    </>
  );
};
