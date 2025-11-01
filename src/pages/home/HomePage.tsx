import {
  IonPage,
  IonContent,
  IonButton,
  IonText,
  IonIcon,
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
  IonBadge,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonFab,
  IonFabButton
} from "@ionic/react";
import { 
  chatbubbles, 
  person, 
  moon, 
  sunny, 
  add,
  people,
  settings
} from "ionicons/icons";
import { useAuthStore } from "../../store/authStore";
import { useThemeStore } from "../../store/themeStore";
import { useEffect, useState } from "react";
import "./Home.css";
import { Capacitor } from "@capacitor/core";
import { App as CapacitorApp } from "@capacitor/app";

type Chat = {
  id: string;
  contact: string;
  lastMessage: string;
  unread: number;
  timestamp: string;
  avatar?: string;
};

const HomePage = () => {
  const { user } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [hasChats, setHasChats] = useState(false);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSegment, setActiveSegment] = useState("chats");

  // Datos de ejemplo para los chats
  const [chats, setChats] = useState<Chat[]>([
    {
      id: "1",
      contact: "Juan Pérez",
      lastMessage: "Hola, ¿cómo estás?",
      unread: 2,
      timestamp: "10:30 AM"
    },
    {
      id: "2",
      contact: "María García",
      lastMessage: "Te envié el documento",
      unread: 0,
      timestamp: "Ayer"
    },
    {
      id: "3",
      contact: "Carlos López",
      lastMessage: "Nos vemos mañana",
      unread: 5,
      timestamp: "Lunes"
    }
  ]);

  // Simular carga inicial de chats
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasChats(chats.length > 0);
    }, 1500);
    return () => clearTimeout(timer);
  }, [chats.length]);

  // Manejar el botón atrás físico de Android
  useEffect(() => {
    const handleBackButton = () => {
      if (Capacitor.getPlatform() === 'android') {
        CapacitorApp.exitApp();
      }
    };

    if (Capacitor.isNativePlatform()) {
      document.addEventListener('ionBackButton', handleBackButton);
      return () => {
        document.removeEventListener('ionBackButton', handleBackButton);
      };
    }
  }, []);



  const filteredChats = chats.filter(chat =>
    chat.contact.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <IonPage className={theme}>
  {hasChats ? (
    <>
      {/* Header mejorado */}
      <IonHeader className={`app-header ${theme}`}>
        <IonToolbar className={`app-toolbar ${theme}`} style={{ paddingTop: 'var(--ion-safe-area-top)' }}>
          <IonTitle className={`app-title ${theme}`}>QuantumTalk</IonTitle>
          
          <IonButtons slot="end" className={`header-controls ${theme}`}>
            <IonButton onClick={toggleTheme} className={`theme-toggle ${theme}`}>
              <IonIcon 
                icon={theme === 'dark' ? sunny : moon} 
                className="theme-toggle-icon"
              />
            </IonButton>
            
            <IonButton routerLink="/settings" className={`settings-button ${theme}`}>
              <IonIcon icon={settings} className="settings-icon" />
            </IonButton>
            
            <IonButton routerLink="/profile" className={`profile-button ${theme}`}>
              {user?.image ? (
                <IonAvatar className={`user-avatar ${theme}`}>
                  <img src={user.image} alt="User" />
                </IonAvatar>
              ) : (
                <IonAvatar className={`user-avatar ${theme}`}>
                  <IonIcon icon={person} />
                </IonAvatar>
              )}
            </IonButton>
          </IonButtons>
        </IonToolbar>

        <IonToolbar className={`app-toolbar ${theme}`}>
          <IonSearchbar
            value={searchQuery}
            onIonChange={e => setSearchQuery(e.detail.value!)}
            placeholder="Buscar chats"
            className="chat-search"
          />
        </IonToolbar>
      </IonHeader>

          <IonContent className={`chat-content ${theme}`}>
            {/* Segment para navegación */}
            <IonSegment 
              value={activeSegment} 
              onIonChange={e => setActiveSegment(e.detail.value as string)}
              className={`nav-segment ${theme}`}
            >
              <IonSegmentButton value="chats">
                <IonIcon icon={chatbubbles} />
                <IonLabel>Chats</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="contacts">
                <IonIcon icon={people} />
                <IonLabel>Contactos</IonLabel>
              </IonSegmentButton>
            </IonSegment>

            {/* Lista de chats */}
            {activeSegment === 'chats' && (
              <IonList className="chat-list">
                {filteredChats.map(chat => (
                  <IonItem 
                    key={chat.id}
                    button
                    detail
                    className={`chat-item ${activeChat === chat.id ? 'active' : ''}`}
                    onClick={() => setActiveChat(chat.id)}
                  >
                    <IonAvatar slot="start" className="chat-avatar">
                      <IonIcon icon={person} />
                    </IonAvatar>
                    <IonLabel className="chat-info">
                      <h2 className="chat-contact">{chat.contact}</h2>
                      <p className="chat-preview">{chat.lastMessage}</p>
                    </IonLabel>
                    <div className="chat-meta">
                      <span className="chat-time">{chat.timestamp}</span>
                      {chat.unread > 0 && (
                        <IonBadge className="unread-badge">
                          {chat.unread}
                        </IonBadge>
                      )}
                    </div>
                  </IonItem>
                ))}
              </IonList>
            )}

            {/* Contenido de contactos */}
            {activeSegment === 'contacts' && (
              <div className="contacts-container">
                <IonText className="coming-soon-text">
                  Sección de contactos - Próximamente
                </IonText>
              </div>
            )}
          </IonContent>

        </>
      ) : (
        <IonContent className={`home-content ${theme}`}>
          {/* Pantalla de bienvenida inicial */}
          <div className="theme-toggle-container">
            <IonButton 
              fill="clear" 
              onClick={toggleTheme}
              className="theme-toggle-button"
            >
              <IonIcon 
                icon={theme === 'dark' ? sunny : moon} 
                className="theme-toggle-icon"
              />
            </IonButton>
          </div>

          <div className="welcome-section">
            <IonIcon icon={chatbubbles} className="logo-icon" />
            <IonText>
              <h1 className="welcome-title">¡Hola, {user?.name || 'Usuario'}!</h1>
              <p className="welcome-subtitle">Bienvenido a QuantumTalk</p>
            </IonText>
          </div>

          <div className="empty-state">
            <IonText>
              <p className="empty-message">No tienes chats aún</p>
            </IonText>
          </div>

          {/* Botón flotante para nuevo chat */}
          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton 
              routerLink="/new-chat" 
              className="new-chat-fab"
            >
              <IonIcon icon={add} />
            </IonFabButton>
          </IonFab>
        </IonContent>
      )}
    </IonPage>
  );
};

export default HomePage;