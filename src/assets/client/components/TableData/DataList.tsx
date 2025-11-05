import { useRef } from "react";
import DataTable, { type DataTableSlots } from "datatables.net-react";
import DT, { type ConfigColumns } from "datatables.net-dt";

DataTable.use(DT);

interface DataListProps {
  data?: any[];
  columns: ConfigColumns[];
  slots?: DataTableSlots;
}

export const DataList = ({ data, columns, slots }: DataListProps) => {
  const table = useRef(null);

  return (
    <DataTable
      data={data}
      columns={columns}
      className="border display"
      ref={table}
      options={{
        search: false,
        searching: false,
        paging: false,
        info: false,
      }}
      slots={slots}
    ></DataTable>
  );
};
