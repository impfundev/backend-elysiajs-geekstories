import moment from "moment";
import { Layout } from "./layout";
import { TableData } from "../components/TableData";
import { TagForm } from "../components/forms/tags";

export const TagsPage = () => {
  const apiUrl = "/api/tag";
  const listUrl = `${apiUrl}/get_list`;

  const columns = [
    { data: "name", title: "Name" },
    { data: "slug", title: "Slug" },
    { data: "description", title: "Description" },
    { data: "update_at", title: "Last Updated At" },
    { data: "id", title: "Action", width: "80px" },
  ];
  const slots = {
    3: (data: any, row: any) => {
      const date = new Date(data);
      const dateRelative = moment(data).calendar();
      return <time dateTime={date.toISOString()}>{dateRelative}</time>;
    },
    4: (id: string, row: any) => <TagForm id={id} row={row} apiUrl={apiUrl} />,
  };

  return (
    <Layout title="Tags">
      <TableData url={listUrl} columns={columns} slots={slots} />
    </Layout>
  );
};
