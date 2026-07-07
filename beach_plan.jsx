import { useState, useEffect } from "react";

const PHASES = [
  { id: 1, name: "Acumulación", weeks: [1, 2], color: "#4ECDC4", desc: "Volumen alto, cargas moderadas. Reaprender patrones.", rpe: "RPE 7", sets: "3–4", reps: "12–15" },
  { id: 2, name: "Intensificación", weeks: [3, 4, 5], color: "#F7B731", desc: "Cargas más altas, volumen moderado. Máxima señal de hipertrofia.", rpe: "RPE 8", sets: "4", reps: "8–12" },
  { id: 3, name: "Peaking", weeks: [6, 7], color: "#FC5C65", desc: "Intensidad máxima, volumen controlado.", rpe: "RPE 8–9", sets: "4–5", reps: "6–10" },
  { id: 4, name: "Deload", weeks: [8], color: "#A29BFE", desc: "Volumen -40%, misma carga. Llegar a la playa recuperado.", rpe: "RPE 6–7", sets: "2–3", reps: "10–12" }
];

// REPS FORMAT: cada número = una serie. Ej: [12,10,10,8] = serie1:12reps, serie2:10reps, etc.
const WORKOUTS = {
  "Upper A": {
    titulo: "Upper A — Empuje + Bíceps",
    musculosPrincipales: "Pecho · Hombros · Tríceps · Bíceps",
    ejercicios: [
      { nombre: "Press banca plano (mancuernas)", series: { 1:[12,12,12], 2:[12,10,10], 3:[10,10,8,8], 4:[10,8,8,6], 5:[10,8,8,6], 6:[10,8,8,6], 7:[12,10,10], 8:[12,12,12] }, nota: "Excéntrico lento 2 segundos bajando. Codos a 45° del cuerpo." },
      { nombre: "Press inclinado mancuernas (45°)", series: { 1:[12,12,12], 2:[12,10,10], 3:[10,10,8], 4:[10,8,8], 5:[10,8,8], 6:[10,8,8], 7:[12,10,10], 8:[12,12,12] }, nota: "Énfasis en la parte superior del pecho." },
      { nombre: "Press militar sentado mancuernas", series: { 1:[12,12,12], 2:[12,10,10], 3:[10,10,8,8], 4:[10,8,8,8], 5:[10,8,8,8], 6:[10,8,8,8], 7:[12,10,10], 8:[12,12,12] }, nota: "Sentado siempre para reducir carga en la lumbar." },
      { nombre: "Elevaciones laterales", series: { 1:[15,15,15], 2:[15,12,12], 3:[15,12,12,12], 4:[12,12,12,12], 5:[12,12,12,12], 6:[12,10,10,10], 7:[15,12,12], 8:[15,15,15] }, nota: "Codo ligeramente doblado. Sube hasta la altura del hombro." },
      { nombre: "Tricep pushdown en polea", series: { 1:[15,15,15], 2:[15,12,12], 3:[12,12,12], 4:[12,12,10,10], 5:[12,12,10,10], 6:[12,10,10,10], 7:[15,12,12], 8:[15,15,15] }, nota: "SUPERSET con curl de bíceps. Codos pegados al cuerpo." },
      { nombre: "Curl bíceps mancuernas alterno", series: { 1:[12,12,12], 2:[12,10,10], 3:[12,10,10], 4:[10,10,10,10], 5:[10,10,10,10], 6:[10,10,8,8], 7:[12,10,10], 8:[12,12,12] }, nota: "SUPERSET con pushdown. No balancees el torso." },
      { nombre: "Face pulls en polea", series: { 1:[15,15,15], 2:[15,15,15], 3:[15,15,15], 4:[15,15,15], 5:[15,15,15], 6:[15,15,15], 7:[15,15,15], 8:[15,15,15] }, nota: "Siempre igual. Protege el manguito rotador. Polea a altura de cara." },
    ]
  },
  "Upper B": {
    titulo: "Upper B — Jalón + Tríceps",
    musculosPrincipales: "Espalda · Hombro posterior · Tríceps · Bíceps",
    ejercicios: [
      { nombre: "Jalón al pecho agarre ancho", series: { 1:[12,12,12], 2:[12,10,10], 3:[10,10,8,8], 4:[10,8,8,8], 5:[10,8,8,8], 6:[10,8,8,6], 7:[12,10,10], 8:[12,12,12] }, nota: "Pecho al frente, escápulas hacia abajo. Excéntrico controlado 2s." },
      { nombre: "Remo en polea sentado", series: { 1:[12,12,12], 2:[12,10,10], 3:[10,10,8,8], 4:[10,8,8,8], 5:[10,8,8,8], 6:[10,8,8,6], 7:[12,10,10], 8:[12,12,12] }, nota: "Espalda NEUTRAL siempre. No redondear la lumbar en ningún momento." },
      { nombre: "Jalón agarre neutro/cerrado", series: { 1:[12,12,12], 2:[12,12,10], 3:[12,10,10], 4:[10,10,10], 5:[10,10,10], 6:[10,10,8], 7:[12,12,10], 8:[12,12,12] }, nota: "Complementa el jalón ancho. Más activación del bíceps." },
      { nombre: "Rear delt fly (pájaro)", series: { 1:[15,15,15], 2:[15,15,12], 3:[15,12,12,12], 4:[15,12,12,12], 5:[15,12,12,12], 6:[12,12,12,12], 7:[15,15,12], 8:[15,15,15] }, nota: "Peso ligero, control total. Hombro posterior y manguito." },
      { nombre: "Extensión tríceps sobre cabeza", series: { 1:[15,15,15], 2:[15,12,12], 3:[12,12,12], 4:[12,12,10,10], 5:[12,12,10,10], 6:[12,10,10,10], 7:[15,12,12], 8:[15,15,15] }, nota: "Cabeza larga del tríceps. Codos apuntando al techo, no hacia afuera." },
      { nombre: "Curl martillo mancuernas", series: { 1:[12,12,12], 2:[12,10,10], 3:[12,10,10], 4:[10,10,10,10], 5:[10,10,10,10], 6:[10,10,8,8], 7:[12,10,10], 8:[12,12,12] }, nota: "Agarre neutro (como un martillo). Braquial y braquiorradial." },
      { nombre: "Plancha frontal", series: { 1:["30s","30s","30s"], 2:["35s","35s","35s"], 3:["40s","40s","40s"], 4:["45s","45s","45s"], 5:["50s","50s","50s"], 6:["55s","55s","55s"], 7:["45s","45s","45s"], 8:["30s","30s","30s"] }, nota: "Cadera alineada con el cuerpo. Core contraído. No aguantar la respiración." },
    ]
  },
  "Lower A": {
    titulo: "Lower A — Cuádriceps",
    musculosPrincipales: "Cuádriceps · Glúteo · Gemelos",
    ejercicios: [
      { nombre: "Prensa de pierna", series: { 1:[12,12,12], 2:[12,10,10], 3:[10,10,8,8], 4:[10,8,8,8], 5:[10,8,8,8], 6:[10,8,8,6], 7:[12,10,10], 8:[12,12,12] }, nota: "Pies al ancho de hombros en el centro de la plataforma. Sin bloquear rodillas arriba." },
      { nombre: "Sentadilla goblet (mancuerna al pecho)", series: { 1:[12,12,12], 2:[12,12,10], 3:[12,10,10], 4:[10,10,10], 5:[10,10,10], 6:[10,10,8], 7:[12,12,10], 8:[12,12,12] }, nota: "Mancuerna pegada al pecho. Talones en el suelo siempre. Baja hasta que los muslos queden paralelos al piso." },
      { nombre: "Extensión de cuádriceps (máquina)", series: { 1:[15,15,15], 2:[15,12,12], 3:[12,12,12,12], 4:[12,12,12,12], 5:[12,12,12,12], 6:[12,12,10,10], 7:[15,12,12], 8:[15,15,15] }, nota: "Aislamiento puro. Completa el rango de movimiento. Pausa 1 segundo arriba." },
      { nombre: "Hip thrust con barra", series: { 1:[12,12,12], 2:[12,10,10], 3:[10,10,8,8], 4:[10,8,8,8], 5:[10,8,8,8], 6:[10,8,8,6], 7:[12,10,10], 8:[12,12,12] }, nota: "El ejercicio más importante del día. Barra en las caderas con almohadilla. Empuja con los talones, no con los dedos." },
      { nombre: "Zancada estática con mancuernas", series: { 1:[10,10,10], 2:[10,10,10], 3:[10,10,10,10], 4:[10,10,10,10], 5:[10,10,10,10], 6:[10,10,8,8], 7:[10,10,10], 8:[10,10,10] }, nota: "10 reps por pierna. Pie trasero fijo, no das pasos. Rodilla delantera no sobrepasa el pie." },
      { nombre: "Gemelo de pie en máquina", series: { 1:[20,20,20], 2:[20,20,15], 3:[20,15,15,15], 4:[15,15,15,15], 5:[15,15,15,15], 6:[15,15,12,12], 7:[20,15,15], 8:[20,20,20] }, nota: "Rango completo: baja hasta sentir el estiramiento, sube de puntillas. Pausa 1s abajo." },
    ]
  },
  "Lower B": {
    titulo: "Lower B — Cadena Posterior",
    musculosPrincipales: "Isquiotibiales · Glúteo · Core",
    ejercicios: [
      { nombre: "Curl femoral tumbado (máquina)", series: { 1:[12,12,12], 2:[12,10,10], 3:[10,10,8,8], 4:[10,8,8,8], 5:[10,8,8,8], 6:[10,8,8,6], 7:[12,10,10], 8:[12,12,12] }, nota: "Baja lento en 3 segundos. Cadera pegada a la máquina siempre." },
      { nombre: "Hip thrust con barra", series: { 1:[12,12,12], 2:[12,10,10], 3:[10,10,8,8], 4:[10,8,8,8], 5:[10,8,8,8], 6:[10,8,8,6], 7:[12,10,10], 8:[12,12,12] }, nota: "Segunda vez en la semana. El glúteo necesita frecuencia 2x. Mismo peso que el lunes o más." },
      { nombre: "Peso muerto rumano con mancuernas", series: { 1:[12,12,12], 2:[12,10,10], 3:[10,10,10], 4:[10,10,10], 5:[10,10,10], 6:[10,10,8], 7:[12,10,10], 8:[12,12,12] }, nota: "⚠️ ESPALDA NEUTRAL siempre. Es una bisagra de cadera: empuja las caderas hacia atrás, no doblas la espalda. Mancuernas cerca de las piernas." },
      { nombre: "Prensa pierna pies arriba", series: { 1:[12,12,12], 2:[12,12,10], 3:[12,10,10], 4:[10,10,10], 5:[10,10,10], 6:[10,10,8], 7:[12,12,10], 8:[12,12,12] }, nota: "Pies en la parte alta de la plataforma = más isquiotibiales y glúteo." },
      { nombre: "Abducción de cadera (máquina)", series: { 1:[20,20,20], 2:[20,15,15], 3:[20,15,15,15], 4:[15,15,15,15], 5:[15,15,15,15], 6:[15,15,15,15], 7:[20,15,15], 8:[20,20,20] }, nota: "Glúteo medio. Importante para el aspecto visual lateral y estabilidad de cadera." },
      { nombre: "Gemelo sentado (máquina)", series: { 1:[20,20,20], 2:[20,20,15], 3:[20,15,15,15], 4:[15,15,15,15], 5:[15,15,15,15], 6:[15,15,12,12], 7:[20,15,15], 8:[20,20,20] }, nota: "Sóleo — músculo diferente al gemelo de pie. Rango completo igual." },
      { nombre: "Dead bug", series: { 1:["10/lado","10/lado","10/lado"], 2:["10/lado","10/lado","10/lado"], 3:["10/lado","10/lado","10/lado"], 4:["10/lado","10/lado","10/lado"], 5:["10/lado","10/lado","10/lado"], 6:["10/lado","10/lado","10/lado"], 7:["10/lado","10/lado","10/lado"], 8:["10/lado","10/lado","10/lado"] }, nota: "Core antiextensión. Espalda baja pegada al piso en todo momento. Seguro para columna." },
    ]
  },
  "LISS": {
    titulo: "LISS — Cardio Baja Intensidad",
    musculosPrincipales: "Quema de grasa sin interferir con la recuperación muscular",
    ejercicios: [
      { nombre: "Caminata inclinada en cinta (mejor opción)", series: { 1:["35 min"], 2:["38 min"], 3:["40 min"], 4:["40 min"], 5:["42 min"], 6:["45 min"], 7:["45 min"], 8:["30 min"] }, nota: "6–8 km/h · Inclinación 8–10%. Alta quema calórica, cero impacto en músculo." },
      { nombre: "Bicicleta estacionaria (alternativa)", series: { 1:["35 min"], 2:["38 min"], 3:["40 min"], 4:["40 min"], 5:["42 min"], 6:["45 min"], 7:["45 min"], 8:["30 min"] }, nota: "Resistencia moderada · RPE 5–6. Sin impacto en articulaciones." },
      { nombre: "Regla de intensidad", series: { 1:["—"], 2:["—"], 3:["—"], 4:["—"], 5:["—"], 6:["—"], 7:["—"], 8:["—"] }, nota: "Debes poder mantener una conversación completa. Si te ahogas, baja la intensidad. Si hablas sin esfuerzo, súbela." },
    ]
  }
};

function getWorkout(day) {
  const map = { lunes:"Upper A", martes:"Lower A", miercoles:"LISS", jueves:"Upper B", viernes:"Lower B" };
  return map[day] ? WORKOUTS[map[day]] : null;
}

function getPhase(week) { return PHASES.find(p => p.weeks.includes(week)); }

const WEEK_START = new Date(2026, 3, 28);
function getWeekDates(w) {
  const s = new Date(WEEK_START); s.setDate(s.getDate()+(w-1)*7);
  const e = new Date(s); e.setDate(e.getDate()+6);
  const f = d => d.toLocaleDateString("es-MX",{day:"numeric",month:"short"});
  return `${f(s)} – ${f(e)}`;
}

const DAYS = ["lunes","martes","miercoles","jueves","viernes"];
const DAY_LABELS = {lunes:"Lun",martes:"Mar",miercoles:"Mié",jueves:"Jue",viernes:"Vie"};
const DAY_COLORS = {lunes:"#4ECDC4",martes:"#F7B731",miercoles:"#74B9FF",jueves:"#4ECDC4",viernes:"#F7B731"};

function load() { try{const r=localStorage.getItem("bp8");return r?JSON.parse(r):{}}catch{return{}} }
function save(d) { try{localStorage.setItem("bp8",JSON.stringify(d))}catch{} }

function SeriesDisplay({ej, week, color}) {
  const reps = ej.series[week] || ej.series[1];
  return (
    <div style={{display:"flex", gap:5, flexWrap:"wrap", marginTop:4}}>
      {reps.map((r,i)=>(
        <div key={i} style={{background:`${color}20`, border:`1px solid ${color}30`, borderRadius:6, padding:"3px 8px", fontSize:10, fontWeight:700, color}}>
          S{i+1}: {r}
        </div>
      ))}
    </div>
  );
}

function GymLog({week, day, data, onChange}) {
  const wk = getWorkout(day);
  if(!wk) return null;
  const key = `w${week}_${day}`;
  const entry = data[key]||{};
  const color = DAY_COLORS[day];
  const realExs = wk.ejercicios.filter(e => !e.nombre.includes("Regla"));
  return (
    <div>
      {realExs.map((ej,i)=>{
        const done=entry[`done_${i}`]||false;
        const reps=ej.series[week]||ej.series[1];
        return (
          <div key={i} style={{padding:"10px 0", borderBottom:"1px solid rgba(255,255,255,0.05)", opacity:done?0.45:1}}>
            <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:6}}>
              <input type="checkbox" checked={done} onChange={e=>onChange(key,{...entry,[`done_${i}`]:e.target.checked})} style={{accentColor:color, width:16, height:16, flexShrink:0}}/>
              <div style={{fontSize:12, fontWeight:700, color:done?"#444":"#ddd"}}>{ej.nombre}</div>
            </div>
            <div style={{display:"grid", gridTemplateColumns:`repeat(${reps.length}, 1fr)`, gap:5, marginLeft:24}}>
              {reps.map((r,si)=>(
                <div key={si} style={{background:"rgba(255,255,255,0.04)", borderRadius:8, padding:"6px 4px", textAlign:"center"}}>
                  <div style={{fontSize:8, color:"#555", marginBottom:3}}>S{si+1} · {r}</div>
                  <input type="number" placeholder="kg" value={entry[`kg_${i}_${si}`]||""} onChange={e=>onChange(key,{...entry,[`kg_${i}_${si}`]:e.target.value})}
                    style={{width:"100%", background:"rgba(255,255,255,0.08)", border:`1px solid ${color}30`, borderRadius:5, color:"#fff", fontSize:11, padding:"3px 2px", textAlign:"center", outline:"none", boxSizing:"border-box"}}/>
                  <input type="number" placeholder="RPE" value={entry[`rpe_${i}_${si}`]||""} onChange={e=>onChange(key,{...entry,[`rpe_${i}_${si}`]:e.target.value})}
                    style={{width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:5, color:"#F7B731", fontSize:10, padding:"2px", textAlign:"center", outline:"none", boxSizing:"border-box", marginTop:3}}/>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      <textarea placeholder="Notas de la sesión..." value={entry.notas||""} onChange={e=>onChange(key,{...entry,notas:e.target.value})} rows={2}
        style={{marginTop:10, width:"100%", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:8, color:"#ccc", fontSize:11, padding:"8px 10px", resize:"none", outline:"none", boxSizing:"border-box", fontFamily:"inherit"}}/>
    </div>
  );
}

function WeightEntry({week, data, onChange}) {
  const days=["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];
  const start=new Date(WEEK_START); start.setDate(start.getDate()+(week-1)*7);
  return (
    <div>
      <div style={{fontSize:10, fontWeight:700, letterSpacing:2, color:"#555", marginBottom:10, textTransform:"uppercase"}}>⚖️ Peso diario — ayunas · post-baño</div>
      <div style={{display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:5}}>
        {days.map((day,i)=>{
          const date=new Date(start); date.setDate(date.getDate()+i);
          const key=date.toISOString().split("T")[0];
          const entry=data[key]||{};
          return (
            <div key={key} style={{background:"rgba(255,255,255,0.04)", borderRadius:10, padding:"7px 4px", border:"1px solid rgba(255,255,255,0.07)"}}>
              <div style={{fontSize:10, fontWeight:700, color:"#aaa", textAlign:"center", marginBottom:5}}>{day}<br/><span style={{fontWeight:400,fontSize:9}}>{date.getDate()}/{date.getMonth()+1}</span></div>
              {[["kg","kg"],["gras","% G"],["musc","% M"]].map(([field,label])=>(
                <div key={field} style={{marginBottom:4}}>
                  <div style={{fontSize:8,color:"#555",marginBottom:1,textAlign:"center"}}>{label}</div>
                  <input type="number" step="0.1" placeholder="—" value={entry[field]||""} onChange={e=>onChange(key,{...entry,[field]:e.target.value})}
                    style={{width:"100%",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:6,color:"#fff",fontSize:11,padding:"3px 2px",textAlign:"center",outline:"none",boxSizing:"border-box"}}/>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ExportPanel({gymData, weightData}) {
  const [copied, setCopied] = useState(false);

  function buildExport() {
    let txt = "═══════════════════════════════════\n";
    txt += "   REPORTE SEMANAL — BEACH PLAN\n";
    txt += `   Generado: ${new Date().toLocaleDateString("es-MX",{day:"numeric",month:"long",year:"numeric"})}\n`;
    txt += "═══════════════════════════════════\n\n";

    // Weight summary per week
    txt += "📊 PESO / GRASA / MÚSCULO\n";
    txt += "───────────────────────────────────\n";
    for(let w=1; w<=8; w++) {
      const start=new Date(WEEK_START); start.setDate(start.getDate()+(w-1)*7);
      const days=Array.from({length:7},(_,i)=>{const d=new Date(start);d.setDate(d.getDate()+i);return d.toISOString().split("T")[0];});
      const entries=days.map(d=>weightData[d]).filter(e=>e&&e.kg);
      if(entries.length===0) continue;
      const avg=f=>(entries.filter(e=>e[f]).reduce((s,e)=>s+(parseFloat(e[f])||0),0)/entries.filter(e=>e[f]).length).toFixed(1);
      const first=parseFloat(entries[0].kg), last=parseFloat(entries[entries.length-1].kg);
      const delta=(last-first).toFixed(1);
      txt += `Sem ${w} (${getWeekDates(w)})\n`;
      txt += `  Peso prom: ${avg("kg")} kg | Δ semana: ${delta>0?"+":""}${delta} kg\n`;
      if(entries.some(e=>e.gras)) txt += `  Grasa prom: ${avg("gras")}%\n`;
      if(entries.some(e=>e.musc)) txt += `  Músculo prom: ${avg("musc")}%\n`;
      txt += `  Días registrados: ${entries.length}/7\n\n`;
    }

    // Gym log per week
    txt += "💪 CARGAS POR EJERCICIO\n";
    txt += "───────────────────────────────────\n";
    const dayWorkoutMap = {lunes:"Upper A", martes:"Lower A", miercoles:"LISS", jueves:"Upper B", viernes:"Lower B"};
    for(let w=1; w<=8; w++) {
      let weekHasData = false;
      let weekTxt = `\nSEMANA ${w} — ${getWeekDates(w)}\n`;
      DAYS.forEach(day=>{
        const key=`w${w}_${day}`;
        const entry=gymData[key];
        if(!entry||Object.keys(entry).length===0) return;
        const wkName=dayWorkoutMap[day];
        const wk=WORKOUTS[wkName];
        if(!wk) return;
        weekHasData=true;
        weekTxt += `\n  ${wk.titulo}\n`;
        const realExs=wk.ejercicios.filter(e=>!e.nombre.includes("Regla"));
        realExs.forEach((ej,i)=>{
          const reps=ej.series[w]||ej.series[1];
          const kgs=reps.map((_,si)=>entry[`kg_${i}_${si}`]||"—").join(" / ");
          const rpes=reps.map((_,si)=>entry[`rpe_${i}_${si}`]||"—").join(" / ");
          const done=entry[`done_${i}`]?"✓":"○";
          weekTxt += `  ${done} ${ej.nombre}\n`;
          weekTxt += `     kg por serie: ${kgs}\n`;
          weekTxt += `     RPE por serie: ${rpes}\n`;
        });
        if(entry.notas) weekTxt += `  Notas: ${entry.notas}\n`;
      });
      if(weekHasData) txt += weekTxt;
    }

    txt += "\n═══════════════════════════════════\n";
    txt += "Pega este texto en el chat con Claude\n";
    txt += "para recibir recomendaciones de carga.\n";
    txt += "═══════════════════════════════════\n";
    return txt;
  }

  function copyToClipboard() {
    const txt = buildExport();
    navigator.clipboard.writeText(txt).then(()=>{
      setCopied(true);
      setTimeout(()=>setCopied(false), 3000);
    });
  }

  const hasAnyData = Object.keys(gymData).length > 0 || Object.keys(weightData).length > 0;

  return (
    <div>
      <div style={{fontSize:10, fontWeight:700, color:"#555", letterSpacing:2, textTransform:"uppercase", marginBottom:12}}>
        📋 Exportar para análisis con Claude
      </div>
      <div style={{background:"rgba(78,205,196,0.07)", border:"1px solid rgba(78,205,196,0.2)", borderRadius:12, padding:14, marginBottom:14}}>
        <div style={{fontSize:12, fontWeight:700, color:"#4ECDC4", marginBottom:8}}>¿Cómo funciona?</div>
        {["1. Registra tus cargas (kg) y RPE por serie en el Tracker cada sesión.", "2. Registra tu peso diario en ayunas.", "3. Cuando quieras una revisión, pulsa el botón de abajo.", "4. Pega el texto en el chat y Claude te dirá qué pesos usar la siguiente semana."].map((s,i)=>(
          <div key={i} style={{fontSize:11, color:"#aaa", marginBottom:5, lineHeight:1.5}}>{s}</div>
        ))}
      </div>

      {hasAnyData ? (
        <button onClick={copyToClipboard} style={{width:"100%", padding:"14px", background:copied?"rgba(78,205,196,0.2)":"rgba(78,205,196,0.1)", border:`2px solid ${copied?"#4ECDC4":"rgba(78,205,196,0.3)"}`, borderRadius:12, color:"#4ECDC4", fontSize:14, fontWeight:800, cursor:"pointer", transition:"all 0.3s", letterSpacing:0.5}}>
          {copied ? "✅ ¡Copiado! Pégalo en el chat" : "📋 Copiar reporte para Claude"}
        </button>
      ) : (
        <div style={{padding:"20px", textAlign:"center", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12}}>
          <div style={{fontSize:13, color:"#444", marginBottom:4}}>Aún no hay datos registrados</div>
          <div style={{fontSize:11, color:"#333"}}>Ve al Tracker y empieza a registrar tus sesiones y peso diario.</div>
        </div>
      )}

      <div style={{marginTop:12, padding:"10px 12px", background:"rgba(247,183,49,0.07)", border:"1px solid rgba(247,183,49,0.15)", borderRadius:10, fontSize:10, color:"#F7B731", lineHeight:1.6}}>
        💡 Recomendado: exportar cada 1–2 semanas. No tomar decisiones de carga basadas en un solo día.
      </div>
    </div>
  );
}

function ProtocolPanel() {
  const items = [
    {icon:"⚖️", title:"Registro diario", desc:"Peso, % grasa y % músculo en ayunas, post-baño, misma hora todos los días."},
    {icon:"🍽️", title:"Plan alimenticio", desc:"Seguir equivalentes de Regina con mínimo 85% de adherencia semanal."},
    {icon:"💪", title:"Entrenamiento", desc:"4–5 días/semana. Sobrecarga progresiva, buena técnica, RPE controlado."},
    {icon:"🚶", title:"Actividad diaria", desc:"7,000–10,000 pasos. Complementar con caminatas y LISS."},
    {icon:"💊", title:"Suplementación", desc:"Creatina diaria + Omega 3. No depender de suplementos como base."},
    {icon:"😴", title:"Descanso", desc:"Mínimo 7–8 horas de sueño. Ajustar entrenamiento si hay fatiga acumulada."},
    {icon:"💧", title:"Hidratación", desc:"2–3 litros de agua diarios. Más en días de entreno intenso."},
    {icon:"🧠", title:"Enfoque mental", desc:"Consistencia sobre perfección. No cambiar el plan sin evidencia clara."},
  ];
  return (
    <div>
      <div style={{fontSize:10, fontWeight:700, color:"#555", letterSpacing:2, textTransform:"uppercase", marginBottom:12}}>🎯 Protocolo del proyecto</div>
      <div style={{background:"rgba(252,92,101,0.08)", border:"1px solid rgba(252,92,101,0.2)", borderRadius:10, padding:"10px 14px", marginBottom:14, fontSize:11, color:"#FC5C65", fontWeight:700, lineHeight:1.6}}>
        Regla general: No cambiar el plan sin evidencia clara de que algo no está funcionando.
      </div>
      {items.map((item,i)=>(
        <div key={i} style={{display:"flex", gap:12, padding:"10px 0", borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
          <div style={{fontSize:18, flexShrink:0, marginTop:1}}>{item.icon}</div>
          <div>
            <div style={{fontSize:12, fontWeight:700, color:"#ddd", marginBottom:2}}>{item.title}</div>
            <div style={{fontSize:11, color:"#666", lineHeight:1.5}}>{item.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("plan");
  const [week, setWeek] = useState(1);
  const [day, setDay] = useState("lunes");
  const [gymData, setGymData] = useState({});
  const [weightData, setWeightData] = useState({});

  useEffect(()=>{const s=load();setGymData(s.gym||{});setWeightData(s.weight||{});}, []);
  const updGym=(k,v)=>{const u={...gymData,[k]:v};setGymData(u);save({gym:u,weight:weightData});};
  const updWeight=(k,v)=>{const u={...weightData,[k]:v};setWeightData(u);save({gym:gymData,weight:u});};

  const phase=getPhase(week);
  const workout=getWorkout(day);
  const dayColor=DAY_COLORS[day];

  return (
    <div style={{minHeight:"100vh", background:"#08080f", color:"#fff", fontFamily:"'DM Sans','Segoe UI',sans-serif", paddingBottom:40}}>

      {/* HEADER */}
      <div style={{background:"linear-gradient(160deg,#0d0d1a 0%,#0a0a14 100%)", borderBottom:"1px solid rgba(255,255,255,0.06)", padding:"20px 20px 0"}}>
        <div style={{display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:16}}>
          <div>
            <div style={{fontSize:10, letterSpacing:3, color:"#444", fontWeight:700, textTransform:"uppercase", marginBottom:4}}>Plan 8 Semanas</div>
            <div style={{fontSize:22, fontWeight:800, letterSpacing:-0.5}}>Beach Body 🏖️</div>
            <div style={{fontSize:12, color:"#444", marginTop:2}}>28 Abr → 22 Jun 2026</div>
          </div>
          <div style={{background:"rgba(252,92,101,0.15)", border:"1px solid rgba(252,92,101,0.3)", borderRadius:12, padding:"8px 12px", textAlign:"center"}}>
            <div style={{fontSize:10, color:"#FC5C65", fontWeight:700}}>PLAYA</div>
            <div style={{fontSize:13, fontWeight:800, color:"#FC5C65"}}>8 sem</div>
            <div style={{fontSize:10, color:"#FC5C65"}}>🏖️</div>
          </div>
        </div>
        <div style={{display:"flex"}}>
          {[["plan","📅 Plan"],["tracker","📊 Tracker"],["exportar","📋 Exportar"],["protocolo","🎯 Protocolo"]].map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)} style={{flex:1, padding:"10px 0", border:"none", background:"transparent", color:tab===id?"#fff":"#444", fontSize:10, fontWeight:tab===id?700:500, borderBottom:tab===id?"2px solid #4ECDC4":"2px solid transparent", cursor:"pointer"}}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{padding:"16px 16px 0"}}>

        {/* WEEK + DAY SELECTORS — shown in plan and tracker */}
        {(tab==="plan"||tab==="tracker") && (
          <>
            {/* Phase bar */}
            <div style={{display:"flex", gap:4, marginBottom:14}}>
              {PHASES.map(p=>(
                <div key={p.id} style={{flex:p.weeks.length, background:`${p.color}15`, border:`1px solid ${p.color}30`, borderRadius:8, padding:"5px 6px"}}>
                  <div style={{fontSize:8, fontWeight:800, color:p.color}}>{p.name.toUpperCase()}</div>
                  <div style={{fontSize:8, color:"#444"}}>S{p.weeks[0]}{p.weeks.length>1?`–${p.weeks[p.weeks.length-1]}`:""}</div>
                </div>
              ))}
            </div>

            {/* Week selector */}
            <div style={{marginBottom:12}}>
              <div style={{display:"flex", gap:6, flexWrap:"wrap", marginBottom:8}}>
                {Array.from({length:8},(_,i)=>i+1).map(w=>{
                  const ph=getPhase(w); const isSel=w===week;
                  return <button key={w} onClick={()=>setWeek(w)} style={{width:36,height:36,borderRadius:10,border:"none",background:isSel?ph.color:"rgba(255,255,255,0.06)",color:isSel?"#000":"#666",fontWeight:isSel?800:500,fontSize:13,cursor:"pointer",boxShadow:isSel?`0 0 12px ${ph.color}55`:"none"}}>{w}</button>;
                })}
              </div>
              <div style={{padding:"8px 12px", background:`${phase.color}12`, border:`1px solid ${phase.color}25`, borderRadius:10}}>
                <div style={{fontSize:12, fontWeight:700, color:phase.color}}>Fase {phase.id}: {phase.name} · {getWeekDates(week)}</div>
                <div style={{display:"flex", gap:6, marginTop:5}}>
                  {[["RPE",phase.rpe],["Series",phase.sets],["Reps",phase.reps]].map(([l,v])=>(
                    <div key={l} style={{background:`${phase.color}20`, borderRadius:6, padding:"3px 8px"}}>
                      <span style={{fontSize:9, color:"#666"}}>{l}: </span>
                      <span style={{fontSize:10, fontWeight:700, color:phase.color}}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Day selector */}
            <div style={{display:"flex", gap:5, marginBottom:14}}>
              {DAYS.map(dk=>{
                const isSel=dk===day; const accent=DAY_COLORS[dk];
                const hasData=tab==="tracker"&&Object.keys(gymData[`w${week}_${dk}`]||{}).length>0;
                return (
                  <button key={dk} onClick={()=>setDay(dk)} style={{flex:1, padding:"8px 4px", borderRadius:10, border:"none", background:isSel?`${accent}20`:"rgba(255,255,255,0.04)", color:isSel?accent:"#444", fontSize:11, fontWeight:isSel?700:500, cursor:"pointer", borderBottom:isSel?`2px solid ${accent}`:"2px solid transparent", position:"relative"}}>
                    {DAY_LABELS[dk]}
                    {hasData&&<span style={{position:"absolute",top:3,right:5,width:5,height:5,borderRadius:"50%",background:accent}}/>}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* PLAN TAB */}
        {tab==="plan" && workout && (
          <div style={{background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, overflow:"hidden"}}>
            <div style={{padding:"14px 16px", background:`${dayColor}12`, borderBottom:`2px solid ${dayColor}25`}}>
              <div style={{fontSize:15, fontWeight:800}}>{workout.titulo}</div>
              <div style={{fontSize:11, color:"#555", marginTop:2}}>{workout.musculosPrincipales}</div>
            </div>
            {workout.ejercicios.map((ej,i)=>(
              <div key={i} style={{padding:"12px 16px", borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                <div style={{display:"flex", alignItems:"flex-start", gap:10}}>
                  <div style={{width:22, height:22, borderRadius:6, background:`${dayColor}20`, color:dayColor, fontSize:10, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1}}>{i+1}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12, fontWeight:700, color:"#ddd", marginBottom:3}}>{ej.nombre}</div>
                    <SeriesDisplay ej={ej} week={week} color={dayColor}/>
                    <div style={{fontSize:10, color:"#555", marginTop:5, lineHeight:1.5}}>{ej.nota}</div>
                  </div>
                </div>
              </div>
            ))}
            <div style={{padding:"10px 14px", background:"rgba(252,92,101,0.05)", fontSize:10, color:"#FC5C65", lineHeight:1.6}}>
              ⚠️ Core activado · Columna neutral · Sin redondear lumbar · Dolor irradiado = stop inmediato
            </div>
          </div>
        )}

        {/* TRACKER TAB */}
        {tab==="tracker" && (
          <div>
            <div style={{background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:16, marginBottom:14}}>
              {workout&&<div style={{fontSize:13, fontWeight:700, color:dayColor, marginBottom:12}}>{workout.titulo}</div>}
              <div style={{fontSize:9, color:"#555", marginBottom:10}}>Registra kg y RPE por cada serie · Marca ✓ cuando termines el ejercicio</div>
              <GymLog week={week} day={day} data={gymData} onChange={updGym}/>
            </div>
            <div style={{background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:16}}>
              <WeightEntry week={week} data={weightData} onChange={updWeight}/>
            </div>
          </div>
        )}

        {tab==="exportar" && <ExportPanel gymData={gymData} weightData={weightData}/>}
        {tab==="protocolo" && <ProtocolPanel/>}
      </div>
    </div>
  );
}
