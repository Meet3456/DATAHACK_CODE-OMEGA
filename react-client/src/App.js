import Landing from './Components/Landing';
import Apps from './views/Apps';
import Chat from './views/chat';
import Login from './views/Login';
import SignUp from './views/SignUp';
import { BrowserRouter, Route,Routes} from 'react-router-dom';
function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
      <Route path='/'element={<Landing/>}/>
      <Route path='/apps'element={<Apps/>}/> 
      <Route path='/chat'element={<Chat/>}/>
      <Route path='/login'element={<Login/>}/>   
      <Route path='/signup'element={<SignUp/>}/>  
    </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
