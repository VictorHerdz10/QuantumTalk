import { Route, Redirect, RouteProps } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { IonLoading } from "@ionic/react";

interface ProtectedRouteProps extends RouteProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<any>;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  component: Component, 
  ...rest 
}) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) return <IonLoading isOpen />;

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
};