import Landing from "./Components/Landing";
import Apps from "./views/Apps";
import Login from "./views/Login";
import SignUp from "./views/SignUp";
import Trans from "./views/Trans";

import { BrowserRouter, Route, Routes } from "react-router-dom";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/apps' element={<Apps />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/trans' element={<Trans />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
