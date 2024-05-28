import './App.css';
import Homepage from "./pages/Homepage";
import Chat from "./pages/Chat";
import {Route} from "react-router-dom" ;

function App() {

  return (
    <div className="App">
<Route path="/" exact component={Homepage}></Route>
<Route path="/chats" component={Chat}></Route>
    </div>


  
  );
}

export default App;

