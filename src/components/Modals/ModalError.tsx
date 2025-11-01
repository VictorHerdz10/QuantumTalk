import { IonModal, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonRow, IonCol, IonButton, IonIcon, IonText } from "@ionic/react";
import { warning, close } from "ionicons/icons";
import "./ModalStyles.css";

interface ModalErrorProps {
  isOpen: boolean;
  onDismiss: () => void;
  title?: string;
  message: string;
  theme?: string;
}

const ModalError = ({ isOpen, onDismiss, title = "Error", message, theme = "light" }: ModalErrorProps) => {
  return (
    <IonModal isOpen={isOpen} onDidDismiss={onDismiss} className={`error-modal ${theme}`}>
      <IonCard className="error-card">
        <IonCardHeader className="error-card-header">
          <IonRow className="ion-justify-content-between ion-align-items-center">
            <IonCol size="auto" className="error-title-container">
              <IonIcon icon={warning} className="error-icon" />
              <IonCardTitle className="error-title">{title}</IonCardTitle>
            </IonCol>
            <IonCol size="auto">
              <IonButton fill="clear" className="close-button" onClick={onDismiss}>
                <IonIcon icon={close} slot="icon-only" />
              </IonButton>
            </IonCol>
          </IonRow>
        </IonCardHeader>
        <IonCardContent className="error-content">
          <IonText className="error-message">
            {message.split("\n").map((line, i) => (
              <p key={i} className="error-line" style={{ margin: i > 0 ? "0.5em 0 0" : "0" }}>
                {line}
              </p>
            ))}
          </IonText>
          <IonButton expand="block" className="modal-button" onClick={onDismiss}>
            Entendido
          </IonButton>
        </IonCardContent>
      </IonCard>
    </IonModal>
  );
};

export default ModalError;