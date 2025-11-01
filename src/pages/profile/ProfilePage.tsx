import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonAvatar,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonBackButton,
  IonSpinner,
  IonActionSheet,
} from "@ionic/react";
import {
  save,
  pencil,
  close,
  camera,
  image,
  closeCircle,
} from "ionicons/icons";
import { useAuthStore } from "../../store/authStore";
import { useProfileStore } from "../../store/profileStore";
import {  useRef, useState } from "react";
import "./Profile.css";
import { Camera, CameraResultType } from "@capacitor/camera";
import ModalError from "../../components/Modals/ModalError";
import ModalSuccess from "../../components/Modals/ModalSuccess";
import { person, mail, call, informationCircle } from "ionicons/icons";
import { useThemeStore } from "../../store/themeStore";

const ProfilePage = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user: authUser, isLoading: isAuthLoading } = useAuthStore();
   const { theme } = useThemeStore();
  const {
    isLoading,
    isEditing,
    tempImage,
    setEditing,
    updateUserProfile,
    uploadImage,
    resetTempImage,
  } = useProfileStore();
  
  const [isUploading, setIsUploading] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

 // Estado optimizado con referencia
  const [formData, setFormData] = useState({
    name: authUser?.name || "",
    email: authUser?.email || "",
    phone: authUser?.phone || "",
    info: authUser?.info || "",
  });
  const formDataRef = useRef(formData);

  // Sincronización inmediata de cambios
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    const newData = { ...formDataRef.current, [field]: value };
    setFormData(newData);
    formDataRef.current = newData; // Actualización inmediata
  };

  // Guardado garantizado
  const handleSave = async () => {
    try {
      console.log("Datos a enviar:", formDataRef.current);
      const update = await updateUserProfile(formDataRef.current); // Usamos la referencia actualizada
      setSuccess("¡Perfil actualizado correctamente!");
      setEditing(false);
      
      // Actualización visual inmediata
      if (update) {
        setFormData({
          name: update.name || "",
          email: update.email || "",
          phone: update.phone || "",
          info: update.info || "",
        });
      }
    } catch (err) {
    // Manejo seguro de errores
    let errorMessage = "Error al guardar los cambios";
    
    if (typeof err === 'object' && err !== null) {
      // Error estándar de TypeScript/JavaScript
      if ('message' in err) {
        errorMessage = err.message as string;
      }
      // Error personalizado del backend (ajusta según tu API)
      if ('response' in err && typeof err.response === 'object' && err.response !== null) {
        if ('data' in err.response && typeof err.response.data === 'object' && err.response.data !== null) {
          if ('msg' in err.response.data) {
            errorMessage = err.response.data.msg as string;
          }
        }
      }
    }
    
    setError(errorMessage);
    console.error("Error al actualizar perfil:", err);
  }
  };

  // Toggle mejorado
  const handleEditToggle = () => {
    if (isEditing) {
      // Reset solo al cancelar
      if (authUser) {
        const resetData = {
          name: authUser.name || "",
          email: authUser.email || "",
          phone: authUser.phone || "",
          info: authUser.info || "",
        };
        setFormData(resetData);
        formDataRef.current = resetData;
      }
      resetTempImage();
    }
    setEditing(!isEditing);
  };

   const handleImageSourceSelect = async (source: 'camera' | 'gallery') => {
    setShowActionSheet(false);
    
    try {
      if (source === 'camera') {
        setIsUploading(true);
        const photo = await Camera.getPhoto({
          quality: 90,
          allowEditing: true,
          resultType: CameraResultType.Uri
        });
        
        const response = await fetch(photo.webPath!);
        const blob = await response.blob();
        const file = new File([blob], 'profile.jpg', { type: blob.type });
        await uploadImage(file);
        setSuccess('Imagen de perfil actualizada correctamente');
      } else {
        // Usamos un setTimeout para asegurar que el click se procese después de cerrar el ActionSheet
        setTimeout(() => {
          fileInputRef.current?.click();
        }, 100);
      }
    } catch (err) {
    // Manejo seguro de errores
    let errorMessage = "Error al guardar los cambios";
    
    if (typeof err === 'object' && err !== null) {
      // Error estándar de TypeScript/JavaScript
      if ('message' in err) {
        errorMessage = err.message as string;
      }
      // Error personalizado del backend (ajusta según tu API)
      if ('response' in err && typeof err.response === 'object' && err.response !== null) {
        if ('data' in err.response && typeof err.response.data === 'object' && err.response.data !== null) {
          if ('msg' in err.response.data) {
            errorMessage = err.response.data.msg as string;
          }
        }
      }
    }
    
    setError(errorMessage);
    console.error("Error al capturar la imagen:", err);
  } finally {
      setIsUploading(false);
    }
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    setIsUploading(true);
    await uploadImage(file);
    setSuccess('Imagen de perfil actualizada correctamente');
 } catch (err) {
    // Manejo seguro de errores
    let errorMessage = "Error al subir la imagen";
    
    if (typeof err === 'object' && err !== null) {
      // Error estándar de TypeScript/JavaScript
      if ('message' in err) {
        errorMessage = err.message as string;
      }
      // Error personalizado del backend (ajusta según tu API)
      if ('response' in err && typeof err.response === 'object' && err.response !== null) {
        if ('data' in err.response && typeof err.response.data === 'object' && err.response.data !== null) {
          if ('msg' in err.response.data) {
            errorMessage = err.response.data.msg as string;
          }
        }
      }
    }
    
    setError(errorMessage);
    console.error("Error al subir la imagen:", err);
  } finally {
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }
};

  const currentImage = tempImage || authUser?.image;

 return (
    <IonPage className={theme}>
      <IonHeader>
        <IonToolbar className={`app-toolbar ${theme}`}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/chat" className="back-button" />
          </IonButtons>
          <IonTitle className={`app-title ${theme}`}>Mi Perfil</IonTitle>
          <IonButtons slot="end">
            {isEditing ? (
              <>
                <IonButton onClick={handleEditToggle} className="action-button">
                  <IonIcon icon={close} slot="icon-only" />
                </IonButton>
                <IonButton onClick={handleSave} disabled={isLoading} className="action-button">
                  {isLoading ? (
                    <IonSpinner name="crescent" className="spinner" />
                  ) : (
                    <IonIcon icon={save} slot="icon-only" />
                  )}
                </IonButton>
              </>
            ) : (
              <IonButton onClick={handleEditToggle} className="action-button">
                <IonIcon icon={pencil} slot="icon-only" />
              </IonButton>
            )}
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className={`profile-content ${theme}`}>
        <div className={`profile-container ${theme}`}>
          {/* Avatar */}
          <div
            className="avatar-container"
            onClick={isEditing ? () => setShowActionSheet(true) : undefined}
          >
            <IonAvatar className={`profile-avatar ${theme} ${isUploading ? 'uploading-avatar' : ''}`}>
              {currentImage ? (
                <img src={currentImage} alt="Profile" />
              ) : (
                <div className={`avatar-placeholder ${theme}`}>
                  {authUser?.name?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
              {isUploading && (
                <div className="uploading-spinner">
                  <IonSpinner name="crescent" />
                </div>
              )}
            </IonAvatar>
            {isEditing && (
              <div className={`avatar-overlay ${theme}`}>
                <IonIcon icon={pencil} className="edit-icon" />
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: "none" }}
            />
          </div>

          {/* Formulario */}
          <div className="form-container">
            <IonItem className={`profile-item ${theme}`}>
              <IonIcon icon={person} slot="start" className={`field-icon ${theme}`} />
              <IonLabel position="stacked" className={`field-label ${theme}`}>Nombre</IonLabel>
              {isEditing ? (
                <IonInput
                  value={formData.name}
                  onIonChange={(e) => handleInputChange("name", e.detail.value!)}
                  className={`profile-input ${theme}`}
                />
              ) : (
                <p className={`profile-value ${theme}`}>{authUser?.name}</p>
              )}
            </IonItem>

            <IonItem className={`profile-item ${theme}`}>
              <IonIcon icon={mail} slot="start" className={`field-icon ${theme}`} />
              <IonLabel position="stacked" className={`field-label ${theme}`}>Email</IonLabel>
              <p className={`profile-value ${theme}`}>{authUser?.email}</p>
            </IonItem>

            <IonItem className={`profile-item ${theme}`}>
              <IonIcon icon={call} slot="start" className={`field-icon ${theme}`} />
              <IonLabel position="stacked" className={`field-label ${theme}`}>Teléfono</IonLabel>
              {isEditing ? (
                <IonInput
                  value={formData.phone}
                  onIonChange={(e) => handleInputChange("phone", e.detail.value!)}
                  type="tel"
                  className={`profile-input ${theme}`}
                />
              ) : (
                <p className={`profile-value ${theme}`}>
                  {authUser?.phone || "No especificado"}
                </p>
              )}
            </IonItem>

            <IonItem className={`profile-item ${theme}`}>
              <IonIcon icon={informationCircle} slot="start" className={`field-icon ${theme}`} />
              <IonLabel position="stacked" className={`field-label ${theme}`}>Información</IonLabel>
              {isEditing ? (
                <IonTextarea
                  value={formData.info}
                  onIonChange={(e) => handleInputChange("info", e.detail.value!)}
                  rows={4}
                  className={`profile-textarea ${theme}`}
                />
              ) : (
                <p className={`profile-value ${theme}`}>
                  {authUser?.info || "No hay información adicional"}
                </p>
              )}
            </IonItem>
          </div>
        </div>
      </IonContent>

      <IonActionSheet
        isOpen={showActionSheet}
        onDidDismiss={() => setShowActionSheet(false)}
        className={`action-sheet ${theme}`}
        buttons={[
          {
            text: "Tomar foto",
            icon: camera,
            handler: () => handleImageSourceSelect("camera"),
          },
          {
            text: "Elegir de galería",
            icon: image,
            handler: () => handleImageSourceSelect("gallery"),
          },
          {
            text: "Cancelar",
            icon: closeCircle,
            role: "cancel",
          },
        ]}
      />

      <ModalError
        isOpen={!!error}
        onDismiss={() => setError(null)}
        message={error || ""}
        theme={theme}
      />

      <ModalSuccess
        isOpen={!!success}
        onDismiss={() => setSuccess(null)}
        message={success || ""}
        theme={theme}
      />
    </IonPage>
  );
}
export default ProfilePage;