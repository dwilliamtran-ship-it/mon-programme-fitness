import { useState, useEffect } from "react";

const programme = {
  Lundi: {
    focus: "Dos + Biceps", emoji: "💪", color: "blue",
    exercices: [
      { nom: "Tractions pronation larges", series: "4 x 6-8", materiel: "Barre" },
      { nom: "Chin-ups (supination)", series: "3 x 8-10", materiel: "Barre" },
      { nom: "Curl haltères alterné", series: "4 x 10-12", materiel: "Haltères" },
      { nom: "Curl marteau", series: "3 x 12", materiel: "Haltères" },
      { nom: "Curl concentré", series: "3 x 12", materiel: "Haltères" },
    ],
  },
  Mardi: {
    focus: "Pectoraux + Triceps", emoji: "🏋️", color: "purple",
    exercices: [
      { nom: "Pompes pieds surélevés", series: "4 x 12-15", materiel: "Poids du corps" },
      { nom: "Pompes diamant", series: "4 x 10-12", materiel: "Poids du corps" },
      { nom: "Pompes archer", series: "3 x 8/côté", materiel: "Poids du corps" },
      { nom: "Dips sur chaise", series: "4 x 12-15", materiel: "Chaise" },
      { nom: "Extension triceps haltère", series: "3 x 12", materiel: "Haltères" },
    ],
  },
  Mercredi: {
    focus: "Jambes + Fessiers", emoji: "🦵", color: "green",
    exercices: [
      { nom: "Squats bulgares", series: "4 x 10/jambe", materiel: "Haltères" },
      { nom: "Fentes marchées", series: "3 x 12/jambe", materiel: "Haltères" },
      { nom: "Hip thrust au sol", series: "4 x 15", materiel: "Poids du corps" },
      { nom: "Pont fessier unilatéral", series: "3 x 12/côté", materiel: "Poids du corps" },
      { nom: "Mollets debout lestés", series: "4 x 20", materiel: "Haltères" },
    ],
  },
  Jeudi: {
    focus: "Épaules", emoji: "🎯", color: "orange",
    exercices: [
      { nom: "Développé militaire haltères", series: "4 x 10-12", materiel: "Haltères" },
      { nom: "Élévations latérales", series: "4 x 15", materiel: "Haltères" },
      { nom: "Élévations frontales", series: "3 x 12", materiel: "Haltères" },
      { nom: "Oiseau (épaules arrière)", series: "4 x 15", materiel: "Haltères" },
      { nom: "Pike push-up", series: "3 x 10-12", materiel: "Poids du corps" },
    ],
  },
  Vendredi: {
    focus: "Full Body Force", emoji: "⚡", color: "red",
    exercices: [
      { nom: "Tractions lourdes", series: "4 x 5-6", materiel: "Barre" },
      { nom: "Pompes explosives", series: "4 x 8", materiel: "Poids du corps" },
      { nom: "Squats haltères lourd", series: "4 x 8", materiel: "Haltères" },
      { nom: "Curl haltères lourd", series: "3 x 8", materiel: "Haltères" },
      { nom: "Développé militaire lourd", series: "3 x 8", materiel: "Haltères" },
    ],
  },
};

const colorMap = {
  blue: { bg: "bg-blue-50", border: "border-blue-200", badge: "bg-blue-100 text-blue-700", header: "bg-blue-600" },
  purple: { bg: "bg-purple-50", border: "border-purple-200", badge: "bg-purple-100 text-purple-700", header: "bg-purple-600" },
  green: { bg: "bg-green-50", border: "border-green-200", badge: "bg-green-100 text-green-700", header: "bg-green-600" },
  orange: { bg: "bg-orange-50", border: "border-orange-200", badge: "bg-orange-100 text-orange-700", header: "bg-orange-600" },
  red: { bg: "bg-red-50", border: "border-red-200", badge: "bg-red-100 text-red-700", header: "bg-red-600" },
};

const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

function getWeekKey() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const week = Math.ceil(((now - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${week}`;
}

export default function App() {
  const [jourActif, setJourActif] = useState("Lundi");
  const [checked, setChecked] = useState({});
  const [joursValides, setJoursValides] = useState({});
  const [streak, setStreak] = useState(0);
  const weekKey = getWeekKey();

  useEffect(() => {
    try {
      const saved = localStorage.getItem("fitness-checked");
      const savedJours = localStorage.getItem("fitness-jours");
      const savedStreak = localStorage.getItem("fitness-streak");
      if (saved) setChecked(JSON.parse(saved));
      if (savedJours) setJoursValides(JSON.parse(savedJours));
      if (savedStreak) setStreak(parseInt(savedStreak));
    } catch(e) {}
  }, []);

  const save = (newChecked, newJours, newStreak) => {
    try {
      localStorage.setItem("fitness-checked", JSON.stringify(newChecked));
      localStorage.setItem("fitness-jours", JSON.stringify(newJours));
      localStorage.setItem("fitness-streak", String(newStreak));
    } catch(e) {}
  };

  const toggleExo = (jour, idx) => {
    const key = `${weekKey}-${jour}-${idx}`;
    const newChecked = { ...checked, [key]: !checked[key] };
    const exos = programme[jour].exercices;
    const allDone = exos.every((_, i) => newChecked[`${weekKey}-${jour}-${i}`]);
    const jourKey = `${weekKey}-${jour}`;
    const newJours = { ...joursValides, [jourKey]: allDone };
    const totalDone = jours.filter(j => newJours[`${weekKey}-${j}`]).length;
    setChecked(newChecked);
    setJoursValides(newJours);
    setStreak(totalDone);
    save(newChecked, newJours, totalDone);
  };

  const resetSemaine = () => {
    setChecked({});
    setJoursValides({});
    setStreak(0);
    save({}, {}, 0);
  };

  const jour = programme[jourActif];
  const colors = colorMap[jour.color];
  const totalSeance = jour.exercices.length;
  const doneSeance = jour.exercices.filter((_, i) => checked[`${weekKey}-${jourActif}-${i}`]).length;
  const seanceFaite = joursValides[`${weekKey}-${jourActif}`];
  const progressPct = Math.round((doneSeance / totalSeance) * 100);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4" style={{fontFamily: "system-ui, sans-serif"}}>
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Mon Programme</h1>
            <p className="text-gray-400 text-sm">5 jours · Prise de masse</p>
          </div>
          <div className="text-center bg-gray-800 rounded-2xl px-4 py-2">
            <div className="text-2xl font-bold text-yellow-400">{streak}/5</div>
            <div className="text-xs text-gray-400">cette semaine</div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl p-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-gray-300">Progression semaine</span>
            <span className="text-sm text-gray-400">{streak} séance{streak > 1 ? "s" : ""} complétée{streak > 1 ? "s" : ""}</span>
          </div>
          <div className="flex gap-2">
            {jours.map((j) => {
              const fait = joursValides[`${weekKey}-${j}`];
              const actif = j === jourActif;
              const c = colorMap[programme[j].color];
              return (
                <button key={j} onClick={() => setJourActif(j)}
                  className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${fait ? "bg-green-500 text-white" : actif ? `${c.header} text-white` : "bg-gray-700 text-gray-400"}`}>
                  {fait ? "✓" : programme[j].emoji}
                  <div className="text-xs mt-0.5">{j.slice(0, 3)}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className={`rounded-2xl overflow-hidden border ${colors.border} mb-4`}>
          <div className={`${colors.header} p-4`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{jour.emoji}</span>
                <div>
                  <h2 className="text-xl font-bold text-white">{jourActif}</h2>
                  <p className="text-white opacity-80 text-sm">{jour.focus}</p>
                </div>
              </div>
              {seanceFaite && <div className="bg-white bg-opacity-20 rounded-full px-3 py-1 text-white text-sm font-bold">✅ Séance faite !</div>}
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-white text-xs opacity-80 mb-1">
                <span>{doneSeance}/{totalSeance} exercices</span>
                <span>{progressPct}%</span>
              </div>
              <div className="bg-white bg-opacity-20 rounded-full h-2">
                <div className="bg-white rounded-full h-2 transition-all duration-500" style={{width: `${progressPct}%`}} />
              </div>
            </div>
          </div>

          <div className="bg-gray-900 divide-y divide-gray-800">
            {jour.exercices.map((exo, i) => {
              const key = `${weekKey}-${jourActif}-${i}`;
              const done = !!checked[key];
              return (
                <button key={i} onClick={() => toggleExo(jourActif, i)}
                  className={`w-full flex items-center gap-4 p-4 text-left transition-all ${done ? "bg-gray-800 opacity-70" : "hover:bg-gray-800"}`}>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${done ? "bg-green-500 border-green-500" : "border-gray-500"}`}>
                    {done && <span className="text-white text-xs font-bold">✓</span>}
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold text-sm ${done ? "line-through text-gray-500" : "text-white"}`}>{exo.nom}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{exo.series}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${colors.badge} font-medium`}>{exo.materiel}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <button onClick={() => { const idx = jours.indexOf(jourActif); if (idx > 0) setJourActif(jours[idx - 1]); }}
            disabled={jourActif === "Lundi"}
            className="flex-1 bg-gray-800 text-gray-300 py-3 rounded-xl text-sm font-semibold disabled:opacity-30">
            ← Précédent
          </button>
          <button onClick={() => { const idx = jours.indexOf(jourActif); if (idx < jours.length - 1) setJourActif(jours[idx + 1]); }}
            disabled={jourActif === "Vendredi"}
            className="flex-1 bg-gray-800 text-gray-300 py-3 rounded-xl text-sm font-semibold disabled:opacity-30">
            Suivant →
          </button>
        </div>

        <button onClick={resetSemaine} className="w-full bg-gray-800 text-gray-500 py-3 rounded-xl text-sm hover:text-gray-300 transition-colors">
          🔄 Réinitialiser la semaine
        </button>
      </div>
    </div>
  );
}
