import moment from "moment";
import { Layout } from "./layout";
import { TableData } from "../components/TableData";
import { DataAction } from "../components/TableData/DataAction";
import axios from "axios";
import { useState, type ChangeEvent } from "react";

export const SitesPage = () => {
  const apiUrl = "/api/site";
  const listUrl = `${apiUrl}/get_list`;

  const columns = [
    { data: "name", title: "Name" },
    { data: "is_used", title: "Used" },
    { data: "update_at", title: "Last Updated At" },
    { data: "id", title: "Action", width: "80px" },
  ];
  const slots = {
    1: (data: any, row: any) => {
      return <i>{data ? "check" : "close"}</i>;
    },
    2: (data: any, row: any) => {
      const date = new Date(data);
      const dateRelative = moment(data).calendar();
      return <time dateTime={date.toISOString()}>{dateRelative}</time>;
    },
    3: (data: any, row: any) => {
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

  const [data, setData] = useState({
    name: "",
    description: "",
    is_used: false,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputObject = Object();
    inputObject[e.target.name] = e.target.value;
    setData((prev) => ({ ...prev, ...inputObject }));
  };

  const handleSave = () =>
    axios
      .post(apiUrl, data, { withCredentials: true })
      .then((res) =>
        res.status !== 200 ? alert("Save Failed") : window.location.reload()
      );

  return (
    <Layout title="Sites">
      <TableData url={listUrl} columns={columns} slots={slots} />
      <dialog className="bottom" id="form">
        <h5>Sites Form</h5>
        <div className="field label border">
          <input type="text" name="name" required onChange={handleChange} />
          <label>Name</label>
        </div>
        <div className="field label border">
          <input
            type="text"
            name="description"
            required
            onChange={handleChange}
          />
          <label>Description</label>
        </div>
        <label className="switch">
          <input
            type="checkbox"
            name="is_used"
            onChange={(e) => {
              console.log(e.target.value);
              let value = false;
              if (e.target.value === "on") value = true;
              setData((prev) => ({ ...prev, is_used: value }));
            }}
          />
          <span className="left-padding small-padding">Used</span>
        </label>

        <nav className="right-align">
          <button className="border">Cancel</button>
          <button onClick={handleSave}>Save</button>
        </nav>
      </dialog>
    </Layout>
  );
};
