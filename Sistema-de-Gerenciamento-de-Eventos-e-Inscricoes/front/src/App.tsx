import NavBar from "./components/nav-bar/NavBar";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <NavBar></NavBar>
      <Outlet></Outlet>
    </div>
  );
}

export default App;
