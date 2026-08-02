import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Building2,
  Calendar,
  Users,
  BookOpen,
  ClipboardList,
  ScanLine,
  CheckCircle2,
  XCircle,
  Wifi,
  WifiOff,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Plus,
  Upload,
  Edit3,
  Trash2,
  ArrowRight,
  BarChart3,
  User,
  Check,
  AlertTriangle,
  FileSpreadsheet,
  CreditCard,
  GraduationCap,
  School,
  Search,
  Home,
  PlayCircle,
  Camera,
  Save,
  X,
  ListChecks,
  PieChart,
  UserCheck,
  UserX,
  Clock,
  CloudOff,
  UploadCloud,
  LogIn,
  Info,
  Pencil,
} from "lucide-react";

/* =========================================================================
   KAGAT — Prototype UX interactif
   Application d'évaluation formative par cartes-réponses (type Plickers)
   Prototype front-end seul : données simulées, stockage en mémoire (React
   state) le temps de la session. Écrit en JavaScript (JSX) plutôt qu'en
   TypeScript car l'aperçu d'artefact ne dispose pas de compilateur TS —
   la structure des données ci-dessous suit néanmoins un modèle strict,
   commenté comme le seraient des interfaces TypeScript.
   ========================================================================= */

/* ------------------------------- THEME ---------------------------------- */
const COLORS = {
  bg: "#F5F7FA",
  surface: "#FFFFFF",
  primary: "#1E4B8F",
  primaryDark: "#153864",
  primarySoft: "#E7EEF9",
  success: "#1D8A72",
  successSoft: "#E4F4EF",
  warning: "#C97A1A",
  warningSoft: "#FBF0DF",
  danger: "#C0392B",
  dangerSoft: "#FBEAE8",
  text: "#1F2933",
  muted: "#6B7280",
  border: "#E3E7EC",
};

/* ---------------------------- DONNEES DEMO ------------------------------- */
const FIRST_NAMES = [
  "Nadir",
  "Yasmine",
  "Omar",
  "Chaimaa",
  "Karim",
  "Ines",
  "Bilal",
  "Sofia",
  "Amine",
  "Nour",
  "Rania",
  "Walid",
  "Meriem",
  "Hamza",
  "Dounia",
  "Sami",
  "Aya",
  "Riyad",
  "Feriel",
  "Nassim",
  "Imane",
  "Anis",
  "Sarah",
  "Youssef",
  "Lydia",
  "Rachid",
  "Amel",
  "Khaled",
  "Nesrine",
  "Tarek",
];
const LAST_NAMES = [
  "Cherif",
  "Toure",
  "Haddad",
  "Rahal",
  "Belkacem",
  "Meziane",
  "Boudiaf",
  "Ferhat",
  "Zerrouki",
  "Aouadi",
  "Brahimi",
  "Chaib",
  "Yousfi",
  "Guerroudj",
  "Khelifi",
  "Saidi",
  "Larbi",
  "Boukhari",
  "Djelloul",
  "Merabet",
  "Hamdi",
  "Abbas",
  "Kara",
  "Chettouh",
  "Slimani",
  "Bouzid",
  "Naceri",
  "Djaidja",
  "Rezki",
  "Bouazza",
];

function generateStudents(count) {
  const explicit = [
    { name: "Sara Benali", card: "001" },
    { name: "Adam Amrani", card: "002" },
    { name: "Lina Kaci", card: "003" },
    { name: "Yacine Bensaid", card: "004" },
    { name: "Mariam Diallo", card: "005" },
  ];
  const students = explicit.map((s, i) => ({
    id: `st${i + 1}`,
    name: s.name,
    studentCode: `EL${String(i + 1).padStart(3, "0")}`,
    cardNumber: s.card,
    cardAssigned: true,
  }));
  let idx = explicit.length;
  while (students.length < count) {
    idx++;
    const fn = FIRST_NAMES[idx % FIRST_NAMES.length];
    const ln = LAST_NAMES[(idx * 7) % LAST_NAMES.length];
    students.push({
      id: `st${idx}`,
      name: `${fn} ${ln}`,
      studentCode: `EL${String(idx).padStart(3, "0")}`,
      cardNumber: String(idx).padStart(3, "0"),
      cardAssigned: true,
    });
  }
  return students;
}

const FRACTIONS_QUESTIONS = [
  {
    id: "q1",
    text: "Quelle fraction représente la moitié d'un tout ?",
    choices: { A: "1/4", B: "1/2", C: "1/3", D: "2/3" },
    correct: "B",
  },
  {
    id: "q2",
    text: "Combien font 1/4 + 1/4 ?",
    choices: { A: "1/2", B: "1/4", C: "2/8", D: "1/8" },
    correct: "A",
  },
  {
    id: "q3",
    text: "Quelle est la fraction la plus grande ?",
    choices: { A: "1/2", B: "1/3", C: "1/4", D: "1/5" },
    correct: "A",
  },
  {
    id: "q4",
    text: "3/6 est égal à quelle fraction simplifiée ?",
    choices: { A: "1/3", B: "1/2", C: "2/3", D: "3/4" },
    correct: "B",
  },
  {
    id: "q5",
    text: "Un gâteau est coupé en 8 parts égales. Combien de parts représentent 3/8 ?",
    choices: { A: "2 parts", B: "3 parts", C: "4 parts", D: "5 parts" },
    correct: "B",
  },
];

function makeInitialData() {
  return {
    teacher: { name: "Mme Amina Diallo" },
    establishments: [
      {
        id: "e1",
        name: "École Al Amal",
        years: [
          {
            id: "y1",
            label: "2026–2027",
            classes: [
              {
                id: "c1",
                name: "5e année A",
                level: "5e année",
                students: generateStudents(100),
                subjects: [
                  {
                    id: "s1",
                    name: "Mathématiques",
                    questionnaires: [
                      {
                        id: "qz1",
                        title: "Les fractions",
                        description: "Notions de base sur les fractions",
                        questions: FRACTIONS_QUESTIONS,
                      },
                    ],
                  },
                  { id: "s2", name: "Français", questionnaires: [] },
                  { id: "s3", name: "Sciences", questionnaires: [] },
                ],
              },
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
  for (const est of data.establishments) {
    for (const yr of est.years) {
      const cls = yr.classes.find((c) => c.id === classId);
      if (cls) return { est, yr, cls };
    }
  }
  return null;
}
function updateClass(data, classId, updater) {
  return {
    ...data,
    establishments: data.establishments.map((est) => ({
      ...est,
      years: est.years.map((yr) => ({
        ...yr,
        classes: yr.classes.map((c) => (c.id === classId ? updater(c) : c)),
      })),
    })),
  };
}
function updateYear(data, estId, yearId, updater) {
  return {
    ...data,
    establishments: data.establishments.map((est) =>
      est.id === estId
        ? {
            ...est,
            years: est.years.map((y) => (y.id === yearId ? updater(y) : y)),
          }
        : est,
    ),
  };
}
function updateSession(data, sessionId, updater) {
  return {
    ...data,
    sessions: data.sessions.map((s) => (s.id === sessionId ? updater(s) : s)),
  };
}
function findSession(data, sessionId) {
  return data.sessions.find((s) => s.id === sessionId);
}
function findQuestionnaire(cls, subjectId, questionnaireId) {
  const subject = cls.subjects.find((s) => s.id === subjectId);
  if (!subject) return { subject: null, questionnaire: null };
  const questionnaire = subject.questionnaires.find(
    (q) => q.id === questionnaireId,
  );
  return { subject, questionnaire };
}
function uid(prefix) {
  return `${prefix}${Math.random().toString(36).slice(2, 9)}`;
}

/* ------------------------------ UI PRIMITIVES ----------------------------- */
function TopBar({ title, subtitle, onBack, right }) {
  return (
    <div
      className="flex items-center gap-2 px-4 pt-3 pb-3 sticky top-0 z-20"
      style={{
        background: COLORS.surface,
        borderBottom: `1px solid ${COLORS.border}`,
      }}
    >
      {onBack ? (
        <button
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-full -ml-1 active:scale-95 transition"
          style={{ background: COLORS.primarySoft }}
          aria-label="Retour"
        >
          <ChevronLeft size={20} color={COLORS.primary} />
        </button>
      ) : (
        <div className="w-9 h-9" />
      )}
      <div className="flex-1 min-w-0">
        <h1
          className="text-[15px] font-bold truncate"
          style={{ color: COLORS.text }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-[11px] truncate" style={{ color: COLORS.muted }}>
            {subtitle}
          </p>
        )}
      </div>
      {right}
    </div>
  );
}

function Btn({
  children,
  onClick,
  variant = "primary",
  full,
  disabled,
  icon: Icon,
  size = "md",
  type = "button",
}) {
  const styles = {
    primary: {
      background: disabled ? "#A9B8CE" : COLORS.primary,
      color: "#fff",
    },
    secondary: { background: COLORS.primarySoft, color: COLORS.primary },
    ghost: {
      background: "transparent",
      color: COLORS.primary,
      border: `1px solid ${COLORS.border}`,
    },
    danger: { background: disabled ? "#E9B8B2" : COLORS.danger, color: "#fff" },
    success: {
      background: disabled ? "#A9D3C6" : COLORS.success,
      color: "#fff",
    },
  };
  const pad =
    size === "sm" ? "py-2 px-3 text-[12.5px]" : "py-3 px-4 text-[14px]";
  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`rounded-xl font-semibold flex items-center justify-center gap-2 transition active:scale-[0.98] ${pad} ${full ? "w-full" : ""} ${disabled ? "cursor-not-allowed" : ""}`}
      style={styles[variant]}
    >
      {Icon && <Icon size={size === "sm" ? 15 : 17} />}
      {children}
    </button>
  );
}

function Card({ children, className = "", onClick, style }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl p-4 ${onClick ? "cursor-pointer active:scale-[0.99] transition" : ""} ${className}`}
      style={{
        background: COLORS.surface,
        border: `1px solid ${COLORS.border}`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Badge({ children, tone = "neutral", icon: Icon }) {
  const tones = {
    neutral: { bg: "#EEF1F4", fg: COLORS.muted },
    primary: { bg: COLORS.primarySoft, fg: COLORS.primary },
    success: { bg: COLORS.successSoft, fg: COLORS.success },
    warning: { bg: COLORS.warningSoft, fg: COLORS.warning },
    danger: { bg: COLORS.dangerSoft, fg: COLORS.danger },
  };
  const t = tones[tone];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold"
      style={{ background: t.bg, color: t.fg }}
    >
      {Icon && <Icon size={12} />}
      {children}
    </span>
  );
}

function Field({ label, children }) {
  return (
    <label className="block mb-3">
      <span
        className="block text-[12px] font-semibold mb-1.5"
        style={{ color: COLORS.text }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}

const inputStyle = {
  width: "100%",
  padding: "11px 12px",
  borderRadius: 12,
  border: `1px solid ${COLORS.border}`,
  fontSize: 13.5,
  color: COLORS.text,
  background: "#FBFCFD",
  outline: "none",
};

function TextInput(props) {
  return (
    <input
      {...props}
      style={{ ...inputStyle, ...(props.style || {}) }}
      className="focus:ring-2"
    />
  );
}
function TextArea(props) {
  return (
    <textarea
      {...props}
      style={{ ...inputStyle, resize: "none", ...(props.style || {}) }}
    />
  );
}

function EmptyState({ icon: Icon, title, text, action }) {
  return (
    <div className="flex flex-col items-center text-center py-10 px-6">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
        style={{ background: COLORS.primarySoft }}
      >
        <Icon size={24} color={COLORS.primary} />
      </div>
      <p className="font-bold text-[14px] mb-1" style={{ color: COLORS.text }}>
        {title}
      </p>
      <p className="text-[12.5px] mb-4" style={{ color: COLORS.muted }}>
        {text}
      </p>
      {action}
    </div>
  );
}

function Screen({ children }) {
  return <div className="pb-6">{children}</div>;
}

function ConfirmModal({
  open,
  title,
  text,
  onCancel,
  onConfirm,
  confirmLabel = "Confirmer",
  danger,
}) {
  if (!open) return null;
  return (
    <div
      className="absolute inset-0 z-50 flex items-end justify-center"
      style={{ background: "rgba(15,23,33,0.45)" }}
    >
      <div
        className="w-full rounded-t-2xl p-5"
        style={{ background: COLORS.surface }}
      >
        <p
          className="font-bold text-[15px] mb-1"
          style={{ color: COLORS.text }}
        >
          {title}
        </p>
        <p className="text-[13px] mb-4" style={{ color: COLORS.muted }}>
          {text}
        </p>
        <div className="flex gap-2">
          <Btn variant="ghost" full onClick={onCancel}>
            Annuler
          </Btn>
          <Btn variant={danger ? "danger" : "primary"} full onClick={onConfirm}>
            {confirmLabel}
          </Btn>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ BOTTOM BAR -------------------------------- */
function BottomStatusBar({ ctx }) {
  const pending = ctx.data.sessions.filter(
    (s) => s.syncStatus === "pending" || s.syncStatus === "error",
  ).length;
  return (
    <div
      className="flex items-center justify-between px-4 py-2.5 sticky bottom-0 z-20"
      style={{
        background: COLORS.surface,
        borderTop: `1px solid ${COLORS.border}`,
      }}
    >
      <button
        onClick={() => ctx.nav.resetTo("dashboard")}
        className="flex flex-col items-center gap-0.5 px-3"
      >
        <Home size={18} color={COLORS.primary} />
        <span
          className="text-[10px] font-semibold"
          style={{ color: COLORS.primary }}
        >
          Accueil
        </span>
      </button>
      <button
        onClick={() => ctx.nav.push("sync")}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full"
        style={{
          background: ctx.isOnline ? COLORS.successSoft : COLORS.warningSoft,
        }}
      >
        {ctx.isOnline ? (
          <Wifi size={15} color={COLORS.success} />
        ) : (
          <WifiOff size={15} color={COLORS.warning} />
        )}
        <span
          className="text-[11px] font-semibold"
          style={{ color: ctx.isOnline ? COLORS.success : COLORS.warning }}
        >
          {ctx.isOnline ? "En ligne" : "Hors ligne"}
        </span>
        {pending > 0 && (
          <span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
            style={{ background: COLORS.danger, color: "#fff" }}
          >
            {pending}
          </span>
        )}
      </button>
    </div>
  );
}

/* ================================ ÉCRANS ================================= */

/* 1. Connexion / profil enseignant */
function LoginScreen({ ctx }) {
  const [offline, setOffline] = useState(false);
  return (
    <Screen>
      <div className="flex flex-col items-center justify-center pt-16 px-6 pb-8">
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
          style={{ background: COLORS.primary }}
        >
          <ScanLine size={34} color="#fff" />
        </div>
        <h1
          className="text-[22px] font-extrabold mb-1"
          style={{ color: COLORS.text }}
        >
          KAGAT
        </h1>
        <p
          className="text-[13px] text-center mb-8"
          style={{ color: COLORS.muted }}
        >
          Évaluation formative par cartes-réponses,
          <br />
          même sans connexion Internet.
        </p>

        <Card className="w-full flex items-center gap-3 mb-5">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center"
            style={{ background: COLORS.primarySoft }}
          >
            <User size={20} color={COLORS.primary} />
          </div>
          <div>
            <p className="font-bold text-[14px]" style={{ color: COLORS.text }}>
              {ctx.data.teacher.name}
            </p>
            <p className="text-[12px]" style={{ color: COLORS.muted }}>
              Enseignante
            </p>
          </div>
        </Card>

        <Card className="w-full flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {offline ? (
              <WifiOff size={17} color={COLORS.warning} />
            ) : (
              <Wifi size={17} color={COLORS.success} />
            )}
            <span
              className="text-[13px] font-semibold"
              style={{ color: COLORS.text }}
            >
              Fonctionner hors ligne
            </span>
          </div>
          <button
            onClick={() => setOffline((v) => !v)}
            className="w-11 h-6 rounded-full relative transition"
            style={{ background: offline ? COLORS.warning : COLORS.border }}
          >
            <span
              className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all"
              style={{ left: offline ? 22 : 2 }}
            />
          </button>
        </Card>

        <Btn
          full
          icon={LogIn}
          onClick={() => {
            ctx.setIsOnline(!offline);
            ctx.nav.resetTo("dashboard");
          }}
        >
          Commencer
        </Btn>
        <p
          className="text-[11px] mt-4 text-center"
          style={{ color: COLORS.muted }}
        >
          Vos données sont conservées sur l'appareil et synchronisées dès que la
          connexion revient.
        </p>
      </div>
    </Screen>
  );
}

/* 2. Tableau de bord */
function DashboardScreen({ ctx }) {
  const pendingSessions = ctx.data.sessions.filter(
    (s) => s.syncStatus !== "synced",
  );
  const recentSessions = [...ctx.data.sessions].slice(-3).reverse();

  return (
    <Screen>
      <TopBar
        title={`Bonjour, ${ctx.data.teacher.name.split(" ").slice(-1)}`}
        subtitle="Tableau de bord"
        right={
          <button onClick={() => ctx.nav.push("sync")} className="p-1">
            {ctx.isOnline ? (
              <Wifi size={18} color={COLORS.success} />
            ) : (
              <WifiOff size={18} color={COLORS.warning} />
            )}
          </button>
        }
      />
      <div className="px-4 pt-4 space-y-3">
        <Card
          onClick={() => ctx.nav.push("evalPrep")}
          className="flex items-center gap-3"
          style={{ background: COLORS.primary, border: "none" }}
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.18)" }}
          >
            <PlayCircle size={22} color="#fff" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-[14px]" style={{ color: "#fff" }}>
              Nouvelle évaluation
            </p>
            <p
              className="text-[11.5px]"
              style={{ color: "rgba(255,255,255,0.8)" }}
            >
              Lancer une session de scan
            </p>
          </div>
          <ArrowRight size={18} color="#fff" />
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Card
            onClick={() => ctx.nav.push("establishments")}
            className="flex flex-col items-start gap-2"
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: COLORS.primarySoft }}
            >
              <School size={17} color={COLORS.primary} />
            </div>
            <p className="font-bold text-[13px]" style={{ color: COLORS.text }}>
              Mes classes
            </p>
          </Card>
          <Card
            onClick={() =>
              ctx.nav.push("questionnaires", { classId: "c1", subjectId: "s1" })
            }
            className="flex flex-col items-start gap-2"
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: COLORS.primarySoft }}
            >
              <ClipboardList size={17} color={COLORS.primary} />
            </div>
            <p className="font-bold text-[13px]" style={{ color: COLORS.text }}>
              Mes questionnaires
            </p>
          </Card>
        </div>

        <div>
          <p
            className="font-bold text-[13px] mb-2 mt-1"
            style={{ color: COLORS.text }}
          >
            Évaluations récentes
          </p>
          {recentSessions.length === 0 ? (
            <Card className="text-center py-6">
              <p className="text-[12.5px]" style={{ color: COLORS.muted }}>
                Aucune évaluation pour l'instant.
              </p>
            </Card>
          ) : (
            <div className="space-y-2">
              {recentSessions.map((s) => {
                const { cls } = locateClass(ctx.data, s.classId) || {};
                const { questionnaire } = cls
                  ? findQuestionnaire(cls, s.subjectId, s.questionnaireId)
                  : {};
                return (
                  <Card
                    key={s.id}
                    onClick={() =>
                      ctx.nav.push("sessionResultsGlobal", { sessionId: s.id })
                    }
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p
                        className="font-semibold text-[13px]"
                        style={{ color: COLORS.text }}
                      >
                        {questionnaire?.title}
                      </p>
                      <p
                        className="text-[11.5px]"
                        style={{ color: COLORS.muted }}
                      >
                        {cls?.name} · {s.date}
                      </p>
                    </div>
                    <Badge
                      tone={s.status === "completed" ? "success" : "warning"}
                    >
                      {s.status === "completed" ? "Terminée" : "En cours"}
                    </Badge>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        <Card
          onClick={() => ctx.nav.push("sync")}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <RefreshCw
              size={16}
              color={pendingSessions.length ? COLORS.warning : COLORS.success}
            />
            <p
              className="text-[13px] font-semibold"
              style={{ color: COLORS.text }}
            >
              Synchronisation
            </p>
          </div>
          <Badge tone={pendingSessions.length ? "warning" : "success"}>
            {pendingSessions.length
              ? `${pendingSessions.length} en attente`
              : "À jour"}
          </Badge>
        </Card>
      </div>
    </Screen>
  );
}

/* 3. Établissements */
function EstablishmentsScreen({ ctx }) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(null);

  const addEstablishment = () => {
    if (!name.trim()) return;
    ctx.setData((d) => ({
      ...d,
      establishments: [
        ...d.establishments,
        { id: uid("e"), name: name.trim(), years: [] },
      ],
    }));
    setName("");
    setAdding(false);
  };

  return (
    <Screen>
      <TopBar title="Établissements" onBack={() => ctx.nav.pop()} />
      <div className="px-4 pt-4 space-y-2">
        {ctx.data.establishments.map((est) => (
          <Card key={est.id} className="flex items-center gap-3">
            <div
              onClick={() => ctx.nav.push("years", { establishmentId: est.id })}
              className="flex-1 flex items-center gap-3 cursor-pointer"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: COLORS.primarySoft }}
              >
                <Building2 size={18} color={COLORS.primary} />
              </div>
              <div>
                {editing === est.id ? (
                  <TextInput
                    autoFocus
                    defaultValue={est.name}
                    onBlur={(e) => {
                      const v = e.target.value.trim() || est.name;
                      ctx.setData((d) => ({
                        ...d,
                        establishments: d.establishments.map((x) =>
                          x.id === est.id ? { ...x, name: v } : x,
                        ),
                      }));
                      setEditing(null);
                    }}
                  />
                ) : (
                  <>
                    <p
                      className="font-bold text-[13.5px]"
                      style={{ color: COLORS.text }}
                    >
                      {est.name}
                    </p>
                    <p
                      className="text-[11.5px]"
                      style={{ color: COLORS.muted }}
                    >
                      {est.years.length} année(s) scolaire(s)
                    </p>
                  </>
                )}
              </div>
            </div>
            {editing !== est.id && (
              <button onClick={() => setEditing(est.id)} className="p-2">
                <Pencil size={15} color={COLORS.muted} />
              </button>
            )}
          </Card>
        ))}

        {adding ? (
          <Card>
            <Field label="Nom de l'établissement">
              <TextInput
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex. École Al Amal"
              />
            </Field>
            <div className="flex gap-2">
              <Btn variant="ghost" full onClick={() => setAdding(false)}>
                Annuler
              </Btn>
              <Btn full onClick={addEstablishment}>
                Ajouter
              </Btn>
            </div>
          </Card>
        ) : (
          <Btn
            variant="secondary"
            full
            icon={Plus}
            onClick={() => setAdding(true)}
          >
            Ajouter un établissement
          </Btn>
        )}
      </div>
    </Screen>
  );
}

/* 4. Années scolaires */
function YearsScreen({ ctx }) {
  const est = ctx.data.establishments.find(
    (e) => e.id === ctx.nav.current.params.establishmentId,
  );
  const [adding, setAdding] = useState(false);
  const [label, setLabel] = useState("");

  if (!est) return null;

  const addYear = () => {
    if (!label.trim()) return;
    ctx.setData((d) => ({
      ...d,
      establishments: d.establishments.map((e) =>
        e.id === est.id
          ? {
              ...e,
              years: [
                ...e.years,
                { id: uid("y"), label: label.trim(), classes: [] },
              ],
            }
          : e,
      ),
    }));
    setLabel("");
    setAdding(false);
  };

  return (
    <Screen>
      <TopBar
        title="Année scolaire"
        subtitle={est.name}
        onBack={() => ctx.nav.pop()}
      />
      <div className="px-4 pt-4 space-y-2">
        {est.years.map((y) => (
          <Card
            key={y.id}
            onClick={() =>
              ctx.nav.push("classes", { establishmentId: est.id, yearId: y.id })
            }
            className="flex items-center gap-3"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: COLORS.primarySoft }}
            >
              <Calendar size={18} color={COLORS.primary} />
            </div>
            <div className="flex-1">
              <p
                className="font-bold text-[13.5px]"
                style={{ color: COLORS.text }}
              >
                {y.label}
              </p>
              <p className="text-[11.5px]" style={{ color: COLORS.muted }}>
                {y.classes.length} classe(s)
              </p>
            </div>
            <ChevronRight size={17} color={COLORS.muted} />
          </Card>
        ))}
        {adding ? (
          <Card>
            <Field label="Année scolaire">
              <TextInput
                autoFocus
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Ex. 2026–2027"
              />
            </Field>
            <div className="flex gap-2">
              <Btn variant="ghost" full onClick={() => setAdding(false)}>
                Annuler
              </Btn>
              <Btn full onClick={addYear}>
                Créer
              </Btn>
            </div>
          </Card>
        ) : (
          <Btn
            variant="secondary"
            full
            icon={Plus}
            onClick={() => setAdding(true)}
          >
            Créer une année scolaire
          </Btn>
        )}
      </div>
    </Screen>
  );
}

/* 5. Liste des classes */
function ClassesScreen({ ctx }) {
  const { establishmentId, yearId } = ctx.nav.current.params;
  const est = ctx.data.establishments.find((e) => e.id === establishmentId);
  const year = est?.years.find((y) => y.id === yearId);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", level: "" });

  if (!year) return null;

  const addClass = () => {
    if (!form.name.trim()) return;
    ctx.setData((d) =>
      updateYear(d, establishmentId, yearId, (y) => ({
        ...y,
        classes: [
          ...y.classes,
          {
            id: uid("c"),
            name: form.name.trim(),
            level: form.level.trim() || form.name.trim(),
            students: [],
            subjects: [],
          },
        ],
      })),
    );
    setForm({ name: "", level: "" });
    setAdding(false);
  };

  return (
    <Screen>
      <TopBar
        title="Classes"
        subtitle={`${est.name} · ${year.label}`}
        onBack={() => ctx.nav.pop()}
      />
      <div className="px-4 pt-4 space-y-2">
        {year.classes.map((c) => (
          <Card
            key={c.id}
            onClick={() => ctx.nav.push("classDetails", { classId: c.id })}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: COLORS.primarySoft }}
              >
                <GraduationCap size={18} color={COLORS.primary} />
              </div>
              <div className="flex-1">
                <p
                  className="font-bold text-[13.5px]"
                  style={{ color: COLORS.text }}
                >
                  {c.name}
                </p>
                <p className="text-[11.5px]" style={{ color: COLORS.muted }}>
                  {c.level}
                </p>
              </div>
              <ChevronRight size={17} color={COLORS.muted} />
            </div>
            <div className="flex gap-2 mt-3">
              <Badge tone="primary" icon={Users}>
                {c.students.length} élèves
              </Badge>
              <Badge tone="neutral" icon={BookOpen}>
                {c.subjects.length} matières
              </Badge>
            </div>
          </Card>
        ))}
        {adding ? (
          <Card>
            <Field label="Nom de la classe">
              <TextInput
                autoFocus
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Ex. 5e année A"
              />
            </Field>
            <Field label="Niveau">
              <TextInput
                value={form.level}
                onChange={(e) =>
                  setForm((f) => ({ ...f, level: e.target.value }))
                }
                placeholder="Ex. 5e année"
              />
            </Field>
            <div className="flex gap-2">
              <Btn variant="ghost" full onClick={() => setAdding(false)}>
                Annuler
              </Btn>
              <Btn full onClick={addClass}>
                Créer
              </Btn>
            </div>
          </Card>
        ) : (
          <Btn
            variant="secondary"
            full
            icon={Plus}
            onClick={() => setAdding(true)}
          >
            Créer une classe
          </Btn>
        )}
      </div>
    </Screen>
  );
}

/* 6. Détails d'une classe */
function ClassDetailsScreen({ ctx }) {
  const { classId } = ctx.nav.current.params;
  const loc = locateClass(ctx.data, classId);
  if (!loc) return null;
  const { cls } = loc;
  const sessionsCount = ctx.data.sessions.filter(
    (s) => s.classId === classId,
  ).length;

  const items = [
    {
      key: "students",
      label: "Élèves",
      icon: Users,
      sub: `${cls.students.length} inscrits`,
      go: () => ctx.nav.push("importStudents", { classId }),
    },
    {
      key: "subjects",
      label: "Matières",
      icon: BookOpen,
      sub: `${cls.subjects.length} matières`,
      go: () => ctx.nav.push("subjects", { classId }),
    },
    {
      key: "evals",
      label: "Évaluations",
      icon: PlayCircle,
      sub: "Lancer ou préparer",
      go: () => ctx.nav.push("evalPrep", { classId }),
    },
    {
      key: "results",
      label: "Résultats",
      icon: BarChart3,
      sub: `${sessionsCount} session(s)`,
      go: () => {
        const last = [...ctx.data.sessions]
          .reverse()
          .find((s) => s.classId === classId);
        if (last) ctx.nav.push("sessionResultsGlobal", { sessionId: last.id });
        else ctx.nav.push("evalPrep", { classId });
      },
    },
  ];

  return (
    <Screen>
      <TopBar
        title={cls.name}
        subtitle={cls.level}
        onBack={() => ctx.nav.pop()}
      />
      <div className="px-4 pt-4 grid grid-cols-2 gap-3">
        {items.map((it) => (
          <Card key={it.key} onClick={it.go} className="flex flex-col gap-2">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: COLORS.primarySoft }}
            >
              <it.icon size={17} color={COLORS.primary} />
            </div>
            <p
              className="font-bold text-[13.5px]"
              style={{ color: COLORS.text }}
            >
              {it.label}
            </p>
            <p className="text-[11px]" style={{ color: COLORS.muted }}>
              {it.sub}
            </p>
          </Card>
        ))}
      </div>
      <div className="px-4 pt-4">
        <Btn
          full
          variant="secondary"
          icon={CreditCard}
          onClick={() => ctx.nav.push("cardAssignment", { classId })}
        >
          Voir les cartes attribuées
        </Btn>
      </div>
    </Screen>
  );
}

/* 7. Importation des élèves */
const SAMPLE_IMPORT_ROWS = [
  { name: "Nadir Cherif", ok: true },
  { name: "", ok: false, reason: "Nom manquant" },
  { name: "Yasmine Toure", ok: true },
  { name: "Yasmine Toure", ok: false, reason: "Doublon détecté" },
  { name: "Omar Haddad", ok: true },
  { name: "Chaimaa Rahal", ok: true },
  { name: "", ok: false, reason: "Ligne vide" },
  { name: "Karim Belkacem", ok: true },
];

function ImportStudentsScreen({ ctx }) {
  const { classId } = ctx.nav.current.params;
  const [manualOpen, setManualOpen] = useState(false);
  const [manualName, setManualName] = useState("");
  const [staged, setStaged] = useState([]);
  const loc = locateClass(ctx.data, classId);
  if (!loc) return null;

  const runSimulatedImport = () => {
    setStaged(
      SAMPLE_IMPORT_ROWS.map((r, i) => ({
        ...r,
        id: uid("imp"),
        rowNumber: i + 1,
      })),
    );
  };

  const addManual = () => {
    if (!manualName.trim()) return;
    setStaged((s) => [
      ...s,
      {
        id: uid("imp"),
        name: manualName.trim(),
        ok: true,
        rowNumber: s.length + 1,
        manual: true,
      },
    ]);
    setManualName("");
    setManualOpen(false);
  };

  return (
    <Screen>
      <TopBar
        title="Importer des élèves"
        subtitle={loc.cls.name}
        onBack={() => ctx.nav.pop()}
      />
      <div className="px-4 pt-4 space-y-3">
        <Card className="flex items-start gap-3">
          <FileSpreadsheet
            size={20}
            color={COLORS.primary}
            className="mt-0.5"
          />
          <div className="flex-1">
            <p
              className="font-semibold text-[13px]"
              style={{ color: COLORS.text }}
            >
              Fichier CSV ou Excel
            </p>
            <p className="text-[11.5px] mb-3" style={{ color: COLORS.muted }}>
              Sélectionnez un fichier contenant la liste des élèves (nom,
              prénom).
            </p>
            <Btn
              variant="secondary"
              size="sm"
              icon={Upload}
              onClick={runSimulatedImport}
            >
              Choisir un fichier
            </Btn>
          </div>
        </Card>

        <div className="flex items-center gap-2">
          <div className="flex-1 h-px" style={{ background: COLORS.border }} />
          <span className="text-[11px]" style={{ color: COLORS.muted }}>
            ou
          </span>
          <div className="flex-1 h-px" style={{ background: COLORS.border }} />
        </div>

        {manualOpen ? (
          <Card>
            <Field label="Nom complet de l'élève">
              <TextInput
                autoFocus
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                placeholder="Ex. Karim Belkacem"
              />
            </Field>
            <div className="flex gap-2">
              <Btn variant="ghost" full onClick={() => setManualOpen(false)}>
                Annuler
              </Btn>
              <Btn full onClick={addManual}>
                Ajouter
              </Btn>
            </div>
          </Card>
        ) : (
          <Btn
            variant="ghost"
            full
            icon={Plus}
            onClick={() => setManualOpen(true)}
          >
            Ajouter un élève manuellement
          </Btn>
        )}

        {staged.length > 0 && (
          <>
            <div className="flex items-center justify-between mt-2">
              <p
                className="font-bold text-[13px]"
                style={{ color: COLORS.text }}
              >
                Aperçu de la liste
              </p>
              <Badge tone="neutral">{staged.length} ligne(s)</Badge>
            </div>
            <Btn
              full
              icon={ArrowRight}
              onClick={() => ctx.nav.push("importPreview", { classId, staged })}
            >
              Vérifier la liste importée
            </Btn>
          </>
        )}
      </div>
    </Screen>
  );
}

/* Aperçu / vérification de l'import */
function ImportPreviewScreen({ ctx }) {
  const { classId, staged } = ctx.nav.current.params;
  const loc = locateClass(ctx.data, classId);
  const [confirmed, setConfirmed] = useState(false);
  if (!loc) return null;

  const valid = staged.filter((r) => r.ok && r.name.trim());
  const invalid = staged.filter((r) => !r.ok || !r.name.trim());

  const confirmImport = () => {
    ctx.setData((d) =>
      updateClass(d, classId, (c) => {
        let nextCardIdx = c.students.length + 1;
        const newStudents = valid.map((r) => ({
          id: uid("st"),
          name: r.name.trim(),
          studentCode: `EL${String(nextCardIdx).padStart(3, "0")}`,
          cardNumber: null,
          cardAssigned: false,
        }));
        nextCardIdx++;
        return { ...c, students: [...c.students, ...newStudents] };
      }),
    );
    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <Screen>
        <TopBar title="Importation confirmée" onBack={() => ctx.nav.pop()} />
        <div className="px-4 pt-10">
          <EmptyState
            icon={CheckCircle2}
            title={`${valid.length} élève(s) importé(s)`}
            text="Vous pouvez maintenant leur attribuer une carte-réponse unique."
            action={
              <Btn
                icon={CreditCard}
                onClick={() => ctx.nav.resetTo("classDetails", { classId })}
              >
                Attribuer les cartes
              </Btn>
            }
          />
        </div>
      </Screen>
    );
  }

  return (
    <Screen>
      <TopBar
        title="Vérifier la liste"
        subtitle={loc.cls.name}
        onBack={() => ctx.nav.pop()}
      />
      <div className="px-4 pt-4">
        <div className="flex gap-2 mb-3">
          <Badge tone="success" icon={CheckCircle2}>
            {valid.length} valides
          </Badge>
          <Badge tone="danger" icon={AlertTriangle}>
            {invalid.length} à corriger
          </Badge>
        </div>
        <div className="space-y-1.5">
          {staged.map((r) => (
            <Card
              key={r.id}
              className="flex items-center justify-between !py-2.5"
              style={{
                background:
                  r.ok && r.name.trim() ? COLORS.surface : COLORS.dangerSoft,
                borderColor: r.ok && r.name.trim() ? COLORS.border : "#F0C6C1",
              }}
            >
              <div className="flex items-center gap-2">
                {r.ok && r.name.trim() ? (
                  <CheckCircle2 size={16} color={COLORS.success} />
                ) : (
                  <XCircle size={16} color={COLORS.danger} />
                )}
                <span
                  className="text-[13px] font-medium"
                  style={{ color: COLORS.text }}
                >
                  {r.name.trim() || "(ligne vide)"}
                </span>
              </div>
              {!r.ok || !r.name.trim() ? (
                <span
                  className="text-[11px] font-semibold"
                  style={{ color: COLORS.danger }}
                >
                  {r.reason || "Nom manquant"}
                </span>
              ) : (
                <span className="text-[11px]" style={{ color: COLORS.muted }}>
                  Ligne {r.rowNumber}
                </span>
              )}
            </Card>
          ))}
        </div>
        <div className="mt-4">
          <Btn
            full
            icon={Check}
            onClick={confirmImport}
            disabled={valid.length === 0}
          >
            Confirmer l'importation ({valid.length})
          </Btn>
        </div>
      </div>
    </Screen>
  );
}

/* 8. Attribution des cartes */
function CardAssignmentScreen({ ctx }) {
  const { classId } = ctx.nav.current.params;
  const loc = locateClass(ctx.data, classId);
  if (!loc) return null;
  const { cls } = loc;
  const unassigned = cls.students.filter((s) => !s.cardAssigned);

  const autoAssign = () => {
    ctx.setData((d) =>
      updateClass(d, classId, (c) => {
        const usedNumbers = c.students
          .filter((s) => s.cardAssigned && s.cardNumber)
          .map((s) => parseInt(s.cardNumber, 10));
        let next = usedNumbers.length ? Math.max(...usedNumbers) + 1 : 1;
        return {
          ...c,
          students: c.students.map((s) =>
            s.cardAssigned
              ? s
              : {
                  ...s,
                  cardAssigned: true,
                  cardNumber: String(next++).padStart(3, "0"),
                },
          ),
        };
      }),
    );
  };

  return (
    <Screen>
      <TopBar
        title="Cartes attribuées"
        subtitle={cls.name}
        onBack={() => ctx.nav.pop()}
      />
      <div className="px-4 pt-4">
        <div className="flex gap-2 mb-3">
          <Badge tone="success" icon={CheckCircle2}>
            {cls.students.length - unassigned.length} attribuées
          </Badge>
          {unassigned.length > 0 && (
            <Badge tone="warning" icon={AlertTriangle}>
              {unassigned.length} en attente
            </Badge>
          )}
        </div>
        {unassigned.length > 0 && (
          <Btn full icon={CreditCard} onClick={autoAssign}>
            Attribuer automatiquement les cartes
          </Btn>
        )}
        <div
          className="mt-3 rounded-2xl overflow-hidden"
          style={{ border: `1px solid ${COLORS.border}` }}
        >
          <div
            className="grid grid-cols-12 px-3 py-2 text-[10.5px] font-bold"
            style={{ background: "#F2F4F7", color: COLORS.muted }}
          >
            <span className="col-span-6">Élève</span>
            <span className="col-span-3">ID</span>
            <span className="col-span-3">Carte</span>
          </div>
          <div className="max-h-[420px] overflow-y-auto">
            {cls.students.map((s, i) => (
              <div
                key={s.id}
                className="grid grid-cols-12 px-3 py-2 items-center text-[12px]"
                style={{
                  borderTop: `1px solid ${COLORS.border}`,
                  background: i % 2 ? "#FBFCFD" : "#fff",
                }}
              >
                <span
                  className="col-span-6 truncate font-medium"
                  style={{ color: COLORS.text }}
                >
                  {s.name}
                </span>
                <span className="col-span-3" style={{ color: COLORS.muted }}>
                  {s.studentCode}
                </span>
                <span className="col-span-3">
                  {s.cardAssigned ? (
                    <Badge tone="primary">#{s.cardNumber}</Badge>
                  ) : (
                    <Badge tone="warning">—</Badge>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Screen>
  );
}

/* 9. Gestion des matières */
function SubjectsScreen({ ctx }) {
  const { classId } = ctx.nav.current.params;
  const loc = locateClass(ctx.data, classId);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  if (!loc) return null;
  const { cls } = loc;

  const addSubject = () => {
    if (!name.trim()) return;
    ctx.setData((d) =>
      updateClass(d, classId, (c) => ({
        ...c,
        subjects: [
          ...c.subjects,
          { id: uid("s"), name: name.trim(), questionnaires: [] },
        ],
      })),
    );
    setName("");
    setAdding(false);
  };

  return (
    <Screen>
      <TopBar
        title="Matières"
        subtitle={cls.name}
        onBack={() => ctx.nav.pop()}
      />
      <div className="px-4 pt-4 space-y-2">
        {cls.subjects.map((s) => (
          <Card
            key={s.id}
            onClick={() =>
              ctx.nav.push("questionnaires", { classId, subjectId: s.id })
            }
            className="flex items-center gap-3"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: COLORS.primarySoft }}
            >
              <BookOpen size={18} color={COLORS.primary} />
            </div>
            <div className="flex-1">
              <p
                className="font-bold text-[13.5px]"
                style={{ color: COLORS.text }}
              >
                {s.name}
              </p>
              <p className="text-[11.5px]" style={{ color: COLORS.muted }}>
                {s.questionnaires.length} questionnaire(s)
              </p>
            </div>
            <ChevronRight size={17} color={COLORS.muted} />
          </Card>
        ))}
        {adding ? (
          <Card>
            <Field label="Nom de la matière">
              <TextInput
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex. Sciences"
              />
            </Field>
            <div className="flex gap-2">
              <Btn variant="ghost" full onClick={() => setAdding(false)}>
                Annuler
              </Btn>
              <Btn full onClick={addSubject}>
                Ajouter
              </Btn>
            </div>
          </Card>
        ) : (
          <Btn
            variant="secondary"
            full
            icon={Plus}
            onClick={() => setAdding(true)}
          >
            Ajouter une matière
          </Btn>
        )}
      </div>
    </Screen>
  );
}

/* 10. Liste des questionnaires (par matière) */
function QuestionnairesScreen({ ctx }) {
  const { classId, subjectId } = ctx.nav.current.params;
  const loc = locateClass(ctx.data, classId);
  if (!loc) return null;
  const { cls } = loc;
  const subject = cls.subjects.find((s) => s.id === subjectId);
  if (!subject) return null;

  return (
    <Screen>
      <TopBar
        title="Questionnaires"
        subtitle={`${cls.name} · ${subject.name}`}
        onBack={() => ctx.nav.pop()}
      />
      <div className="px-4 pt-4 space-y-2">
        {subject.questionnaires.length === 0 && (
          <EmptyState
            icon={ClipboardList}
            title="Aucun questionnaire"
            text="Créez le premier questionnaire de cette matière."
          />
        )}
        {subject.questionnaires.map((q) => (
          <Card
            key={q.id}
            onClick={() =>
              ctx.nav.push("createQuestionnaire", {
                classId,
                subjectId,
                questionnaireId: q.id,
              })
            }
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: COLORS.primarySoft }}
              >
                <ListChecks size={18} color={COLORS.primary} />
              </div>
              <div className="flex-1">
                <p
                  className="font-bold text-[13.5px]"
                  style={{ color: COLORS.text }}
                >
                  {q.title}
                </p>
                <p className="text-[11.5px]" style={{ color: COLORS.muted }}>
                  {q.questions.length} question(s)
                </p>
              </div>
              <ChevronRight size={17} color={COLORS.muted} />
            </div>
          </Card>
        ))}
        <Btn
          variant="secondary"
          full
          icon={Plus}
          onClick={() =>
            ctx.nav.push("createQuestionnaire", { classId, subjectId })
          }
        >
          Créer un questionnaire
        </Btn>
      </div>
    </Screen>
  );
}

/* 11. Création d'un questionnaire */
function CreateQuestionnaireScreen({ ctx }) {
  const { classId, subjectId, questionnaireId } = ctx.nav.current.params;
  const loc = locateClass(ctx.data, classId);
  if (!loc) return null;
  const { cls } = loc;
  const subject = cls.subjects.find((s) => s.id === subjectId);
  const existing = questionnaireId
    ? subject.questionnaires.find((q) => q.id === questionnaireId)
    : null;

  const [title, setTitle] = useState(existing?.title || "");
  const [description, setDescription] = useState(existing?.description || "");
  const [qId] = useState(existing?.id || null);

  const save = () => {
    if (!title.trim()) return;
    if (qId) {
      ctx.setData((d) =>
        updateClass(d, classId, (c) => ({
          ...c,
          subjects: c.subjects.map((s) =>
            s.id === subjectId
              ? {
                  ...s,
                  questionnaires: s.questionnaires.map((q) =>
                    q.id === qId ? { ...q, title, description } : q,
                  ),
                }
              : s,
          ),
        })),
      );
      ctx.nav.push("questionnaires", { classId, subjectId });
    } else {
      const newId = uid("qz");
      ctx.setData((d) =>
        updateClass(d, classId, (c) => ({
          ...c,
          subjects: c.subjects.map((s) =>
            s.id === subjectId
              ? {
                  ...s,
                  questionnaires: [
                    ...s.questionnaires,
                    { id: newId, title, description, questions: [] },
                  ],
                }
              : s,
          ),
        })),
      );
      ctx.nav.push("createQuestion", {
        classId,
        subjectId,
        questionnaireId: newId,
      });
    }
  };

  return (
    <Screen>
      <TopBar
        title={qId ? "Modifier le questionnaire" : "Nouveau questionnaire"}
        subtitle={subject.name}
        onBack={() => ctx.nav.pop()}
      />
      <div className="px-4 pt-4">
        <Field label="Titre du questionnaire">
          <TextInput
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex. Les fractions"
          />
        </Field>
        <Field label="Matière">
          <TextInput
            disabled
            value={subject.name}
            style={{ color: COLORS.muted, background: "#F2F4F7" }}
          />
        </Field>
        <Field label="Description (facultative)">
          <TextArea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex. Notions de base sur les fractions"
          />
        </Field>

        {existing && existing.questions.length > 0 && (
          <div className="mb-4">
            <p
              className="font-bold text-[13px] mb-2"
              style={{ color: COLORS.text }}
            >
              Questions ({existing.questions.length})
            </p>
            <div className="space-y-1.5">
              {existing.questions.map((q, i) => (
                <Card
                  key={q.id}
                  className="!py-2.5 flex items-center justify-between"
                >
                  <span
                    className="text-[12.5px] truncate flex-1"
                    style={{ color: COLORS.text }}
                  >
                    {i + 1}. {q.text}
                  </span>
                  <Badge tone="success">{q.correct}</Badge>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Btn variant="ghost" full onClick={() => ctx.nav.pop()}>
            Annuler
          </Btn>
          <Btn full icon={Save} onClick={save} disabled={!title.trim()}>
            {qId ? "Enregistrer" : "Continuer"}
          </Btn>
        </div>
        {existing && (
          <div className="mt-2">
            <Btn
              variant="secondary"
              full
              icon={Plus}
              onClick={() =>
                ctx.nav.push("createQuestion", {
                  classId,
                  subjectId,
                  questionnaireId: qId,
                })
              }
            >
              Ajouter une question
            </Btn>
          </div>
        )}
      </div>
    </Screen>
  );
}

/* 12. Création d'une question */
function CreateQuestionScreen({ ctx }) {
  const { classId, subjectId, questionnaireId } = ctx.nav.current.params;
  const loc = locateClass(ctx.data, classId);
  if (!loc) return null;
  const { cls } = loc;
  const subject = cls.subjects.find((s) => s.id === subjectId);
  const questionnaire = subject.questionnaires.find(
    (q) => q.id === questionnaireId,
  );

  const [text, setText] = useState("");
  const [choices, setChoices] = useState({ A: "", B: "", C: "", D: "" });
  const [correct, setCorrect] = useState("A");
  const [count, setCount] = useState(questionnaire?.questions.length || 0);

  const canSave =
    text.trim() &&
    choices.A.trim() &&
    choices.B.trim() &&
    choices.C.trim() &&
    choices.D.trim();

  const saveQuestion = (addAnother) => {
    if (!canSave) return;
    const newQ = {
      id: uid("q"),
      text: text.trim(),
      choices: { ...choices },
      correct,
    };
    ctx.setData((d) =>
      updateClass(d, classId, (c) => ({
        ...c,
        subjects: c.subjects.map((s) =>
          s.id === subjectId
            ? {
                ...s,
                questionnaires: s.questionnaires.map((qz) =>
                  qz.id === questionnaireId
                    ? { ...qz, questions: [...qz.questions, newQ] }
                    : qz,
                ),
              }
            : s,
        ),
      })),
    );
    setCount((n) => n + 1);
    if (addAnother) {
      setText("");
      setChoices({ A: "", B: "", C: "", D: "" });
      setCorrect("A");
    } else {
      ctx.nav.push("createQuestionnaire", {
        classId,
        subjectId,
        questionnaireId,
      });
    }
  };

  return (
    <Screen>
      <TopBar
        title="Nouvelle question"
        subtitle={`${questionnaire?.title} · Question ${count + 1}`}
        onBack={() => ctx.nav.pop()}
      />
      <div className="px-4 pt-4">
        <Field label="Texte de la question">
          <TextArea
            rows={2}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ex. Quelle fraction représente..."
          />
        </Field>
        {["A", "B", "C", "D"].map((k) => (
          <Field key={k} label={`Choix ${k}`}>
            <div className="flex items-center gap-2">
              <TextInput
                value={choices[k]}
                onChange={(e) =>
                  setChoices((c) => ({ ...c, [k]: e.target.value }))
                }
                placeholder={`Réponse ${k}`}
              />
              <button
                onClick={() => setCorrect(k)}
                className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center font-bold text-[12px]"
                style={{
                  background: correct === k ? COLORS.success : COLORS.border,
                  color: correct === k ? "#fff" : COLORS.muted,
                }}
                title="Marquer comme bonne réponse"
              >
                {correct === k ? <Check size={15} /> : k}
              </button>
            </div>
          </Field>
        ))}
        <p className="text-[11.5px] mb-4" style={{ color: COLORS.muted }}>
          Touchez le rond à droite d'un choix pour définir la bonne réponse
          (actuellement : <b style={{ color: COLORS.success }}>{correct}</b>).
        </p>

        <div className="grid grid-cols-2 gap-2 mb-2">
          <Btn variant="ghost" icon={Trash2} onClick={() => ctx.nav.pop()}>
            Supprimer
          </Btn>
          <Btn
            variant="secondary"
            icon={Plus}
            disabled={!canSave}
            onClick={() => saveQuestion(true)}
          >
            Ajouter une autre
          </Btn>
        </div>
        <Btn
          full
          icon={Save}
          disabled={!canSave}
          onClick={() => saveQuestion(false)}
        >
          Enregistrer et terminer
        </Btn>
      </div>
    </Screen>
  );
}

/* 13. Préparation d'une évaluation */
function OptionCard({
  selected,
  onClick,
  title,
  subtitle,
  icon: Icon,
  disabled,
}) {
  return (
    <Card
      onClick={disabled ? undefined : onClick}
      className="flex items-center gap-3 mb-2"
      style={{
        opacity: disabled ? 0.45 : 1,
        borderColor: selected ? COLORS.primary : COLORS.border,
        borderWidth: selected ? 2 : 1,
        background: selected ? COLORS.primarySoft : COLORS.surface,
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: selected ? COLORS.primary : COLORS.primarySoft }}
      >
        <Icon size={18} color={selected ? "#fff" : COLORS.primary} />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className="font-bold text-[13.5px] truncate"
          style={{ color: COLORS.text }}
        >
          {title}
        </p>
        {subtitle && (
          <p className="text-[11.5px] truncate" style={{ color: COLORS.muted }}>
            {subtitle}
          </p>
        )}
      </div>
      {selected && <CheckCircle2 size={20} color={COLORS.primary} />}
    </Card>
  );
}

function WizardProgress({ step, totalSteps, crumbs }) {
  return (
    <div className="px-4 pt-3 pb-1">
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-[11px] font-semibold"
          style={{ color: COLORS.primary }}
        >
          Étape {Math.min(step + 1, totalSteps)} sur {totalSteps}
        </span>
        {crumbs.length > 0 && (
          <span
            className="text-[11px] truncate max-w-[220px]"
            style={{ color: COLORS.muted }}
          >
            {crumbs.join(" › ")}
          </span>
        )}
      </div>
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ background: COLORS.border }}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${((step + 1) / totalSteps) * 100}%`,
            background: COLORS.primary,
          }}
        />
      </div>
    </div>
  );
}

function EvalPrepScreen({ ctx }) {
  const preset = ctx.nav.current.params || {};
  const presetLoc = preset.classId
    ? locateClass(ctx.data, preset.classId)
    : null;

  const [sel, setSel] = useState({
    establishmentId: preset.establishmentId || presetLoc?.est.id || "",
    yearId: preset.yearId || presetLoc?.yr.id || "",
    classId: preset.classId || "",
    subjectId: preset.subjectId || "",
    questionnaireId: preset.questionnaireId || "",
  });
  // Si une classe est déjà connue (arrivée depuis "Détails de la classe"),
  // on saute directement à l'étape "Matière".
  const [step, setStep] = useState(sel.classId ? 3 : 0);

  const est = ctx.data.establishments.find((e) => e.id === sel.establishmentId);
  const year = est?.years.find((y) => y.id === sel.yearId);
  const cls = year?.classes.find((c) => c.id === sel.classId);
  const subject = cls?.subjects.find((s) => s.id === sel.subjectId);
  const questionnaire = subject?.questionnaires.find(
    (q) => q.id === sel.questionnaireId,
  );

  const STEPS = [
    "establishment",
    "year",
    "class",
    "subject",
    "questionnaire",
    "summary",
  ];

  const choose = (patch, nextStep) => {
    setSel((s) => ({ ...s, ...patch }));
    setStep(nextStep);
  };

  const start = () => {
    const sessionId = uid("sess");
    const newSession = {
      id: sessionId,
      establishmentId: est.id,
      yearId: year.id,
      classId: cls.id,
      subjectId: subject.id,
      questionnaireId: questionnaire.id,
      date: new Date().toLocaleDateString("fr-FR"),
      questionIds: questionnaire.questions.map((q) => q.id),
      currentQuestionIndex: 0,
      answers: {},
      questionStatus: {},
      declaredAbsentIds: [],
      status: "in_progress",
      syncStatus: "pending",
    };
    ctx.setData((d) => ({ ...d, sessions: [...d.sessions, newSession] }));
    ctx.nav.push("sessionQuestion", { sessionId, index: 0 });
  };

  const goBackStep = () => {
    if (step === 0) {
      ctx.nav.pop();
      return;
    }
    setStep((s) => s - 1);
  };

  const crumbs = [
    est?.name,
    year?.label,
    cls?.name,
    subject?.name,
    questionnaire?.title,
  ].filter(Boolean);

  let body = null;
  let title = "Préparer une évaluation";

  if (step === 0) {
    title = "Choisir l'établissement";
    body = (
      <div className="px-4">
        {ctx.data.establishments.map((e) => (
          <OptionCard
            key={e.id}
            icon={Building2}
            title={e.name}
            subtitle={`${e.years.length} année(s) scolaire(s)`}
            selected={sel.establishmentId === e.id}
            onClick={() =>
              choose(
                {
                  establishmentId: e.id,
                  yearId: "",
                  classId: "",
                  subjectId: "",
                  questionnaireId: "",
                },
                1,
              )
            }
          />
        ))}
      </div>
    );
  } else if (step === 1) {
    title = "Choisir l'année scolaire";
    body = (
      <div className="px-4">
        {est?.years.map((y) => (
          <OptionCard
            key={y.id}
            icon={Calendar}
            title={y.label}
            subtitle={`${y.classes.length} classe(s)`}
            selected={sel.yearId === y.id}
            onClick={() =>
              choose(
                {
                  yearId: y.id,
                  classId: "",
                  subjectId: "",
                  questionnaireId: "",
                },
                2,
              )
            }
          />
        ))}
      </div>
    );
  } else if (step === 2) {
    title = "Choisir la classe";
    body = (
      <div className="px-4">
        {year?.classes.map((c) => (
          <OptionCard
            key={c.id}
            icon={GraduationCap}
            title={c.name}
            subtitle={`${c.students.length} élèves · ${c.subjects.length} matières`}
            selected={sel.classId === c.id}
            onClick={() =>
              choose({ classId: c.id, subjectId: "", questionnaireId: "" }, 3)
            }
          />
        ))}
      </div>
    );
  } else if (step === 3) {
    title = "Choisir la matière";
    body = (
      <div className="px-4">
        {cls?.subjects.map((s) => (
          <OptionCard
            key={s.id}
            icon={BookOpen}
            title={s.name}
            subtitle={`${s.questionnaires.length} questionnaire(s)`}
            selected={sel.subjectId === s.id}
            onClick={() => choose({ subjectId: s.id, questionnaireId: "" }, 4)}
          />
        ))}
        {cls && cls.subjects.length === 0 && (
          <EmptyState
            icon={BookOpen}
            title="Aucune matière"
            text="Ajoutez une matière à cette classe avant de créer une évaluation."
          />
        )}
      </div>
    );
  } else if (step === 4) {
    title = "Choisir le questionnaire";
    body = (
      <div className="px-4">
        {subject?.questionnaires.map((q) => (
          <OptionCard
            key={q.id}
            icon={ListChecks}
            title={q.title}
            subtitle={`${q.questions.length} question(s)`}
            disabled={q.questions.length === 0}
            selected={sel.questionnaireId === q.id}
            onClick={() => choose({ questionnaireId: q.id }, 5)}
          />
        ))}
        {subject && subject.questionnaires.length === 0 && (
          <EmptyState
            icon={ListChecks}
            title="Aucun questionnaire"
            text="Créez d'abord un questionnaire pour cette matière."
          />
        )}
      </div>
    );
  } else if (step === 5) {
    title = "Résumé de l'évaluation";
    body = (
      <div className="px-4">
        <Card
          className="mb-4"
          style={{ background: COLORS.primarySoft, border: "none" }}
        >
          <p
            className="font-bold text-[13px] mb-2"
            style={{ color: COLORS.primaryDark }}
          >
            Résumé
          </p>
          <div
            className="space-y-1 text-[12.5px]"
            style={{ color: COLORS.primaryDark }}
          >
            <p>
              🏫 {est.name} · {year.label}
            </p>
            <p>
              🎓 {cls.name} ({cls.students.length} élèves)
            </p>
            <p>
              📘 {subject.name} — {questionnaire.title}
            </p>
            <p>❓ {questionnaire.questions.length} questions</p>
          </div>
        </Card>
        <Btn full icon={PlayCircle} onClick={start}>
          Démarrer l'évaluation
        </Btn>
      </div>
    );
  }

  return (
    <Screen>
      <TopBar title={title} onBack={goBackStep} />
      <WizardProgress step={step} totalSteps={STEPS.length} crumbs={crumbs} />
      <div className="pt-2">{body}</div>
    </Screen>
  );
}

/* 14. Écran de question (session) */
function SessionQuestionScreen({ ctx }) {
  const { sessionId, index } = ctx.nav.current.params;
  const session = findSession(ctx.data, sessionId);
  if (!session) return null;
  const loc = locateClass(ctx.data, session.classId);
  const { questionnaire } = findQuestionnaire(
    loc.cls,
    session.subjectId,
    session.questionnaireId,
  );
  const question = questionnaire.questions[index];
  const total = questionnaire.questions.length;

  return (
    <Screen>
      <TopBar
        title={`Question ${index + 1} / ${total}`}
        subtitle={`${loc.cls.name} · ${questionnaire.title}`}
        onBack={() => ctx.nav.pop()}
      />
      <div className="px-4 pt-4">
        <Card className="mb-4">
          <p
            className="font-bold text-[16px] leading-snug"
            style={{ color: COLORS.text }}
          >
            {question.text}
          </p>
        </Card>
        <div className="space-y-2 mb-6">
          {["A", "B", "C", "D"].map((k) => (
            <div
              key={k}
              className="flex items-center gap-3 px-3 py-3 rounded-xl"
              style={{ background: "#F7F8FA" }}
            >
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-[12.5px] shrink-0"
                style={{ background: COLORS.primary, color: "#fff" }}
              >
                {k}
              </span>
              <span className="text-[13.5px]" style={{ color: COLORS.text }}>
                {question.choices[k]}
              </span>
            </div>
          ))}
        </div>
        <Btn
          full
          icon={Camera}
          onClick={() => ctx.nav.push("scanSimulation", { sessionId, index })}
        >
          Démarrer le scan
        </Btn>
      </div>
    </Screen>
  );
}

/* --- retour sonore + vibration à chaque détection (léger, non intrusif) --- */
function playDetectionFeedback() {
  try {
    if (typeof navigator !== "undefined" && navigator.vibrate)
      navigator.vibrate(25);
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctxAudio = new Ctx();
    const osc = ctxAudio.createOscillator();
    const gain = ctxAudio.createGain();
    osc.type = "sine";
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.06, ctxAudio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctxAudio.currentTime + 0.12);
    osc.connect(gain).connect(ctxAudio.destination);
    osc.start();
    osc.stop(ctxAudio.currentTime + 0.13);
  } catch (e) {
    /* environnement sans audio/vibration : ignorer silencieusement */
  }
}

const ZONE_SIZE = 20; // taille d'une "rangée" pour le scan par zones (classes nombreuses)

/* 15. Écran de scan simulé */
function ScanSimulationScreen({ ctx }) {
  const { sessionId, index } = ctx.nav.current.params;
  const session = findSession(ctx.data, sessionId);
  const loc = locateClass(ctx.data, session.classId);
  const { questionnaire } = findQuestionnaire(
    loc.cls,
    session.subjectId,
    session.questionnaireId,
  );
  const question = questionnaire.questions[index];
  const students = loc.cls.students;
  const total = students.length;

  const [absentPanelOpen, setAbsentPanelOpen] = useState(false);
  const [absentSearch, setAbsentSearch] = useState("");
  const declaredAbsentIds = session.declaredAbsentIds || [];

  const toggleAbsent = (studentId) => {
    ctx.setData((d) =>
      updateSession(d, sessionId, (s) => {
        const cur = s.declaredAbsentIds || [];
        const next = cur.includes(studentId)
          ? cur.filter((id) => id !== studentId)
          : [...cur, studentId];
        return { ...s, declaredAbsentIds: next };
      }),
    );
  };

  const detectableStudents = useMemo(
    () => students.filter((s) => !declaredAbsentIds.includes(s.id)),
    [students, declaredAbsentIds],
  );
  const zones = useMemo(() => {
    const z = [];
    for (let i = 0; i < detectableStudents.length; i += ZONE_SIZE)
      z.push(detectableStudents.slice(i, i + ZONE_SIZE));
    return z.length ? z : [[]];
  }, [detectableStudents]);

  const [zoneIndex, setZoneIndex] = useState(0);
  const currentZone = zones[Math.min(zoneIndex, zones.length - 1)] || [];

  const [detected, setDetected] = useState([]); // {studentId, choice}
  const [lastFeed, setLastFeed] = useState([]); // derniers détectés, pour le flux en direct
  const [scanning, setScanning] = useState(true);
  const detectedIdsRef = useRef(new Set());

  useEffect(() => {
    // relance le scan automatiquement quand on change de rangée
    setScanning(true);
  }, [zoneIndex]);

  useEffect(() => {
    if (!scanning) return;
    const remainingInZone = currentZone.filter(
      (s) => !detectedIdsRef.current.has(s.id),
    );
    if (remainingInZone.length === 0) {
      setScanning(false);
      return;
    }
    const timer = setInterval(() => {
      setDetected((prev) => {
        const remaining = currentZone.filter(
          (s) => !detectedIdsRef.current.has(s.id),
        );
        if (remaining.length === 0) {
          setScanning(false);
          return prev;
        }
        const batch = remaining.slice(0, Math.min(2, remaining.length));
        const additions = batch.map((s) => {
          detectedIdsRef.current.add(s.id);
          const r = Math.random();
          const choice =
            r < 0.55
              ? question.correct
              : ["A", "B", "C", "D"].filter((c) => c !== question.correct)[
                  Math.floor(Math.random() * 3)
                ];
          return { studentId: s.id, choice, name: s.name };
        });
        playDetectionFeedback();
        setLastFeed((f) => [...additions, ...f].slice(0, 4));
        return [
          ...prev,
          ...additions.map(({ studentId, choice }) => ({ studentId, choice })),
        ];
      });
    }, 550);
    return () => clearInterval(timer);
  }, [scanning, currentZone, question.correct]);

  const zoneDone = currentZone.every((s) => detectedIdsRef.current.has(s.id));
  const isLastZone = zoneIndex >= zones.length - 1;

  const goToNextZone = () => {
    if (!isLastZone) setZoneIndex((z) => z + 1);
  };
  const rescanZone = () => setScanning(true);

  const notDetectedInZone = currentZone.filter(
    (s) => !detectedIdsRef.current.has(s.id),
  );
  const notDetectedTotal = detectableStudents.filter(
    (s) => !detectedIdsRef.current.has(s.id),
  );

  const goVerify = () => {
    ctx.setData((d) =>
      updateSession(d, sessionId, (s) => {
        const answers = { ...s.answers };
        detected.forEach(({ studentId, choice }) => {
          answers[studentId] = {
            ...(answers[studentId] || {}),
            [question.id]: choice,
          };
        });
        students.forEach((st) => {
          if (!answers[st.id] || answers[st.id][question.id] === undefined) {
            answers[st.id] = { ...(answers[st.id] || {}), [question.id]: null };
          }
        });
        return {
          ...s,
          answers,
          questionStatus: { ...s.questionStatus, [question.id]: "scanned" },
        };
      }),
    );
    ctx.nav.push("verifyAnswers", { sessionId, index });
  };

  const filteredAbsentList = students.filter((s) =>
    s.name.toLowerCase().includes(absentSearch.toLowerCase()),
  );

  return (
    <Screen>
      <TopBar
        title="Scan en cours"
        subtitle={`Question ${index + 1} · Rangée ${zoneIndex + 1}/${zones.length}`}
        onBack={() => ctx.nav.pop()}
      />

      <div className="px-4 pt-3">
        {/* Sélecteur de rangées, essentiel pour les grandes classes */}
        {zones.length > 1 && (
          <div className="flex gap-1.5 overflow-x-auto pb-1 mb-3 -mx-1 px-1">
            {zones.map((z, i) => {
              const done =
                z.every((s) => detectedIdsRef.current.has(s.id)) &&
                z.length > 0;
              return (
                <button
                  key={i}
                  onClick={() => setZoneIndex(i)}
                  className="shrink-0 px-3 py-1.5 rounded-full text-[11.5px] font-semibold flex items-center gap-1"
                  style={{
                    background:
                      i === zoneIndex
                        ? COLORS.primary
                        : done
                          ? COLORS.successSoft
                          : COLORS.primarySoft,
                    color:
                      i === zoneIndex
                        ? "#fff"
                        : done
                          ? COLORS.success
                          : COLORS.primary,
                  }}
                >
                  {done && <CheckCircle2 size={12} />}
                  Rangée {i + 1}
                </button>
              );
            })}
          </div>
        )}

        {/* Panneau des absents déclarés */}
        <Card className="mb-3 !py-2.5">
          <button
            className="w-full flex items-center justify-between"
            onClick={() => setAbsentPanelOpen((v) => !v)}
          >
            <span
              className="flex items-center gap-2 text-[12.5px] font-semibold"
              style={{ color: COLORS.text }}
            >
              <UserX size={15} color={COLORS.muted} /> Élèves absents
              aujourd'hui
              {declaredAbsentIds.length > 0 && (
                <Badge tone="neutral">{declaredAbsentIds.length}</Badge>
              )}
            </span>
            <ChevronRight
              size={16}
              color={COLORS.muted}
              style={{ transform: absentPanelOpen ? "rotate(90deg)" : "none" }}
            />
          </button>
          {absentPanelOpen && (
            <div className="mt-2">
              <TextInput
                value={absentSearch}
                onChange={(e) => setAbsentSearch(e.target.value)}
                placeholder="Rechercher un élève à signaler absent"
                style={{ marginBottom: 8 }}
              />
              <div className="max-h-[180px] overflow-y-auto space-y-1">
                {filteredAbsentList.slice(0, 30).map((s) => (
                  <label
                    key={s.id}
                    className="flex items-center gap-2 py-1 text-[12.5px]"
                    style={{ color: COLORS.text }}
                  >
                    <input
                      type="checkbox"
                      checked={declaredAbsentIds.includes(s.id)}
                      onChange={() => toggleAbsent(s.id)}
                    />
                    {s.name}
                  </label>
                ))}
              </div>
            </div>
          )}
        </Card>

        <div
          className="rounded-2xl mb-3 flex flex-col items-center justify-center py-8 relative overflow-hidden"
          style={{ background: "#0F1E33" }}
        >
          <div
            className="absolute inset-4 rounded-xl"
            style={{ border: "2px dashed rgba(255,255,255,0.25)" }}
          />
          <Camera size={28} color="rgba(255,255,255,0.6)" />
          <p
            className="text-[12px] mt-2"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            {scanning
              ? "Recherche des cartes-réponses…"
              : zoneDone
                ? "Rangée terminée"
                : "Scan en pause"}
          </p>
          {scanning && (
            <div className="flex gap-1 mt-2">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: "#fff", animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          )}
          {/* flux en direct des derniers élèves détectés */}
          {lastFeed.length > 0 && (
            <div className="w-full mt-3 px-4 space-y-1">
              {lastFeed.map((f, i) => (
                <div
                  key={f.studentId + i}
                  className="flex items-center justify-between text-[11px] px-2 py-1 rounded-lg"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    opacity: 1 - i * 0.18,
                  }}
                >
                  <span style={{ color: "#fff" }}>{f.name}</span>
                  <span style={{ color: "#8FE3C7" }}>Réponse {f.choice}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <Card
          className="flex items-center justify-between mb-3"
          style={{ background: COLORS.primarySoft, border: "none" }}
        >
          <div>
            <p
              className="text-[12px] font-semibold"
              style={{ color: COLORS.primaryDark }}
            >
              Élèves détectés (total)
            </p>
            <p
              className="text-[22px] font-extrabold"
              style={{ color: COLORS.primary }}
            >
              {detected.length}{" "}
              <span
                className="text-[14px] font-semibold"
                style={{ color: COLORS.muted }}
              >
                / {total}
              </span>
            </p>
            {declaredAbsentIds.length > 0 && (
              <p className="text-[11px]" style={{ color: COLORS.muted }}>
                dont {declaredAbsentIds.length} absent(s) signalé(s)
              </p>
            )}
          </div>
          <ScanLine size={26} color={COLORS.primary} />
        </Card>

        {notDetectedInZone.length > 0 && (
          <Card className="mb-4">
            <p
              className="font-bold text-[12.5px] mb-2"
              style={{ color: COLORS.text }}
            >
              Non détectés dans cette rangée ({notDetectedInZone.length})
            </p>
            <div className="flex flex-wrap gap-1.5">
              {notDetectedInZone.slice(0, 8).map((s) => (
                <span
                  key={s.id}
                  className="text-[11px] px-2 py-1 rounded-full"
                  style={{
                    background: COLORS.dangerSoft,
                    color: COLORS.danger,
                  }}
                >
                  {s.name}
                </span>
              ))}
              {notDetectedInZone.length > 8 && (
                <span
                  className="text-[11px] px-2 py-1 rounded-full"
                  style={{
                    background: COLORS.dangerSoft,
                    color: COLORS.danger,
                  }}
                >
                  +{notDetectedInZone.length - 8} autres
                </span>
              )}
            </div>
          </Card>
        )}

        <div className="space-y-2">
          {!scanning && !zoneDone && (
            <Btn full variant="secondary" icon={ScanLine} onClick={rescanZone}>
              Continuer le scan de cette rangée
            </Btn>
          )}
          {zoneDone && !isLastZone && (
            <Btn full icon={ArrowRight} onClick={goToNextZone}>
              Rangée {zoneIndex + 2} — continuer le scan
            </Btn>
          )}
          <Btn
            full
            variant={zoneDone && isLastZone ? "primary" : "ghost"}
            icon={ArrowRight}
            onClick={goVerify}
          >
            Vérifier les réponses{" "}
            {notDetectedTotal.length > 0
              ? `(${notDetectedTotal.length} non détecté(s))`
              : ""}
          </Btn>
        </div>
      </div>
    </Screen>
  );
}

/* 16. Vérification des réponses */
function VerifyAnswersScreen({ ctx }) {
  const { sessionId, index } = ctx.nav.current.params;
  const session = findSession(ctx.data, sessionId);
  const loc = locateClass(ctx.data, session.classId);
  const { questionnaire } = findQuestionnaire(
    loc.cls,
    session.subjectId,
    session.questionnaireId,
  );
  const question = questionnaire.questions[index];
  const students = loc.cls.students;
  const declaredAbsentIds = session.declaredAbsentIds || [];

  const [correcting, setCorrecting] = useState(null); // studentId
  const [confirmValidate, setConfirmValidate] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | detected | undetected
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState(new Set());

  const setChoice = (studentId, choice) => {
    ctx.setData((d) =>
      updateSession(d, sessionId, (s) => ({
        ...s,
        answers: {
          ...s.answers,
          [studentId]: {
            ...(s.answers[studentId] || {}),
            [question.id]: choice,
          },
        },
      })),
    );
    setCorrecting(null);
  };

  const setChoiceBulk = (choice) => {
    ctx.setData((d) =>
      updateSession(d, sessionId, (s) => {
        const answers = { ...s.answers };
        selected.forEach((studentId) => {
          answers[studentId] = {
            ...(answers[studentId] || {}),
            [question.id]: choice,
          };
        });
        return { ...s, answers };
      }),
    );
    setSelected(new Set());
    setSelectMode(false);
  };

  const detectedCount = students.filter(
    (s) => session.answers[s.id]?.[question.id],
  ).length;

  const visibleStudents = students.filter((s) => {
    if (!s.name.toLowerCase().includes(search.toLowerCase())) return false;
    const choice = session.answers[s.id]?.[question.id];
    if (filter === "detected") return !!choice;
    if (filter === "undetected") return !choice;
    return true;
  });

  const toggleSelect = (studentId) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(studentId) ? next.delete(studentId) : next.add(studentId);
      return next;
    });
  };

  const selectAllVisible = () =>
    setSelected(new Set(visibleStudents.map((s) => s.id)));

  const validateQuestion = () => {
    ctx.setData((d) =>
      updateSession(d, sessionId, (s) => ({
        ...s,
        questionStatus: { ...s.questionStatus, [question.id]: "validated" },
      })),
    );
    const nextIndex = index + 1;
    if (nextIndex < questionnaire.questions.length) {
      ctx.nav.resetTo("sessionQuestion", { sessionId, index: nextIndex });
    } else {
      ctx.setData((d) =>
        updateSession(d, sessionId, (s) => ({ ...s, status: "completed" })),
      );
      ctx.nav.resetTo("sessionResultsGlobal", { sessionId });
    }
  };

  return (
    <Screen>
      <TopBar
        title="Vérifier les réponses"
        subtitle={`Question ${index + 1} — ${detectedCount}/${students.length} détectés`}
        onBack={() => ctx.nav.pop()}
        right={
          <button
            onClick={() => {
              setSelectMode((v) => !v);
              setSelected(new Set());
            }}
            className="text-[11.5px] font-semibold px-2.5 py-1.5 rounded-lg"
            style={{
              background: selectMode ? COLORS.primary : COLORS.primarySoft,
              color: selectMode ? "#fff" : COLORS.primary,
            }}
          >
            {selectMode ? "Terminer" : "Sélection multiple"}
          </button>
        }
      />
      <div className="px-4 pt-3">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl mb-2"
          style={{ background: "#F2F4F7" }}
        >
          <Search size={15} color={COLORS.muted} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un élève"
            className="flex-1 bg-transparent outline-none text-[13px]"
          />
        </div>
        <div className="flex gap-2 mb-3">
          {[
            { key: "all", label: `Tous (${students.length})` },
            { key: "detected", label: `Détectés (${detectedCount})` },
            {
              key: "undetected",
              label: `Non détectés (${students.length - detectedCount})`,
            },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="flex-1 py-1.5 rounded-lg text-[11px] font-semibold"
              style={{
                background:
                  filter === f.key ? COLORS.primary : COLORS.primarySoft,
                color: filter === f.key ? "#fff" : COLORS.primary,
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {selectMode && (
          <div className="flex items-center justify-between mb-2 px-1">
            <button
              onClick={selectAllVisible}
              className="text-[11.5px] font-semibold"
              style={{ color: COLORS.primary }}
            >
              Tout sélectionner ({visibleStudents.length})
            </button>
            <span className="text-[11.5px]" style={{ color: COLORS.muted }}>
              {selected.size} sélectionné(s)
            </span>
          </div>
        )}

        <div
          className="rounded-2xl overflow-hidden mb-4"
          style={{ border: `1px solid ${COLORS.border}` }}
        >
          <div className="max-h-[380px] overflow-y-auto">
            {visibleStudents.length === 0 && (
              <div
                className="py-8 text-center text-[12.5px]"
                style={{ color: COLORS.muted }}
              >
                Aucun élève ne correspond.
              </div>
            )}
            {visibleStudents.map((s, i) => {
              const choice = session.answers[s.id]?.[question.id];
              const isAbsentDeclared =
                declaredAbsentIds.includes(s.id) && !choice;
              return (
                <div
                  key={s.id}
                  onClick={selectMode ? () => toggleSelect(s.id) : undefined}
                  className="flex items-center justify-between px-3 py-2.5"
                  style={{
                    borderTop: i ? `1px solid ${COLORS.border}` : "none",
                    background: selected.has(s.id)
                      ? COLORS.primarySoft
                      : i % 2
                        ? "#FBFCFD"
                        : "#fff",
                    cursor: selectMode ? "pointer" : "default",
                  }}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {selectMode && (
                      <input
                        type="checkbox"
                        readOnly
                        checked={selected.has(s.id)}
                        className="mr-1"
                      />
                    )}
                    {choice ? (
                      <UserCheck size={15} color={COLORS.success} />
                    ) : (
                      <UserX
                        size={15}
                        color={isAbsentDeclared ? COLORS.muted : COLORS.danger}
                      />
                    )}
                    <span
                      className="text-[12.5px] font-medium truncate"
                      style={{ color: COLORS.text }}
                    >
                      {s.name}
                    </span>
                  </div>
                  {!selectMode &&
                    (correcting === s.id ? (
                      <div className="flex gap-1.5">
                        {["A", "B", "C", "D"].map((k) => (
                          <button
                            key={k}
                            onClick={() => setChoice(s.id, k)}
                            className="w-8 h-8 rounded-full text-[11px] font-bold"
                            style={{
                              background:
                                choice === k ? COLORS.primary : COLORS.border,
                              color: choice === k ? "#fff" : COLORS.muted,
                            }}
                          >
                            {k}
                          </button>
                        ))}
                        <button
                          onClick={() => setChoice(s.id, null)}
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ background: COLORS.dangerSoft }}
                        >
                          <X size={14} color={COLORS.danger} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setCorrecting(s.id)}
                        className="flex items-center gap-1.5 py-1"
                      >
                        {choice ? (
                          <Badge tone="primary">{choice}</Badge>
                        ) : isAbsentDeclared ? (
                          <Badge tone="neutral">Absent signalé</Badge>
                        ) : (
                          <Badge tone="danger">Non détecté</Badge>
                        )}
                        <Edit3 size={13} color={COLORS.muted} />
                      </button>
                    ))}
                </div>
              );
            })}
          </div>
        </div>

        {!selectMode && (
          <Btn full icon={Check} onClick={() => setConfirmValidate(true)}>
            Valider cette question
          </Btn>
        )}
      </div>

      {/* barre d'action de correction en masse */}
      {selectMode && selected.size > 0 && (
        <div
          className="sticky bottom-0 px-4 py-3"
          style={{
            background: COLORS.surface,
            borderTop: `1px solid ${COLORS.border}`,
          }}
        >
          <p
            className="text-[11px] font-semibold mb-2"
            style={{ color: COLORS.muted }}
          >
            Attribuer aux {selected.size} élève(s) sélectionné(s) :
          </p>
          <div className="flex gap-2">
            {["A", "B", "C", "D"].map((k) => (
              <button
                key={k}
                onClick={() => setChoiceBulk(k)}
                className="flex-1 py-2.5 rounded-xl font-bold text-[13px]"
                style={{
                  background: COLORS.primarySoft,
                  color: COLORS.primary,
                }}
              >
                {k}
              </button>
            ))}
            <button
              onClick={() => setChoiceBulk(null)}
              className="flex-1 py-2.5 rounded-xl font-semibold text-[12px]"
              style={{ background: COLORS.dangerSoft, color: COLORS.danger }}
            >
              Absent
            </button>
          </div>
        </div>
      )}

      <ConfirmModal
        open={confirmValidate}
        title="Valider la question ?"
        text="Les réponses seront enregistrées et vous passerez à la question suivante (ou aux résultats)."
        onCancel={() => setConfirmValidate(false)}
        onConfirm={() => {
          setConfirmValidate(false);
          validateQuestion();
        }}
        confirmLabel="Valider"
      />
    </Screen>
  );
}

/* 17. Résultats — calculs partagés */
function computeResults(ctx, sessionId) {
  const session = findSession(ctx.data, sessionId);
  const loc = locateClass(ctx.data, session.classId);
  const { questionnaire } = findQuestionnaire(
    loc.cls,
    session.subjectId,
    session.questionnaireId,
  );
  const students = loc.cls.students;
  const questions = questionnaire.questions;

  const perStudent = students.map((s) => {
    const detail = questions.map((q) => {
      const choice = session.answers[s.id]?.[q.id] ?? null;
      return { question: q, choice, correct: choice === q.correct };
    });
    const score = detail.filter((d) => d.correct).length;
    return {
      student: s,
      detail,
      score,
      pct: questions.length ? Math.round((score / questions.length) * 100) : 0,
    };
  });

  const participants = perStudent.filter((p) =>
    p.detail.some((d) => d.choice),
  ).length;
  const totalCorrect = perStudent.reduce((sum, p) => sum + p.score, 0);
  const totalPossible = students.length * questions.length;
  const classAverage = totalPossible
    ? Math.round((totalCorrect / totalPossible) * 100)
    : 0;

  const distribution = { A: 0, B: 0, C: 0, D: 0 };
  perStudent.forEach((p) =>
    p.detail.forEach((d) => {
      if (d.choice) distribution[d.choice]++;
    }),
  );

  const perQuestion = questions.map((q) => {
    const answers = perStudent.map(
      (p) => p.detail.find((d) => d.question.id === q.id).choice,
    );
    const correctCount = answers.filter((a) => a === q.correct).length;
    const noAnswer = answers.filter((a) => !a).length;
    const incorrect = answers.length - correctCount - noAnswer;
    const dist = { A: 0, B: 0, C: 0, D: 0 };
    answers.forEach((a) => {
      if (a) dist[a]++;
    });
    return {
      question: q,
      correctCount,
      incorrect,
      noAnswer,
      dist,
      rate: students.length
        ? Math.round((correctCount / students.length) * 100)
        : 0,
    };
  });

  return {
    session,
    loc,
    questionnaire,
    students,
    questions,
    perStudent,
    participants,
    totalCorrect,
    totalPossible,
    classAverage,
    distribution,
    perQuestion,
  };
}

function ResultsTabs({ ctx, sessionId, active }) {
  const tabs = [
    { key: "sessionResultsGlobal", label: "Classe" },
    { key: "sessionResultsByQuestion", label: "Par question" },
    { key: "sessionResultsByStudent", label: "Par élève" },
  ];
  return (
    <div className="flex gap-2 px-4 pb-3">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => ctx.nav.resetTo(t.key, { sessionId })}
          className="flex-1 py-2 rounded-xl text-[12px] font-semibold"
          style={{
            background: active === t.key ? COLORS.primary : COLORS.primarySoft,
            color: active === t.key ? "#fff" : COLORS.primary,
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

function DistBar({ dist, total }) {
  return (
    <div className="space-y-1.5">
      {["A", "B", "C", "D"].map((k) => {
        const pct = total ? Math.round((dist[k] / total) * 100) : 0;
        return (
          <div key={k} className="flex items-center gap-2">
            <span
              className="w-4 text-[11px] font-bold"
              style={{ color: COLORS.muted }}
            >
              {k}
            </span>
            <div
              className="flex-1 h-2.5 rounded-full overflow-hidden"
              style={{ background: "#EEF1F4" }}
            >
              <div
                className="h-full rounded-full"
                style={{ width: `${pct}%`, background: COLORS.primary }}
              />
            </div>
            <span
              className="w-9 text-right text-[11px]"
              style={{ color: COLORS.muted }}
            >
              {dist[k]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* 17a. Résultats — global classe */
function ResultsGlobalScreen({ ctx }) {
  const { sessionId } = ctx.nav.current.params;
  const r = computeResults(ctx, sessionId);
  return (
    <Screen>
      <TopBar
        title="Résultats"
        subtitle={`${r.loc.cls.name} · ${r.questionnaire.title}`}
        onBack={() => ctx.nav.pop()}
      />
      <ResultsTabs
        ctx={ctx}
        sessionId={sessionId}
        active="sessionResultsGlobal"
      />
      <div className="px-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Card className="text-center">
            <p
              className="text-[24px] font-extrabold"
              style={{ color: COLORS.primary }}
            >
              {r.students.length}
            </p>
            <p className="text-[11px]" style={{ color: COLORS.muted }}>
              Élèves
            </p>
          </Card>
          <Card className="text-center">
            <p
              className="text-[24px] font-extrabold"
              style={{ color: COLORS.primary }}
            >
              {r.participants}
            </p>
            <p className="text-[11px]" style={{ color: COLORS.muted }}>
              Participants
            </p>
          </Card>
          <Card className="text-center">
            <p
              className="text-[24px] font-extrabold"
              style={{ color: COLORS.success }}
            >
              {r.totalCorrect}
            </p>
            <p className="text-[11px]" style={{ color: COLORS.muted }}>
              Bonnes réponses
            </p>
          </Card>
          <Card className="text-center">
            <p
              className="text-[24px] font-extrabold"
              style={{ color: COLORS.text }}
            >
              {r.classAverage}%
            </p>
            <p className="text-[11px]" style={{ color: COLORS.muted }}>
              Moyenne classe
            </p>
          </Card>
        </div>
        <Card>
          <p
            className="font-bold text-[13px] mb-3"
            style={{ color: COLORS.text }}
          >
            Répartition des réponses (A/B/C/D)
          </p>
          <DistBar
            dist={r.distribution}
            total={
              r.totalCorrect >= 0
                ? Object.values(r.distribution).reduce((a, b) => a + b, 0)
                : 0
            }
          />
        </Card>
      </div>
    </Screen>
  );
}

/* 17b. Résultats — par question */
function ResultsByQuestionScreen({ ctx }) {
  const { sessionId } = ctx.nav.current.params;
  const r = computeResults(ctx, sessionId);
  return (
    <Screen>
      <TopBar
        title="Résultats"
        subtitle={`${r.loc.cls.name} · ${r.questionnaire.title}`}
        onBack={() => ctx.nav.pop()}
      />
      <ResultsTabs
        ctx={ctx}
        sessionId={sessionId}
        active="sessionResultsByQuestion"
      />
      <div className="px-4 space-y-3">
        {r.perQuestion.map((pq, i) => (
          <Card key={pq.question.id}>
            <p
              className="font-bold text-[13px] mb-1"
              style={{ color: COLORS.text }}
            >
              Q{i + 1}. {pq.question.text}
            </p>
            <div className="flex gap-2 mb-3">
              <Badge tone="success" icon={CheckCircle2}>
                {pq.rate}% correct
              </Badge>
              <Badge tone="danger" icon={XCircle}>
                {pq.incorrect} erreurs
              </Badge>
              <Badge tone="warning" icon={UserX}>
                {pq.noAnswer} sans réponse
              </Badge>
            </div>
            <DistBar dist={pq.dist} total={r.students.length} />
          </Card>
        ))}
      </div>
    </Screen>
  );
}

/* 17c. Résultats — par élève */
function ResultsByStudentScreen({ ctx }) {
  const { sessionId, studentId } = ctx.nav.current.params;
  const r = computeResults(ctx, sessionId);
  const [search, setSearch] = useState("");
  const selected = studentId
    ? r.perStudent.find((p) => p.student.id === studentId)
    : null;

  if (selected) {
    return (
      <Screen>
        <TopBar
          title={selected.student.name}
          subtitle={`Carte #${selected.student.cardNumber || "—"}`}
          onBack={() => ctx.nav.push("sessionResultsByStudent", { sessionId })}
        />
        <div className="px-4 pt-4">
          <Card
            className="flex items-center justify-between mb-4"
            style={{ background: COLORS.primarySoft, border: "none" }}
          >
            <div>
              <p
                className="text-[12px] font-semibold"
                style={{ color: COLORS.primaryDark }}
              >
                Score
              </p>
              <p
                className="text-[24px] font-extrabold"
                style={{ color: COLORS.primary }}
              >
                {selected.score}/{r.questions.length}
              </p>
            </div>
            <p
              className="text-[26px] font-extrabold"
              style={{ color: COLORS.primary }}
            >
              {selected.pct}%
            </p>
          </Card>
          <div className="space-y-2">
            {selected.detail.map((d, i) => (
              <Card
                key={d.question.id}
                className="flex items-center justify-between"
              >
                <div className="min-w-0 flex-1">
                  <p
                    className="text-[12.5px] font-medium truncate"
                    style={{ color: COLORS.text }}
                  >
                    Q{i + 1}. {d.question.text}
                  </p>
                  <p className="text-[11px]" style={{ color: COLORS.muted }}>
                    Réponse : {d.choice || "aucune"} · Correcte :{" "}
                    {d.question.correct}
                  </p>
                </div>
                {d.choice ? (
                  d.correct ? (
                    <CheckCircle2 size={18} color={COLORS.success} />
                  ) : (
                    <XCircle size={18} color={COLORS.danger} />
                  )
                ) : (
                  <UserX size={18} color={COLORS.muted} />
                )}
              </Card>
            ))}
          </div>
        </div>
      </Screen>
    );
  }

  const filtered = r.perStudent.filter((p) =>
    p.student.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Screen>
      <TopBar
        title="Résultats"
        subtitle={`${r.loc.cls.name} · ${r.questionnaire.title}`}
        onBack={() => ctx.nav.pop()}
      />
      <ResultsTabs
        ctx={ctx}
        sessionId={sessionId}
        active="sessionResultsByStudent"
      />
      <div className="px-4">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl mb-3"
          style={{ background: "#F2F4F7" }}
        >
          <Search size={15} color={COLORS.muted} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un élève"
            className="flex-1 bg-transparent outline-none text-[13px]"
          />
        </div>
        <div className="space-y-1.5 max-h-[500px] overflow-y-auto">
          {filtered.map((p) => (
            <Card
              key={p.student.id}
              onClick={() =>
                ctx.nav.push("sessionResultsByStudent", {
                  sessionId,
                  studentId: p.student.id,
                })
              }
              className="flex items-center justify-between !py-2.5"
            >
              <span
                className="text-[12.5px] font-medium truncate"
                style={{ color: COLORS.text }}
              >
                {p.student.name}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[11.5px]" style={{ color: COLORS.muted }}>
                  {p.score}/{r.questions.length}
                </span>
                <Badge tone={p.pct >= 50 ? "success" : "danger"}>
                  {p.pct}%
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Screen>
  );
}

/* 18. Synchronisation */
function SyncScreen({ ctx }) {
  const [syncing, setSyncing] = useState(false);
  const sessions = ctx.data.sessions;

  const syncNow = () => {
    if (!ctx.isOnline) return;
    setSyncing(true);
    setTimeout(() => {
      ctx.setData((d) => ({
        ...d,
        sessions: d.sessions.map((s) =>
          s.syncStatus === "pending" || s.syncStatus === "error"
            ? { ...s, syncStatus: "synced" }
            : s,
        ),
      }));
      setSyncing(false);
    }, 1100);
  };

  const statusMeta = {
    synced: { label: "Synchronisé", tone: "success", icon: CheckCircle2 },
    pending: { label: "En attente", tone: "warning", icon: Clock },
    error: {
      label: "Erreur de synchronisation",
      tone: "danger",
      icon: AlertTriangle,
    },
    offline: { label: "Hors ligne", tone: "neutral", icon: CloudOff },
  };

  return (
    <Screen>
      <TopBar title="Synchronisation" onBack={() => ctx.nav.pop()} />
      <div className="px-4 pt-4">
        <Card className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {ctx.isOnline ? (
              <Wifi size={18} color={COLORS.success} />
            ) : (
              <WifiOff size={18} color={COLORS.warning} />
            )}
            <div>
              <p
                className="font-bold text-[13.5px]"
                style={{ color: COLORS.text }}
              >
                {ctx.isOnline ? "Connexion disponible" : "Mode hors ligne"}
              </p>
              <p className="text-[11px]" style={{ color: COLORS.muted }}>
                {ctx.isOnline
                  ? "Vous pouvez synchroniser vos données."
                  : "Les données seront envoyées dès le retour du réseau."}
              </p>
            </div>
          </div>
          <button
            onClick={() => ctx.setIsOnline((v) => !v)}
            className="w-11 h-6 rounded-full relative transition"
            style={{
              background: ctx.isOnline ? COLORS.success : COLORS.border,
            }}
          >
            <span
              className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all"
              style={{ left: ctx.isOnline ? 22 : 2 }}
            />
          </button>
        </Card>

        {sessions.length === 0 ? (
          <EmptyState
            icon={UploadCloud}
            title="Rien à synchroniser"
            text="Vos évaluations apparaîtront ici une fois créées."
          />
        ) : (
          <div className="space-y-1.5 mb-4">
            {sessions.map((s) => {
              const { cls } = locateClass(ctx.data, s.classId) || {};
              const meta =
                statusMeta[ctx.isOnline ? s.syncStatus : "offline"] ||
                statusMeta.pending;
              return (
                <Card
                  key={s.id}
                  className="flex items-center justify-between !py-2.5"
                >
                  <div className="min-w-0">
                    <p
                      className="text-[12.5px] font-medium truncate"
                      style={{ color: COLORS.text }}
                    >
                      {cls?.name} · {s.date}
                    </p>
                    <p className="text-[11px]" style={{ color: COLORS.muted }}>
                      {s.questionIds.length} question(s)
                    </p>
                  </div>
                  <Badge tone={meta.tone} icon={meta.icon}>
                    {meta.label}
                  </Badge>
                </Card>
              );
            })}
          </div>
        )}

        <Btn
          full
          icon={syncing ? RefreshCw : UploadCloud}
          disabled={!ctx.isOnline || syncing}
          onClick={syncNow}
        >
          {syncing ? "Synchronisation en cours…" : "Synchroniser maintenant"}
        </Btn>
        {!ctx.isOnline && (
          <p
            className="text-[11.5px] mt-2 text-center"
            style={{ color: COLORS.warning }}
          >
            Activez la connexion pour synchroniser.
          </p>
        )}
      </div>
    </Screen>
  );
}

/* ================================ APP ROOT ================================ */
const SCREENS = {
  login: LoginScreen,
  dashboard: DashboardScreen,
  establishments: EstablishmentsScreen,
  years: YearsScreen,
  classes: ClassesScreen,
  classDetails: ClassDetailsScreen,
  importStudents: ImportStudentsScreen,
  importPreview: ImportPreviewScreen,
  cardAssignment: CardAssignmentScreen,
  subjects: SubjectsScreen,
  questionnaires: QuestionnairesScreen,
  createQuestionnaire: CreateQuestionnaireScreen,
  createQuestion: CreateQuestionScreen,
  evalPrep: EvalPrepScreen,
  sessionQuestion: SessionQuestionScreen,
  scanSimulation: ScanSimulationScreen,
  verifyAnswers: VerifyAnswersScreen,
  sessionResultsGlobal: ResultsGlobalScreen,
  sessionResultsByQuestion: ResultsByQuestionScreen,
  sessionResultsByStudent: ResultsByStudentScreen,
  sync: SyncScreen,
};

const NO_BOTTOM_BAR = new Set(["login", "scanSimulation"]);

export default function KagatPrototype() {
  const [data, setData] = useState(makeInitialData);
  const [isOnline, setIsOnline] = useState(true);
  const [stack, setStack] = useState([{ screen: "login", params: {} }]);

  const nav = {
    push: (screen, params = {}) => setStack((s) => [...s, { screen, params }]),
    pop: () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s)),
    resetTo: (screen, params = {}) => setStack([{ screen, params }]),
    replace: (screen, params = {}) =>
      setStack((s) => [...s.slice(0, -1), { screen, params }]),
    get current() {
      return stack[stack.length - 1];
    },
  };

  const ctx = { data, setData, isOnline, setIsOnline, nav };
  const current = stack[stack.length - 1];
  const ScreenComponent = SCREENS[current.screen] || DashboardScreen;

  return (
    <div
      className="w-full min-h-[100vh] flex items-center justify-center py-6"
      style={{
        background: "#E5E9F0",
        fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
      }}
    >
      <div
        className="relative w-full max-w-[390px] flex flex-col overflow-hidden"
        style={{
          background: COLORS.bg,
          height: 780,
          borderRadius: 34,
          border: "8px solid #14181F",
          boxShadow: "0 20px 50px rgba(15,23,33,0.25)",
        }}
      >
        {/* barre de statut simulée */}
        <div
          className="flex items-center justify-between px-5 pt-2 pb-1 text-[11px] font-semibold shrink-0"
          style={{ color: COLORS.text, background: COLORS.surface }}
        >
          <span>9:41</span>
          <div className="flex items-center gap-1">
            {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
            <span>KAGAT</span>
          </div>
        </div>

        <div
          className="flex-1 overflow-y-auto relative"
          style={{ background: COLORS.bg }}
        >
          <ScreenComponent ctx={ctx} />
        </div>

        {!NO_BOTTOM_BAR.has(current.screen) && <BottomStatusBar ctx={ctx} />}
      </div>
    </div>
  );
}
