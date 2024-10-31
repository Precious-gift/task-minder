import {
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  IconButton,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useState } from "react";
import {
  deleteTaskFromDb,
  getTasksFromDb,
  updateTaskFromDb,
} from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { setTasks } from "../../features/tasks/taskSlice";

const TaskCard = ({ task, setActiveCard, brColor, index }) => {
  const { id, taskDesc, projectId } = task;
  const user = useSelector((state) => state.auth.user);
  const [isEditing, setIsEditing] = useState(false);
  const [updateTaskDesc, setUpdateTaskDesc] = useState(taskDesc);
  const dispatch = useDispatch();
  const StyledCard = styled(Card)({
    cursor: "grab",
    border: `2px solid ${brColor}`,
    borderRadius: "12px",
    "&:active": {
      opacity: 0.7,
      border: `1px solid ${brColor}`,
    },
  });
  return (
    <>
      <StyledCard
        sx={{ minWidth: 275 }}
        draggable
        onDragStart={() => setActiveCard(index)}
        onDragEnd={() => setActiveCard(null)}
        variant="outlined"
      >
        <CardActions>
          <ButtonGroup color="secondary" aria-label="Medium-sized button group">
            <IconButton
              aria-label="edit"
              size="small"
              color={isEditing ? "error" : ""}
              onClick={() => setIsEditing(!isEditing)}
            >
              <EditOutlinedIcon size="small" />
            </IconButton>
            <IconButton
              aria-label="delete"
              size="small"
              onClick={() => {
                deleteTaskFromDb(user, task);
                const fetchTasks = async () => {
                  try {
                    if (user && projectId) {
                      const task = await getTasksFromDb(user, projectId);
                      dispatch(setTasks(task));
                    }
                  } catch (error) {
                    console.error("Error fetching tasks:", error);
                  }
                };
                fetchTasks();
              }}
            >
              <DeleteOutlineOutlinedIcon size="small" />
            </IconButton>
          </ButtonGroup>
        </CardActions>
        <CardContent>
          {isEditing ? (
            <div>
              <TextField
                autoFocus
                required
                margin="dense"
                id="updateTaskDesc"
                name="updateTaskDesc"
                label="Task description"
                multiline
                rows={4}
                fullWidth
                variant="standard"
                value={updateTaskDesc}
                onChange={(e) => {
                  console.log(e.target.value);
                  setUpdateTaskDesc(e.target.value);
                  const fetchTasks = async () => {
                    try {
                      if (user && projectId) {
                        const task = await getTasksFromDb(user, projectId);
                        dispatch(setTasks(task));
                      }
                    } catch (error) {
                      console.error("Error fetching tasks:", error);
                    }
                  };
                  fetchTasks();
                }}
              />
              <Button
                variant="contained"
                size="small"
                endIcon={<CheckCircleOutlineIcon />}
                onClick={() => {
                  const updatedRow = { ...task, taskDesc: updateTaskDesc };
                  updateTaskFromDb(user, projectId, updatedRow);
                  setIsEditing(false);
                  const fetchTasks = async () => {
                    try {
                      if (user && projectId) {
                        const task = await getTasksFromDb(user, projectId);
                        dispatch(setTasks(task));
                      }
                    } catch (error) {
                      console.error("Error fetching tasks:", error);
                    }
                  };
                  fetchTasks();
                }}
              >
                Save
              </Button>
            </div>
          ) : (
            <Typography variant="body1" component="div">
              {taskDesc}
            </Typography>
          )}
        </CardContent>
      </StyledCard>
    </>
  );
};
export default TaskCard;
