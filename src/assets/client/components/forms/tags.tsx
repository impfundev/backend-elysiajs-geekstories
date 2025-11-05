import axios from "axios";
import { type ChangeEvent, useState } from "react";
import { DataAction } from "../TableData/DataAction";

interface TagFormProps {
  id: string;
  row?: any;
  apiUrl: string;
}

export const TagForm = ({ id, row, apiUrl }: TagFormProps) => {
  const url = `${apiUrl}/${id}`;
  const [data, setData] = useState({ ...row, image: row.image || undefined });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputObject = Object();
    inputObject[e.target.name] = e.target.value;
    setData((prev: any) => ({ ...prev, ...inputObject }));
  };

  const handleDelete = () => {
    axios
      .delete(url)
      .then((res) =>
        res.status !== 200 ? alert("Delete Failed") : window.location.reload()
      )
      .catch((err) => alert(err));
  };

  const handleSave = () => {
    axios
      .put(url, data, { withCredentials: true })
      .then((res) =>
        res.status !== 200 ? alert("Save Failed") : window.location.reload()
      )
      .catch((err) => alert(err));
  };

  return (
    <>
      <DataAction handleDelete={handleDelete} key={id} id={id} />
      <dialog className="bottom" id={`form_${id}`}>
        <h5>Tags Form</h5>
        <div className="field label border">
          <input
            type="text"
            name="name"
            required
            onChange={handleChange}
            value={data.name}
          />
          <label>Name</label>
        </div>
        <div className="field label border">
          <input
            type="text"
            name="slug"
            required
            onChange={handleChange}
            value={data.slug}
          />
          <label>Slug</label>
        </div>
        <div className="field label border">
          <input
            type="text"
            name="description"
            required
            onChange={handleChange}
            value={data.description}
          />
          <label>Description</label>
        </div>
        <nav className="right-align">
          <button className="border" data-ui={`#form_${id}`}>
            Cancel
          </button>
          <button onClick={handleSave}>Save</button>
        </nav>
      </dialog>
    </>
  );
};
