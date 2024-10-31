// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional "task-minder-52daf.firebaseapp.com"
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
console.log(analytics);
const db = getFirestore(app);
export const auth = getAuth(app);

export const addUserToDb = async (user) => {
  try {
    const docRef = doc(db, "users", `${user.displayName}-${user.uid}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    } else {
      await setDoc(doc(db, "users", `${user.displayName}-${user.uid}`), {
        displayName: user.displayName,
        email: user.email,
      });
      console.log("Document written with ID: ", docRef);
    }
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const addProjectToDb = async (user, projectName) => {
  try {
    const userCollectionRef = collection(
      db,
      "users",
      `${user.displayName}-${user.uid}`,
      "projects"
    );

    await addDoc(userCollectionRef, {
      projectName: projectName,
      timestamp: serverTimestamp(),
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const updateProjectFromDb = async (user, newRow) => {
  try {
    const userDocRef = doc(
      db,
      "users",
      `${user.displayName}-${user.uid}`,
      "projects",
      `${newRow.docid}`
    );

    await updateDoc(userDocRef, {
      projectName: newRow.projectName,
      timestamp: serverTimestamp(),
    });
  } catch (e) {
    console.error("Error updating document: ", e);
  }
};

export const deleteProjectFromDb = async (user, newRow) => {
  try {
    const userDocRef = doc(
      db,
      "users",
      `${user.displayName}-${user.uid}`,
      "projects",
      `${newRow.docid}`
    );

    await deleteDoc(userDocRef);
  } catch (e) {
    console.error("Error deleting document: ", e);
  }
};

export const getProjectsFromDb = async (user) => {
  try {
    const projects = [];
    const userCollectionRef = collection(
      db,
      "users",
      `${user.displayName}-${user.uid}`,
      "projects"
    );
    const querySnapshot = await getDocs(userCollectionRef);
    let index = 1;
    if (querySnapshot) {
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots

        const { projectName } = doc.data();
        projects.push({ id: index, docid: doc.id, projectName });
        index++;
      });
    }
    console.log(projects);
    return projects;
  } catch (e) {
    console.error("Error getting projects: ", e);
  }
};

export const addTaskToDb = async (user, taskDesc, projectId) => {
  try {
    const userCollectionRef = collection(
      db,
      "users",
      `${user.displayName}-${user.uid}`,
      "projects",
      projectId,
      "tasks"
    );

    await addDoc(userCollectionRef, {
      projectId,
      taskDesc: taskDesc,
      status: "todo",
      timestamp: serverTimestamp(),
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const setTaskToDb = async (user, task) => {
  try {
    const userDocRef = doc(
      db,
      "users",
      `${user.displayName}-${user.uid}`,
      "projects",
      task.projectId,
      "tasks",
      `${task.docid}`
    );

    await setDoc(userDocRef, {
      projectId: task.projectId,
      taskDesc: task.taskDesc,
      status: task.status,
      timestamp: task.timestamp,
    });
  } catch (e) {
    console.error("Error setting task document: ", e);
  }
};

export const getTasksFromDb = async (user, projectId) => {
  try {
    const tasksWithPosition = [];
    const tasksWithoutPosition = [];
    const userCollectionRef = collection(
      db,
      "users",
      `${user.displayName}-${user.uid}`,
      "projects",
      projectId,
      "tasks"
    );

    // Retrieve all tasks without ordering
    const querySnapshot = await getDocs(userCollectionRef);

    let index = 1;
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const task = {
        id: index,
        docid: doc.id,
        projectId: data.projectId,
        taskDesc: data.taskDesc,
        status: data.status,
        timestamp:
          typeof data.timestamp === "string"
            ? data.timestamp
            : data.timestamp?.toDate().toString() || null,
      };

      // Separate tasks based on the presence of the "position" field
      if (data.hasOwnProperty("position")) {
        tasksWithPosition.push({ ...task, position: data.position });
      } else {
        tasksWithoutPosition.push(task);
      }
      index++;
    });

    // Sort tasks with position by "position" value
    tasksWithPosition.sort((a, b) => a.position - b.position);

    // Concatenate tasks without position at the beginning
    const finalTasks = [...tasksWithoutPosition, ...tasksWithPosition];

    return finalTasks;
  } catch (e) {
    console.error("Error getting tasks: ", e);
  }
};

export const updateTaskFromDb = async (user, projectId, newRow) => {
  try {
    const userDocRef = doc(
      db,
      "users",
      `${user.displayName}-${user.uid}`,
      "projects",
      projectId,
      "tasks",
      `${newRow.docid}`
    );

    await updateDoc(userDocRef, {
      taskDesc: newRow.taskDesc,
      status: newRow.status,
      timestamp: serverTimestamp(),
    });
  } catch (e) {
    console.error("Error updating task document: ", e);
  }
};

export const deleteTaskFromDb = async (user, newRow) => {
  try {
    const userDocRef = doc(
      db,
      "users",
      `${user.displayName}-${user.uid}`,
      "projects",
      `${newRow.projectId}`,
      "tasks",
      `${newRow.docid}`
    );

    await deleteDoc(userDocRef);
  } catch (e) {
    console.error("Error deleting task document: ", e);
  }
};

export const updateAllTasksWithBatch = async (user, tasks) => {
  const batch = writeBatch(db);

  try {
    // First, clear out the current tasks to avoid duplicate documents
    tasks.forEach((task) => {
      const taskDocRef = doc(
        db,
        "users",
        `${user.displayName}-${user.uid}`,
        "projects",
        task.projectId,
        "tasks",
        task.docid
      );
      batch.delete(taskDocRef);
    });

    // Re-add each task with an explicit position field for ordering
    tasks.forEach((task, index) => {
      const taskDocRef = doc(
        db,
        "users",
        `${user.displayName}-${user.uid}`,
        "projects",
        task.projectId,
        "tasks",
        task.docid
      );

      batch.set(taskDocRef, {
        projectId: task.projectId,
        taskDesc: task.taskDesc,
        status: task.status,
        timestamp: task.timestamp,
        position: index, // New field to define order
      });
    });

    // Commit the batch operation
    await batch.commit();
    console.log("All tasks have been successfully updated in the new order.");
  } catch (error) {
    console.error("Error updating tasks with batch:", error);
  }
};
