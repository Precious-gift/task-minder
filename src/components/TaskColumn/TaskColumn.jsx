import { Typography } from "@mui/material";
import { Fragment, useState } from "react";
import { DropArea, TaskCard } from "../../components";

const TaskColumn = ({
  tasks,
  title,
  icon,
  status,
  onDrop,
  setActiveCard,
  bgColor,
  brColor,
  color,
}) => {
  return (
    <section
      className={`bg-[${bgColor}] p-3 rounded-[12px] border-2 border-solid h-full flex flex-col`}
      style={{
        backgroundColor: bgColor,
        borderColor: brColor,
      }}
    >
      <Typography variant="h5" color={color} gutterBottom>
        {icon} {title}
      </Typography>
      <div className="flex flex-col flex-grow">
        <DropArea onDrop={() => onDrop(status, 0)} />
        {tasks &&
          tasks.map(
            (task, index) =>
              task.status === status && (
                <Fragment key={task.id}>
                  <TaskCard
                    task={task}
                    brColor={brColor}
                    index={index}
                    setActiveCard={setActiveCard}
                  />
                  <DropArea onDrop={() => onDrop(status, index + 1)} />
                </Fragment>
              )
          )}
      </div>
    </section>
  );
};
export default TaskColumn;
