import { Route, Switch } from "wouter";

// Import pages
import DashboardPage from "@/pages/dashboard";
import LoginPage from "@/pages/login";
import NotFoundPage from "@/pages/not-found";
import SignupPage from "@/pages/signup";
import UserFormPage from "@/pages/user-form";
import UsersPage from "@/pages/users";
import ProtectedRoute from "./protectedRoute";

const routes = [
  { path: "/login", component: LoginPage },
  { path: "/signup", component: SignupPage },
  { path: "/", component: DashboardPage, protected: true },
  { path: "/users", component: UsersPage, protected: true },
  { path: "/users/new", component: UserFormPage, protected: true },
  { path: "/users/edit/:id", component: UserFormPage, protected: true },
];

function Router() {
  return (
    <Switch>
      {routes.map(({ path, component: Component, protected: isProtected }) => (
        <Route
          key={path}
          path={path}
          component={
            isProtected
              ? () => <ProtectedRoute component={Component} />
              : Component
          }
        />
      ))}
      <Route component={NotFoundPage} />
    </Switch>
  );
}

export default Router;
