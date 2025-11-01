import { IonModal, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonRow, IonCol, IonButton, IonIcon, IonText } from "@ionic/react";
import { checkmarkCircle, close } from "ionicons/icons";
import "./ModalStyles.css";

interface ModalSuccessProps {
  isOpen: boolean;
  onDismiss: () => void;
  title?: string;
  message: string;
  theme?: string;
  showLoginButton?: boolean;
  onLoginRedirect?: () => void;
}

const ModalSuccess = ({ 
  isOpen, 
  onDismiss, 
  title = "Éxito", 
  message, 
  theme = "light", 
  showLoginButton = false,
  onLoginRedirect 
}: ModalSuccessProps) => {
  return (
    <IonModal 
      isOpen={isOpen} 
      onDidDismiss={onDismiss} 
      className={`modal-base success-modal ${theme}`}
      backdropDismiss={true}
    >
      <IonCard className="modal-card success-card">
        <IonCardHeader className="modal-header success-card-header">
          <IonRow className="ion-justify-content-between ion-align-items-center">
            <IonCol size="auto" className="title-container success-title-container">
              <IonIcon icon={checkmarkCircle} className="success-icon" />
              <IonCardTitle className="modal-title success-title">{title}</IonCardTitle>
            </IonCol>
            <IonCol size="auto">
              <IonButton 
                fill="clear" 
                className="close-button" 
                onClick={onDismiss}
                aria-label="Cerrar"
              >
                <IonIcon icon={close} slot="icon-only" />
              </IonButton>
            </IonCol>
          </IonRow>
        </IonCardHeader>
        <IonCardContent className="modal-content success-content">
          <IonText className="modal-message success-message">
            {message.split("\n").map((line, i) => (
              <p key={i} className="success-line">
                {line}
              </p>
            ))}
          </IonText>
          <div className="modal-actions">
            {showLoginButton && (
              <IonButton 
                expand="block" 
                className="modal-button login-button" 
                onClick={onLoginRedirect}
              >
                Ir a Iniciar Sesión
              </IonButton>
            )}
            <IonButton 
              expand="block" 
              className="modal-button" 
              onClick={onDismiss}
            >
              Continuar
            </IonButton>
          </div>
        </IonCardContent>
      </IonCard>
    </IonModal>
  );
};

export default ModalSuccess;