import { useMemo, useState } from 'react';
import { allDishes } from '../data/data.js';

const flattenFoodList = () => {
  return Object.values(allDishes).flat();
};

export default function FoodVoiceSearch({ foodList = flattenFoodList() }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const filteredFoods = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return foodList;
    return foodList.filter((item) => item.name.toLowerCase().includes(query));
  }, [foodList, searchTerm]);

  const handleVoiceSearch = () => {
    setErrorMessage('');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMessage('Voice search is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchTerm(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setErrorMessage('Voice recognition failed. Please try again.');
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div style={{ maxWidth: 920, margin: '0 auto', padding: '24px', fontFamily: 'inherit' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 28, color: '#111827' }}>Search Food by Voice</h2>
        <p style={{ margin: '10px auto 0', color: '#6b7280', maxWidth: 560 }}>
          Speak the food name and the list updates automatically. No extra search button needed.
        </p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginBottom: 18 }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Say a food name like Burger, Pancakes, or Salad"
          style={{
            flex: '1 1 320px',
            minWidth: 240,
            padding: '12px 14px',
            borderRadius: 14,
            border: '1px solid #d1d5db',
            fontSize: 15,
            outline: 'none',
          }}
        />
        <button
          type="button"
          onClick={handleVoiceSearch}
          style={{
            padding: '12px 22px',
            borderRadius: 14,
            border: 'none',
            backgroundColor: isListening ? '#ef4444' : '#10b981',
            color: '#ffffff',
            cursor: 'pointer',
            fontWeight: 700,
            minWidth: 160,
          }}
        >
          {isListening ? '🛑 Listening…' : '🎙️ Speak Now'}
        </button>
      </div>

      {errorMessage && (
        <div style={{ marginBottom: 18, color: '#b91c1c', textAlign: 'center' }}>{errorMessage}</div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 16 }}>
        {filteredFoods.length > 0 ? (
          filteredFoods.map((food) => (
            <div key={food.id} style={{ background: '#fff', borderRadius: 20, padding: 18, border: '1px solid #e5e7eb', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <span style={{ fontSize: 28 }}>{food.emoji}</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: 18, color: '#111827' }}>{food.name}</h3>
                  <div style={{ fontSize: 13, color: '#6b7280' }}>{food.price}</div>
                </div>
              </div>
              <p style={{ margin: 0, color: '#4b5563', fontSize: 13, lineHeight: 1.6 }}>{food.desc}</p>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 22, borderRadius: 16, background: '#f8fafc', color: '#475569' }}>
            No matching food items found.
          </div>
        )}
      </div>
    </div>
  );
}
