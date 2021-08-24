import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { DataGrid } from "@material-ui/data-grid";
import {
  Container,
  Card,
  Typography,
  Divider,
  CardContent,
  Box,
  CircularProgress,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@material-ui/core";
import bookColumnNames from "../utils/bookColumnNames";

const CheckInPage = () => {
  const navigate = useNavigate();
  const [studentBooks, setStudentBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState();
  const [open, setOpen] = useState(false);
  const confirmationISBN = useRef('');

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setIsLoading(true);
    const selectedStudent = JSON.parse(
      sessionStorage.getItem("selectedStudent")
    );
    fetch("/studentsBooks", {
      method: "POST",
      body: JSON.stringify({
        parentId: selectedStudent.parent_id,
        studentId: selectedStudent._id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const studentBookList = [];
        for (let i = 0; i < data.length; i++) {
          const tempDate = new Date(parseInt(data[i].checkout_time) * 1000);
          const calDate = `${tempDate.getMonth()}/${tempDate.getDay()}/${tempDate.getFullYear()}`;
          const tempTime = `${
            tempDate.getHours() > 12
              ? `${tempDate.getHours() - 12}:${tempDate.getMinutes()} PM`
              : `${tempDate.getHours()}:${tempDate.getMinutes()} AM`
          }`;
          const temp = {
            id: i,
            ...data[i].book,
            checkout_time: `${tempTime} - ${calDate}`,
          };
          studentBookList.push(temp);
        }
        const sortedStudentBookList = studentBookList.sort((a, b) =>
          a.title < b.title ? -1 : 1
        );
        setStudentBooks(sortedStudentBookList);
        setIsLoading(false);
      });
  }, []);

  const handleRowSelection = (row) => {
    console.log(row.row);
    setSelectedRow(row.row);
  };

  const checkInHandler = () => {
    if (selectedRow !== undefined)
      setOpen(true);
  }

  const finalCheckIn = () => {
    if (confirmationISBN.current.value === selectedRow.isbn13 || confirmationISBN.current.value === selectedRow.isbn10) {
      const selectedStudent = JSON.parse(
        sessionStorage.getItem("selectedStudent")
      );
      fetch("/checkin", {
        method: "POST",
        body: JSON.stringify({
          userId: selectedStudent.parent_id,
          studentId: selectedStudent._id,
          bookId: selectedRow._id
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (res.ok) {
            res.json()
              .then((data) => {
                navigate("/app/dashboard", { replace: true });
              });
          } else {
            confirmationISBN.current.value = '';
          }
        });
    } else {
      confirmationISBN.current.value = '';
    }
  }

  return (
    <>
      <Helmet>
        <title>CheckIn | ClassroomLib</title>
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
              Please choose the book you wish to check in followed by check
              in...
            </Typography>
          </Box>
          <Divider />
          <CardContent>
            <Box sx={{ p: 1 }}>
              <Typography variant="h5">
                {`${ JSON.parse(sessionStorage.getItem("selectedStudent")).name}'s Books`}
              </Typography>
            </Box>
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
                      rows={studentBooks}
                      columns={bookColumnNames}
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
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              onClick={checkInHandler}
            >
              Check In
            </Button>
          </Box>
        </Card>
      </Container>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{`Check In: ${selectedRow !== undefined ? selectedRow.title : ''}`}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please scan the barcode to complete check in...
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="isbn"
            label="ISBN"
            fullWidth
            inputRef={confirmationISBN}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={finalCheckIn} color="primary">
            Check In
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CheckInPage;
