import React, { useRef, useState, useEffect } from "react";
import { Task } from "../../interfaces";
import { useAppSelector } from "../../store/hooks";
import Modal from "./Modal";

// Custom Date Picker Component
const CustomDatePicker: React.FC<{
  value: string;
  onChange: (date: string) => void;
  min: string;
  max: string;
}> = ({ value, onChange, min, max }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value);
  const [currentMonth, setCurrentMonth] = useState(new Date(value || new Date()));
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowPicker(false);
      }
    };
    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPicker]);

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return 'Select date';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const handleDateSelect = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    onChange(dateStr);
    setShowPicker(false);
  };

  const changeMonth = (offset: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + offset);
    setCurrentMonth(newMonth);
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentMonth);
  const days = [];
  
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="p-2"></div>);
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isSelected = dateStr === selectedDate;
    const isToday = dateStr === new Date().toISOString().split('T')[0];
    
    days.push(
      <button
        key={day}
        type="button"
        onClick={() => handleDateSelect(day)}
        className={`p-2 text-center rounded-lg transition-colors ${
          isSelected 
            ? 'bg-[#2563eb] text-white font-bold' 
            : isToday
            ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
            : 'hover:bg-slate-100 dark:hover:bg-slate-700'
        }`}
      >
        {day}
      </button>
    );
  }

  return (
    <div className="relative" ref={pickerRef}>
      <input
        type="text"
        readOnly
        value={formatDisplayDate(selectedDate)}
        onClick={() => setShowPicker(!showPicker)}
        className="w-full cursor-pointer"
        required
      />
      
      {showPicker && (
        <div className="absolute z-50 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg shadow-lg p-4 w-80 left-1/2 -translate-x-1/2">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
            >
              ←
            </button>
            <div className="font-semibold">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
            <button
              type="button"
              onClick={() => changeMonth(1)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
            >
              →
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 mb-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <div className="text-center">Sun</div>
            <div className="text-center">Mon</div>
            <div className="text-center">Tue</div>
            <div className="text-center">Wed</div>
            <div className="text-center">Thu</div>
            <div className="text-center">Fri</div>
            <div className="text-center">Sat</div>
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {days}
          </div>
          
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowPicker(false);
              }}
              className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300 dark:hover:bg-slate-600"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const today = new Date().toISOString().split('T')[0];
                setSelectedDate(today);
                onChange(today);
                setShowPicker(false);
              }}
              className="flex-1 px-4 py-2 bg-[#2563eb] text-white rounded hover:bg-[#646cff]"
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Custom Time Picker Component
const CustomTimePicker: React.FC<{
  value: string;
  onChange: (time: string) => void;
}> = ({ value, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [hours, setHours] = useState(value ? value.split(':')[0] : '12');
  const [minutes, setMinutes] = useState(value ? value.split(':')[1] : '00');
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowPicker(false);
      }
    };
    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPicker]);

  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const timeStr = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    onChange(timeStr);
    setShowPicker(false);
  };

  const hourOptions = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minuteOptions = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  return (
    <div className="relative" ref={pickerRef}>
      <input
        type="text"
        readOnly
        value={value || 'Select time'}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowPicker(!showPicker);
        }}
        className="w-full cursor-pointer"
        placeholder="Set reminder time"
      />
      
      {showPicker && (
        <div className="absolute z-50 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg shadow-lg p-4 w-64 left-1/2 -translate-x-1/2">
          <div className="text-center mb-4 font-semibold">Select Time</div>
          
          <div className="flex gap-2 items-center justify-center mb-4">
            <select
              value={hours}
              onChange={(e) => {
                e.stopPropagation();
                setHours(e.target.value);
              }}
              className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-2xl font-bold"
            >
              {hourOptions.map(h => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
            
            <span className="text-2xl font-bold">:</span>
            
            <select
              value={minutes}
              onChange={(e) => {
                e.stopPropagation();
                setMinutes(e.target.value);
              }}
              className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-2xl font-bold"
            >
              {minuteOptions.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          
          <div className="flex gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowPicker(false);
              }}
              className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300 dark:hover:bg-slate-600"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 px-4 py-2 bg-[#2563eb] text-white rounded hover:bg-[#646cff]"
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Check if Android bridge is available
    const isAndroidSpeechAvailable = typeof (window as any).AndroidSpeech !== 'undefined';
    console.log('🔊 Android Speech available:', isAndroidSpeechAvailable);
    setIsSupported(isAndroidSpeechAvailable);
  }, []);

  const startListening = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      console.log('🎤 Starting Android native speech recognition...');
      
      // Check if Android bridge is available
      if (typeof (window as any).AndroidSpeech === 'undefined') {
        reject(new Error('Speech recognition not available on this device'));
        return;
      }

      setIsListening(true);

      // Set up one-time event listener for the result
      const handleResult = (event: any) => {
        console.log('🎯 Received speech result:', event.detail);
        window.removeEventListener('speechResult', handleResult);
        window.removeEventListener('speechError', handleError);
        
        setIsListening(false);
        
        if (event.detail && event.detail.trim()) {
          resolve(event.detail.trim());
        } else {
          reject(new Error('No speech detected. Please try again.'));
        }
      };

      const handleError = (event: any) => {
        console.error('❌ Speech recognition error:', event.detail);
        window.removeEventListener('speechResult', handleResult);
        window.removeEventListener('speechError', handleError);
        
        setIsListening(false);
        reject(new Error(event.detail || 'Speech recognition failed'));
      };

      window.addEventListener('speechResult', handleResult);
      window.addEventListener('speechError', handleError);

      // Start Android native speech recognition
      try {
        (window as any).AndroidSpeech.startSpeechRecognition();
        
        // Timeout after 15 seconds
        setTimeout(() => {
          window.removeEventListener('speechResult', handleResult);
          window.removeEventListener('speechError', handleError);
          setIsListening(false);
          reject(new Error('Speech recognition timeout'));
        }, 15000);
        
      } catch (error) {
        window.removeEventListener('speechResult', handleResult);
        window.removeEventListener('speechError', handleError);
        setIsListening(false);
        reject(new Error('Failed to start speech recognition'));
      }
    });
  };

  const stopListening = () => {
    console.log('⏹️ Stopping speech recognition');
    setIsListening(false);
  };

  return { 
    startListening, 
    stopListening, 
    isListening, 
    isSupported,
    permissionGranted: true 
  };
};
// REAL-TIME Autocomplete Input with Live Speech-to-Text
const AutocompleteInput: React.FC<{
  title: string;
  setTitle: (value: string) => void;
  placeholder?: string;
  className?: string;
}> = ({ title, setTitle, placeholder = "e.g, study for the test", className = "w-full" }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [speechFeedback, setSpeechFeedback] = useState('');
  const [isRealTimeListening, setIsRealTimeListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
const { startListening, stopListening, isListening, isSupported } = useSpeechRecognition();

const startVoiceRecording = async () => {
  console.log('🎤 Starting voice recording...');
  
  if (!isSupported) {
    alert('Speech recognition is not supported on this device.');
    return;
  }

  if (isListening) {
    stopListening();
    return;
  }

  try {
    setSpeechFeedback('🎤 Listening...');
    const transcript = await startListening();
    
    if (transcript && transcript.trim()) {
      setTitle(transcript.trim());
      setSpeechFeedback('✅ Speech recognized!');
      console.log('✅ Speech-to-text successful:', transcript);
      
      // Auto-clear feedback after 2 seconds
      setTimeout(() => setSpeechFeedback(''), 2000);
    } else {
      setSpeechFeedback('❌ No speech detected');
      setTimeout(() => setSpeechFeedback(''), 2000);
    }
  } catch (error: any) {
    console.error('❌ Speech recognition failed:', error);
    setSpeechFeedback('❌ ' + error.message);
    setTimeout(() => setSpeechFeedback(''), 3000);
  }
};



  const stopVoiceRecording = () => {
    console.log('⏹️ Stopping real-time speech');
    stopListening();
    setIsRealTimeListening(false);
    setSpeechFeedback('');
  };



  const dictionary = [
    'study for the test', 'buy groceries', 'call dentist', 'finish project',
    'schedule meeting', 'write report', 'clean house', 'exercise workout',
    'pay bills', 'book appointment', 'send email', 'review documents',
    'prepare presentation', 'organize files', 'update website', 'backup data',
    'meeting with team', 'doctor appointment', 'grocery shopping', 'oil change',
    'birthday party', 'dinner reservation', 'flight booking', 'hotel reservation',
    'étudier pour l\'examen', 'acheter des courses', 'appeler le dentiste', 'finir le projet',
    'programmer une réunion', 'écrire un rapport', 'nettoyer la maison', 'faire du sport',
    'payer les factures', 'prendre rendez-vous', 'envoyer un email', 'réviser les documents',
    'préparer la présentation', 'organiser les fichiers', 'mettre à jour le site', 'sauvegarder les données',
    'réunion équipe', 'rendez-vous médecin', 'faire les courses', 'vidange voiture',
    'anniversaire', 'réservation restaurant', 'réserver vol', 'réservation hôtel',
    'estudiar para el examen', 'comprar comestibles', 'llamar al dentista', 'terminar proyecto',
    'programar reunión', 'escribir informe', 'limpiar casa', 'hacer ejercicio',
    'pagar facturas', 'hacer cita', 'enviar correo', 'revisar documentos',
    'preparar presentación', 'organizar archivos', 'actualizar sitio web', 'respaldar datos',
    'reunión con equipo', 'cita médico', 'hacer compras', 'cambio aceite',
    'fiesta cumpleaños', 'reserva restaurante', 'reservar vuelo', 'reserva hotel',
    'buy', 'call', 'send', 'write', 'read', 'study', 'work', 'clean', 'organize', 'schedule',
    'acheter', 'appeler', 'envoyer', 'écrire', 'lire', 'étudier', 'travailler', 'nettoyer', 'organiser', 'programmer',
    'comprar', 'llamar', 'enviar', 'escribir', 'leer', 'estudiar', 'trabajar', 'limpiar', 'organizar', 'programar',
    'appointment', 'meeting', 'document', 'report', 'project', 'email', 'phone', 'computer',
    'rendez-vous', 'réunion', 'document', 'rapport', 'projet', 'email', 'téléphone', 'ordinateur',
    'cita', 'reunión', 'documento', 'informe', 'proyecto', 'correo', 'teléfono', 'computadora',
    'walk the dog', 'take out trash', 'wash dishes', 'do laundry', 'cook dinner', 'make breakfast',
    'make lunch', 'prepare snacks', 'water plants', 'vacuum floor', 'clean kitchen',
    'clean bathroom', 'sweep floor', 'mop floor', 'fold laundry', 'iron clothes', 'change bedsheets',
    'promener le chien', 'sortir les poubelles', 'laver la vaisselle', 'faire la lessive', 'préparer le dîner',
    'préparer le petit déjeuner', 'arroser les plantes', "passer l'aspirateur", 'nettoyer la cuisine',
    'nettoyer salle de bain', 'changer draps', 'repasser vêtements',
    'sacar la basura', 'lavar los platos', 'hacer la colada', 'cocinar la cena', 'preparar desayuno',
    'regar las plantas', 'pasar la aspiradora', 'limpiar cocina', 'limpiar baño', 'cambiar sábanas',
    'submit report', 'join meeting', 'update spreadsheet', 'review code', 'deploy app', 'fix bug',
    'send invoice', 'prepare budget', 'write proposal', 'check emails', 'attend training',
    'team presentation', 'debug program', 'analyze data', 'update CRM', 'customer call',
    'soumettre rapport', 'participer réunion', 'mettre à jour tableau', 'corriger bug', 'envoyer facture',
    'préparer budget', 'écrire proposition', 'vérifier emails', 'formation', 'présentation équipe',
    'entregar informe', 'unirse a reunión', 'actualizar hoja de cálculo', 'corregir error', 'enviar factura',
    'preparar presupuesto', 'escribir propuesta', 'revisar correos', 'presentación equipo',
    'go to gym', 'run 5km', 'yoga session', 'meditate', 'doctor checkup', 'dentist visit',
    'drink water', 'track calories', 'take medicine', 'health insurance renewal', 'stretching exercises',
    'walk outside', 'go for a run', 'do pushups', 'cycling session',
    'aller à la salle', 'courir 5km', 'séance yoga', 'méditer', 'consultation médecin',
    'visite dentiste', "boire de l'eau", 'prendre médicaments', 'renouveler assurance santé',
    'marche dehors', 'faire des pompes', 'séance vélo',
    'ir al gimnasio', 'correr 5km', 'sesión de yoga', 'meditar', 'cita médica',
    'visita dentista', 'beber agua', 'tomar medicina', 'renovar seguro médico',
    'caminar afuera', 'hacer flexiones', 'sesión de ciclismo',
    'buy clothes', 'order food', 'pay rent', 'transfer money', 'withdraw cash', 'shop online',
    'renew subscription', 'check bank account', 'buy gift', 'refill groceries',
    'pay electricity bill', 'pay water bill', 'pay internet bill', 'pay phone bill',
    'acheter vêtements', 'commander repas', 'payer loyer', 'transférer argent',
    'retirer argent', 'faire achats en ligne', 'renouveler abonnement', 'vérifier compte bancaire',
    'acheter cadeau', 'remplir courses', 'payer facture électricité', 'payer facture eau',
    'comprar ropa', 'pedir comida', 'pagar alquiler', 'transferir dinero',
    'retirar dinero', 'comprar en línea', 'renovar suscripción', 'revisar cuenta bancaria',
    'comprar regalo', 'reponer compras', 'pagar factura de luz', 'pagar factura de agua',
    'book taxi', 'buy train ticket', 'pack luggage', 'renew passport', 'fuel car',
    'pick up package', 'go to post office', 'check flights', 'hotel check-in', 'return books',
    'library visit', 'register for class', 'print documents', 'go to bank',
    'réserver taxi', 'acheter billet train', 'préparer valise', 'renouveler passeport',
    'faire le plein', 'récupérer colis', 'aller à la poste', 'vérifier vols', 'enregistrement hôtel',
    'visite bibliothèque', 'imprimer documents', 'aller à la banque',
    'reservar taxi', 'comprar billete tren', 'hacer maleta', 'renovar pasaporte',
    'llenar tanque', 'recoger paquete', 'ir a correos', 'revisar vuelos', 'check-in hotel',
    'visitar biblioteca', 'imprimir documentos', 'ir al banco',
    'call mom', 'visit grandma', 'buy birthday gift', 'dinner with friends', 'plan trip',
    'watch movie', 'read book', 'family lunch', 'go for coffee', 'attend wedding',
    'attend party', 'play video games', 'listen to music', 'walk in park',
    'appeler maman', 'visiter grand-mère', 'acheter cadeau anniversaire', 'dîner avec amis',
    'planifier voyage', 'regarder film', 'lire livre', 'déjeuner en famille', 'prendre un café',
    'aller au mariage', 'aller à la fête', 'jouer jeux vidéo', 'écouter musique', 'se promener parc',
    'llamar a mamá', 'visitar abuela', 'comprar regalo cumpleaños', 'cenar con amigos',
    'planear viaje', 'ver película', 'leer libro', 'almuerzo familiar', 'tomar café',
    'asistir boda', 'asistir fiesta', 'jugar videojuegos', 'escuchar música', 'pasear en parque'
  ];

  const getSuggestions = (value: string): string[] => {
    const inputValue = value.trim().toLowerCase();
    if (inputValue.length === 0) return [];
    
    return dictionary
      .filter(phrase => 
        phrase.toLowerCase().includes(inputValue) ||
        phrase.toLowerCase().startsWith(inputValue)
      )
      .sort((a, b) => {
        const aStarts = a.toLowerCase().startsWith(inputValue);
        const bStarts = b.toLowerCase().startsWith(inputValue);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return a.length - b.length;
      })
      .slice(0, 8);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);
    
    const newSuggestions = getSuggestions(value);
    setSuggestions(newSuggestions);
    setShowSuggestions(newSuggestions.length > 0);
    setActiveSuggestion(0);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setTitle(suggestion);
    setShowSuggestions(false);
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveSuggestion(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveSuggestion(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        if (suggestions[activeSuggestion]) {
          e.preventDefault();
          handleSuggestionClick(suggestions[activeSuggestion]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          required
          value={title}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          className={`${className} pr-12`}
          autoComplete="off"
        />
        
        {isSupported ? (
          <button
            type="button"
            onClick={startVoiceRecording}
            className={`absolute right-2 p-2 rounded-full transition-colors ${
              isListening 
                ? 'bg-red-500 text-white animate-pulse' 
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
            title={isListening ? 'Stop recording' : 'Start real-time voice input'}
          >
            {isListening ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <rect x="6" y="6" width="8" height="8" rx="1"/>
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd"/>
              </svg>
            )}
          </button>
        ) : (
          <button
            type="button"
            disabled
            className="absolute right-2 p-2 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed"
            title="Voice input not supported"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd"/>
            </svg>
          </button>
        )}
      </div>
      
      {/* Real-time speech feedback */}
      {speechFeedback && (
        <div className={`absolute -bottom-6 left-0 text-xs font-medium ${
          speechFeedback.includes('✅') ? 'text-green-600 dark:text-green-400' : 
          speechFeedback.includes('❌') ? 'text-red-600 dark:text-red-400' : 
          'text-blue-600 dark:text-blue-400'
        }`}>
          {speechFeedback}
          {isListening && " 🔴 Recording..."}
        </div>
      )}
      
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 
                     border border-slate-200 dark:border-slate-600 rounded-lg 
                     shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`px-4 py-2 cursor-pointer transition-colors
                         ${index === activeSuggestion 
                           ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100' 
                           : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                         }
                         ${index === 0 ? 'rounded-t-lg' : ''}
                         ${index === suggestions.length - 1 ? 'rounded-b-lg' : ''}
                         text-sm text-slate-700 dark:text-slate-300`}
              onClick={() => handleSuggestionClick(suggestion)}
              onMouseEnter={() => setActiveSuggestion(index)}
            >
              <span className="capitalize">{suggestion}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const InputCheckbox: React.FC<{
  label: string;
  isChecked: boolean;
  setChecked: (value: React.SetStateAction<boolean>) => void;
}> = ({ isChecked, setChecked, label }) => {
  return (
    <label className="mb-0 flex items-center cursor-pointer">
      <div className="mr-2 bg-slate-300/[.5] dark:bg-slate-800 w-5 h-5 rounded-full grid place-items-center border border-slate-300 dark:border-slate-700">
        {isChecked && (
          <span className="bg-rose-500 w-2 h-2 block rounded-full"></span>
        )}
      </div>
      <span className="order-1 flex-1">{label}</span>
      <input
        type="checkbox"
        className="sr-only"
        checked={isChecked}
        onChange={() => setChecked((prev: boolean) => !prev)}
      />
    </label>
  );
};

const ModalCreateTask: React.FC<{
  onClose: () => void;
  task?: Task;
  nameForm: string;
  onConfirm: (task: Task) => void;
}> = ({ onClose, task, nameForm, onConfirm }) => {
  const directories = useAppSelector((state) => state.tasks.directories);

  const today: Date = new Date();
  const todayDate: string = today.toISOString().split("T")[0];
  const maxDate: string =
    today.getFullYear() + 1 + "-" + (today.getMonth() + 1) + "-" + today.getDate();

  const [description, setDescription] = useState<string>(() => task?.description || "");
  const [title, setTitle] = useState<string>(() => task?.title || "");
  const [date, setDate] = useState<string>(() => task?.date || todayDate);
  const [time, setTime] = useState<string>(() => task?.time || "");
  const isTitleValid = useRef<Boolean>(false);
  const isDateValid = useRef<Boolean>(false);

  const [isImportant, setIsImportant] = useState<boolean>(() => task?.important || false);
  const [isCompleted, setIsCompleted] = useState<boolean>(() => task?.completed || false);
  const [selectedDirectory, setSelectedDirectory] = useState<string>(() => task?.dir || directories[0]);

  // Image state
  const [image, setImage] = useState<string | undefined>(() => task?.image);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addNewTaskHandler = (event: React.FormEvent): void => {
    event.preventDefault();

    isTitleValid.current = title.trim().length > 0;
    isDateValid.current = date.trim().length > 0;

    if (isTitleValid.current && isDateValid.current) {
      const newTask: Task = {
        title: title,
        dir: selectedDirectory,
        description: description,
        date: date,
        time: time || undefined,
        completed: isCompleted,
        important: isImportant,
        id: task?.id ? task.id : Date.now().toString(),
        image: image,
      };
      onConfirm(newTask);
      onClose();
    }
  };

  return (
    <Modal onClose={onClose} title={nameForm}>
      <form className="flex flex-col stylesInputsField max-h-[70vh] overflow-y-auto pr-2" onSubmit={addNewTaskHandler}>
        <label>
          Title
          <AutocompleteInput
            title={title}
            setTitle={setTitle}
            placeholder="e.g, study for the test / étudier pour l'examen / estudiar para el examen"
            className="w-full"
          />
        </label>
        <label>
          Date
          <CustomDatePicker
            value={date}
            onChange={setDate}
            min={todayDate}
            max={maxDate}
          />
        </label>
        <label>
          Time (optional)
          <CustomTimePicker
            value={time}
            onChange={setTime}
          />
          {time && (
            <small className="text-sm text-slate-600 dark:text-slate-400">
              📱 You'll get a notification reminder at this time
            </small>
          )}
        </label>
        <label>
          Description (optional)
          <textarea
            placeholder="e.g, study for the test / étudier pour l'examen / estudiar para el examen"
            className="w-full"
            value={description}
            onChange={({ target }) => setDescription(target.value)}
          ></textarea>
        </label>

        {/* Image Upload */}
        <label>
          Attach Image (optional)
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full"
          />
        </label>
        {image && (
          <img
            src={image}
            alt="Task Preview"
            className="mt-2 rounded-lg max-h-40 object-cover"
          />
        )}

        <label>
          Select a directory
          <select
            className="block w-full"
            value={selectedDirectory}
            onChange={({ target }) => setSelectedDirectory(target.value)}
          >
            {directories.map((dir: string) => (
              <option
                key={dir}
                value={dir}
                className="bg-slate-100 dark:bg-slate-800"
              >
                {dir}
              </option>
            ))}
          </select>
        </label>
        <InputCheckbox
          isChecked={isImportant}
          setChecked={setIsImportant}
          label="Mark as important"
        />
        <InputCheckbox
          isChecked={isCompleted}
          setChecked={setIsCompleted}
          label="Mark as completed"
        />
        <button type="submit" className="btn mt-5">
          {nameForm}
        </button>
      </form> 
    </Modal>
  );
};

export default ModalCreateTask;