import {
  Autocomplete,
  Button,
  createFilterOptions,
  TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { toggleTaskModal } from "../features/modal/modalSlice";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CheckBoxOutlineBlankRoundedIcon from "@mui/icons-material/CheckBoxOutlineBlankRounded";
import HourglassEmptyOutlinedIcon from "@mui/icons-material/HourglassEmptyOutlined";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import TaskColumn from "../components/TaskColumn/TaskColumn";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getTasksFromDb,
  updateAllTasksWithBatch,
  updateTaskFromDb,
} from "../firebase";
import { setTasks } from "../features/tasks/taskSlice";

const filterOptions = createFilterOptions({
  matchFrom: "start",
  stringify: (option) => option.title,
});

const Tasks = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const projects = useSelector((state) => state.projects.projects);
  const tasks = useSelector((state) => state.tasks.tasks);
  const [project, setProject] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const [activeCard, setActiveCard] = useState(null);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);

  useEffect(() => {
    const findFirstProjectWithTasks = async () => {
      for (const proj of projects) {
        const tasks = await getTasksFromDb(user, proj.docid);
        if (tasks.length > 0) {
          setProject(proj);
          setCurrentProjectIndex(
            projects.findIndex((p) => p.docid === proj.docid)
          );
          console.log("currentProjectIndex 2", currentProjectIndex);
          return;
        }
      }
      // If no project with tasks is found, default to the first project
      if (projects.length > 0) setProject(projects[0]);
    };

    if (user && projects.length > 0) {
      findFirstProjectWithTasks();
    }
  }, [projects, user, currentProjectIndex]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        if (user && project && project.docid) {
          const task = await getTasksFromDb(user, project.docid);
          console.log("fetched tasks", task);
          dispatch(setTasks(task));
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    if (user) {
      fetchTasks();
    }
    return () => {};
  }, [dispatch, user, project]);

  const onDrop = async (status, position) => {
    if (activeCard === null || activeCard === undefined) return;

    // Find the current task and update its status
    const currentTask = tasks.find((task, index) => index === activeCard);
    if (!currentTask) {
      console.error("Task not found");
      return;
    }

    const updatedRow = { ...currentTask, status };
    console.log(
      `${activeCard} is going to be placed into ${status} and at position ${position}`
    );
    console.log("Updated row before update:", updatedRow);
    // Update the specific task's status in the database
    await updateTaskFromDb(user, project.docid, updatedRow);

    // Rearrange tasks in the new order
    const taskIndex = tasks.findIndex((task, index) => index === activeCard);
    const updatedTasks = tasks.filter((_, index) => index !== taskIndex);
    updatedTasks.splice(position, 0, updatedRow); // Insert the updated task at the new position
    console.log("Updated tasks before insertion:", updatedTasks);
    // Batch update all tasks to reflect new order
    await updateAllTasksWithBatch(user, updatedTasks);

    // Fetch updated tasks and set to state
    const fetchTasks = async () => {
      try {
        if (user && project && project.docid) {
          const refreshedTasks = await getTasksFromDb(user, project.docid);
          console.log("Fetched updated tasks", refreshedTasks);
          dispatch(setTasks(refreshedTasks));
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    // Refetch tasks to reflect changes
    await fetchTasks();
  };

  return (
    <div className="md:container md:mx-auto">
      <section className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <h1>Tasks</h1>
        </div>
        <div className="col-span-6 flex justify-end items-center gap-4">
          <div className="flex items-center">
            <Autocomplete
              options={projects}
              size="small"
              getOptionLabel={(option) => option.projectName}
              value={project}
              onChange={(event, newValue) => setProject(newValue)}
              sx={{ width: 250 }}
              renderInput={(params) => (
                <TextField {...params} label="Select Project" />
              )}
            />
          </div>
          <div className="flex items-center">
            <Button
              variant="contained"
              sx={{ backgroundColor: "#2563DC" }}
              endIcon={<AddRoundedIcon />}
              onClick={() =>
                projects.length > 0
                  ? dispatch(toggleTaskModal())
                  : navigate("/projects")
              }
            >
              New Task
            </Button>
          </div>
        </div>
      </section>
      <section className="grid grid-cols-12 gap-4 mt-8">
        <div className="col-span-4">
          <TaskColumn
            title="To do"
            tasks={tasks}
            bgColor="#EEF2FC"
            brColor="#CAD9F6"
            color="#14367B"
            status={"todo"}
            icon={<CheckBoxOutlineBlankRoundedIcon />}
            onDrop={onDrop}
            setActiveCard={setActiveCard}
          />
        </div>
        <div className="col-span-4">
          <TaskColumn
            title="In progress"
            tasks={tasks}
            bgColor="#FFF6EB"
            brColor="#FFE4C2"
            color="#8F4F00"
            status={"inProgress"}
            icon={<HourglassEmptyOutlinedIcon />}
            onDrop={onDrop}
            setActiveCard={setActiveCard}
          />
        </div>
        <div className="col-span-4">
          <TaskColumn
            title="Done"
            tasks={tasks}
            bgColor="#FDF0EC"
            brColor="#FAD0C6"
            color="#81290E"
            status={"done"}
            icon={<CheckBoxOutlinedIcon />}
            onDrop={onDrop}
            setActiveCard={setActiveCard}
          />
        </div>
      </section>
    </div>
  );
};
export default Tasks;
