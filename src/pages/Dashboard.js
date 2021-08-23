import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
import {
  Container,
  Card,
  Divider,
  CardContent,
  Box,
  CircularProgress,
  Button,
  Typography,
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
    console.log(linkUserId);
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
        setStudentList(students);
        setIsLoading(false);
      });
  }, []);

  const handleRowSelection = (row) => {
    console.log(row.row);
    setSelectedRow(row.row);
  };

  const checkIn = () => {
    if (selectedRow !== undefined) {
      if (selectedRow.book_list.length > 0)
        navigate("/app/checkin", { replace: true, student: selectedRow });
    }
  };

  const checkOut = () => {
    if (selectedRow !== undefined) {
      navigate("/app/checkout", { studentId: selectedRow._id });
    }
  };

  return (
    <>
      <Helmet>
        <title>Dashboard | ClassroomLib</title>
      </Helmet>
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Card>
          <Box sx={{ p: 3 }}>
            <Typography variant="h4">
              Please choose your name, followed by check in or check out...
            </Typography>
          </Box>
          <Divider />
          <CardContent>
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
              <Box style={{ height: 400, width: "100%" }}>
                <Box style={{ display: "flex", height: "100%" }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <DataGrid
                      rows={studentList}
                      columns={studentColumnNames}
                      onRowClick={(selectedRow) =>
                        handleRowSelection(selectedRow)
                      }
                    />
                  </Box>
                </Box>
              </Box>
            )}
          </CardContent>
          <Divider />
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              p: 2,
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
        </Card>
      </Container>
    </>
  );
};

export default Dashboard;
