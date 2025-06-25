import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    onAuthStateChanged, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut 
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


// --- ÍCONOS SVG ---
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" /></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const LinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m11-4.08V12a1 1 0 00-1-1h-4a1 1 0 00-1 1v.08M12 12v4m3-4v4m-6-4v4m3-3.08V9a1 1 0 011-1h4a1 1 0 011 1v.08M17 3v4m2-2h-4" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const CameraIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const UserCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const SocialIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const ChatBubbleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
const WhatsAppIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.52-5.687-1.475L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.267.655 4.398 1.908 6.166l-.215 1.086 1.057.199z" /></svg>;


// --- CONFIGURACIÓN DE FIREBASE ---
const firebaseConfig = {
    apiKey: "AIzaSyBQMSUasHXkN0GXzrxdjp2eaDHupusQavQ",
    authDomain: "shoptalk-d8c86.firebaseapp.com",
    projectId: "shoptalk-d8c86",
    storageBucket: "shoptalk-d8c86.appspot.com",
    messagingSenderId: "687266707950",
    appId: "1:687266707950:web:ae63df72b1c6670c3c36ff",
    measurementId: "G-49Y7TS4NKX"
};

// --- INICIALIZAR FIREBASE (v9 Modular) ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// --- HOOK GENÉRICO PARA LLAMADAS A GEMINI ---
const useGemini = () => {
    const callGeminiAPI = async (prompt) => {
        const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
        const apiKey = ""; // Canvas lo gestiona
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Error en la API de Gemini: ${response.statusText}`);
        }

        const result = await response.json();
        if (result.candidates && result.candidates[0]?.content?.parts[0]?.text) {
            return result.candidates[0].content.parts[0].text;
        } else {
            throw new Error("Respuesta no válida de la API de Gemini.");
        }
    };
    return { callGeminiAPI };
};


// --- COMPONENTES MODALES ---
const Modal = ({ children, isOpen, onClose, size = 'lg' }) => {
  if (!isOpen) return null;
  const sizeClasses = {
      'md': 'max-w-md',
      'lg': 'max-w-lg',
      'xl': 'max-w-xl'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-fade-in">
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto relative p-6 m-4 animate-fade-in-up`}>
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
  const [images, setImages] = useState(Array(5).fill(''));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [user, setUser] = useState(null);
  const { callGeminiAPI } = useGemini();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => setUser(currentUser));
    return unsubscribe;
  }, []);
  
  useEffect(() => {
    setIsSubmitting(false);
    if (productToEdit) {
      setName(productToEdit.name || '');
      setDescription(productToEdit.description || '');
      setPrice(productToEdit.price || '');
      const existingImages = productToEdit.images || [];
      setImages([...existingImages, ...Array(5 - existingImages.length).fill('')]);
    } else {
      resetForm();
    }
  }, [productToEdit, isOpen]);

  const resetForm = () => {
    setName(''); setDescription(''); setPrice('');
    setImages(Array(5).fill('')); setProductToEdit(null);
  };
  
  const handleClose = () => { 
      resetForm();
      onClose(); 
  }

  const handleImageChange = (index, value) => {
    const newImages = [...images]; newImages[index] = value; setImages(newImages);
  };

  const generateContent = async (type) => {
    setIsGenerating(true);
    let prompt = '';
    if (type === 'description') {
        if (!name) { alert("Por favor, ingresa un nombre de producto."); setIsGenerating(false); return; }
        prompt = `Crea una descripción de producto atractiva para: "${name}". Tono amigable y persuasivo, máximo 3 frases.`;
    } else if (type === 'name') {
        const keywords = window.prompt("Ingresa palabras clave para el nombre (ej: 'taza cerámica artesanal'):");
        if (!keywords) { setIsGenerating(false); return; }
        prompt = `Sugiere 5 nombres creativos y cortos para un producto basado en: "${keywords}". Devuelve solo los nombres, separados por comas.`;
    }

    try {
        const text = await callGeminiAPI(prompt);
        if (type === 'description') {
            setDescription(text.trim());
        } else if (type === 'name') {
            const suggestedName = text.split(',')[0].trim();
            if (suggestedName) setName(suggestedName);
        }
    } catch (error) {
        console.error("Error al generar contenido:", error);
        alert("Hubo un error al generar contenido con IA.");
    } finally {
        setIsGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || isSubmitting) return; 
    setIsSubmitting(true);
    const productData = {
      userId: user.uid, name, description,
      price: parseFloat(price) || 0,
      images: images.filter(img => img.trim() !== ''),
    };

    try {
      if (productToEdit) {
        const productRef = doc(db, 'products', productToEdit.id);
        await updateDoc(productRef, productData);
      } else {
        await addDoc(collection(db, 'products'), {...productData, createdAt: serverTimestamp()});
      }
      handleClose();
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Hubo un error al guardar el producto.");
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{productToEdit ? 'Editar Producto' : 'Nuevo Producto'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
                <div className="flex items-center space-x-2">
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    <button type="button" onClick={() => generateContent('name')} disabled={isGenerating} title="Sugerir nombre con IA" className="p-2 mt-1 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"><SparklesIcon /></button>
                </div>
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="4" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                <button type="button" onClick={() => generateContent('description')} disabled={isGenerating || !name} className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 transition-all">
                    {isGenerating ? 'Generando...' : <><SparklesIcon /> Generar Descripción con IA</>}
                </button>
            </div>
            <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Precio (CLP)</label>
                <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Ej: 19990" />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Imágenes (URLs)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {images.map((img, index) => (
                        <div key={index} className="flex items-center border border-gray-300 rounded-md p-2">
                            <CameraIcon/>
                            <input type="text" value={img} onChange={(e) => handleImageChange(index, e.target.value)} className="ml-2 block w-full text-sm border-0 focus:ring-0" placeholder={`URL de la imagen ${index + 1}`} />
                        </div>
                    ))}
                </div>
                 <p className="text-xs text-gray-500 mt-1">Usa un servicio como <a href="https://postimages.org/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Postimages</a> para subir fotos y obtener URLs.</p>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={handleClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">Cancelar</button>
                <button type="submit" disabled={isSubmitting} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors">
                    {isSubmitting ? 'Guardando...' : 'Guardar Producto'}
                </button>
            </div>
        </form>
    </Modal>
  );
};

const SocialPostModal = ({ isOpen, onClose, product }) => {
    const [post, setPost] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const { callGeminiAPI } = useGemini();
    
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
            const text = await callGeminiAPI(prompt);
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
        textArea.style.position = "fixed";
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.width = "2em";
        textArea.style.height = "2em";
        textArea.style.padding = "0";
        textArea.style.border = "none";
        textArea.style.outline = "none";
        textArea.style.boxShadow = "none";
        textArea.style.background = "transparent";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            alert("Post copiado al portapapeles.");
        } catch (err) {
            console.error('Fallback: Error al copiar', err);
            alert('No se pudo copiar el texto.');
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
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setIsSaving(false);
        if(profile){
            setBusinessName(profile.businessName || '');
            setWhatsappNumber(profile.whatsappNumber || '');
        }
    }, [profile, isOpen]);
    
    const handleSave = async () => {
        setIsSaving(true);
        const profileData = { businessName, whatsappNumber };
        try {
            const profileRef = doc(db, 'profiles', user.uid);
            await setDoc(profileRef, profileData, { merge: true });
            setProfile(profileData);
            onClose();
        } catch (error) {
            console.error("Error guardando perfil", error);
            alert("No se pudo guardar el perfil.");
            setIsSaving(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Perfil de la Tienda</h2>
            <div className="space-y-4">
                <div>
                    <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">Nombre de tu Tienda</label>
                    <input type="text" id="businessName" value={businessName} onChange={e => setBusinessName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                 <div>
                    <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700">Número de WhatsApp</label>
                    <div className="flex items-center mt-1">
                       <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">+56</span>
                       <input type="tel" id="whatsappNumber" value={whatsappNumber} onChange={e => setWhatsappNumber(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="912345678" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Tu número se usará para que los clientes te contacten. No incluyas el +56.</p>
                </div>
            </div>
            <div className="mt-6 flex justify-end">
                <button onClick={handleSave} disabled={isSaving} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400">
                    {isSaving ? "Guardando..." : "Guardar Cambios"}
                </button>
            </div>
        </Modal>
    );
};


// --- COMPONENTE DASHBOARD ---
const DashboardPage = ({ user, onLogout }) => {
  const [products, setProducts] = useState([]);
  const [profile, setProfile] = useState({ businessName: '', whatsappNumber: ''});
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
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
            setDoc(profileRef, { businessName: 'Mi Tienda', whatsappNumber: '' });
        }
    });

    const q = query(collection(db, 'products'), where('userId', '==', user.uid));
    const unsubProducts = onSnapshot(q, (snapshot) => {
      const productsData = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => (b.createdAt?.toDate() || 0) - (a.createdAt?.toDate() || 0));
      setProducts(productsData);
    });

    return () => { unsubProfile(); unsubProducts(); };
  }, [user]);

  const handleEdit = (product) => { setProductToEdit(product); setIsProductModalOpen(true); };
  const handleAddNew = () => { setProductToEdit(null); setIsProductModalOpen(true); };
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro?')) {
        const productRef = doc(db, 'products', id);
        await deleteDoc(productRef);
    }
  };
  const handleSocialPost = (product) => { setProductForSocial(product); setIsSocialModalOpen(true); };

  const getCatalogUrl = () => {
    const projectId = firebaseConfig.projectId;
    if (!projectId) {
      console.error("Firebase projectId no encontrado en la configuración. No se puede generar un link para compartir.");
      return "No se pudo generar el link. Falta el ID del proyecto.";
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
      textArea.style.position = "fixed";
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.width = "2em";
      textArea.style.height = "2em";
      textArea.style.padding = "0";
      textArea.style.border = "none";
      textArea.style.outline = "none";
      textArea.style.boxShadow = "none";
      textArea.style.background = "transparent";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
          document.execCommand('copy');
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
      } catch (err) {
          console.error('Fallback: Error al copiar', err);
          alert('No se pudo copiar el enlace.');
      }
      document.body.removeChild(textArea);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">{profile.businessName || 'Mi Tienda Social'}</h1>
                 <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600 hidden sm:block">{user.email}</span>
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
                                    <p className="text-gray-600 font-bold mt-1">${new Intl.NumberFormat('es-CL').format(product.price)}</p>
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
    </div>
  );
};

// --- COMPONENTES DE CATÁLOGO PÚBLICO ---
const AskAIModal = ({ isOpen, onClose, product }) => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const { callGeminiAPI } = useGemini();

    const handleAsk = async () => {
        if (!question.trim()) return;
        setIsThinking(true);
        setAnswer('');
        const prompt = `Eres un asistente de tienda amigable. Un cliente tiene una pregunta sobre un producto. Responde basándote ÚNICAMENTE en la información proporcionada. Si la respuesta no está en la información, di amablemente que no tienes ese detalle y sugiere contactar al vendedor.
        
        Información del Producto:
        - Nombre: ${product.name}
        - Descripción: ${product.description}
        - Precio: ${product.price} CLP

        Pregunta del Cliente: "${question}"
        
        Tu respuesta:`;
        
        try {
            const result = await callGeminiAPI(prompt);
            setAnswer(result);
        } catch (error) {
            console.error("Error en AskAI:", error);
            setAnswer("Lo siento, tuve un problema para procesar tu pregunta. Intenta de nuevo.");
        } finally {
            setIsThinking(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={() => { setQuestion(''); setAnswer(''); onClose(); }}>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">✨ Pregúntale a la IA</h2>
            <p className="text-sm text-gray-600 mb-4">Haz una pregunta sobre: <strong>{product.name}</strong></p>
            <div className="space-y-4">
                <textarea value={question} onChange={e => setQuestion(e.target.value)} rows="3" placeholder="Ej: ¿Cuáles son las dimensiones?" className="w-full p-2 border border-gray-300 rounded-md"></textarea>
                <button onClick={handleAsk} disabled={isThinking} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400">
                    {isThinking ? "Pensando..." : "Enviar Pregunta"}
                </button>
                {answer && (
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <p className="font-semibold text-gray-800">Respuesta:</p>
                        <p className="text-gray-700">{answer}</p>
                    </div>
                )}
            </div>
        </Modal>
    );
};

const CatalogPage = ({ userId }) => {
    const [products, setProducts] = useState([]);
    const [profile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState({});
    const [isAskAIModalOpen, setIsAskAIModalOpen] = useState(false);
    const [productForAI, setProductForAI] = useState(null);

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
    const handleAskAI = (product) => { setProductForAI(product); setIsAskAIModalOpen(true); };

    if (loading) return <div className="min-h-screen bg-gray-100 flex items-center justify-center"><div className="text-xl font-semibold">Cargando...</div></div>;
    if (error) return <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4"><div className="text-center text-red-600">{error}</div></div>;

    return (
        <div className="bg-gray-100 min-h-screen font-sans">
            <header className="bg-white shadow-lg sticky top-0 z-10">
                <div className="max-w-4xl mx-auto py-6 px-4 text-center">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                        {profile?.businessName || 'Catálogo de Productos'}
                    </h1>
                </div>
            </header>
            <main className="max-w-4xl mx-auto py-10 px-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {products.map(product => (
                            <div key={product.id} className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
                                <div className="relative">
                                    <div className="h-64 bg-gray-200">
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
                                    <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                                    <p className="text-gray-600 mt-2 flex-grow">{product.description}</p>
                                    <p className="text-3xl font-extrabold text-indigo-600 mt-4">${new Intl.NumberFormat('es-CL').format(product.price)}</p>
                                    <div className="mt-6 space-y-3">
                                        <button onClick={() => handleAskAI(product)} className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center text-lg">
                                            <ChatBubbleIcon /> Preguntar a la IA
                                        </button>
                                        <a href={`https://wa.me/56${profile?.whatsappNumber}?text=${encodeURIComponent(`Hola! Me interesa el producto: ${product.name}`)}`} target="_blank" rel="noopener noreferrer" className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center text-lg">
                                            <WhatsAppIcon /> Consultar por WhatsApp
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
            </main>
            {productForAI && <AskAIModal isOpen={isAskAIModalOpen} onClose={() => setIsAskAIModalOpen(false)} product={productForAI} />}
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
                    whatsappNumber: ""
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
}

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

