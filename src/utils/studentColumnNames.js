function getBookListLength(params) {
  let length = 0;
  const list = String(params.getValue(params.id, "book_list")).split(",");
  if (list[0] === "") length = 0;
  else length = list.length;
  return `${length}`;
}

export default [
  { field: "name", headerName: "Name", width: 200 },
  { field: "classroom", headerName: "Class", width: 150 },
  {
    field: "current_books",
    headerName: "Current Books Checked Out",
    width: 280,
    valueGetter: getBookListLength,
  },
];
