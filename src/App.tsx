import Homepage from "./components/Homepage";
import Login from "./components/Login";
import { Route, Switch, useLocation } from "wouter";
import { useState, useEffect } from "react";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoggedIn && location !== "/login") {
      setLocation("/login");
    } else if (isLoggedIn && location === "/login") {
      setLocation("/");
    }
  }, [isLoggedIn, location, setLocation]);

  return (
    <Switch>
      <Route path="/">
        <Homepage />
      </Route>
      <Route path="/login">
        <Login setIsLoggedIn={setIsLoggedIn} />
      </Route>
      <Route>
        <p className="p-4">404: Page Not Found</p>
      </Route>
    </Switch>
  );
};

export default App;