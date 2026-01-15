
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { 
  initializeFirestore,
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp,
  collection,
  persistentLocalCache,
  persistentMultipleTabManager
} from 'firebase/firestore';

// Configuración del proyecto mcfpeaifmc
export const firebaseConfig = {
  apiKey: "AIzaSyDZaXW2PinoFH3mqvyI3KSiJgpg1_aFcpA",
  authDomain: "devsoftinfoauth.firebaseapp.com",
  projectId: "devsoftinfoauth",
  storageBucket: "devsoftinfoauth.firebasestorage.app",
  messagingSenderId: "87600175677",
  appId: "1:87600175677:web:3b2c4dc159371fb75d6854",
  measurementId: "G-ZD25GVW98K"
};

// Inicialización de Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

/**
 * Usamos localCache con persistentLocalCache para evitar el aviso de depreciación
 * de enableIndexedDbPersistence.
 */
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

const COLLECTION_NAME = "postulantes";

const safeLog = (msg: string, error: any) => {
  const cleanError = error instanceof Error ? {
    message: error.message,
    code: (error as any).code,
    stack: error.stack
  } : String(error);
  console.error(msg, JSON.parse(JSON.stringify(cleanError)));
};

export const mockFirestore = {
  getFicha: async (documentNumber: string) => {
    try {
      const docRef = doc(db, COLLECTION_NAME, documentNumber);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const rawData = docSnap.data();
        const data = JSON.parse(JSON.stringify(rawData));
        
        if (rawData.fecha_actualizacion?.toDate) {
          data.fecha_actualizacion = rawData.fecha_actualizacion.toDate().toISOString();
        }
        if (rawData.createdAt?.toDate) {
          data.createdAt = rawData.createdAt.toDate().toISOString();
        }
        return data;
      }
      return null;
    } catch (error: any) {
      safeLog("Error Firestore Get:", error);
      if (error.code === 'unavailable' || !navigator.onLine) {
        throw new Error("El sistema está operando en modo offline.");
      }
      throw new Error("Error al consultar la ficha.");
    }
  },

  updateFicha: async (id: string, structuredData: any) => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const dataToSave = {
        ...structuredData,
        fecha_actualizacion: serverTimestamp(),
      };
      await setDoc(docRef, dataToSave, { merge: true });
      return true;
    } catch (error: any) {
      safeLog("[Firestore] Error al guardar:", error);
      throw new Error("No se pudo sincronizar el registro.");
    }
  },

  saveLog: async (logInfo: any) => {
    try {
      const logsRef = collection(db, "logs");
      const newLogRef = doc(logsRef);
      await setDoc(newLogRef, {
        ...logInfo,
        timestamp: serverTimestamp()
      });
    } catch (e) {}
  }
};

export { app, auth, provider, signInWithPopup };
