interface DataActionProps {
  id: string;
  handleEdit?: () => void;
  handleDelete: () => void;
}

export const DataAction = ({
  id,
  handleEdit,
  handleDelete,
}: DataActionProps) => {
  const form_key = `form_${id}`;
  const delete_key = `delete_dialog_${id}`;

  return (
    <>
      <nav className="group split">
        <button className="left-round" data-ui={"#" + form_key}>
          <i>edit</i>
          <div className="tooltip">Edit</div>
        </button>
        <button className="right-round error" data-ui={"#" + delete_key}>
          <i>delete</i>
          <div className="tooltip">Delete</div>
        </button>
      </nav>
      <dialog className="modal" id={delete_key}>
        <h5>Are you sure want to delete this data</h5>
        <p>This action cannot be undone</p>
        <nav className="right-align">
          <button className="border" data-ui={"#" + delete_key}>
            Cancel
          </button>
          <button
            className="error"
            onClick={handleDelete}
            data-ui={"#" + delete_key}
          >
            Delete
          </button>
        </nav>
      </dialog>
    </>
  );
};
