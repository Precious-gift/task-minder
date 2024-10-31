import { Button, Paper } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridRowModes,
} from "@mui/x-data-grid";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useDispatch, useSelector } from "react-redux";
import { toggleProjectModal } from "../features/modal/modalSlice";
import { setProjects } from "../features/projects/projectSlice";
import { useEffect, useState } from "react";
import {
  deleteProjectFromDb,
  getProjectsFromDb,
  updateProjectFromDb,
} from "../firebase";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";

const paginationModel = { page: 0, pageSize: 5 };
const Projects = () => {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.projects.projects);
  const user = useSelector((state) => state.auth.user);
  const [rowModesModel, setRowModesModel] = useState({});
  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    projects.map((row) => {
      if (row.id === id) {
        deleteProjectFromDb(user, row);
        const fetchProjects = async () => {
          try {
            const projects = await getProjectsFromDb(user);
            dispatch(setProjects(projects));
          } catch (error) {
            console.error("Error fetching projects:", error);
          }
        };
        fetchProjects();
      }
    });
    //setRows(projects.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    // const editedRow = rows.find((row) => row.id === id);
    // if (editedRow.isNew) {
    //   setRows(rows.filter((row) => row.id !== id));
    // }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    updateProjectFromDb(user, newRow);
    const fetchProjects = async () => {
      try {
        const projects = await getProjectsFromDb(user);
        dispatch(setProjects(projects));
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
    //setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projects = await getProjectsFromDb(user);
        dispatch(setProjects(projects));
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    if (user) {
      fetchProjects();
    }
    return () => {};
  }, [dispatch, user]);

  console.log("projects", projects);
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "projectName",
      headerName: "Project name",
      width: 150,
      editable: true,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
              key={id}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
              key={id}
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
            key={id}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
            key={id}
          />,
        ];
      },
    },
  ];

  return (
    <div className="md:container md:mx-auto">
      <section className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <h1>Projects</h1>
        </div>
        <div className="col-span-6 flex justify-end align-center">
          <div>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#2563DC" }}
              endIcon={<AddRoundedIcon />}
              onClick={() => dispatch(toggleProjectModal())}
            >
              Create Project
            </Button>
          </div>
        </div>
      </section>
      <section className="grid grid-cols-12 gap-4 mt-8">
        <div className="col-span-12">
          <Paper sx={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={projects}
              columns={columns}
              editMode="row"
              rowModesModel={rowModesModel}
              onRowModesModelChange={handleRowModesModelChange}
              onRowEditStop={handleRowEditStop}
              processRowUpdate={processRowUpdate}
              initialState={{ pagination: { paginationModel } }}
              pageSizeOptions={[5, 10]}
              sx={{ border: 0 }}
            />
          </Paper>
        </div>
      </section>
    </div>
  );
};
export default Projects;
