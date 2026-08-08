import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Building2, Calendar, Users, BookOpen, ClipboardList, ScanLine, CheckCircle2,
  XCircle, Wifi, WifiOff, RefreshCw, ChevronLeft, ChevronRight, Plus, Upload,
  Edit3, Trash2, ArrowRight, BarChart3, User, Check, AlertTriangle,
  FileSpreadsheet, CreditCard, GraduationCap, School, Search, Home,
  PlayCircle, Camera, Save, X, ListChecks, UserCheck, UserX,
  Clock, CloudOff, UploadCloud, LogIn, Info, Pencil, MapPin, KeyRound, Copy,
  Share2, Archive, Lock, UserPlus, Settings, LogOut, ShieldCheck, Phone, Send, Sparkles, SlidersHorizontal
} from "lucide-react";

/* =========================================================================
   KAGAT — Prototype UX complet (V2)
   Deux rôles dans une seule application : Admin établissement + Enseignant.
   Prototype front-end seul : données simulées, stockage en mémoire (React
   state) le temps de la session. JavaScript (JSX), pas de backend réel.
   ========================================================================= */

/* ------------------------------- THEME ---------------------------------- */
const COLORS = {
  bg: "#F6F7FB",
  surface: "#FFFFFF",
  primary: "#3558D4",
  primaryDark: "#20399A",
  primarySoft: "#EBEFFF",
  accent: "#7C4DDB",
  accentDark: "#5630A5",
  accentSoft: "#F2ECFF",
  success: "#16866F",
  successSoft: "#E4F7F1",
  warning: "#B96B13",
  warningSoft: "#FFF3E2",
  danger: "#C43D4B",
  dangerSoft: "#FDECEE",
  text: "#172033",
  muted: "#687083",
  border: "#E7E9F1",
};

/* ---------------------------- DONNEES DEMO ------------------------------- */
const FIRST_NAMES = ["Nadir","Yasmine","Omar","Chaimaa","Karim","Ines","Bilal","Sofia","Amine","Nour",
  "Rania","Walid","Meriem","Hamza","Dounia","Sami","Aya","Riyad","Feriel","Nassim",
  "Imane","Anis","Sarah","Youssef","Lydia","Rachid","Amel","Khaled","Nesrine","Tarek"];
const LAST_NAMES = ["Cherif","Toure","Haddad","Rahal","Belkacem","Meziane","Boudiaf","Ferhat","Zerrouki","Aouadi",
  "Brahimi","Chaib","Yousfi","Guerroudj","Khelifi","Saidi","Larbi","Boukhari","Djelloul","Merabet",
  "Hamdi","Abbas","Kara","Chettouh","Slimani","Bouzid","Naceri","Djaidja","Rezki","Bouazza"];

function generateStudents(count, prefix) {
  const explicit = [
    { name: "Sara Benali", card: "001" },
    { name: "Adam Amrani", card: "002" },
    { name: "Lina Kaci", card: "003" },
    { name: "Yacine Bensaid", card: "004" },
    { name: "Mariam Diallo", card: "005" },
  ];
  const students = explicit.map((s, i) => ({
    id: `${prefix}st${i + 1}`, name: s.name,
    studentCode: `EL${String(i + 1).padStart(3, "0")}`,
    cardNumber: s.card, cardAssigned: true, archived: false,
  }));
  let idx = explicit.length;
  while (students.length < count) {
    idx++;
    const fn = FIRST_NAMES[idx % FIRST_NAMES.length];
    const ln = LAST_NAMES[(idx * 7) % LAST_NAMES.length];
    students.push({
      id: `${prefix}st${idx}`, name: `${fn} ${ln}`,
      studentCode: `EL${String(idx).padStart(3, "0")}`,
      cardNumber: String(idx).padStart(3, "0"), cardAssigned: true, archived: false,
    });
  }
  return students;
}

const SUBJECT_CATALOG_SEED = ["Mathématiques", "Français", "Sciences", "Éducation civique", "Arts plastiques", "Éducation physique", "Anglais", "Histoire-Géographie", "Informatique"];
const WEAK_RESULT_THRESHOLD = 50; // % en dessous duquel une recommandation de révision s'affiche

const DEFAULT_SUBJECTS_BY_LEVEL = {
  "Primaire": ["Mathématiques", "Français", "Sciences"],
  "Collège": ["Mathématiques", "Français", "Sciences", "Histoire-Géographie", "Anglais"],
  "Lycée": ["Mathématiques", "Français", "Histoire-Géographie", "Anglais", "Informatique"],
};

const FRACTIONS_QUESTIONS = [
  { id: "q1", text: "Quelle fraction représente la moitié d'un tout ?", choices: { A: "1/4", B: "1/2", C: "1/3", D: "2/3" }, correct: "B" },
  { id: "q2", text: "Combien font 1/4 + 1/4 ?", choices: { A: "1/2", B: "1/4", C: "2/8", D: "1/8" }, correct: "A" },
  { id: "q3", text: "Quelle est la fraction la plus grande ?", choices: { A: "1/2", B: "1/3", C: "1/4", D: "1/5" }, correct: "A" },
];

function makeInitialData() {
  return {
    establishment: {
      id: "est1", name: "École Al Amal", country: "Algérie", region: "Alger",
      city: "Alger", type: "Public", level: "Primaire", accountType: "institution",
    },
    admin: { id: "admin1", name: "Karim Haddad", nationality: "Algérienne", country: "Algérie", city: "Alger", birthDate: "1985-03-12", gender: "M", email: "admin@ecole.dz", phone: "", username: "admin", password: "admin123", createdAt: Date.now() - 60 * 86400000, lastLoginAt: Date.now() - 86400000, selfTeacherId: null },
    subjectCatalog: [...SUBJECT_CATALOG_SEED],
    teachers: [
      { id: "t1", name: "Amina Diallo", birthDate: "1990-07-22", gender: "F", email: "amina.diallo@ecole.dz", phone: "+213 555 000 111", username: "amina.diallo", password: "prof123", mustChangePassword: false, active: true, createdAt: Date.now() - 45 * 86400000, lastLoginAt: Date.now() - 3600000 },
      { id: "t2", name: "Youssef Kara", birthDate: "1988-11-05", gender: "M", email: "", phone: "+213 555 222 333", username: "youssef.kara", password: "Tmp8k2r", mustChangePassword: true, active: true, createdAt: Date.now() - 2 * 86400000, lastLoginAt: null },
    ],
    years: [
      {
        id: "y1", label: "2026–2027",
        classes: [
          {
            id: "c1", name: "5e année A", level: "5e année", cardCount: 100, archived: false,
            students: generateStudents(100, "a"),
            subjects: [
              { id: "s1", name: "Mathématiques", teacherId: "t1", archived: false,
                courses: [{ id: "co1", title: "Les fractions", description: "Comprendre et manipuler les fractions", competencies: [
                  { id: "cp1", title: "Reconnaître une fraction", description: "Identifier le numérateur et le dénominateur" },
                  { id: "cp2", title: "Comparer des fractions", description: "Comparer des fractions simples" },
                ] }],
                questionnaires: [
                  { id: "qz1", title: "Les fractions", description: "Notions de base sur les fractions", courseId: "co1", competencyIds: ["cp1"], archived: false, questions: FRACTIONS_QUESTIONS },
                ] },
              { id: "s2", name: "Français", teacherId: null, archived: false, courses: [], questionnaires: [] },
              { id: "s3", name: "Sciences", teacherId: null, archived: false, courses: [], questionnaires: [] },
            ],
          },
          {
            id: "c2", name: "4e année B", level: "4e année", cardCount: 30, archived: false,
            students: generateStudents(30, "b"),
            subjects: [
              { id: "s4", name: "Mathématiques", teacherId: "t1", archived: false, courses: [], questionnaires: [] },
            ],
          },
        ],
      },
    ],
    sessions: [],
  };
}

/* --------------------------- HELPERS DE DONNEES --------------------------- */
function locateClass(data, classId) {
  for (const yr of data.years) {
    const cls = yr.classes.find((c) => c.id === classId);
    if (cls) return { yr, cls };
  }
  return null;
}
function updateClass(data, classId, updater) {
  return { ...data, years: data.years.map((y) => ({ ...y, classes: y.classes.map((c) => (c.id === classId ? updater(c) : c)) })) };
}
function updateYear(data, yearId, updater) {
  return { ...data, years: data.years.map((y) => (y.id === yearId ? updater(y) : y)) };
}
function updateSession(data, sessionId, updater) {
  return { ...data, sessions: data.sessions.map((s) => (s.id === sessionId ? updater(s) : s)) };
}
function findSession(data, sessionId) { return data.sessions.find((s) => s.id === sessionId); }
function findQuestionnaire(cls, subjectId, questionnaireId) {
  const subject = cls.subjects.find((s) => s.id === subjectId);
  if (!subject) return { subject: null, questionnaire: null };
  return { subject, questionnaire: subject.questionnaires.find((q) => q.id === questionnaireId) };
}
function findTeacher(data, teacherId) { return data.teachers.find((t) => t.id === teacherId); }
function uid(prefix) { return `${prefix}${Math.random().toString(36).slice(2, 9)}`; }

function getTeacherAssignments(data, teacherId) {
  const out = [];
  data.years.forEach((yr) => yr.classes.forEach((cls) => {
    if (cls.archived) return;
    cls.subjects.forEach((s) => { if (s.teacherId === teacherId && !s.archived) out.push({ cls, subject: s }); });
  }));
  return out;
}
function getUnassignedSubjects(data) {
  const out = [];
  data.years.forEach((yr) => yr.classes.forEach((cls) => {
    if (cls.archived) return;
    cls.subjects.forEach((s) => { if (!s.teacherId && !s.archived) out.push({ cls, subject: s }); });
  }));
  return out;
}
function questionnaireHasSessions(data, questionnaireId) {
  return data.sessions.some((s) => s.questionnaireId === questionnaireId);
}
function generateUsername(name, existing) {
  const base = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z\s]/g, "").trim().split(/\s+/).join(".");
  let candidate = base || "enseignant";
  let n = 1;
  while (existing.includes(candidate)) { n++; candidate = `${base}${n}`; }
  return candidate;
}
function generateTempPassword() {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < 7; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}
function calcAge(birthDate) {
  if (!birthDate) return null;
  const b = new Date(birthDate);
  if (isNaN(b.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - b.getFullYear();
  const m = now.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age--;
  return age;
}
function formatDateFr(timestamp) {
  if (!timestamp) return null;
  return new Date(timestamp).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}
function genderLabel(g) {
  if (g === "F") return "Femme";
  if (g === "M") return "Homme";
  return null;
}
function getSyncAlertLevel(data) {
  const pending = data.sessions.filter((s) => s.syncStatus !== "synced");
  const now = Date.now();
  const oldestDays = pending.length ? Math.max(...pending.map((s) => (now - (s.createdAt || now)) / 86400000)) : 0;
  if (pending.length > 20 || oldestDays > 30) return { level: "critical", count: pending.length, oldestDays: Math.floor(oldestDays) };
  if (pending.length > 5 || oldestDays > 7) return { level: "warning", count: pending.length, oldestDays: Math.floor(oldestDays) };
  return { level: "ok", count: pending.length, oldestDays: Math.floor(oldestDays) };
}

/* ------------------------------ UI PRIMITIVES ----------------------------- */
function TopBar({ title, subtitle, onBack, right }) {
  return (
    <div className="app-topbar flex items-center gap-3 px-4 pt-3 pb-3 sticky top-0 z-20" style={{ background: "rgba(246,247,251,.94)" }}>
      {onBack ? (
        <button onClick={onBack} className="topbar-action w-10 h-10 flex items-center justify-center rounded-[14px] -ml-1 active:scale-95 transition" aria-label="Retour">
          <ChevronLeft size={20} color={COLORS.primary} />
        </button>
      ) : <div className="topbar-brand w-10 h-10 rounded-[14px] flex items-center justify-center"><GraduationCap size={20} /></div>}
      <div className="flex-1 min-w-0">
        <h1 className="text-[17px] font-extrabold tracking-[-0.025em] truncate" style={{ color: COLORS.text }}>{title}</h1>
        {subtitle && <p className="text-[11px] truncate" style={{ color: COLORS.muted }}>{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

function SectionLabel({ children }) {
  return <div className="section-label flex items-center gap-2 px-0.5"><span /><p className="text-[10.5px] font-extrabold uppercase" style={{ color: COLORS.muted, letterSpacing: "0.09em" }}>{children}</p></div>;
}
function getQuestionnaireCompetencies(subject, questionnaire) {
  const ids = questionnaire?.competencyIds || [];
  return (subject?.courses || []).flatMap((course) => course.competencies || []).filter((competency) => ids.includes(competency.id));
}

function Btn({ children, onClick, variant = "primary", full, disabled, icon: Icon, size = "md", type = "button" }) {
  const styles = {
    primary: { background: disabled ? "#A9B8CE" : COLORS.primary, color: "#fff" },
    accent: { background: disabled ? "#C9BBE3" : COLORS.accent, color: "#fff" },
    secondary: { background: COLORS.primarySoft, color: COLORS.primary },
    ghost: { background: "transparent", color: COLORS.primary, border: `1px solid ${COLORS.border}` },
    danger: { background: disabled ? "#E9B8B2" : COLORS.danger, color: "#fff" },
    success: { background: disabled ? "#A9D3C6" : COLORS.success, color: "#fff" },
  };
  const pad = size === "sm" ? "py-1.5 px-2.5 text-[11px]" : "py-2.5 px-3.5 text-[12.5px]";
  return (
    <button type={type} onClick={disabled ? undefined : onClick} disabled={disabled}
      className={`app-button rounded-[13px] font-bold flex items-center justify-center gap-1.5 transition active:scale-[0.98] ${pad} ${full ? "w-full" : ""} ${disabled ? "cursor-not-allowed" : ""}`}
      style={styles[variant]}>
      {Icon && <Icon size={size === "sm" ? 15 : 17} />}
      {children}
    </button>
  );
}

function Card({ children, className = "", onClick, style }) {
  return (
    <div onClick={onClick} className={`app-card rounded-[22px] p-4 ${onClick ? "app-card--interactive cursor-pointer active:scale-[0.99] transition" : ""} ${className}`}
      style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: "0 8px 24px rgba(38,48,82,0.055)", ...style }}>
      {children}
    </div>
  );
}

function Badge({ children, tone = "neutral", icon: Icon }) {
  const tones = {
    neutral: { bg: "#EEF1F4", fg: COLORS.muted },
    primary: { bg: COLORS.primarySoft, fg: COLORS.primary },
    accent: { bg: COLORS.accentSoft, fg: COLORS.accent },
    success: { bg: COLORS.successSoft, fg: COLORS.success },
    warning: { bg: COLORS.warningSoft, fg: COLORS.warning },
    danger: { bg: COLORS.dangerSoft, fg: COLORS.danger },
  };
  const t = tones[tone];
  return (
    <span className="app-badge inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-bold" style={{ background: t.bg, color: t.fg }}>
      {Icon && <Icon size={12} />}{children}
    </span>
  );
}

function Field({ label, children }) {
  return (
    <label className="app-field block mb-4">
      <span className="block text-[11px] font-bold mb-2 ml-0.5" style={{ color: COLORS.text }}>{label}</span>
      {children}
    </label>
  );
}

const inputStyle = { width: "100%", padding: "12px 13px", minHeight: 46, borderRadius: 14, border: `1px solid ${COLORS.border}`, fontSize: 13.5, color: COLORS.text, background: "#FFFFFF", outline: "none" };
function TextInput(props) { return <input {...props} style={{ ...inputStyle, ...(props.style || {}) }} />; }
function TextArea(props) { return <textarea {...props} style={{ ...inputStyle, resize: "none", ...(props.style || {}) }} />; }

function EmptyState({ icon: Icon, title, text, action }) {
  return (
    <div className="empty-state flex flex-col items-center text-center py-10 px-6">
      <div className="empty-state-icon w-16 h-16 rounded-[22px] flex items-center justify-center mb-4" style={{ background: COLORS.primarySoft }}>
        <Icon size={27} color={COLORS.primary} />
      </div>
      <p className="font-bold text-[14px] mb-1" style={{ color: COLORS.text }}>{title}</p>
      <p className="text-[12.5px] mb-4" style={{ color: COLORS.muted }}>{text}</p>
      {action}
    </div>
  );
}
function Screen({ children }) { return <div className="app-screen pb-7">{children}</div>; }

/* Confirmation renforcée pour les actions les plus lourdes : il faut retaper le nom pour activer le bouton */
function TypedConfirmModal({ open, title, text, confirmWord, onCancel, onConfirm, confirmLabel = "Confirmer" }) {
  const [value, setValue] = useState("");
  useEffect(() => { if (open) setValue(""); }, [open]);
  if (!open) return null;
  const matches = value.trim().toLowerCase() === (confirmWord || "").trim().toLowerCase();
  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(15,23,33,0.45)" }}>
      <div className="w-full rounded-t-2xl p-5" style={{ background: COLORS.surface }}>
        <p className="font-bold text-[15px] mb-1" style={{ color: COLORS.text }}>{title}</p>
        <p className="text-[13px] mb-3" style={{ color: COLORS.muted }}>{text}</p>
        <p className="text-[11.5px] mb-1.5 font-semibold" style={{ color: COLORS.text }}>Tapez « {confirmWord} » pour confirmer :</p>
        <TextInput autoFocus value={value} onChange={(e) => setValue(e.target.value)} placeholder={confirmWord} style={{ marginBottom: 12 }} />
        <div className="flex gap-2">
          <Btn variant="ghost" full onClick={onCancel}>Annuler</Btn>
          <Btn variant="danger" full disabled={!matches} onClick={onConfirm}>{confirmLabel}</Btn>
        </div>
      </div>
    </div>
  );
}

/* Célébration — réservée aux vrais moments forts, d'où le violet accent utilisé nulle part ailleurs pour un fond plein */
function CelebrationOverlay({ average, onClose }) {
  return (
    <div className="absolute inset-0 z-[80] flex items-center justify-center px-8" style={{ background: "rgba(15,23,33,0.55)" }}>
      <div className="w-full rounded-3xl p-6 text-center" style={{ background: COLORS.surface }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: COLORS.accentSoft }}>
          <Sparkles size={30} color={COLORS.accent} />
        </div>
        <p className="font-extrabold text-[18px] mb-1" style={{ color: COLORS.text }}>Belle performance !</p>
        <p className="text-[13px] mb-5" style={{ color: COLORS.muted }}>La classe a obtenu {average}% de moyenne sur cette évaluation.</p>
        <Btn full variant="accent" onClick={onClose}>Continuer</Btn>
      </div>
    </div>
  );
}

/* Toasts — retours discrets et non bloquants, avec action "Annuler" optionnelle */
function ToastHost({ toasts, onDismiss }) {
  if (toasts.length === 0) return null;
  return (
    <div className="absolute left-0 right-0 z-[70] px-4 flex flex-col gap-2 items-center pointer-events-none" style={{ bottom: 78 }}>
      {toasts.map((t) => (
        <div key={t.id} className="w-full max-w-[340px] flex items-center gap-2.5 px-4 py-3 rounded-2xl pointer-events-auto" style={{ background: "#1F2933", boxShadow: "0 10px 28px rgba(15,23,33,0.3)" }}>
          {t.tone === "success" ? <CheckCircle2 size={16} color="#8FE3C7" className="shrink-0" /> : <Info size={16} color="#CFE0F5" className="shrink-0" />}
          <span className="flex-1 text-[12.5px] text-white">{t.message}</span>
          {t.actionLabel && (
            <button onClick={() => { t.onAction?.(); onDismiss(t.id); }} className="text-[12px] font-bold shrink-0" style={{ color: "#C9A8F0" }}>{t.actionLabel}</button>
          )}
        </div>
      ))}
    </div>
  );
}

function ConfirmModal({ open, title, text, onCancel, onConfirm, confirmLabel = "Confirmer", danger }) {
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(15,23,33,0.45)" }}>
      <div className="w-full rounded-t-2xl p-5" style={{ background: COLORS.surface }}>
        <p className="font-bold text-[15px] mb-1" style={{ color: COLORS.text }}>{title}</p>
        <p className="text-[13px] mb-4" style={{ color: COLORS.muted }}>{text}</p>
        <div className="flex gap-2">
          <Btn variant="ghost" full onClick={onCancel}>Annuler</Btn>
          <Btn variant={danger ? "danger" : "primary"} full onClick={onConfirm}>{confirmLabel}</Btn>
        </div>
      </div>
    </div>
  );
}

function OptionCard({ selected, onClick, title, subtitle, icon: Icon, disabled }) {
  return (
    <Card onClick={disabled ? undefined : onClick} className="flex items-center gap-3 mb-2"
      style={{ opacity: disabled ? 0.45 : 1, borderColor: selected ? COLORS.primary : COLORS.border, borderWidth: selected ? 2 : 1, background: selected ? COLORS.primarySoft : COLORS.surface }}>
      <div className="option-icon w-11 h-11 rounded-[15px] flex items-center justify-center shrink-0" style={{ background: selected ? COLORS.primary : COLORS.primarySoft }}>
        <Icon size={18} color={selected ? "#fff" : COLORS.primary} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-[13.5px] truncate" style={{ color: COLORS.text }}>{title}</p>
        {subtitle && <p className="text-[11.5px] truncate" style={{ color: COLORS.muted }}>{subtitle}</p>}
      </div>
      {selected && <CheckCircle2 size={20} color={COLORS.primary} />}
    </Card>
  );
}
function WizardProgress({ step, totalSteps, crumbs = [], labels = [], helperText }) {
  const safeStep = Math.min(step, totalSteps - 1);
  const activeLabel = labels[safeStep] || `Étape ${safeStep + 1}`;
  return (
    <div className="wizard-shell mx-4 mt-3 mb-2 p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="wizard-count">{String(safeStep + 1).padStart(2, "0")}</span>
            <div><p className="text-[12px] font-extrabold" style={{ color: COLORS.text }}>{activeLabel}</p><p className="text-[9.5px] font-semibold mt-0.5" style={{ color: COLORS.muted }}>{helperText || "Quelques secondes suffisent"}</p></div>
          </div>
        </div>
        <span className="text-[10px] font-bold shrink-0" style={{ color: COLORS.muted }}>{safeStep + 1}/{totalSteps}</span>
      </div>
      <div className="wizard-steps flex items-center">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <React.Fragment key={i}>
            <div className={`wizard-dot ${i < safeStep ? "done" : i === safeStep ? "active" : ""}`}>
              {i < safeStep ? <Check size={11} /> : <span />}
            </div>
            {i < totalSteps - 1 && <div className={`wizard-line ${i < safeStep ? "done" : ""}`} />}
          </React.Fragment>
        ))}
      </div>
      {crumbs.length > 0 && <div className="wizard-summary mt-3"><CheckCircle2 size={12}/><span className="truncate">{crumbs.join(" · ")}</span></div>}
    </div>
  );
}

/* ------------------------------ BOTTOM TAB BAR ----------------------------- */
const ADMIN_TABS = [
  { key: "accueil", label: "Accueil", icon: Home, root: "adminDashboard" },
  { key: "classes", label: "Classes", icon: School, root: "years" },
  { key: "enseignants", label: "Enseignants", icon: Users, root: "teachersList" },
  { key: "profil", label: "Profil", icon: User, root: "myProfile" },
];
const TEACHER_TABS = [
  { key: "accueil", label: "Accueil", icon: Home, root: "teacherDashboard" },
  { key: "evaluations", label: "Évaluations", icon: ClipboardList, root: "evaluationsList" },
  { key: "resultats", label: "Résultats", icon: BarChart3, root: "resultsList" },
  { key: "profil", label: "Profil", icon: User, root: "myProfile" },
];
/* Compte indépendant : un seul enseignant qui gère aussi ses classes/matières — tabs fusionnés */
const INDEPENDENT_TABS = [
  { key: "accueil", label: "Accueil", icon: Home, root: "teacherDashboard" },
  { key: "classes", label: "Classes", icon: School, root: "years" },
  { key: "evaluations", label: "Évaluations", icon: ClipboardList, root: "evaluationsList" },
  { key: "resultats", label: "Résultats", icon: BarChart3, root: "resultsList" },
  { key: "profil", label: "Profil", icon: User, root: "myProfile" },
];
function getTabsFor(ctx) {
  if (ctx.currentUser?.type === "admin") return ADMIN_TABS;
  if (ctx.data.establishment?.accountType === "independent") return INDEPENDENT_TABS;
  return TEACHER_TABS;
}

function BottomTabBar({ ctx }) {
  const tabs = getTabsFor(ctx);
  return (
    <div className="app-bottom-nav flex items-stretch px-2 pt-2 pb-2 sticky bottom-0 z-20" style={{ background: "rgba(255,255,255,.96)" }}>
      {tabs.map((t) => {
        const active = ctx.nav.activeTab === t.key;
        return (
          <button key={t.key} onClick={() => ctx.nav.switchTab(t.key)} className="flex-1 flex flex-col items-center gap-1 py-1">
            <div className="nav-icon w-12 flex items-center justify-center rounded-full py-1.5 transition-all" style={{ background: active ? COLORS.primarySoft : "transparent", transform: active ? "translateY(-1px)" : "none" }}>
              <t.icon size={19} color={active ? COLORS.primary : COLORS.muted} />
            </div>
            <span className="text-[10px] font-semibold" style={{ color: active ? COLORS.primary : COLORS.muted }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function SyncIndicator({ ctx }) {
  const alert = getSyncAlertLevel(ctx.data);
  const tone = alert.level === "critical" ? COLORS.danger : alert.level === "warning" ? COLORS.warning : COLORS.success;
  const bg = alert.level === "critical" ? COLORS.dangerSoft : alert.level === "warning" ? COLORS.warningSoft : COLORS.successSoft;
  return (
    <button onClick={() => ctx.nav.push("sync")} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full" style={{ background: ctx.isOnline ? bg : COLORS.warningSoft }}>
      {ctx.isOnline ? <Wifi size={14} color={tone} /> : <WifiOff size={14} color={COLORS.warning} />}
      {alert.count > 0 && <span className="text-[10px] font-bold px-1.5 rounded-full" style={{ background: tone, color: "#fff" }}>{alert.count}</span>}
    </button>
  );
}

/* ================================ ÉCRANS D'ENTRÉE ========================= */

function OnboardingTip({ ctx, text }) {
  if (ctx.onboardingSeen) return null;
  return (
    <Card className="flex items-start gap-3" style={{ background: COLORS.accentSoft, border: "none" }}>
      <Info size={18} color={COLORS.accent} className="mt-0.5 shrink-0" />
      <p className="text-[12px] flex-1" style={{ color: COLORS.accentDark }}>{text}</p>
      <button onClick={() => ctx.setOnboardingSeen(true)} className="shrink-0"><X size={16} color={COLORS.accent} /></button>
    </Card>
  );
}

function WelcomeScreen({ ctx }) {
  return (
    <Screen>
      <div className="welcome-hero flex flex-col items-center justify-center pt-14 px-6 pb-8">
        <Badge tone="success" icon={Wifi}>Conçu pour fonctionner hors ligne</Badge>
        <div className="brand-mark w-24 h-24 rounded-[30px] flex items-center justify-center mt-7 mb-5" style={{ background: `linear-gradient(145deg, ${COLORS.primary}, ${COLORS.accent})` }}>
          <ScanLine size={40} color="#fff" />
        </div>
        <h1 className="text-[28px] font-black mb-1 tracking-[-0.04em]" style={{ color: COLORS.text }}>KAGAT</h1>
        <p className="text-[14px] font-semibold text-center mb-2" style={{ color: COLORS.text }}>Chaque réponse devient une opportunité d'apprendre.</p>
        <p className="text-[12.5px] leading-5 text-center mb-9 max-w-[300px]" style={{ color: COLORS.muted }}>
          Évaluation formative par cartes-réponses,<br />même sans connexion Internet.
        </p>
        <Btn full icon={LogIn} onClick={() => ctx.nav.push("login")}>Se connecter</Btn>
        <button onClick={() => ctx.nav.push("register")} className="mt-5 text-center">
          <span className="text-[12.5px] font-semibold" style={{ color: COLORS.primary }}>Créer mon compte gestionnaire</span>
          <p className="text-[11px] mt-0.5" style={{ color: COLORS.muted }}>Vous ajouterez votre établissement une fois inscrit</p>
        </button>
      </div>
    </Screen>
  );
}

function RegisterWizardScreen({ ctx }) {
  const [step, setStep] = useState(0);
  const [accountType, setAccountType] = useState(""); // "institution" | "independent"
  const [channel, setChannel] = useState(""); // "email" | "phone"
  const [contact, setContact] = useState("");
  const [demoCode, setDemoCode] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [verifyError, setVerifyError] = useState("");
  const [resent, setResent] = useState(false);
  const [name, setName] = useState("");
  const [nationality, setNationality] = useState("");
  const [personCountry, setPersonCountry] = useState("");
  const [personCity, setPersonCity] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pwdError, setPwdError] = useState("");
  const [school, setSchool] = useState({ name: "", country: "", region: "", city: "", type: "Public", level: "Primaire" });

  const chooseAccountType = (type) => { setAccountType(type); setStep(1); };
  const chooseChannel = (ch) => { setChannel(ch); setContact(""); setStep(2); };

  const sendCode = () => {
    if (!contact.trim()) return;
    setDemoCode(String(Math.floor(100000 + Math.random() * 900000)));
    setCodeInput(""); setVerifyError("");
    setStep(3);
  };

  const verifyCode = () => {
    if (codeInput.trim() === demoCode) { setVerifyError(""); setStep(4); }
    else setVerifyError("Code incorrect. Vérifiez et réessayez.");
  };
  const resendCode = () => {
    setDemoCode(String(Math.floor(100000 + Math.random() * 900000)));
    setResent(true); setVerifyError("");
    setTimeout(() => setResent(false), 2500);
  };

  const goPassword = () => {
    if (password.length < 4 || password !== confirm) { setPwdError("Le mot de passe doit faire au moins 4 caractères et être confirmé."); return; }
    setPwdError(""); setStep(6);
  };

  const finish = () => {
    if (!school.name.trim() || !school.country.trim()) return;
    const adminId = uid("admin");
    const isIndependent = accountType === "independent";
    const selfTeacherId = isIndependent ? uid("t") : null;
    ctx.setData((d) => ({
      ...d,
      admin: {
        id: adminId, name: name.trim(), nationality: nationality.trim(), country: personCountry.trim(), city: personCity.trim(),
        birthDate, gender,
        email: channel === "email" ? contact.trim() : "",
        phone: channel === "phone" ? contact.trim() : "",
        username: contact.trim(), password,
        createdAt: Date.now(), lastLoginAt: Date.now(),
        selfTeacherId,
      },
      establishment: { id: uid("est"), name: school.name.trim(), country: school.country.trim(), region: school.region.trim(), city: school.city.trim(), type: school.type, level: school.level, accountType: isIndependent ? "independent" : "institution" },
      years: [], sessions: [], subjectCatalog: [...SUBJECT_CATALOG_SEED],
      teachers: isIndependent ? [{
        id: selfTeacherId, name: name.trim(), nationality: nationality.trim(), country: personCountry.trim(), city: personCity.trim(), birthDate, gender,
        email: channel === "email" ? contact.trim() : "", phone: channel === "phone" ? contact.trim() : "",
        username: contact.trim(), password, mustChangePassword: false, active: true,
        createdAt: Date.now(), lastLoginAt: Date.now(),
      }] : [],
    }));
    if (isIndependent) { ctx.setCurrentUser({ type: "teacher", id: selfTeacherId }); ctx.enterApp("teacher"); }
    else { ctx.setCurrentUser({ type: "admin", id: adminId }); ctx.enterApp("admin"); }
  };

  const goBack = () => {
    if (step === 0) { ctx.nav.pop(); return; }
    setStep((s) => s - 1);
  };

  // Les 7 interactions techniques sont regroupées en 4 jalons compréhensibles.
  const registrationPhase = step <= 2 ? 0 : step === 3 ? 1 : step <= 5 ? 2 : 3;
  const registrationLabels = ["Choisir le compte", "Vérifier l'accès", "Créer votre profil", "Configurer l'école"];

  let title = "", body = null;
  if (step === 0) {
    title = "Comment allez-vous utiliser KAGAT ?";
    body = (
      <div className="px-4">
        <OptionCard icon={School} title="Je gère une école" subtitle="Plusieurs enseignants, une administration commune" selected={accountType === "institution"} onClick={() => chooseAccountType("institution")} />
        <OptionCard icon={User} title="J'enseigne seul(e)" subtitle="Je crée mes classes et évaluations moi-même" selected={accountType === "independent"} onClick={() => chooseAccountType("independent")} />
      </div>
    );
  } else if (step === 1) {
    title = "Comment voulez-vous vous inscrire ?";
    body = (
      <div className="px-4">
        <OptionCard icon={Send} title="Par email" subtitle="Recevoir un code de vérification par email" onClick={() => chooseChannel("email")} />
        <OptionCard icon={Phone} title="Par téléphone" subtitle="Recevoir un code par SMS ou WhatsApp" onClick={() => chooseChannel("phone")} />
      </div>
    );
  } else if (step === 2) {
    title = channel === "email" ? "Votre email" : "Votre téléphone";
    body = (
      <div className="px-4">
        <Field label={channel === "email" ? "Adresse email" : "Numéro de téléphone"}>
          <TextInput autoFocus value={contact} onChange={(e) => setContact(e.target.value)} placeholder={channel === "email" ? "Ex. karim.haddad@ecole.dz" : "Ex. +213 555 000 000"} autoCapitalize="none" />
        </Field>
        <Btn full icon={ArrowRight} disabled={!contact.trim()} onClick={sendCode}>Recevoir le code</Btn>
      </div>
    );
  } else if (step === 3) {
    const masked = channel === "email"
      ? contact.replace(/^(.{2}).*(@.*)$/, "$1***$2")
      : contact.replace(/(.{3})(.*)(.{2})$/, "$1***$3");
    title = "Vérification";
    body = (
      <div className="px-4">
        <p className="text-[12.5px] mb-4" style={{ color: COLORS.muted }}>Un code à 6 chiffres a été envoyé {channel === "email" ? "par email" : "par SMS ou WhatsApp"} à <b>{masked}</b>.</p>
        <Field label="Code de vérification">
          <TextInput autoFocus value={codeInput} onChange={(e) => { setCodeInput(e.target.value); setVerifyError(""); }} placeholder="123456" maxLength={6} style={{ letterSpacing: "0.3em", fontSize: 18, textAlign: "center" }} />
        </Field>
        {verifyError && <p className="text-[12px] mb-3 font-semibold" style={{ color: COLORS.danger }}>{verifyError}</p>}
        <Btn full icon={ShieldCheck} disabled={codeInput.trim().length < 6} onClick={verifyCode}>Vérifier</Btn>
        <button onClick={resendCode} className="w-full text-center mt-4"><span className="text-[12px] font-semibold" style={{ color: COLORS.primary }}>Renvoyer le code</span></button>
        {resent && <p className="text-[11px] text-center mt-2 font-semibold" style={{ color: COLORS.success }}>Nouveau code envoyé.</p>}
        <Card className="mt-5" style={{ background: COLORS.warningSoft, border: "none" }}>
          <p className="text-[11px]" style={{ color: COLORS.warning }}>Aperçu de démonstration — dans l'application réelle, ce code n'est jamais affiché ici. Code de test : <b>{demoCode}</b></p>
        </Card>
      </div>
    );
  } else if (step === 4) {
    title = "Vos informations";
    body = (
      <div className="px-4">
        <p className="text-[12.5px] mb-4" style={{ color: COLORS.muted }}>Compte vérifié. Parlez-nous un peu de vous.</p>
        <Field label="Nom complet"><TextInput autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex. Karim Haddad" /></Field>
        <Field label="Nationalité (facultatif)"><TextInput value={nationality} onChange={(e) => setNationality(e.target.value)} placeholder="Ex. Algérienne" /></Field>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Pays de résidence"><TextInput value={personCountry} onChange={(e) => setPersonCountry(e.target.value)} placeholder="Ex. Algérie" /></Field>
          <Field label="Ville"><TextInput value={personCity} onChange={(e) => setPersonCity(e.target.value)} placeholder="Ex. Alger" /></Field>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Date de naissance (facultatif)"><TextInput type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} /></Field>
          <Field label="Genre (facultatif)">
            <select style={inputStyle} value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Préfère ne pas préciser</option>
              <option value="F">Femme</option>
              <option value="M">Homme</option>
            </select>
          </Field>
        </div>
        <Btn full icon={ArrowRight} disabled={!name.trim()} onClick={() => setStep(5)}>Continuer</Btn>
      </div>
    );
  } else if (step === 5) {
    title = "Créer un mot de passe";
    body = (
      <div className="px-4">
        <Field label="Mot de passe"><TextInput type="password" autoFocus value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Au moins 4 caractères" /></Field>
        <Field label="Confirmer le mot de passe"><TextInput type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Retapez le mot de passe" /></Field>
        {pwdError && <p className="text-[12px] mb-3 font-semibold" style={{ color: COLORS.danger }}>{pwdError}</p>}
        <Btn full icon={ArrowRight} disabled={password.length < 4 || !confirm} onClick={goPassword}>Continuer</Btn>
      </div>
    );
  } else if (step === 6) {
    title = accountType === "independent" ? "Votre contexte" : "Votre établissement";
    const setS = (k) => (e) => setSchool((s) => ({ ...s, [k]: e.target.value }));
    body = (
      <div className="px-4">
        <p className="text-[12.5px] mb-4" style={{ color: COLORS.muted }}>Dernière étape avant d'entrer dans l'application.</p>
        <Field label={accountType === "independent" ? "Nom de l'école (ou un nom de votre choix)" : "Nom de l'établissement"}><TextInput autoFocus value={school.name} onChange={setS("name")} placeholder="Ex. École Al Amal" /></Field>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Pays"><TextInput value={school.country} onChange={setS("country")} placeholder="Ex. Algérie" /></Field>
          <Field label="Région"><TextInput value={school.region} onChange={setS("region")} placeholder="Ex. Alger" /></Field>
        </div>
        <Field label="Ville"><TextInput value={school.city} onChange={setS("city")} placeholder="Ex. Alger" /></Field>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Type"><select style={inputStyle} value={school.type} onChange={setS("type")}><option>Public</option><option>Privé</option></select></Field>
          <Field label="Niveau"><select style={inputStyle} value={school.level} onChange={setS("level")}><option>Primaire</option><option>Collège</option><option>Lycée</option></select></Field>
        </div>
        <Btn full icon={School} disabled={!school.name.trim() || !school.country.trim()} onClick={finish}>Entrer dans KAGAT</Btn>
      </div>
    );
  }

  return (
    <Screen>
      <TopBar title={title} onBack={goBack} />
      <WizardProgress step={registrationPhase} totalSteps={4} labels={registrationLabels} helperText="Votre progression est enregistrée sur cet écran" />
      <div className="pt-2">{body}</div>
    </Screen>
  );
}



function LoginScreen({ ctx }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    setError("");
    const input = username.trim();
    const admin = ctx.data.admin;
    const adminMatches = admin && (input === admin.username || (admin.email && input === admin.email) || (admin.phone && input === admin.phone));
    if (adminMatches && password === admin.password) {
      const isIndependent = ctx.data.establishment?.accountType === "independent" && admin.selfTeacherId;
      if (isIndependent) {
        ctx.setData((d) => ({ ...d, teachers: d.teachers.map((t) => (t.id === admin.selfTeacherId ? { ...t, lastLoginAt: Date.now() } : t)) }));
        ctx.setCurrentUser({ type: "teacher", id: admin.selfTeacherId });
        ctx.enterApp("teacher");
      } else {
        ctx.setData((d) => ({ ...d, admin: { ...d.admin, lastLoginAt: Date.now() } }));
        ctx.setCurrentUser({ type: "admin", id: admin.id });
        ctx.enterApp("admin");
      }
      return;
    }
    const teacher = ctx.data.teachers.find((t) => t.active && (t.username === input || (t.email && t.email === input) || (t.phone && t.phone === input)) && t.password === password);
    if (teacher) {
      ctx.setData((d) => ({ ...d, teachers: d.teachers.map((t) => (t.id === teacher.id ? { ...t, lastLoginAt: Date.now() } : t)) }));
      ctx.setCurrentUser({ type: "teacher", id: teacher.id });
      if (teacher.mustChangePassword) ctx.nav.push("forcedPasswordChange");
      else ctx.enterApp("teacher");
      return;
    }
    setError("Identifiant ou mot de passe incorrect.");
  };

  return (
    <Screen>
      <TopBar title="Connexion" onBack={() => ctx.nav.pop()} />
      <div className="px-4 pt-6">
        <Field label="Email ou téléphone"><TextInput value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Ex. karim.haddad@ecole.dz" autoCapitalize="none" /></Field>
        <Field label="Mot de passe"><TextInput type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Votre mot de passe" /></Field>
        {error && <p className="text-[12px] mb-3 font-semibold" style={{ color: COLORS.danger }}>{error}</p>}

        <Card className="flex items-center gap-2 mb-5">
          {ctx.isOnline ? <Wifi size={17} color={COLORS.success} /> : <WifiOff size={17} color={COLORS.warning} />}
          <span className="text-[12.5px]" style={{ color: COLORS.muted }}>
            {ctx.isOnline ? "Connexion détectée — vos données se synchroniseront automatiquement." : "Aucune connexion détectée — vous pouvez vous connecter hors ligne, tout se synchronisera dès le retour du réseau."}
          </span>
        </Card>

        <Btn full icon={LogIn} onClick={submit}>Se connecter</Btn>
        <div className="grid grid-cols-2 gap-2 mt-3">
          <button onClick={() => { setUsername("admin"); setPassword("admin123"); setError(""); }} className="demo-account-button">Démo gestionnaire</button>
          <button onClick={() => { setUsername("amina.diallo"); setPassword("prof123"); setError(""); }} className="demo-account-button">Démo enseignante</button>
        </div>
        <button onClick={() => ctx.nav.push("forgotPassword")} className="w-full text-center mt-3">
          <span className="text-[12px] font-semibold" style={{ color: COLORS.primary }}>Mot de passe oublié ?</span>
        </button>
        <p className="text-[11px] mt-4 text-center" style={{ color: COLORS.muted }}>Touchez un profil démo pour préremplir les accès.</p>
      </div>
    </Screen>
  );
}

function ForgotPasswordScreen({ ctx }) {
  const [identifier, setIdentifier] = useState("");
  const [sent, setSent] = useState(false);

  const submit = () => { if (identifier.trim()) setSent(true); };
  const maskedTarget = identifier.includes("@") ? identifier.replace(/^(.{2}).*(@.*)$/, "$1***$2") : identifier;

  if (sent) {
    return (
      <Screen>
        <TopBar title="Vérifiez votre boîte de réception" onBack={() => ctx.nav.pop()} />
        <div className="px-4 pt-10">
          <EmptyState icon={CheckCircle2} title="Email envoyé (simulation)" text={`Si un compte existe pour "${maskedTarget}", un lien de réinitialisation vient d'être envoyé. Dans l'application réelle, ce lien permet de choisir un nouveau mot de passe.`}
            action={<Btn onClick={() => ctx.nav.pop()}>Retour à la connexion</Btn>} />
        </div>
      </Screen>
    );
  }
  return (
    <Screen>
      <TopBar title="Mot de passe oublié" onBack={() => ctx.nav.pop()} />
      <div className="px-4 pt-6">
        <Card className="mb-4" style={{ background: COLORS.primarySoft, border: "none" }}>
          <p className="text-[12px]" style={{ color: COLORS.primaryDark }}>Entrez l'email ou l'identifiant de votre compte (gestionnaire ou enseignant). Un lien de réinitialisation vous sera envoyé.</p>
        </Card>
        <Field label="Email ou identifiant"><TextInput autoFocus value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="Ex. karim.haddad@ecole.dz" autoCapitalize="none" /></Field>
        <Btn full icon={Send} disabled={!identifier.trim()} onClick={submit}>Envoyer le lien</Btn>
      </div>
    </Screen>
  );
}

function ForcedPasswordChangeScreen({ ctx }) {
  const teacher = findTeacher(ctx.data, ctx.currentUser.id);
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const canSubmit = pwd.length >= 4 && pwd === confirm;

  const submit = () => {
    if (!canSubmit) return;
    ctx.setData((d) => ({ ...d, teachers: d.teachers.map((t) => (t.id === teacher.id ? { ...t, password: pwd, mustChangePassword: false } : t)) }));
    ctx.enterApp("teacher");
  };

  return (
    <Screen>
      <TopBar title="Choisissez votre mot de passe" />
      <div className="px-4 pt-6">
        <Card className="mb-4" style={{ background: COLORS.primarySoft, border: "none" }}>
          <p className="text-[12.5px]" style={{ color: COLORS.primaryDark }}>
            Bienvenue {teacher.name}. Pour votre sécurité, remplacez le mot de passe temporaire reçu par un mot de passe personnel avant de continuer.
          </p>
        </Card>
        <Field label="Nouveau mot de passe"><TextInput type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="Au moins 4 caractères" /></Field>
        <Field label="Confirmer le mot de passe"><TextInput type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Retapez le mot de passe" /></Field>
        <Btn full icon={Lock} disabled={!canSubmit} onClick={submit}>Continuer</Btn>
      </div>
    </Screen>
  );
}

function MyProfileScreen({ ctx }) {
  const isAdmin = ctx.currentUser.type === "admin";
  const person = isAdmin ? ctx.data.admin : findTeacher(ctx.data, ctx.currentUser.id);
  const isSelfTeacher = !isAdmin && ctx.data.admin?.selfTeacherId === ctx.currentUser.id;
  const [editing, setEditing] = useState(false);
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const submit = () => {
    setError("");
    if (oldPwd !== person.password) { setError("Ancien mot de passe incorrect."); return; }
    if (newPwd.length < 4 || newPwd !== confirm) { setError("Le nouveau mot de passe doit faire au moins 4 caractères et être confirmé."); return; }
    if (isAdmin) ctx.setData((d) => ({ ...d, admin: { ...d.admin, password: newPwd } }));
    else if (isSelfTeacher) ctx.setData((d) => ({ ...d, admin: { ...d.admin, password: newPwd }, teachers: d.teachers.map((t) => (t.id === person.id ? { ...t, password: newPwd } : t)) }));
    else ctx.setData((d) => ({ ...d, teachers: d.teachers.map((t) => (t.id === person.id ? { ...t, password: newPwd } : t)) }));
    setDone(true); setEditing(false); setOldPwd(""); setNewPwd(""); setConfirm("");
  };

  const logout = () => { ctx.setCurrentUser(null); ctx.exitApp(); };

  return (
    <Screen>
      <TopBar title="Mon profil" />
      <div className="px-4 pt-4">
        <Card className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: COLORS.primarySoft }}>
            <User size={20} color={COLORS.primary} />
          </div>
          <div>
            <p className="font-bold text-[14px]" style={{ color: COLORS.text }}>{person.name}</p>
            <p className="text-[12px]" style={{ color: COLORS.muted }}>{isAdmin ? "Gestionnaire de l'école" : isSelfTeacher ? "Enseignant indépendant" : "Enseignant"} · {person.username}</p>
            {(person.city || person.country || person.nationality) && (
              <p className="text-[11px] mt-0.5" style={{ color: COLORS.muted }}>
                {[person.nationality, [person.city, person.country].filter(Boolean).join(", ")].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>
        </Card>

        <Card className="mb-4">
          <p className="text-[11px] font-bold uppercase mb-2" style={{ color: COLORS.muted, letterSpacing: "0.06em" }}>Informations</p>
          <div className="space-y-1.5 text-[12px]" style={{ color: COLORS.text }}>
            {calcAge(person.birthDate) !== null && <p>🎂 {calcAge(person.birthDate)} ans{genderLabel(person.gender) ? ` · ${genderLabel(person.gender)}` : ""}</p>}
            {formatDateFr(person.createdAt) && <p>📅 Membre depuis le {formatDateFr(person.createdAt)}</p>}
            {formatDateFr(person.lastLoginAt) && <p>🔑 Dernière connexion : {formatDateFr(person.lastLoginAt)}</p>}
          </div>
        </Card>

        {(isAdmin || isSelfTeacher) && (
          <Card onClick={() => ctx.nav.push("myEstablishment")} className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: COLORS.primarySoft }}><School size={16} color={COLORS.primary} /></div>
            <div className="flex-1"><p className="font-bold text-[13px]" style={{ color: COLORS.text }}>Mon établissement</p><p className="text-[11px]" style={{ color: COLORS.muted }}>Nom, localisation, informations</p></div>
            <ChevronRight size={16} color={COLORS.muted} />
          </Card>
        )}

        {done && <Card className="mb-4" style={{ background: COLORS.successSoft, border: "none" }}><p className="text-[12.5px] font-semibold" style={{ color: COLORS.success }}>Mot de passe modifié.</p></Card>}

        {editing ? (
          <Card className="mb-4">
            <Field label="Ancien mot de passe"><TextInput type="password" value={oldPwd} onChange={(e) => setOldPwd(e.target.value)} /></Field>
            <Field label="Nouveau mot de passe"><TextInput type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} /></Field>
            <Field label="Confirmer"><TextInput type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} /></Field>
            {error && <p className="text-[12px] mb-3 font-semibold" style={{ color: COLORS.danger }}>{error}</p>}
            <div className="flex gap-2">
              <Btn variant="ghost" full onClick={() => setEditing(false)}>Annuler</Btn>
              <Btn full onClick={submit}>Enregistrer</Btn>
            </div>
          </Card>
        ) : (
          <Btn variant="secondary" full icon={KeyRound} onClick={() => { setEditing(true); setDone(false); }}>Modifier mon mot de passe</Btn>
        )}

        <Card className="flex items-center justify-between mt-3 mb-3">
          <div>
            <p className="font-bold text-[13px]" style={{ color: COLORS.text }}>Texte agrandi</p>
            <p className="text-[11px]" style={{ color: COLORS.muted }}>Pour une meilleure lisibilité</p>
          </div>
          <button onClick={() => ctx.setFontScale((v) => (v > 1 ? 1 : 1.15))} className="w-11 h-6 rounded-full relative transition" style={{ background: ctx.fontScale > 1 ? COLORS.primary : COLORS.border }}>
            <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all" style={{ left: ctx.fontScale > 1 ? 22 : 2 }} />
          </button>
        </Card>

        <div className="mt-1">
          <Btn variant="ghost" full icon={LogOut} onClick={logout}>Se déconnecter</Btn>
        </div>
      </div>
    </Screen>
  );
}

/* ============================ ESPACE ADMIN ================================ */

function AdminDashboardScreen({ ctx }) {
  const { data } = ctx;
  const firstName = data.admin.name.split(" ")[0];
  const totalClasses = data.years.flatMap((y) => y.classes).filter((c) => !c.archived).length;
  const totalStudents = data.years.flatMap((y) => y.classes).filter((c) => !c.archived).reduce((sum, c) => sum + c.students.filter((s) => !s.archived).length, 0);
  const totalTeachers = data.teachers.filter((t) => t.active).length;
  const totalSubjects = data.years.flatMap((y) => y.classes).filter((c) => !c.archived).reduce((sum, c) => sum + c.subjects.filter((s) => !s.archived).length, 0);

  return (
    <Screen>
      <TopBar title={`Bienvenue, ${firstName}`} subtitle={`${data.establishment.name} · KAGAT`} right={<SyncIndicator ctx={ctx} />} />
      <div className="px-4 pt-3 space-y-4">
        <div className="dashboard-hero">
          <div className="dashboard-hero-icon"><School size={24} /></div>
          <div><Badge tone="accent">Espace gestionnaire</Badge><p>Votre établissement, organisé en un coup d'œil.</p></div>
        </div>
        <OnboardingTip ctx={ctx} text="Pour commencer : créez une classe, importez vos élèves (cartes attribuées automatiquement), puis ajoutez un enseignant et assignez-lui ses matières." />
        <SectionLabel>Vue d'ensemble</SectionLabel>
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={School} value={totalClasses} label="Classes actives" />
          <StatCard icon={GraduationCap} value={totalStudents} label="Élèves inscrits" tone="success" />
          <StatCard icon={Users} value={totalTeachers} label="Enseignants" tone="accent" />
          <StatCard icon={BookOpen} value={totalSubjects} label="Matières" tone="warning" />
        </div>

        <SectionLabel>Accès rapide</SectionLabel>
        <div className="grid grid-cols-2 gap-3">
          <Card onClick={() => ctx.nav.switchTab("classes")} className="flex flex-col gap-2">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: COLORS.primarySoft }}><School size={17} color={COLORS.primary} /></div>
            <p className="font-bold text-[13px]" style={{ color: COLORS.text }}>Classes</p>
          </Card>
          <Card onClick={() => ctx.nav.switchTab("enseignants")} className="flex flex-col gap-2">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: COLORS.primarySoft }}><Users size={17} color={COLORS.primary} /></div>
            <p className="font-bold text-[13px]" style={{ color: COLORS.text }}>Enseignants</p>
          </Card>
        </div>
      </div>
    </Screen>
  );
}

function MyEstablishmentScreen({ ctx }) {
  const e = ctx.data.establishment;
  const [form, setForm] = useState({ ...e });
  const set = (k) => (ev) => setForm((f) => ({ ...f, [k]: ev.target.value }));
  const save = () => { ctx.setData((d) => ({ ...d, establishment: { ...d.establishment, ...form } })); ctx.showToast("Établissement mis à jour"); ctx.nav.pop(); };
  return (
    <Screen>
      <TopBar title="Mon établissement" onBack={() => ctx.nav.pop()} />
      <div className="px-4 pt-4">
        <Field label="Nom"><TextInput value={form.name} onChange={set("name")} /></Field>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Pays"><TextInput value={form.country} onChange={set("country")} /></Field>
          <Field label="Région"><TextInput value={form.region} onChange={set("region")} /></Field>
        </div>
        <Field label="Ville"><TextInput value={form.city} onChange={set("city")} /></Field>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Type">
            <select style={inputStyle} value={form.type} onChange={set("type")}><option>Public</option><option>Privé</option></select>
          </Field>
          <Field label="Niveau">
            <select style={inputStyle} value={form.level} onChange={set("level")}><option>Primaire</option><option>Collège</option><option>Lycée</option></select>
          </Field>
        </div>
        <Btn full icon={Save} onClick={save}>Enregistrer</Btn>
      </div>
    </Screen>
  );
}

/* Années scolaires — racine de l'onglet "Classes" */
function YearsScreen({ ctx }) {
  const [adding, setAdding] = useState(false);
  const [label, setLabel] = useState("");
  const addYear = () => {
    if (!label.trim()) return;
    ctx.setData((d) => ({ ...d, years: [...d.years, { id: uid("y"), label: label.trim(), classes: [] }] }));
    setLabel(""); setAdding(false);
  };
  return (
    <Screen>
      <TopBar title="Années scolaires" subtitle={ctx.data.establishment.name} />
      <div className="px-4 pt-4 space-y-2">
        {adding ? (
          <Card className="mb-3">
            <Field label="Année scolaire"><TextInput autoFocus value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Ex. 2026–2027" /></Field>
            <div className="flex gap-2"><Btn variant="ghost" full onClick={() => setAdding(false)}>Annuler</Btn><Btn full onClick={addYear}>Créer</Btn></div>
          </Card>
        ) : <PageAction icon={Plus} title="Ajouter une année" subtitle="Préparer une nouvelle période scolaire" onClick={() => setAdding(true)} />}
        <SectionLabel>Années disponibles</SectionLabel>
        {ctx.data.years.map((y) => (
          <Card key={y.id} onClick={() => ctx.nav.push("classes", { yearId: y.id })} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: COLORS.primarySoft }}><Calendar size={18} color={COLORS.primary} /></div>
            <div className="flex-1"><p className="font-bold text-[13.5px]" style={{ color: COLORS.text }}>{y.label}</p><p className="text-[11.5px]" style={{ color: COLORS.muted }}>{y.classes.filter((c) => !c.archived).length} classe(s)</p></div>
            <ChevronRight size={17} color={COLORS.muted} />
          </Card>
        ))}
        {ctx.data.years.length === 0 && <EmptyState icon={Calendar} title="Aucune année scolaire" text="Créez votre première année scolaire pour commencer à ajouter des classes." />}
      </div>
    </Screen>
  );
}

/* Élément réutilisable : sélection de matières depuis le catalogue de l'établissement */
function SubjectPicker({ catalog, preselected = [], excluded = [], onAddCustom, selected, onToggle }) {
  const [customInput, setCustomInput] = useState("");
  const available = catalog.filter((name) => !excluded.includes(name));
  const addCustom = () => {
    if (!customInput.trim()) return;
    onAddCustom(customInput.trim());
    setCustomInput("");
  };
  return (
    <div>
      <div className="rounded-2xl overflow-hidden mb-3" style={{ border: `1px solid ${COLORS.border}` }}>
        {available.map((name, i) => {
          const isSelected = selected.has(name);
          return (
            <button key={name} onClick={() => onToggle(name)} className="w-full flex items-center justify-between px-3.5 py-3"
              style={{ borderTop: i ? `1px solid ${COLORS.border}` : "none", background: isSelected ? COLORS.accentSoft : "#fff" }}>
              <span className="text-[13px]" style={{ color: COLORS.text }}>{name}</span>
              <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: isSelected ? COLORS.accent : "transparent", border: isSelected ? "none" : `1.5px solid ${COLORS.border}` }}>
                {isSelected && <Check size={13} color="#fff" />}
              </div>
            </button>
          );
        })}
        {available.length === 0 && <div className="px-3.5 py-4 text-center text-[12px]" style={{ color: COLORS.muted }}>Toutes les matières du catalogue sont déjà ajoutées.</div>}
      </div>
      <div className="flex gap-2">
        <TextInput value={customInput} onChange={(e) => setCustomInput(e.target.value)} placeholder="Ajouter une matière personnalisée" />
        <button onClick={addCustom} className="w-11 h-11 shrink-0 rounded-xl flex items-center justify-center" style={{ background: COLORS.primarySoft }}><Plus size={18} color={COLORS.primary} /></button>
      </div>
    </div>
  );
}

/* Classes d'une année scolaire — création en 2 étapes : infos puis matières */
function ClassesScreen({ ctx }) {
  const { yearId } = ctx.nav.current.params;
  const year = ctx.data.years.find((y) => y.id === yearId);
  const [addStep, setAddStep] = useState(0); // 0 = fermé, 1 = infos, 2 = matières
  const [form, setForm] = useState({ name: "", level: "Primaire", cardCount: "40" });
  const [selectedSubjects, setSelectedSubjects] = useState(new Set());

  if (!year) return null;

  const openAdd = () => { setForm({ name: "", level: "Primaire", cardCount: "40" }); setAddStep(1); };
  const goToSubjects = () => {
    if (!form.name.trim()) return;
    setSelectedSubjects(new Set(DEFAULT_SUBJECTS_BY_LEVEL[form.level] || []));
    setAddStep(2);
  };
  const toggleSubject = (name) => setSelectedSubjects((prev) => { const n = new Set(prev); n.has(name) ? n.delete(name) : n.add(name); return n; });
  const addCustomSubject = (name) => {
    ctx.setData((d) => (d.subjectCatalog.includes(name) ? d : { ...d, subjectCatalog: [...d.subjectCatalog, name] }));
    setSelectedSubjects((prev) => new Set(prev).add(name));
  };
  const createClass = () => {
    const selfId = ctx.data.establishment?.accountType === "independent" ? ctx.data.admin.selfTeacherId : null;
    const subjects = [...selectedSubjects].map((name) => ({ id: uid("s"), name, teacherId: selfId, archived: false, courses: [], questionnaires: [] }));
    const cardCount = Math.max(1, parseInt(form.cardCount, 10) || 40);
    const newClassId = uid("c");
    ctx.setData((d) => updateYear(d, year.id, (y) => ({ ...y, classes: [...y.classes, { id: newClassId, name: form.name.trim(), level: form.level, cardCount, students: [], subjects, archived: false }] })));
    setAddStep(0);
    ctx.showToast(`Classe « ${form.name.trim()} » créée`);
    ctx.nav.push("importStudents", { classId: newClassId, justCreated: true });
  };

  return (
    <Screen>
      <TopBar title="Classes" subtitle={year.label} onBack={() => ctx.nav.pop()} />
      <div className="px-4 pt-4 space-y-2">
        <PageAction icon={Plus} title="Créer une classe" subtitle="Ajouter le groupe, les matières et les élèves" onClick={openAdd} />
        <SectionLabel>Classes de {year.label}</SectionLabel>
        {year.classes.filter((c) => !c.archived).map((c) => (
          <Card key={c.id} onClick={() => ctx.nav.push("classDetails", { classId: c.id })}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: COLORS.primarySoft }}><GraduationCap size={18} color={COLORS.primary} /></div>
              <div className="flex-1"><p className="font-bold text-[13.5px]" style={{ color: COLORS.text }}>{c.name}</p><p className="text-[11.5px]" style={{ color: COLORS.muted }}>{c.level}</p></div>
              <ChevronRight size={17} color={COLORS.muted} />
            </div>
            <div className="flex gap-2 mt-3 flex-wrap">
              <Badge tone="primary" icon={Users}>{c.students.filter((s) => !s.archived).length} élèves</Badge>
              <Badge tone="neutral" icon={BookOpen}>{c.subjects.filter((s) => !s.archived).length} matières</Badge>
              <Badge tone="accent" icon={CreditCard}>{c.cardCount || 40} cartes réservées</Badge>
            </div>
          </Card>
        ))}
        {year.classes.filter((c) => !c.archived).length === 0 && <EmptyState icon={GraduationCap} title="Aucune classe" text="Créez votre première classe pour commencer." />}
      </div>

      {addStep > 0 && (
        <div className="absolute inset-0 z-40 flex flex-col" style={{ background: COLORS.bg }}>
          <TopBar title={addStep === 1 ? "Nouvelle classe" : "Choisir les matières"} subtitle={addStep === 2 ? form.name : undefined} onBack={() => setAddStep((s) => (s === 1 ? 0 : 1))} />
          <WizardProgress step={addStep - 1} totalSteps={2} labels={["Informations", "Matières"]} helperText={addStep === 1 ? "Définissez votre groupe d'élèves" : "Personnalisez le programme de la classe"} />
          <div className="px-4 pt-3 flex-1 overflow-y-auto">
            {addStep === 1 ? (
              <>
                <Field label="Nom de la classe"><TextInput autoFocus value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Ex. 5e année A" /></Field>
                <Field label="Cycle"><select style={inputStyle} value={form.level} onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))}><option>Primaire</option><option>Collège</option><option>Lycée</option></select></Field>
                <p className="text-[11px] -mt-2 mb-3" style={{ color: COLORS.muted }}>Sert uniquement à suggérer les matières courantes à l'étape suivante.</p>
                <Field label="Nombre de cartes à réserver">
                  <TextInput type="number" min="1" value={form.cardCount} onChange={(e) => setForm((f) => ({ ...f, cardCount: e.target.value }))} placeholder="Ex. 40" />
                </Field>
                <p className="text-[11px] -mt-2 mb-3" style={{ color: COLORS.muted }}>Les cartes-réponses existent déjà (jeu imprimé de l'établissement) — vous réservez ici combien seront utilisées pour cette classe. Chaque élève importé recevra automatiquement le prochain numéro disponible ; l'impression reste en dehors de l'application.</p>
                <Btn full icon={ArrowRight} disabled={!form.name.trim()} onClick={goToSubjects}>Continuer</Btn>
              </>
            ) : (
              <>
                <p className="text-[11.5px] mb-3" style={{ color: COLORS.muted }}>Suggestions pour le cycle « {form.level} », déjà cochées — ajustez librement.</p>
                <SubjectPicker catalog={ctx.data.subjectCatalog} selected={selectedSubjects} onToggle={toggleSubject} onAddCustom={addCustomSubject} excluded={[]} />
                <div className="h-4" />
                <Btn full variant="accent" icon={CheckCircle2} onClick={createClass}>Créer la classe ({selectedSubjects.size} matière{selectedSubjects.size > 1 ? "s" : ""})</Btn>
              </>
            )}
          </div>
        </div>
      )}
    </Screen>
  );
}

function ClassDetailsScreen({ ctx }) {
  const { classId } = ctx.nav.current.params;
  const loc = locateClass(ctx.data, classId);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(loc ? { name: loc.cls.name, level: loc.cls.level } : { name: "", level: "" });
  const [confirmArchive, setConfirmArchive] = useState(false);
  if (!loc) return null;
  const { cls } = loc;
  const activeStudents = cls.students.filter((s) => !s.archived).length;
  const canArchive = activeStudents === 0;

  const save = () => { ctx.setData((d) => updateClass(d, classId, (c) => ({ ...c, name: form.name, level: form.level }))); setEditing(false); };
  const archive = () => { ctx.setData((d) => updateClass(d, classId, (c) => ({ ...c, archived: true }))); ctx.showToast(`« ${cls.name} » archivée`); ctx.nav.pop(); };

  const items = [
    { key: "students", label: "Élèves", icon: Users, sub: `${activeStudents} inscrits, avec cartes`, go: () => ctx.nav.push("importStudents", { classId }) },
    { key: "subjects", label: "Matières", icon: BookOpen, sub: `${cls.subjects.filter((s) => !s.archived).length} matières`, go: () => ctx.nav.push("subjects", { classId }) },
  ];

  return (
    <Screen>
      <TopBar title={cls.name} subtitle={cls.level} onBack={() => ctx.nav.pop()} right={<button onClick={() => setEditing((v) => !v)} className="p-1"><Pencil size={16} color={COLORS.muted} /></button>} />
      <div className="px-4 pt-4">
        {editing && (
          <Card className="mb-3">
            <Field label="Nom"><TextInput value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></Field>
            <Field label="Niveau"><TextInput value={form.level} onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))} /></Field>
            <div className="flex gap-2"><Btn variant="ghost" full onClick={() => setEditing(false)}>Annuler</Btn><Btn full onClick={save}>Enregistrer</Btn></div>
          </Card>
        )}
        <div className="grid grid-cols-2 gap-3 mb-3">
          {items.map((it) => (
            <Card key={it.key} onClick={it.go} className="flex flex-col gap-2">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: COLORS.primarySoft }}><it.icon size={17} color={COLORS.primary} /></div>
              <p className="font-bold text-[13.5px]" style={{ color: COLORS.text }}>{it.label}</p>
              <p className="text-[11px]" style={{ color: COLORS.muted }}>{it.sub}</p>
            </Card>
          ))}
        </div>
        <Btn variant="ghost" full icon={Archive} disabled={!canArchive} onClick={() => setConfirmArchive(true)}>
          {canArchive ? "Archiver cette classe" : "Archiver impossible (élèves inscrits)"}
        </Btn>
      </div>
      <TypedConfirmModal open={confirmArchive} title="Archiver la classe ?" text="La classe et son historique seront masqués des listes actives. Pour confirmer, retapez son nom." confirmWord={cls.name} onCancel={() => setConfirmArchive(false)} onConfirm={archive} confirmLabel="Archiver" />
    </Screen>
  );
}

/* Import élèves (repris, inchangé fonctionnellement) */
const SAMPLE_IMPORT_ROWS = [
  { name: "Nadir Cherif", ok: true }, { name: "", ok: false, reason: "Nom manquant" },
  { name: "Yasmine Toure", ok: true }, { name: "Yasmine Toure", ok: false, reason: "Doublon détecté" },
  { name: "Omar Haddad", ok: true }, { name: "Chaimaa Rahal", ok: true },
  { name: "", ok: false, reason: "Ligne vide" }, { name: "Karim Belkacem", ok: true },
];

function ImportStudentsScreen({ ctx }) {
  const { classId } = ctx.nav.current.params;
  const [manualOpen, setManualOpen] = useState(false);
  const [manualName, setManualName] = useState("");
  const [staged, setStaged] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [confirmArchiveId, setConfirmArchiveId] = useState(null);
  const [actionsFor, setActionsFor] = useState(null);
  const [editingCardId, setEditingCardId] = useState(null);
  const [editCardValue, setEditCardValue] = useState("");
  const [dupWarning, setDupWarning] = useState(false);
  const loc = locateClass(ctx.data, classId);
  if (!loc) return null;
  const active = loc.cls.students.filter((s) => !s.archived);

  const runSimulatedImport = () => setStaged(SAMPLE_IMPORT_ROWS.map((r, i) => ({ ...r, id: uid("imp"), rowNumber: i + 1 })));
  const addManual = () => {
    if (!manualName.trim()) return;
    setStaged((s) => [...s, { id: uid("imp"), name: manualName.trim(), ok: true, rowNumber: s.length + 1, manual: true }]);
    setManualName(""); setManualOpen(false);
  };

  const startEdit = (s) => { setActionsFor(null); setEditingId(s.id); setEditName(s.name); };
  const saveEdit = () => {
    ctx.setData((d) => updateClass(d, classId, (c) => ({ ...c, students: c.students.map((s) => (s.id === editingId ? { ...s, name: editName.trim() || s.name } : s)) })));
    setEditingId(null);
    ctx.showToast("Nom modifié");
  };
  const archiveStudent = (id) => {
    ctx.setData((d) => updateClass(d, classId, (c) => ({ ...c, students: c.students.map((s) => (s.id === id ? { ...s, archived: true } : s)) })));
    setConfirmArchiveId(null);
    ctx.showToast("Élève retiré", { actionLabel: "Annuler", onAction: () => ctx.setData((d) => updateClass(d, classId, (c) => ({ ...c, students: c.students.map((s) => (s.id === id ? { ...s, archived: false } : s)) }))) });
  };

  const startEditCard = (s) => { setActionsFor(null); setEditingCardId(s.id); setEditCardValue(s.cardNumber || ""); setDupWarning(false); };
  const saveEditCard = () => {
    const value = editCardValue.trim();
    if (!value) return;
    const isDuplicate = active.some((s) => s.id !== editingCardId && s.cardNumber === value);
    if (isDuplicate) { setDupWarning(true); return; }
    ctx.setData((d) => updateClass(d, classId, (c) => ({ ...c, students: c.students.map((s) => (s.id === editingCardId ? { ...s, cardNumber: value, cardAssigned: true } : s)) })));
    setEditingCardId(null); setDupWarning(false);
    ctx.showToast("Carte mise à jour");
  };

  const actionsStudent = actionsFor ? active.find((s) => s.id === actionsFor) : null;

  return (
    <Screen>
      <TopBar title="Élèves" subtitle={loc.cls.name} onBack={() => ctx.nav.pop()} />
      <div className="px-4 pt-4 space-y-3">
        {ctx.nav.current.params.justCreated && (
          <Card className="flex items-center gap-2" style={{ background: COLORS.successSoft, border: "none" }}>
            <CheckCircle2 size={17} color={COLORS.success} />
            <p className="text-[12px] font-semibold" style={{ color: COLORS.success }}>Classe créée. Importez maintenant la liste des élèves.</p>
          </Card>
        )}
        <Card className="flex items-start gap-3">
          <CreditCard size={20} color={COLORS.accent} className="mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-[13px]" style={{ color: COLORS.text }}>{loc.cls.cardCount || 40} cartes-réponses réservées pour cette classe</p>
            <p className="text-[11.5px]" style={{ color: COLORS.muted }}>{active.filter((s) => s.cardAssigned).length} déjà attribuées à un élève. Les cartes existent déjà (jeu imprimé et réutilisable de l'établissement) — vous attribuez simplement un numéro à chaque élève ici. L'impression se fait séparément, en dehors de l'application.</p>
          </div>
        </Card>
        <Card className="flex items-start gap-3">
          <FileSpreadsheet size={20} color={COLORS.primary} className="mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-[13px]" style={{ color: COLORS.text }}>Fichier CSV ou Excel</p>
            <p className="text-[11.5px] mb-3" style={{ color: COLORS.muted }}>Importer une nouvelle liste d'élèves — les cartes sont attribuées automatiquement.</p>
            <Btn variant="secondary" size="sm" icon={Upload} onClick={runSimulatedImport}>Choisir un fichier</Btn>
          </div>
        </Card>
        {manualOpen ? (
          <Card>
            <Field label="Nom complet de l'élève"><TextInput autoFocus value={manualName} onChange={(e) => setManualName(e.target.value)} placeholder="Ex. Karim Belkacem" /></Field>
            <div className="flex gap-2"><Btn variant="ghost" full onClick={() => setManualOpen(false)}>Annuler</Btn><Btn full onClick={addManual}>Ajouter</Btn></div>
          </Card>
        ) : <Btn variant="ghost" full icon={Plus} onClick={() => setManualOpen(true)}>Ajouter un élève manuellement</Btn>}
        {staged.length > 0 && (
          <Btn full icon={ArrowRight} onClick={() => ctx.nav.push("importPreview", { classId, staged })}>Vérifier la liste importée ({staged.length})</Btn>
        )}

        <p className="font-bold text-[13px] pt-2" style={{ color: COLORS.text }}>Liste actuelle ({active.length})</p>
        <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${COLORS.border}` }}>
          <div className="max-h-[420px] overflow-y-auto">
            {active.map((s, i) => (
              <div key={s.id} className="px-3 py-2.5" style={{ borderTop: i ? `1px solid ${COLORS.border}` : "none", background: i % 2 ? "#FBFCFD" : "#fff" }}>
                {editingId === s.id ? (
                  <div className="flex items-center gap-2">
                    <TextInput autoFocus value={editName} onChange={(e) => setEditName(e.target.value)} />
                    <button onClick={saveEdit} className="p-2"><Check size={16} color={COLORS.success} /></button>
                    <button onClick={() => setEditingId(null)} className="p-2"><X size={16} color={COLORS.muted} /></button>
                  </div>
                ) : (
                  <button onClick={() => setActionsFor(s.id)} className="w-full flex items-center justify-between">
                    <span className="text-[12.5px] font-medium truncate" style={{ color: COLORS.text }}>{s.name}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {s.cardAssigned ? <Badge tone="primary">#{s.cardNumber}</Badge> : <Badge tone="warning">Sans carte</Badge>}
                      <Pencil size={13} color={COLORS.muted} />
                    </div>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {actionsStudent && (
        <div className="absolute inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(15,23,33,0.45)" }} onClick={() => setActionsFor(null)}>
          <div className="w-full rounded-t-2xl p-5" style={{ background: COLORS.surface }} onClick={(e) => e.stopPropagation()}>
            <p className="font-bold text-[14px] mb-3" style={{ color: COLORS.text }}>{actionsStudent.name}</p>
            <button onClick={() => startEdit(actionsStudent)} className="w-full text-left py-3 text-[13.5px] font-medium" style={{ color: COLORS.text }}>Modifier le nom</button>
            <button onClick={() => startEditCard(actionsStudent)} className="w-full text-left py-3 text-[13.5px] font-medium" style={{ color: COLORS.text }}>Modifier le numéro de carte</button>
            <button onClick={() => { setConfirmArchiveId(actionsStudent.id); setActionsFor(null); }} className="w-full text-left py-3 text-[13.5px] font-medium" style={{ color: COLORS.danger }}>Retirer l'élève</button>
            <Btn variant="ghost" full onClick={() => setActionsFor(null)}>Annuler</Btn>
          </div>
        </div>
      )}

      {editingCardId && (
        <div className="absolute inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(15,23,33,0.45)" }}>
          <div className="w-full rounded-t-2xl p-5" style={{ background: COLORS.surface }}>
            <p className="font-bold text-[15px] mb-3" style={{ color: COLORS.text }}>Modifier le numéro de carte</p>
            <TextInput autoFocus value={editCardValue} onChange={(e) => { setEditCardValue(e.target.value); setDupWarning(false); }} placeholder="Ex. 042" />
            {dupWarning && <p className="text-[11.5px] mt-2 font-semibold" style={{ color: COLORS.danger }}>Ce numéro est déjà utilisé par un autre élève de la classe.</p>}
            <div className="flex gap-2 mt-4">
              <Btn variant="ghost" full onClick={() => { setEditingCardId(null); setDupWarning(false); }}>Annuler</Btn>
              <Btn full onClick={saveEditCard}>Enregistrer</Btn>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal open={!!confirmArchiveId} title="Retirer cet élève ?" text="L'élève sera retiré de la classe. Son historique de réponses passées reste conservé." onCancel={() => setConfirmArchiveId(null)} onConfirm={() => archiveStudent(confirmArchiveId)} confirmLabel="Retirer" danger />
    </Screen>
  );
}

function ImportPreviewScreen({ ctx }) {
  const { classId, staged } = ctx.nav.current.params;
  const loc = locateClass(ctx.data, classId);
  const [confirmed, setConfirmed] = useState(false);
  if (!loc) return null;
  const valid = staged.filter((r) => r.ok && r.name.trim());
  const invalid = staged.filter((r) => !r.ok || !r.name.trim());

  const confirmImport = () => {
    ctx.setData((d) => updateClass(d, classId, (c) => {
      const used = c.students.filter((s) => s.cardAssigned && s.cardNumber).map((s) => parseInt(s.cardNumber, 10));
      let next = used.length ? Math.max(...used) + 1 : 1;
      const newStudents = valid.map((r, i) => ({
        id: uid("st"), name: r.name.trim(), studentCode: `EL${String(c.students.length + i + 1).padStart(3, "0")}`,
        cardNumber: String(next++).padStart(3, "0"), cardAssigned: true, archived: false,
      }));
      return { ...c, students: [...c.students, ...newStudents] };
    }));
    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <Screen>
        <TopBar title="Importation confirmée" onBack={() => ctx.nav.pop()} />
        <div className="px-4 pt-10">
          <EmptyState icon={CheckCircle2} title={`${valid.length} élève(s) importé(s)`} text="Une carte-réponse unique a été attribuée automatiquement à chacun."
            action={<Btn icon={CreditCard} onClick={() => ctx.nav.resetTo("importStudents", { classId })}>Voir les élèves et leurs cartes</Btn>} />
        </div>
      </Screen>
    );
  }
  return (
    <Screen>
      <TopBar title="Vérifier la liste" subtitle={loc.cls.name} onBack={() => ctx.nav.pop()} />
      <div className="px-4 pt-4">
        <div className="flex gap-2 mb-3"><Badge tone="success" icon={CheckCircle2}>{valid.length} valides</Badge><Badge tone="danger" icon={AlertTriangle}>{invalid.length} à corriger</Badge></div>
        <div className="space-y-1.5">
          {staged.map((r) => (
            <Card key={r.id} className="flex items-center justify-between !py-2.5" style={{ background: r.ok && r.name.trim() ? COLORS.surface : COLORS.dangerSoft, borderColor: r.ok && r.name.trim() ? COLORS.border : "#F0C6C1" }}>
              <div className="flex items-center gap-2">
                {r.ok && r.name.trim() ? <CheckCircle2 size={16} color={COLORS.success} /> : <XCircle size={16} color={COLORS.danger} />}
                <span className="text-[13px] font-medium" style={{ color: COLORS.text }}>{r.name.trim() || "(ligne vide)"}</span>
              </div>
              {!r.ok || !r.name.trim() ? <span className="text-[11px] font-semibold" style={{ color: COLORS.danger }}>{r.reason || "Nom manquant"}</span> : <span className="text-[11px]" style={{ color: COLORS.muted }}>Ligne {r.rowNumber}</span>}
            </Card>
          ))}
        </div>
        <div className="mt-4"><Btn full icon={Check} onClick={confirmImport} disabled={valid.length === 0}>Confirmer l'importation ({valid.length}) — cartes attribuées automatiquement</Btn></div>
      </div>
    </Screen>
  );
}

function SubjectsScreen({ ctx }) {
  const { classId } = ctx.nav.current.params;
  const loc = locateClass(ctx.data, classId);
  const [adding, setAdding] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState(new Set());
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  if (!loc) return null;
  const { cls } = loc;
  const existingNames = cls.subjects.filter((s) => !s.archived).map((s) => s.name);

  const toggleSubject = (name) => setSelectedSubjects((prev) => { const n = new Set(prev); n.has(name) ? n.delete(name) : n.add(name); return n; });
  const addCustomToCatalog = (name) => {
    ctx.setData((d) => (d.subjectCatalog.includes(name) ? d : { ...d, subjectCatalog: [...d.subjectCatalog, name] }));
    setSelectedSubjects((prev) => new Set(prev).add(name));
  };
  const confirmAdd = () => {
    const selfId = ctx.data.establishment?.accountType === "independent" ? ctx.data.admin.selfTeacherId : null;
    const newSubjects = [...selectedSubjects].map((name) => ({ id: uid("s"), name, teacherId: selfId, archived: false, courses: [], questionnaires: [] }));
    ctx.setData((d) => updateClass(d, classId, (c) => ({ ...c, subjects: [...c.subjects, ...newSubjects] })));
    ctx.showToast(newSubjects.length > 1 ? `${newSubjects.length} matières ajoutées` : "Matière ajoutée");
    setSelectedSubjects(new Set()); setAdding(false);
  };
  const deleteSubject = (id) => { ctx.setData((d) => updateClass(d, classId, (c) => ({ ...c, subjects: c.subjects.filter((s) => s.id !== id) }))); setConfirmDeleteId(null); ctx.showToast("Matière supprimée"); };

  return (
    <Screen>
      <TopBar title="Matières" subtitle={cls.name} onBack={() => ctx.nav.pop()} />
      <div className="px-4 pt-4 space-y-2">
        {adding ? (
          <Card className="mb-3">
            <p className="text-[11.5px] mb-2" style={{ color: COLORS.muted }}>Cochez les matières à ajouter à cette classe.</p>
            <SubjectPicker catalog={ctx.data.subjectCatalog} selected={selectedSubjects} onToggle={toggleSubject} onAddCustom={addCustomToCatalog} excluded={existingNames} />
            <div className="flex gap-2 mt-3">
              <Btn variant="ghost" full onClick={() => { setAdding(false); setSelectedSubjects(new Set()); }}>Annuler</Btn>
              <Btn full disabled={selectedSubjects.size === 0} onClick={confirmAdd}>Ajouter ({selectedSubjects.size})</Btn>
            </div>
          </Card>
        ) : <PageAction icon={Plus} title="Ajouter une matière" subtitle="Compléter le programme de cette classe" onClick={() => setAdding(true)} />}
        <SectionLabel>Matières de la classe</SectionLabel>
        {cls.subjects.filter((s) => !s.archived).map((s) => {
          const teacher = s.teacherId ? findTeacher(ctx.data, s.teacherId) : null;
          const canDelete = s.questionnaires.length === 0;
          return (
            <Card key={s.id}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: COLORS.primarySoft }}><BookOpen size={18} color={COLORS.primary} /></div>
                <div className="flex-1"><p className="font-bold text-[13.5px]" style={{ color: COLORS.text }}>{s.name}</p><p className="text-[11.5px]" style={{ color: COLORS.muted }}>{s.questionnaires.length} questionnaire(s)</p></div>
                <button onClick={() => setConfirmDeleteId(s.id)} disabled={!canDelete} className="p-1.5" style={{ opacity: canDelete ? 1 : 0.3 }}><Trash2 size={15} color={COLORS.danger} /></button>
              </div>
              <div className="flex items-center justify-between mt-2">
                {teacher ? <Badge tone="accent" icon={User}>{teacher.name}</Badge> : <Badge tone="warning" icon={AlertTriangle}>Non assigné</Badge>}
                <button onClick={() => ctx.nav.push("assignTeacher", { classId, subjectId: s.id })} className="text-[11.5px] font-semibold" style={{ color: COLORS.primary }}>{teacher ? "Réassigner" : "Assigner"}</button>
              </div>
            </Card>
          );
        })}
      </div>
      <ConfirmModal open={!!confirmDeleteId} title="Supprimer cette matière ?" text="Cette action est définitive. Possible uniquement si aucun questionnaire n'y est rattaché." onCancel={() => setConfirmDeleteId(null)} onConfirm={() => deleteSubject(confirmDeleteId)} confirmLabel="Supprimer" danger />
    </Screen>
  );
}

/* Enseignants (Admin) */
function TeachersListScreen({ ctx }) {
  const [resendId, setResendId] = useState(null);
  const [search, setSearch] = useState("");
  const resend = (teacherId) => {
    const pwd = generateTempPassword();
    ctx.setData((d) => ({ ...d, teachers: d.teachers.map((t) => (t.id === teacherId ? { ...t, password: pwd, mustChangePassword: true } : t)) }));
    ctx.nav.push("shareCredentials", { teacherId, mode: "resend" });
  };
  const toggleActive = (teacherId) => {
    const teacher = findTeacher(ctx.data, teacherId);
    const willBeActive = !teacher.active;
    ctx.setData((d) => ({ ...d, teachers: d.teachers.map((t) => (t.id === teacherId ? { ...t, active: willBeActive } : t)) }));
    if (willBeActive) ctx.showToast(`${teacher.name} réactivé`);
    else ctx.showToast(`${teacher.name} désactivé`, { actionLabel: "Annuler", onAction: () => ctx.setData((d) => ({ ...d, teachers: d.teachers.map((t) => (t.id === teacherId ? { ...t, active: true } : t)) })) });
  };
  const filteredTeachers = ctx.data.teachers.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <Screen>
      <TopBar title="Enseignants" subtitle={ctx.data.establishment.name} />
      <div className="px-4 pt-4 space-y-2">
        <PageAction icon={UserPlus} title="Nouvel enseignant" subtitle="Créer son accès et l'affecter à une classe" onClick={() => ctx.nav.push("createTeacher")} />
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl mb-1" style={{ background: "#F2F4F7" }}>
          <Search size={15} color={COLORS.muted} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un enseignant" className="flex-1 bg-transparent outline-none text-[13px]" />
        </div>
        {filteredTeachers.length === 0 && <div className="py-8 text-center text-[12.5px]" style={{ color: COLORS.muted }}>Aucun enseignant ne correspond.</div>}
        {filteredTeachers.map((t) => {
          const assignments = getTeacherAssignments(ctx.data, t.id);
          const byClass = [];
          assignments.forEach(({ cls, subject }) => {
            let entry = byClass.find((e) => e.classId === cls.id);
            if (!entry) { entry = { classId: cls.id, className: cls.name, subjectNames: [] }; byClass.push(entry); }
            entry.subjectNames.push(subject.name);
          });
          return (
            <Card key={t.id} style={{ opacity: t.active ? 1 : 0.55 }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: COLORS.primarySoft }}><User size={18} color={COLORS.primary} /></div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[13.5px] truncate" style={{ color: COLORS.text }}>{t.name}</p>
                  <p className="text-[11.5px] truncate" style={{ color: COLORS.muted }}>{t.email || t.phone || t.username}{t.city || t.country ? ` · ${[t.city, t.country].filter(Boolean).join(", ")}` : ""}</p>
                </div>
                <Badge tone={t.active ? "success" : "neutral"}>{t.active ? "Actif" : "Désactivé"}</Badge>
              </div>
              {byClass.length > 0 ? (
                <div className="mb-2 space-y-1">
                  {byClass.map((e) => (
                    <div key={e.classId} className="flex items-start gap-1.5 text-[11.5px]" style={{ color: COLORS.text }}>
                      <GraduationCap size={13} color={COLORS.primary} className="mt-0.5 shrink-0" />
                      <span><b>{e.className}</b> — {e.subjectNames.join(", ")}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11.5px] mb-2" style={{ color: COLORS.warning }}>Aucune classe assignée pour l'instant.</p>
              )}
              <div className="flex gap-2">
                <Btn variant="secondary" size="sm" icon={Share2} onClick={() => resend(t.id)}>Renvoyer les identifiants</Btn>
                <Btn variant="accent" size="sm" icon={BookOpen} onClick={() => ctx.nav.push("assignClassesToTeacher", { teacherId: t.id })}>Assigner des matières</Btn>
              </div>
              <div className="mt-2">
                <Btn variant="ghost" size="sm" full onClick={() => toggleActive(t.id)}>{t.active ? "Désactiver" : "Réactiver"}</Btn>
              </div>
            </Card>
          );
        })}
      </div>
    </Screen>
  );
}

function CreateTeacherScreen({ ctx }) {
  const [name, setName] = useState("");
  const [nationality, setNationality] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const hasContact = email.trim() || phone.trim();
  const canSubmit = name.trim().length > 1 && hasContact;

  const submit = () => {
    if (!canSubmit) return;
    const username = generateUsername(name, ctx.data.teachers.map((t) => t.username));
    const password = generateTempPassword();
    const newId = uid("t");
    ctx.setData((d) => ({ ...d, teachers: [...d.teachers, { id: newId, name: name.trim(), nationality: nationality.trim(), country: country.trim(), city: city.trim(), birthDate, gender, email: email.trim(), phone: phone.trim(), username, password, mustChangePassword: true, active: true, createdAt: Date.now(), lastLoginAt: null }] }));
    ctx.showToast("Compte enseignant créé");
    ctx.nav.push("shareCredentials", { teacherId: newId, mode: "create" });
  };

  return (
    <Screen>
      <TopBar title="Nouvel enseignant" onBack={() => ctx.nav.pop()} />
      <div className="px-4 pt-4">
        <p className="text-[12px] font-bold mb-2" style={{ color: COLORS.primary }}>Identité</p>
        <Field label="Nom complet"><TextInput autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex. Chaïma Rahal" /></Field>
        <Field label="Nationalité (facultatif)"><TextInput value={nationality} onChange={(e) => setNationality(e.target.value)} placeholder="Ex. Algérienne" /></Field>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Date de naissance"><TextInput type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} /></Field>
          <Field label="Genre">
            <select style={inputStyle} value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Non précisé</option>
              <option value="F">Femme</option>
              <option value="M">Homme</option>
            </select>
          </Field>
        </div>

        <p className="text-[12px] font-bold mb-2 mt-2" style={{ color: COLORS.primary }}>Localisation</p>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Pays de résidence"><TextInput value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Ex. Algérie" /></Field>
          <Field label="Ville"><TextInput value={city} onChange={(e) => setCity(e.target.value)} placeholder="Ex. Alger" /></Field>
        </div>

        <p className="text-[12px] font-bold mb-2 mt-2" style={{ color: COLORS.primary }}>Contact</p>
        <Field label="Email (facultatif si téléphone renseigné)"><TextInput value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Ex. chaima.rahal@ecole.dz" autoCapitalize="none" /></Field>
        <Field label="Téléphone (facultatif si email renseigné)"><TextInput value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Ex. +213 555 111 222" /></Field>
        {!hasContact && <p className="text-[11px] -mt-2 mb-3 font-semibold" style={{ color: COLORS.warning }}>Obligatoire : au moins l'un des deux, pour lui envoyer ses identifiants.</p>}

        <Btn full icon={UserPlus} disabled={!canSubmit} onClick={submit}>Créer le compte</Btn>
      </div>
    </Screen>
  );
}

function ShareCredentialsScreen({ ctx }) {
  const { teacherId, mode } = ctx.nav.current.params;
  const teacher = findTeacher(ctx.data, teacherId);
  const [copied, setCopied] = useState(false);
  if (!teacher) return null;

  const message = `Bonjour ${teacher.name}, voici vos identifiants KAGAT :\nIdentifiant : ${teacher.username}\nMot de passe : ${teacher.password}\n(à changer à la première connexion)`;

  const copy = async () => {
    try { await navigator.clipboard.writeText(message); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch (e) { /* copie manuelle possible depuis le champ ci-dessous */ }
  };
  const sendByEmail = () => {
    const subject = encodeURIComponent("Vos identifiants KAGAT");
    window.location.href = `mailto:${teacher.email}?subject=${subject}&body=${encodeURIComponent(message)}`;
  };
  const sendByWhatsapp = () => {
    const digits = teacher.phone.replace(/[^\d+]/g, "");
    window.open(`https://wa.me/${digits.replace("+", "")}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <Screen>
      <TopBar title={mode === "create" ? "Compte créé" : "Identifiants renvoyés"} onBack={() => ctx.nav.resetTo("teachersList")} />
      <div className="px-4 pt-4">
        <Card className="mb-3" style={{ background: COLORS.successSoft, border: "none" }}>
          <p className="text-[12.5px] font-semibold" style={{ color: COLORS.success }}>{mode === "create" ? "Le compte a été créé." : "Un nouveau mot de passe a été généré."} Envoyez-le à {teacher.name}.</p>
        </Card>
        <Card className="mb-3">
          <TextArea readOnly rows={5} value={message} style={{ background: "#F7F8FA" }} />
        </Card>
        <div className="space-y-2 mb-2">
          {teacher.email && <Btn full icon={Send} onClick={sendByEmail}>Envoyer par email</Btn>}
          {teacher.phone && <Btn full variant={teacher.email ? "secondary" : "primary"} icon={Phone} onClick={sendByWhatsapp}>Envoyer par WhatsApp</Btn>}
          <Btn variant="ghost" full icon={Copy} onClick={copy}>{copied ? "Copié !" : "Copier le message"}</Btn>
        </div>
        <div className="mt-2"><Btn full onClick={() => ctx.nav.resetTo("teachersList")}>Voir la liste des enseignants</Btn></div>
      </div>
    </Screen>
  );
}

/* Affectation d'un enseignant à une ou plusieurs classes, chacune avec plusieurs matières, en boucle */
function AssignClassesToTeacherScreen({ ctx }) {
  const { teacherId } = ctx.nav.current.params;
  const teacher = findTeacher(ctx.data, teacherId);
  const allClasses = ctx.data.years.flatMap((y) => y.classes).filter((c) => !c.archived);

  const [phase, setPhase] = useState("pickClass"); // pickClass | pickSubjects | askMore
  const [currentClassId, setCurrentClassId] = useState("");
  const [selectedSubjectIds, setSelectedSubjectIds] = useState(new Set());
  const [doneRounds, setDoneRounds] = useState([]); // [{className, subjectNames:[]}]

  const currentClass = allClasses.find((c) => c.id === currentClassId);

  const pickClass = (classId) => {
    setCurrentClassId(classId);
    const cls = allClasses.find((c) => c.id === classId);
    const already = new Set(cls.subjects.filter((s) => s.teacherId === teacherId).map((s) => s.id));
    setSelectedSubjectIds(already);
    setPhase("pickSubjects");
  };
  const toggleSubject = (id) => setSelectedSubjectIds((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const confirmSubjects = () => {
    ctx.setData((d) => updateClass(d, currentClassId, (c) => ({
      ...c,
      subjects: c.subjects.map((s) => {
        if (selectedSubjectIds.has(s.id)) return { ...s, teacherId };
        if (s.teacherId === teacherId) return { ...s, teacherId: null };
        return s;
      }),
    })));
    setDoneRounds((r) => [...r, { className: currentClass.name, subjectNames: currentClass.subjects.filter((s) => selectedSubjectIds.has(s.id)).map((s) => s.name) }]);
    setPhase("askMore");
    ctx.showToast(`${teacher.name.split(" ")[0]} assigné à ${currentClass.name}`);
  };

  const anotherClass = () => { setCurrentClassId(""); setSelectedSubjectIds(new Set()); setPhase("pickClass"); };
  const finish = () => ctx.nav.pop();

  let title = "Choisir la classe", body = null;
  if (phase === "pickClass") {
    body = <div className="px-4">
      {allClasses.map((c) => <OptionCard key={c.id} icon={GraduationCap} title={c.name} subtitle={c.level} selected={currentClassId === c.id} onClick={() => pickClass(c.id)} />)}
    </div>;
  } else if (phase === "pickSubjects") {
    title = "Choisir les matières";
    body = <div className="px-4">
      <p className="text-[11.5px] mb-3" style={{ color: COLORS.muted }}>Cochez toutes les matières que {teacher.name.split(" ")[0]} enseigne dans « {currentClass.name} ».</p>
      <div className="rounded-2xl overflow-hidden mb-4" style={{ border: `1px solid ${COLORS.border}` }}>
        {currentClass.subjects.filter((s) => !s.archived).map((s, i) => {
          const isSelected = selectedSubjectIds.has(s.id);
          const otherTeacher = s.teacherId && s.teacherId !== teacherId ? findTeacher(ctx.data, s.teacherId) : null;
          return (
            <button key={s.id} onClick={() => toggleSubject(s.id)} className="w-full flex items-center justify-between px-3.5 py-3"
              style={{ borderTop: i ? `1px solid ${COLORS.border}` : "none", background: isSelected ? COLORS.accentSoft : "#fff" }}>
              <div className="text-left">
                <p className="text-[13px]" style={{ color: COLORS.text }}>{s.name}</p>
                {otherTeacher && <p className="text-[10.5px]" style={{ color: COLORS.warning }}>Actuellement : {otherTeacher.name}</p>}
              </div>
              <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0" style={{ background: isSelected ? COLORS.accent : "transparent", border: isSelected ? "none" : `1.5px solid ${COLORS.border}` }}>
                {isSelected && <Check size={13} color="#fff" />}
              </div>
            </button>
          );
        })}
        {currentClass.subjects.filter((s) => !s.archived).length === 0 && <div className="px-3.5 py-4 text-center text-[12px]" style={{ color: COLORS.muted }}>Cette classe n'a aucune matière pour l'instant.</div>}
      </div>
      <Btn full variant="accent" icon={CheckCircle2} disabled={selectedSubjectIds.size === 0} onClick={confirmSubjects}>Confirmer ({selectedSubjectIds.size} matière{selectedSubjectIds.size > 1 ? "s" : ""})</Btn>
    </div>;
  } else if (phase === "askMore") {
    title = "Classe ajoutée";
    body = <div className="px-4">
      <Card className="mb-4" style={{ background: COLORS.successSoft, border: "none" }}>
        <p className="text-[12.5px] font-semibold" style={{ color: COLORS.success }}>{teacher.name} enseigne maintenant dans {doneRounds.length} classe{doneRounds.length > 1 ? "s" : ""} :</p>
        {doneRounds.map((r, i) => <p key={i} className="text-[11.5px] mt-1" style={{ color: COLORS.success }}>· {r.className} — {r.subjectNames.join(", ")}</p>)}
      </Card>
      <p className="text-[13px] font-semibold mb-3" style={{ color: COLORS.text }}>Assigner {teacher.name.split(" ")[0]} à une autre classe ?</p>
      <div className="flex gap-2">
        <Btn variant="ghost" full onClick={finish}>Terminer</Btn>
        <Btn full icon={Plus} onClick={anotherClass}>Oui, une autre classe</Btn>
      </div>
    </div>;
  }

  const goBack = () => { if (phase === "pickClass") { ctx.nav.pop(); return; } if (phase === "pickSubjects") { setPhase("pickClass"); return; } finish(); };

  return (
    <Screen>
      <TopBar title={title} subtitle={`${teacher.name} · ${teacher.username}`} onBack={goBack} />
      <div className="pt-2">{body}</div>
    </Screen>
  );
}

function AssignTeacherScreen({ ctx }) {
  const preset = ctx.nav.current.params || {};
  const [classId, setClassId] = useState(preset.classId || "");
  const [subjectId, setSubjectId] = useState(preset.subjectId || "");
  const needed = [];
  if (!preset.classId) needed.push("class");
  if (!preset.subjectId) needed.push("subject");
  if (!preset.teacherId) needed.push("teacher");
  const [stepIndex, setStepIndex] = useState(0);
  const currentType = needed[stepIndex];

  const allClasses = ctx.data.years.flatMap((y) => y.classes).filter((c) => !c.archived);
  const cls = allClasses.find((c) => c.id === classId);
  const subject = cls?.subjects.find((s) => s.id === subjectId);
  const activeTeachers = ctx.data.teachers.filter((t) => t.active);
  const presetTeacher = preset.teacherId ? findTeacher(ctx.data, preset.teacherId) : null;

  const finalize = (finalClassId, finalSubjectId, finalTeacherId) => {
    ctx.setData((d) => updateClass(d, finalClassId, (c) => ({ ...c, subjects: c.subjects.map((s) => (s.id === finalSubjectId ? { ...s, teacherId: finalTeacherId } : s)) })));
    ctx.nav.pop();
  };
  const choose = (type, value) => {
    let nc = classId, ns = subjectId, nt = preset.teacherId || "";
    if (type === "class") { nc = value; setClassId(value); setSubjectId(""); }
    if (type === "subject") { ns = value; setSubjectId(value); }
    if (type === "teacher") nt = value;
    if (stepIndex + 1 < needed.length) setStepIndex((s) => s + 1);
    else finalize(nc, ns, nt);
  };

  let title = "Assigner un enseignant", body = null;
  if (currentType === "class") {
    title = "Choisir la classe";
    body = <div className="px-4">{allClasses.map((c) => <OptionCard key={c.id} icon={GraduationCap} title={c.name} subtitle={c.level} selected={classId === c.id} onClick={() => choose("class", c.id)} />)}</div>;
  } else if (currentType === "subject") {
    title = "Choisir la matière";
    body = <div className="px-4">{cls?.subjects.filter((s) => !s.archived).map((s) => <OptionCard key={s.id} icon={BookOpen} title={s.name} subtitle={s.teacherId ? `Actuellement : ${findTeacher(ctx.data, s.teacherId)?.name}` : "Non assigné"} selected={subjectId === s.id} onClick={() => choose("subject", s.id)} />)}</div>;
  } else if (currentType === "teacher") {
    title = presetTeacher ? `Affecter ${presetTeacher.name.split(" ")[0]}` : "Choisir l'enseignant";
    body = <div className="px-4">{activeTeachers.map((t) => <OptionCard key={t.id} icon={User} title={t.name} subtitle={t.username} onClick={() => choose("teacher", t.id)} />)}</div>;
  } else {
    // tout était déjà pré-rempli (cas limite) : on finalise directement
    finalize(classId, subjectId, preset.teacherId);
    body = null;
  }

  const goBack = () => { if (stepIndex === 0) { ctx.nav.pop(); return; } setStepIndex((s) => s - 1); };

  return (
    <Screen>
      <TopBar title={title} subtitle={[cls?.name, subject?.name, presetTeacher?.name].filter(Boolean).join(" · ") || undefined} onBack={goBack} />
      <WizardProgress step={stepIndex} totalSteps={Math.max(needed.length, 1)} labels={needed.map((x) => ({ class: "Choisir la classe", subject: "Choisir la matière", teacher: "Choisir l'enseignant" }[x]))} helperText="Une sélection guidée, sans saisie inutile" />
      <div className="pt-2">{body}</div>
    </Screen>
  );
}

/* ============================ ESPACE ENSEIGNANT ============================ */

function TeacherDashboardScreen({ ctx }) {
  const teacher = findTeacher(ctx.data, ctx.currentUser.id);
  const assignments = getTeacherAssignments(ctx.data, teacher.id);
  const alert = getSyncAlertLevel(ctx.data);
  const byClass = [];
  assignments.forEach(({ cls, subject }) => {
    let entry = byClass.find((e) => e.classId === cls.id);
    if (!entry) { entry = { classId: cls.id, className: cls.name, level: cls.level, subjects: [] }; byClass.push(entry); }
    entry.subjects.push(subject);
  });

  return (
    <Screen>
      <TopBar title={`Bienvenue, ${teacher.name.split(" ")[0]}`} subtitle={`${ctx.data.establishment.name} · KAGAT`} right={<SyncIndicator ctx={ctx} />} />
      <div className="px-4 pt-3 space-y-4">
        <div className="dashboard-hero teacher-hero">
          <div className="dashboard-hero-icon"><ScanLine size={24} /></div>
          <div className="flex-1"><Badge tone="success">Prêt pour la classe</Badge><p>Lancez une évaluation en quelques secondes.</p></div>
          <button onClick={() => ctx.nav.push("evalPrep", {})} className="hero-play" aria-label="Nouvelle évaluation"><PlayCircle size={21}/></button>
        </div>
        <OnboardingTip ctx={ctx} text="Touchez une matière pour créer un questionnaire, puis lancez une évaluation et scannez les cartes de vos élèves." />

        {alert.level !== "ok" && (
          <Card onClick={() => ctx.nav.push("sync")} className="flex items-center gap-2" style={{ background: alert.level === "critical" ? COLORS.dangerSoft : COLORS.warningSoft, border: "none" }}>
            <AlertTriangle size={17} color={alert.level === "critical" ? COLORS.danger : COLORS.warning} />
            <p className="text-[12px] font-semibold flex-1" style={{ color: alert.level === "critical" ? COLORS.danger : COLORS.warning }}>
              {alert.count} évaluation(s) non synchronisée(s) — connectez-vous pour sauvegarder vos données.
            </p>
          </Card>
        )}

        <SectionLabel>Mes classes et matières</SectionLabel>
        {byClass.length === 0 ? (
          <Card className="text-center py-6"><p className="text-[12.5px]" style={{ color: COLORS.muted }}>Aucune classe/matière assignée pour l'instant. Contactez votre gestionnaire d'école.</p></Card>
        ) : byClass.map((e) => (
          <Card key={e.classId} className="class-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-11 h-11 rounded-[15px] flex items-center justify-center" style={{ background: COLORS.primarySoft }}><GraduationCap size={19} color={COLORS.primary} /></div>
              <div className="flex-1"><p className="font-bold text-[13.5px]" style={{ color: COLORS.text }}>{e.className}</p><p className="text-[11px]" style={{ color: COLORS.muted }}>{e.level} · {e.subjects.length} matière(s)</p></div>
              <ChevronRight size={17} color={COLORS.muted}/>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {e.subjects.map((s) => (
                <button key={s.id} onClick={() => ctx.nav.push("affectationDetails", { classId: e.classId, subjectId: s.id })} className="subject-chip px-3 py-1.5 rounded-full text-[11px] font-bold" style={{ background: COLORS.primarySoft, color: COLORS.primary }}>
                  {s.name}
                </button>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </Screen>
  );
}

function EvaluationsListScreen({ ctx }) {
  const teacher = findTeacher(ctx.data, ctx.currentUser.id);
  const scope = ctx.nav.current.params || {};
  const isResultsTab = ctx.nav.current.screen === "resultsList" && !scope.classId;
  const scoped = scope.classId && scope.subjectId;
  const teacherSessions = ctx.data.sessions.filter((s) => s.teacherId === teacher.id);
  let allSessions = scoped ? teacherSessions.filter((s) => s.classId === scope.classId && s.subjectId === scope.subjectId) : teacherSessions;
  if (scope.questionnaireId) allSessions = allSessions.filter((s) => s.questionnaireId === scope.questionnaireId);
  allSessions = [...allSessions].reverse();

  // Classes et matières distinctes de l'enseignant, pour les filtres — inutiles si déjà scopé à une seule matière
  const myClasses = [];
  if (!scoped) {
    getTeacherAssignments(ctx.data, teacher.id).forEach(({ cls }) => { if (!myClasses.some((c) => c.id === cls.id)) myClasses.push(cls); });
  }
  const [classFilter, setClassFilterRaw] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const setClassFilter = (id) => { setClassFilterRaw(id); setSubjectFilter("all"); };
  const mySubjects = [];
  if (!scoped) {
    getTeacherAssignments(ctx.data, teacher.id).forEach(({ cls, subject }) => {
      if (classFilter !== "all" && cls.id !== classFilter) return;
      if (!mySubjects.includes(subject.name)) mySubjects.push(subject.name);
    });
  }
  const [filter, setFilter] = useState((scope.completedOnly || isResultsTab) ? "completed" : "all"); // all | inprogress | completed

  const classFiltered = classFilter === "all" ? allSessions : allSessions.filter((s) => s.classId === classFilter);
  const subjectFiltered = subjectFilter === "all" ? classFiltered : classFiltered.filter((s) => {
    const { cls } = locateClass(ctx.data, s.classId) || {};
    const { subject } = cls ? findQuestionnaire(cls, s.subjectId, s.questionnaireId) : {};
    return subject?.name === subjectFilter;
  });
  const sessions = subjectFiltered.filter((s) => filter === "all" ? true : filter === "inprogress" ? s.status !== "completed" : s.status === "completed");
  const counts = { all: subjectFiltered.length, inprogress: subjectFiltered.filter((s) => s.status !== "completed").length, completed: subjectFiltered.filter((s) => s.status === "completed").length };
  const scopedLoc = scoped ? locateClass(ctx.data, scope.classId) : null;
  const scopedSubject = scopedLoc ? scopedLoc.cls.subjects.find((s) => s.id === scope.subjectId) : null;
  const scopedQuestionnaire = scope.questionnaireId && scopedSubject ? scopedSubject.questionnaires.find((q) => q.id === scope.questionnaireId) : null;

  const BANDS = [
    { key: "excellent", label: "Excellent", range: "≥ 80%", color: COLORS.success, min: 80 },
    { key: "bien", label: "Bien", range: "60-79%", color: COLORS.primary, min: 60 },
    { key: "moyen", label: "Moyen", range: "40-59%", color: COLORS.warning, min: 40 },
    { key: "faible", label: "À revoir", range: "< 40%", color: COLORS.danger, min: 0 },
  ];
  let dashboard = null;
  if (isResultsTab && sessions.length > 0) {
    const averages = sessions.map((s) => computeResults(ctx, s.id).classAverage);
    const overallAvg = Math.round(averages.reduce((a, b) => a + b, 0) / averages.length);
    const bandCounts = BANDS.map((b) => ({ ...b, value: 0 }));
    averages.forEach((avg) => { const idx = BANDS.findIndex((b) => avg >= b.min); bandCounts[idx].value++; });
    dashboard = (
      <Card className="flex items-center gap-4">
        <DonutChart segments={bandCounts.map((b) => ({ value: b.value, color: b.color }))} />
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold" style={{ color: COLORS.muted }}>Moyenne générale</p>
          <p className="text-[22px] font-extrabold mb-2" style={{ color: overallAvg >= 50 ? COLORS.success : COLORS.danger }}>{overallAvg}%</p>
          <div className="space-y-1">
            {bandCounts.filter((b) => b.value > 0).map((b) => (
              <div key={b.key} className="flex items-center gap-1.5 text-[11px]" style={{ color: COLORS.text }}>
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: b.color }} />
                <span className="truncate">{b.label} ({b.range}) — {b.value}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Screen>
      <TopBar title={scopedQuestionnaire ? `Résultats — ${scopedQuestionnaire.title}` : scoped ? "Résultats" : isResultsTab ? "Résultats" : "Mes évaluations"} subtitle={scoped ? `${scopedLoc?.cls.name} · ${scopedSubject?.name}` : isResultsTab ? "Toutes vos classes" : undefined} onBack={scoped ? () => ctx.nav.pop() : undefined} right={<SyncIndicator ctx={ctx} />} />
      <div className="px-4 pt-4 space-y-2">
        {isResultsTab ? (
          <p className="text-[12px]" style={{ color: COLORS.muted }}>Consultez les résultats de toutes vos évaluations terminées, filtrables par classe et par matière.</p>
        ) : (
          <Btn full variant="accent" icon={PlayCircle} onClick={() => ctx.nav.push("evalPrep", scoped ? { classId: scope.classId, subjectId: scope.subjectId } : {})}>Nouvelle évaluation</Btn>
        )}

        {!scoped && (myClasses.length > 1 || mySubjects.length > 1) && (
          <div className="mobile-filter-panel">
            <div className="filter-heading"><SlidersHorizontal size={15}/><span>Affiner la liste</span><Badge tone="primary">{sessions.length}</Badge></div>
            <div className="grid grid-cols-2 gap-2">
              <label><span>Classe</span><select value={classFilter} onChange={(e) => setClassFilter(e.target.value)}><option value="all">Toutes</option>{myClasses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
              <label><span>Matière</span><select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)}><option value="all">Toutes</option>{mySubjects.map((name) => <option key={name} value={name}>{name}</option>)}</select></label>
            </div>
          </div>
        )}

        {!isResultsTab && (
          <div className="mobile-segmented flex p-1">
            {[{ key: "all", label: `Toutes (${counts.all})` }, { key: "inprogress", label: `En cours (${counts.inprogress})` }, { key: "completed", label: `Terminées (${counts.completed})` }].map((f) => (
              <button key={f.key} onClick={() => setFilter(f.key)} className={filter === f.key ? "active" : ""}>{f.label}</button>
            ))}
          </div>
        )}

        {dashboard}

        {sessions.length === 0 ? (
          <EmptyState icon={isResultsTab ? BarChart3 : ClipboardList} title={isResultsTab ? "Aucun résultat pour l'instant" : "Aucune évaluation"} text={isResultsTab ? "Les résultats apparaissent ici une fois une évaluation terminée." : "Lancez votre première évaluation depuis le bouton ci-dessus."} />
        ) : sessions.map((s) => {
          const { cls } = locateClass(ctx.data, s.classId) || {};
          const { subject, questionnaire } = cls ? findQuestionnaire(cls, s.subjectId, s.questionnaireId) : {};
          const avg = s.status === "completed" ? computeResults(ctx, s.id).classAverage : null;
          return (
            <Card key={s.id} onClick={() => s.status === "completed" ? ctx.nav.push("sessionResultsGlobal", { sessionId: s.id }) : ctx.nav.push("sessionQuestion", { sessionId: s.id, index: s.currentQuestionIndex || 0 })} className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-[13px] truncate" style={{ color: COLORS.text }}>{scopedQuestionnaire ? s.date : questionnaire?.title}</p>
                <p className="text-[11.5px] truncate" style={{ color: COLORS.muted }}>{scopedQuestionnaire ? `${questionnaire?.questions.length} question(s)` : `${cls?.name} · ${subject?.name} · ${s.date}`}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {avg !== null && <Badge tone={avg >= 50 ? "success" : "danger"}>Moy. {avg}%</Badge>}
                {!isResultsTab && <Badge tone={s.status === "completed" ? "success" : "warning"}>{s.status === "completed" ? "Terminée" : "En cours"}</Badge>}
              </div>
            </Card>
          );
        })}
      </div>
    </Screen>
  );
}

function AffectationDetailsScreen({ ctx }) {
  const { classId, subjectId } = ctx.nav.current.params;
  const loc = locateClass(ctx.data, classId);
  if (!loc) return null;
  const { subject } = findQuestionnaire(loc.cls, subjectId, null);
  const sessionsHere = ctx.data.sessions.filter((s) => s.classId === classId && s.subjectId === subjectId);
  const items = [
    { key: "c", label: "Cours", icon: BookOpen, sub: `${(subject.courses || []).length} cours · ${(subject.courses || []).reduce((n, c) => n + c.competencies.length, 0)} compétence(s)`, go: () => ctx.nav.push("courses", { classId, subjectId }) },
    { key: "e", label: "Nouvelle évaluation", icon: PlayCircle, sub: "Lancer une session", go: () => ctx.nav.push("evalPrep", { classId, subjectId }) },
    { key: "r", label: "Résultats", icon: BarChart3, sub: `${sessionsHere.length} session(s)`, go: () => ctx.nav.push("evaluationsList", { classId, subjectId, completedOnly: true }) },
  ];
  return (
    <Screen>
      <TopBar title={subject.name} subtitle={loc.cls.name} onBack={() => ctx.nav.pop()} />
      <div className="px-4 pt-4 grid grid-cols-2 gap-3">
        {items.map((it) => (
          <Card key={it.key} onClick={it.go} className="flex flex-col gap-2">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: COLORS.primarySoft }}><it.icon size={17} color={COLORS.primary} /></div>
            <p className="font-bold text-[13.5px]" style={{ color: COLORS.text }}>{it.label}</p>
            <p className="text-[11px]" style={{ color: COLORS.muted }}>{it.sub}</p>
          </Card>
        ))}
      </div>
    </Screen>
  );
}

function CoursesScreen({ ctx }) {
  const { classId, subjectId } = ctx.nav.current.params;
  const loc = locateClass(ctx.data, classId);
  const subject = loc?.cls.subjects.find((s) => s.id === subjectId);
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  if (!loc || !subject) return null;
  const courses = subject.courses || [];
  const addCourse = () => {
    if (!title.trim()) return;
    const course = { id: uid("co"), title: title.trim(), description: description.trim(), competencies: [] };
    ctx.setData((d) => updateClass(d, classId, (c) => ({ ...c, subjects: c.subjects.map((s) => s.id === subjectId ? { ...s, courses: [...(s.courses || []), course] } : s) })));
    setTitle(""); setDescription(""); setAdding(false); ctx.showToast("Cours ajouté");
  };
  return (
    <Screen>
      <TopBar title="Cours" subtitle={`${loc.cls.name} · ${subject.name}`} onBack={() => ctx.nav.pop()} />
      <div className="px-4 pt-4 space-y-2">
        {adding ? <Card className="mb-3">
          <Field label="Nom du cours ou chapitre"><TextInput autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex. Les fractions" /></Field>
          <Field label="Objectif (facultatif)"><TextArea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ce que les élèves vont apprendre" /></Field>
          <div className="flex gap-2"><Btn full variant="ghost" onClick={() => setAdding(false)}>Annuler</Btn><Btn full disabled={!title.trim()} onClick={addCourse}>Ajouter</Btn></div>
        </Card> : <PageAction icon={Plus} title="Ajouter un cours" subtitle="Créer un chapitre puis définir ses compétences" onClick={() => setAdding(true)} />}
        <SectionLabel>Programme de la matière</SectionLabel>
        {courses.length === 0 && <EmptyState icon={BookOpen} title="Aucun cours" text="Ajoutez un premier cours pour organiser les compétences à évaluer." />}
        {courses.map((course, index) => <Card key={course.id} onClick={() => ctx.nav.push("competencies", { classId, subjectId, courseId: course.id })} className="course-card flex items-center gap-3">
          <div className="course-number">{String(index + 1).padStart(2, "0")}</div>
          <div className="flex-1 min-w-0"><p className="font-bold text-[13px] truncate" style={{color:COLORS.text}}>{course.title}</p><p className="text-[10.5px] truncate" style={{color:COLORS.muted}}>{course.competencies.length} compétence(s){course.description ? ` · ${course.description}` : ""}</p></div>
          <ChevronRight size={17} color={COLORS.muted}/>
        </Card>)}
      </div>
    </Screen>
  );
}

function CompetenciesScreen({ ctx }) {
  const { classId, subjectId, courseId } = ctx.nav.current.params;
  const loc = locateClass(ctx.data, classId);
  const subject = loc?.cls.subjects.find((s) => s.id === subjectId);
  const course = (subject?.courses || []).find((c) => c.id === courseId);
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  if (!loc || !subject || !course) return null;
  const addCompetency = () => {
    if (!title.trim()) return;
    const competency = { id: uid("cp"), title: title.trim(), description: description.trim() };
    ctx.setData((d) => updateClass(d, classId, (c) => ({ ...c, subjects: c.subjects.map((s) => s.id === subjectId ? { ...s, courses: (s.courses || []).map((co) => co.id === courseId ? { ...co, competencies: [...co.competencies, competency] } : co) } : s) })));
    setTitle(""); setDescription(""); setAdding(false); ctx.showToast("Compétence ajoutée");
  };
  return (
    <Screen>
      <TopBar title={course.title} subtitle={`${subject.name} · Compétences`} onBack={() => ctx.nav.pop()} />
      <div className="px-4 pt-4 space-y-2">
        {adding ? <Card className="mb-3">
          <Field label="Compétence à maîtriser"><TextInput autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex. Comparer deux fractions" /></Field>
          <Field label="Critère de réussite (facultatif)"><TextArea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Décrivez le résultat attendu" /></Field>
          <div className="flex gap-2"><Btn full variant="ghost" onClick={() => setAdding(false)}>Annuler</Btn><Btn full disabled={!title.trim()} onClick={addCompetency}>Ajouter</Btn></div>
        </Card> : <PageAction icon={Plus} title="Ajouter une compétence" subtitle="Définir précisément ce qui sera évalué" onClick={() => setAdding(true)} />}
        <SectionLabel>Compétences du cours</SectionLabel>
        {course.competencies.length === 0 && <EmptyState icon={CheckCircle2} title="Aucune compétence" text="Définissez une compétence avant de créer son questionnaire." />}
        {course.competencies.map((competency) => {
          const count = subject.questionnaires.filter((q) => !q.archived && (q.competencyIds || []).includes(competency.id)).length;
          return <Card key={competency.id} onClick={() => ctx.nav.push("questionnaires", { classId, subjectId, courseId, competencyId: competency.id })} className="competency-card flex items-center gap-3">
            <div className="competency-check"><Check size={15}/></div>
            <div className="flex-1 min-w-0"><p className="font-bold text-[12.5px]" style={{color:COLORS.text}}>{competency.title}</p><p className="text-[10.5px] truncate" style={{color:COLORS.muted}}>{count} questionnaire(s){competency.description ? ` · ${competency.description}` : ""}</p></div>
            <ChevronRight size={17} color={COLORS.muted}/>
          </Card>;
        })}
      </div>
    </Screen>
  );
}

function QuestionnairesScreen({ ctx }) {
  const { classId, subjectId, courseId, competencyId } = ctx.nav.current.params;
  const loc = locateClass(ctx.data, classId);
  if (!loc) return null;
  const { cls } = loc;
  const subject = cls.subjects.find((s) => s.id === subjectId);
  if (!subject) return null;
  const course = (subject.courses || []).find((c) => c.id === courseId);
  const competency = course?.competencies.find((c) => c.id === competencyId);
  const visibleQuestionnaires = subject.questionnaires.filter((q) => !q.archived && (!competencyId || (q.competencyIds || []).includes(competencyId)));
  return (
    <Screen>
      <TopBar title="Questionnaires" subtitle={competency ? competency.title : `${cls.name} · ${subject.name}`} onBack={() => ctx.nav.pop()} />
      <div className="px-4 pt-4 space-y-2">
        <PageAction icon={Plus} title="Créer un questionnaire" subtitle={competency ? `Évaluer : ${competency.title}` : "Préparer une nouvelle activité"} onClick={() => ctx.nav.push("createQuestionnaire", { classId, subjectId, courseId, competencyId })} />
        <SectionLabel>Questionnaires disponibles</SectionLabel>
        {visibleQuestionnaires.length === 0 && <EmptyState icon={ClipboardList} title="Aucun questionnaire" text={competency ? "Créez un questionnaire pour mesurer cette compétence." : "Créez le premier questionnaire de cette matière."} />}
        {visibleQuestionnaires.map((q) => (
          <Card key={q.id} onClick={() => ctx.nav.push("createQuestionnaire", { classId, subjectId, courseId: q.courseId, competencyId, questionnaireId: q.id })}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: COLORS.primarySoft }}><ListChecks size={18} color={COLORS.primary} /></div>
              <div className="flex-1"><p className="font-bold text-[13.5px]" style={{ color: COLORS.text }}>{q.title}</p><p className="text-[11.5px]" style={{ color: COLORS.muted }}>{q.questions.length} question(s)</p></div>
              <ChevronRight size={17} color={COLORS.muted} />
            </div>
          </Card>
        ))}
      </div>
    </Screen>
  );
}

function CreateQuestionnaireScreen({ ctx }) {
  const { classId, subjectId, questionnaireId, courseId, competencyId } = ctx.nav.current.params;
  const loc = locateClass(ctx.data, classId);
  if (!loc) return null;
  const { cls } = loc;
  const subject = cls.subjects.find((s) => s.id === subjectId);
  const existing = questionnaireId ? subject.questionnaires.find((q) => q.id === questionnaireId) : null;
  const linkedCourse = (subject.courses || []).find((c) => c.id === (courseId || existing?.courseId));
  const linkedCompetency = linkedCourse?.competencies.find((c) => c.id === competencyId || (existing?.competencyIds || []).includes(c.id));
  const locked = existing ? questionnaireHasSessions(ctx.data, existing.id) : false;

  const [title, setTitle] = useState(existing?.title || "");
  const [description, setDescription] = useState(existing?.description || "");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmDeleteQ, setConfirmDeleteQ] = useState(null);
  const qId = existing?.id || null;

  const save = () => {
    if (!title.trim()) return;
    if (qId) {
      ctx.setData((d) => updateClass(d, classId, (c) => ({ ...c, subjects: c.subjects.map((s) => (s.id === subjectId ? { ...s, questionnaires: s.questionnaires.map((q) => (q.id === qId ? { ...q, title, description, courseId: courseId || q.courseId, competencyIds: competencyId ? Array.from(new Set([...(q.competencyIds || []), competencyId])) : (q.competencyIds || []) } : q)) } : s)) })));
      ctx.nav.push("questionnaires", { classId, subjectId, courseId: courseId || existing?.courseId, competencyId });
    } else {
      const newId = uid("qz");
      ctx.setData((d) => updateClass(d, classId, (c) => ({ ...c, subjects: c.subjects.map((s) => (s.id === subjectId ? { ...s, questionnaires: [...s.questionnaires, { id: newId, title, description, courseId: courseId || null, competencyIds: competencyId ? [competencyId] : [], archived: false, questions: [] }] } : s)) })));
      ctx.nav.push("createQuestion", { classId, subjectId, questionnaireId: newId, courseId, competencyId });
    }
  };
  const doDelete = () => {
    if (locked) { ctx.setData((d) => updateClass(d, classId, (c) => ({ ...c, subjects: c.subjects.map((s) => (s.id === subjectId ? { ...s, questionnaires: s.questionnaires.map((q) => (q.id === qId ? { ...q, archived: true } : q)) } : s)) }))); }
    else { ctx.setData((d) => updateClass(d, classId, (c) => ({ ...c, subjects: c.subjects.map((s) => (s.id === subjectId ? { ...s, questionnaires: s.questionnaires.filter((q) => q.id !== qId) } : s)) }))); }
    ctx.nav.push("questionnaires", { classId, subjectId, courseId: courseId || existing?.courseId, competencyId });
  };
  const deleteQuestion = (questionId) => {
    ctx.setData((d) => updateClass(d, classId, (c) => ({ ...c, subjects: c.subjects.map((s) => (s.id === subjectId ? { ...s, questionnaires: s.questionnaires.map((q) => (q.id === qId ? { ...q, questions: q.questions.filter((qu) => qu.id !== questionId) } : q)) } : s)) })));
    setConfirmDeleteQ(null);
  };

  return (
    <Screen>
      <TopBar title={qId ? "Modifier le questionnaire" : "Nouveau questionnaire"} subtitle={subject.name} onBack={() => ctx.nav.pop()} />
      <div className="px-4 pt-4">
        {locked && (
          <div className="mb-4">
            <Btn full variant="accent" icon={BarChart3} onClick={() => ctx.nav.push("evaluationsList", { classId, subjectId, questionnaireId: qId, completedOnly: true })}>
              Voir les résultats de ce questionnaire
            </Btn>
          </div>
        )}
        <Field label="Titre du questionnaire"><TextInput autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex. Les fractions" /></Field>
        <Field label="Matière"><TextInput disabled value={subject.name} style={{ color: COLORS.muted, background: "#F2F4F7" }} /></Field>
        {linkedCourse && <Field label="Cours"><TextInput disabled value={linkedCourse.title} style={{ color: COLORS.muted, background: "#F2F4F7" }} /></Field>}
        {linkedCompetency && <Field label="Compétence évaluée"><TextInput disabled value={linkedCompetency.title} style={{ color: COLORS.success, background: COLORS.successSoft }} /></Field>}
        <Field label="Description (facultative)"><TextArea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ex. Notions de base sur les fractions" /></Field>

        {locked && (
          <Card className="mb-3 flex items-center gap-2" style={{ background: COLORS.warningSoft, border: "none" }}>
            <Lock size={15} color={COLORS.warning} />
            <p className="text-[11.5px]" style={{ color: COLORS.warning }}>Déjà utilisé dans une évaluation — les questions ne peuvent plus être modifiées ni supprimées.</p>
          </Card>
        )}

        {existing && existing.questions.length > 0 && (
          <div className="mb-4">
            <p className="font-bold text-[13px] mb-2" style={{ color: COLORS.text }}>Questions ({existing.questions.length})</p>
            <div className="space-y-1.5">
              {existing.questions.map((q, i) => (
                <Card key={q.id} className="!py-2.5 flex items-center justify-between">
                  <span className="text-[12.5px] truncate flex-1" style={{ color: COLORS.text }}>{i + 1}. {q.text}</span>
                  <div className="flex items-center gap-1.5">
                    <Badge tone="success">{q.correct}</Badge>
                    {!locked && (
                      <>
                        <button onClick={() => ctx.nav.push("createQuestion", { classId, subjectId, questionnaireId: qId, editQuestionId: q.id, courseId: courseId || existing?.courseId, competencyId })} className="p-1"><Pencil size={13} color={COLORS.muted} /></button>
                        <button onClick={() => setConfirmDeleteQ(q.id)} className="p-1"><Trash2 size={13} color={COLORS.danger} /></button>
                      </>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Btn variant="ghost" full onClick={() => ctx.nav.pop()}>Annuler</Btn>
          <Btn full icon={Save} onClick={save} disabled={!title.trim()}>{qId ? "Enregistrer" : "Continuer"}</Btn>
        </div>
        {existing && !locked && (
          <div className="mt-2"><Btn variant="secondary" full icon={Plus} onClick={() => ctx.nav.push("createQuestion", { classId, subjectId, questionnaireId: qId, courseId: courseId || existing?.courseId, competencyId })}>Ajouter une question</Btn></div>
        )}
        {existing && (
          <div className="mt-2"><Btn variant="ghost" full icon={locked ? Archive : Trash2} onClick={() => setConfirmDelete(true)}>{locked ? "Archiver ce questionnaire" : "Supprimer ce questionnaire"}</Btn></div>
        )}
      </div>
      <ConfirmModal open={confirmDelete} title={locked ? "Archiver le questionnaire ?" : "Supprimer le questionnaire ?"} text={locked ? "Il a déjà servi dans une évaluation ; il sera masqué mais les résultats passés restent intacts." : "Cette action est définitive."} onCancel={() => setConfirmDelete(false)} onConfirm={doDelete} confirmLabel={locked ? "Archiver" : "Supprimer"} danger />
      <ConfirmModal open={!!confirmDeleteQ} title="Supprimer la question ?" text="Cette action est définitive." onCancel={() => setConfirmDeleteQ(null)} onConfirm={() => deleteQuestion(confirmDeleteQ)} confirmLabel="Supprimer" danger />
    </Screen>
  );
}

function CreateQuestionScreen({ ctx }) {
  const { classId, subjectId, questionnaireId, editQuestionId, courseId, competencyId } = ctx.nav.current.params;
  const loc = locateClass(ctx.data, classId);
  if (!loc) return null;
  const { cls } = loc;
  const subject = cls.subjects.find((s) => s.id === subjectId);
  const questionnaire = subject.questionnaires.find((q) => q.id === questionnaireId);
  const editing = editQuestionId ? questionnaire.questions.find((q) => q.id === editQuestionId) : null;

  const [text, setText] = useState(editing?.text || "");
  const [choices, setChoices] = useState(editing?.choices || { A: "", B: "", C: "", D: "" });
  const [correct, setCorrect] = useState(editing?.correct || "A");
  const [count, setCount] = useState(questionnaire?.questions.length || 0);
  const canSave = text.trim() && choices.A.trim() && choices.B.trim() && choices.C.trim() && choices.D.trim();

  const saveQuestion = (addAnother) => {
    if (!canSave) return;
    if (editing) {
      ctx.setData((d) => updateClass(d, classId, (c) => ({ ...c, subjects: c.subjects.map((s) => (s.id === subjectId ? { ...s, questionnaires: s.questionnaires.map((q) => (q.id === questionnaireId ? { ...q, questions: q.questions.map((qu) => (qu.id === editQuestionId ? { id: qu.id, text: text.trim(), choices: { ...choices }, correct } : qu)) } : q)) } : s)) })));
      ctx.nav.push("createQuestionnaire", { classId, subjectId, questionnaireId, courseId, competencyId });
      return;
    }
    const newQ = { id: uid("q"), text: text.trim(), choices: { ...choices }, correct };
    ctx.setData((d) => updateClass(d, classId, (c) => ({ ...c, subjects: c.subjects.map((s) => (s.id === subjectId ? { ...s, questionnaires: s.questionnaires.map((qz) => (qz.id === questionnaireId ? { ...qz, questions: [...qz.questions, newQ] } : qz)) } : s)) })));
    setCount((n) => n + 1);
    if (addAnother) { setText(""); setChoices({ A: "", B: "", C: "", D: "" }); setCorrect("A"); }
    else ctx.nav.push("createQuestionnaire", { classId, subjectId, questionnaireId, courseId, competencyId });
  };

  return (
    <Screen>
      <TopBar title={editing ? "Modifier la question" : "Nouvelle question"} subtitle={`${questionnaire?.title} · Question ${editing ? "" : count + 1}`} onBack={() => ctx.nav.pop()} />
      <div className="px-4 pt-4">
        <Field label="Texte de la question"><TextArea rows={2} value={text} onChange={(e) => setText(e.target.value)} placeholder="Ex. Quelle fraction représente..." /></Field>
        {["A", "B", "C", "D"].map((k) => (
          <Field key={k} label={`Choix ${k}`}>
            <div className="flex items-center gap-2">
              <TextInput value={choices[k]} onChange={(e) => setChoices((c) => ({ ...c, [k]: e.target.value }))} placeholder={`Réponse ${k}`} />
              <button onClick={() => setCorrect(k)} className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center font-bold text-[12px]" style={{ background: correct === k ? COLORS.success : COLORS.border, color: correct === k ? "#fff" : COLORS.muted }} title="Marquer comme bonne réponse">
                {correct === k ? <Check size={15} /> : k}
              </button>
            </div>
          </Field>
        ))}
        <p className="text-[11.5px] mb-4" style={{ color: COLORS.muted }}>Touchez le rond à droite d'un choix pour définir la bonne réponse (actuellement : <b style={{ color: COLORS.success }}>{correct}</b>).</p>
        {editing ? (
          <Btn full icon={Save} disabled={!canSave} onClick={() => saveQuestion(false)}>Enregistrer</Btn>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <Btn variant="ghost" icon={Trash2} onClick={() => ctx.nav.pop()}>Annuler</Btn>
              <Btn variant="secondary" icon={Plus} disabled={!canSave} onClick={() => saveQuestion(true)}>Ajouter une autre</Btn>
            </div>
            <Btn full icon={Save} disabled={!canSave} onClick={() => saveQuestion(false)}>Enregistrer et terminer</Btn>
          </>
        )}
      </div>
    </Screen>
  );
}

/* Préparation d'évaluation — scopée aux affectations de l'enseignant */
function EvalPrepScreen({ ctx }) {
  const teacher = findTeacher(ctx.data, ctx.currentUser.id);
  const assignments = getTeacherAssignments(ctx.data, teacher.id);

  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [questionnaireId, setQuestionnaireId] = useState("");
  const [step, setStep] = useState(0);

  const loc = classId ? locateClass(ctx.data, classId) : null;
  const cls = loc?.cls;
  const subject = cls?.subjects.find((s) => s.id === subjectId);
  const course = (subject?.courses || []).find((c) => c.id === courseId);
  const questionnaire = subject?.questionnaires.find((q) => q.id === questionnaireId && !q.archived);
  const myClasses = [];
  assignments.forEach(({ cls: assignedClass }) => { if (!myClasses.some((c) => c.id === assignedClass.id)) myClasses.push(assignedClass); });
  const mySubjects = assignments.filter(({ cls: assignedClass }) => assignedClass.id === classId);

  const start = () => {
    const sessionId = uid("sess");
    const participantSnapshot = cls.students.filter((s) => !s.archived).map((s) => ({ id: s.id, name: s.name, cardNumber: s.cardNumber, studentCode: s.studentCode }));
    ctx.setData((d) => ({ ...d, sessions: [...d.sessions, {
      id: sessionId, classId, subjectId, courseId, questionnaireId, teacherId: teacher.id,
      date: new Date().toLocaleDateString("fr-FR"), createdAt: Date.now(),
      questionIds: questionnaire.questions.map((q) => q.id), currentQuestionIndex: 0,
      participantSnapshot, answers: {}, questionStatus: {}, declaredAbsentIds: [], status: "in_progress",
      syncStatus: "pending", lastSyncedAt: null,
    }] }));
    ctx.nav.push("sessionQuestion", { sessionId, index: 0 });
  };

  const goBack = () => { if (step === 0) { ctx.nav.pop(); return; } setStep((s) => s - 1); };

  let title = "Choisir la classe", body = null;
  if (step === 0) {
    body = <div className="px-4">
      {myClasses.map((c) => <OptionCard key={c.id} icon={GraduationCap} title={c.name} subtitle={`${c.students.filter((s) => !s.archived).length} élèves`} selected={classId === c.id} onClick={() => { setClassId(c.id); setSubjectId(""); setCourseId(""); setQuestionnaireId(""); setStep(1); }} />)}
      {myClasses.length === 0 && <EmptyState icon={GraduationCap} title="Aucune classe" text="Aucune classe ne vous est encore affectée." />}
    </div>;
  } else if (step === 1) {
    title = "Choisir la matière";
    body = <div className="px-4">
      {mySubjects.map(({ subject: s }) => <OptionCard key={s.id} icon={BookOpen} title={s.name} subtitle={`${(s.courses || []).length} cours`} selected={subjectId === s.id} onClick={() => { setSubjectId(s.id); setCourseId(""); setQuestionnaireId(""); setStep(2); }} />)}
    </div>;
  } else if (step === 2) {
    title = "Choisir le cours";
    const courses = subject?.courses || [];
    body = <div className="px-4">
      {courses.map((c) => { const count = subject.questionnaires.filter((q) => !q.archived && q.courseId === c.id).length; return <OptionCard key={c.id} icon={BookOpen} title={c.title} subtitle={`${c.competencies.length} compétence(s) · ${count} questionnaire(s)`} selected={courseId === c.id} onClick={() => { setCourseId(c.id); setQuestionnaireId(""); setStep(3); }} />; })}
      {courses.length === 0 && <EmptyState icon={BookOpen} title="Aucun cours disponible" text="Ajoutez d'abord un cours et ses compétences dans cette matière." action={<Btn size="sm" icon={Plus} onClick={() => ctx.nav.push("courses", { classId, subjectId })}>Ajouter un cours</Btn>} />}
    </div>;
  } else if (step === 3) {
    title = "Choisir le questionnaire";
    const qs = subject?.questionnaires.filter((q) => !q.archived && q.courseId === courseId) || [];
    body = <div className="px-4">
      {qs.map((q) => { const skills = getQuestionnaireCompetencies(subject, q); return <OptionCard key={q.id} icon={ListChecks} title={q.title} subtitle={`${q.questions.length} question(s)${skills.length ? ` · ${skills.map((s) => s.title).join(", ")}` : ""}`} disabled={q.questions.length === 0} selected={questionnaireId === q.id} onClick={() => { setQuestionnaireId(q.id); setStep(4); }} />; })}
      {qs.length === 0 && <EmptyState icon={ListChecks} title="Aucun questionnaire pour ce cours" text="Créez un questionnaire depuis une compétence de ce cours avant de lancer l'évaluation." action={<Btn size="sm" icon={Plus} onClick={() => ctx.nav.push("competencies", { classId, subjectId, courseId })}>Voir les compétences</Btn>} />}
    </div>;
  } else if (step === 4) {
    title = "Résumé de l'évaluation";
    const skills = getQuestionnaireCompetencies(subject, questionnaire);
    body = <div className="px-4">
      <Card className="mb-4" style={{ background: COLORS.primarySoft, border: "none" }}>
        <p className="font-bold text-[13px] mb-2" style={{ color: COLORS.primaryDark }}>Résumé</p>
        <div className="space-y-1 text-[12.5px]" style={{ color: COLORS.primaryDark }}>
          <p>🎓 {cls.name} ({cls.students.filter((s) => !s.archived).length} élèves)</p>
          <p>📘 {subject.name} · {course.title}</p>
          {skills.length > 0 && <p>🎯 {skills.map((s) => s.title).join(", ")}</p>}
          <p>📋 {questionnaire.title}</p>
          <p>❓ {questionnaire.questions.length} questions</p>
        </div>
      </Card>
      <Btn full variant="accent" icon={PlayCircle} onClick={start}>Démarrer l'évaluation</Btn>
    </div>;
  }

  return (
    <Screen>
      <TopBar title={title} onBack={goBack} />
      <WizardProgress step={step} totalSteps={5} labels={["Choisir la classe", "Choisir la matière", "Choisir le cours", "Choisir le questionnaire", "Confirmer la séance"]} crumbs={[cls?.name, subject?.name, course?.title, questionnaire?.title].filter(Boolean)} helperText="Préparez la séance avant de lancer le scan" />
      <div className="pt-2">{body}</div>
    </Screen>
  );
}

/* Écran de question de session (inchangé) */
function SessionQuestionScreen({ ctx }) {
  const { sessionId, index } = ctx.nav.current.params;
  const session = findSession(ctx.data, sessionId);
  if (!session) return null;
  const loc = locateClass(ctx.data, session.classId);
  const { questionnaire } = findQuestionnaire(loc.cls, session.subjectId, session.questionnaireId);
  const question = questionnaire.questions[index];
  const total = questionnaire.questions.length;
  return (
    <Screen>
      <TopBar title={`Question ${index + 1} / ${total}`} subtitle={`${loc.cls.name} · ${questionnaire.title}`} onBack={() => ctx.nav.pop()} />
      <div className="px-4 pt-4">
        <Card className="mb-4"><p className="font-bold text-[16px] leading-snug" style={{ color: COLORS.text }}>{question.text}</p></Card>
        <div className="space-y-2 mb-6">
          {["A", "B", "C", "D"].map((k) => (
            <div key={k} className="flex items-center gap-3 px-3 py-3 rounded-xl" style={{ background: "#F7F8FA" }}>
              <span className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-[12.5px] shrink-0" style={{ background: COLORS.primary, color: "#fff" }}>{k}</span>
              <span className="text-[13.5px]" style={{ color: COLORS.text }}>{question.choices[k]}</span>
            </div>
          ))}
        </div>
        <Btn full variant="accent" icon={Camera} onClick={() => ctx.nav.push("scanSimulation", { sessionId, index })}>Démarrer le scan</Btn>
      </div>
    </Screen>
  );
}

/* Scan simulé (inchangé, rangées + absents + flux live + retour sonore) */
function playDetectionFeedback() {
  try {
    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(25);
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctxAudio = new Ctx();
    const osc = ctxAudio.createOscillator();
    const gain = ctxAudio.createGain();
    osc.type = "sine"; osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.06, ctxAudio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctxAudio.currentTime + 0.12);
    osc.connect(gain).connect(ctxAudio.destination); osc.start(); osc.stop(ctxAudio.currentTime + 0.13);
  } catch (e) {}
}
const ZONE_SIZE = 20;

function ScanSimulationScreen({ ctx }) {
  const { sessionId, index } = ctx.nav.current.params;
  const session = findSession(ctx.data, sessionId);
  const loc = locateClass(ctx.data, session.classId);
  const { questionnaire } = findQuestionnaire(loc.cls, session.subjectId, session.questionnaireId);
  const question = questionnaire.questions[index];
  const students = session.participantSnapshot || loc.cls.students.filter((s) => !s.archived);
  const total = students.length;

  const [absentPanelOpen, setAbsentPanelOpen] = useState(false);
  const [absentSearch, setAbsentSearch] = useState("");
  const declaredAbsentIds = session.declaredAbsentIds || [];
  const toggleAbsent = (studentId) => {
    ctx.setData((d) => updateSession(d, sessionId, (s) => {
      const cur = s.declaredAbsentIds || [];
      return { ...s, declaredAbsentIds: cur.includes(studentId) ? cur.filter((id) => id !== studentId) : [...cur, studentId] };
    }));
  };

  const detectableStudents = useMemo(() => students.filter((s) => !declaredAbsentIds.includes(s.id)), [students, declaredAbsentIds]);
  const zones = useMemo(() => {
    const z = [];
    for (let i = 0; i < detectableStudents.length; i += ZONE_SIZE) z.push(detectableStudents.slice(i, i + ZONE_SIZE));
    return z.length ? z : [[]];
  }, [detectableStudents]);

  const [zoneIndex, setZoneIndex] = useState(0);
  const currentZone = zones[Math.min(zoneIndex, zones.length - 1)] || [];
  const [detected, setDetected] = useState([]);
  const [lastFeed, setLastFeed] = useState([]);
  const [scanning, setScanning] = useState(true);
  const detectedIdsRef = useRef(new Set());

  useEffect(() => { setScanning(true); }, [zoneIndex]);
  useEffect(() => {
    if (!scanning) return;
    const remainingInZone = currentZone.filter((s) => !detectedIdsRef.current.has(s.id));
    if (remainingInZone.length === 0) { setScanning(false); return; }
    const timer = setInterval(() => {
      setDetected((prev) => {
        const remaining = currentZone.filter((s) => !detectedIdsRef.current.has(s.id));
        if (remaining.length === 0) { setScanning(false); return prev; }
        const batch = remaining.slice(0, Math.min(2, remaining.length));
        const additions = batch.map((s) => {
          detectedIdsRef.current.add(s.id);
          const r = Math.random();
          const choice = r < 0.55 ? question.correct : ["A", "B", "C", "D"].filter((c) => c !== question.correct)[Math.floor(Math.random() * 3)];
          return { studentId: s.id, choice, name: s.name };
        });
        playDetectionFeedback();
        setLastFeed((f) => [...additions, ...f].slice(0, 4));
        return [...prev, ...additions.map(({ studentId, choice }) => ({ studentId, choice }))];
      });
    }, 550);
    return () => clearInterval(timer);
  }, [scanning, currentZone, question.correct]);

  const zoneDone = currentZone.every((s) => detectedIdsRef.current.has(s.id));
  const isLastZone = zoneIndex >= zones.length - 1;
  const goToNextZone = () => { if (!isLastZone) setZoneIndex((z) => z + 1); };
  const rescanZone = () => setScanning(true);
  const notDetectedInZone = currentZone.filter((s) => !detectedIdsRef.current.has(s.id));
  const notDetectedTotal = detectableStudents.filter((s) => !detectedIdsRef.current.has(s.id));

  const goVerify = () => {
    ctx.setData((d) => updateSession(d, sessionId, (s) => {
      const answers = { ...s.answers };
      detected.forEach(({ studentId, choice }) => { answers[studentId] = { ...(answers[studentId] || {}), [question.id]: choice }; });
      students.forEach((st) => { if (!answers[st.id] || answers[st.id][question.id] === undefined) answers[st.id] = { ...(answers[st.id] || {}), [question.id]: null }; });
      return { ...s, answers, questionStatus: { ...s.questionStatus, [question.id]: "scanned" } };
    }));
    ctx.nav.push("verifyAnswers", { sessionId, index });
  };

  const filteredAbsentList = students.filter((s) => s.name.toLowerCase().includes(absentSearch.toLowerCase()));

  return (
    <Screen>
      <TopBar title="Scan en cours" subtitle={`Question ${index + 1} · Rangée ${zoneIndex + 1}/${zones.length}`} onBack={() => ctx.nav.pop()} />
      <div className="px-4 pt-3">
        {zones.length > 1 && (
          <div className="flex gap-1.5 overflow-x-auto pb-1 mb-3 -mx-1 px-1">
            {zones.map((z, i) => {
              const done = z.every((s) => detectedIdsRef.current.has(s.id)) && z.length > 0;
              return (
                <button key={i} onClick={() => setZoneIndex(i)} className="shrink-0 px-3 py-1.5 rounded-full text-[11.5px] font-semibold flex items-center gap-1"
                  style={{ background: i === zoneIndex ? COLORS.primary : done ? COLORS.successSoft : COLORS.primarySoft, color: i === zoneIndex ? "#fff" : done ? COLORS.success : COLORS.primary }}>
                  {done && <CheckCircle2 size={12} />}Rangée {i + 1}
                </button>
              );
            })}
          </div>
        )}
        <Card className="mb-3 !py-2.5">
          <button className="w-full flex items-center justify-between" onClick={() => setAbsentPanelOpen((v) => !v)}>
            <span className="flex items-center gap-2 text-[12.5px] font-semibold" style={{ color: COLORS.text }}>
              <UserX size={15} color={COLORS.muted} /> Élèves absents aujourd'hui
              {declaredAbsentIds.length > 0 && <Badge tone="neutral">{declaredAbsentIds.length}</Badge>}
            </span>
            <ChevronRight size={16} color={COLORS.muted} style={{ transform: absentPanelOpen ? "rotate(90deg)" : "none" }} />
          </button>
          {absentPanelOpen && (
            <div className="mt-2">
              <TextInput value={absentSearch} onChange={(e) => setAbsentSearch(e.target.value)} placeholder="Rechercher un élève à signaler absent" style={{ marginBottom: 8 }} />
              <div className="max-h-[180px] overflow-y-auto space-y-1">
                {filteredAbsentList.slice(0, 30).map((s) => (
                  <label key={s.id} className="flex items-center gap-2 py-1 text-[12.5px]" style={{ color: COLORS.text }}>
                    <input type="checkbox" checked={declaredAbsentIds.includes(s.id)} onChange={() => toggleAbsent(s.id)} />{s.name}
                  </label>
                ))}
              </div>
            </div>
          )}
        </Card>
        <div className="rounded-2xl mb-3 flex flex-col items-center justify-center py-8 relative overflow-hidden" style={{ background: "#0F1E33" }}>
          <div className="absolute inset-4 rounded-xl" style={{ border: "2px dashed rgba(255,255,255,0.25)" }} />
          <Camera size={28} color="rgba(255,255,255,0.6)" />
          <p className="text-[12px] mt-2" style={{ color: "rgba(255,255,255,0.7)" }}>{scanning ? "Recherche des cartes-réponses…" : zoneDone ? "Rangée terminée" : "Scan en pause"}</p>
          {scanning && <div className="flex gap-1 mt-2">{[0, 1, 2].map((i) => <span key={i} className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#fff", animationDelay: `${i * 150}ms` }} />)}</div>}
          {lastFeed.length > 0 && (
            <div className="w-full mt-3 px-4 space-y-1">
              {lastFeed.map((f, i) => (
                <div key={f.studentId + i} className="flex items-center justify-between text-[11px] px-2 py-1 rounded-lg" style={{ background: "rgba(255,255,255,0.08)", opacity: 1 - i * 0.18 }}>
                  <span style={{ color: "#fff" }}>{f.name}</span><span style={{ color: "#8FE3C7" }}>Réponse {f.choice}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <Card className="flex items-center justify-between mb-3" style={{ background: COLORS.primarySoft, border: "none" }}>
          <div>
            <p className="text-[12px] font-semibold" style={{ color: COLORS.primaryDark }}>Élèves détectés (total)</p>
            <p className="text-[22px] font-extrabold" style={{ color: COLORS.primary }}>{detected.length} <span className="text-[14px] font-semibold" style={{ color: COLORS.muted }}>/ {total}</span></p>
            {declaredAbsentIds.length > 0 && <p className="text-[11px]" style={{ color: COLORS.muted }}>dont {declaredAbsentIds.length} absent(s) signalé(s)</p>}
          </div>
          <ScanLine size={26} color={COLORS.primary} />
        </Card>
        {notDetectedInZone.length > 0 && (
          <Card className="mb-4">
            <p className="font-bold text-[12.5px] mb-2" style={{ color: COLORS.text }}>Non détectés dans cette rangée ({notDetectedInZone.length})</p>
            <div className="flex flex-wrap gap-1.5">
              {notDetectedInZone.slice(0, 8).map((s) => <span key={s.id} className="text-[11px] px-2 py-1 rounded-full" style={{ background: COLORS.dangerSoft, color: COLORS.danger }}>{s.name}</span>)}
              {notDetectedInZone.length > 8 && <span className="text-[11px] px-2 py-1 rounded-full" style={{ background: COLORS.dangerSoft, color: COLORS.danger }}>+{notDetectedInZone.length - 8} autres</span>}
            </div>
          </Card>
        )}
        <div className="space-y-2">
          {!scanning && !zoneDone && <Btn full variant="secondary" icon={ScanLine} onClick={rescanZone}>Continuer le scan de cette rangée</Btn>}
          {zoneDone && !isLastZone && <Btn full icon={ArrowRight} onClick={goToNextZone}>Rangée {zoneIndex + 2} — continuer le scan</Btn>}
          <Btn full variant={zoneDone && isLastZone ? "accent" : "ghost"} icon={ArrowRight} onClick={goVerify}>
            Vérifier les réponses {notDetectedTotal.length > 0 ? `(${notDetectedTotal.length} non détecté(s))` : ""}
          </Btn>
        </div>
      </div>
    </Screen>
  );
}

/* Vérification (inchangée, recherche + filtre + sélection multiple) */
function VerifyAnswersScreen({ ctx }) {
  const { sessionId, index } = ctx.nav.current.params;
  const session = findSession(ctx.data, sessionId);
  const loc = locateClass(ctx.data, session.classId);
  const { questionnaire } = findQuestionnaire(loc.cls, session.subjectId, session.questionnaireId);
  const question = questionnaire.questions[index];
  const students = session.participantSnapshot || loc.cls.students.filter((s) => !s.archived);
  const declaredAbsentIds = session.declaredAbsentIds || [];

  const [correcting, setCorrecting] = useState(null);
  const [confirmValidate, setConfirmValidate] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState(new Set());

  const setChoice = (studentId, choice) => {
    ctx.setData((d) => updateSession(d, sessionId, (s) => ({ ...s, answers: { ...s.answers, [studentId]: { ...(s.answers[studentId] || {}), [question.id]: choice } } })));
    setCorrecting(null);
  };
  const setChoiceBulk = (choice) => {
    ctx.setData((d) => updateSession(d, sessionId, (s) => {
      const answers = { ...s.answers };
      selected.forEach((studentId) => { answers[studentId] = { ...(answers[studentId] || {}), [question.id]: choice }; });
      return { ...s, answers };
    }));
    setSelected(new Set()); setSelectMode(false);
  };

  const detectedCount = students.filter((s) => session.answers[s.id]?.[question.id]).length;
  const visibleStudents = students.filter((s) => {
    if (!s.name.toLowerCase().includes(search.toLowerCase())) return false;
    const choice = session.answers[s.id]?.[question.id];
    if (filter === "detected") return !!choice;
    if (filter === "undetected") return !choice;
    return true;
  });
  const toggleSelect = (studentId) => setSelected((prev) => { const next = new Set(prev); next.has(studentId) ? next.delete(studentId) : next.add(studentId); return next; });
  const selectAllVisible = () => setSelected(new Set(visibleStudents.map((s) => s.id)));

  const validateQuestion = () => {
    ctx.setData((d) => updateSession(d, sessionId, (s) => ({ ...s, questionStatus: { ...s.questionStatus, [question.id]: "validated" } })));
    const nextIndex = index + 1;
    if (nextIndex < questionnaire.questions.length) ctx.nav.resetTo("sessionQuestion", { sessionId, index: nextIndex });
    else { ctx.setData((d) => updateSession(d, sessionId, (s) => ({ ...s, status: "completed" }))); ctx.nav.resetTo("sessionResultsGlobal", { sessionId }); }
  };

  return (
    <Screen>
      <TopBar title="Vérifier les réponses" subtitle={`Question ${index + 1} — ${detectedCount}/${students.length} détectés`} onBack={() => ctx.nav.pop()}
        right={<button onClick={() => { setSelectMode((v) => !v); setSelected(new Set()); }} className="text-[11.5px] font-semibold px-2.5 py-1.5 rounded-lg" style={{ background: selectMode ? COLORS.primary : COLORS.primarySoft, color: selectMode ? "#fff" : COLORS.primary }}>{selectMode ? "Terminer" : "Sélection multiple"}</button>} />
      <div className="px-4 pt-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl mb-2" style={{ background: "#F2F4F7" }}>
          <Search size={15} color={COLORS.muted} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un élève" className="flex-1 bg-transparent outline-none text-[13px]" />
        </div>
        <div className="mobile-segmented flex p-1 mb-3">
          {[{ key: "all", label: `Tous (${students.length})` }, { key: "detected", label: `Détectés (${detectedCount})` }, { key: "undetected", label: `Non détectés (${students.length - detectedCount})` }].map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)} className={filter === f.key ? "active" : ""}>{f.label}</button>
          ))}
        </div>
        {selectMode && (
          <div className="flex items-center justify-between mb-2 px-1">
            <button onClick={selectAllVisible} className="text-[11.5px] font-semibold" style={{ color: COLORS.primary }}>Tout sélectionner ({visibleStudents.length})</button>
            <span className="text-[11.5px]" style={{ color: COLORS.muted }}>{selected.size} sélectionné(s)</span>
          </div>
        )}
        <div className="rounded-2xl overflow-hidden mb-4" style={{ border: `1px solid ${COLORS.border}` }}>
          <div className="max-h-[380px] overflow-y-auto">
            {visibleStudents.length === 0 && <div className="py-8 text-center text-[12.5px]" style={{ color: COLORS.muted }}>Aucun élève ne correspond.</div>}
            {visibleStudents.map((s, i) => {
              const choice = session.answers[s.id]?.[question.id];
              const isAbsentDeclared = declaredAbsentIds.includes(s.id) && !choice;
              return (
                <div key={s.id} onClick={selectMode ? () => toggleSelect(s.id) : undefined} className="flex items-center justify-between px-3 py-2.5"
                  style={{ borderTop: i ? `1px solid ${COLORS.border}` : "none", background: selected.has(s.id) ? COLORS.primarySoft : i % 2 ? "#FBFCFD" : "#fff", cursor: selectMode ? "pointer" : "default" }}>
                  <div className="flex items-center gap-2 min-w-0">
                    {selectMode && <input type="checkbox" readOnly checked={selected.has(s.id)} className="mr-1" />}
                    {choice ? <UserCheck size={15} color={COLORS.success} /> : <UserX size={15} color={isAbsentDeclared ? COLORS.muted : COLORS.danger} />}
                    <span className="text-[12.5px] font-medium truncate" style={{ color: COLORS.text }}>{s.name}</span>
                  </div>
                  {!selectMode && (correcting === s.id ? (
                    <div className="flex gap-1.5">
                      {["A", "B", "C", "D"].map((k) => <button key={k} onClick={() => setChoice(s.id, k)} className="w-8 h-8 rounded-full text-[11px] font-bold" style={{ background: choice === k ? COLORS.primary : COLORS.border, color: choice === k ? "#fff" : COLORS.muted }}>{k}</button>)}
                      <button onClick={() => setChoice(s.id, null)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: COLORS.dangerSoft }}><X size={14} color={COLORS.danger} /></button>
                    </div>
                  ) : (
                    <button onClick={() => setCorrecting(s.id)} className="flex items-center gap-1.5 py-1">
                      {choice ? <Badge tone="primary">{choice}</Badge> : isAbsentDeclared ? <Badge tone="neutral">Absent signalé</Badge> : <Badge tone="danger">Non détecté</Badge>}
                      <Edit3 size={13} color={COLORS.muted} />
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
        {!selectMode && <Btn full icon={Check} onClick={() => setConfirmValidate(true)}>Valider cette question</Btn>}
      </div>
      {selectMode && selected.size > 0 && (
        <div className="sticky bottom-0 px-4 py-3" style={{ background: COLORS.surface, borderTop: `1px solid ${COLORS.border}` }}>
          <p className="text-[11px] font-semibold mb-2" style={{ color: COLORS.muted }}>Attribuer aux {selected.size} élève(s) sélectionné(s) :</p>
          <div className="flex gap-2">
            {["A", "B", "C", "D"].map((k) => <button key={k} onClick={() => setChoiceBulk(k)} className="flex-1 py-2.5 rounded-xl font-bold text-[13px]" style={{ background: COLORS.primarySoft, color: COLORS.primary }}>{k}</button>)}
            <button onClick={() => setChoiceBulk(null)} className="flex-1 py-2.5 rounded-xl font-semibold text-[12px]" style={{ background: COLORS.dangerSoft, color: COLORS.danger }}>Absent</button>
          </div>
        </div>
      )}
      <ConfirmModal open={confirmValidate} title="Valider la question ?" text="Les réponses seront enregistrées et vous passerez à la question suivante (ou aux résultats)." onCancel={() => setConfirmValidate(false)} onConfirm={() => { setConfirmValidate(false); validateQuestion(); }} confirmLabel="Valider" />
    </Screen>
  );
}

/* Résultats — s'appuient sur la photo des participants prise au lancement de la session, jamais recalculée après coup */
function computeResults(ctx, sessionId) {
  const session = findSession(ctx.data, sessionId);
  const loc = locateClass(ctx.data, session.classId);
  const { questionnaire } = findQuestionnaire(loc.cls, session.subjectId, session.questionnaireId);
  const students = session.participantSnapshot || loc.cls.students.filter((s) => !s.archived);
  const questions = questionnaire.questions;
  const perStudent = students.map((s) => {
    const detail = questions.map((q) => { const choice = session.answers[s.id]?.[q.id] ?? null; return { question: q, choice, correct: choice === q.correct }; });
    const score = detail.filter((d) => d.correct).length;
    return { student: s, detail, score, pct: questions.length ? Math.round((score / questions.length) * 100) : 0 };
  });
  const participants = perStudent.filter((p) => p.detail.some((d) => d.choice)).length;
  const totalCorrect = perStudent.reduce((sum, p) => sum + p.score, 0);
  const totalPossible = students.length * questions.length;
  const classAverage = totalPossible ? Math.round((totalCorrect / totalPossible) * 100) : 0;
  const distribution = { A: 0, B: 0, C: 0, D: 0 };
  perStudent.forEach((p) => p.detail.forEach((d) => { if (d.choice) distribution[d.choice]++; }));
  const perQuestion = questions.map((q) => {
    const answers = perStudent.map((p) => p.detail.find((d) => d.question.id === q.id).choice);
    const correctCount = answers.filter((a) => a === q.correct).length;
    const noAnswer = answers.filter((a) => !a).length;
    const incorrect = answers.length - correctCount - noAnswer;
    const dist = { A: 0, B: 0, C: 0, D: 0 };
    answers.forEach((a) => { if (a) dist[a]++; });
    return { question: q, correctCount, incorrect, noAnswer, dist, rate: students.length ? Math.round((correctCount / students.length) * 100) : 0 };
  });
  return { session, loc, questionnaire, students, questions, perStudent, participants, totalCorrect, totalPossible, classAverage, distribution, perQuestion };
}

function ResultsTabs({ ctx, sessionId, active }) {
  const tabs = [{ key: "sessionResultsGlobal", label: "Classe" }, { key: "sessionResultsByQuestion", label: "Par question" }, { key: "sessionResultsByStudent", label: "Par élève" }];
  return (
    <div className="flex gap-2 px-4 pb-3">
      {tabs.map((t) => <button key={t.key} onClick={() => ctx.nav.resetTo(t.key, { sessionId })} className="flex-1 py-2 rounded-xl text-[12px] font-semibold" style={{ background: active === t.key ? COLORS.primary : COLORS.primarySoft, color: active === t.key ? "#fff" : COLORS.primary }}>{t.label}</button>)}
    </div>
  );
}
function DonutChart({ segments, size = 132, strokeWidth = 16 }) {
  const total = segments.reduce((sum, seg) => sum + seg.value, 0);
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  let cumulative = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#EEF1F4" strokeWidth={strokeWidth} />
      {total > 0 && segments.map((seg, i) => {
        if (!seg.value) return null;
        const dash = (seg.value / total) * c;
        const dashOffset = -cumulative;
        cumulative += dash;
        return (
          <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={seg.color} strokeWidth={strokeWidth}
            strokeDasharray={`${dash} ${c - dash}`} strokeDashoffset={dashOffset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`} strokeLinecap="butt" />
        );
      })}
      <text x={size / 2} y={size / 2 - 3} textAnchor="middle" fontSize="22" fontWeight="800" fill={COLORS.text}>{total}</text>
      <text x={size / 2} y={size / 2 + 15} textAnchor="middle" fontSize="10" fill={COLORS.muted}>{total > 1 ? "évaluations" : "évaluation"}</text>
    </svg>
  );
}
/* Répartition globale — Correct / Incorrect / Sans réponse : la seule agrégation qui garde un sens
   toutes questions confondues, contrairement à des lettres A/B/C/D dont la signification change à chaque question. */
function OutcomeBar({ correct, incorrect, noAnswer }) {
  const total = correct + incorrect + noAnswer;
  const pct = (n) => (total ? Math.round((n / total) * 100) : 0);
  const segments = [
    { key: "correct", value: correct, color: COLORS.success, label: "Correct" },
    { key: "incorrect", value: incorrect, color: COLORS.danger, label: "Incorrect" },
    { key: "noAnswer", value: noAnswer, color: COLORS.warning, label: "Sans réponse" },
  ];
  return (
    <div>
      <div className="h-4 rounded-full overflow-hidden flex mb-3" style={{ background: "#EEF1F4" }}>
        {segments.map((s) => s.value > 0 && <div key={s.key} style={{ width: `${pct(s.value)}%`, background: s.color }} />)}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        {segments.map((s) => (
          <div key={s.key} className="flex items-center gap-1.5 text-[11.5px]" style={{ color: COLORS.text }}>
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
            {s.label} <b>{pct(s.value)}%</b>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Répartition par question — met en évidence visuellement la bonne réponse, pour repérer d'un coup d'œil
   vers quel distracteur les élèves se sont trompés. */
function DistBar({ dist, total, correctKey }) {
  return (
    <div className="space-y-1.5">
      {["A", "B", "C", "D"].map((k) => {
        const pct = total ? Math.round((dist[k] / total) * 100) : 0;
        const isCorrect = k === correctKey;
        return (
          <div key={k} className="flex items-center gap-2">
            <span className="w-4 text-[11px] font-bold" style={{ color: isCorrect ? COLORS.success : COLORS.muted }}>{k}{isCorrect && " ✓"}</span>
            <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: "#EEF1F4" }}><div className="h-full rounded-full" style={{ width: `${pct}%`, background: isCorrect ? COLORS.success : "#B9C3D1" }} /></div>
            <span className="w-9 text-right text-[11px]" style={{ color: isCorrect ? COLORS.success : COLORS.muted, fontWeight: isCorrect ? 700 : 400 }}>{dist[k]}</span>
          </div>
        );
      })}
    </div>
  );
}
function ResultsGlobalScreen({ ctx }) {
  const { sessionId } = ctx.nav.current.params;
  const r = computeResults(ctx, sessionId);
  const [confirmRetry, setConfirmRetry] = useState(false);
  const isWeak = r.classAverage < WEAK_RESULT_THRESHOLD;
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (!r.session.celebrationShown && !isWeak) {
      setShowCelebration(true);
      ctx.setData((d) => updateSession(d, sessionId, (s) => ({ ...s, celebrationShown: true })));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const retryQuestionnaire = () => {
    const newSessionId = uid("sess");
    const participantSnapshot = r.loc.cls.students.filter((s) => !s.archived).map((s) => ({ id: s.id, name: s.name, cardNumber: s.cardNumber, studentCode: s.studentCode }));
    ctx.setData((d) => ({ ...d, sessions: [...d.sessions, {
      id: newSessionId, classId: r.session.classId, subjectId: r.session.subjectId, questionnaireId: r.session.questionnaireId, teacherId: r.session.teacherId,
      date: new Date().toLocaleDateString("fr-FR"), createdAt: Date.now(),
      questionIds: r.questionnaire.questions.map((q) => q.id), currentQuestionIndex: 0,
      participantSnapshot, answers: {}, questionStatus: {}, declaredAbsentIds: [], status: "in_progress",
      syncStatus: "pending", lastSyncedAt: null,
    }] }));
    ctx.nav.resetTo("sessionQuestion", { sessionId: newSessionId, index: 0 });
  };

  return (
    <Screen>
      <TopBar title="Résultats" subtitle={`${r.loc.cls.name} · ${r.questionnaire.title}`} onBack={() => ctx.nav.pop()} />
      <ResultsTabs ctx={ctx} sessionId={sessionId} active="sessionResultsGlobal" />
      <div className="px-4 space-y-3">
        {isWeak && (
          <Card style={{ background: COLORS.dangerSoft, border: "none" }}>
            <div className="flex items-start gap-2 mb-3">
              <AlertTriangle size={18} color={COLORS.danger} className="mt-0.5 shrink-0" />
              <p className="text-[12.5px]" style={{ color: COLORS.danger }}>
                Résultats faibles sur « {r.questionnaire.title} ». Nous recommandons de revoir le cours correspondant avec la classe avant de continuer.
              </p>
            </div>
            <Btn full variant="danger" icon={RefreshCw} onClick={() => setConfirmRetry(true)}>Refaire ce questionnaire</Btn>
          </Card>
        )}

        <Card style={{ background: isWeak ? COLORS.dangerSoft : COLORS.successSoft, border: "none" }}>
          <p className="text-[11.5px] font-semibold" style={{ color: isWeak ? COLORS.danger : COLORS.success }}>Moyenne de la classe</p>
          <p className="text-[40px] font-extrabold leading-none my-1" style={{ color: isWeak ? COLORS.danger : COLORS.success }}>{r.classAverage}%</p>
          <p className="text-[11.5px] font-semibold flex items-center gap-1" style={{ color: isWeak ? COLORS.danger : COLORS.success }}>
            {isWeak ? <XCircle size={13} /> : <CheckCircle2 size={13} />}
            {isWeak ? `En dessous du seuil de réussite (${WEAK_RESULT_THRESHOLD}%)` : `Au-dessus du seuil de réussite (${WEAK_RESULT_THRESHOLD}%)`}
          </p>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Card className="text-center">
            <p className="text-[24px] font-extrabold" style={{ color: r.participants >= r.students.length * 0.8 ? COLORS.success : COLORS.warning }}>{r.students.length ? Math.round((r.participants / r.students.length) * 100) : 0}%</p>
            <p className="text-[11px]" style={{ color: COLORS.muted }}>Participation ({r.participants} sur {r.students.length})</p>
          </Card>
          <Card className="text-center">
            <p className="text-[24px] font-extrabold" style={{ color: COLORS.text }}>{r.students.length}</p>
            <p className="text-[11px]" style={{ color: COLORS.muted }}>Élèves inscrits</p>
          </Card>
        </div>
        <Card>
          <p className="font-bold text-[13px] mb-3" style={{ color: COLORS.text }}>Répartition des réponses</p>
          <OutcomeBar
            correct={r.totalCorrect}
            incorrect={r.perQuestion.reduce((sum, pq) => sum + pq.incorrect, 0)}
            noAnswer={r.perQuestion.reduce((sum, pq) => sum + pq.noAnswer, 0)}
          />
        </Card>
      </div>
      <ConfirmModal open={confirmRetry} title="Refaire ce questionnaire ?" text="Une nouvelle session démarre avec les mêmes questions, pour toute la classe. Les résultats précédents restent conservés séparément." onCancel={() => setConfirmRetry(false)} onConfirm={retryQuestionnaire} confirmLabel="Démarrer" />
      {showCelebration && <CelebrationOverlay average={r.classAverage} onClose={() => setShowCelebration(false)} />}
    </Screen>
  );
}
function ResultsByQuestionScreen({ ctx }) {
  const { sessionId } = ctx.nav.current.params;
  const r = computeResults(ctx, sessionId);
  return (
    <Screen>
      <TopBar title="Résultats" subtitle={`${r.loc.cls.name} · ${r.questionnaire.title}`} onBack={() => ctx.nav.pop()} />
      <ResultsTabs ctx={ctx} sessionId={sessionId} active="sessionResultsByQuestion" />
      <div className="px-4 space-y-3">
        {r.perQuestion.map((pq, i) => {
          const weak = pq.rate < WEAK_RESULT_THRESHOLD;
          return (
            <Card key={pq.question.id} style={weak ? { borderColor: "#F0C6C1" } : undefined}>
              <p className="font-bold text-[13px] mb-1" style={{ color: COLORS.text }}>Q{i + 1}. {pq.question.text}</p>
              {weak && (
                <p className="text-[11px] font-semibold mb-2 flex items-center gap-1" style={{ color: COLORS.danger }}>
                  <AlertTriangle size={12} /> Notion à revoir en priorité avec la classe
                </p>
              )}
              <div className="flex gap-2 mb-3 flex-wrap">
                <Badge tone={weak ? "danger" : "success"} icon={CheckCircle2}>{pq.rate}% correct</Badge>
                <Badge tone="danger" icon={XCircle}>{pq.incorrect} erreurs</Badge>
                <Badge tone="warning" icon={UserX}>{pq.noAnswer} sans réponse</Badge>
              </div>
              <DistBar dist={pq.dist} total={r.students.length} correctKey={pq.question.correct} />
            </Card>
          );
        })}
      </div>
    </Screen>
  );
}
function ResultsByStudentScreen({ ctx }) {
  const { sessionId, studentId } = ctx.nav.current.params;
  const r = computeResults(ctx, sessionId);
  const [search, setSearch] = useState("");
  const selected = studentId ? r.perStudent.find((p) => p.student.id === studentId) : null;
  if (selected) {
    return (
      <Screen>
        <TopBar title={selected.student.name} subtitle={`Carte #${selected.student.cardNumber || "—"}`} onBack={() => ctx.nav.push("sessionResultsByStudent", { sessionId })} />
        <div className="px-4 pt-4">
          <Card className="flex items-center justify-between mb-4" style={{ background: COLORS.primarySoft, border: "none" }}>
            <div><p className="text-[12px] font-semibold" style={{ color: COLORS.primaryDark }}>Score</p><p className="text-[24px] font-extrabold" style={{ color: COLORS.primary }}>{selected.score}/{r.questions.length}</p></div>
            <p className="text-[26px] font-extrabold" style={{ color: COLORS.primary }}>{selected.pct}%</p>
          </Card>
          <div className="space-y-2">
            {selected.detail.map((d, i) => (
              <Card key={d.question.id} className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-[12.5px] font-medium truncate" style={{ color: COLORS.text }}>Q{i + 1}. {d.question.text}</p>
                  <p className="text-[11px]" style={{ color: COLORS.muted }}>Réponse : {d.choice || "aucune"} · Correcte : {d.question.correct}</p>
                </div>
                {d.choice ? (d.correct ? <CheckCircle2 size={18} color={COLORS.success} /> : <XCircle size={18} color={COLORS.danger} />) : <UserX size={18} color={COLORS.muted} />}
              </Card>
            ))}
          </div>
        </div>
      </Screen>
    );
  }
  const filtered = r.perStudent.filter((p) => p.student.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <Screen>
      <TopBar title="Résultats" subtitle={`${r.loc.cls.name} · ${r.questionnaire.title}`} onBack={() => ctx.nav.pop()} />
      <ResultsTabs ctx={ctx} sessionId={sessionId} active="sessionResultsByStudent" />
      <div className="px-4">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl mb-3" style={{ background: "#F2F4F7" }}>
          <Search size={15} color={COLORS.muted} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un élève" className="flex-1 bg-transparent outline-none text-[13px]" />
        </div>
        <div className="space-y-1.5 max-h-[500px] overflow-y-auto">
          {filtered.map((p) => (
            <Card key={p.student.id} onClick={() => ctx.nav.push("sessionResultsByStudent", { sessionId, studentId: p.student.id })} className="flex items-center justify-between !py-2.5">
              <span className="text-[12.5px] font-medium truncate" style={{ color: COLORS.text }}>{p.student.name}</span>
              <div className="flex items-center gap-2"><span className="text-[11.5px]" style={{ color: COLORS.muted }}>{p.score}/{r.questions.length}</span><Badge tone={p.pct >= 50 ? "success" : "danger"}>{p.pct}%</Badge></div>
            </Card>
          ))}
        </div>
      </div>
    </Screen>
  );
}

/* Synchronisation — avec horodatage et seuils d'alerte */
function SyncScreen({ ctx }) {
  const [syncing, setSyncing] = useState(false);
  const teacher = ctx.currentUser.type === "teacher" ? findTeacher(ctx.data, ctx.currentUser.id) : null;
  const sessions = teacher ? ctx.data.sessions.filter((s) => s.teacherId === teacher.id) : ctx.data.sessions;
  const alert = getSyncAlertLevel(ctx.data);

  const syncNow = () => {
    if (!ctx.isOnline) return;
    setSyncing(true);
    setTimeout(() => {
      ctx.setData((d) => ({ ...d, sessions: d.sessions.map((s) => (s.syncStatus === "pending" || s.syncStatus === "error") ? { ...s, syncStatus: "synced", lastSyncedAt: Date.now() } : s) }));
      setSyncing(false);
      ctx.showToast("Synchronisation terminée");
    }, 1100);
  };

  const statusMeta = {
    synced: { label: "Synchronisé", tone: "success", icon: CheckCircle2 },
    pending: { label: "En attente", tone: "warning", icon: Clock },
    error: { label: "Erreur de synchronisation", tone: "danger", icon: AlertTriangle },
    offline: { label: "Hors ligne", tone: "neutral", icon: CloudOff },
  };

  return (
    <Screen>
      <TopBar title="Synchronisation" onBack={() => ctx.nav.pop()} />
      <div className="px-4 pt-4">
        <Card className="flex items-center gap-2 mb-4">
          {ctx.isOnline ? <Wifi size={18} color={COLORS.success} /> : <WifiOff size={18} color={COLORS.warning} />}
          <div>
            <p className="font-bold text-[13.5px]" style={{ color: COLORS.text }}>{ctx.isOnline ? "Connexion disponible" : "Mode hors ligne"}</p>
            <p className="text-[11px]" style={{ color: COLORS.muted }}>{ctx.isOnline ? "Détectée automatiquement — synchronisation en cours dès qu'une donnée change." : "Détecté automatiquement — les données seront envoyées dès le retour du réseau."}</p>
          </div>
        </Card>

        {alert.level !== "ok" && (
          <Card className="mb-4 flex items-center gap-2" style={{ background: alert.level === "critical" ? COLORS.dangerSoft : COLORS.warningSoft, border: "none" }}>
            <AlertTriangle size={16} color={alert.level === "critical" ? COLORS.danger : COLORS.warning} />
            <p className="text-[12px] font-semibold" style={{ color: alert.level === "critical" ? COLORS.danger : COLORS.warning }}>
              {alert.count} session(s) en attente{alert.oldestDays > 0 ? `, la plus ancienne depuis ${alert.oldestDays} jour(s)` : ""}. Connectez-vous pour sécuriser vos données.
            </p>
          </Card>
        )}

        {sessions.length === 0 ? (
          <EmptyState icon={UploadCloud} title="Rien à synchroniser" text="Vos évaluations apparaîtront ici une fois créées." />
        ) : (
          <div className="space-y-1.5 mb-4">
            {sessions.map((s) => {
              const { cls } = locateClass(ctx.data, s.classId) || {};
              const meta = statusMeta[ctx.isOnline ? s.syncStatus : "offline"] || statusMeta.pending;
              return (
                <Card key={s.id} className="flex items-center justify-between !py-2.5">
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-medium truncate" style={{ color: COLORS.text }}>{cls?.name} · {s.date}</p>
                    <p className="text-[11px]" style={{ color: COLORS.muted }}>{s.lastSyncedAt ? `Synchronisé à ${new Date(s.lastSyncedAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}` : "Jamais synchronisé"}</p>
                  </div>
                  <Badge tone={meta.tone} icon={meta.icon}>{meta.label}</Badge>
                </Card>
              );
            })}
          </div>
        )}
        <Btn full icon={syncing ? RefreshCw : UploadCloud} disabled={!ctx.isOnline || syncing} onClick={syncNow}>{syncing ? "Synchronisation en cours…" : "Synchroniser maintenant"}</Btn>
        {!ctx.isOnline && <p className="text-[11.5px] mt-2 text-center" style={{ color: COLORS.warning }}>Activez la connexion pour synchroniser.</p>}
      </div>
    </Screen>
  );
}

/* ================================ APP ROOT ================================ */
const SCREENS = {
  welcome: WelcomeScreen, register: RegisterWizardScreen, login: LoginScreen,
  forcedPasswordChange: ForcedPasswordChangeScreen, forgotPassword: ForgotPasswordScreen, myProfile: MyProfileScreen,
  adminDashboard: AdminDashboardScreen, myEstablishment: MyEstablishmentScreen,
  years: YearsScreen, classes: ClassesScreen, classDetails: ClassDetailsScreen,
  importStudents: ImportStudentsScreen, importPreview: ImportPreviewScreen,
  subjects: SubjectsScreen, teachersList: TeachersListScreen, createTeacher: CreateTeacherScreen,
  shareCredentials: ShareCredentialsScreen, assignTeacher: AssignTeacherScreen, assignClassesToTeacher: AssignClassesToTeacherScreen,
  teacherDashboard: TeacherDashboardScreen, affectationDetails: AffectationDetailsScreen,
  evaluationsList: EvaluationsListScreen, resultsList: EvaluationsListScreen,
  courses: CoursesScreen, competencies: CompetenciesScreen,
  questionnaires: QuestionnairesScreen, createQuestionnaire: CreateQuestionnaireScreen, createQuestion: CreateQuestionScreen,
  evalPrep: EvalPrepScreen, sessionQuestion: SessionQuestionScreen, scanSimulation: ScanSimulationScreen,
  verifyAnswers: VerifyAnswersScreen, sessionResultsGlobal: ResultsGlobalScreen,
  sessionResultsByQuestion: ResultsByQuestionScreen, sessionResultsByStudent: ResultsByStudentScreen, sync: SyncScreen,
};
const NO_BOTTOM_BAR_APP = new Set(["scanSimulation"]);

export default function KagatPrototype() {
  const [data, setData] = useState(makeInitialData);
  const [isOnline, setIsOnline] = useState(() => (typeof navigator !== "undefined" ? navigator.onLine : true));
  const [currentUser, setCurrentUser] = useState(null);
  const [mode, setMode] = useState("auth"); // 'auth' | 'app'
  const [authStack, setAuthStack] = useState([{ screen: "welcome", params: {} }]);
  const [activeTab, setActiveTab] = useState("accueil");
  const [tabStacks, setTabStacks] = useState({});
  const [fontScale, setFontScale] = useState(1); // 1 = normal, 1.15 = grand texte
  const [onboardingSeen, setOnboardingSeen] = useState(false);
  const [toasts, setToasts] = useState([]);

  const dismissToast = (id) => setToasts((t) => t.filter((x) => x.id !== id));
  const showToast = (message, opts = {}) => {
    const id = uid("toast");
    setToasts((t) => [...t, { id, message, tone: opts.tone || "success", actionLabel: opts.actionLabel, onAction: opts.onAction }]);
    setTimeout(() => dismissToast(id), opts.duration || 3500);
  };

  // Détection automatique de la connectivité réelle de l'appareil — aucune action de l'utilisateur requise.
  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => { window.removeEventListener("online", goOnline); window.removeEventListener("offline", goOffline); };
  }, []);

  // Synchronisation automatique en arrière-plan, quel que soit l'écran affiché ou le rôle connecté —
  // ne dépend jamais d'une visite manuelle de l'écran "Synchronisation".
  useEffect(() => {
    if (!isOnline) return;
    const hasPending = data.sessions.some((s) => s.syncStatus === "pending" || s.syncStatus === "error");
    if (!hasPending) return;
    const timer = setTimeout(() => {
      setData((d) => ({ ...d, sessions: d.sessions.map((s) => (s.syncStatus === "pending" || s.syncStatus === "error") ? { ...s, syncStatus: "synced", lastSyncedAt: Date.now() } : s) }));
    }, 900);
    return () => clearTimeout(timer);
  }, [isOnline, data.sessions]);

  const enterApp = (role) => {
    const tabs = role === "admin" ? ADMIN_TABS : (data.establishment?.accountType === "independent" ? INDEPENDENT_TABS : TEACHER_TABS);
    const initial = {};
    tabs.forEach((t) => { initial[t.key] = [{ screen: t.root, params: {} }]; });
    setTabStacks(initial);
    setActiveTab(tabs[0].key);
    setMode("app");
  };
  const exitApp = () => { setMode("auth"); setAuthStack([{ screen: "welcome", params: {} }]); };

  const nav = {
    push: (screen, params = {}) => {
      if (mode === "auth") setAuthStack((s) => [...s, { screen, params }]);
      else setTabStacks((prev) => ({ ...prev, [activeTab]: [...(prev[activeTab] || []), { screen, params }] }));
    },
    pop: () => {
      if (mode === "auth") setAuthStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
      else setTabStacks((prev) => { const cur = prev[activeTab] || []; return { ...prev, [activeTab]: cur.length > 1 ? cur.slice(0, -1) : cur }; });
    },
    resetTo: (screen, params = {}) => {
      if (mode === "auth") setAuthStack([{ screen, params }]);
      else setTabStacks((prev) => ({ ...prev, [activeTab]: [{ screen, params }] }));
    },
    switchTab: (tabKey) => {
      if (tabKey === activeTab) {
        const tabs = currentUser?.type === "admin" ? ADMIN_TABS : (data.establishment?.accountType === "independent" ? INDEPENDENT_TABS : TEACHER_TABS);
        const root = tabs.find((t) => t.key === tabKey)?.root;
        setTabStacks((prev) => ({ ...prev, [tabKey]: [{ screen: root, params: {} }] }));
      } else setActiveTab(tabKey);
    },
    activeTab,
    get current() {
      const stack = mode === "auth" ? authStack : (tabStacks[activeTab] || [{ screen: "adminDashboard", params: {} }]);
      return stack[stack.length - 1];
    },
  };

  const ctx = { data, setData, isOnline, setIsOnline, currentUser, setCurrentUser, nav, enterApp, exitApp, fontScale, setFontScale, onboardingSeen, setOnboardingSeen, showToast };
  const current = nav.current;
  const ScreenComponent = SCREENS[current.screen] || WelcomeScreen;
  const showBottomBar = mode === "app" && !NO_BOTTOM_BAR_APP.has(current.screen);

  return (
    <div className="prototype-stage w-full min-h-[100vh] flex items-center justify-center py-6" style={{ fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif" }}>
      <div className="prototype-note hidden sm:flex"><Info size={14} /><span>Prototype déployé présentant les fonctionnalités de base de l’application KAGAT.</span></div>
      <div className="phone-shell relative w-full max-w-[410px] flex flex-col overflow-hidden" style={{ background: COLORS.bg }}>
        <div className="phone-status flex items-center justify-between px-6 pt-2 pb-1 text-[10px] font-bold shrink-0" style={{ color: COLORS.text, background: COLORS.surface }}>
          <span>9:41</span>
          <div className="flex items-center gap-1">{isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}<span>KAGAT</span></div>
        </div>
        <div className="app-scroll flex-1 overflow-y-auto relative" style={{ background: COLORS.bg, zoom: fontScale }}>
          <ScreenComponent ctx={ctx} />
        </div>
        {showBottomBar && <div style={{ zoom: fontScale }}><BottomTabBar ctx={ctx} /></div>}
        <ToastHost toasts={toasts} onDismiss={dismissToast} />
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, value, label, tone = "primary" }) {
  const color = tone === "accent" ? COLORS.accent : tone === "success" ? COLORS.success : tone === "warning" ? COLORS.warning : COLORS.primary;
  const soft = tone === "accent" ? COLORS.accentSoft : tone === "success" ? COLORS.successSoft : tone === "warning" ? COLORS.warningSoft : COLORS.primarySoft;
  return (
    <Card className="stat-card">
      <div className="stat-icon" style={{ background: soft, color }}><Icon size={17} /></div>
      <p className="text-[23px] font-extrabold tracking-[-0.04em] mt-3" style={{ color: COLORS.text }}>{value}</p>
      <p className="text-[10.5px] font-semibold mt-0.5" style={{ color: COLORS.muted }}>{label}</p>
    </Card>
  );
}

function PageAction({ icon: Icon = Plus, title, subtitle, onClick, tone = "primary" }) {
  return (
    <button onClick={onClick} className={`page-action page-action--${tone} w-full flex items-center gap-3 text-left`}>
      <span className="page-action-icon"><Icon size={19} /></span>
      <span className="flex-1"><b>{title}</b>{subtitle && <small>{subtitle}</small>}</span>
      <ChevronRight size={17} />
    </button>
  );
}
