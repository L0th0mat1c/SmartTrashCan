import "./App.css";
import Router from "./routes/router";
import { AuthContextProvider } from "./contexts/AuthContext";

const App = () => {
  return (
    <AuthContextProvider>
      <Router />
    </AuthContextProvider>
  );
};

export default App;
