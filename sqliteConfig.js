import SQLite from "react-native-sqlite-storage";

// Defining Database in const
const db = SQLite.openDatabase(
  { name: "db.TodoDB", location: "default" },
  () => {},
  (error) => {
    console.log("DB ERROR => ", error);
  }
);

export default db;
