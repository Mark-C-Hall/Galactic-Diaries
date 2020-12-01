import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Signup from "./components/Login/Signup";
import Home from "./components/layout/Home";
import Header from "./components/layout/Header";
import ForgotPassword from "./components/Login/ForgotPassword";
import ResetPassword from "./components/Login/ResetPassword";
import DraftPost from "./components/posts/DraftPost";
import Settings from "./components/settings/Settings";
import ChangePassword from "./components/settings/ChangePassword";

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Route exact path="/" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/home" component={Home} />
        <Route path="/forgotpassword" component={ForgotPassword} />
        <Route path="/resetpassword" component={ResetPassword} />
        <Route path="/draftpost" component={DraftPost} />
        <Route path="/settings" component={Settings} />
        <Route path="/changepassword" component={ChangePassword} />
      </Router>
    </div>
  );
}

export default App;
