import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Sun, Moon, Droplet, Plus, Minus, X, ChevronDown, ChevronLeft, ChevronRight,
  Coffee, Sandwich, Soup, Cookie, Copy, Check, ClipboardPaste,
  Camera, Loader2, CheckCircle2, AlertCircle, Candy, Sparkles,
  Home, BarChart2, Target, Settings, Flame, Star, Trophy, Zap, ScanLine, Type, Clock,
} from 'lucide-react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell, ReferenceLine, LineChart, Line, YAxis } from 'recharts';

const PROFILE_KEY = 'tracker-profile-v3';
const STORAGE_KEY = 'tracker-state-v3';
const FAVORITES_KEY = 'tracker-favorites-v1';

function lsGet(key) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : null;
  } catch (e) { return null; }
}
function lsSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
}
function lsDelete(key) {
  try { localStorage.removeItem(key); } catch (e) {}
}

const FONT_DISPLAY = "Georgia, 'Iowan Old Style', 'Palatino Linotype', serif";
const FONT_BODY = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

const PROFILE_IMG = "data:image/png;base64,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";

const MEAL_META = {
  breakfast: { label: 'Breakfast', icon: Coffee, color: '#1F7A6C' },
  lunch: { label: 'Lunch', icon: Sandwich, color: '#C9922E' },
  dinner: { label: 'Dinner', icon: Soup, color: '#B5573A' },
  snacks: { label: 'Snacks', icon: Cookie, color: '#8A5FA8' },
};
const MEAL_ORDER = ['breakfast', 'lunch', 'dinner', 'snacks'];

const ACTIVITY_FACTORS = { sedentary: 1.2, light: 1.375, moderate: 1.55, very: 1.725, athlete: 1.9 };
const ACTIVITY_OPTIONS = [
  { key: 'sedentary', label: 'Sedentary', sub: 'Little to no exercise' },
  { key: 'light', label: 'Lightly active', sub: '1–3 days a week' },
  { key: 'moderate', label: 'Moderately active', sub: '3–5 days a week' },
  { key: 'very', label: 'Very active', sub: '6–7 days a week' },
  { key: 'athlete', label: 'Athlete', sub: 'Intense daily training' },
];
const PACE_OPTIONS = [
  { key: 'gentle', label: 'Gentle', sub: 'Slow and comfortable' },
  { key: 'steady', label: 'Steady', sub: 'Balanced pace' },
  { key: 'aggressive', label: 'Aggressive', sub: 'Faster, more effort' },
];
const EATING_STYLES = [
  { key: 'none', label: 'No preference' },
  { key: 'highprotein', label: 'High-protein' },
  { key: 'lowcarb', label: 'Low-carb' },
  { key: 'keto', label: 'Keto' },
  { key: 'vegetarian', label: 'Vegetarian' },
  { key: 'vegan', label: 'Vegan' },
];

const PLATE_SCHEMA_NOTE = 'Respond with ONLY a raw JSON object — no markdown fences, no preamble, no explanation. Format: {"mealName": string, "items": [{"name": string, "serving": string, "calories": number, "protein": number, "carbs": number, "fat": number, "sugar": number, "isFreeFood": boolean}]}. "mealName" is a short 2-5 word label. "sugar" is grams of sugar (a subset of carbs). "isFreeFood" is true only for a plain raw or simply-cooked whole fruit or vegetable with no added fat, sugar, breading, or frying — false otherwise. Be decisive: one best-guess number per item, not a range.';

function toKey(d) {
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, '0'), day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
function emptyDay() {
  return { meals: { breakfast: [], lunch: [], dinner: [], snacks: [] }, water: 0, coffee: 0 };
}
function addDays(d, n) {
  const nd = new Date(d);
  nd.setDate(nd.getDate() + n);
  return nd;
}
function computePoints(item) {
  if (item.isFreeFood) return 0;
  const raw = (item.calories || 0) / 45 + (item.sugar || 0) / 12 + (item.fat || 0) / 9 - (item.protein || 0) / 12;
  return Math.max(0, Math.round(raw));
}
function aggregateComponents(components) {
  const t = { calories: 0, protein: 0, carbs: 0, fat: 0, sugar: 0, points: 0 };
  components.forEach((c) => {
    t.calories += c.calories || 0;
    t.protein += c.protein || 0;
    t.carbs += c.carbs || 0;
    t.fat += c.fat || 0;
    t.sugar += c.sugar || 0;
    t.points += c.points || 0;
  });
  return t;
}
function plateComponents(plate) {
  if (plate.components && plate.components.length) return plate.components;
  return [{
    id: plate.id, name: plate.name, serving: plate.serving || '',
    calories: plate.calories, protein: plate.protein, carbs: plate.carbs, fat: plate.fat,
    sugar: plate.sugar, points: plate.points, isFreeFood: plate.isFreeFood,
  }];
}
function dayHasLogs(day) {
  return !!day && MEAL_ORDER.some((m) => (day.meals[m] || []).length > 0);
}
function dayTotals(day) {
  const t = { calories: 0, protein: 0, carbs: 0, fat: 0, sugar: 0, points: 0 };
  MEAL_ORDER.forEach((m) => {
    (day.meals[m] || []).forEach((item) => {
      t.calories += item.calories || 0;
      t.protein += item.protein || 0;
      t.carbs += item.carbs || 0;
      t.fat += item.fat || 0;
      t.sugar += item.sugar || 0;
      t.points += item.points || 0;
    });
  });
  return t;
}

function computeTargets(a) {
  const weightKg = a.weightLb * 0.453592;
  const heightCm = (a.feet * 12 + a.inches) * 2.54;
  const bmr = a.sex === 'male'
    ? 10 * weightKg + 6.25 * heightCm - 5 * a.age + 5
    : 10 * weightKg + 6.25 * heightCm - 5 * a.age - 161;
  const tdee = bmr * ACTIVITY_FACTORS[a.activity];

  let calorieTarget;
  if (a.goal === 'lose') {
    const deficit = a.pace === 'gentle' ? 250 : a.pace === 'aggressive' ? 650 : 400;
    const floor = a.sex === 'male' ? 1500 : 1200;
    calorieTarget = Math.max(floor, tdee - deficit);
  } else if (a.goal === 'gain') {
    const surplus = a.pace === 'gentle' ? 250 : a.pace === 'aggressive' ? 400 : 325;
    calorieTarget = tdee + surplus;
  } else {
    calorieTarget = tdee;
  }
  calorieTarget = Math.round(calorieTarget);

  const proteinPerLb = (a.goal === 'lose' || a.activity === 'athlete' || a.eatingStyle === 'highprotein') ? 1.0 : 0.8;
  const protein = Math.round(a.weightLb * proteinPerLb);
  const fat = Math.round(a.weightLb * 0.35);
  const carbs = Math.max(0, Math.round((calorieTarget - protein * 4 - fat * 9) / 4));
  const water = Math.round(a.weightLb * 0.75 * 0.0295735 * 10) / 10;
  const points = Math.max(20, Math.round(calorieTarget / 45));

  let weeksToGoal = null;
  if (a.goal !== 'maintain' && a.goalWeightLb) {
    const weeklyGap = (tdee - calorieTarget) * 7;
    const weeklyChangeLb = weeklyGap / 3500;
    if (Math.abs(weeklyChangeLb) > 0.01) {
      weeksToGoal = Math.round(Math.abs(a.weightLb - a.goalWeightLb) / Math.abs(weeklyChangeLb));
    }
  }

  return { bmr: Math.round(bmr), tdee: Math.round(tdee), calories: calorieTarget, protein, carbs, fat, sugar: 25, water, points, weeksToGoal };
}

function computeStreak(days) {
  const todayKey = toKey(new Date());
  let cursor = new Date();
  if (!dayHasLogs(days[todayKey])) cursor = addDays(cursor, -1);
  let streak = 0;
  while (dayHasLogs(days[toKey(cursor)])) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

function computeLongestStreak(days) {
  const keys = Object.keys(days).filter((k) => dayHasLogs(days[k])).sort();
  if (keys.length === 0) return 0;
  let longest = 1, run = 1;
  for (let i = 1; i < keys.length; i++) {
    const prev = new Date(keys[i - 1]);
    const cur = new Date(keys[i]);
    const diffDays = Math.round((cur - prev) / 86400000);
    if (diffDays === 1) { run++; longest = Math.max(longest, run); } else { run = 1; }
  }
  return longest;
}

function computeXP(days, targets) {
  let xp = 0;
  Object.values(days).forEach((day) => {
    const mealsLogged = MEAL_ORDER.reduce((s, m) => s + (day.meals[m] || []).length, 0);
    xp += mealsLogged * 10;
    if (targets) {
      const t = dayTotals(day);
      if (t.calories > 0 && t.calories <= targets.calories * 1.05) xp += 20;
      if ((day.water || 0) >= targets.water) xp += 5;
    }
  });
  return xp;
}

async function callFoodAI(systemPrompt, content) {
  const response = await fetch('/.netlify/functions/food-ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ system: systemPrompt, content, max_tokens: 1000 }),
  });
  if (!response.ok) throw new Error('api error');
  const data = await response.json();
  const textOut = (data.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('\n');
  const cleaned = textOut.replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(cleaned);
  const rawItems = Array.isArray(parsed.items) ? parsed.items : (Array.isArray(parsed) ? parsed : []);
  if (rawItems.length === 0) throw new Error('empty');
  return { mealName: parsed.mealName, rawItems };
}

function buildPlate(mealName, rawItems) {
  const components = rawItems.map((it) => {
    const base = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: it.name || 'Food item', serving: it.serving || '',
      calories: Number(it.calories) || 0, protein: Number(it.protein) || 0,
      carbs: Number(it.carbs) || 0, fat: Number(it.fat) || 0, sugar: Number(it.sugar) || 0,
      isFreeFood: !!it.isFreeFood,
    };
    return { ...base, points: computePoints(base) };
  });
  const agg = aggregateComponents(components);
  const name = mealName || (components.length === 1 ? components[0].name : components.map((c) => c.name).slice(0, 3).join(', '));
  return { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, name, components, loggedAt: Date.now(), ...agg };
}

const BADGE_DEFS = [
  { key: 'streak7', label: '7-Day Streak', icon: Flame, test: (c) => c.streak >= 7 },
  { key: 'streak30', label: '30-Day Streak', icon: Flame, test: (c) => c.streak >= 30 },
  { key: 'proteinMaster', label: 'Protein Master', icon: Trophy, test: (c) => c.proteinHitDays >= 5 },
  { key: 'earlyLogger', label: 'Early Logger', icon: Sun, test: (c) => c.earlyLogs >= 3 },
  { key: 'macroBalanced', label: 'Macro Balanced', icon: Target, test: (c) => c.balancedDays >= 3 },
  { key: 'mealPrepPro', label: 'Meal Prep Pro', icon: Star, test: (c) => c.favoritesCount >= 3 },
];

function useCountUp(target, duration = 700) {
  const [value, setValue] = useState(target);
  const prev = useRef(target);
  useEffect(() => {
    const start = prev.current, end = target;
    if (Math.abs(start - end) < 0.01) { setValue(end); return; }
    const t0 = performance.now();
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(start + (end - start) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else prev.current = end;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

function Ring({ size, stroke, progress, colorFrom, colorTo, track, gradId }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(1, progress));
  return (
    <svg width={size} height={size} style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colorFrom} />
          <stop offset="100%" stopColor={colorTo} />
        </linearGradient>
      </defs>
      <circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        stroke={`url(#${gradId})`} strokeWidth={stroke} fill="none" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - clamped)}
        style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)' }}
      />
    </svg>
  );
}

function LeafMark({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 20C4 11 10 4 20 4C19 14 13 20 4 20Z" fill="#fff" />
      <path d="M5.5 18.5C8.5 14.5 11.5 11.5 16 7.5" stroke="rgba(20,40,25,0.35)" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function OptionRow({ selected, label, sub, onClick, card, border, textPrimary, textSecondary, accent }) {
  return (
    <button className="tap" onClick={onClick} style={{
      width: '100%', textAlign: 'left', padding: '14px 16px', borderRadius: 14,
      border: `1.5px solid ${selected ? accent : border}`, background: selected ? `${accent}18` : card,
      display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 10,
    }}>
      <span style={{ fontSize: 14, fontWeight: 600, color: textPrimary }}>{label}</span>
      {sub && <span style={{ fontSize: 12, color: textSecondary }}>{sub}</span>}
    </button>
  );
}

function Onboarding({ dark, card, border, textPrimary, textSecondary, accent, accentGradient, onComplete }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [a, setA] = useState({
    name: '', age: '', sex: '', feet: '', inches: '', weightLb: '',
    goal: '', goalWeightLb: '', activity: '', pace: '', eatingStyle: 'none', mode: '',
  });
  const set = (k, v) => setA((p) => ({ ...p, [k]: v }));

  const steps = useMemo(() => {
    const s = ['welcome', 'name', 'age', 'sex', 'height', 'weight', 'goal'];
    if (a.goal !== 'maintain') s.push('goalWeight');
    s.push('activity');
    if (a.goal !== 'maintain') s.push('pace');
    s.push('eatingStyle', 'mode', 'results');
    return s;
  }, [a.goal]);

  const idx = Math.min(stepIndex, steps.length - 1);
  const key = steps[idx];
  const progress = idx / (steps.length - 1);
  const next = () => setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  const back = () => setStepIndex((i) => Math.max(i - 1, 0));

  const inputStyle = {
    width: '100%', borderRadius: 12, border: `1px solid ${border}`, background: dark ? '#12180F' : '#F7F8F2',
    color: textPrimary, fontSize: 15, padding: '12px 14px', fontFamily: FONT_BODY, marginBottom: 6,
  };
  const labelStyle = { fontFamily: FONT_DISPLAY, fontSize: 21, fontWeight: 700, color: textPrimary, marginBottom: 4, letterSpacing: '-0.01em' };
  const helperStyle = { fontSize: 13, color: textSecondary, marginBottom: 18 };

  const targets = key === 'results' ? computeTargets({
    age: Number(a.age), sex: a.sex, feet: Number(a.feet) || 0, inches: Number(a.inches) || 0,
    weightLb: Number(a.weightLb), goal: a.goal, goalWeightLb: Number(a.goalWeightLb) || null,
    activity: a.activity, pace: a.pace, eatingStyle: a.eatingStyle,
  }) : null;

  const valid = {
    welcome: true,
    name: a.name.trim().length > 0,
    age: Number(a.age) > 0,
    sex: !!a.sex,
    height: Number(a.feet) > 0,
    weight: Number(a.weightLb) > 0,
    goal: !!a.goal,
    goalWeight: Number(a.goalWeightLb) > 0,
    activity: !!a.activity,
    pace: !!a.pace,
    eatingStyle: true,
    mode: !!a.mode,
    results: true,
  }[key];

  const finish = () => {
    onComplete({
      name: a.name.trim(), mode: a.mode, eatingStyle: a.eatingStyle, goal: a.goal, targets,
      weightLb: Number(a.weightLb), goalWeightLb: Number(a.goalWeightLb) || null,
    });
  };

  return (
    <div style={{ paddingBottom: 8 }}>
      {key !== 'welcome' && (
        <div style={{ height: 4, borderRadius: 2, background: dark ? '#233022' : '#E4E9DE', marginBottom: 22, overflow: 'hidden' }}>
          <div style={{ width: `${progress * 100}%`, height: '100%', background: accentGradient, transition: 'width 0.3s ease' }} />
        </div>
      )}

      {key === 'welcome' && (
        <div className="fadein" style={{ textAlign: 'center', paddingTop: 10 }}>
          <div style={{ width: 56, height: 56, borderRadius: 18, margin: '0 auto 18px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: accentGradient }}>
            <Sparkles size={24} color="#fff" />
          </div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 700, color: textPrimary, marginBottom: 10 }}>Hi, I'm your nutrition coach.</div>
          <div style={{ fontSize: 14, color: textSecondary, marginBottom: 20, lineHeight: 1.5 }}>Let's get your plan dialed in.</div>
          <div style={{ fontSize: 12.5, color: textSecondary, background: card, border: `1px solid ${border}`, borderRadius: 14, padding: 14, textAlign: 'left', lineHeight: 1.5, marginBottom: 24 }}>
            Quick note before we start: I'm an AI assistant, not a medical professional. Check with your primary care physician before starting any new diet or making changes for a medical or dietary condition.
          </div>
          <div style={{ fontSize: 13, color: textSecondary, marginBottom: 8, lineHeight: 1.5, textAlign: 'left' }}>
            I'd love to ask a few quick questions so I can build a plan that actually fits you.
          </div>
        </div>
      )}

      {key === 'name' && (
        <div className="fadein">
          <div style={labelStyle}>What's your first name?</div>
          <div style={helperStyle}>Just so I know what to call you.</div>
          <input autoFocus value={a.name} onChange={(e) => set('name', e.target.value)} placeholder="First name" style={inputStyle} />
        </div>
      )}

      {key === 'age' && (
        <div className="fadein">
          <div style={labelStyle}>How old are you?</div>
          <div style={helperStyle}>Age factors into your metabolic rate.</div>
          <input type="number" inputMode="numeric" value={a.age} onChange={(e) => set('age', e.target.value)} placeholder="Age" style={inputStyle} />
        </div>
      )}

      {key === 'sex' && (
        <div className="fadein">
          <div style={labelStyle}>Biological sex</div>
          <div style={helperStyle}>Needed for the metabolic math (Mifflin-St Jeor).</div>
          <OptionRow selected={a.sex === 'female'} label="Female" onClick={() => set('sex', 'female')} card={card} border={border} textPrimary={textPrimary} textSecondary={textSecondary} accent={accent} />
          <OptionRow selected={a.sex === 'male'} label="Male" onClick={() => set('sex', 'male')} card={card} border={border} textPrimary={textPrimary} textSecondary={textSecondary} accent={accent} />
        </div>
      )}

      {key === 'height' && (
        <div className="fadein">
          <div style={labelStyle}>How tall are you?</div>
          <div style={helperStyle}>Feet and inches.</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <input type="number" inputMode="numeric" value={a.feet} onChange={(e) => set('feet', e.target.value)} placeholder="Feet" style={{ ...inputStyle, flex: 1 }} />
            <input type="number" inputMode="numeric" value={a.inches} onChange={(e) => set('inches', e.target.value)} placeholder="Inches" style={{ ...inputStyle, flex: 1 }} />
          </div>
        </div>
      )}

      {key === 'weight' && (
        <div className="fadein">
          <div style={labelStyle}>Current weight</div>
          <div style={helperStyle}>In pounds.</div>
          <input type="number" inputMode="numeric" value={a.weightLb} onChange={(e) => set('weightLb', e.target.value)} placeholder="Weight (lb)" style={inputStyle} />
        </div>
      )}

      {key === 'goal' && (
        <div className="fadein">
          <div style={labelStyle}>What's your goal?</div>
          <OptionRow selected={a.goal === 'lose'} label="Lose weight" onClick={() => set('goal', 'lose')} card={card} border={border} textPrimary={textPrimary} textSecondary={textSecondary} accent={accent} />
          <OptionRow selected={a.goal === 'maintain'} label="Maintain" onClick={() => set('goal', 'maintain')} card={card} border={border} textPrimary={textPrimary} textSecondary={textSecondary} accent={accent} />
          <OptionRow selected={a.goal === 'gain'} label="Gain weight" onClick={() => set('goal', 'gain')} card={card} border={border} textPrimary={textPrimary} textSecondary={textSecondary} accent={accent} />
        </div>
      )}

      {key === 'goalWeight' && (
        <div className="fadein">
          <div style={labelStyle}>Goal weight</div>
          <div style={helperStyle}>In pounds.</div>
          <input type="number" inputMode="numeric" value={a.goalWeightLb} onChange={(e) => set('goalWeightLb', e.target.value)} placeholder="Goal weight (lb)" style={inputStyle} />
        </div>
      )}

      {key === 'activity' && (
        <div className="fadein">
          <div style={labelStyle}>Activity level</div>
          {ACTIVITY_OPTIONS.map((o) => (
            <OptionRow key={o.key} selected={a.activity === o.key} label={o.label} sub={o.sub} onClick={() => set('activity', o.key)} card={card} border={border} textPrimary={textPrimary} textSecondary={textSecondary} accent={accent} />
          ))}
        </div>
      )}

      {key === 'pace' && (
        <div className="fadein">
          <div style={labelStyle}>How fast do you want results?</div>
          {PACE_OPTIONS.map((o) => (
            <OptionRow key={o.key} selected={a.pace === o.key} label={o.label} sub={o.sub} onClick={() => set('pace', o.key)} card={card} border={border} textPrimary={textPrimary} textSecondary={textSecondary} accent={accent} />
          ))}
        </div>
      )}

      {key === 'eatingStyle' && (
        <div className="fadein">
          <div style={labelStyle}>Eating style</div>
          <div style={helperStyle}>Optional preference, if you have one.</div>
          {EATING_STYLES.map((o) => (
            <OptionRow key={o.key} selected={a.eatingStyle === o.key} label={o.label} onClick={() => set('eatingStyle', o.key)} card={card} border={border} textPrimary={textPrimary} textSecondary={textSecondary} accent={accent} />
          ))}
        </div>
      )}

      {key === 'mode' && (
        <div className="fadein">
          <div style={labelStyle}>How do you want to track?</div>
          <div style={helperStyle}>You can switch later in Settings.</div>
          <OptionRow selected={a.mode === 'points'} label="Points" sub="A daily point budget — fruits & veggies are free" onClick={() => set('mode', 'points')} card={card} border={border} textPrimary={textPrimary} textSecondary={textSecondary} accent={accent} />
          <OptionRow selected={a.mode === 'calories'} label="Calories" sub="Straightforward calorie & macro counting" onClick={() => set('mode', 'calories')} card={card} border={border} textPrimary={textPrimary} textSecondary={textSecondary} accent={accent} />
        </div>
      )}

      {key === 'results' && targets && (
        <div className="fadein">
          <div style={labelStyle}>Your plan{a.name ? `, ${a.name}` : ''}</div>
          <div style={{ ...helperStyle, marginBottom: 16 }}>Here's what I calculated.</div>
          <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: 16, marginBottom: 12 }}>
            {a.mode === 'points' ? (
              <>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 28, fontWeight: 700, color: textPrimary }}>{targets.points} <span style={{ fontFamily: FONT_BODY, fontSize: 14, fontWeight: 500, color: textSecondary }}>points / day</span></div>
                <div style={{ fontSize: 12, color: textSecondary, marginTop: 2 }}>~{targets.calories} cal for reference</div>
              </>
            ) : (
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 28, fontWeight: 700, color: textPrimary }}>{targets.calories} <span style={{ fontFamily: FONT_BODY, fontSize: 14, fontWeight: 500, color: textSecondary }}>cal / day</span></div>
            )}
            <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 12.5, color: textSecondary }}>
              <span>{targets.protein}g protein</span>
              <span>{targets.carbs}g carbs</span>
              <span>{targets.fat}g fat</span>
            </div>
            <div style={{ fontSize: 12.5, color: textSecondary, marginTop: 4 }}>{targets.water}L water/day</div>
            {targets.weeksToGoal ? (
              <div style={{ fontSize: 12.5, color: textSecondary, marginTop: 8 }}>At this pace, about {targets.weeksToGoal} weeks to your goal.</div>
            ) : null}
          </div>
          <div style={{ fontSize: 11, color: textSecondary, lineHeight: 1.5, marginBottom: 8 }}>
            Methodology: BMR via Mifflin-St Jeor, TDEE via standard activity multipliers, ~3,500 kcal per pound for pacing, protein/fat from common sports-nutrition guidelines{a.mode === 'points' ? ', points sized from your calorie target (not any specific commercial program\u2019s formula)' : ''}.
          </div>
          <div style={{ fontSize: 11, color: textSecondary, lineHeight: 1.5 }}>
            General guidance, not medical advice — check with your doctor before making changes tied to a health condition.
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
        {idx > 0 && (
          <button className="tap" onClick={back} style={{ flex: 1, padding: '13px 0', borderRadius: 12, border: `1px solid ${border}`, background: 'transparent', color: textPrimary, fontSize: 14, fontWeight: 600 }}>
            Back
          </button>
        )}
        <button
          className="tap" onClick={key === 'results' ? finish : next} disabled={!valid}
          style={{
            flex: idx > 0 ? 2 : 1, padding: '13px 0', borderRadius: 12, border: 'none',
            background: accentGradient, color: '#fff', fontSize: 14, fontWeight: 600,
            opacity: valid ? 1 : 0.5,
          }}
        >
          {key === 'welcome' ? 'Start' : key === 'results' ? "Let's go" : 'Next'}
        </button>
      </div>
    </div>
  );
}

export default function TrackerApp() {
  const [theme, setTheme] = useState('light');
  const [days, setDays] = useState({});
  const [weightLog, setWeightLog] = useState({});
  const [profile, setProfile] = useState(null);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [viewDate, setViewDate] = useState(new Date());
  const [followingToday, setFollowingToday] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [backupOpen, setBackupOpen] = useState(false);
  const [copyState, setCopyState] = useState('idle');
  const [restoreText, setRestoreText] = useState('');
  const [restoreMsg, setRestoreMsg] = useState('');
  const [now, setNow] = useState(new Date());
  const [analyzing, setAnalyzing] = useState(false);
  const [toast, setToast] = useState(null);
  const [pendingFile, setPendingFile] = useState(null);
  const [pendingPreview, setPendingPreview] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [scanMode, setScanMode] = useState('plate');
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [manualText, setManualText] = useState('');
  const [manualSubmitting, setManualSubmitting] = useState(false);
  const [favPickerOpen, setFavPickerOpen] = useState(false);
  const [expandedIds, setExpandedIds] = useState(() => new Set());
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [weightInput, setWeightInput] = useState('');
  const fileInputRef = useRef(null);

  const todayKey = toKey(new Date());
  const viewKey = toKey(viewDate);
  const isToday = viewKey === todayKey;
  const viewDay = days[viewKey] || emptyDay();
  const mode = profile ? profile.mode : 'calories';
  const targets = profile ? profile.targets : null;

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (followingToday) setViewDate(new Date());
  }, [now, followingToday]);

  useEffect(() => {
    const p = lsGet(PROFILE_KEY);
    if (p) setProfile(p);
    const s = lsGet(STORAGE_KEY);
    if (s) {
      setDays(s.days || {});
      setWeightLog(s.weightLog || {});
      setTheme(s.theme || 'light');
    }
    const f = lsGet(FAVORITES_KEY);
    if (f) setFavorites(f);
    setProfileLoaded(true);
  }, []);

  useEffect(() => {
    if (!profileLoaded) return;
    lsSet(STORAGE_KEY, { days, theme, weightLog });
  }, [days, theme, weightLog, profileLoaded]);

  useEffect(() => {
    if (!profileLoaded || !profile) return;
    lsSet(PROFILE_KEY, profile);
  }, [profile, profileLoaded]);

  useEffect(() => {
    if (!profileLoaded) return;
    lsSet(FAVORITES_KEY, favorites);
  }, [favorites, profileLoaded]);

  const handleOnboardingComplete = (p) => setProfile(p);
  const retakeQuestionnaire = () => {
    lsDelete(PROFILE_KEY);
    setProfile(null);
  };

  const updateWater = (delta) => {
    setDays((prev) => {
      const cur = prev[viewKey] || emptyDay();
      const nextWater = Math.max(0, Math.round((cur.water + delta) * 100) / 100);
      return { ...prev, [viewKey]: { ...cur, water: nextWater } };
    });
  };

  const updateCoffee = (delta) => {
    setDays((prev) => {
      const cur = prev[viewKey] || emptyDay();
      const nextCoffee = Math.max(0, (cur.coffee || 0) + delta);
      return { ...prev, [viewKey]: { ...cur, coffee: nextCoffee } };
    });
  };

  const goPrev = () => { setFollowingToday(false); setViewDate((d) => addDays(d, -1)); };
  const goNext = () => {
    setViewDate((d) => {
      const nd = addDays(d, 1);
      setFollowingToday(toKey(nd) === toKey(new Date()));
      return nd;
    });
  };
  const goToday = () => { setFollowingToday(true); setViewDate(new Date()); };
  const goYesterday = () => { setFollowingToday(false); setViewDate(addDays(new Date(), -1)); };
  const jumpToDate = (dateStr) => {
    if (!dateStr) return;
    const [y, m, d] = dateStr.split('-').map(Number);
    const nd = new Date(y, m - 1, d);
    setFollowingToday(toKey(nd) === toKey(new Date()));
    setViewDate(nd);
  };

  const discardPending = () => {
    if (pendingPreview) URL.revokeObjectURL(pendingPreview);
    setPendingFile(null);
    setPendingPreview(null);
    setNoteText('');
  };

  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const removePlate = (meal, id) => {
    setDays((prev) => {
      const cur = prev[viewKey] || emptyDay();
      const nextMeals = { ...cur.meals, [meal]: cur.meals[meal].filter((p) => p.id !== id) };
      return { ...prev, [viewKey]: { ...cur, meals: nextMeals } };
    });
    if (editingId === id) { setEditingId(null); setEditText(''); }
  };

  const startEdit = (id) => { setEditingId(id); setEditText(''); };
  const cancelEdit = () => { setEditingId(null); setEditText(''); };

  const isFavorited = (plate) => favorites.some((f) => f.sourceName === plate.name && JSON.stringify(f.components.map((c) => c.name)) === JSON.stringify(plateComponents(plate).map((c) => c.name)));

  const toggleFavorite = (plate) => {
    setFavorites((prev) => {
      const existingIdx = prev.findIndex((f) => f.sourceName === plate.name && JSON.stringify(f.components.map((c) => c.name)) === JSON.stringify(plateComponents(plate).map((c) => c.name)));
      if (existingIdx >= 0) return prev.filter((_, i) => i !== existingIdx);
      const comps = plateComponents(plate);
      const agg = aggregateComponents(comps);
      return [...prev, { id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, sourceName: plate.name, name: plate.name, components: comps, ...agg }];
    });
  };

  const addFavoriteToLog = (fav) => {
    const components = fav.components.map((c) => ({ ...c, id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}` }));
    const agg = aggregateComponents(components);
    const plate = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, name: fav.name, components, loggedAt: Date.now(), ...agg };
    const hour = new Date().getHours();
    const mealSlot = hour < 11 ? 'breakfast' : hour < 15 ? 'lunch' : hour < 17 ? 'snacks' : hour < 21 ? 'dinner' : 'snacks';
    setDays((prev) => {
      const cur = prev[viewKey] || emptyDay();
      const nextMeals = { ...cur.meals, [mealSlot]: [...cur.meals[mealSlot], plate] };
      return { ...prev, [viewKey]: { ...cur, meals: nextMeals } };
    });
    setFavPickerOpen(false);
    setToast({ type: 'success', text: `Added from favorites: ${fav.name}` });
    setTimeout(() => setToast(null), 3000);
  };

  const triggerSnap = (which) => {
    setScanMode(which);
    setAddMenuOpen(false);
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const analyzePhoto = async (file, note) => {
    setAnalyzing(true);
    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(',')[1]);
        reader.onerror = () => reject(new Error('read failed'));
        reader.readAsDataURL(file);
      });
      const mediaType = file.type || 'image/jpeg';
      const trimmedNote = (note || '').trim();
      const isLabel = scanMode === 'label';
      const userText = trimmedNote ? `${isLabel ? 'Read this nutrition label.' : 'Log this meal.'} Note from me: ${trimmedNote}` : (isLabel ? 'Read this nutrition label.' : 'Log this meal.');
      const systemPrompt = isLabel
        ? `You are reading a printed Nutrition Facts label in a photo for a food-tracking app. Read the values exactly as printed (calories, protein, carbs, fat, sugar, serving size) — do not estimate visually, use the printed numbers. Return it as a single item. ${PLATE_SCHEMA_NOTE} isFreeFood should be false for any packaged/labeled product.`
        : `You are a nutrition estimation engine for a food-logging app. Identify EVERY distinct food item visible in the photo — if it's a full plate with several components, list each one as its own separate item rather than combining them into one entry. Estimate calories and macros for each using standard USDA-style reference values. The user may include a short note with details the photo doesn't fully show — weigh that note over your own visual guess wherever they conflict. ${PLATE_SCHEMA_NOTE} If something is ambiguous and no note resolves it, make the most reasonable assumption silently.`;

      const { mealName, rawItems } = await callFoodAI(systemPrompt, [
        { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
        { type: 'text', text: userText },
      ]);
      const plate = buildPlate(mealName, rawItems);

      const hour = new Date().getHours();
      const mealSlot = hour < 11 ? 'breakfast' : hour < 15 ? 'lunch' : hour < 17 ? 'snacks' : hour < 21 ? 'dinner' : 'snacks';

      setDays((prev) => {
        const cur = prev[viewKey] || emptyDay();
        const nextMeals = { ...cur.meals, [mealSlot]: [...cur.meals[mealSlot], plate] };
        return { ...prev, [viewKey]: { ...cur, meals: nextMeals } };
      });

      const metricLabel = mode === 'points' ? `${Math.round(plate.points)} pts` : `${Math.round(plate.calories)} cal`;
      setToast({ type: 'success', text: `Added to ${MEAL_META[mealSlot].label}: ${plate.name} · ${metricLabel}` });
    } catch (e) {
      setToast({ type: 'error', text: `Couldn't read that ${scanMode === 'label' ? 'label' : 'photo'} — try again` });
    } finally {
      setAnalyzing(false);
      setTimeout(() => setToast(null), 3400);
    }
  };

  const submitManualEntry = async () => {
    if (!manualText.trim()) return;
    setManualSubmitting(true);
    try {
      const systemPrompt = `You are a nutrition estimation engine for a food-logging app. The user is describing what they ate in plain text (no photo). Identify each distinct food item they mention and estimate calories and macros using standard USDA-style reference values. ${PLATE_SCHEMA_NOTE}`;
      const { mealName, rawItems } = await callFoodAI(systemPrompt, `Log this: ${manualText.trim()}`);
      const plate = buildPlate(mealName, rawItems);
      const hour = new Date().getHours();
      const mealSlot = hour < 11 ? 'breakfast' : hour < 15 ? 'lunch' : hour < 17 ? 'snacks' : hour < 21 ? 'dinner' : 'snacks';
      setDays((prev) => {
        const cur = prev[viewKey] || emptyDay();
        const nextMeals = { ...cur.meals, [mealSlot]: [...cur.meals[mealSlot], plate] };
        return { ...prev, [viewKey]: { ...cur, meals: nextMeals } };
      });
      const metricLabel = mode === 'points' ? `${Math.round(plate.points)} pts` : `${Math.round(plate.calories)} cal`;
      setToast({ type: 'success', text: `Added to ${MEAL_META[mealSlot].label}: ${plate.name} · ${metricLabel}` });
      setManualOpen(false);
      setManualText('');
    } catch (e) {
      setToast({ type: 'error', text: "Couldn't parse that — try rewording" });
    } finally {
      setManualSubmitting(false);
      setTimeout(() => setToast(null), 3400);
    }
  };

  const submitEdit = async (meal, plateId) => {
    const plate = (days[viewKey]?.meals[meal] || []).find((p) => p.id === plateId);
    if (!plate || !editText.trim()) return;
    setEditSubmitting(true);
    try {
      const currentForAI = plateComponents(plate).map((c) => ({
        name: c.name, serving: c.serving, calories: c.calories, protein: c.protein, carbs: c.carbs, fat: c.fat, sugar: c.sugar, isFreeFood: c.isFreeFood,
      }));
      const systemPrompt = `You are revising an already-logged plate in a food-tracking app based on a correction from the user. You are NOT looking at a new photo — just apply the correction to the item list you're given. ${PLATE_SCHEMA_NOTE}`;
      const { mealName, rawItems } = await callFoodAI(systemPrompt, `Current logged items: ${JSON.stringify(currentForAI)}\n\nUser correction: ${editText.trim()}\n\nReturn the corrected JSON object reflecting this change.`);
      const updated = buildPlate(mealName || plate.name, rawItems);
      setDays((prev) => {
        const cur = prev[viewKey] || emptyDay();
        const nextArr = cur.meals[meal].map((p) => (p.id === plateId ? { ...p, name: updated.name, components: updated.components, calories: updated.calories, protein: updated.protein, carbs: updated.carbs, fat: updated.fat, sugar: updated.sugar, points: updated.points } : p));
        return { ...prev, [viewKey]: { ...cur, meals: { ...cur.meals, [meal]: nextArr } } };
      });
      setEditingId(null);
      setEditText('');
      setToast({ type: 'success', text: 'Updated.' });
    } catch (e) {
      setToast({ type: 'error', text: "Couldn't apply that change — try again" });
    } finally {
      setEditSubmitting(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const confirmPending = () => {
    if (!pendingFile) return;
    analyzePhoto(pendingFile, noteText);
    discardPending();
  };
  const skipPending = () => {
    if (!pendingFile) return;
    analyzePhoto(pendingFile, '');
    discardPending();
  };

  const logWeight = () => {
    const v = Number(weightInput);
    if (!v || v <= 0) return;
    setWeightLog((prev) => ({ ...prev, [toKey(new Date())]: v }));
    setWeightInput('');
  };

  const totals = dayTotals(viewDay);
  const calValue = useCountUp(totals.calories);
  const proteinValue = useCountUp(totals.protein);
  const carbsValue = useCountUp(totals.carbs);
  const fatValue = useCountUp(totals.fat);
  const sugarValue = useCountUp(totals.sugar);
  const pointsValue = useCountUp(totals.points);
  const waterValue = useCountUp(viewDay.water);
  const coffeeValue = useCountUp(viewDay.coffee || 0);

  const heroTarget = targets ? (mode === 'points' ? targets.points : targets.calories) : 0;
  const heroValue = mode === 'points' ? pointsValue : calValue;
  const heroConsumed = mode === 'points' ? totals.points : totals.calories;
  const leftover = heroTarget - heroConsumed;

  const historyMetric = mode === 'points' ? 'points' : 'calories';
  const historyData = useMemo(() => {
    if (!targets) return [];
    const arr = [];
    for (let i = 6; i >= 0; i--) {
      const d = addDays(new Date(), -i);
      const k = toKey(d);
      const day = days[k];
      const t = day ? dayTotals(day) : { calories: 0, points: 0 };
      arr.push({ label: d.toLocaleDateString('en-US', { weekday: 'short' })[0], value: Math.round(t[historyMetric]), isToday: k === todayKey });
    }
    return arr;
  }, [days, todayKey, historyMetric, targets]);

  const streak = useMemo(() => computeStreak(days), [days]);
  const longestStreak = useMemo(() => computeLongestStreak(days), [days]);
  const xp = useMemo(() => computeXP(days, targets), [days, targets]);
  const level = Math.floor(xp / 100) + 1;
  const xpIntoLevel = xp % 100;

  const weeklyStats = useMemo(() => {
    if (!targets) return null;
    let sumMetric = 0, adherentDays = 0, proteinHitDays = 0, balancedDays = 0, earlyLogs = 0, countedDays = 0;
    const foodTally = {};
    for (let i = 6; i >= 0; i--) {
      const d = addDays(new Date(), -i);
      const k = toKey(d);
      const day = days[k];
      if (!day) continue;
      const t = dayTotals(day);
      if (!dayHasLogs(day)) continue;
      countedDays++;
      const metricVal = mode === 'points' ? t.points : t.calories;
      const metricTarget = mode === 'points' ? targets.points : targets.calories;
      sumMetric += metricVal;
      if (metricVal > 0 && metricVal <= metricTarget * 1.05) adherentDays++;
      if (t.protein >= targets.protein * 0.9) proteinHitDays++;
      const pOk = t.protein >= targets.protein * 0.85 && t.protein <= targets.protein * 1.15;
      const cOk = t.carbs >= targets.carbs * 0.85 && t.carbs <= targets.carbs * 1.15;
      const fOk = t.fat >= targets.fat * 0.85 && t.fat <= targets.fat * 1.15;
      if (pOk && cOk && fOk) balancedDays++;
      MEAL_ORDER.forEach((m) => {
        (day.meals[m] || []).forEach((plate) => {
          if (m === 'breakfast' && plate.loggedAt && new Date(plate.loggedAt).getHours() < 9) earlyLogs++;
          plateComponents(plate).forEach((c) => {
            foodTally[c.name] = (foodTally[c.name] || 0) + 1;
          });
        });
      });
    }
    const topFoods = Object.entries(foodTally).sort((a, b) => b[1] - a[1]).slice(0, 3);
    return {
      avgMetric: countedDays ? Math.round(sumMetric / countedDays) : 0,
      adherencePct: countedDays ? Math.round((adherentDays / countedDays) * 100) : 0,
      proteinHitDays, balancedDays, earlyLogs, topFoods, countedDays,
    };
  }, [days, targets, mode]);

  const badgeContext = useMemo(() => ({
    streak, proteinHitDays: weeklyStats?.proteinHitDays || 0, earlyLogs: weeklyStats?.earlyLogs || 0,
    balancedDays: weeklyStats?.balancedDays || 0, favoritesCount: favorites.length,
  }), [streak, weeklyStats, favorites]);
  const earnedBadges = BADGE_DEFS.filter((b) => b.test(badgeContext));

  const weightSeries = useMemo(() => {
    return Object.entries(weightLog).sort((a, b) => (a[0] < b[0] ? -1 : 1)).map(([k, v]) => ({ date: k, label: new Date(k).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), weight: v }));
  }, [weightLog]);

  const todaysTimeline = useMemo(() => {
    const items = [];
    MEAL_ORDER.forEach((m) => {
      (viewDay.meals[m] || []).forEach((plate) => {
        items.push({ id: plate.id, name: plate.name, meal: m, time: plate.loggedAt ? new Date(plate.loggedAt) : null });
      });
    });
    return items.filter((i) => i.time).sort((a, b) => a.time - b.time);
  }, [viewDay]);

  const dark = theme === 'dark';
  const bg = dark ? '#0D1310' : '#F1F4EC';
  const card = dark ? '#17201A' : '#FFFFFF';
  const cardAlt = dark ? '#12180F' : '#FAFAF5';
  const border = dark ? 'rgba(255,255,255,0.08)' : 'rgba(20,40,25,0.09)';
  const textPrimary = dark ? '#F1F4EC' : '#1B2A1F';
  const textSecondary = dark ? '#93A594' : '#5C6B5E';
  const ringTrack = dark ? '#25302A' : '#E4E9DE';
  const green = dark ? '#5FAE82' : '#2F6E4E';
  const greenSoft = dark ? '#3C8A63' : '#4F8F68';
  const amber = dark ? '#E2A45D' : '#C9772E';
  const amberSoft = dark ? '#D08A4A' : '#E0A45D';
  const accentGradient = `linear-gradient(135deg,${greenSoft},${green})`;
  const heroFrom = mode === 'points' ? greenSoft : amberSoft;
  const heroTo = mode === 'points' ? green : amber;
  const heroCardBg = mode === 'points'
    ? (dark ? 'linear-gradient(135deg,#1E3A2B 0%,#254A34 100%)' : 'linear-gradient(135deg,#DCEEDF 0%,#BFE0CC 100%)')
    : (dark ? 'linear-gradient(135deg,#3A2A18 0%,#4A331E 100%)' : 'linear-gradient(135deg,#FBE7D0 0%,#F3CFA0 100%)');
  const heroCardText = dark ? (mode === 'points' ? '#EAF6EE' : '#F6E9D8') : (mode === 'points' ? '#1B2A1F' : '#3A2A18');
  const flameColor = '#E0793F';

  const greeting = useMemo(() => {
    const hour = now.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, [now]);
  const headline = useMemo(() => {
    const hour = now.getHours();
    if (hour < 12) return "Let's start the day strong";
    if (hour < 18) return 'Keep the momentum going';
    return "Let's wrap up strong tonight";
  }, [now]);

  const copyCode = async () => {
    try {
      const code = btoa(unescape(encodeURIComponent(JSON.stringify({ days, profile, favorites, weightLog }))));
      await navigator.clipboard.writeText(code);
      setCopyState('copied');
      setTimeout(() => setCopyState('idle'), 1800);
    } catch (e) {
      setCopyState('error');
      setTimeout(() => setCopyState('idle'), 1800);
    }
  };

  const restore = () => {
    try {
      const json = decodeURIComponent(escape(atob(restoreText.trim())));
      const parsed = JSON.parse(json);
      if (parsed.days) setDays(parsed.days); else setDays(parsed);
      if (parsed.profile) setProfile(parsed.profile);
      if (parsed.favorites) setFavorites(parsed.favorites);
      if (parsed.weightLog) setWeightLog(parsed.weightLog);
      setRestoreMsg('Restored.');
      setRestoreText('');
      setTimeout(() => setRestoreMsg(''), 2000);
    } catch (e) {
      setRestoreMsg('That code didn\u2019t look right — double check and try again.');
      setTimeout(() => setRestoreMsg(''), 2500);
    }
  };

  return (
    <div className="app-bg" style={{
      display: 'flex', justifyContent: 'center', padding: '28px 16px 110px',
      background: dark
        ? 'radial-gradient(circle at 50% -10%, #16201A 0%, #0A0F0C 65%)'
        : 'radial-gradient(circle at 50% -10%, #F8F9F3 0%, #E9EEE3 75%)',
      fontFamily: FONT_BODY, transition: 'background 0.4s ease',
    }}>
      <style>{`
        * { box-sizing: border-box; }
        html, body, #root { height: 100%; }
        .app-bg { min-height: 100vh; }
        @supports (min-height: 100dvh) { .app-bg { min-height: 100dvh; } }
        .num { font-variant-numeric: tabular-nums; letter-spacing: -0.01em; }
        .tap { transition: transform 0.15s ease, opacity 0.15s ease; cursor: pointer; }
        .tap:active { transform: scale(0.96); opacity: 0.85; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .fadein { animation: fadeIn 0.4s ease both; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.9s linear infinite; }
        @keyframes toastIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes sheetIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes menuIn { from { opacity: 0; transform: translateY(8px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>

      <div className="app-shell" style={{
        width: '100%', maxWidth: 440, background: bg, borderRadius: 28,
        boxShadow: dark
          ? '0 30px 60px -24px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)'
          : '0 30px 60px -24px rgba(30,50,30,0.18), 0 0 0 1px rgba(20,40,25,0.05)',
        padding: '24px 20px 28px', transition: 'background 0.4s ease', position: 'relative',
      }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 11, background: accentGradient, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <LeafMark size={18} />
            </div>
            <div>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 700, color: textPrimary, lineHeight: 1.1 }}>Parra</div>
              <div style={{ fontSize: 9.5, color: textSecondary, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600, marginTop: 1 }}>Points Tracker</div>
            </div>
          </div>
          <button
            aria-label="Toggle dark mode" className="tap"
            onClick={() => setTheme(dark ? 'light' : 'dark')}
            style={{ width: 36, height: 36, borderRadius: 11, border: `1px solid ${border}`, background: card, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {dark ? <Sun size={16} color={amber} /> : <Moon size={16} color={green} />}
          </button>
        </div>

        {!profileLoaded ? (
          <div style={{ paddingTop: 160, textAlign: 'center' }}>
            <Loader2 size={22} color={textSecondary} className="spin" />
          </div>
        ) : !profile ? (
          <Onboarding dark={dark} card={card} border={border} textPrimary={textPrimary} textSecondary={textSecondary} accent={green} accentGradient={accentGradient} onComplete={handleOnboardingComplete} />
        ) : activeTab === 'home' ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <div>
                <div style={{ fontSize: 13, color: textSecondary }}>{greeting}, {profile.name || 'there'}</div>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 24, fontWeight: 700, color: textPrimary, marginTop: 2, lineHeight: 1.15 }}>{headline}</div>
              </div>
              <img src={PROFILE_IMG} alt="Profile" style={{ width: 44, height: 44, borderRadius: 22, flexShrink: 0, marginLeft: 10, objectFit: 'cover', border: `2px solid ${card}`, boxShadow: dark ? 'none' : '0 1px 3px rgba(20,40,25,0.15)' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
              <button className="tap" onClick={goToday} style={{ padding: '8px 16px', borderRadius: 20, border: 'none', background: isToday ? textPrimary : card, color: isToday ? bg : textPrimary, fontSize: 13, fontWeight: 600, boxShadow: isToday ? 'none' : `0 1px 2px rgba(0,0,0,0.04)` }}>
                Today
              </button>
              <button className="tap" onClick={goYesterday} style={{ padding: '8px 16px', borderRadius: 20, border: 'none', background: (!isToday && viewKey === toKey(addDays(new Date(), -1))) ? textPrimary : card, color: (!isToday && viewKey === toKey(addDays(new Date(), -1))) ? bg : textPrimary, fontSize: 13, fontWeight: 600 }}>
                Yesterday
              </button>
              <button className="tap" onClick={goPrev} aria-label="Previous day" style={{ width: 34, height: 34, borderRadius: 17, border: 'none', background: card, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ChevronLeft size={15} color={textSecondary} />
              </button>
              <button className="tap" onClick={goNext} aria-label="Next day" style={{ width: 34, height: 34, borderRadius: 17, border: 'none', background: card, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ChevronRight size={15} color={textSecondary} />
              </button>
              <label style={{ width: 34, height: 34, borderRadius: 17, background: card, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', flexShrink: 0 }}>
                <Clock size={15} color={textSecondary} />
                <input type="date" value={viewKey} onChange={(e) => jumpToDate(e.target.value)} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
              </label>
            </div>
            <div style={{ fontSize: 12.5, color: textSecondary, marginTop: -12, marginBottom: 18 }}>
              {isToday ? 'Today' : viewDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>

            <div className="fadein" style={{ background: heroCardBg, borderRadius: 26, padding: '24px 22px', marginBottom: 16, position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <div className="num" style={{ fontFamily: FONT_DISPLAY, fontSize: 42, fontWeight: 700, color: heroCardText, lineHeight: 1 }}>{Math.round(Math.max(0, leftover))}</div>
                  <div style={{ fontSize: 13, color: heroCardText, opacity: 0.75, marginTop: 4 }}>{mode === 'points' ? 'Points' : 'Calories'} remaining</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.35)', borderRadius: 20, padding: '6px 11px' }}>
                  <Flame size={15} color={flameColor} fill={flameColor} />
                  <span className="num" style={{ fontSize: 13, fontWeight: 700, color: heroCardText }}>{streak}</span>
                </div>
              </div>
              <div style={{ height: 6, borderRadius: 4, background: 'rgba(255,255,255,0.35)', marginTop: 20, overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, (heroConsumed / (heroTarget || 1)) * 100)}%`, height: '100%', background: heroCardText, opacity: 0.55, borderRadius: 4, transition: 'width 0.6s ease' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 11.5, color: heroCardText, opacity: 0.75 }}>
                <span>Consumed {Math.round(heroConsumed)}</span>
                <span>Goal {heroTarget}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              {[
                { key: 'protein', label: 'Protein', emoji: '\ud83c\udf57', value: proteinValue, target: targets.protein, color: '#1F7A6C' },
                { key: 'carbs', label: 'Carbs', emoji: '\ud83c\udf5e', value: carbsValue, target: targets.carbs, color: '#C9922E' },
                { key: 'fat', label: 'Fat', emoji: '\ud83e\udd51', value: fatValue, target: targets.fat, color: '#B5573A' },
              ].map((m) => (
                <div key={m.key} className="fadein" style={{ flex: 1, background: card, borderRadius: 20, padding: '14px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: dark ? 'none' : '0 1px 3px rgba(20,40,25,0.05)' }}>
                  <div style={{ position: 'relative', width: 58, height: 58 }}>
                    <Ring size={58} stroke={6} progress={m.value / m.target} colorFrom={m.color} colorTo={m.color} track={ringTrack} gradId={`grad-${m.key}`} />
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{m.emoji}</div>
                  </div>
                  <div className="num" style={{ fontSize: 15, fontWeight: 700, color: textPrimary, marginTop: 8 }}>{Math.max(0, Math.round(m.target - m.value))}g</div>
                  <div style={{ fontSize: 11, color: textSecondary }}>{m.label} left</div>
                </div>
              ))}
            </div>

            <div className="fadein" style={{ background: card, borderRadius: 20, padding: '16px 18px', marginBottom: 12, boxShadow: dark ? 'none' : '0 1px 3px rgba(20,40,25,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Candy size={16} color="#B5486B" />
                  <span style={{ fontSize: 14, fontWeight: 600, color: textPrimary }}>Sugar</span>
                </div>
                <span className="num" style={{ fontSize: 13, color: textSecondary }}>{Math.round(sugarValue)} / {targets.sugar}g</span>
              </div>
              <div style={{ height: 8, borderRadius: 5, background: ringTrack, overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, (totals.sugar / targets.sugar) * 100)}%`, height: '100%', background: totals.sugar > targets.sugar ? 'linear-gradient(90deg,#C1554A,#D97D6E)' : 'linear-gradient(90deg,#B5486B,#CE7292)', transition: 'width 0.6s ease' }} />
              </div>
            </div>

            <div className="fadein" style={{ background: card, borderRadius: 20, padding: '16px 18px', marginBottom: 12, boxShadow: dark ? 'none' : '0 1px 3px rgba(20,40,25,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Droplet size={16} color="#3E7EA0" fill="#3E7EA0" fillOpacity={0.25} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: textPrimary }}>Water</span>
                </div>
                <span className="num" style={{ fontSize: 13, color: textSecondary }}>{waterValue.toFixed(2)} / {targets.water.toFixed(1)} L</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button className="tap" onClick={() => updateWater(-0.25)} aria-label="Remove water" style={{ width: 30, height: 30, borderRadius: 15, border: 'none', background: ringTrack, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Minus size={14} color={textSecondary} />
                </button>
                <div style={{ flex: 1, height: 10, borderRadius: 6, background: ringTrack, overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, (viewDay.water / targets.water) * 100)}%`, height: '100%', background: 'linear-gradient(90deg,#3E7EA0,#6BA5C4)', transition: 'width 0.6s ease' }} />
                </div>
                <button className="tap" onClick={() => updateWater(0.25)} aria-label="Add water" style={{ width: 30, height: 30, borderRadius: 15, border: 'none', background: 'linear-gradient(135deg,#3E7EA0,#6BA5C4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Plus size={14} color="#fff" />
                </button>
              </div>
            </div>

            <div className="fadein" style={{ background: card, borderRadius: 20, padding: '16px 18px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: dark ? 'none' : '0 1px 3px rgba(20,40,25,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Coffee size={16} color="#8B5E3C" />
                <span style={{ fontSize: 14, fontWeight: 600, color: textPrimary }}>Coffee</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button className="tap" onClick={() => updateCoffee(-1)} aria-label="Remove a mug" style={{ width: 30, height: 30, borderRadius: 15, border: 'none', background: ringTrack, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Minus size={14} color={textSecondary} />
                </button>
                <span className="num" style={{ fontSize: 14, fontWeight: 700, color: textPrimary, minWidth: 58, textAlign: 'center' }}>{Math.round(coffeeValue)} {Math.round(coffeeValue) === 1 ? 'mug' : 'mugs'}</span>
                <button className="tap" onClick={() => updateCoffee(1)} aria-label="Add a mug" style={{ width: 30, height: 30, borderRadius: 15, border: 'none', background: 'linear-gradient(135deg,#8B5E3C,#AE7C56)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Plus size={14} color="#fff" />
                </button>
              </div>
            </div>

            <div className="fadein" style={{ background: card, borderRadius: 20, padding: '16px 14px 10px', marginBottom: 16, boxShadow: dark ? 'none' : '0 1px 3px rgba(20,40,25,0.05)' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: textPrimary, marginBottom: 8 }}>Last 7 days</div>
              <div style={{ height: 90 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={historyData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                    <ReferenceLine y={heroTarget} stroke={dark ? '#2E3A2E' : '#D7DECB'} strokeDasharray="3 3" />
                    <Bar dataKey="value" radius={[5, 5, 5, 5]} maxBarSize={22}>
                      {historyData.map((d, i) => (<Cell key={i} fill={d.isToday ? green : ringTrack} />))}
                    </Bar>
                    <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: textSecondary }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="fadein">
              <div style={{ fontSize: 15, fontWeight: 700, fontFamily: FONT_DISPLAY, color: textPrimary, marginBottom: 10, paddingLeft: 2 }}>Today's Meals</div>
              {MEAL_ORDER.every((m) => viewDay.meals[m].length === 0) ? (
                <div style={{ background: card, borderRadius: 20, padding: '22px 16px', textAlign: 'center', boxShadow: dark ? 'none' : '0 1px 3px rgba(20,40,25,0.05)' }}>
                  <div style={{ fontSize: 13, color: textSecondary }}>Nothing logged {isToday ? 'yet' : 'this day'}.</div>
                  <div style={{ fontSize: 12, color: textSecondary, marginTop: 3 }}>Tap + below to log a meal.</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {MEAL_ORDER.filter((m) => viewDay.meals[m].length > 0).map((m) => {
                    const meta = MEAL_META[m];
                    const Icon = meta.icon;
                    return viewDay.meals[m].map((plate) => {
                      const isExpanded = expandedIds.has(plate.id);
                      const comps = plateComponents(plate);
                      const fav = isFavorited(plate);
                      return (
                        <div key={plate.id} className="fadein" style={{ background: card, borderRadius: 18, overflow: 'hidden', boxShadow: dark ? 'none' : '0 1px 4px rgba(20,40,25,0.06)' }}>
                          <button className="tap" onClick={() => toggleExpand(plate.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px', background: 'transparent', border: 'none', textAlign: 'left' }}>
                            <div style={{ width: 40, height: 40, borderRadius: 14, background: `${meta.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <Icon size={17} color={meta.color} />
                            </div>
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <div style={{ fontSize: 13.5, color: textPrimary, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{plate.name}</div>
                              <div style={{ fontSize: 11, color: textSecondary, marginTop: 1 }}>
                                {meta.label} · {plate.loggedAt ? new Date(plate.loggedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : ''}
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                              {mode === 'points' ? (
                                <span className="num" style={{ fontSize: 14, fontWeight: 700, color: plate.points === 0 ? green : textPrimary }}>{plate.points === 0 ? 'Free' : `${plate.points} pt${plate.points === 1 ? '' : 's'}`}</span>
                              ) : (
                                <span className="num" style={{ fontSize: 14, fontWeight: 700, color: textPrimary }}>{Math.round(plate.calories)}</span>
                              )}
                              <ChevronDown size={14} color={textSecondary} style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
                            </div>
                          </button>

                          {isExpanded && (
                            <div style={{ padding: '2px 14px 14px', borderTop: `1px solid ${border}` }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 10 }}>
                                {comps.map((c) => (
                                  <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                                    <div style={{ minWidth: 0 }}>
                                      <div style={{ fontSize: 12.5, color: textPrimary }}>{c.name}</div>
                                      {c.serving ? <div style={{ fontSize: 10.5, color: textSecondary }}>{c.serving}</div> : null}
                                    </div>
                                    <span className="num" style={{ fontSize: 12, color: mode === 'points' && c.points === 0 ? green : textSecondary, flexShrink: 0 }}>
                                      {mode === 'points' ? (c.points === 0 ? 'Free' : `${c.points} pt${c.points === 1 ? '' : 's'}`) : `${Math.round(c.calories)} cal`}
                                    </span>
                                  </div>
                                ))}
                              </div>

                              {editingId === plate.id ? (
                                <div style={{ marginTop: 12 }}>
                                  <input autoFocus value={editText} onChange={(e) => setEditText(e.target.value)} placeholder="e.g. remove the rice, this was 2 servings" style={{ width: '100%', borderRadius: 10, border: `1px solid ${border}`, background: cardAlt, color: textPrimary, fontSize: 12.5, padding: '9px 11px', fontFamily: FONT_BODY, marginBottom: 8 }} />
                                  <div style={{ display: 'flex', gap: 8 }}>
                                    <button className="tap" onClick={cancelEdit} style={{ flex: 1, padding: '8px 0', borderRadius: 9, border: `1px solid ${border}`, background: 'transparent', color: textSecondary, fontSize: 12, fontWeight: 600 }}>Cancel</button>
                                    <button className="tap" onClick={() => submitEdit(m, plate.id)} disabled={!editText.trim() || editSubmitting} style={{ flex: 1, padding: '8px 0', borderRadius: 9, border: 'none', background: accentGradient, color: '#fff', fontSize: 12, fontWeight: 600, opacity: (!editText.trim() || editSubmitting) ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                                      {editSubmitting ? <Loader2 size={13} className="spin" /> : 'Update'}
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 12 }}>
                                  <button className="tap" onClick={() => startEdit(plate.id)} style={{ background: 'transparent', border: 'none', color: green, fontSize: 12, fontWeight: 600, padding: 0 }}>Edit</button>
                                  <button className="tap" onClick={() => removePlate(m, plate.id)} style={{ background: 'transparent', border: 'none', color: '#B5573A', fontSize: 12, fontWeight: 600, padding: 0 }}>Remove</button>
                                  <button className="tap" onClick={() => toggleFavorite(plate)} style={{ background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', gap: 4, padding: 0, marginLeft: 'auto' }}>
                                    <Star size={13} color={fav ? '#E0A93F' : textSecondary} fill={fav ? '#E0A93F' : 'none'} />
                                    <span style={{ fontSize: 12, fontWeight: 600, color: fav ? '#E0A93F' : textSecondary }}>{fav ? 'Saved' : 'Save'}</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    });
                  })}
                </div>
              )}
            </div>
          </>
        ) : activeTab === 'insights' ? (
          <>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 700, color: textPrimary, marginBottom: 18 }}>Insights</div>

            <div className="fadein" style={{ background: card, borderRadius: 20, padding: 18, marginBottom: 14, boxShadow: dark ? 'none' : '0 1px 3px rgba(20,40,25,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <Zap size={16} color={amber} />
                <span style={{ fontSize: 13, fontWeight: 600, color: textPrimary }}>Level {level}</span>
              </div>
              <div style={{ height: 8, borderRadius: 5, background: ringTrack, overflow: 'hidden', marginBottom: 6 }}>
                <div style={{ width: `${xpIntoLevel}%`, height: '100%', background: accentGradient, transition: 'width 0.6s ease' }} />
              </div>
              <div style={{ fontSize: 11, color: textSecondary }}>{xp} XP total · {100 - xpIntoLevel} to next level</div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
              <div className="fadein" style={{ flex: 1, background: card, borderRadius: 18, padding: 14, boxShadow: dark ? 'none' : '0 1px 3px rgba(20,40,25,0.05)' }}>
                <div className="num" style={{ fontFamily: FONT_DISPLAY, fontSize: 24, fontWeight: 700, color: textPrimary }}>{weeklyStats ? weeklyStats.avgMetric : 0}</div>
                <div style={{ fontSize: 11, color: textSecondary, marginTop: 2 }}>Avg {mode === 'points' ? 'points' : 'cal'}/day (7d)</div>
              </div>
              <div className="fadein" style={{ flex: 1, background: card, borderRadius: 18, padding: 14, boxShadow: dark ? 'none' : '0 1px 3px rgba(20,40,25,0.05)' }}>
                <div className="num" style={{ fontFamily: FONT_DISPLAY, fontSize: 24, fontWeight: 700, color: green }}>{weeklyStats ? weeklyStats.adherencePct : 0}%</div>
                <div style={{ fontSize: 11, color: textSecondary, marginTop: 2 }}>Goal adherence (7d)</div>
              </div>
            </div>

            <div className="fadein" style={{ background: card, borderRadius: 18, padding: 14, marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: dark ? 'none' : '0 1px 3px rgba(20,40,25,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Flame size={16} color={flameColor} fill={flameColor} />
                <span style={{ fontSize: 13, color: textPrimary, fontWeight: 600 }}>Current streak</span>
              </div>
              <span className="num" style={{ fontSize: 14, fontWeight: 700, color: textPrimary }}>{streak} days · best {longestStreak}</span>
            </div>

            <div style={{ fontSize: 13, fontWeight: 700, color: textPrimary, marginBottom: 10 }}>Badges</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 18 }}>
              {BADGE_DEFS.map((b) => {
                const earned = earnedBadges.some((e) => e.key === b.key);
                const BIcon = b.icon;
                return (
                  <div key={b.key} className="fadein" style={{ background: card, borderRadius: 16, padding: '14px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: earned ? 1 : 0.35, boxShadow: dark ? 'none' : '0 1px 3px rgba(20,40,25,0.05)' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 18, background: earned ? accentGradient : ringTrack, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <BIcon size={16} color={earned ? '#fff' : textSecondary} />
                    </div>
                    <div style={{ fontSize: 10, color: textPrimary, textAlign: 'center', fontWeight: 600, lineHeight: 1.3 }}>{b.label}</div>
                  </div>
                );
              })}
            </div>

            {weeklyStats && weeklyStats.topFoods.length > 0 && (
              <div className="fadein" style={{ background: card, borderRadius: 18, padding: 16, marginBottom: 14, boxShadow: dark ? 'none' : '0 1px 3px rgba(20,40,25,0.05)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: textPrimary, marginBottom: 10 }}>Most eaten this week</div>
                {weeklyStats.topFoods.map(([name, count]) => (
                  <div key={name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: textSecondary, padding: '5px 0' }}>
                    <span>{name}</span><span>{count}×</span>
                  </div>
                ))}
              </div>
            )}

            {todaysTimeline.length > 0 && (
              <div className="fadein" style={{ background: card, borderRadius: 18, padding: 16, boxShadow: dark ? 'none' : '0 1px 3px rgba(20,40,25,0.05)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: textPrimary, marginBottom: 10 }}>Today's timeline</div>
                {todaysTimeline.map((i) => (
                  <div key={i.id} style={{ display: 'flex', gap: 10, fontSize: 12.5, padding: '5px 0' }}>
                    <span className="num" style={{ color: textSecondary, minWidth: 62 }}>{i.time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>
                    <span style={{ color: textPrimary }}>{i.name}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : activeTab === 'goals' ? (
          <>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 700, color: textPrimary, marginBottom: 18 }}>Goals</div>

            <div className="fadein" style={{ background: card, borderRadius: 20, padding: 18, marginBottom: 14, boxShadow: dark ? 'none' : '0 1px 3px rgba(20,40,25,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: textPrimary }}>Weight</span>
                {profile.goalWeightLb ? <span style={{ fontSize: 11.5, color: textSecondary }}>Goal: {profile.goalWeightLb} lb</span> : null}
              </div>
              {weightSeries.length > 0 ? (
                <div style={{ height: 130, marginBottom: 12 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weightSeries} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                      <YAxis tick={{ fontSize: 10, fill: textSecondary }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                      <XAxis dataKey="label" tick={{ fontSize: 10, fill: textSecondary }} axisLine={false} tickLine={false} />
                      <Line type="monotone" dataKey="weight" stroke={green} strokeWidth={2.5} dot={{ r: 3, fill: green }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div style={{ fontSize: 12.5, color: textSecondary, marginBottom: 12 }}>Log your weight to start tracking your trend.</div>
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="number" inputMode="decimal" value={weightInput} onChange={(e) => setWeightInput(e.target.value)} placeholder="Today's weight (lb)" style={{ flex: 1, borderRadius: 10, border: `1px solid ${border}`, background: cardAlt, color: textPrimary, fontSize: 13, padding: '10px 12px', fontFamily: FONT_BODY }} />
                <button className="tap" onClick={logWeight} disabled={!weightInput} style={{ padding: '0 18px', borderRadius: 10, border: 'none', background: accentGradient, color: '#fff', fontSize: 13, fontWeight: 600, opacity: weightInput ? 1 : 0.5 }}>Log</button>
              </div>
            </div>

            <div className="fadein" style={{ background: card, borderRadius: 20, padding: 18, boxShadow: dark ? 'none' : '0 1px 3px rgba(20,40,25,0.05)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: textPrimary, marginBottom: 12 }}>Daily targets</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: textSecondary }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>{mode === 'points' ? 'Points' : 'Calories'}</span><span className="num" style={{ color: textPrimary, fontWeight: 600 }}>{mode === 'points' ? targets.points : targets.calories}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Protein</span><span className="num" style={{ color: textPrimary, fontWeight: 600 }}>{targets.protein}g</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Carbs</span><span className="num" style={{ color: textPrimary, fontWeight: 600 }}>{targets.carbs}g</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Fat</span><span className="num" style={{ color: textPrimary, fontWeight: 600 }}>{targets.fat}g</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Water</span><span className="num" style={{ color: textPrimary, fontWeight: 600 }}>{targets.water}L</span></div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 700, color: textPrimary, marginBottom: 18 }}>Settings</div>
            <div className="fadein" style={{ background: card, borderRadius: 20, padding: 18, marginBottom: 14, boxShadow: dark ? 'none' : '0 1px 3px rgba(20,40,25,0.05)' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: textSecondary, textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: 10 }}>Tracking mode</div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                <button className="tap" onClick={() => setProfile((p) => ({ ...p, mode: 'points' }))} style={{ flex: 1, padding: '10px 0', borderRadius: 12, border: 'none', background: mode === 'points' ? accentGradient : ringTrack, color: mode === 'points' ? '#fff' : textPrimary, fontSize: 13, fontWeight: 600 }}>Points</button>
                <button className="tap" onClick={() => setProfile((p) => ({ ...p, mode: 'calories' }))} style={{ flex: 1, padding: '10px 0', borderRadius: 12, border: 'none', background: mode === 'calories' ? 'linear-gradient(135deg,#D08A4A,#C9772E)' : ringTrack, color: mode === 'calories' ? '#fff' : textPrimary, fontSize: 13, fontWeight: 600 }}>Calories</button>
              </div>
              <button className="tap" onClick={retakeQuestionnaire} style={{ width: '100%', padding: '10px 0', borderRadius: 12, border: `1px solid ${border}`, background: 'transparent', color: textSecondary, fontSize: 12.5, fontWeight: 600 }}>Retake setup questionnaire</button>
            </div>

            <div className="fadein" style={{ background: card, borderRadius: 20, padding: 18, boxShadow: dark ? 'none' : '0 1px 3px rgba(20,40,25,0.05)' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: textSecondary, textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: 10 }}>Backup</div>
              <button className="tap" onClick={copyCode} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '11px 0', borderRadius: 12, border: 'none', background: accentGradient, color: '#fff', fontSize: 13, fontWeight: 600, marginBottom: 10 }}>
                {copyState === 'copied' ? <Check size={14} /> : <Copy size={14} />}
                {copyState === 'copied' ? 'Copied' : copyState === 'error' ? 'Copy failed' : 'Copy save code'}
              </button>
              <textarea value={restoreText} onChange={(e) => setRestoreText(e.target.value)} placeholder="Paste your save code here" style={{ width: '100%', minHeight: 60, borderRadius: 12, border: `1px solid ${border}`, background: cardAlt, color: textPrimary, fontSize: 12, padding: 10, resize: 'vertical', fontFamily: FONT_BODY, marginBottom: 10 }} />
              <button className="tap" onClick={restore} disabled={!restoreText.trim()} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '11px 0', borderRadius: 12, border: `1px solid ${border}`, background: 'transparent', color: textPrimary, fontSize: 13, fontWeight: 600, opacity: restoreText.trim() ? 1 : 0.5 }}>
                <ClipboardPaste size={14} /> Restore
              </button>
              {restoreMsg && <div style={{ fontSize: 12, color: textSecondary, marginTop: 8 }}>{restoreMsg}</div>}
            </div>

            <div style={{ marginTop: 18, textAlign: 'center', fontSize: 10.5, color: textSecondary, lineHeight: 1.5, padding: '0 8px' }}>
              I'm an AI assistant, not a medical professional. Check with your primary care physician before starting any new diet.
            </div>
          </>
        )}
      </div>

      {profile && (
        <>
          <input
            type="file" accept="image/*" capture="environment" ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={(e) => {
              const f = e.target.files && e.target.files[0];
              if (f) { setPendingFile(f); setPendingPreview(URL.createObjectURL(f)); setNoteText(''); }
              e.target.value = '';
            }}
          />

          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 30 }}>
            <div style={{
              width: '100%', maxWidth: 440, margin: '0 16px', marginBottom: 16, background: card, borderRadius: 24,
              display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '10px 8px',
              boxShadow: '0 20px 40px -12px rgba(0,0,0,0.25)', border: `1px solid ${border}`,
            }}>
              {[
                { key: 'home', label: 'Home', Icon: Home },
                { key: 'insights', label: 'Insights', Icon: BarChart2 },
                { key: 'goals', label: 'Goals', Icon: Target },
                { key: 'settings', label: 'Settings', Icon: Settings },
              ].map((t) => (
                <button key={t.key} className="tap" onClick={() => setActiveTab(t.key)} style={{ background: 'transparent', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '4px 10px' }}>
                  <t.Icon size={19} color={activeTab === t.key ? green : textSecondary} />
                  <span style={{ fontSize: 9.5, fontWeight: 600, color: activeTab === t.key ? green : textSecondary }}>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            className="tap" aria-label="Add food" onClick={() => setAddMenuOpen((v) => !v)}
            style={{
              position: 'fixed', bottom: 58, right: 'calc(50% - 200px)', width: 58, height: 58, borderRadius: 29,
              border: `4px solid ${bg}`, background: accentGradient, display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 14px 28px -8px ${dark ? 'rgba(95,174,130,0.5)' : 'rgba(47,110,78,0.45)'}`, zIndex: 35,
            }}
          >
            <Plus size={24} color="#fff" style={{ transform: addMenuOpen ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s ease' }} />
          </button>

          {addMenuOpen && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 34 }} onClick={() => setAddMenuOpen(false)}>
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: 'absolute', bottom: 122, right: 'max(16px, calc(50% - 200px))', width: 220, background: card,
                  borderRadius: 18, boxShadow: '0 20px 40px -12px rgba(0,0,0,0.3)', border: `1px solid ${border}`,
                  padding: 8, animation: 'menuIn 0.18s ease both',
                }}
              >
                {[
                  { label: 'Snap a Plate', Icon: Camera, action: () => triggerSnap('plate') },
                  { label: 'Scan a Label', Icon: ScanLine, action: () => triggerSnap('label') },
                  { label: 'Describe It', Icon: Type, action: () => { setAddMenuOpen(false); setManualOpen(true); } },
                  { label: 'Favorites', Icon: Star, action: () => { setAddMenuOpen(false); setFavPickerOpen(true); } },
                ].map((opt) => (
                  <button key={opt.label} className="tap" onClick={opt.action} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 10px', borderRadius: 12, border: 'none', background: 'transparent', textAlign: 'left' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: ringTrack, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <opt.Icon size={15} color={textPrimary} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: textPrimary }}>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {toast && (
            <div style={{
              position: 'fixed', bottom: 128, left: 16, right: 16, maxWidth: 408, margin: '0 auto', zIndex: 40,
              background: toast.type === 'success' ? green : '#B5573A', color: '#fff',
              borderRadius: 12, padding: '10px 14px', fontSize: 12.5, fontWeight: 500,
              boxShadow: '0 14px 28px -10px rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', gap: 8,
              animation: 'toastIn 0.25s ease both',
            }}>
              {toast.type === 'success' ? <CheckCircle2 size={15} style={{ flexShrink: 0 }} /> : <AlertCircle size={15} style={{ flexShrink: 0 }} />}
              <span>{toast.text}</span>
            </div>
          )}

          {pendingFile && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
              <div onClick={discardPending} style={{ position: 'absolute', inset: 0, background: 'rgba(10,15,10,0.6)' }} />
              <div style={{ position: 'relative', width: '100%', maxWidth: 440, background: card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: '18px 20px 26px', animation: 'sheetIn 0.25s ease both', boxShadow: '0 -20px 40px -20px rgba(0,0,0,0.4)' }}>
                <div style={{ width: 36, height: 4, borderRadius: 2, background: border, margin: '0 auto 16px' }} />
                <div style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'flex-start' }}>
                  <img src={pendingPreview} alt="Selected food" style={{ width: 64, height: 64, borderRadius: 14, objectFit: 'cover', flexShrink: 0, border: `1px solid ${border}` }} />
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: textPrimary }}>{scanMode === 'label' ? 'Scan this label' : 'Log this meal'}</div>
                    <div style={{ fontSize: 12, color: textSecondary, marginTop: 2 }}>Add a note to help with interpretation</div>
                  </div>
                  <button className="tap" onClick={discardPending} aria-label="Cancel" style={{ background: 'transparent', border: 'none', padding: 4, flexShrink: 0 }}>
                    <X size={18} color={textSecondary} />
                  </button>
                </div>
                <input value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="e.g. no dressing, extra rice, small portion" style={{ width: '100%', borderRadius: 12, border: `1px solid ${border}`, background: cardAlt, color: textPrimary, fontSize: 13, padding: '11px 12px', fontFamily: FONT_BODY, marginBottom: 14 }} />
                <button className="tap" onClick={confirmPending} disabled={!noteText.trim()} style={{ width: '100%', padding: '12px 0', borderRadius: 12, border: 'none', background: accentGradient, color: '#fff', fontSize: 13, fontWeight: 600, opacity: noteText.trim() ? 1 : 0.5, marginBottom: 10 }}>
                  Add note & log
                </button>
                <button className="tap" onClick={skipPending} style={{ width: '100%', padding: '8px 0', borderRadius: 12, border: 'none', background: 'transparent', color: textSecondary, fontSize: 13, fontWeight: 600 }}>
                  Skip
                </button>
              </div>
            </div>
          )}

          {manualOpen && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
              <div onClick={() => !manualSubmitting && setManualOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(10,15,10,0.6)' }} />
              <div style={{ position: 'relative', width: '100%', maxWidth: 440, background: card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: '18px 20px 26px', animation: 'sheetIn 0.25s ease both' }}>
                <div style={{ width: 36, height: 4, borderRadius: 2, background: border, margin: '0 auto 16px' }} />
                <div style={{ fontSize: 14, fontWeight: 600, color: textPrimary, marginBottom: 4 }}>Describe what you ate</div>
                <div style={{ fontSize: 12, color: textSecondary, marginBottom: 12 }}>e.g. "2 eggs, toast, and black coffee"</div>
                <input autoFocus value={manualText} onChange={(e) => setManualText(e.target.value)} placeholder="Type here..." style={{ width: '100%', borderRadius: 12, border: `1px solid ${border}`, background: cardAlt, color: textPrimary, fontSize: 13, padding: '11px 12px', fontFamily: FONT_BODY, marginBottom: 14 }} />
                <button className="tap" onClick={submitManualEntry} disabled={!manualText.trim() || manualSubmitting} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '12px 0', borderRadius: 12, border: 'none', background: accentGradient, color: '#fff', fontSize: 13, fontWeight: 600, opacity: (!manualText.trim() || manualSubmitting) ? 0.5 : 1, marginBottom: 8 }}>
                  {manualSubmitting ? <Loader2 size={15} className="spin" /> : 'Log it'}
                </button>
                <button className="tap" onClick={() => setManualOpen(false)} disabled={manualSubmitting} style={{ width: '100%', padding: '8px 0', borderRadius: 12, border: 'none', background: 'transparent', color: textSecondary, fontSize: 13, fontWeight: 600 }}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {favPickerOpen && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
              <div onClick={() => setFavPickerOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(10,15,10,0.6)' }} />
              <div style={{ position: 'relative', width: '100%', maxWidth: 440, maxHeight: '70vh', overflowY: 'auto', background: card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: '18px 20px 26px', animation: 'sheetIn 0.25s ease both' }}>
                <div style={{ width: 36, height: 4, borderRadius: 2, background: border, margin: '0 auto 16px' }} />
                <div style={{ fontSize: 14, fontWeight: 600, color: textPrimary, marginBottom: 12 }}>Favorites</div>
                {favorites.length === 0 ? (
                  <div style={{ fontSize: 13, color: textSecondary, textAlign: 'center', padding: '20px 0' }}>
                    No favorites yet. Star a logged meal to save it here for quick re-adding.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {favorites.map((f) => (
                      <button key={f.id} className="tap" onClick={() => addFavoriteToLog(f)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: 14, border: `1px solid ${border}`, background: cardAlt, textAlign: 'left' }}>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.name}</div>
                          <div style={{ fontSize: 11, color: textSecondary, marginTop: 1 }}>{mode === 'points' ? `${f.points} pts` : `${Math.round(f.calories)} cal`}</div>
                        </div>
                        <Plus size={16} color={green} style={{ flexShrink: 0 }} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
