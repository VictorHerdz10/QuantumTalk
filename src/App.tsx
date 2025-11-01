import { Redirect, Route } from "react-router-dom";
import {
  IonAlert,
  IonApp,
  IonLoading,
  IonRouterOutlet,
  setupIonicReact,
  useIonRouter,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { App as CapacitorApp } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
//import Home from "./pages/Home";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
import "@ionic/react/css/palettes/dark.class.css";
//import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";
import WelcomePage from "./pages/WelcomePage";
import { useApplyTheme } from "./store/themeStore";
import { useAuthStore } from "./store/authStore";
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import { useEffect, useState } from "react";
import HomePage from "./pages/home/HomePage";
import ProfilePage from "./pages/profile/ProfilePage";

setupIonicReact({
  mode: "md",
  hardwareBackButton: true,
  scrollAssist: false,
  scrollPadding: false,
});

const App: React.FC = () => {
  const ionRouter = useIonRouter();
  useApplyTheme();
  const { isLoading, isAuthenticated, verifyAuth } = useAuthStore();
  const [authChecked, setAuthChecked] = useState(false);
  const [showExitAlert, setShowExitAlert] = useState(false);

  // Verificar autenticación al cargar la app
  useEffect(() => {
    const checkAuth = async () => {
      await verifyAuth();
      setAuthChecked(true);
    };
    checkAuth();
  }, [verifyAuth]);

  // Manejar el botón "Atrás" de Android
  useEffect(() => {
    const handleBackButton = () => {
      // Si estamos en una ruta que no es la inicial (/) o welcome, permite navegar atrás
      if (
        ionRouter.routeInfo.pathname !== "/" &&
        ionRouter.routeInfo.pathname !== "/welcome"
      ) {
        ionRouter.goBack();
      } else {
        // Para rutas iniciales, muestra la alerta de salida
        setShowExitAlert(true);
      }
    };
    if (Capacitor.getPlatform() === "android") {
      // Listener para el botón atrás con tipado correcto
      const backButtonListener = (ev: CustomEvent) => {
        ev.detail.register(-1, () => {
          handleBackButton();
        });
      };

      document.addEventListener(
        "ionBackButton",
        backButtonListener as EventListener
      );

      return () => {
        document.removeEventListener(
          "ionBackButton",
          backButtonListener as EventListener
        );
      };
    }
  }, [ionRouter]);

  if (!authChecked) {
    return (
      <IonApp>
        <IonLoading
          isOpen={true}
          message="Verificando sesión..."
          spinner="circles"
        />
      </IonApp>
    );
  }

  return (
    <IonApp>
      <IonLoading isOpen={isLoading} message="Cargando..." spinner="circles" />

      {/* Alert personalizado para salir de la app */}
      <IonAlert
        isOpen={showExitAlert}
        onDidDismiss={() => setShowExitAlert(false)}
        header="¿Salir de la aplicación?"
        message="¿Estás seguro que deseas salir de QuantumTalk?"
        buttons={[
          {
            text: "Cancelar",
            role: "cancel",
            cssClass: "secondary",
          },
          {
            text: "Salir",
            handler: () => {
              CapacitorApp.exitApp();
            },
          },
        ]}
        cssClass="custom-alert"
      />

      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/welcome">
            {isAuthenticated ? <Redirect to="/chat" /> : <WelcomePage />}
          </Route>
          <Route exact path="/login">
            {isAuthenticated ? <Redirect to="/chat" /> : <LoginPage />}
          </Route>
          <Route exact path="/register">
            {isAuthenticated ? <Redirect to="/chat" /> : <RegisterPage />}
          </Route>
          <Route exact path="/chat">
            {isAuthenticated ? <HomePage /> : <Redirect to="/login" />}
          </Route>
          <Route exact path="/profile">
            {isAuthenticated ? <ProfilePage /> : <Redirect to="/login" />}
          </Route>
          <Redirect
            exact
            from="/"
            to={isAuthenticated ? "/chat" : "/welcome"}
          />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
