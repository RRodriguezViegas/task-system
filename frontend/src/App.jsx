import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TasksList from "./pages/TasksList";
import TaskDetails from "./pages/TaskDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TasksList />} />
        <Route path="/tasks/:id" element={<TaskDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
