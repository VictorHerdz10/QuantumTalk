import {
  IonPage,
  IonContent,
  IonButton,
  IonImg,
  IonText,
  IonIcon,
} from "@ionic/react";
import { arrowForward, chatbubbles, flash, lockClosed } from "ionicons/icons";
import { useEffect, useState } from "react";
import chatPreview from "../assets/chat-preview.1.png";
import ThemeToggle from "../components/ThemeToggle";
import "./Welcome.css";
import { useThemeStore } from "../store/themeStore";

const WelcomePage = () => {
  const { theme } = useThemeStore();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const messages = [
    { text: "Hola 👋", position: "left" },
    { text: "¡Bienvenido a QuantumTalk!", position: "right" },
    { text: "Chat seguro y rápido", position: "left" },
    { text: "Conéctate ahora", position: "right" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <IonPage className={theme}>
      <IonContent className={`welcome-content ${theme}`}style={{ paddingTop: 'var(--ion-safe-area-top)' }} scrollY={false}>
        <ThemeToggle />

        <div className="welcome-container">
          <div className="header">
            <IonIcon icon={chatbubbles} className="logo-icon" />
            <IonText>
              <h1 className="app-title">QuantumTalk</h1>
            </IonText>
            <IonText>
              <p className="app-subtitle">Comunicación segura y encriptada</p>
            </IonText>
          </div>

          <div className="chat-section">
            <IonImg
              src={chatPreview}
              alt="Chat preview"
              className="chat-image"
            />
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message-bubble ${msg.position} ${
                  index === currentMessageIndex ? "visible" : ""
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="features">
            <div className="feature">
              <IonIcon icon={flash} />
              <span>Velocidad extrema</span>
            </div>
            <div className="feature">
              <IonIcon icon={lockClosed} />
              <span>Encriptación E2E</span>
            </div>
          </div>

          <IonButton
            expand="block"
            className="start-button"
            routerLink="/login"
          >
            Comenzar ahora
            <IonIcon slot="end" icon={arrowForward} />
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default WelcomePage;
