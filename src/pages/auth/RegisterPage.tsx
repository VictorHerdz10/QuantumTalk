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
import { person, mail, lockClosed, sunny, moon, chatbubbles, } from "ionicons/icons";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useThemeStore } from "../../store/themeStore";
import "./AuthPages.css";
import ModalError from "../../components/Modals/ModalError";
import ModalSuccess from "../../components/Modals/ModalSuccess";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  
  const history = useHistory();
  const { register, error, clearError, isLoading, isAuthenticated } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
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
    
    if (!formData.name) {
      errors.push("El nombre completo es requerido");
    }
    
    if (!formData.email) {
      errors.push("El correo electrónico es requerido");
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.push("Ingrese un email válido");
    }
    
    if (!formData.password) {
      errors.push("La contraseña es requerida");
    } else if (formData.password.length < 6) {
      errors.push("La contraseña debe tener al menos 6 caracteres");
    }
    
    setFrontendErrors(errors);
    return errors.length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!validateForm()) {
    setShowErrorModal(true);
    return;
  }
  
  try {
    const successMessage = await register(
      formData.name, 
      formData.email, 
      formData.password
    );
    setSuccessMessage(successMessage || "¡Registro exitoso!");
    setShowSuccessModal(true);
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
              defaultHref="/login"
              text=""
              className={`back-button ${theme}`}
            />
          </IonButtons>
          <IonTitle className={`auth-toolbar-title ${theme}`}>
            Registro
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
            <IonText className="auth-subtitle">Crea tu cuenta</IonText>
          </div>

          <form className="auth-form" onSubmit={handleRegister} noValidate>
            <IonItem className={`auth-input ${theme}`} lines="none">
              <IonIcon icon={person} slot="start" className="auth-input-icon" />
              <IonLabel position="stacked" className="auth-input-label">
                Nombre completo
              </IonLabel>
              <IonInput
                type="text"
                value={formData.name}
                onIonInput={handleInputChange('name')}
                className="auth-input-field"
                placeholder="Tu nombre completo"
              />
            </IonItem>

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
                {isLoading ? 'Cargando...' : 'Registrarse'}
              </IonButton>
            </div>

            <div className="auth-footer">
              <IonText>
                ¿Ya tienes una cuenta?{" "}
                <IonRouterLink routerLink="/login" className="auth-link">
                  Inicia sesión
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
      message={frontendErrors.length > 0 ? frontendErrors.join("\n") : error || ""}
      theme={theme}
    />
    
    <ModalSuccess
      isOpen={showSuccessModal}
      onDismiss={() => {
        setShowSuccessModal(false);
      }}
      message={successMessage}
      theme={theme}
      showLoginButton={!isAuthenticated}
      onLoginRedirect={() => {
        setShowSuccessModal(false);
        history.push('/login');
      }}
    />
      </IonContent>
    </IonPage>
  );
};

export default RegisterPage;