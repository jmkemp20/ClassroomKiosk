import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
import {
  Divider,
  Box,
  CircularProgress,
  Button
} from "@material-ui/core";
import linkUserId from "../utils/linkUserId";
import studentColumnNames from "../utils/studentColumnNames";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [studentList, setStudentList] = useState([]);
  const [selectedRow, setSelectedRow] = useState();

  useEffect(() => {
    setIsLoading(true);
    fetch("/students", {
      method: "POST",
      body: JSON.stringify({ userId: linkUserId }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const students = [];
        for (const num in data) {
          const temp = {
            id: num,
            ...data[num],
          };
          students.push(temp);
        }
        const sortedStudents = students.sort((a, b) =>
          a.name < b.name ? -1 : 1
        );
        setStudentList(sortedStudents);
        setIsLoading(false);
      });
  }, []);

  const handleRowSelection = (row) => {
    console.log(row.row);
    setSelectedRow(row.row);
  };

  const checkIn = () => {
    sessionStorage.clear();
    if (selectedRow !== undefined) {
      if (selectedRow.book_list.length > 0) {
        sessionStorage.setItem("selectedStudent", JSON.stringify(selectedRow));
        navigate("/app/checkin", { replace: true });
      }
    }
  };

  const checkOut = () => {
    sessionStorage.clear();
    if (selectedRow !== undefined) {
      sessionStorage.setItem("selectedStudent", JSON.stringify(selectedRow));
      navigate("/app/checkout", { studentId: selectedRow._id });
    }
  };

  return (
    <>
      <Helmet>
        <title>Dashboard | ClassroomLib</title>
      </Helmet>

      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            pt: 3,
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box style={{ height: 370, width: "100%" }}>
          <DataGrid
            rows={studentList}
            columns={studentColumnNames}
            rowHeight={40}
            hideFooterPagination
            hideFooter
            headerHeight={50}
            onRowClick={(selectedRow) => handleRowSelection(selectedRow)}
          />
        </Box>
      )}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          color="primary"
          disabled={isLoading}
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          onClick={checkIn}
        >
          Check In
        </Button>
        <Divider orientation="vertical" />
        <Button
          color="primary"
          disabled={isLoading}
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          onClick={checkOut}
        >
          CheckOut
        </Button>
      </Box>
    </>
  );
};

export default Dashboard;
