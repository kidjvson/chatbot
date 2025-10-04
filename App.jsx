import React, { useState } from 'react';

export default function App() {
  const [token] = useState('DEV_TOKEN');
  const [reviews] = useState([{ id:1, author_name:'Luc', rating:2, text:'Service lent...', platform:'Google' }]);
  const [selected, setSelected] = useState(null);
  const [tone, setTone] = useState('professionnel');
  const [language, setLanguage] = useState('fr');
  const [generated, setGenerated] = useState('');

  async function generate(review) {
    setSelected(review);
    const res = await fetch('/api/generate-reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ reviewText: review.text, rating: review.rating, platform: review.platform, tone, language }),
    });
    const data = await res.json();
    setGenerated(data.reply || '');
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">AvisBot — Dashboard</h1>
      </header>
      <main className="grid grid-cols-3 gap-4">
        <section className="col-span-1">
          <h2 className="font-semibold">Avis récents</h2>
          <ul>
            {reviews.map(r => (
              <li key={r.id} className="p-2 border rounded my-2">
                <div className="flex justify-between">
                  <div>
                    <div className="font-medium">{r.author_name} — {r.platform}</div>
                    <div className="text-sm">{r.text}</div>
                  </div>
                  <button className="ml-2" onClick={() => generate(r)}>Générer</button>
                </div>
              </li>
            ))}
          </ul>
        </section>
        <section className="col-span-2">
          <h2 className="font-semibold">Réponse générée</h2>
          <div className="mb-2">
            <label>Tonalité:</label>
            <select value={tone} onChange={e => setTone(e.target.value)}>
              <option value="professionnel">Professionnel</option>
              <option value="chaleureux">Chaleureux</option>
              <option value="concise">Concise</option>
            </select>
          </div>
          <div className="mb-2">
            <label>Langue:</label>
            <select value={language} onChange={e => setLanguage(e.target.value)}>
              <option value="fr">Français</option>
              <option value="en">Anglais</option>
            </select>
          </div>
          <div className="p-4 border rounded min-h-[150px]">{generated || 'Génère une réponse pour voir ici'}</div>
          <div className="mt-4">
            <button className="mr-2">Publier (après approbation)</button>
            <button>Enregistrer</button>
          </div>
        </section>
      </main>
    </div>
  );
}
