function getBookListLength(params) {
  return `${params.row.book_list.length}`;
}

const studentColumnNames = [
  { field: "name", headerName: "Name", width: 325 },
  { field: "classroom", headerName: "Class", width: 200 },
  {
    field: "current_books",
    headerName: "Books Checked Out",
    width: 225,
    valueGetter: getBookListLength,
  },
];

export default studentColumnNames;
