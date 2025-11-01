import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonIcon,
  IonText,
  IonRouterLink,
} from "@ionic/react";
import { mail, lockClosed, sunny, moon, chatbubbles,} from "ionicons/icons";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useThemeStore } from "../../store/themeStore";
import "./AuthPages.css";
import ModalError from "../../components/Modals/ModalError";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const history = useHistory();
  const { login, error, clearError, isLoading } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [frontendErrors, setFrontendErrors] = useState<string[]>([]);

  const handleInputChange = (field: keyof typeof formData) => 
    (e: CustomEvent) => {
      const input = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [field]: input.value || ''
      }));
    };

  const validateForm = () => {
    const errors = [];

    if (!formData.email) {
      errors.push("El correo electrónico es requerido");
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.push("Ingrese un email válido");
    }

    if (!formData.password) {
      errors.push("La contraseña es requerida");
    }

    setFrontendErrors(errors);
    return errors.length === 0;
  };

   const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) {
    setShowErrorModal(true);
    return;
  }

  try {
    await login(formData.email, formData.password);
    history.push('/chat');
  } catch {
    setShowErrorModal(true);
  }
};

  return (
    <IonPage>
      <IonHeader className={`ion-no-border ${theme}`}>
        <IonToolbar className={`auth-toolbar ${theme}`} style={{ paddingTop: 'var(--ion-safe-area-top)' }}>
          <IonButtons slot="start">
            <IonBackButton
              defaultHref="/welcome"
              text=""
              className={`back-button ${theme}`}
            />
          </IonButtons>
          <IonTitle className={`auth-toolbar-title ${theme}`}>
            Iniciar Sesión
          </IonTitle>
          <IonButtons slot="end">
            <IonButton
              onClick={toggleTheme}
              className={`theme-toggle ${theme}`}
            >
              <IonIcon
                icon={theme === "dark" ? sunny : moon}
                className={theme === "dark" ? "sol" : "luna"}
              />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className={`auth-content ${theme}`} scrollY={false}>
        <div className="auth-container">
          <div className="auth-logo">
            <IonIcon icon={chatbubbles} className="logo-icon" />
            <IonText className="auth-title">QuantumTalk</IonText>
            <IonText className="auth-subtitle">Ingresa a tu cuenta</IonText>
          </div>

          <form className="auth-form" onSubmit={handleLogin} noValidate>
            <IonItem className={`auth-input ${theme}`} lines="none">
              <IonIcon icon={mail} slot="start" className="auth-input-icon" />
              <IonLabel position="stacked" className="auth-input-label">
                Correo electrónico
              </IonLabel>
              <IonInput
                type="email"
                value={formData.email}
                onIonInput={handleInputChange('email')}
                className="auth-input-field"
                placeholder="tucorreo@ejemplo.com"
              />
            </IonItem>

            <IonItem className={`auth-input ${theme}`} lines="none">
              <IonIcon
                icon={lockClosed}
                slot="start"
                className="auth-input-icon"
              />
              <IonLabel position="stacked" className="auth-input-label">
                Contraseña
              </IonLabel>
              <IonInput
                type="password"
                value={formData.password}
                onIonInput={handleInputChange('password')}
                className="auth-input-field"
                placeholder="••••••••"
              />
            </IonItem>

            <div className="auth-actions">
              <IonButton
                type="submit"
                expand="block"
                className="auth-button"
                disabled={isLoading}
              >
                {isLoading ? "Cargando..." : "Iniciar Sesión"}
              </IonButton>
            </div>

            <div className="auth-footer">
              <IonText>
                ¿No tienes una cuenta?{" "}
                <IonRouterLink routerLink="/register" className="auth-link">
                  Regístrate
                </IonRouterLink>
              </IonText>
            </div>
          </form>
        </div>

         <ModalError
        isOpen={showErrorModal}
        onDismiss={() => {
          setShowErrorModal(false);
          clearError();
          setFrontendErrors([]);
        }}
        message={
          frontendErrors.length > 0 
            ? frontendErrors.join("\n") 
            : error || ""
        }
        theme={theme}
      />
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;