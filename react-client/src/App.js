import Landing from './Components/Landing';
import Apps from './views/Apps';
import Chat from './views/chat';
import Login from './views/Login';
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
    </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
