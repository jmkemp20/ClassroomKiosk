function getBookListLength(params) {
  return `${params.row.book_list.length}`;
}

const studentColumnNames = [
  { field: "name", headerName: "Name", width: 200 },
  { field: "classroom", headerName: "Class", width: 150 },
  {
    field: "current_books",
    headerName: "Current Books Checked Out",
    width: 280,
    valueGetter: getBookListLength,
  },
];

export default studentColumnNames;
