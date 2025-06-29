import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    onAuthStateChanged, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut,
    updatePassword
} from 'firebase/auth';
import { 
    getFirestore, 
    collection, 
    addDoc, 
    query, 
    where, 
    onSnapshot, 
    doc, 
    updateDoc, 
    deleteDoc, 
    getDocs, 
    setDoc, 
    getDoc,
    serverTimestamp
} from 'firebase/firestore';
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL
} from 'firebase/storage';


// --- ÍCONOS SVG ---
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" /></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const LinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m11-4.08V12a1 1 0 00-1-1h-4a1 1 0 00-1 1v.08M12 12v4m3-4v4m-6-4v4m3-3.08V9a1 1 0 011-1h4a1 1 0 011 1v.08M17 3v4m2-2h-4" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const CameraIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const VideoCameraIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
const UserCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const SocialIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const WhatsAppIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.52-5.687-1.475L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.267.655 4.398 1.908 6.166l-.215 1.086 1.057.199z" /></svg>;
const KeyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" /></svg>

// --- CONFIGURACIÓN DE FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyBQMSUasHXkN0GXzrxdjp2eaDHupusQavQ",
  authDomain: "shoptalk-d8c86.firebaseapp.com",
  projectId: "shoptalk-d8c86",
  storageBucket: "shoptalk-d8c86.firebasestorage.app",
  messagingSenderId: "687266707950",
  appId: "1:687266707950:web:ae63df72b1c6670c3c36ff",
  measurementId: "G-49Y7TS4NKX"
};

// --- INICIALIZAR FIREBASE (v9 Modular) ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); 

// --- COMPONENTES MODALES ---
const Modal = ({ children, isOpen, onClose, size = 'lg' }) => {
  if (!isOpen) return null;
  const sizeClasses = {
      'md': 'max-w-md',
      'lg': 'max-w-lg',
      'xl': 'max-w-2xl'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-fade-in">
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto relative p-6 sm:p-8 m-4 animate-fade-in-up`}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors z-10">
          <CloseIcon />
        </button>
        {children}
      </div>
    </div>
  );
};

const ProductForm = ({ isOpen, onClose, productToEdit, setProductToEdit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [unit, setUnit] = useState('unidad');
  const [imageFiles, setImageFiles] = useState(Array(5).fill(null));
  const [imageRatings, setImageRatings] = useState(Array(5).fill(null));
  const [videoFile, setVideoFile] = useState(null);
  const [existingImageUrls, setExistingImageUrls] = useState([]);
  const [existingVideoUrl, setExistingVideoUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);

  const units = ['unidad', 'kilo', 'gramo', 'litro', 'caja', 'par', 'mes', 'año'];
  const currencies = ['USD', 'EUR', 'CLP', 'MXN', 'ARS'];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => setUser(currentUser));
    return unsubscribe;
  }, []);
  
  useEffect(() => {
    if (isOpen) {
        if (productToEdit) {
          setName(productToEdit.name || '');
          setDescription(productToEdit.description || '');
          setPrice(productToEdit.price || '');
          setCurrency(productToEdit.currency || 'USD');
          setUnit(productToEdit.unit || 'unidad');
          setExistingImageUrls(productToEdit.images || []);
          setExistingVideoUrl(productToEdit.videoUrl || '');
        } else {
          resetForm();
        }
    }
  }, [productToEdit, isOpen]);

  const resetForm = () => {
    setName(''); setDescription(''); setPrice('');
    setCurrency('USD'); setUnit('unidad');
    setImageFiles(Array(5).fill(null));
    setImageRatings(Array(5).fill(null));
    setVideoFile(null);
    setExistingImageUrls([]);
    setExistingVideoUrl('');
    setProductToEdit(null);
  };
  
  const handleClose = () => { resetForm(); onClose(); }

  const handleFileChange = (index, file) => {
    const newFiles = [...imageFiles];
    newFiles[index] = file;
    setImageFiles(newFiles);
    rateImageQuality(file, index);
  };
  
  const handleVideoChange = (file) => {
      if (file && file.size > 100 * 1024 * 1024) { // 100 MB
          alert("El video no puede superar los 100 MB.");
          return;
      }
      setVideoFile(file);
  }

  const fileToGenerativePart = async (file) => {
    const base64EncodedDataPromise = new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(file);
    });
    return {
        inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  }

  const rateImageQuality = async (file, index) => {
      if (!file) {
          const newRatings = [...imageRatings];
          newRatings[index] = null;
          setImageRatings(newRatings);
          return;
      }
      const newRatings = [...imageRatings];
      newRatings[index] = 'Analizando...';
      setImageRatings(newRatings);

      try {
          const imagePart = await fileToGenerativePart(file);
          const prompt = "Analiza la calidad de esta imagen de producto. Considera la iluminación, enfoque, composición y atractivo general. Responde únicamente con una de estas cuatro opciones: Malo, Aceptable, Bueno, Excelente.";
          
          const payload = { contents: [{ role: "user", parts: [imagePart, { text: prompt }] }] };
          const apiKey = "";
          const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

          const response = await fetch(apiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
          });
          const result = await response.json();
          const rating = result.candidates[0].content.parts[0].text.trim();
          
          const finalRatings = [...imageRatings];
          finalRatings[index] = rating;
          setImageRatings(finalRatings);

      } catch (error) {
          console.error("Error calificando imagen:", error);
          const finalRatings = [...imageRatings];
          finalRatings[index] = 'Error';
          setImageRatings(finalRatings);
      }
  };

  const uploadMedia = async () => {
    setIsUploading(true);
    setUploadProgress(0);
    let uploadedVideoUrl = existingVideoUrl;
    let uploadedImageUrls = [...existingImageUrls];

    const filesToUpload = imageFiles.filter(file => file !== null);
    
    if (filesToUpload.length > 0) {
        const imageUploadPromises = filesToUpload.map(file => {
            return new Promise((resolve, reject) => {
                const fileName = `${user.uid}/images/${Date.now()}_${file.name}`;
                const storageRef = ref(storage, fileName);
                const uploadTask = uploadBytesResumable(storageRef, file);
                uploadTask.on('state_changed', 
                    (snapshot) => setUploadProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
                    (error) => reject(error),
                    () => getDownloadURL(uploadTask.snapshot.ref).then(resolve)
                );
            });
        });
        const newImageUrls = await Promise.all(imageUploadPromises);
        uploadedImageUrls = [...uploadedImageUrls, ...newImageUrls];
    }

    if (videoFile) {
        const videoUploadPromise = new Promise((resolve, reject) => {
            const fileName = `${user.uid}/videos/${Date.now()}_${videoFile.name}`;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, videoFile);
            uploadTask.on('state_changed', 
                (snapshot) => setUploadProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
                (error) => reject(error),
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(url => {
                        uploadedVideoUrl = url;
                        resolve();
                    });
                }
            );
        });
        await videoUploadPromise;
    }
    
    setIsUploading(false);
    return { imageUrls: uploadedImageUrls, videoUrl: uploadedVideoUrl };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || isSubmitting) return; 
    setIsSubmitting(true);
    
    try {
        const { imageUrls, videoUrl } = await uploadMedia();
        const productData = {
          userId: user.uid, name, description,
          price: parseFloat(price) || 0,
          currency, unit,
          images: imageUrls,
          videoUrl,
        };

        if (productToEdit) {
            await updateDoc(doc(db, 'products', productToEdit.id), productData);
        } else {
            await addDoc(collection(db, 'products'), {...productData, createdAt: serverTimestamp()});
        }
        handleClose();
    } catch (error) {
        console.error("Error al guardar:", error);
        alert("Hubo un error al guardar el producto.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const getRatingColor = (rating) => {
      switch(rating) {
          case 'Excelente': return 'text-green-500';
          case 'Bueno': return 'text-blue-500';
          case 'Aceptable': return 'text-yellow-500';
          case 'Malo': return 'text-red-500';
          case 'Analizando...': return 'text-gray-500 animate-pulse';
          default: return 'text-gray-400';
      }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl">
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Productos</h2>
                <p className="text-sm text-gray-500">Muestra tus productos de forma sencilla. ¡Comienza cargando tu primer producto!</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800">Producto 1</h3>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg text-center">
                        <VideoCameraIcon className="h-8 w-8 text-gray-400" />
                        <label htmlFor="video-upload" className="mt-2 text-sm font-medium text-indigo-600 cursor-pointer">Cargar video</label>
                        <input id="video-upload" type="file" accept="video/mp4,video/quicktime" onChange={(e) => handleVideoChange(e.target.files[0])} className="hidden"/>
                        <p className="text-xs text-gray-500 mt-1">Hasta 100 MB</p>
                        {videoFile && <p className="text-xs text-green-600 mt-1 truncate">{videoFile.name}</p>}
                    </div>
                    <div className="space-y-2">
                        {imageFiles.map((file, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <label htmlFor={`img-upload-${index}`} className="flex-grow flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-100">
                                    <CameraIcon className="h-6 w-6 text-gray-500" />
                                    <span className="text-sm text-gray-700">{file ? file.name : `Cargar imagen ${index + 1}`}</span>
                                </label>
                                <input id={`img-upload-${index}`} type="file" accept="image/*" onChange={(e) => handleFileChange(index, e.target.files[0])} className="hidden"/>
                                {imageRatings[index] && <span className={`text-xs font-semibold ${getRatingColor(imageRatings[index])}`}>{imageRatings[index]}</span>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre del producto</label>
                    <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"/>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="currency" className="block text-sm font-medium text-gray-700">Moneda</label>
                        <select id="currency" value={currency} onChange={e => setCurrency(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                            {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Precio del producto</label>
                        <input type="number" id="price" value={price} onChange={e => setPrice(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"/>
                    </div>
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción del producto</label>
                    <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows="3" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
                    <button type="button" className="mt-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800"><SparklesIcon /> Mejorar con IA</button>
                </div>

                <div className="pt-4 flex justify-end">
                    <button type="submit" disabled={isSubmitting || isUploading} className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400">
                        Guardar y continuar
                    </button>
                </div>
            </form>
        </div>
    </Modal>
  );
};


const ChangePasswordModal = ({ isOpen, onClose }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setNewPassword('');
            setConfirmPassword('');
            setError('');
            setSuccess('');
            setIsSaving(false);
        }
    }, [isOpen]);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        setIsSaving(true);
        const user = auth.currentUser;
        if (user) {
            try {
                await updatePassword(user, newPassword);
                setSuccess("¡Contraseña actualizada con éxito!");
                setTimeout(() => {
                    onClose();
                }, 2000);
            } catch (err) {
                console.error("Error al cambiar contraseña:", err);
                setError("Error al cambiar la contraseña. Es posible que necesites volver a iniciar sesión.");
            } finally {
                setIsSaving(false);
            }
        } else {
            setError("No se ha podido identificar al usuario. Por favor, inicia sesión de nuevo.");
            setIsSaving(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Cambiar Contraseña</h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                    <label htmlFor="newPassword">Nueva Contraseña</label>
                    <input type="password" id="newPassword" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border rounded-md" />
                </div>
                <div>
                    <label htmlFor="confirmPassword">Confirmar Nueva Contraseña</label>
                    <input type="password" id="confirmPassword" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border rounded-md" />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {success && <p className="text-green-500 text-sm">{success}</p>}
                 <div className="flex justify-end pt-4">
                    <button type="submit" disabled={isSaving} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400">
                        {isSaving ? "Guardando..." : "Guardar Contraseña"}
                    </button>
                </div>
            </form>
        </Modal>
    )
};

const SocialPostModal = ({ isOpen, onClose, product }) => {
    const [post, setPost] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        if (isOpen && product) {
            generatePost();
        } else {
            setPost('');
        }
    }, [isOpen, product]);

    const generatePost = async () => {
        setIsGenerating(true);
        const prompt = `Crea un post para Instagram para vender un producto.
        Producto: "${product.name}"
        Descripción: "${product.description}"
        Precio: ${new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(product.price)}
        El post debe ser entusiasta, usar 2-3 emojis relevantes, y terminar con 5 hashtags chilenos relevantes. Incluye un llamado a la acción para visitar el link en la bio.`;
        try {
            const text = `¡No te pierdas nuestro increíble ${product.name}! ✨\n\n${product.description}\n\nConsíguelo ahora por solo ${new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(product.price)}.\n\n¡Visita el link en nuestra bio para comprar! 🚀\n\n#${product.name.replace(/\s+/g, '')} #Oferta #Chile #VentasChile #TiendaOnline`;
            setPost(text);
        } catch (error) {
            console.error("Error al generar post:", error);
            setPost("No se pudo generar el post. Inténtalo de nuevo.");
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = () => {
        const textArea = document.createElement("textarea");
        textArea.value = post;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            alert("Post copiado al portapapeles.");
        } catch (err) {
            console.error('Error al copiar', err);
        }
        document.body.removeChild(textArea);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">✨ Post para Redes Sociales</h2>
            <div className="bg-gray-50 p-4 rounded-lg min-h-[250px] whitespace-pre-wrap font-mono text-sm">
                {isGenerating ? "Generando post..." : post}
            </div>
            <div className="mt-4 flex justify-end space-x-2">
                <button onClick={generatePost} disabled={isGenerating} className="font-semibold text-indigo-600">Volver a generar</button>
                <button onClick={copyToClipboard} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700">Copiar Texto</button>
            </div>
        </Modal>
    );
};

const ProfileModal = ({ isOpen, onClose, user, profile, setProfile }) => {
    const [businessName, setBusinessName] = useState('');
    const [whatsappCode, setWhatsappCode] = useState('+56');
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [theme, setTheme] = useState('default');
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const countries = [
        { name: 'Chile', code: '+56' }, { name: 'Argentina', code: '+54' },
        { name: 'Perú', code: '+51' }, { name: 'Colombia', code: '+57' },
        { name: 'México', code: '+52' }, { name: 'España', code: '+34' },
        { name: 'USA', code: '+1' },
    ];

    const themes = [
        { id: 'default', name: 'Claro', bg: 'bg-gray-100', text: 'text-gray-800', accent: 'bg-white' },
        { id: 'dark', name: 'Oscuro', bg: 'bg-gray-800', text: 'text-white', accent: 'bg-gray-900' },
        { id: 'sunset', name: 'Atardecer', bg: 'bg-gradient-to-br from-yellow-200 via-red-300 to-pink-400', text: 'text-white', accent: 'bg-white/30' },
        { id: 'ocean', name: 'Océano', bg: 'bg-gradient-to-br from-blue-300 to-indigo-500', text: 'text-white', accent: 'bg-white/30' },
        { id: 'forest', name: 'Bosque', bg: 'bg-gradient-to-br from-green-400 to-teal-600', text: 'text-white', accent: 'bg-white/30' },
        { id: 'lavender', name: 'Lavanda', bg: 'bg-gradient-to-br from-purple-300 to-violet-500', text: 'text-white', accent: 'bg-white/30' },
    ];

    useEffect(() => {
        setIsSaving(false);
        setIsUploading(false);
        if(profile){
            setBusinessName(profile.businessName || '');
            setWhatsappCode(profile.whatsapp?.code || '+56');
            setWhatsappNumber(profile.whatsapp?.number || '');
            setTheme(profile.theme || 'default');
            setProfileImageFile(null);
        }
    }, [profile, isOpen]);
    
    const handleSave = async () => {
        setIsSaving(true);
        let profileImageUrl = profile.profileImageUrl || '';

        if (profileImageFile) {
            setIsUploading(true);
            try {
                const fileName = `${user.uid}/profile_${Date.now()}`;
                const storageRef = ref(storage, fileName);
                const uploadTask = uploadBytesResumable(storageRef, profileImageFile);
                await uploadTask;
                profileImageUrl = await getDownloadURL(uploadTask.snapshot.ref);
            } catch (error) {
                console.error("Error subiendo imagen de perfil:", error);
                alert("No se pudo subir la imagen de perfil.");
                setIsSaving(false);
                setIsUploading(false);
                return;
            }
            setIsUploading(false);
        }

        const profileData = { 
            businessName, 
            whatsapp: { code: whatsappCode, number: whatsappNumber },
            theme,
            profileImageUrl,
        };

        try {
            const profileRef = doc(db, 'profiles', user.uid);
            await setDoc(profileRef, profileData, { merge: true });
            setProfile(profileData);
            onClose();
        } catch (error) {
            console.error("Error guardando perfil", error);
            alert("No se pudo guardar el perfil.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Perfil y Diseño de la Tienda</h2>
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Imagen de Perfil</label>
                    <div className="mt-2 flex items-center gap-4">
                        <img src={profile.profileImageUrl || `https://placehold.co/100x100/e2e8f0/64748b?text=Perfil`} alt="Perfil" className="h-24 w-24 rounded-full object-cover"/>
                        <input type="file" accept="image/*" onChange={e => setProfileImageFile(e.target.files[0])} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                    </div>
                </div>
                <div>
                    <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">Nombre de tu Tienda</label>
                    <input type="text" id="businessName" value={businessName} onChange={e => setBusinessName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                 <div>
                    <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700">Número de WhatsApp</label>
                    <div className="flex items-center mt-1">
                       <select value={whatsappCode} onChange={e => setWhatsappCode(e.target.value)} className="block px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                           {countries.map(c => <option key={c.code} value={c.code}>{c.name} ({c.code})</option>)}
                       </select>
                       <input type="tel" id="whatsappNumber" value={whatsappNumber} onChange={e => setWhatsappNumber(e.target.value)} className="block w-full px-3 py-2 border-t border-b border-r border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="912345678" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tema del Catálogo</label>
                    <div className="mt-2 grid grid-cols-3 gap-3">
                        {themes.map(t => (
                            <button key={t.id} type="button" onClick={() => setTheme(t.id)} className={`p-2 rounded-lg border-2 ${theme === t.id ? 'border-indigo-500' : 'border-transparent'}`}>
                                <div className={`h-16 w-full rounded-md ${t.bg} flex items-center justify-center`}>
                                    <div className={`h-8 w-8 rounded-full ${t.accent}`}></div>
                                </div>
                                <p className="text-sm text-center mt-1">{t.name}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="mt-6 flex justify-end">
                <button onClick={handleSave} disabled={isSaving || isUploading} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400">
                    {isUploading ? 'Subiendo imagen...' : isSaving ? "Guardando..." : "Guardar Cambios"}
                </button>
            </div>
        </Modal>
    );
};

// --- COMPONENTE DASHBOARD ---
const DashboardPage = ({ user, onLogout }) => {
  const [products, setProducts] = useState([]);
  const [profile, setProfile] = useState({ businessName: '', whatsapp: { code: '+56', number: '' }, theme: 'default', profileImageUrl: '' });
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [productForSocial, setProductForSocial] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) return;

    const profileRef = doc(db, 'profiles', user.uid);
    const unsubProfile = onSnapshot(profileRef, (doc) => {
        if (doc.exists()) {
            setProfile(doc.data());
        } else {
            setDoc(profileRef, { businessName: 'Mi Tienda', whatsapp: { code: '+56', number: '' }, theme: 'default', profileImageUrl: '' });
        }
    });

    const productsCollectionRef = collection(db, 'products');
    const q = query(productsCollectionRef, where('userId', '==', user.uid));
    
    const unsubProducts = onSnapshot(q, (snapshot) => {
      const productsData = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => (b.createdAt?.toDate() || 0) - (a.createdAt?.toDate() || 0));
      setProducts(productsData);
    });

    return () => { 
        unsubProfile(); 
        unsubProducts(); 
    };
  }, [user]);

  const handleEdit = (product) => { setProductToEdit(product); setIsProductModalOpen(true); };
  const handleAddNew = () => { setProductToEdit(null); setIsProductModalOpen(true); };
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro?')) {
      await deleteDoc(doc(db, 'products', id));
    }
  };
  const handleSocialPost = (product) => { setProductForSocial(product); setIsSocialModalOpen(true); };

  const getCatalogUrl = () => {
    const projectId = firebaseConfig.projectId;
    if (!projectId) {
      console.error("Firebase projectId no encontrado en la configuración.");
      return "No se pudo generar el link.";
    }
    const baseUrl = `https://${projectId}.web.app`;
    return `${baseUrl}?catalog=${user.uid}`;
  };

  const copyLink = () => {
    const catalogUrl = getCatalogUrl();
    if (!catalogUrl.startsWith("http")) {
        alert(catalogUrl);
        return;
    }
    const textArea = document.createElement("textarea");
    textArea.value = catalogUrl;
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    } catch (err) {
        console.error('Error al copiar', err);
        alert('No se pudo copiar el enlace.');
    }
    document.body.removeChild(textArea);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">{profile.businessName || 'Mi Tienda Social'}</h1>
                 <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 hidden sm:block">{user.email}</span>
                    <button onClick={() => setChangePasswordModalOpen(true)} title="Cambiar Contraseña" className="p-2 rounded-full text-gray-500 hover:bg-gray-100"><KeyIcon /></button>
                    <button onClick={() => setIsProfileModalOpen(true)} title="Editar Perfil" className="p-2 rounded-full text-gray-500 hover:bg-gray-100"><UserCircleIcon /></button>
                    <button onClick={onLogout} title="Cerrar Sesión" className="p-2 rounded-full text-gray-500 hover:bg-gray-100"><LogoutIcon /></button>
                 </div>
            </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
                <div className="bg-white shadow rounded-lg p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Tu Catálogo está listo</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">Comparte este enlace en tus redes sociales.</p>
                         <div className="mt-2 flex items-center bg-gray-100 rounded-md p-2">
                             <LinkIcon />
                             <span className="ml-2 text-indigo-600 text-sm truncate">
                               {getCatalogUrl().replace('https://', '')}
                             </span>
                         </div>
                    </div>
                    <button onClick={copyLink} className="w-full sm:w-auto flex-shrink-0 bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-all duration-300">
                        {copied ? '¡Enlace Copiado!' : 'Copiar Enlace'}
                    </button>
                </div>

                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Tus Productos</h2>
                    <button onClick={handleAddNew} className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <PlusIcon /> <span className="ml-2">Añadir Producto</span>
                    </button>
                </div>
                
                {products.length === 0 ? (
                    <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay productos</h3>
                        <p className="mt-1 text-sm text-gray-500">Añade tu primer producto para empezar.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map(product => (
                            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                                <div className="h-48 bg-gray-200 flex items-center justify-center">
                                    <img src={product.images?.[0] || `https://placehold.co/400x300/e2e8f0/64748b?text=Producto`} alt={product.name} className="h-full w-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/400x300/e2e8f0/64748b?text=Sin+Imagen`; }} />
                                </div>
                                <div className="p-4 flex-grow flex flex-col">
                                    <h3 className="text-lg font-semibold text-gray-800 truncate flex-grow">{product.name}</h3>
                                    <p className="text-gray-600 font-bold mt-1">
                                        ${new Intl.NumberFormat('es-CL').format(product.price)}
                                        {product.unit && (
                                            <span className="text-sm font-medium text-gray-500"> / {product.unit}</span>
                                        )}
                                    </p>
                                    <div className="flex justify-end space-x-1 mt-4">
                                        <button onClick={() => handleSocialPost(product)} title="Crear post para redes" className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-purple-600"><SocialIcon /></button>
                                        <button onClick={() => handleEdit(product)} title="Editar" className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-blue-600"><EditIcon /></button>
                                        <button onClick={() => handleDelete(product.id)} title="Eliminar" className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-red-600"><DeleteIcon /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
        
        <ProductForm isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} productToEdit={productToEdit} setProductToEdit={setProductToEdit}/>
        <SocialPostModal isOpen={isSocialModalOpen} onClose={() => setIsSocialModalOpen(false)} product={productForSocial} />
        <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} user={user} profile={profile} setProfile={setProfile} />
        <ChangePasswordModal isOpen={isChangePasswordModalOpen} onClose={() => setChangePasswordModalOpen(false)} />
    </div>
  );
};

// --- COMPONENTE CATALOG PAGE ---
const CatalogPage = ({ userId }) => {
    const [products, setProducts] = useState([]);
    const [profile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState({});

    const themes = {
        default: { bg: 'bg-gray-100', text: 'text-gray-800', accent: 'bg-white', button: 'bg-indigo-600 hover:bg-indigo-700 text-white' },
        dark: { bg: 'bg-gray-800', text: 'text-white', accent: 'bg-gray-900', button: 'bg-indigo-500 hover:bg-indigo-600 text-white' },
        sunset: { bg: 'bg-gradient-to-br from-yellow-200 via-red-300 to-pink-400', text: 'text-white', accent: 'bg-white/30 backdrop-blur-sm', button: 'bg-white/30 hover:bg-white/40 text-white' },
        ocean: { bg: 'bg-gradient-to-br from-blue-300 to-indigo-500', text: 'text-white', accent: 'bg-white/30 backdrop-blur-sm', button: 'bg-white/30 hover:bg-white/40 text-white' },
        forest: { bg: 'bg-gradient-to-br from-green-400 to-teal-600', text: 'text-white', accent: 'bg-white/30 backdrop-blur-sm', button: 'bg-white/30 hover:bg-white/40 text-white' },
        lavender: { bg: 'bg-gradient-to-br from-purple-300 to-violet-500', text: 'text-white', accent: 'bg-white/30 backdrop-blur-sm', button: 'bg-white/30 hover:bg-white/40 text-white' },
    };

    const currentTheme = themes[profile?.theme] || themes.default;

    useEffect(() => {
        const fetchCatalogData = async () => {
            try {
                const profileRef = doc(db, 'profiles', userId);
                const profileDoc = await getDoc(profileRef);
                if (profileDoc.exists()) {
                    setUserProfile(profileDoc.data());
                }

                const q = query(collection(db, 'products'), where('userId', '==', userId));
                const productSnapshot = await getDocs(q);
                const productsData = productSnapshot.docs
                  .map(doc => ({ id: doc.id, ...doc.data() }))
                  .sort((a,b) => (b.createdAt?.toDate() || 0) - (a.createdAt?.toDate() || 0));
                setProducts(productsData);

            } catch (e) {
                console.error(e);
                setError("No se pudo cargar el catálogo.");
            } finally {
                setLoading(false);
            }
        };
        fetchCatalogData();
    }, [userId]);
    
    const handleImageSelect = (productId, imageIndex) => setSelectedImage(prev => ({ ...prev, [productId]: imageIndex }));

    if (loading) return <div className="min-h-screen bg-gray-100 flex items-center justify-center"><div className="text-xl font-semibold">Cargando...</div></div>;
    if (error) return <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4"><div className="text-center text-red-600">{error}</div></div>;

    return (
        <div className={`min-h-screen font-sans transition-colors duration-500 ${currentTheme.bg}`}>
            <header className="py-10 px-4 text-center">
                <img src={profile?.profileImageUrl || `https://placehold.co/128x128/e2e8f0/64748b?text=Perfil`} alt="Perfil" className={`h-32 w-32 rounded-full object-cover mx-auto mb-4 border-4 border-white/50 shadow-lg`}/>
                <h1 className={`text-4xl font-extrabold tracking-tight ${currentTheme.text} drop-shadow-md`}>
                    {profile?.businessName || 'Catálogo de Productos'}
                </h1>
            </header>
            <main className="max-w-4xl mx-auto pb-10 px-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {products.map(product => (
                            <div key={product.id} className={`rounded-2xl shadow-xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl ${currentTheme.accent} ${currentTheme.text}`}>
                                <div className="relative">
                                    <div className="h-64 bg-black/10">
                                       <img 
                                            src={product.images?.[selectedImage[product.id] || 0] || `https://placehold.co/600x400/e2e8f0/64748b?text=Producto`} 
                                            alt={product.name} 
                                            className="h-full w-full object-cover"
                                            onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/600x400/e2e8f0/64748b?text=Sin+Imagen`; }}
                                        />
                                    </div>
                                    {product.images?.length > 1 && (
                                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2 bg-black bg-opacity-30 p-1 rounded-full">
                                            {product.images.map((img, index) => (
                                                <button key={index} onClick={() => handleImageSelect(product.id, index)} className={`h-2 w-2 rounded-full ${ (selectedImage[product.id] || 0) === index ? 'bg-white' : 'bg-gray-400' }`}></button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="p-6 flex-grow flex flex-col">
                                    <h2 className="text-2xl font-bold">{product.name}</h2>
                                    <p className="opacity-80 mt-2 flex-grow">{product.description}</p>
                                    <p className="text-3xl font-extrabold mt-4">
                                        ${new Intl.NumberFormat('es-CL').format(product.price)}
                                        {product.unit && (
                                            <span className="text-lg font-medium opacity-70"> / {product.unit}</span>
                                        )}
                                    </p>
                                    <div className="mt-6 space-y-3">
                                        <a href={`https://wa.me/${profile?.whatsapp?.code?.replace('+','')}${profile?.whatsapp?.number}?text=${encodeURIComponent(`Hola! Me interesa el producto: ${product.name}`)}`} target="_blank" rel="noopener noreferrer" className={`w-full font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center text-lg ${currentTheme.button}`}>
                                            <WhatsAppIcon /> Consultar por WhatsApp
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
            </main>
        </div>
    );
};


// --- COMPONENTE DE AUTENTICACIÓN ---
const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault(); setLoading(true); setError('');
        try {
            const userCredential = isLogin
                ? await signInWithEmailAndPassword(auth, email, password)
                : await createUserWithEmailAndPassword(auth, email, password);

            if (!isLogin) {
                const profileRef = doc(db, 'profiles', userCredential.user.uid);
                await setDoc(profileRef, {
                    businessName: "Mi Tienda",
                    whatsapp: { code: '+56', number: '' },
                    theme: 'default',
                    profileImageUrl: ''
                });
            }
        } catch (err) {
            const message = err.code === 'auth/invalid-credential' ? "Email o contraseña incorrectos."
                          : err.code === 'auth/email-already-in-use' ? "El email ya está en uso."
                          : "Ocurrió un error.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
         <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
             <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <h2 className="mt-6 text-3xl font-extrabold text-white">
                    {isLogin ? 'Inicia sesión' : 'Crea una cuenta'}
                </h2>
                <p className="mt-2 text-sm text-indigo-100">
                    o <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="font-medium text-white hover:text-indigo-50">
                        {isLogin ? 'crea una cuenta nueva' : 'inicia sesión'}
                    </button>
                </p>
            </div>
             <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-2xl rounded-2xl sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input id="email" name="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
                            <input id="password" name="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <div>
                            <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400">
                                {loading ? 'Cargando...' : isLogin ? 'Iniciar Sesión' : 'Registrarse'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// --- COMPONENTE PRINCIPAL ---
export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [catalogUserId, setCatalogUserId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userIdFromUrl = params.get('catalog');

    if(userIdFromUrl) {
        setCatalogUserId(userIdFromUrl);
        setLoading(false);
    } else {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser); 
          setLoading(false);
        });
        return () => unsubscribe();
    }
  }, []);

  const handleLogout = () => signOut(auth);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-100"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div></div>;
  if (catalogUserId) return <CatalogPage userId={catalogUserId} />;
  if (user) return <DashboardPage user={user} onLogout={handleLogout} />;
  return <AuthPage />;
}

