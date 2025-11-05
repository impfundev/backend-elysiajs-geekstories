import moment from "moment";
import { Layout } from "./layout";
import { TableData } from "../components/TableData";
import { DataAction } from "../components/TableData/DataAction";
import axios from "axios";

export const PostsPage = () => {
  const apiUrl = "/api/post";
  const listUrl = `${apiUrl}/get_list`;
  const columns = [
    { data: "title", title: "Title", width: "300px" },
    { data: "author.name", title: "Author", width: "180px" },
    { data: "tags" },
    { data: "published", title: "Published", width: "100px" },
    { data: "update_at", title: "Last Updated At", width: "180px" },
    { data: "id", title: "Action", width: "80px" },
  ];
  const slots = {
    0: (data: any, row: any) => {
      return <h6>{data}</h6>;
    },
    1: (data: any, row: any) => {
      return <div>{data}</div>;
    },
    2: (data: any, row: any) => {
      return (
        <>
          {data.map((tag: any, i: number) => (
            <div className="chip" key={i}>
              {tag.name}
            </div>
          ))}
        </>
      );
    },
    3: (data: any, row: any) => {
      return (
        <div className={`chip ${data ? "primary" : "secondary"}`}>
          {data ? "Published" : "Draft"}
        </div>
      );
    },
    4: (data: any, row: any) => {
      const date = new Date(data);
      const dateRelative = moment(data).calendar();
      return <time dateTime={date.toISOString()}>{dateRelative}</time>;
    },
    5: (data: any, row: any) => {
      const handleEdit = () => console.log(data);
      const handleDelete = () => {
        const url = `${apiUrl}/${data}`;
        axios
          .delete(url)
          .then((res) =>
            res.status !== 200
              ? alert("Delete Failed")
              : window.location.reload()
          )
          .catch((err) => alert(err));
      };
      return <DataAction handleDelete={handleDelete} key={data} id={data} />;
    },
  };

  return (
    <Layout title="Posts">
      <TableData url={listUrl} columns={columns} slots={slots} />
    </Layout>
  );
};
