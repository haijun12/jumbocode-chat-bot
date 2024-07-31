import Homepage from "./components/Homepage";
import Login from "./components/Login";
import { Route, Switch, Redirect } from "wouter";
import { useState } from "react";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <>
      <Switch>
        
        <Route path="/">
          {isLoggedIn ? <Homepage /> : <Redirect to="/login" />}
        </Route>
        <Route path="/login">
          {isLoggedIn ? <Redirect to="/" /> : <Login setIsLoggedIn={setIsLoggedIn} />}
        </Route>

        {/* Shows a 404 error if the path doesn't match anything */}
        {
          <Route>
            <p className="p-4">404: Page Not Found</p>
          </Route>
        }
      </Switch>
    </>
  );
};

export default App;
