// ChatHomePage.tsx
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonAvatar,
  IonBadge,
  IonSearchbar,
  IonText
} from '@ionic/react';
import { add, search, moon, sunny, chatbubbles } from 'ionicons/icons';
import { useThemeStore } from '../../store/themeStore';
import './ChatPage.css';

const ChatPage = () => {
  const { theme, toggleTheme } = useThemeStore();
  
  const chats = [
    {
      id: 1,
      name: 'Ana Martínez',
      preview: '¡Hola! ¿Cómo estás?',
      time: '10:30 AM',
      unread: 2,
      avatarText: 'AM'
    },
    {
      id: 2,
      name: 'Grupo de Trabajo',
      preview: 'Carlos: Revisen el último commit',
      time: 'Ayer',
      unread: 0,
      avatarText: 'GT'
    },
    {
      id: 3,
      name: 'Soporte Técnico',
      preview: 'Hemos resuelto tu incidencia',
      time: 'Ayer',
      unread: 0,
      avatarText: 'ST'
    },
    {
      id: 4,
      name: 'David López',
      preview: 'Nos vemos mañana en la reunión',
      time: '7/20/23',
      unread: 5,
      avatarText: 'DL'
    },
    {
      id: 5,
      name: 'Comunidad Vecinos',
      preview: 'Recordatorio: reunión el viernes',
      time: '7/18/23',
      unread: 0,
      avatarText: 'CV'
    }
  ];

  return (
    <IonPage>
      <IonHeader className={`chat-home-header ${theme}`}>
        <IonToolbar>
          <IonTitle className="chat-home-title">Chats</IonTitle>
          <div slot="end" className="header-actions">
            <IonButton fill="clear" onClick={() => {}}>
              <IonIcon icon={search} />
            </IonButton>
            <IonButton fill="clear" onClick={toggleTheme}>
              <IonIcon icon={theme === 'dark' ? sunny : moon} />
            </IonButton>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className={`chat-home-container ${theme}`}>
        <div className="search-bar">
          <IonSearchbar
            className={`search-input ${theme}`}
            placeholder="Buscar chats..."
            animated
          />
        </div>

        {chats.length > 0 ? (
          <IonList className="chat-list">
            {chats.map(chat => (
              <IonItem 
                key={chat.id} 
                className="chat-item" 
                detail 
                routerLink={`/chat/${chat.id}`}
              >
                <IonAvatar slot="start" className="chat-avatar">
                  {chat.avatarText}
                </IonAvatar>
                
                <div className="chat-content">
                  <h3 className="chat-name">{chat.name}</h3>
                  <p className="chat-preview">{chat.preview}</p>
                </div>
                
                <div className="chat-meta">
                  <span className="chat-time">{chat.time}</span>
                  {chat.unread > 0 && (
                    <IonBadge className="chat-unread">{chat.unread}</IonBadge>
                  )}
                </div>
              </IonItem>
            ))}
          </IonList>
        ) : (
          <div className="empty-state">
            <IonIcon icon={chatbubbles} className="empty-icon" />
            <IonText className="empty-text">
              <h3>No tienes chats</h3>
              <p>Empieza una nueva conversación</p>
            </IonText>
            <IonButton 
              shape="round" 
              className="start-chat-button"
              routerLink="/new-chat"
            >
              Nuevo chat
            </IonButton>
          </div>
        )}

        <IonButton 
          className="new-chat-button" 
          routerLink="/new-chat"
        >
          <IonIcon icon={add} />
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default ChatPage;