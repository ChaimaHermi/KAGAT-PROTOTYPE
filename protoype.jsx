import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Building2, Calendar, Users, BookOpen, ClipboardList, ScanLine, CheckCircle2,
  XCircle, Wifi, WifiOff, RefreshCw, ChevronLeft, ChevronRight, ChevronDown, Plus, Upload,
  Edit3, Trash2, ArrowRight, BarChart3, User, Check, AlertTriangle,
  FileSpreadsheet, CreditCard, GraduationCap, School, Search, Home,
  PlayCircle, Camera, Save, X, ListChecks, UserCheck, UserX,
  Clock, CloudOff, UploadCloud, LogIn, Info, Pencil, MapPin, KeyRound, Copy,
  Share2, Archive, Lock, UserPlus, Settings, LogOut, ShieldCheck, Phone, Send, Sparkles, SlidersHorizontal, Cake, Target, Mail, Layers
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
  primary: "#1E77B4",
  primaryDark: "#14335C",
  primarySoft: "#DCEDF7",
  accent: "#1E77B4",
  accentDark: "#14335C",
  accentSoft: "#DCEDF7",
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

/* ------------------------------ THEME (Material 3) ------------------------
   Système central Material Design 3 pour toute l'app — couleurs par rôle,
   échelle typographique, grille d'espacement, paliers de forme et d'icône.
   COLORS (ci-dessus) reste la source des valeurs de marque et continue
   d'être utilisé tel quel par le code existant ; THEME.color en est une vue
   organisée par rôle Material, pour tout nouveau composant. THEME.type /
   space / shape / icon sont les échelles de référence : les classes
   Tailwind (`text-[13px]`, `rounded-[16px]`, `space-y-2`…) appliquées dans
   les écrans doivent correspondre à ces valeurs plutôt qu'à un choix libre
   au pixel près. */
const THEME = {
  color: {
    primary: COLORS.primary, onPrimary: "#FFFFFF", primaryContainer: COLORS.primarySoft, onPrimaryContainer: COLORS.primaryDark,
    secondary: COLORS.accent, onSecondary: "#FFFFFF", secondaryContainer: COLORS.accentSoft, onSecondaryContainer: COLORS.accentDark,
    error: COLORS.danger, onError: "#FFFFFF", errorContainer: COLORS.dangerSoft, onErrorContainer: COLORS.danger,
    success: COLORS.success, successContainer: COLORS.successSoft,
    warning: COLORS.warning, warningContainer: COLORS.warningSoft,
    surface: COLORS.surface, onSurface: COLORS.text, surfaceVariant: COLORS.bg, onSurfaceVariant: COLORS.muted,
    outline: COLORS.border, outlineVariant: "#F0F2F7",
  },
  /* 7 rôles Material retenus pour une app mobile dense (Headline Small →
     Label Small) — voir l'audit pour la correspondance avec les tailles
     historiques qu'ils remplacent. */
  type: {
    headlineSmall: { fontSize: 28, fontWeight: 800, lineHeight: "34px" },
    titleLarge: { fontSize: 18, fontWeight: 800, lineHeight: "24px" },
    titleMedium: { fontSize: 14, fontWeight: 700, lineHeight: "20px" },
    bodyMedium: { fontSize: 13, fontWeight: 500, lineHeight: "18px" },
    bodySmall: { fontSize: 12, fontWeight: 500, lineHeight: "16px" },
    labelMedium: { fontSize: 11, fontWeight: 700, lineHeight: "14px" },
    labelSmall: { fontSize: 10, fontWeight: 700, lineHeight: "13px" },
  },
  /* Grille d'espacement Material — base 8dp, 4dp toléré pour les micro-écarts. */
  space: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },
  /* Paliers de forme — sm : boutons ronds/chips, md : sous-cartes et badges
     d'icône, lg : cartes principales, full : boutons et onglets (pilule). */
  shape: { sm: 10, md: 16, lg: 20, full: 999 },
  /* Paliers d'icône Material — inline (texte courant), dense (rangées/listes), standard (héros). */
  icon: { inline: 18, dense: 20, standard: 24 },
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
/* Bandes de réussite partagées entre la vue enseignant (une classe) et la vue gestionnaire
   (tout l'établissement) — même échelle de lecture partout dans l'app. */
const RESULT_BANDS = [
  { key: "excellent", label: "Excellent", range: "≥ 80%", color: COLORS.success, min: 80 },
  { key: "bien", label: "Bien", range: "60-79%", color: COLORS.primary, min: 60 },
  { key: "moyen", label: "Moyen", range: "40-59%", color: COLORS.warning, min: 40 },
  { key: "faible", label: "À revoir", range: "< 40%", color: COLORS.danger, min: 0 },
];

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
const DECIMALS_QUESTIONS = [
  { id: "dq1", text: "Dans 3,45, quel chiffre représente les dixièmes ?", choices: { A: "3", B: "4", C: "5", D: "0" }, correct: "B" },
  { id: "dq2", text: "Quel est le plus grand nombre ?", choices: { A: "2,5", B: "2,05", C: "2,45", D: "2,1" }, correct: "A" },
  { id: "dq3", text: "Combien font 1,2 + 0,3 ?", choices: { A: "1,5", B: "1,3", C: "1,23", D: "4,5" }, correct: "A" },
];
const COMPARE_FRACTIONS_QUESTIONS = [
  { id: "cq1", text: "Quelle fraction est la plus petite ?", choices: { A: "1/2", B: "1/5", C: "1/3", D: "1/4" }, correct: "B" },
  { id: "cq2", text: "1/2 est-elle plus grande que 1/3 ?", choices: { A: "Oui", B: "Non", C: "Égales", D: "Impossible à dire" }, correct: "A" },
];
const GRAMMAR_QUESTIONS = [
  { id: "gq1", text: "Quel est le participe passé du verbe « faire » ?", choices: { A: "Fais", B: "Fait", C: "Faisant", D: "Ferai" }, correct: "B" },
  { id: "gq2", text: "Accordez : « Les fleurs que j'ai ... »", choices: { A: "cueilli", B: "cueillies", C: "cueillie", D: "cueillis" }, correct: "B" },
  { id: "gq3", text: "Quel mot est un adverbe ?", choices: { A: "Rapide", B: "Rapidement", C: "Rapidité", D: "Rapides" }, correct: "B" },
];

function makeInitialData() {
  const studentsC1 = generateStudents(100, "a");
  const studentsC2 = generateStudents(30, "b");
  const now = Date.now();
  const answersC1 = {};
  studentsC1.slice(0, 22).forEach((s, i) => { answersC1[s.id] = { q1: "B", q2: i % 3 === 0 ? "B" : "A", q3: i % 5 === 0 ? "C" : "A" }; });
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
    invitations: [],
    years: [
      {
        id: "y1", label: "2026–2027", archived: false,
        /* Matières/cours/questionnaires vivent au niveau (partagés par toutes les sections
           de ce niveau) — évite de dupliquer le même contenu pédagogique entre 5e A et 5e B. */
        levels: {
          "5e année": {
            subjects: [
              { id: "s1", name: "Mathématiques", archived: false,
                courses: [
                  { id: "co1", title: "Les fractions", description: "Comprendre et manipuler les fractions", competencies: [
                    { id: "cp1", title: "Reconnaître une fraction", description: "Identifier le numérateur et le dénominateur" },
                    { id: "cp2", title: "Comparer des fractions", description: "Comparer des fractions simples" },
                  ] },
                  { id: "co1b", title: "Les nombres décimaux", description: "Introduction aux nombres décimaux", competencies: [] },
                ],
                questionnaires: [
                  { id: "qz1", title: "Les fractions", description: "Notions de base sur les fractions", courseId: "co1", competencyIds: ["cp1"], archived: false, questions: FRACTIONS_QUESTIONS },
                  { id: "qz1c", title: "Comparer des fractions", description: "", courseId: "co1", competencyNames: ["Comparer des fractions"], targetQuestionCount: 3, archived: false, questions: [FRACTIONS_QUESTIONS[2]] },
                  { id: "qz1b", title: "Les nombres décimaux", description: "", courseId: "co1b", competencyNames: ["Lire un nombre décimal"], targetQuestionCount: 3, archived: false, questions: DECIMALS_QUESTIONS },
                ] },
              { id: "s2", name: "Français", archived: false, courses: [], questionnaires: [] },
              { id: "s3", name: "Sciences", archived: false, courses: [], questionnaires: [] },
            ],
          },
          "4e année": {
            subjects: [
              { id: "s4", name: "Mathématiques", archived: false, courses: [], questionnaires: [] },
            ],
          },
        },
        classes: [
          {
            id: "c1", name: "5e année A", level: "5e année", cardCount: 100, archived: false,
            students: studentsC1,
            teacherBySubject: { s1: "t1" }, // qui enseigne quelle matière du niveau, pour CETTE section
            questionnaireOverrides: [], // copies locales, seulement si un enseignant a dupliqué pour adapter
          },
          {
            id: "c2", name: "4e année B", level: "4e année", cardCount: 30, archived: false,
            students: studentsC2,
            teacherBySubject: { s4: "t1" },
            questionnaireOverrides: [],
          },
        ],
      },
    ],
    /* Une évaluation déjà terminée dans 5e A — pour que les écrans de résultats (enseignant
       et gestionnaire) aient tout de suite quelque chose à montrer en démo, sans avoir à
       lancer un scan manuellement d'abord. */
    sessions: [
      {
        id: "sess1", classId: "c1", subjectId: "s1", courseId: "co1", questionnaireId: "qz1", teacherId: "t1",
        date: new Date(now - 2 * 86400000).toLocaleDateString("fr-FR"), createdAt: now - 2 * 86400000,
        questionIds: FRACTIONS_QUESTIONS.map((q) => q.id), currentQuestionIndex: FRACTIONS_QUESTIONS.length - 1,
        participantSnapshot: studentsC1.map((s) => ({ id: s.id, name: s.name, cardNumber: s.cardNumber, studentCode: s.studentCode })),
        answers: answersC1, questionStatus: {}, declaredAbsentIds: [], status: "completed",
        syncStatus: "synced", lastSyncedAt: now - 2 * 86400000,
      },
    ],
  };
}

/* Démo "enseignant indépendant" : un seul niveau, deux sections du même niveau — pour montrer
   tout de suite ce que le mode indépendant permet de voir : programme partagé entre les deux
   classes (le même questionnaire pour les deux), mais avancement différent (5e A a évalué deux
   sujets — dont un faible, pour voir tout de suite l'alerte "résultats faibles" — 5e B un seul,
   et une évaluation encore en cours pour voir cet état aussi). */
function makeIndependentDemoData() {
  const selfId = "t_ind1";
  const studentsA = generateStudents(12, "ia");
  const studentsB = generateStudents(10, "ib");
  const now = Date.now();
  const answersA = {};
  studentsA.forEach((s, i) => { answersA[s.id] = { q1: "B", q2: i % 4 === 0 ? "B" : "A", q3: "A" }; });
  // Résultat faible (5e A, "Les nombres décimaux") — pour démontrer l'alerte "résultats faibles".
  const weakDecimalsA = {};
  studentsA.forEach((s, i) => { weakDecimalsA[s.id] = { dq1: "A", dq2: "C", dq3: i % 6 === 0 ? "A" : "D" }; });
  // Bon résultat (5e B, "Les nombres décimaux") — même questionnaire partagé, avancement différent.
  const goodDecimalsB = {};
  studentsB.forEach((s, i) => { goodDecimalsB[s.id] = { dq1: "B", dq2: i % 5 === 0 ? "C" : "A", dq3: "A" }; });
  // Évaluation encore en cours (5e A, Français) — seuls les premiers élèves scannés ont répondu.
  const partialGrammarA = {};
  studentsA.slice(0, 6).forEach((s, i) => { partialGrammarA[s.id] = { gq1: i % 3 === 0 ? "A" : "B" }; });

  return {
    establishment: {
      id: "est_ind1", name: "Mon espace pédagogique", country: "Algérie", region: "Alger",
      city: "Alger", type: "Public", level: "Primaire", accountType: "independent",
    },
    admin: { id: "admin_ind1", name: "Nadia Amari", nationality: "Algérienne", country: "Algérie", city: "Alger", birthDate: "1990-05-15", gender: "F", email: "nadia.amari@email.com", phone: "", username: "nadia.amari", password: "demo123", createdAt: now - 20 * 86400000, lastLoginAt: now - 3600000, selfTeacherId: selfId },
    subjectCatalog: [...SUBJECT_CATALOG_SEED],
    teachers: [
      { id: selfId, name: "Nadia Amari", birthDate: "1990-05-15", gender: "F", email: "nadia.amari@email.com", phone: "", username: "nadia.amari", password: "demo123", mustChangePassword: false, active: true, createdAt: now - 20 * 86400000, lastLoginAt: now - 3600000 },
    ],
    invitations: [],
    years: [
      {
        id: "y_ind1", label: "2026–2027", archived: false,
        levels: {
          "5e année": {
            subjects: [
              { id: "s_ind1", name: "Mathématiques", archived: false,
                courses: [
                  { id: "co_ind1", title: "Les fractions", description: "Comprendre et manipuler les fractions", competencies: [
                    { id: "cp_ind1", title: "Reconnaître une fraction", description: "Identifier le numérateur et le dénominateur" },
                    { id: "cp_ind2", title: "Comparer des fractions", description: "Comparer des fractions simples" },
                  ] },
                  { id: "co_ind2", title: "Les décimaux", description: "Introduction aux nombres décimaux", competencies: [
                    { id: "cp_ind3", title: "Lire un nombre décimal", description: "Identifier partie entière et partie décimale" },
                  ] },
                ],
                questionnaires: [
                  { id: "qz_ind1", title: "Les fractions", description: "Notions de base sur les fractions", courseId: "co_ind1", competencyIds: ["cp_ind1"], archived: false, questions: FRACTIONS_QUESTIONS },
                  { id: "qz_ind3", title: "Comparer des fractions", description: "", courseId: "co_ind1", competencyNames: ["Comparer des fractions"], targetQuestionCount: 2, archived: false, questions: COMPARE_FRACTIONS_QUESTIONS },
                  { id: "qz_ind2", title: "Les nombres décimaux", description: "", courseId: "co_ind2", competencyIds: ["cp_ind3"], targetQuestionCount: 3, archived: false, questions: DECIMALS_QUESTIONS },
                ] },
              { id: "s_ind2", name: "Français", archived: false,
                courses: [{ id: "co_ind3", title: "Grammaire", description: "Accords et nature des mots", competencies: [] }],
                questionnaires: [
                  { id: "qz_ind4", title: "Les accords", description: "", courseId: "co_ind3", competencyNames: ["Accorder le participe passé"], targetQuestionCount: 3, archived: false, questions: GRAMMAR_QUESTIONS },
                ] },
            ],
          },
        },
        classes: [
          {
            id: "c_ind1", name: "5e année A", level: "5e année", cardCount: 40, archived: false,
            students: studentsA,
            teacherBySubject: { s_ind1: selfId, s_ind2: selfId },
            questionnaireOverrides: [],
          },
          {
            id: "c_ind2", name: "5e année B", level: "5e année", cardCount: 40, archived: false,
            students: studentsB,
            teacherBySubject: { s_ind1: selfId, s_ind2: selfId },
            questionnaireOverrides: [],
          },
        ],
      },
    ],
    sessions: [
      {
        id: "sess_ind1", classId: "c_ind1", subjectId: "s_ind1", courseId: "co_ind1", questionnaireId: "qz_ind1", teacherId: selfId,
        date: new Date(now - 3 * 86400000).toLocaleDateString("fr-FR"), createdAt: now - 3 * 86400000,
        questionIds: FRACTIONS_QUESTIONS.map((q) => q.id), currentQuestionIndex: FRACTIONS_QUESTIONS.length - 1,
        participantSnapshot: studentsA.map((s) => ({ id: s.id, name: s.name, cardNumber: s.cardNumber, studentCode: s.studentCode })),
        answers: answersA, questionStatus: {}, declaredAbsentIds: [], status: "completed",
        syncStatus: "synced", lastSyncedAt: now - 3 * 86400000,
      },
      {
        id: "sess_ind2", classId: "c_ind1", subjectId: "s_ind1", courseId: "co_ind2", questionnaireId: "qz_ind2", teacherId: selfId,
        date: new Date(now - 1 * 86400000).toLocaleDateString("fr-FR"), createdAt: now - 1 * 86400000,
        questionIds: DECIMALS_QUESTIONS.map((q) => q.id), currentQuestionIndex: DECIMALS_QUESTIONS.length - 1,
        participantSnapshot: studentsA.map((s) => ({ id: s.id, name: s.name, cardNumber: s.cardNumber, studentCode: s.studentCode })),
        answers: weakDecimalsA, questionStatus: {}, declaredAbsentIds: [], status: "completed",
        syncStatus: "synced", lastSyncedAt: now - 1 * 86400000,
      },
      {
        id: "sess_ind3", classId: "c_ind2", subjectId: "s_ind1", courseId: "co_ind2", questionnaireId: "qz_ind2", teacherId: selfId,
        date: new Date(now - 2 * 86400000).toLocaleDateString("fr-FR"), createdAt: now - 2 * 86400000,
        questionIds: DECIMALS_QUESTIONS.map((q) => q.id), currentQuestionIndex: DECIMALS_QUESTIONS.length - 1,
        participantSnapshot: studentsB.map((s) => ({ id: s.id, name: s.name, cardNumber: s.cardNumber, studentCode: s.studentCode })),
        answers: goodDecimalsB, questionStatus: {}, declaredAbsentIds: [], status: "completed",
        syncStatus: "synced", lastSyncedAt: now - 2 * 86400000,
      },
      {
        id: "sess_ind4", classId: "c_ind1", subjectId: "s_ind2", courseId: "co_ind3", questionnaireId: "qz_ind4", teacherId: selfId,
        date: new Date(now).toLocaleDateString("fr-FR"), createdAt: now,
        questionIds: GRAMMAR_QUESTIONS.map((q) => q.id), currentQuestionIndex: 1,
        participantSnapshot: studentsA.map((s) => ({ id: s.id, name: s.name, cardNumber: s.cardNumber, studentCode: s.studentCode })),
        answers: partialGrammarA, questionStatus: {}, declaredAbsentIds: [], status: "in_progress",
        syncStatus: "pending", lastSyncedAt: null,
      },
    ],
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
/* Matières/cours/questionnaires vivent au niveau (partagés par toutes les sections) —
   ces helpers lisent/écrivent year.levels[levelName], pas class.subjects. */
function getLevelSubjects(yr, levelName) {
  return (yr?.levels && yr.levels[levelName] && yr.levels[levelName].subjects) || [];
}
/* Un niveau "existe" soit parce qu'il a été créé explicitement (year.levels), soit parce
   qu'au moins une classe non archivée l'utilise déjà — union des deux pour ne rien perdre. */
function getYearLevelNames(yr) {
  const names = new Set(Object.keys(yr?.levels || {}));
  (yr?.classes || []).forEach((c) => { if (!c.archived) names.add(c.level); });
  return [...names].sort();
}
function updateLevel(data, yearId, levelName, updater) {
  return {
    ...data,
    years: data.years.map((y) => {
      if (y.id !== yearId) return y;
      const current = (y.levels && y.levels[levelName]) || { subjects: [] };
      return { ...y, levels: { ...(y.levels || {}), [levelName]: updater(current) } };
    }),
  };
}
function updateSession(data, sessionId, updater) {
  return { ...data, sessions: data.sessions.map((s) => (s.id === sessionId ? updater(s) : s)) };
}
function findSession(data, sessionId) { return data.sessions.find((s) => s.id === sessionId); }
/* Une classe peut avoir dupliqué un questionnaire partagé pour l'adapter — on la vérifie
   d'abord ; sinon on retombe sur le questionnaire partagé du niveau. */
function findQuestionnaire(yr, cls, subjectId, questionnaireId) {
  const subject = getLevelSubjects(yr, cls.level).find((s) => s.id === subjectId);
  const override = (cls.questionnaireOverrides || []).find((q) => q.id === questionnaireId && q.subjectId === subjectId);
  if (override) return { subject, questionnaire: override, isOverride: true };
  if (!subject) return { subject: null, questionnaire: null, isOverride: false };
  return { subject, questionnaire: subject.questionnaires.find((q) => q.id === questionnaireId), isOverride: false };
}
function findTeacher(data, teacherId) { return data.teachers.find((t) => t.id === teacherId); }
function uid(prefix) { return `${prefix}${Math.random().toString(36).slice(2, 9)}`; }

/* Ne regarde que les années NON archivées : clôturer une année ne touche pas le drapeau
   "archived" de chaque classe une par une, seulement celui de l'année. Sans ce filtre, les
   affectations d'une année clôturée resteraient mélangées indéfiniment avec la nouvelle —
   un enseignant garderait pour toujours ses anciennes classes dans "Mes classes", même après
   promotion. L'historique reste consultable (lecture seule) depuis Classes → l'année archivée. */
function getTeacherAssignments(data, teacherId) {
  const out = [];
  data.years.forEach((yr) => {
    if (yr.archived) return;
    yr.classes.forEach((cls) => {
      if (cls.archived) return;
      const subjects = getLevelSubjects(yr, cls.level);
      Object.entries(cls.teacherBySubject || {}).forEach(([subjectId, tId]) => {
        if (tId !== teacherId) return;
        const subject = subjects.find((s) => s.id === subjectId);
        if (subject && !subject.archived) out.push({ cls, subject });
      });
    });
  });
  return out;
}
/* Regroupe les affectations d'un enseignant par NIVEAU plutôt que par classe : cours,
   compétences et questionnaires sont partagés à ce niveau (toutes ses sections), alors que
   lancer une évaluation et consulter des résultats reste propre à chaque classe réelle.
   C'est cette distinction qui structure toute la navigation enseignant. */
/* includeArchivedYears : false partout où on parle du présent (tableau de bord, démarrer une
   évaluation...) — true seulement pour naviguer/consulter une année clôturée en lecture
   seule, depuis "Mes années". Ne délègue pas à getTeacherAssignments (verrouillée sur l'année
   active) pour pouvoir, justement, inclure les années archivées à la demande. */
function getTeacherLevelGroups(data, teacherId, opts = {}) {
  const { includeArchivedYears = false } = opts;
  const groups = [];
  data.years.forEach((yr) => {
    if (yr.archived && !includeArchivedYears) return;
    yr.classes.forEach((cls) => {
      if (cls.archived) return;
      const subjects = getLevelSubjects(yr, cls.level);
      Object.entries(cls.teacherBySubject || {}).forEach(([subjectId, tId]) => {
        if (tId !== teacherId) return;
        const subject = subjects.find((s) => s.id === subjectId);
        if (!subject || subject.archived) return;
        let g = groups.find((x) => x.yearId === yr.id && x.level === cls.level);
        if (!g) { g = { yearId: yr.id, yearLabel: yr.label, yearArchived: yr.archived, level: cls.level, subjects: [], classes: [] }; groups.push(g); }
        if (!g.subjects.some((s) => s.id === subject.id)) g.subjects.push(subject);
        if (!g.classes.some((c) => c.id === cls.id)) g.classes.push(cls);
      });
    });
  });
  return groups;
}
/* Même chose, regroupée un cran au-dessus par année scolaire — pour afficher
   Année → Niveaux → (Préparer / Mes classes), comme côté gestionnaire. */
function getTeacherYearGroups(data, teacherId, opts = {}) {
  const years = [];
  getTeacherLevelGroups(data, teacherId, opts).forEach((g) => {
    let y = years.find((x) => x.yearId === g.yearId);
    if (!y) { y = { yearId: g.yearId, yearLabel: g.yearLabel, yearArchived: g.yearArchived, levels: [] }; years.push(y); }
    y.levels.push(g);
  });
  /* L'année active apparaît toujours, même sans aucune affectation pour le moment — sinon
     un enseignant qui vient d'être promu dans une nouvelle année (matières pas encore
     réaffectées par le gestionnaire) ne verrait plus aucune année du tout. */
  const activeYear = data.years.find((yr) => !yr.archived);
  if (activeYear && !years.some((y) => y.yearId === activeYear.id)) {
    years.push({ yearId: activeYear.id, yearLabel: activeYear.label, yearArchived: false, levels: [] });
  }
  years.sort((a, b) => (a.yearArchived === b.yearArchived ? 0 : a.yearArchived ? 1 : -1));
  return years;
}
/* Avancement d'une classe dans le PROGRAMME (cours), pas dans les évaluations : pour chaque
   cours des matières enseignées dans cette classe, "fait" si toutes ses compétences ont déjà
   été évaluées au moins une fois dans cette classe précise, sinon "pas encore". Un cours sans
   compétence définie n'a rien à montrer, on l'ignore. Compare une classe à l'autre au même
   niveau — utile puisque le programme est partagé mais chaque section avance à son rythme. */
function getClassCourseProgress(data, cls, mySubjects) {
  const items = [];
  mySubjects.forEach((s) => {
    const myOverrides = (cls.questionnaireOverrides || []).filter((o) => o.subjectId === s.id && !o.archived);
    (s.courses || []).forEach((course) => {
      const qs = s.questionnaires.filter((q) => !q.archived && q.courseId === course.id);
      if (qs.length === 0) return;
      const done = qs.some((q) => {
        const override = myOverrides.find((o) => o.sourceQuestionnaireId === q.id);
        const targetId = override ? override.id : q.id;
        return data.sessions.some((sess) => sess.classId === cls.id && sess.subjectId === s.id && sess.questionnaireId === targetId && sess.status === "completed");
      });
      items.push({ key: `${s.id}-${course.id}`, title: course.title, done, subjectId: s.id, courseId: course.id });
    });
  });
  return items;
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
/* --------------------- FIN D'ANNÉE / PASSAGE DE NIVEAU --------------------- */
/* Suggestion de niveau suivant, jamais imposée : on incrémente le chiffre de tête
   s'il y en a un ("5e année" -> "6e année"), sinon on laisse tel quel — l'admin
   corrige lui-même, car la nomenclature des niveaux change trop d'une école à l'autre
   pour être devinée de façon fiable ("CM2", "Terminale", etc.). */
function nextLevelGuess(level) {
  const m = /^(\d+)(.*)$/.exec((level || "").trim());
  return m ? `${parseInt(m[1], 10) + 1}${m[2]}` : level;
}
function nextYearLabelGuess(label) {
  const m = /^(\d{4})(\D+)(\d{4})$/.exec((label || "").trim());
  return m ? `${parseInt(m[1], 10) + 1}${m[2]}${parseInt(m[3], 10) + 1}` : "";
}
/* Regroupe tous les élèves actifs de l'année par niveau, toutes classes confondues —
   la classe d'origine (A, B, ...) n'a aucune importance à ce stade. */
function getPromotionLevels(data, yearId) {
  const yr = data.years.find((y) => y.id === yearId);
  if (!yr) return [];
  const byLevel = new Map();
  yr.classes.filter((c) => !c.archived && !c.pendingDistribution).forEach((c) => {
    c.students.filter((s) => !s.archived).forEach((s) => {
      const arr = byLevel.get(c.level) || [];
      arr.push({ ...s, classId: c.id, className: c.name });
      byLevel.set(c.level, arr);
    });
  });
  return [...byLevel.entries()].map(([level, students]) => ({ level, students }));
}
/* Déplace des élèves d'une classe "à répartir" vers une classe réelle de la nouvelle année. */
function moveStudents(data, yearId, fromClassId, toClassId, studentIds) {
  const idSet = new Set(studentIds);
  return updateYear(data, yearId, (y) => {
    let moved = [];
    const stripped = y.classes.map((c) => {
      if (c.id !== fromClassId) return c;
      moved = c.students.filter((s) => idSet.has(s.id));
      return { ...c, students: c.students.filter((s) => !idSet.has(s.id)) };
    });
    return { ...y, classes: stripped.map((c) => (c.id === toClassId ? { ...c, students: [...c.students, ...moved] } : c)) };
  });
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
        <button onClick={onBack} className="topbar-action w-10 h-10 flex items-center justify-center rounded-[16px] -ml-1 active:scale-95 transition" aria-label="Retour">
          <ChevronLeft size={20} color={COLORS.primary} />
        </button>
      ) : <div className="topbar-brand w-10 h-10 rounded-[16px] flex items-center justify-center"><GraduationCap size={20} /></div>}
      <div className="flex-1 min-w-0">
        <h1 className="text-[18px] font-extrabold tracking-[-0.025em] truncate" style={{ color: COLORS.text }}>{title}</h1>
        {subtitle && <p className="text-[11px] truncate" style={{ color: COLORS.muted }}>{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

function SectionLabel({ children }) {
  return <div className="section-label flex items-center gap-2 px-0.5"><span /><p className="text-[11px] font-extrabold uppercase" style={{ color: COLORS.muted, letterSpacing: "0.09em" }}>{children}</p></div>;
}
/* Bouton d'ajout inline (cours, compétence, questionnaire…) — un vrai bouton avec bordure
   pointillée et icône +, plutôt qu'un simple lien texte souligné par la couleur : plus visible
   comme zone tactile, et la couleur (tone) permet de garder le code couleur cours/compétence/
   questionnaire déjà utilisé dans le programme. */
function AddRow({ label, onClick, tone = "primary", full = true }) {
  const tones = {
    primary: { fg: COLORS.primary, bg: COLORS.primarySoft },
    success: { fg: COLORS.success, bg: COLORS.successSoft },
    accent: { fg: COLORS.accent, bg: COLORS.accentSoft },
  };
  const t = tones[tone];
  return (
    <button onClick={onClick} className={`flex items-center justify-center gap-1.5 rounded-[16px] shrink-0 ${full ? "w-full py-2.5" : "py-1.5 px-3"}`} style={{ border: `1.5px dashed ${t.fg}66`, background: t.bg, color: t.fg }}>
      <Plus size={13} />
      <span className="text-[12px] font-bold">{label}</span>
    </button>
  );
}
function getQuestionnaireCompetencies(subject, questionnaire) {
  const ids = questionnaire?.competencyIds || [];
  return (subject?.courses || []).flatMap((course) => course.competencies || []).filter((competency) => ids.includes(competency.id));
}
/* Compétences évaluées par un questionnaire, en libellés simples — priorité aux étiquettes
   libres (competencyNames, saisies à la création du questionnaire), avec repli sur l'ancien
   modèle à compétences réelles rattachées au cours pour les données existantes. */
function getQuestionnaireSkillLabels(subject, questionnaire) {
  if (questionnaire?.competencyNames?.length) return questionnaire.competencyNames;
  return getQuestionnaireCompetencies(subject, questionnaire).map((c) => c.title);
}

/* Échelle de hauteur unique pour tous les boutons Btn de l'app (convention Material/Flutter :
   cible tactile confortable) — fixée en minHeight plutôt que déduite du padding+police, pour
   qu'elle reste identique quel que soit le texte ou la variante. */
const BTN_SIZES = {
  md: { minHeight: 48, padding: "0 20px", fontSize: 13, iconSize: 17 },
  sm: { minHeight: 40, padding: "0 16px", fontSize: 12, iconSize: 16 },
};
/* Correspondance avec les 5 types de bouton Material 3 (aucun n'a de structure séparée —
   c'est la même pilule 40/48px, seule la variante de style change) :
     primary / danger / success / accent  → Filled   (fond plein + ombre colorée)
     secondary                            → Filled Tonal (fond doux, sans ombre)
     ghost                                → Outlined (contour seul)
     text                                 → Text     (aucun décor) */
function Btn({ children, onClick, variant = "primary", full, disabled, icon: Icon, size = "md", type = "button" }) {
  /* Forme "stadium" (pilule) plutôt que des coins légèrement arrondis — chaque variante a un
     seul niveau d'accent, pas de bordure + ombre + fond empilés en même temps. */
  const styles = {
    primary: { background: disabled ? "#B7C0D9" : COLORS.primary, color: "#fff", border: "none", boxShadow: disabled ? "none" : "0 8px 18px rgba(30,119,180,.26)" },
    accent: { background: disabled ? "#8FC5E0" : COLORS.accent, color: "#fff", border: "none", boxShadow: disabled ? "none" : "0 8px 18px rgba(30,119,180,.26)" },
    danger: { background: disabled ? "#EFC1BB" : COLORS.danger, color: "#fff", border: "none", boxShadow: disabled ? "none" : "0 8px 18px rgba(214,77,61,.24)" },
    success: { background: disabled ? "#AFDBCC" : COLORS.success, color: "#fff", border: "none", boxShadow: disabled ? "none" : "0 8px 18px rgba(22,134,111,.24)" },
    secondary: { background: disabled ? "#EEF1F4" : COLORS.primarySoft, color: disabled ? COLORS.muted : COLORS.primary, border: "none", boxShadow: "none" },
    ghost: { background: "transparent", color: disabled ? COLORS.muted : COLORS.primary, border: `1.5px solid ${disabled ? COLORS.border : COLORS.primary}`, boxShadow: "none" },
    text: { background: "transparent", color: disabled ? COLORS.muted : COLORS.primary, border: "none", boxShadow: "none" },
  };
  const sz = BTN_SIZES[size] || BTN_SIZES.md;
  return (
    <button type={type} onClick={disabled ? undefined : onClick} disabled={disabled}
      className={`app-button app-button--${variant} rounded-full font-semibold tracking-[0.01em] flex items-center justify-center gap-1.5 transition-all duration-150 active:scale-[0.97] ${full ? "w-full" : ""} ${disabled ? "cursor-not-allowed" : ""}`}
      style={{ ...styles[variant], minHeight: sz.minHeight, padding: sz.padding, fontSize: sz.fontSize }}>
      {Icon && <Icon size={sz.iconSize} />}
      {children}
    </button>
  );
}

/* ---------------------------- CONNEXION SOCIALE --------------------------- */
/* Logos officiels en SVG inline (lucide-react ne fournit pas de logos de marque) */
function GoogleIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v2.98h3.86c2.26-2.08 3.56-5.14 3.56-8.8z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.92l-3.86-2.98c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z" />
      <path fill="#FBBC05" d="M5.27 14.29a7.2 7.2 0 010-4.58V6.62H1.29a12 12 0 000 10.76l3.98-3.09z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z" />
    </svg>
  );
}
function FacebookIcon({ size = 18, color = "#1877F2" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <path d="M24 12.07C24 5.7 18.63.5 12 .5S0 5.7 0 12.07c0 5.76 4.39 10.53 10.13 11.43v-8.08H7.08v-3.35h3.05V9.41c0-3 1.83-4.65 4.6-4.65 1.33 0 2.72.24 2.72.24v2.94H16c-1.5 0-1.97.92-1.97 1.86v2.24h3.36l-.54 3.35h-2.82v8.08C19.61 22.6 24 17.83 24 12.07z" />
    </svg>
  );
}
/* Format unique pour Google et Facebook (fond blanc, bordure, ombre légère) : seul le logo
   change entre les deux, pour qu'aucun des deux ne prenne le pas visuellement sur "Se connecter". */
function SocialButton({ provider, onClick, disabled }) {
  const isGoogle = provider === "google";
  return (
    <button type="button" onClick={disabled ? undefined : onClick} disabled={disabled}
      className="w-full flex items-center justify-center gap-3 rounded-[16px] font-bold transition active:scale-[0.98]"
      style={{
        minHeight: 48,
        fontSize: 13,
        background: "#FFFFFF",
        border: `1.5px solid ${COLORS.border}`,
        color: COLORS.text,
        boxShadow: "0 2px 8px rgba(23,32,51,0.06)",
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}>
      {isGoogle ? <GoogleIcon size={18} /> : <FacebookIcon size={18} />}
      <span>Continuer avec {isGoogle ? "Google" : "Facebook"}</span>
    </button>
  );
}
/* Séparateur "ou" — sobre, réutilisé partout où deux méthodes d'accès se juxtaposent */
function OrDivider({ label = "ou" }) {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px" style={{ background: COLORS.border }} />
      <span className="text-[11px] font-bold uppercase" style={{ color: COLORS.muted, letterSpacing: "0.08em" }}>{label}</span>
      <div className="flex-1 h-px" style={{ background: COLORS.border }} />
    </div>
  );
}
/* Connexion sociale "instantanée" : Google/Facebook authentifient déjà l'utilisateur en amont,
   donc il n'y a ni mot de passe local à saisir, ni code à vérifier — on entre directement. */
function quickSocialAuth(ctx, provider) {
  const demoData = makeInitialData();
  ctx.setData(demoData);
  const demoTeacher = demoData.teachers.find((t) => t.id === "t1");
  ctx.setData((d) => ({ ...d, teachers: d.teachers.map((t) => (t.id === demoTeacher.id ? { ...t, lastLoginAt: Date.now() } : t)) }));
  ctx.setCurrentUser({ type: "teacher", id: demoTeacher.id });
  ctx.showToast(`Connecté avec ${provider === "google" ? "Google" : "Facebook"}.`);
  ctx.enterApp("teacher");
}

/* Material 3 "Elevated card" — élévation seule (pas de bordure), rayon "Large" (16px) de
   l'échelle de formes. Une carte ne combine jamais bordure ET ombre en Material. */
function Card({ children, className = "", onClick, style }) {
  return (
    <div onClick={onClick} className={`app-card rounded-[16px] p-4 ${onClick ? "app-card--interactive cursor-pointer active:scale-[0.99] transition" : ""} ${className}`}
      style={{ background: COLORS.surface, border: "none", boxShadow: "0 1px 2px rgba(23,32,51,0.08), 0 4px 10px rgba(23,32,51,0.06)", ...style }}>
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
    <span className="app-badge inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold" style={{ background: t.bg, color: t.fg }}>
      {Icon && <Icon size={12} />}{children}
    </span>
  );
}

/* TextField Material 3 "outlined" — le label vit dans le contour du champ et migre au-dessus
   au focus/remplissage (voir .app-field-label dans index.css). Purement visuel : les enfants
   (TextInput/TextArea/etc.) gardent leurs props value/onChange/placeholder inchangées. */
function Field({ label, children }) {
  return (
    <label className="app-field block relative mb-5">
      {children}
      <span className="app-field-label">{label}</span>
    </label>
  );
}

function DemoFillButton({ onClick, label = "Utiliser un exemple de démo" }) {
  return <button type="button" onClick={onClick} className="mb-4 inline-flex items-center gap-1.5 text-[12px] font-bold" style={{ color: COLORS.accent }}><Sparkles size={18} />{label}</button>;
}

function OfflineVerificationState({ onRetry, onEdit }) {
  return (
    <div className="px-4 pt-6">
      <Card className="text-center py-6" style={{ background: COLORS.warningSoft, border: "none" }}>
        <div className="w-14 h-14 rounded-[16px] flex items-center justify-center mx-auto mb-3" style={{ background: "#fff" }}><WifiOff size={24} color={COLORS.warning} /></div>
        <Badge tone="warning" icon={Clock}>En attente de connexion</Badge>
        <p className="text-[14px] font-bold mt-4 mb-2" style={{ color: COLORS.text }}>Vérification nécessaire</p>
        <p className="text-[13px] leading-5" style={{ color: COLORS.muted }}>Vous êtes hors ligne. Votre compte sera vérifié dès la reconnexion.</p>
      </Card>
      <Card className="my-4 flex items-start gap-3"><Lock size={18} color={COLORS.primary} className="shrink-0 mt-0.5" /><p className="text-[12px] leading-5" style={{ color: COLORS.muted }}>L’accès à KAGAT reste verrouillé jusqu’à la synchronisation et la vérification de votre compte.</p></Card>
      <Btn full icon={RefreshCw} onClick={onRetry}>Réessayer la connexion</Btn>
      <div className="mt-2"><Btn full variant="ghost" icon={Pencil} onClick={onEdit}>Modifier mes informations</Btn></div>
    </div>
  );
}

/* padding-top généreux : c'est l'espace que le label "outlined" occupe au repos avant de
   migrer au-dessus du champ (voir Field). Rayon 8px — plus petit que les boutons/cartes,
   conforme au shape "extra small" que Material réserve aux champs de saisie. */
const inputStyle = { width: "100%", padding: "20px 13px 8px", minHeight: 52, borderRadius: 8, border: `1px solid ${COLORS.border}`, fontSize: 13.5, color: COLORS.text, background: "#FFFFFF", outline: "none" };
function TextInput(props) { return <input placeholder=" " {...props} style={{ ...inputStyle, ...(props.style || {}) }} />; }
function TextArea(props) { return <textarea placeholder=" " {...props} style={{ ...inputStyle, resize: "none", ...(props.style || {}) }} />; }
/* Barre de recherche unique, réutilisée partout où on filtre une liste (élèves, enseignants…) —
   avant, certains écrans utilisaient TextInput (fond blanc, bordure) et d'autres un champ avec
   icône (fond gris, sans bordure) : deux styles différents pour la même action. */
function SearchInput({ value, onChange, placeholder, autoFocus, className = "" }) {
  return (
    <div className={`flex items-center gap-2 px-3.5 rounded-[16px] ${className}`} style={{ background: "#F2F4F7", minHeight: 44 }}>
      <Search size={18} color={COLORS.muted} className="shrink-0" />
      <input autoFocus={autoFocus} value={value} onChange={onChange} placeholder={placeholder} className="flex-1 bg-transparent outline-none text-[13px]" style={{ color: COLORS.text }} />
    </div>
  );
}

function EmptyState({ icon: Icon, title, text, action }) {
  return (
    <div className="empty-state flex flex-col items-center text-center py-10 px-6">
      <div className="empty-state-icon w-16 h-16 rounded-[20px] flex items-center justify-center mb-4" style={{ background: COLORS.primarySoft }}>
        <Icon size={24} color={COLORS.primary} />
      </div>
      <p className="font-bold text-[14px] mb-1" style={{ color: COLORS.text }}>{title}</p>
      <p className="text-[13px] mb-4" style={{ color: COLORS.muted }}>{text}</p>
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
        <p className="font-bold text-[14px] mb-1" style={{ color: COLORS.text }}>{title}</p>
        <p className="text-[13px] mb-3" style={{ color: COLORS.muted }}>{text}</p>
        <p className="text-[12px] mb-1.5 font-semibold" style={{ color: COLORS.text }}>Tapez « {confirmWord} » pour confirmer :</p>
        <TextInput autoFocus value={value} onChange={(e) => setValue(e.target.value)} placeholder={confirmWord} style={{ marginBottom: 12 }} />
        <div className="flex gap-2">
          <Btn variant="ghost" full onClick={onCancel}>Annuler</Btn>
          <Btn variant="danger" full disabled={!matches} onClick={onConfirm}>{confirmLabel}</Btn>
        </div>
      </div>
    </div>
  );
}

/* Célébration — réservée aux vrais moments forts, d'où le bleu accent utilisé nulle part ailleurs pour un fond plein */
function CelebrationOverlay({ average, onClose }) {
  return (
    <div className="absolute inset-0 z-[80] flex items-center justify-center px-8" style={{ background: "rgba(15,23,33,0.55)" }}>
      <div className="w-full rounded-[20px] p-6 text-center" style={{ background: COLORS.surface }}>
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
        <div key={t.id} className="w-full max-w-[340px] flex items-center gap-2.5 px-4 py-3 rounded-[16px] pointer-events-auto" style={{ background: "#1F2933", boxShadow: "0 10px 28px rgba(15,23,33,0.3)" }}>
          {t.tone === "success" ? <CheckCircle2 size={18} color="#8FE3C7" className="shrink-0" /> : <Info size={18} color="#CFE0F5" className="shrink-0" />}
          <span className="flex-1 text-[13px] text-white">{t.message}</span>
          {t.actionLabel && (
            <button onClick={() => { t.onAction?.(); onDismiss(t.id); }} className="text-[12px] font-bold shrink-0" style={{ color: "#8FC5E0" }}>{t.actionLabel}</button>
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
        <p className="font-bold text-[14px] mb-1" style={{ color: COLORS.text }}>{title}</p>
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
      style={{ opacity: disabled ? 0.45 : 1, border: selected ? `2px solid ${COLORS.primary}` : `1px solid ${COLORS.border}`, background: selected ? COLORS.primarySoft : COLORS.surface }}>
      <div className="option-icon w-11 h-11 rounded-[16px] flex items-center justify-center shrink-0" style={{ background: selected ? COLORS.primary : COLORS.primarySoft }}>
        <Icon size={18} color={selected ? "#fff" : COLORS.primary} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-[14px] truncate" style={{ color: COLORS.text }}>{title}</p>
        {subtitle && <p className="text-[12px] truncate" style={{ color: COLORS.muted }}>{subtitle}</p>}
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
            <div><p className="text-[12px] font-extrabold" style={{ color: COLORS.text }}>{activeLabel}</p><p className="text-[10px] font-semibold mt-0.5" style={{ color: COLORS.muted }}>{helperText || "Quelques secondes suffisent"}</p></div>
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
  { key: "enseignants", label: "Enseignants", icon: Users, root: "teachersList" },
  { key: "classes", label: "Classes", icon: School, root: "years" },
  { key: "resultats", label: "Résultats", icon: BarChart3, root: "adminResults" },
  { key: "profil", label: "Profil", icon: User, root: "myProfile" },
];
const TEACHER_TABS = [
  { key: "accueil", label: "Accueil", icon: Home, root: "teacherDashboard" },
  { key: "programme", label: "Classes", icon: School, root: "teacherYears" },
  { key: "evaluations", label: "Évaluer", icon: ClipboardList, root: "evaluationsList" },
  { key: "profil", label: "Profil", icon: User, root: "myProfile" },
];
/* Compte indépendant : un seul enseignant qui gère aussi ses classes/matières — tabs fusionnés */
const INDEPENDENT_TABS = [
  { key: "accueil", label: "Accueil", icon: Home, root: "teacherDashboard" },
  { key: "classes", label: "Classes", icon: School, root: "years" },
  { key: "evaluations", label: "Évaluer", icon: ClipboardList, root: "evaluationsList" },
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
    <div className="app-bottom-nav flex items-stretch px-1 pt-2 pb-2 sticky bottom-0 z-20" style={{ background: "rgba(255,255,255,.96)" }}>
      {tabs.map((t) => {
        const active = ctx.nav.activeTab === t.key;
        return (
          <button key={t.key} onClick={() => ctx.nav.switchTab(t.key)} className="flex-1 min-w-0 flex flex-col items-center gap-1 py-1 px-0.5">
            {/* Indicateur Material NavigationBar : pilule derrière l'icône active — taille
               "dense" (icône 20px, pilule 56×28) plutôt que "standard" (24/64), pour rester
               lisible même sur la barre à 5 onglets côté gestionnaire, sur un écran de téléphone. */}
            <div className="nav-icon w-14 h-7 flex items-center justify-center rounded-full transition-all" style={{ background: active ? COLORS.primarySoft : "transparent", transform: active ? "translateY(-1px)" : "none" }}>
              <t.icon size={THEME.icon.dense} color={active ? COLORS.primary : COLORS.muted} />
            </div>
            <span className="text-[11px] font-semibold truncate max-w-full" style={{ color: active ? COLORS.primary : COLORS.muted }}>{t.label}</span>
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
      {ctx.isOnline ? <Wifi size={18} color={tone} /> : <WifiOff size={18} color={COLORS.warning} />}
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
      <button onClick={() => ctx.setOnboardingSeen(true)} className="shrink-0"><X size={18} color={COLORS.accent} /></button>
    </Card>
  );
}

/* Écran de lancement, pur branding — pas encore de choix à faire, juste "Démarrer".
   Pattern standard des apps mobiles : logo + tagline + un seul CTA, séparé de l'écran
   d'accueil qui, lui, propose déjà connexion/inscription. */
function SplashScreen({ ctx }) {
  return (
    <Screen>
      <div className="welcome-hero flex flex-col items-center px-6" style={{ justifyContent: "space-between", paddingTop: 72, paddingBottom: 40 }}>
        <span />
        <div className="flex flex-col items-center">
          <div className="brand-mark w-28 h-28 rounded-[34px] flex items-center justify-center mb-6" style={{ background: COLORS.primary, boxShadow: "0 18px 40px rgba(30,119,180,0.32)" }}>
            <ScanLine size={46} color="#fff" />
          </div>
          <h1 className="text-[34px] font-black mb-2 tracking-[-0.045em]" style={{ color: COLORS.text }}>KAGAT</h1>
          <p className="text-[14px] font-semibold text-center max-w-[260px] leading-5" style={{ color: COLORS.muted }}>
            Chaque réponse devient une opportunité d’apprendre.
          </p>
        </div>
        <div className="w-full flex flex-col items-center">
          <Badge tone="success" icon={Wifi}>Conçu pour fonctionner hors ligne</Badge>
          <div className="w-full mt-4"><Btn full icon={ArrowRight} onClick={() => ctx.nav.push("welcome")}>Démarrer</Btn></div>
        </div>
      </div>
    </Screen>
  );
}

function WelcomeScreen({ ctx }) {
  return (
    <Screen>
      <div className="welcome-hero flex flex-col items-center justify-center pt-14 px-6 pb-8">
        <Badge tone="success" icon={Wifi}>Conçu pour fonctionner hors ligne</Badge>
        <div className="brand-mark w-24 h-24 rounded-[30px] flex items-center justify-center mt-7 mb-5" style={{ background: COLORS.primary }}>
          <ScanLine size={40} color="#fff" />
        </div>
        <h1 className="text-[28px] font-black mb-9 tracking-[-0.04em]" style={{ color: COLORS.text }}>KAGAT</h1>
        {/* Groupe principal : "Se connecter" en tête, suivi du code d'invitation (2e parcours
            d'entrée), puis Google/Facebook en raccourcis rapides pour qui ne veut pas taper
            d'identifiants — un seul niveau d'accent (le bouton plein) pour éviter que Facebook
            ne rivalise visuellement avec l'action principale. */}
        <div className="w-full">
          <Btn full icon={LogIn} onClick={() => ctx.nav.push("login")}>Se connecter</Btn>
          <button onClick={() => ctx.nav.push("joinEstablishment")} className="w-full flex items-center justify-center gap-1.5 text-[12px] font-semibold mt-3.5" style={{ color: COLORS.accent }}>
            <KeyRound size={18} /> J’ai un code d’invitation
          </button>
          <OrDivider />
          <div className="flex flex-col gap-3">
            <SocialButton provider="google" onClick={() => quickSocialAuth(ctx, "google")} />
            <SocialButton provider="facebook" onClick={() => quickSocialAuth(ctx, "facebook")} />
          </div>
        </div>

        {/* Groupe secondaire, nettement séparé (bordure) : pour le petit nombre d'utilisateurs
            qui arrivent ici sans compte — visible, mais sans concurrencer l'action principale.
            Les comptes de démonstration (gestionnaire / enseignante / enseignant indépendant)
            vivent tous au même endroit, sur l'écran de connexion, pour un seul parcours cohérent. */}
        <div className="w-full mt-6 pt-5 flex flex-col items-center gap-3.5" style={{ borderTop: `1px solid ${COLORS.border}` }}>
          <button onClick={() => ctx.nav.push("register")} className="text-center">
            <span className="text-[13px]" style={{ color: COLORS.muted }}>Vous n’avez pas de compte ? </span>
            <span className="text-[13px] font-bold" style={{ color: COLORS.primary }}>Créer un compte</span>
          </button>
        </div>
      </div>
    </Screen>
  );
}

function RegisterWizardScreen({ ctx }) {
  const [step, setStep] = useState(0);
  const [accountType, setAccountType] = useState(""); // "institution" | "independent"
  const [institutionRole, setInstitutionRole] = useState(""); // "admin" | "teacher"
  const [channel, setChannel] = useState(""); // "email" | "phone" | "google" | "facebook"
  const [socialProvider, setSocialProvider] = useState(""); // "google" | "facebook" quand l'identité est déjà vérifiée par le fournisseur
  const [contact, setContact] = useState("");
  const [contactError, setContactError] = useState("");
  const [waitingForConnection, setWaitingForConnection] = useState(false);
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
  const [showMoreOptions, setShowMoreOptions] = useState(false); // Google mis en avant seul ; Facebook + email repliés pour ne pas surcharger le choix

  const chooseAccountType = (type) => { setAccountType(type); setStep(type === "institution" ? 0.5 : 1); };
  const chooseInstitutionRole = (role) => {
    setInstitutionRole(role);
    if (role === "teacher") { ctx.nav.push("joinEstablishment"); return; }
    setStep(1);
  };
  const chooseChannel = (ch) => { setChannel(ch); setSocialProvider(""); setContact(""); setContactError(""); setStep(2); };

  /* Google/Facebook authentifient déjà l'utilisateur : on saute directement les étapes
     "coordonnées" + "code de vérification" (étapes 2 et 3) puisqu'elles n'ont plus de raison d'être.
     On récupère le nom/email simulés du profil fourni par le provider, et on va droit aux
     informations complémentaires (étape 4). Le mot de passe local est lui aussi sauté :
     ces comptes se reconnectent avec le même bouton, pas avec un mot de passe KAGAT. */
  const chooseSocialChannel = (provider) => {
    const demoName = accountType === "institution" ? "Karim Haddad" : "Nadia Amari";
    const demoEmail = provider === "google" ? "karim.haddad@gmail.com" : "karim.haddad@facebook.com";
    const autoPwd = uid("pwd");
    setChannel(provider);
    setSocialProvider(provider);
    setContact(demoEmail);
    setContactError("");
    setName(demoName);
    setNationality("Algérienne"); setPersonCountry("Algérie"); setPersonCity("Alger");
    setBirthDate("1990-05-15"); setGender(accountType === "institution" ? "M" : "F");
    setPassword(autoPwd); setConfirm(autoPwd);
    ctx.showToast(`Identité vérifiée automatiquement via ${provider === "google" ? "Google" : "Facebook"}.`);
    setStep(4);
  };

  const startVerification = () => {
    setDemoCode(String(Math.floor(100000 + Math.random() * 900000)));
    setCodeInput(""); setVerifyError("");
    setWaitingForConnection(false);
    setStep(3);
  };
  const sendCode = () => {
    if (!contact.trim()) return;
    if (channel === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.trim())) {
      setContactError("Saisissez une adresse email valide.");
      return;
    }
    setContactError("");
    if (!ctx.isOnline) { setWaitingForConnection(true); return; }
    startVerification();
  };

  useEffect(() => {
    if (!waitingForConnection || !ctx.isOnline) return;
    startVerification();
    ctx.showToast("Connexion rétablie. Un code de vérification vient d’être envoyé.");
  }, [waitingForConnection, ctx.isOnline]);

  const verifyCode = () => {
    if (!ctx.isOnline) { setWaitingForConnection(true); return; }
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
    if (!ctx.isOnline) { setWaitingForConnection(true); return; }
    if (!school.name.trim() || !school.country.trim()) return;
    const adminId = uid("admin");
    const isIndependent = accountType === "independent";
    const selfTeacherId = isIndependent ? uid("t") : null;
    ctx.setData((d) => ({
      ...d,
      admin: {
        id: adminId, name: name.trim(), nationality: nationality.trim(), country: personCountry.trim(), city: personCity.trim(),
        birthDate, gender,
        email: channel === "phone" ? "" : contact.trim(),
        phone: channel === "phone" ? contact.trim() : "",
        username: contact.trim(), password,
        authProvider: socialProvider || "password",
        createdAt: Date.now(), lastLoginAt: Date.now(),
        selfTeacherId,
      },
      establishment: { id: uid("est"), name: school.name.trim(), country: school.country.trim(), region: school.region.trim(), city: school.city.trim(), type: school.type, level: school.level, accountType: isIndependent ? "independent" : "institution" },
      years: [], sessions: [], subjectCatalog: [...SUBJECT_CATALOG_SEED],
      teachers: isIndependent ? [{
        id: selfTeacherId, name: name.trim(), nationality: nationality.trim(), country: personCountry.trim(), city: personCity.trim(), birthDate, gender,
        email: channel === "phone" ? "" : contact.trim(), phone: channel === "phone" ? contact.trim() : "",
        username: contact.trim(), password, authProvider: socialProvider || "password", mustChangePassword: false, active: true,
        createdAt: Date.now(), lastLoginAt: Date.now(),
      }] : [],
    }));
    ctx.showToast(socialProvider ? `Compte créé avec ${socialProvider === "google" ? "Google" : "Facebook"}. Vous pouvez maintenant accéder à KAGAT.` : "Compte vérifié. Vous pouvez maintenant accéder à KAGAT.");
    if (isIndependent) { ctx.setCurrentUser({ type: "teacher", id: selfTeacherId }); ctx.enterApp("teacher", "independent"); }
    else { ctx.setCurrentUser({ type: "admin", id: adminId }); ctx.enterApp("admin", "institution"); }
  };

  const goBack = () => {
    if (step === 0) { ctx.nav.pop(); return; }
    if (step === 0.5) { setStep(0); return; }
    if (step === 1 && accountType === "institution") { setStep(0.5); return; }
    if (step === 4 && socialProvider) { setSocialProvider(""); setChannel(""); setContact(""); setStep(1); return; }
    if (step === 6 && socialProvider) { setStep(4); return; }
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
        <OptionCard icon={School} title="Je fais partie d’un établissement" subtitle="Accédez à votre école" selected={accountType === "institution"} onClick={() => chooseAccountType("institution")} />
        <OptionCard icon={User} title="Je suis enseignant(e) indépendant(e)" subtitle="Je crée mes classes et évaluations moi-même" selected={accountType === "independent"} onClick={() => chooseAccountType("independent")} />
      </div>
    );
  } else if (step === 0.5) {
    title = "Quel est votre rôle ?";
    body = (
      <div className="px-4">
        <OptionCard icon={Building2} title="Gestionnaire / administrateur" subtitle="Je configure et gère mon établissement" selected={institutionRole === "admin"} onClick={() => chooseInstitutionRole("admin")} />
        <OptionCard icon={GraduationCap} title="Enseignant(e)" subtitle="Je rejoins un établissement qui m’a invité(e)" selected={institutionRole === "teacher"} onClick={() => chooseInstitutionRole("teacher")} />
      </div>
    );
  } else if (step === 1) {
    title = "Comment voulez-vous vous inscrire ?";
    body = (
      <div className="px-4">
        <OptionCard icon={Send} title="S’inscrire avec un email" subtitle="Yahoo, Outlook, email pro… un code de vérification vous sera envoyé" onClick={() => chooseChannel("email")} />
        <OptionCard icon={Phone} title="S’inscrire par téléphone" subtitle="Recevoir un code par SMS ou WhatsApp" onClick={() => chooseChannel("phone")} />

        <button onClick={() => setShowMoreOptions((v) => !v)} className="w-full flex items-center justify-center gap-1.5 mt-5 mb-1 py-1">
          <span className="text-[12px] font-bold" style={{ color: COLORS.primary }}>{showMoreOptions ? "Masquer les autres options" : "S’inscrire d’une autre façon"}</span>
          <ChevronDown size={18} color={COLORS.primary} style={{ transform: showMoreOptions ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
        </button>

        {showMoreOptions && (
          <div className="mt-3 flex flex-col gap-3">
            <OrDivider />
            <SocialButton provider="google" onClick={() => chooseSocialChannel("google")} />
            <SocialButton provider="facebook" onClick={() => chooseSocialChannel("facebook")} />
          </div>
        )}
      </div>
    );
  } else if (step === 2) {
    title = channel === "email" ? "Votre email" : "Votre téléphone";
    body = (
      <div className="px-4">
        <DemoFillButton onClick={() => { setContact(channel === "email" ? "enseignant.demo@email.com" : "+213 555 123 456"); setContactError(""); }} />
        <Field label={channel === "email" ? "Adresse email" : "Numéro de téléphone"}>
          <TextInput autoFocus value={contact} onChange={(e) => { setContact(e.target.value); setContactError(""); }} placeholder={channel === "email" ? "Ex. karim.haddad@email.com" : "Ex. +213 555 000 000"} autoCapitalize="none" />
        </Field>
        {contactError && <p className="text-[12px] mb-3 font-semibold" style={{ color: COLORS.danger }}>{contactError}</p>}
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
        <p className="text-[13px] mb-4" style={{ color: COLORS.muted }}>Un code à 6 chiffres a été envoyé {channel === "email" ? "par email" : "par SMS ou WhatsApp"} à <b>{masked}</b>.</p>
        <DemoFillButton onClick={() => { setCodeInput(demoCode); setVerifyError(""); }} label="Saisir automatiquement le code de test" />
        <Field label="Code de vérification">
          <TextInput autoFocus value={codeInput} onChange={(e) => { setCodeInput(e.target.value); setVerifyError(""); }} placeholder="123456" maxLength={6} style={{ letterSpacing: "0.3em", fontSize: 18, textAlign: "center" }} />
        </Field>
        {verifyError && <p className="text-[12px] mb-3 font-semibold" style={{ color: COLORS.danger }}>{verifyError}</p>}
        <Btn full icon={ShieldCheck} disabled={codeInput.trim().length < 6} onClick={verifyCode}>Vérifier</Btn>
        <button onClick={resendCode} className="w-full text-center mt-4"><span className="text-[12px] font-semibold" style={{ color: COLORS.primary }}>Renvoyer le code</span></button>
        {resent && <p className="text-[11px] text-center mt-2 font-semibold" style={{ color: COLORS.success }}>Nouveau code envoyé.</p>}
      </div>
    );
  } else if (step === 4) {
    title = "Vos informations";
    body = (
      <div className="px-4">
        {socialProvider ? (
          <Card className="mb-4 flex items-start gap-3" style={{ background: COLORS.successSoft, border: "none" }}>
            {socialProvider === "google" ? <GoogleIcon size={20} /> : <FacebookIcon size={20} />}
            <div>
              <p className="text-[13px] font-bold" style={{ color: COLORS.success }}>Vérifié automatiquement via {socialProvider === "google" ? "Google" : "Facebook"}</p>
              <p className="text-[12px] mt-1 leading-5" style={{ color: COLORS.muted }}>Nous avons récupéré votre nom et votre email depuis votre profil. Vérifiez-les puis complétez le reste.</p>
            </div>
          </Card>
        ) : (
          <p className="text-[13px] mb-4" style={{ color: COLORS.muted }}>Compte vérifié. Parlez-nous un peu de vous.</p>
        )}
        <DemoFillButton onClick={() => { setName(accountType === "institution" ? "Karim Haddad" : "Nadia Amari"); setNationality("Algérienne"); setPersonCountry("Algérie"); setPersonCity("Alger"); setBirthDate("1990-05-15"); setGender(accountType === "institution" ? "M" : "F"); }} />
        <Field label="Nom complet"><TextInput autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex. Karim Haddad" /></Field>
        {socialProvider && <Field label={channel === "google" ? "Email Google" : "Email Facebook"}><TextInput value={contact} readOnly style={{ background: "#F2F4F7", color: COLORS.muted }} /></Field>}
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
        <Btn full icon={ArrowRight} disabled={!name.trim()} onClick={() => setStep(socialProvider ? 6 : 5)}>Continuer</Btn>
      </div>
    );
  } else if (step === 5) {
    title = "Créer un mot de passe";
    body = (
      <div className="px-4">
        <DemoFillButton onClick={() => { setPassword("Demo2026!"); setConfirm("Demo2026!"); setPwdError(""); }} />
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
        <p className="text-[13px] mb-4" style={{ color: COLORS.muted }}>Dernière étape avant d'entrer dans l'application.</p>
        <DemoFillButton onClick={() => setSchool({ name: accountType === "independent" ? "Mon espace pédagogique" : "École Démo KAGAT", country: "Algérie", region: "Alger", city: "Alger", type: "Public", level: "Primaire" })} />
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
      <TopBar title={waitingForConnection ? "Compte en attente" : title} onBack={waitingForConnection ? () => setWaitingForConnection(false) : goBack} />
      {waitingForConnection ? <OfflineVerificationState onRetry={() => ctx.isOnline ? startVerification() : ctx.showToast("Aucune connexion détectée", { tone: "warning" })} onEdit={() => setWaitingForConnection(false)} /> : <><WizardProgress step={registrationPhase} totalSteps={4} labels={registrationLabels} helperText="Votre progression est enregistrée sur cet écran" /><div className="pt-2">{body}</div></>}
    </Screen>
  );
}



function JoinEstablishmentScreen({ ctx }) {
  const linkedCode = ctx.nav.current.params?.inviteCode || (typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("invite") || "" : "");
  const [step, setStep] = useState(0);
  const [accessMethod, setAccessMethod] = useState(linkedCode ? "code" : ""); // "email" | "code"
  const [inviteCode, setInviteCode] = useState(linkedCode);
  const [institutionalEmail, setInstitutionalEmail] = useState("");
  const [invitation, setInvitation] = useState(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [demoCode, setDemoCode] = useState("");
  const [name, setName] = useState("");
  const [nationality, setNationality] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [waitingForConnection, setWaitingForConnection] = useState(false);

  const prepareDemoInvitation = () => {
    const existing = (ctx.data.invitations || []).find((i) => i.status === "pending");
    const demo = existing || { id: uid("inv"), code: "KAGAT-DEMO26", name: "Amina Enseignante", email: "amina@ecole-demo.dz", establishmentId: ctx.data.establishment.id, establishmentName: ctx.data.establishment.name, status: "pending", createdAt: Date.now() };
    if (!existing) ctx.setData((d) => ({ ...d, invitations: [...(d.invitations || []), demo] }));
    setAccessMethod("code"); setInviteCode(demo.code); setInstitutionalEmail(demo.email); setError("");
  };

  const findInvitation = () => {
    if (!ctx.isOnline) { setWaitingForConnection(true); setError(""); return; }
    const match = (ctx.data.invitations || []).find((i) => i.status === "pending" && (accessMethod === "email" ? i.email.toLowerCase() === institutionalEmail.trim().toLowerCase() : i.code.toUpperCase() === inviteCode.trim().toUpperCase()));
    if (!match) { setError(accessMethod === "email" ? "Aucune invitation active ne correspond à cet email." : "Code invalide ou déjà utilisé."); return; }
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setInvitation(match); setName(match.name); setDemoCode(code); setError(""); setStep(1);
  };
  useEffect(() => {
    if (!waitingForConnection || !ctx.isOnline) return;
    setWaitingForConnection(false);
    ctx.showToast("Connexion rétablie. Vérification de votre invitation en cours.");
    setTimeout(findInvitation, 0);
  }, [waitingForConnection, ctx.isOnline]);
  const verifyEmail = () => {
    if (!ctx.isOnline) { setWaitingForConnection(true); return; }
    if (verificationCode.trim() !== demoCode) { setError("Code de vérification incorrect."); return; }
    setError(""); setStep(2);
  };
  const continueToPassword = () => {
    if (name.trim().length < 2) { setError("Indiquez votre nom complet."); return; }
    setError(""); setStep(3);
  };
  const finish = () => {
    if (!ctx.isOnline) { setWaitingForConnection(true); return; }
    if (password.length < 6 || password !== confirm) { setError("Choisissez un mot de passe d’au moins 6 caractères et confirmez-le."); return; }
    const teacherId = uid("t");
    const teacher = { id: teacherId, name: name.trim(), nationality: nationality.trim(), country: country.trim(), city: city.trim(), birthDate, gender, email: invitation.email, phone: "", username: invitation.email, password, mustChangePassword: false, active: true, createdAt: Date.now(), lastLoginAt: Date.now() };
    ctx.setData((d) => {
      let next = { ...d, teachers: [...d.teachers, teacher], invitations: (d.invitations || []).map((i) => (i.id === invitation.id ? { ...i, status: "accepted", acceptedAt: Date.now(), teacherId } : i)) };
      // les matières/classes choisies par l'admin à l'invitation ne pouvaient pas encore
      // référencer ce compte (il n'existait pas) — on les applique maintenant qu'il existe.
      Object.entries(invitation.pendingAssignments || {}).forEach(([classId, subjectIds]) => {
        next = updateClass(next, classId, (c) => ({ ...c, teacherBySubject: { ...(c.teacherBySubject || {}), ...Object.fromEntries(subjectIds.map((sid) => [sid, teacherId])) } }));
      });
      return next;
    });
    ctx.setCurrentUser({ type: "teacher", id: teacherId });
    ctx.showToast(`Compte vérifié. Vous pouvez maintenant accéder à ${invitation.establishmentName}.`);
    ctx.enterApp("teacher");
  };

  return (
    <Screen>
      <TopBar title={waitingForConnection ? "Rattachement en attente" : "Rejoindre un établissement"} onBack={() => waitingForConnection ? setWaitingForConnection(false) : step === 0 ? ctx.nav.pop() : setStep((s) => s - 1)} />
      {waitingForConnection ? <OfflineVerificationState onRetry={() => ctx.isOnline ? findInvitation() : ctx.showToast("Aucune connexion détectée", { tone: "warning" })} onEdit={() => setWaitingForConnection(false)} /> : <div className="px-4 pt-5">
        <div className="flex items-center justify-center gap-2 mb-5">{[0, 1, 2, 3].map((n) => <div key={n} className="h-1.5 w-10 rounded-full" style={{ background: n <= step ? COLORS.primary : COLORS.border }} />)}</div>
        {step === 0 && <>
          <Card className="mb-4" style={{ background: COLORS.primarySoft, border: "none" }}><p className="text-[13px] font-bold" style={{ color: COLORS.primaryDark }}>Enseignant(e) : accédez à votre école</p><p className="text-[12px] mt-1 leading-5" style={{ color: COLORS.muted }}>Demandez un code à votre établissement ou utilisez votre email officiel.</p></Card>
          <DemoFillButton onClick={prepareDemoInvitation} label="Utiliser une invitation de démonstration" />
          <OptionCard icon={Send} title="Email institutionnel" subtitle="Retrouver l’invitation associée à mon email officiel" selected={accessMethod === "email"} onClick={() => { setAccessMethod("email"); setError(""); }} />
          <OptionCard icon={KeyRound} title="Code d’invitation" subtitle="Saisir le code transmis par mon établissement" selected={accessMethod === "code"} onClick={() => { setAccessMethod("code"); setError(""); }} />
          {accessMethod === "email" && <Field label="Email institutionnel"><TextInput autoFocus value={institutionalEmail} onChange={(e) => { setInstitutionalEmail(e.target.value); setError(""); }} placeholder="Ex. enseignant@ecole.dz" autoCapitalize="none" /></Field>}
          {accessMethod === "code" && <Field label="Code d’invitation"><TextInput autoFocus value={inviteCode} onChange={(e) => { setInviteCode(e.target.value.toUpperCase()); setError(""); }} placeholder="KAGAT-XXXXXX" style={{ textTransform: "uppercase", letterSpacing: "0.08em" }} /></Field>}
          {error && <p className="text-[12px] mb-3 font-semibold" style={{ color: COLORS.danger }}>{error}</p>}
          <Btn full icon={ArrowRight} disabled={!accessMethod || (accessMethod === "email" ? !institutionalEmail.trim() : !inviteCode.trim())} onClick={findInvitation}>Continuer</Btn>
        </>}
        {step === 1 && invitation && <>
          <Card className="mb-4" style={{ background: COLORS.successSoft, border: "none" }}><p className="text-[13px] font-bold" style={{ color: COLORS.success }}>{invitation.establishmentName}</p><p className="text-[12px] mt-1" style={{ color: COLORS.muted }}>Invitation destinée à {invitation.email}</p></Card>
          <p className="text-[13px] mb-3" style={{ color: COLORS.text }}>Un code de vérification a été envoyé à votre email.</p>
          <DemoFillButton onClick={() => { setVerificationCode(demoCode); setError(""); }} label="Utiliser le code de démonstration" />
          <Field label="Code de vérification"><TextInput autoFocus value={verificationCode} onChange={(e) => { setVerificationCode(e.target.value); setError(""); }} placeholder="123456" maxLength={6} style={{ textAlign: "center", letterSpacing: "0.2em" }} /></Field>
          {error && <p className="text-[12px] mb-3 font-semibold" style={{ color: COLORS.danger }}>{error}</p>}
          <Btn full icon={ShieldCheck} disabled={verificationCode.length < 6} onClick={verifyEmail}>Vérifier mon email</Btn>
        </>}
        {step === 2 && invitation && <>
          <p className="text-[14px] font-bold mb-1" style={{ color: COLORS.text }}>Vos informations</p><p className="text-[12px] mb-4" style={{ color: COLORS.muted }}>Complétez votre profil pour rejoindre {invitation.establishmentName}.</p>
          <DemoFillButton onClick={() => { setName(invitation.name || "Amina Enseignante"); setNationality("Algérienne"); setCountry("Algérie"); setCity("Alger"); setBirthDate("1992-04-18"); setGender("F"); }} />
          <Field label="Nom complet"><TextInput autoFocus value={name} onChange={(e) => setName(e.target.value)} /></Field>
          <Field label="Email vérifié"><TextInput value={invitation.email} readOnly style={{ background: "#F2F4F7", color: COLORS.muted }} /></Field>
          <Field label="Nationalité (facultatif)"><TextInput value={nationality} onChange={(e) => setNationality(e.target.value)} placeholder="Ex. Algérienne" /></Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Pays de résidence"><TextInput value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Ex. Algérie" /></Field>
            <Field label="Ville"><TextInput value={city} onChange={(e) => setCity(e.target.value)} placeholder="Ex. Alger" /></Field>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Date de naissance"><TextInput type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} /></Field>
            <Field label="Genre"><select style={inputStyle} value={gender} onChange={(e) => setGender(e.target.value)}><option value="">Non précisé</option><option value="F">Femme</option><option value="M">Homme</option></select></Field>
          </div>
          {error && <p className="text-[12px] mb-3 font-semibold" style={{ color: COLORS.danger }}>{error}</p>}
          <Btn full icon={ArrowRight} disabled={!name.trim()} onClick={continueToPassword}>Continuer</Btn>
        </>}
        {step === 3 && invitation && <>
          <Card className="mb-4 flex items-start gap-3" style={{ background: COLORS.successSoft, border: "none" }}><ShieldCheck size={20} color={COLORS.success} className="shrink-0 mt-0.5" /><div><p className="text-[13px] font-bold" style={{ color: COLORS.success }}>Profil vérifié</p><p className="text-[12px] mt-1" style={{ color: COLORS.muted }}>Choisissez maintenant un mot de passe personnel et sécurisé.</p></div></Card>
          <DemoFillButton onClick={() => { setPassword("Demo2026!"); setConfirm("Demo2026!"); setError(""); }} />
          <Field label="Créer un mot de passe"><TextInput type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} placeholder="Au moins 6 caractères" /></Field>
          <Field label="Confirmer le mot de passe"><TextInput type="password" value={confirm} onChange={(e) => { setConfirm(e.target.value); setError(""); }} placeholder="Répétez le mot de passe" /></Field>
          {error && <p className="text-[12px] mb-3 font-semibold" style={{ color: COLORS.danger }}>{error}</p>}
          <Btn full icon={UserCheck} disabled={password.length < 6 || !confirm} onClick={finish}>Créer mon compte et rejoindre</Btn>
          <p className="text-[11px] text-center mt-3" style={{ color: COLORS.muted }}>Votre mot de passe reste personnel et n’est jamais transmis à l’administrateur.</p>
        </>}
      </div>}
    </Screen>
  );
}

function LoginScreen({ ctx }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loadDemoAccount = (role) => {
    const demoData = role === "independent" ? makeIndependentDemoData() : makeInitialData();
    ctx.setData(demoData);
    if (role === "admin" || role === "independent") { setUsername(demoData.admin.username); setPassword(demoData.admin.password); }
    else {
      const demoTeacher = demoData.teachers.find((t) => t.id === "t1");
      setUsername(demoTeacher.username); setPassword(demoTeacher.password);
    }
    setError("");
    ctx.showToast(role === "admin" ? "Compte gestionnaire démo chargé" : role === "independent" ? "Compte enseignant indépendant démo chargé" : "Compte enseignant démo chargé");
  };

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
          {ctx.isOnline ? <Wifi size={18} color={COLORS.success} /> : <WifiOff size={18} color={COLORS.warning} />}
          <span className="text-[13px]" style={{ color: COLORS.muted }}>
            {ctx.isOnline ? "Connexion détectée — vos données se synchroniseront automatiquement." : "Aucune connexion détectée — vous pouvez vous connecter hors ligne, tout se synchronisera dès le retour du réseau."}
          </span>
        </Card>

        <Btn full icon={LogIn} onClick={submit}>Se connecter</Btn>
        <div className="grid grid-cols-2 gap-2 mt-3">
          <button onClick={() => loadDemoAccount("admin")} className="demo-account-button">Démo gestionnaire</button>
          <button onClick={() => loadDemoAccount("teacher")} className="demo-account-button">Démo enseignante</button>
          <button onClick={() => loadDemoAccount("independent")} className="demo-account-button col-span-2">Démo enseignant indépendant</button>
        </div>
        <button onClick={() => ctx.nav.push("forgotPassword")} className="w-full text-center mt-3">
          <span className="text-[12px] font-semibold" style={{ color: COLORS.primary }}>Mot de passe oublié ?</span>
        </button>
        <p className="text-[11px] mt-4 text-center" style={{ color: COLORS.muted }}>Touchez un profil pour charger ses données de démonstration, puis connectez-vous.</p>

        <div className="w-full mt-6 pt-5 text-center" style={{ borderTop: `1px solid ${COLORS.border}` }}>
          <button onClick={() => ctx.nav.push("register")}>
            <span className="text-[13px]" style={{ color: COLORS.muted }}>Pas encore de compte ? </span>
            <span className="text-[13px] font-bold" style={{ color: COLORS.primary }}>Créer un compte</span>
          </button>
        </div>
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
          <p className="text-[13px]" style={{ color: COLORS.primaryDark }}>
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
  const roleLabel = isAdmin ? "Gestionnaire / administrateur" : isSelfTeacher ? "Enseignant(e) indépendant(e)" : "Enseignant(e) de l’établissement";

  const submit = () => {
    setError("");
    if (oldPwd !== person.password) { setError("Ancien mot de passe incorrect."); return; }
    if (newPwd.length < 6 || newPwd !== confirm) { setError("Le nouveau mot de passe doit faire au moins 6 caractères et être confirmé."); return; }
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
            <p className="text-[12px]" style={{ color: COLORS.muted }}>{roleLabel}</p>
            {(person.city || person.country || person.nationality) && (
              <p className="text-[11px] mt-0.5" style={{ color: COLORS.muted }}>
                {[person.nationality, [person.city, person.country].filter(Boolean).join(", ")].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>
        </Card>

        <Card className="mb-4">
          <div className="flex items-center justify-between mb-3"><p className="text-[11px] font-bold uppercase" style={{ color: COLORS.muted, letterSpacing: "0.06em" }}>Informations du compte</p><Badge tone="success" icon={ShieldCheck}>Compte actif</Badge></div>
          <div className="space-y-2 text-[12px]" style={{ color: COLORS.text }}>
            <p className="flex items-center gap-2"><User size={18} color={COLORS.primary} className="shrink-0" /><span>{roleLabel}</span></p>
            {person.email && <p className="flex items-center gap-2"><Mail size={18} color={COLORS.primary} className="shrink-0" /><span>{person.email}</span></p>}
            {person.phone && <p className="flex items-center gap-2"><Phone size={18} color={COLORS.primary} className="shrink-0" /><span>{person.phone}</span></p>}
            <p className="flex items-center gap-2"><KeyRound size={18} color={COLORS.primary} className="shrink-0" /><span>Identifiant : {person.username}</span></p>
            {(person.city || person.country) && <p className="flex items-center gap-2"><MapPin size={18} color={COLORS.primary} className="shrink-0" /><span>{[person.city, person.country].filter(Boolean).join(", ")}</span></p>}
            {calcAge(person.birthDate) !== null && <p className="flex items-center gap-2"><Cake size={18} color={COLORS.primary} className="shrink-0" /><span>{calcAge(person.birthDate)} ans{genderLabel(person.gender) ? ` · ${genderLabel(person.gender)}` : ""}</span></p>}
            {formatDateFr(person.createdAt) && <p className="flex items-center gap-2"><Calendar size={18} color={COLORS.primary} className="shrink-0" /><span>Membre depuis le {formatDateFr(person.createdAt)}</span></p>}
            {formatDateFr(person.lastLoginAt) && <p className="flex items-center gap-2"><KeyRound size={18} color={COLORS.primary} className="shrink-0" /><span>Dernière connexion : {formatDateFr(person.lastLoginAt)}</span></p>}
          </div>
        </Card>

        <Card onClick={(isAdmin || isSelfTeacher) ? () => ctx.nav.push("myEstablishment") : undefined} className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-[16px] flex items-center justify-center" style={{ background: COLORS.primarySoft }}><School size={18} color={COLORS.primary} /></div>
            <div className="flex-1"><p className="font-bold text-[13px]" style={{ color: COLORS.text }}>{ctx.data.establishment.name}</p><p className="text-[11px]" style={{ color: COLORS.muted }}>{[ctx.data.establishment.city, ctx.data.establishment.country].filter(Boolean).join(", ") || "Établissement rattaché"}</p></div>
            {(isAdmin || isSelfTeacher) && <ChevronRight size={18} color={COLORS.muted} />}
        </Card>

        {done && <Card className="mb-4" style={{ background: COLORS.successSoft, border: "none" }}><p className="text-[13px] font-semibold" style={{ color: COLORS.success }}>Mot de passe modifié.</p></Card>}

        {editing ? (
          <Card className="important-form-modal mb-4">
            <div className="flex items-start gap-3 mb-4"><div className="w-10 h-10 rounded-[16px] flex items-center justify-center shrink-0" style={{ background: COLORS.primarySoft }}><Lock size={18} color={COLORS.primary} /></div><div><p className="font-bold text-[14px]" style={{ color: COLORS.text }}>Modifier le mot de passe</p><p className="text-[11px] mt-1" style={{ color: COLORS.muted }}>Utilisez au moins 6 caractères et ne partagez jamais votre mot de passe.</p></div></div>
            <Field label="Ancien mot de passe"><TextInput type="password" value={oldPwd} onChange={(e) => setOldPwd(e.target.value)} /></Field>
            <Field label="Nouveau mot de passe"><TextInput type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} placeholder="Au moins 6 caractères" /></Field>
            <Field label="Confirmer le nouveau mot de passe"><TextInput type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Répétez le mot de passe" /></Field>
            {error && <p className="text-[12px] mb-3 font-semibold" style={{ color: COLORS.danger }}>{error}</p>}
            <div className="flex gap-2">
              <Btn variant="ghost" full onClick={() => { setEditing(false); setError(""); }}>Annuler</Btn>
              <Btn full icon={Save} disabled={!oldPwd || newPwd.length < 6 || !confirm} onClick={submit}>Enregistrer</Btn>
            </div>
          </Card>
        ) : (
          <Btn variant="secondary" full icon={KeyRound} onClick={() => { setEditing(true); setDone(false); }}>Modifier mon mot de passe</Btn>
        )}

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
  // Années archivées exclues : sinon une classe close continuerait à gonfler ces totaux pour toujours.
  const totalClasses = data.years.filter((y) => !y.archived).flatMap((y) => y.classes).filter((c) => !c.archived).length;
  const totalStudents = data.years.filter((y) => !y.archived).flatMap((y) => y.classes).filter((c) => !c.archived).reduce((sum, c) => sum + c.students.filter((s) => !s.archived).length, 0);
  const totalTeachers = data.teachers.filter((t) => t.active).length;
  const pendingInvitations = (data.invitations || []).filter((i) => i.status === "pending").length;
  const activeYear = data.years.find((y) => !y.archived) || null;
  const canCloseYear = activeYear && getPromotionLevels(data, activeYear.id).length > 0;

  /* Contrairement à "Accès rapide" (deux raccourcis vers des onglets déjà dans la barre du
     bas, sans information propre), cette section ne montre que ce qui attend une action —
     elle renvoie vers l'onglet où l'action existe déjà, sans dupliquer un bouton "Clôturer"
     ou "Inviter" ici en plus. */
  const attention = [];
  if (pendingInvitations > 0) attention.push({ key: "invites", icon: Send, label: `${pendingInvitations} invitation${pendingInvitations > 1 ? "s" : ""} en attente`, sub: "Enseignant(s) pas encore connecté(s)", go: () => ctx.nav.switchTab("enseignants") });
  if (canCloseYear) attention.push({ key: "close", icon: Calendar, label: `Clôturer ${activeYear.label}`, sub: "Faire passer les élèves à l'année supérieure", go: () => ctx.nav.switchTab("classes") });

  return (
    <Screen>
      <TopBar title={`Bienvenue, ${firstName}`} subtitle={`${data.establishment.name} · KAGAT`} right={<SyncIndicator ctx={ctx} />} />
      <div className="px-4 pt-3 space-y-4">
        <div className="dashboard-hero">
          <div className="dashboard-hero-icon"><School size={24} /></div>
          <div><Badge tone="accent">Espace gestionnaire</Badge><p>Votre établissement, organisé en un coup d'œil.</p></div>
        </div>
        <OnboardingTip ctx={ctx} text="Pour commencer : créez une classe, importez vos élèves (cartes attribuées automatiquement), puis invitez un enseignant — vous lui assignerez ses classes et matières dans la foulée." />
        <SectionLabel>Vue d'ensemble</SectionLabel>
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={School} value={totalClasses} label="Classes actives" />
          <StatCard icon={GraduationCap} value={totalStudents} label="Élèves inscrits" tone="success" />
          <StatCard icon={Users} value={totalTeachers} label="Enseignants" tone="accent" />
          <StatCard icon={Mail} value={pendingInvitations} label="Invitations en attente" tone="warning" />
        </div>

        {attention.length > 0 && (
          <>
            <SectionLabel>À faire</SectionLabel>
            <div className="space-y-2">
              {attention.map((it) => (
                <Card key={it.key} onClick={it.go} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[16px] flex items-center justify-center shrink-0" style={{ background: COLORS.warningSoft }}><it.icon size={18} color={COLORS.warning} /></div>
                  <div className="flex-1 min-w-0"><p className="font-bold text-[13px]" style={{ color: COLORS.text }}>{it.label}</p><p className="text-[11px]" style={{ color: COLORS.muted }}>{it.sub}</p></div>
                  <ChevronRight size={18} color={COLORS.muted} className="shrink-0" />
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </Screen>
  );
}

/* Vue synthétique pour le gestionnaire : 3 indicateurs qui répondent chacun à une question
   différente qu'un gestionnaire se pose — "comment va l'établissement dans l'ensemble ?"
   (moyenne + répartition), "est-ce que tout le monde utilise vraiment KAGAT ?" (couverture),
   et "quel niveau a besoin d'attention ?" (moyenne par niveau). Basé sur l'année active
   uniquement — une année archivée est déjà consultable en détail via Classes. */
function AdminResultsScreen({ ctx }) {
  const activeYear = ctx.data.years.find((y) => !y.archived);
  const allClasses = activeYear ? activeYear.classes.filter((c) => !c.archived) : [];
  const completedSessions = ctx.data.sessions.filter((s) => s.status === "completed" && allClasses.some((c) => c.id === s.classId));

  const sessionAverages = completedSessions.map((s) => computeResults(ctx, s.id).classAverage);
  const overallAvg = sessionAverages.length ? Math.round(sessionAverages.reduce((a, b) => a + b, 0) / sessionAverages.length) : null;
  const bandCounts = RESULT_BANDS.map((b) => ({ ...b, value: 0 }));
  sessionAverages.forEach((avg) => { const idx = RESULT_BANDS.findIndex((b) => avg >= b.min); bandCounts[idx].value++; });

  const classesWithEval = new Set(completedSessions.map((s) => s.classId));
  const coverage = allClasses.length ? Math.round((classesWithEval.size / allClasses.length) * 100) : 0;

  const levelNames = activeYear ? getYearLevelNames(activeYear) : [];
  const perLevel = levelNames.map((level) => {
    const classesOfLevel = allClasses.filter((c) => c.level === level);
    const sessionsOfLevel = completedSessions.filter((s) => classesOfLevel.some((c) => c.id === s.classId));
    const avgs = sessionsOfLevel.map((s) => computeResults(ctx, s.id).classAverage);
    const avg = avgs.length ? Math.round(avgs.reduce((a, b) => a + b, 0) / avgs.length) : null;
    return { level, classCount: classesOfLevel.length, sessionCount: sessionsOfLevel.length, avg };
  });

  return (
    <Screen>
      <TopBar title="Résultats" subtitle={activeYear ? activeYear.label : ctx.data.establishment.name} right={<SyncIndicator ctx={ctx} />} />
      <div className="px-4 pt-4 space-y-2">
        {!activeYear || completedSessions.length === 0 ? (
          <EmptyState icon={BarChart3} title="Aucun résultat pour l'instant" text="Les résultats apparaîtront ici dès qu'une évaluation aura été terminée dans une classe." />
        ) : (
          <>
            <Card className="flex items-center gap-4">
              <DonutChart segments={bandCounts.map((b) => ({ value: b.value, color: b.color }))} />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold" style={{ color: COLORS.muted }}>Moyenne de l'établissement</p>
                <p className="text-[28px] font-extrabold mb-2" style={{ color: overallAvg >= WEAK_RESULT_THRESHOLD ? COLORS.success : COLORS.danger }}>{overallAvg}%</p>
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

            <Card style={{ background: coverage < 50 ? COLORS.warningSoft : COLORS.successSoft, border: "none" }}>
              <p className="text-[12px] font-semibold" style={{ color: coverage < 50 ? COLORS.warning : COLORS.success }}>Couverture des évaluations</p>
              <p className="text-[28px] font-extrabold" style={{ color: coverage < 50 ? COLORS.warning : COLORS.success }}>{classesWithEval.size} / {allClasses.length} classe{allClasses.length > 1 ? "s" : ""} <span className="text-[13px] font-semibold">({coverage}%)</span></p>
              <p className="text-[11px] mt-1" style={{ color: coverage < 50 ? COLORS.warning : COLORS.success }}>ont déjà lancé au moins une évaluation cette année.</p>
            </Card>

            <SectionLabel>Par niveau</SectionLabel>
            {perLevel.map((l) => (
              <Card key={l.level} className="flex items-center justify-between">
                <div className="flex-1 min-w-0"><p className="font-bold text-[14px]" style={{ color: COLORS.text }}>{l.level}</p><p className="text-[11px]" style={{ color: COLORS.muted }}>{l.classCount} classe(s) · {l.sessionCount} évaluation(s) terminée(s)</p></div>
                {l.avg === null ? <Badge tone="neutral">Aucun résultat</Badge> : <Badge tone={l.avg >= WEAK_RESULT_THRESHOLD ? "success" : "warning"}>{l.avg}%</Badge>}
              </Card>
            ))}
          </>
        )}
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
      <div className="important-form-modal px-4 pt-4">
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

/* Années scolaires — racine de l'onglet "Classes".
   Une seule voie pour construire l'arborescence : année → niveaux → classes,
   chaque étape se fait "à l'intérieur" de la précédente (pas de raccourci qui
   duplique la même action ailleurs). Clôturer est une action de l'année elle-même,
   donc elle vit directement sur sa carte plutôt que séparée en haut de l'écran. */
function YearsScreen({ ctx }) {
  const [adding, setAdding] = useState(false);
  const [label, setLabel] = useState("");
  const addYear = () => {
    if (!label.trim()) return;
    ctx.setData((d) => ({ ...d, years: [...d.years, { id: uid("y"), label: label.trim(), classes: [], levels: {}, archived: false }] }));
    setLabel(""); setAdding(false);
  };

  return (
    <Screen>
      <TopBar title="Années scolaires" subtitle={ctx.data.establishment.name} />
      <div className="px-4 pt-4 space-y-2">
        {adding ? (
          <Card className="important-form-modal mb-3">
            <Field label="Année scolaire"><TextInput autoFocus value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Ex. 2026–2027" /></Field>
            <div className="flex gap-2"><Btn variant="ghost" full onClick={() => setAdding(false)}>Annuler</Btn><Btn full onClick={addYear}>Créer</Btn></div>
          </Card>
        ) : <Btn full icon={Plus} onClick={() => setAdding(true)}>Ajouter une année</Btn>}
        <SectionLabel>Années disponibles</SectionLabel>
        {ctx.data.years.map((y) => {
          const classCount = y.classes.filter((c) => !c.archived).length;
          const closable = !y.archived && getPromotionLevels(ctx.data, y.id).length > 0;
          return (
            <Card key={y.id} onClick={() => ctx.nav.push("levels", { yearId: y.id })} className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[16px] flex items-center justify-center shrink-0" style={{ background: y.archived ? "#EEF1F4" : COLORS.primarySoft }}><Calendar size={18} color={y.archived ? COLORS.muted : COLORS.primary} /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap"><p className="font-bold text-[14px]" style={{ color: COLORS.text }}>{y.label}</p>{y.archived && <Badge tone="neutral">Archivée</Badge>}</div>
                  <p className="text-[12px]" style={{ color: COLORS.muted }}>{classCount} classe(s){y.archived ? " · lecture seule" : ""}</p>
                </div>
                <ChevronRight size={18} color={COLORS.muted} className="shrink-0" />
              </div>
              {closable && (
                <Btn full size="sm" variant="secondary" icon={Calendar} onClick={(e) => { e.stopPropagation(); ctx.nav.push("closeYear", { yearId: y.id }); }}>
                  Clôturer l'année
                </Btn>
              )}
            </Card>
          );
        })}
        {ctx.data.years.length === 0 && <EmptyState icon={Calendar} title="Aucune année scolaire" text="Créez votre première année scolaire pour commencer à ajouter des classes." />}
      </div>
    </Screen>
  );
}

/* Fin d'année : par défaut tout le monde passe au niveau supérieur, l'admin ne touche
   qu'aux exceptions (redoublement, départ) — jamais un choix élève par élève sur la masse.
   La classe d'origine (A, B, ...) n'intervient pas ici : on raisonne par niveau, la
   répartition dans les classes de la nouvelle année se fait ensuite, séparément. */
function CloseYearScreen({ ctx }) {
  const { yearId } = ctx.nav.current.params;
  const year = ctx.data.years.find((y) => y.id === yearId);
  const levels = useMemo(() => getPromotionLevels(ctx.data, yearId), [ctx.data, yearId]);
  const [newYearLabel, setNewYearLabel] = useState(() => nextYearLabelGuess(year?.label));
  const [targets, setTargets] = useState(() => Object.fromEntries(levels.map((l) => [l.level, nextLevelGuess(l.level)])));
  const [decisions, setDecisions] = useState({}); // studentId -> "repeat" | "leave" (absent = passe)
  const [expanded, setExpanded] = useState("");
  const [search, setSearch] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [classNameOverrides, setClassNameOverrides] = useState({}); // classId -> nom édité manuellement

  if (!year) return null;

  /* Nom par défaut de la classe d'arrivée : on garde la même section (A, B…) qu'avant
     clôture, juste accolée au nouveau niveau — "5e année A" + niveau cible "6e année"
     → "6e année A". Modifiable au cas par cas juste en dessous. */
  const defaultClassName = (level, targetLevel, className) => {
    const suffix = className.startsWith(level) ? className.slice(level.length).trim() : className;
    return suffix ? `${targetLevel} ${suffix}` : targetLevel;
  };
  const classesOf = (l) => {
    const out = [];
    l.students.forEach((s) => {
      let entry = out.find((c) => c.classId === s.classId);
      if (!entry) { entry = { classId: s.classId, className: s.className, count: 0 }; out.push(entry); }
      entry.count++;
    });
    return out;
  };

  const setDecision = (studentId, value) => {
    setDecisions((d) => {
      const next = { ...d };
      if (!value || next[studentId] === value) delete next[studentId]; else next[studentId] = value;
      return next;
    });
  };

  const totals = levels.reduce((acc, l) => {
    l.students.forEach((s) => {
      const dec = decisions[s.id];
      if (dec === "leave") acc.leave++; else if (dec === "repeat") acc.repeat++; else acc.promote++;
    });
    return acc;
  }, { promote: 0, repeat: 0, leave: 0 });

  const loadDemoExceptions = () => {
    const next = {};
    levels.forEach((l) => {
      if (l.students[0]) next[l.students[0].id] = "leave";
      if (l.students[1]) next[l.students[1].id] = "repeat";
    });
    setDecisions(next);
    ctx.showToast("Exceptions de démonstration appliquées");
  };

  const commit = () => {
    /* Pour l'instant, chaque élève reste dans sa section d'origine (A, B…) plutôt que de
       mélanger tout le niveau puis demander une répartition manuelle après coup — "5e année A"
       devient directement "6e année A". Le vrai problème de répartition (rééquilibrer les
       sections, fusionner des petits effectifs...) est volontairement laissé de côté pour
       l'instant ; DistributeStudentsScreen reste disponible pour plus tard si besoin. */
    const pools = new Map(); // clé "niveau cible||nom de classe" -> élèves
    levels.forEach((l) => {
      l.students.forEach((s) => {
        const dec = decisions[s.id];
        if (dec === "leave") return;
        let targetLevel, newClassName;
        if (dec === "repeat") {
          // Un redoublant reste dans une classe à son niveau actuel, même section.
          targetLevel = l.level;
          newClassName = defaultClassName(l.level, l.level, s.className);
        } else {
          targetLevel = (targets[l.level] || l.level).trim() || l.level;
          const suggestion = defaultClassName(l.level, targetLevel, s.className);
          newClassName = (classNameOverrides[s.classId] ?? suggestion).trim() || suggestion;
        }
        const key = `${targetLevel}||${newClassName}`;
        const pool = pools.get(key) || { level: targetLevel, name: newClassName, students: [] };
        pool.students.push({ id: s.id, name: s.name, studentCode: s.studentCode, cardNumber: s.cardNumber, cardAssigned: s.cardAssigned, archived: false });
        pools.set(key, pool);
      });
    });
    const newClasses = [...pools.values()].map((p) => ({
      id: uid("c"), name: p.name, level: p.level, cardCount: p.students.length,
      students: p.students, teacherBySubject: {}, questionnaireOverrides: [], archived: false,
    }));
    const newYearId = uid("y");
    const finalLabel = newYearLabel.trim() || "Nouvelle année";
    ctx.setData((d) => ({
      ...d,
      years: [
        ...d.years.map((y) => (y.id === yearId ? { ...y, archived: true } : y)),
        { id: newYearId, label: finalLabel, classes: newClasses, levels: {}, archived: false },
      ],
    }));
    ctx.showToast(`${year.label} archivée. « ${finalLabel} » créée avec ${newClasses.length} classe(s).`);
    ctx.nav.resetTo("years");
  };

  return (
    <Screen>
      <TopBar title="Clôturer l'année" subtitle={year.label} onBack={() => ctx.nav.pop()} />
      <div className="px-4 pt-4">
        <Card className="mb-4 flex items-start gap-3" style={{ background: COLORS.primarySoft, border: "none" }}>
          <Info size={18} color={COLORS.primary} className="shrink-0 mt-0.5" />
          <p className="text-[12px] leading-5" style={{ color: COLORS.primaryDark }}>Par défaut, tous les élèves passent à l'année supérieure, dans la même section qu'aujourd'hui (« 5e année A » devient « 6e année A »). Marquez uniquement les exceptions (redoublement, départ) — inutile de traiter chaque élève un par un.</p>
        </Card>

        <Field label="Nouvelle année scolaire"><TextInput value={newYearLabel} onChange={(e) => setNewYearLabel(e.target.value)} placeholder="Ex. 2027–2028" /></Field>

        {levels.length > 0 && <DemoFillButton onClick={loadDemoExceptions} label="Simuler quelques exceptions (démo)" />}

        <SectionLabel>Niveaux concernés</SectionLabel>
        {levels.map((l) => {
          const repeatCount = l.students.filter((s) => decisions[s.id] === "repeat").length;
          const leaveCount = l.students.filter((s) => decisions[s.id] === "leave").length;
          const promoteCount = l.students.length - repeatCount - leaveCount;
          const isOpen = expanded === l.level;
          const filtered = l.students.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));
          return (
            <Card key={l.level} className="mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[16px] flex items-center justify-center shrink-0" style={{ background: COLORS.primarySoft }}><Users size={18} color={COLORS.primary} /></div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[13px]" style={{ color: COLORS.text }}>{l.level}</p>
                  <p className="text-[11px]" style={{ color: COLORS.muted }}>{l.students.length} élève(s)</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <ArrowRight size={18} color={COLORS.muted} className="shrink-0" />
                <TextInput value={targets[l.level] ?? ""} onChange={(e) => setTargets((t) => ({ ...t, [l.level]: e.target.value }))} placeholder="Niveau suivant" style={{ minHeight: 38, padding: "8px 11px", fontSize: 12.5 }} />
              </div>
              {/* Chaque section garde son propre nom de classe d'arrivée — modifiable ici si
                  la suggestion (niveau + section) ne convient pas pour un cas précis. */}
              <div className="mt-2.5 space-y-1.5">
                {classesOf(l).map((c) => {
                  const targetLevel = (targets[l.level] || l.level).trim() || l.level;
                  const suggestion = defaultClassName(l.level, targetLevel, c.className);
                  const value = classNameOverrides[c.classId] ?? suggestion;
                  return (
                    <div key={c.classId} className="flex items-center gap-2">
                      <span className="text-[11px] shrink-0 truncate" style={{ color: COLORS.muted, maxWidth: 84 }}>{c.className} →</span>
                      <TextInput value={value} onChange={(e) => setClassNameOverrides((o) => ({ ...o, [c.classId]: e.target.value }))} placeholder={suggestion} style={{ minHeight: 34, padding: "6px 10px", fontSize: 11.5 }} />
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-2 mt-2.5 flex-wrap">
                <Badge tone="success" icon={CheckCircle2}>{promoteCount} passent</Badge>
                {repeatCount > 0 && <Badge tone="warning" icon={RefreshCw}>{repeatCount} redoublent</Badge>}
                {leaveCount > 0 && <Badge tone="danger" icon={UserX}>{leaveCount} quittent</Badge>}
              </div>
              <button onClick={() => { setExpanded(isOpen ? "" : l.level); setSearch(""); }} className="w-full flex items-center justify-center gap-1.5 mt-3 py-1">
                <span className="text-[12px] font-bold" style={{ color: COLORS.primary }}>{isOpen ? "Fermer" : "Gérer les exceptions"}</span>
                <ChevronDown size={13} color={COLORS.primary} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
              </button>
              {isOpen && (
                <div className="mt-2 pt-3" style={{ borderTop: `1px solid ${COLORS.border}` }}>
                  <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un élève…" className="mb-2.5" />
                  <div className="max-h-[260px] overflow-y-auto -mx-1 px-1">
                    {filtered.map((s) => {
                      const dec = decisions[s.id];
                      return (
                        <div key={s.id} className="flex items-center justify-between gap-2 py-1.5">
                          <span className="text-[12px] flex-1 truncate" style={{ color: COLORS.text }}>{s.name}</span>
                          <button onClick={() => setDecision(s.id, dec === "repeat" ? "" : "repeat")} className="px-2 py-1 rounded-full text-[10px] font-bold shrink-0" style={{ background: dec === "repeat" ? COLORS.warning : COLORS.warningSoft, color: dec === "repeat" ? "#fff" : COLORS.warning }}>Redouble</button>
                          <button onClick={() => setDecision(s.id, dec === "leave" ? "" : "leave")} className="px-2 py-1 rounded-full text-[10px] font-bold shrink-0" style={{ background: dec === "leave" ? COLORS.danger : COLORS.dangerSoft, color: dec === "leave" ? "#fff" : COLORS.danger }}>Quitte</button>
                        </div>
                      );
                    })}
                    {filtered.length === 0 && <p className="text-[12px] text-center py-3" style={{ color: COLORS.muted }}>Aucun élève trouvé.</p>}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
        {levels.length === 0 && <EmptyState icon={Users} title="Aucun élève à faire passer" text="Ajoutez des classes et des élèves avant de clôturer l'année." />}
      </div>

      {levels.length > 0 && (
        <div className="px-4 pt-2 pb-1">
          <Card className="mb-3" style={{ background: COLORS.successSoft, border: "none" }}>
            <p className="text-[12px] font-bold" style={{ color: COLORS.success }}>{totals.promote} passent · {totals.repeat} redoublent · {totals.leave} quittent</p>
          </Card>
          <Btn full icon={ArrowRight} disabled={!newYearLabel.trim()} onClick={() => setConfirmOpen(true)}>Clôturer et créer la nouvelle année</Btn>
        </div>
      )}

      <TypedConfirmModal open={confirmOpen} title="Clôturer l'année ?" text={`${year.label} passera en lecture seule. ${totals.promote} élève(s) passeront en année supérieure, ${totals.repeat} redoubleront, ${totals.leave} quitteront l'établissement.`} confirmWord="CLOTURER" confirmLabel="Clôturer" onCancel={() => setConfirmOpen(false)} onConfirm={commit} />
    </Screen>
  );
}

/* Répartition des élèves promus dans les classes réelles de la nouvelle année — sélection
   multiple + assignation en masse. Le critère de tri reste entièrement à l'admin (proximité,
   niveau, mixité...) : l'app ne devine jamais qui va où, elle rend juste le geste rapide. */
function DistributeStudentsScreen({ ctx }) {
  const { classId } = ctx.nav.current.params;
  const loc = locateClass(ctx.data, classId);
  const [selected, setSelected] = useState(new Set());
  const [search, setSearch] = useState("");
  const [targetClassId, setTargetClassId] = useState("");

  if (!loc) return null;
  const { yr, cls } = loc;
  const targetClasses = yr.classes.filter((c) => !c.archived && !c.pendingDistribution && c.id !== classId && c.level === cls.level);
  const otherPending = yr.classes.filter((c) => !c.archived && c.pendingDistribution && c.id !== classId);
  const filtered = cls.students.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

  const toggle = (id) => setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const selectAllFiltered = () => setSelected(new Set(filtered.map((s) => s.id)));
  const clearSelection = () => setSelected(new Set());

  const assign = (studentIds) => {
    if (!targetClassId || studentIds.length === 0) return;
    const targetName = targetClasses.find((c) => c.id === targetClassId)?.name;
    ctx.setData((d) => moveStudents(d, yr.id, classId, targetClassId, studentIds));
    clearSelection();
    const remaining = cls.students.length - studentIds.length;
    if (remaining <= 0) {
      ctx.setData((d) => updateClass(d, classId, (c) => ({ ...c, archived: true })));
      ctx.showToast(`« ${cls.level} » entièrement réparti(e).`);
      /* On enchaîne automatiquement sur le prochain niveau à répartir — au lieu de
         renvoyer l'admin vers l'écran Classes et compter sur lui pour y repenser. */
      if (otherPending.length > 0) ctx.nav.push("distributeStudents", { classId: otherPending[0].id });
      else ctx.nav.resetTo("levels", { yearId: yr.id });
    } else {
      ctx.showToast(`${studentIds.length} élève(s) assigné(s) à « ${targetName} » · ${remaining} restant(s)`);
    }
  };
  const assignSelection = () => assign([...selected]);
  const assignRest = () => assign(cls.students.map((s) => s.id));
  const loadDemoSelection = () => setSelected(new Set(cls.students.slice(0, Math.ceil(cls.students.length / 2)).map((s) => s.id)));
  const finishLater = () => { ctx.showToast(`« ${cls.level} » laissé(e) à répartir — reprenez depuis les niveaux.`); ctx.nav.resetTo("levels", { yearId: yr.id }); };

  return (
    <Screen>
      <TopBar title="Répartir les élèves" subtitle={`${cls.level} · ${cls.students.length} à placer`} onBack={finishLater} />
      <div className="px-4 pt-4">
        {otherPending.length > 0 && (
          <div className="mb-3"><Badge tone="accent" icon={Layers}>{otherPending.length} niveau(x) suivront après celui-ci</Badge></div>
        )}
        {targetClasses.length === 0 ? (
          <>
            <Card className="mb-4 flex items-start gap-3" style={{ background: COLORS.warningSoft, border: "none" }}>
              <AlertTriangle size={18} color={COLORS.warning} className="shrink-0 mt-0.5" />
              <p className="text-[12px] leading-5" style={{ color: COLORS.warning }}>Aucune classe de « {cls.level} » n'existe encore cette année. Créez-en au moins une pour pouvoir y répartir ces élèves.</p>
            </Card>
            <Btn full icon={Plus} onClick={() => ctx.nav.push("classes", { yearId: yr.id, level: cls.level, fromDistribute: true })}>Créer une classe</Btn>
          </>
        ) : (
          <>
            <Field label="Classe de destination">
              <select style={inputStyle} value={targetClassId} onChange={(e) => setTargetClassId(e.target.value)}>
                <option value="">Choisir une classe…</option>
                {targetClasses.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.students.filter((s) => !s.archived).length} élèves)</option>)}
              </select>
            </Field>

            {cls.students.length > 3 && <DemoFillButton onClick={loadDemoSelection} label="Sélectionner la moitié (démo)" />}

            <div className="flex items-center justify-between mb-2">
              <button onClick={selectAllFiltered} className="text-[12px] font-bold" style={{ color: COLORS.primary }}>Tout sélectionner</button>
              {selected.size > 0 && <button onClick={clearSelection} className="text-[12px] font-bold" style={{ color: COLORS.muted }}>Effacer ({selected.size})</button>}
            </div>
            <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un élève…" className="mb-2.5" />
            <div className="rounded-[16px] overflow-hidden mb-4" style={{ border: `1px solid ${COLORS.border}` }}>
              {filtered.map((s, i) => {
                const isSelected = selected.has(s.id);
                return (
                  <button key={s.id} onClick={() => toggle(s.id)} className="w-full flex items-center justify-between px-3.5 py-3"
                    style={{ borderTop: i ? `1px solid ${COLORS.border}` : "none", background: isSelected ? COLORS.accentSoft : "#fff" }}>
                    <span className="text-[13px]" style={{ color: COLORS.text }}>{s.name}</span>
                    <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0" style={{ background: isSelected ? COLORS.accent : "transparent", border: isSelected ? "none" : `1.5px solid ${COLORS.border}` }}>
                      {isSelected && <Check size={13} color="#fff" />}
                    </div>
                  </button>
                );
              })}
              {filtered.length === 0 && <div className="px-3.5 py-4 text-center text-[12px]" style={{ color: COLORS.muted }}>Aucun élève trouvé.</div>}
            </div>

            <Btn full icon={ArrowRight} disabled={!targetClassId || selected.size === 0} onClick={assignSelection}>Assigner la sélection ({selected.size})</Btn>
            <div className="mt-2"><Btn full variant="secondary" icon={UserCheck} disabled={!targetClassId} onClick={assignRest}>Assigner tout le reste ({cls.students.length})</Btn></div>
          </>
        )}
        <button onClick={finishLater} className="w-full text-center mt-4 py-1">
          <span className="text-[12px] font-semibold" style={{ color: COLORS.muted }}>Terminer plus tard</span>
        </button>
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
      <div className="rounded-[16px] overflow-hidden mb-3" style={{ border: `1px solid ${COLORS.border}` }}>
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
        <button onClick={addCustom} className="w-10 h-10 shrink-0 rounded-[16px] flex items-center justify-center" style={{ background: COLORS.primarySoft }}><Plus size={18} color={COLORS.primary} /></button>
      </div>
    </div>
  );
}

/* Niveaux d'une année scolaire — sert à PARCOURIR/GÉRER (programme partagé, sections
   existantes), mais n'impose plus de créer un niveau "à vide" avant de pouvoir travailler :
   l'action principale "Ajouter une classe" crée le niveau et la classe en un seul geste,
   pour ne pas pénaliser le cas le plus courant (une école sans sections multiples). */
function LevelsScreen({ ctx }) {
  const { yearId } = ctx.nav.current.params;
  const year = ctx.data.years.find((y) => y.id === yearId);
  const [adding, setAdding] = useState(false);
  const [levelName, setLevelName] = useState("");
  if (!year) return null;
  const levelNames = getYearLevelNames(year);

  const addLevel = () => {
    const trimmed = levelName.trim();
    if (!trimmed) return;
    ctx.setData((d) => updateLevel(d, yearId, trimmed, (lv) => lv)); // crée le niveau s'il n'existe pas encore
    setLevelName(""); setAdding(false);
    ctx.nav.push("levelDetails", { yearId, level: trimmed });
  };

  return (
    <Screen>
      <TopBar title="Niveaux" subtitle={year.label} onBack={() => ctx.nav.pop()} />
      <div className="px-4 pt-4 space-y-2">
        {!year.archived && (adding ? (
          <Card className="important-form-modal mb-3">
            <Field label="Nom du niveau"><TextInput autoFocus value={levelName} onChange={(e) => setLevelName(e.target.value)} placeholder="Ex. 6e année" /></Field>
            <p className="text-[11px] -mt-2 mb-3" style={{ color: COLORS.muted }}>Vous ajouterez ses matières puis ses classes juste après.</p>
            <div className="flex gap-2"><Btn variant="ghost" full onClick={() => setAdding(false)}>Annuler</Btn><Btn full disabled={!levelName.trim()} onClick={addLevel}>Créer</Btn></div>
          </Card>
        ) : <Btn full icon={Plus} onClick={() => setAdding(true)}>Ajouter un niveau</Btn>)}
        <SectionLabel>Niveaux de {year.label}</SectionLabel>
        {levelNames.map((level) => {
          const subjects = getLevelSubjects(year, level).filter((s) => !s.archived);
          const classes = year.classes.filter((c) => !c.archived && c.level === level);
          return (
            <Card key={level} onClick={() => ctx.nav.push("levelDetails", { yearId, level })} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[16px] flex items-center justify-center" style={{ background: COLORS.primarySoft }}><Layers size={18} color={COLORS.primary} /></div>
              <div className="flex-1"><p className="font-bold text-[14px]" style={{ color: COLORS.text }}>{level}</p><p className="text-[12px]" style={{ color: COLORS.muted }}>{classes.length} classe(s) · {subjects.length} matière(s)</p></div>
              <ChevronRight size={18} color={COLORS.muted} />
            </Card>
          );
        })}
        {levelNames.length === 0 && <EmptyState icon={Layers} title="Aucun niveau" text="Créez votre première classe — le niveau se crée automatiquement avec elle." />}
      </div>
    </Screen>
  );
}

/* Détail d'un niveau : deux portes d'entrée bien séparées — le programme (partagé)
   et les sections (chacune avec ses élèves et son enseignant assigné). */
function LevelDetailsScreen({ ctx }) {
  const { yearId, level } = ctx.nav.current.params;
  const year = ctx.data.years.find((y) => y.id === yearId);
  if (!year) return null;
  const subjects = getLevelSubjects(year, level).filter((s) => !s.archived);
  const classes = year.classes.filter((c) => !c.archived && c.level === level);
  const isIndependent = ctx.data.establishment?.accountType === "independent";
  /* Compte indépendant : pas d'onglet "Niveaux" séparé (déjà 5 onglets) — "Matières" et
     "Préparer mon programme" vivent sur le même écran (plus besoin de les séparer, lui seul
     enseigne tout), et l'avancement de ses classes est accessible directement, sans passer
     par l'écran intermédiaire à 2 boutons que voit un enseignant d'établissement. */
  const items = isIndependent ? [
    { key: "subjects", label: "Matières et programme", icon: BookOpen, sub: `${subjects.length} matière(s) — cours, compétences, questionnaires`, go: () => ctx.nav.push("teacherLevelSubjects", { yearId, level }) },
    { key: "classes", label: "Classes", icon: School, sub: `${classes.length} section(s) — élèves, cartes`, go: () => ctx.nav.push("classes", { yearId, level }) },
    { key: "progress", label: "Avancement de mes classes", icon: GraduationCap, sub: "Lancer une évaluation, voir les résultats", go: () => ctx.nav.push("teacherLevelClasses", { yearId, level }) },
  ] : [
    { key: "subjects", label: "Matières", icon: BookOpen, sub: `${subjects.length} matière(s) — programme commun à toutes les sections`, go: () => ctx.nav.push("subjects", { yearId, level }) },
    { key: "classes", label: "Classes", icon: School, sub: `${classes.length} section(s) (A, B…)`, go: () => ctx.nav.push("classes", { yearId, level }) },
  ];
  return (
    <Screen>
      <TopBar title={level} subtitle={`${year.label}${year.archived ? " · lecture seule" : ""}`} onBack={() => ctx.nav.pop()} right={year.archived ? <Badge tone="neutral">Archivée</Badge> : undefined} />
      <div className="px-4 pt-4 space-y-2">
        {items.map((it) => (
          <Card key={it.key} onClick={it.go} className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-[16px] flex items-center justify-center" style={{ background: COLORS.primarySoft }}><it.icon size={20} color={COLORS.primary} /></div>
            <div className="flex-1"><p className="font-bold text-[14px]" style={{ color: COLORS.text }}>{it.label}</p><p className="text-[12px]" style={{ color: COLORS.muted }}>{it.sub}</p></div>
            <ChevronRight size={18} color={COLORS.muted} />
          </Card>
        ))}
        {!year.archived && subjects.length === 0 && (
          <Card className="flex items-start gap-3 mt-2" style={{ background: COLORS.warningSoft, border: "none" }}>
            <AlertTriangle size={18} color={COLORS.warning} className="shrink-0 mt-0.5" />
            <p className="text-[12px] leading-5" style={{ color: COLORS.warning }}>Définissez d'abord les matières de ce niveau avant de créer des classes — elles seront proposées automatiquement à chaque nouvelle section.</p>
          </Card>
        )}
      </div>
    </Screen>
  );
}

/* Écran des classes (sections) d'UN niveau précis — plus de choix de cycle/matières ici :
   une section hérite automatiquement des matières déjà définies pour son niveau
   (écran "Niveaux → Matières"). Créer une classe ne demande donc que son nom. */
function ClassesScreen({ ctx }) {
  const { yearId, level, fromDistribute } = ctx.nav.current.params;
  const year = ctx.data.years.find((y) => y.id === yearId);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", cardCount: "40" });

  if (!year) return null;
  const levelSubjects = getLevelSubjects(year, level).filter((s) => !s.archived);
  const classesOfLevel = year.classes.filter((c) => !c.archived && c.level === level);

  const openAdd = () => { setForm({ name: "", cardCount: "40" }); setAdding(true); };
  const createClass = () => {
    if (!form.name.trim()) return;
    const selfId = ctx.data.establishment?.accountType === "independent" ? ctx.data.admin.selfTeacherId : null;
    const cardCount = Math.max(1, parseInt(form.cardCount, 10) || 40);
    const newClassId = uid("c");
    const teacherBySubject = {};
    if (selfId) levelSubjects.forEach((s) => { teacherBySubject[s.id] = selfId; });
    ctx.setData((d) => updateYear(d, yearId, (y) => ({ ...y, classes: [...y.classes, { id: newClassId, name: form.name.trim(), level, cardCount, students: [], teacherBySubject, questionnaireOverrides: [], archived: false }] })));
    setAdding(false);
    ctx.showToast(`Classe « ${form.name.trim()} » créée`);
    if (fromDistribute) {
      /* Créée depuis la répartition de fin d'année : les élèves existent déjà et attendent
         dans la classe "à répartir" — inutile de proposer un import, on revient direct
         à l'écran de répartition, où la classe fraîchement créée apparaît comme destination. */
      ctx.nav.pop();
      return;
    }
    ctx.nav.push("importStudents", { classId: newClassId, justCreated: true });
  };

  return (
    <Screen>
      <TopBar title="Classes" subtitle={`${level} · ${year.label}${year.archived ? " · lecture seule" : ""}`} onBack={() => ctx.nav.pop()} />
      <div className="px-4 pt-4 space-y-2">
        <p className="text-[11px] -mt-1 mb-1" style={{ color: COLORS.muted }}>Sections, élèves et cartes-réponses. Le programme (cours, compétences, questionnaires) se prépare depuis Programme.</p>
        {!year.archived && (adding ? (
          <Card className="important-form-modal mb-3">
            <Field label="Nom de la classe"><TextInput autoFocus value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder={`Ex. ${level} A`} /></Field>
            <Field label="Nombre de cartes à réserver">
              <TextInput type="number" min="1" value={form.cardCount} onChange={(e) => setForm((f) => ({ ...f, cardCount: e.target.value }))} placeholder="Ex. 40" />
            </Field>
            <p className="text-[11px] -mt-2 mb-3" style={{ color: COLORS.muted }}>
              {levelSubjects.length > 0
                ? <>Cette section héritera automatiquement des {levelSubjects.length} matière(s) déjà définies pour « {level} ».</>
                : <>Aucune matière n'est encore définie pour « {level} » — ajoutez-les depuis l'écran du niveau.</>}
            </p>
            <div className="flex gap-2"><Btn variant="ghost" full onClick={() => setAdding(false)}>Annuler</Btn><Btn full disabled={!form.name.trim()} onClick={createClass}>Créer</Btn></div>
          </Card>
        ) : <Btn full icon={Plus} onClick={openAdd}>Ajouter une classe</Btn>)}
        <SectionLabel>Classes de {level}</SectionLabel>
        {classesOfLevel.map((c) => (
          <Card key={c.id} onClick={() => ctx.nav.push(c.pendingDistribution ? "distributeStudents" : "importStudents", { classId: c.id })}
            style={c.pendingDistribution ? { border: `1.5px dashed ${COLORS.warning}` } : undefined}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[16px] flex items-center justify-center" style={{ background: c.pendingDistribution ? COLORS.warningSoft : COLORS.primarySoft }}>
                {c.pendingDistribution ? <Users size={18} color={COLORS.warning} /> : <GraduationCap size={18} color={COLORS.primary} />}
              </div>
              <div className="flex-1"><p className="font-bold text-[14px]" style={{ color: COLORS.text }}>{c.name}</p><p className="text-[12px]" style={{ color: COLORS.muted }}>{c.level}</p></div>
              <ChevronRight size={18} color={COLORS.muted} />
            </div>
            <div className="flex gap-2 mt-3 flex-wrap">
              {c.pendingDistribution ? (
                <Badge tone="warning" icon={Users}>{c.students.filter((s) => !s.archived).length} élèves à répartir</Badge>
              ) : (
                <>
                  <Badge tone="primary" icon={Users}>{c.students.filter((s) => !s.archived).length} élèves</Badge>
                  <Badge tone="accent" icon={CreditCard}>{c.cardCount || 40} cartes réservées</Badge>
                </>
              )}
            </div>
          </Card>
        ))}
        {classesOfLevel.length === 0 && <EmptyState icon={GraduationCap} title="Aucune classe" text="Créez la première section de ce niveau." />}
      </div>
    </Screen>
  );
}

/* Paramètres d'une classe : renommer et archiver. La liste des élèves n'est plus un choix
   parmi d'autres ici — c'est la destination directe quand on tape une classe depuis la liste
   ("Classes"), donc cet écran de réglages ne vit plus que derrière l'icône dédiée de
   ImportStudentsScreen. "Matières" a disparu : c'est un contenu de niveau (partagé entre
   toutes les sections), déjà accessible depuis Niveau → Matières — pas besoin de le répéter
   ici pour chaque classe. */
function ClassDetailsScreen({ ctx }) {
  const { classId } = ctx.nav.current.params;
  const loc = locateClass(ctx.data, classId);
  const [form, setForm] = useState(loc ? { name: loc.cls.name, level: loc.cls.level } : { name: "", level: "" });
  const [confirmArchive, setConfirmArchive] = useState(false);
  if (!loc) return null;
  const { cls } = loc;
  const activeStudents = cls.students.filter((s) => !s.archived).length;
  const canArchive = activeStudents === 0;

  const save = () => { ctx.setData((d) => updateClass(d, classId, (c) => ({ ...c, name: form.name, level: form.level }))); ctx.showToast("Classe mise à jour"); };
  const archive = () => { ctx.setData((d) => updateClass(d, classId, (c) => ({ ...c, archived: true }))); ctx.showToast(`« ${cls.name} » archivée`); ctx.nav.pop(); };

  return (
    <Screen>
      <TopBar title="Paramètres de la classe" subtitle={cls.name} onBack={() => ctx.nav.pop()} />
      <div className="px-4 pt-4">
        <Card className="mb-3">
          <Field label="Nom"><TextInput value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></Field>
          <Field label="Niveau"><TextInput value={form.level} onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))} /></Field>
          <Btn full disabled={!form.name.trim() || !form.level.trim()} onClick={save}>Enregistrer</Btn>
        </Card>
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
  const [search, setSearch] = useState("");
  const loc = locateClass(ctx.data, classId);
  if (!loc) return null;
  const readOnly = !!loc.yr.archived;
  const active = loc.cls.students.filter((s) => !s.archived);
  const visibleStudents = active.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

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
      <TopBar title="Élèves" subtitle={`${loc.cls.name}${readOnly ? " · lecture seule" : ""}`} onBack={() => ctx.nav.pop()} right={readOnly ? undefined : <button onClick={() => ctx.nav.push("classDetails", { classId })} className="p-1" aria-label="Paramètres de la classe"><Settings size={18} color={COLORS.muted} /></button>} />
      <div className="px-4 pt-4 space-y-2">
        {ctx.nav.current.params.justCreated && (
          <Card className="flex items-center gap-2" style={{ background: COLORS.successSoft, border: "none" }}>
            <CheckCircle2 size={18} color={COLORS.success} />
            <p className="text-[12px] font-semibold" style={{ color: COLORS.success }}>Classe créée. Importez maintenant la liste des élèves.</p>
          </Card>
        )}
        <Card className="flex items-start gap-3">
          <CreditCard size={20} color={COLORS.accent} className="mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-[13px]" style={{ color: COLORS.text }}>{loc.cls.cardCount || 40} cartes-réponses réservées pour cette classe</p>
            <p className="text-[12px]" style={{ color: COLORS.muted }}>{active.filter((s) => s.cardAssigned).length} déjà attribuées à un élève. Les cartes existent déjà (jeu imprimé et réutilisable de l'établissement) — vous attribuez simplement un numéro à chaque élève ici. L'impression se fait séparément, en dehors de l'application.</p>
          </div>
        </Card>
        {!readOnly && (
          <>
            <Card className="flex items-start gap-3">
              <FileSpreadsheet size={20} color={COLORS.primary} className="mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-[13px]" style={{ color: COLORS.text }}>Fichier CSV ou Excel</p>
                <p className="text-[12px] mb-3" style={{ color: COLORS.muted }}>Importer une nouvelle liste d'élèves — les cartes sont attribuées automatiquement.</p>
                <Btn variant="secondary" size="sm" icon={Upload} onClick={runSimulatedImport}>Choisir un fichier</Btn>
              </div>
            </Card>
            {manualOpen ? (
              <Card className="important-form-modal">
                <Field label="Nom complet de l'élève"><TextInput autoFocus value={manualName} onChange={(e) => setManualName(e.target.value)} placeholder="Ex. Karim Belkacem" /></Field>
                <div className="flex gap-2"><Btn variant="ghost" full onClick={() => setManualOpen(false)}>Annuler</Btn><Btn full onClick={addManual}>Ajouter</Btn></div>
              </Card>
            ) : <Btn variant="ghost" full icon={Plus} onClick={() => setManualOpen(true)}>Ajouter un élève manuellement</Btn>}
            {staged.length > 0 && (
              <Btn full icon={ArrowRight} onClick={() => ctx.nav.push("importPreview", { classId, staged })}>Vérifier la liste importée ({staged.length})</Btn>
            )}
          </>
        )}

        <p className="font-bold text-[13px] pt-2" style={{ color: COLORS.text }}>Liste actuelle ({active.length})</p>
        {active.length > 8 && (
          <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un élève" />
        )}
        <div className="rounded-[16px] overflow-hidden" style={{ border: `1px solid ${COLORS.border}` }}>
          <div className="max-h-[420px] overflow-y-auto">
            {visibleStudents.length === 0 && <div className="py-8 text-center text-[13px]" style={{ color: COLORS.muted }}>Aucun élève ne correspond.</div>}
            {visibleStudents.map((s, i) => (
              <div key={s.id} className="px-3 py-2.5" style={{ borderTop: i ? `1px solid ${COLORS.border}` : "none", background: i % 2 ? "#FBFCFD" : "#fff" }}>
                {readOnly ? (
                  <div className="w-full flex items-center justify-between">
                    <span className="text-[13px] font-medium truncate" style={{ color: COLORS.text }}>{s.name}</span>
                    {s.cardAssigned ? <Badge tone="primary">#{s.cardNumber}</Badge> : <Badge tone="warning">Sans carte</Badge>}
                  </div>
                ) : (
                  <button onClick={() => setActionsFor(s.id)} className="w-full flex items-center justify-between">
                    <span className="text-[13px] font-medium truncate" style={{ color: COLORS.text }}>{s.name}</span>
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

      {editingId && (
        <div className="important-form-modal">
          <p className="font-bold text-[14px] mb-3" style={{ color: COLORS.text }}>Modifier le nom de l’élève</p>
          <Field label="Nom complet"><TextInput autoFocus value={editName} onChange={(e) => setEditName(e.target.value)} /></Field>
          <div className="flex gap-2"><Btn variant="ghost" full onClick={() => setEditingId(null)}>Annuler</Btn><Btn full onClick={saveEdit}>Enregistrer</Btn></div>
        </div>
      )}

      {actionsStudent && (
        <div className="absolute inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(15,23,33,0.45)" }} onClick={() => setActionsFor(null)}>
          <div className="w-full rounded-t-2xl p-5" style={{ background: COLORS.surface }} onClick={(e) => e.stopPropagation()}>
            <p className="font-bold text-[14px] mb-3" style={{ color: COLORS.text }}>{actionsStudent.name}</p>
            <button onClick={() => startEdit(actionsStudent)} className="w-full text-left py-3 text-[14px] font-medium" style={{ color: COLORS.text }}>Modifier le nom</button>
            <button onClick={() => startEditCard(actionsStudent)} className="w-full text-left py-3 text-[14px] font-medium" style={{ color: COLORS.text }}>Modifier le numéro de carte</button>
            <button onClick={() => { setConfirmArchiveId(actionsStudent.id); setActionsFor(null); }} className="w-full text-left py-3 text-[14px] font-medium" style={{ color: COLORS.danger }}>Retirer l'élève</button>
            <Btn variant="ghost" full onClick={() => setActionsFor(null)}>Annuler</Btn>
          </div>
        </div>
      )}

      {editingCardId && (
        <div className="absolute inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(15,23,33,0.45)" }}>
          <div className="w-full rounded-t-2xl p-5" style={{ background: COLORS.surface }}>
            <p className="font-bold text-[14px] mb-3" style={{ color: COLORS.text }}>Modifier le numéro de carte</p>
            <TextInput autoFocus value={editCardValue} onChange={(e) => { setEditCardValue(e.target.value); setDupWarning(false); }} placeholder="Ex. 042" />
            {dupWarning && <p className="text-[12px] mt-2 font-semibold" style={{ color: COLORS.danger }}>Ce numéro est déjà utilisé par un autre élève de la classe.</p>}
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
            <Card key={r.id} className="flex items-center justify-between !py-2.5" style={{ background: r.ok && r.name.trim() ? COLORS.surface : COLORS.dangerSoft, border: r.ok && r.name.trim() ? "none" : "1.5px solid #F0C6C1" }}>
              <div className="flex items-center gap-2">
                {r.ok && r.name.trim() ? <CheckCircle2 size={18} color={COLORS.success} /> : <XCircle size={18} color={COLORS.danger} />}
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

/* Écran réservé aux comptes établissement (gestionnaire) — un compte indépendant gère ses
   matières et son programme sur un seul écran fusionné (TeacherLevelSubjectsScreen), plus
   jamais via celui-ci. Les matières (et leur contenu) sont partagées par toutes les sections
   d'un même niveau ; l'enseignant assigné, lui, reste propre à CETTE classe. */
function SubjectsScreen({ ctx }) {
  const { yearId, level } = ctx.nav.current.params;
  const yr = ctx.data.years.find((y) => y.id === yearId);
  const [adding, setAdding] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState(new Set());
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  if (!yr || !level) return null;
  const levelSubjects = getLevelSubjects(yr, level);
  const existingNames = levelSubjects.filter((s) => !s.archived).map((s) => s.name);

  const toggleSubject = (name) => setSelectedSubjects((prev) => { const n = new Set(prev); n.has(name) ? n.delete(name) : n.add(name); return n; });
  const addCustomToCatalog = (name) => {
    ctx.setData((d) => (d.subjectCatalog.includes(name) ? d : { ...d, subjectCatalog: [...d.subjectCatalog, name] }));
    setSelectedSubjects((prev) => new Set(prev).add(name));
  };
  const confirmAdd = () => {
    const newSubjects = [...selectedSubjects].map((name) => ({ id: uid("s"), name, archived: false, courses: [], questionnaires: [] }));
    ctx.setData((d) => updateLevel(d, yr.id, level, (lv) => ({ ...lv, subjects: [...lv.subjects, ...newSubjects] })));
    ctx.showToast(newSubjects.length > 1 ? `${newSubjects.length} matières ajoutées au niveau « ${level} »` : `Matière ajoutée au niveau « ${level} »`);
    setSelectedSubjects(new Set()); setAdding(false);
  };
  const deleteSubject = (id) => {
    ctx.setData((d) => {
      const withLevel = updateLevel(d, yr.id, level, (lv) => ({ ...lv, subjects: lv.subjects.filter((s) => s.id !== id) }));
      return { ...withLevel, years: withLevel.years.map((y) => (y.id !== yr.id ? y : { ...y, classes: y.classes.map((c) => (c.level !== level ? c : { ...c, teacherBySubject: Object.fromEntries(Object.entries(c.teacherBySubject || {}).filter(([sid]) => sid !== id)) })) })) };
    });
    setConfirmDeleteId(null);
    ctx.showToast("Matière supprimée du niveau");
  };

  return (
    <Screen>
      <TopBar title="Matières" subtitle={`${level} · programme du niveau${yr.archived ? " · lecture seule" : ""}`} onBack={() => ctx.nav.pop()} />
      <div className="px-4 pt-4 space-y-2">
        {!yr.archived && (adding ? (
          <Card className="important-form-modal mb-3">
            <p className="text-[12px] mb-2" style={{ color: COLORS.muted }}>Cochez les matières à ajouter au niveau « {level} ».</p>
            <SubjectPicker catalog={ctx.data.subjectCatalog} selected={selectedSubjects} onToggle={toggleSubject} onAddCustom={addCustomToCatalog} excluded={existingNames} />
            <div className="flex gap-2 mt-3">
              <Btn variant="ghost" full onClick={() => { setAdding(false); setSelectedSubjects(new Set()); }}>Annuler</Btn>
              <Btn full disabled={selectedSubjects.size === 0} onClick={confirmAdd}>Ajouter ({selectedSubjects.size})</Btn>
            </div>
          </Card>
        ) : <Btn full icon={Plus} onClick={() => setAdding(true)}>Ajouter une matière</Btn>)}
        <SectionLabel>Matières de {level}</SectionLabel>
        {levelSubjects.filter((s) => !s.archived).map((s) => {
          const canDelete = s.questionnaires.length === 0;
          return (
            <Card key={s.id}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[16px] flex items-center justify-center" style={{ background: COLORS.primarySoft }}><BookOpen size={18} color={COLORS.primary} /></div>
                <div className="flex-1"><p className="font-bold text-[14px]" style={{ color: COLORS.text }}>{s.name}</p><p className="text-[12px]" style={{ color: COLORS.muted }}>{s.questionnaires.length} questionnaire(s)</p></div>
                {!yr.archived && <button onClick={() => setConfirmDeleteId(s.id)} disabled={!canDelete} className="p-1.5" style={{ opacity: canDelete ? 1 : 0.3 }}><Trash2 size={18} color={COLORS.danger} /></button>}
              </div>
            </Card>
          );
        })}
      </div>
      <ConfirmModal open={!!confirmDeleteId} title="Supprimer cette matière ?" text="Cette action retire la matière pour toutes les sections de ce niveau. Possible uniquement si aucun questionnaire n'y est rattaché." onCancel={() => setConfirmDeleteId(null)} onConfirm={() => deleteSubject(confirmDeleteId)} confirmLabel="Supprimer" danger />
    </Screen>
  );
}

/* Regroupe les affectations d'un enseignant par classe — utilisé par la liste (compte) et le détail (détail). */
function groupAssignmentsByClass(ctx, teacherId) {
  const byClass = [];
  getTeacherAssignments(ctx.data, teacherId).forEach(({ cls, subject }) => {
    let entry = byClass.find((e) => e.classId === cls.id);
    if (!entry) { entry = { classId: cls.id, className: cls.name, subjectNames: [] }; byClass.push(entry); }
    entry.subjectNames.push(subject.name);
  });
  return byClass;
}

/* Enseignants (Admin) — simple liste, chaque carte ne montre que l'essentiel (statut,
   nombre de classes) ; les actions (assigner, inviter, désactiver) vivent une seule fois,
   sur l'écran de détail, pour ne pas les répéter sur chaque ligne de la liste. */
function TeachersListScreen({ ctx }) {
  const [search, setSearch] = useState("");
  const filteredTeachers = ctx.data.teachers.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <Screen>
      <TopBar title="Enseignants" subtitle={ctx.data.establishment.name} />
      <div className="px-4 pt-4 space-y-2">
        <Btn full icon={UserPlus} onClick={() => ctx.nav.push("createTeacher")}>Inviter un enseignant</Btn>
        {(ctx.data.invitations || []).filter((i) => i.status === "pending").length > 0 && <Card className="mb-2" style={{ background: COLORS.warningSoft, border: "none" }}>
          <p className="text-[12px] font-bold mb-2" style={{ color: COLORS.warning }}>Invitations en attente</p>
          {(ctx.data.invitations || []).filter((i) => i.status === "pending").map((i) => {
            const classCount = Object.keys(i.pendingAssignments || {}).length;
            return (
              <button key={i.id} onClick={() => ctx.nav.push("shareCredentials", { inviteId: i.id })} className="w-full flex items-center justify-between py-1.5 text-left">
                <span><b className="text-[12px]" style={{ color: COLORS.text }}>{i.name}</b><span className="block text-[11px]" style={{ color: COLORS.muted }}>{i.email} · {classCount > 0 ? `${classCount} classe(s) assignée(s)` : "aucune classe assignée"}</span></span>
                <Badge tone="warning">À rejoindre</Badge>
              </button>
            );
          })}
        </Card>}
        <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un enseignant" className="mb-1" />
        <SectionLabel>Tous les enseignants</SectionLabel>
        {filteredTeachers.length === 0 && <div className="py-8 text-center text-[13px]" style={{ color: COLORS.muted }}>Aucun enseignant ne correspond.</div>}
        {filteredTeachers.map((t) => {
          const classCount = groupAssignmentsByClass(ctx, t.id).length;
          return (
            <Card key={t.id} onClick={() => ctx.nav.push("teacherDetails", { teacherId: t.id })} className="flex items-center gap-3" style={{ opacity: t.active ? 1 : 0.55 }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: COLORS.primarySoft }}><User size={18} color={COLORS.primary} /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2"><p className="font-bold text-[14px] truncate" style={{ color: COLORS.text }}>{t.name}</p>{!t.active && <Badge tone="neutral">Désactivé</Badge>}</div>
                <p className="text-[12px] truncate" style={{ color: classCount ? COLORS.muted : COLORS.warning }}>{classCount > 0 ? `${classCount} classe(s) assignée(s)` : "Aucune classe assignée"}</p>
              </div>
              <ChevronRight size={18} color={COLORS.muted} className="shrink-0" />
            </Card>
          );
        })}
      </div>
    </Screen>
  );
}

/* Détail d'un enseignant — un seul endroit pour toutes ses actions (assigner, inviter,
   désactiver), au lieu de les répéter sur chaque carte de la liste. */
function TeacherDetailsScreen({ ctx }) {
  const { teacherId } = ctx.nav.current.params;
  const teacher = findTeacher(ctx.data, teacherId);
  if (!teacher) return null;
  const byClass = groupAssignmentsByClass(ctx, teacherId);
  /* Historique toutes années confondues (active + archivées) — pour que le gestionnaire
     puisse voir en un coup d'œil ce que cet enseignant a fait les années précédentes. */
  const yearGroups = getTeacherYearGroups(ctx.data, teacherId, { includeArchivedYears: true });

  const resend = () => {
    if (!teacher.email) { ctx.showToast("Ajoutez un email pour envoyer une invitation", { tone: "warning" }); return; }
    const inviteId = uid("inv");
    const invitation = { id: inviteId, code: `KAGAT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`, name: teacher.name, email: teacher.email, establishmentId: ctx.data.establishment.id, establishmentName: ctx.data.establishment.name, status: "pending", createdAt: Date.now() };
    ctx.setData((d) => ({ ...d, invitations: [...(d.invitations || []), invitation] }));
    ctx.nav.push("shareCredentials", { inviteId, mode: "resend" });
  };
  const toggleActive = () => {
    const willBeActive = !teacher.active;
    ctx.setData((d) => ({ ...d, teachers: d.teachers.map((t) => (t.id === teacherId ? { ...t, active: willBeActive } : t)) }));
    if (willBeActive) ctx.showToast(`${teacher.name} réactivé`);
    else ctx.showToast(`${teacher.name} désactivé`, { actionLabel: "Annuler", onAction: () => ctx.setData((d) => ({ ...d, teachers: d.teachers.map((t) => (t.id === teacherId ? { ...t, active: true } : t)) })) });
  };

  return (
    <Screen>
      <TopBar title={teacher.name} subtitle={ctx.data.establishment.name} onBack={() => ctx.nav.pop()} />
      <div className="px-4 pt-4 space-y-2">
        <Card className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ background: COLORS.primarySoft }}><User size={20} color={COLORS.primary} /></div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-[14px] truncate" style={{ color: COLORS.text }}>{teacher.name}</p>
            <p className="text-[12px] truncate" style={{ color: COLORS.muted }}>{teacher.email || teacher.phone || teacher.username}{teacher.city || teacher.country ? ` · ${[teacher.city, teacher.country].filter(Boolean).join(", ")}` : ""}</p>
          </div>
          <Badge tone={teacher.active ? "success" : "neutral"}>{teacher.active ? "Actif" : "Désactivé"}</Badge>
        </Card>

        <SectionLabel>Classes et matières</SectionLabel>
        {byClass.length > 0 ? byClass.map((e) => (
          <Card key={e.classId} className="flex items-start gap-3">
            <GraduationCap size={18} color={COLORS.primary} className="shrink-0 mt-0.5" />
            <p className="text-[13px] leading-5" style={{ color: COLORS.text }}><b>{e.className}</b> — {e.subjectNames.join(", ")}</p>
          </Card>
        )) : <EmptyState icon={GraduationCap} title="Aucune classe assignée" text="Assignez cet enseignant à une ou plusieurs classes." />}

        {yearGroups.length > 1 && (
          <>
            <SectionLabel>Historique par année</SectionLabel>
            {yearGroups.filter((y) => y.yearArchived).map((y) => {
              const classCount = y.levels.reduce((sum, g) => sum + g.classes.length, 0);
              return (
                <Card key={y.yearId} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-[16px] flex items-center justify-center shrink-0" style={{ background: "#EEF1F4" }}><Calendar size={18} color={COLORS.muted} /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap"><p className="font-bold text-[13px]" style={{ color: COLORS.text }}>{y.yearLabel}</p><Badge tone="neutral">Archivée</Badge></div>
                    <p className="text-[11px]" style={{ color: COLORS.muted }}>{y.levels.length} niveau(x) · {classCount} classe(s) · {y.levels.flatMap((g) => g.subjects).length} matière(s)</p>
                  </div>
                </Card>
              );
            })}
          </>
        )}

        <SectionLabel>Actions</SectionLabel>
        <div className="grid grid-cols-2 gap-3">
          <Card onClick={() => ctx.nav.push("assignClassesToTeacher", { teacherId })} className="flex flex-col gap-2">
            <div className="w-9 h-9 rounded-[16px] flex items-center justify-center" style={{ background: COLORS.accentSoft }}><BookOpen size={18} color={COLORS.accent} /></div>
            <p className="font-bold text-[13px]" style={{ color: COLORS.text }}>Assigner des matières</p>
            <p className="text-[11px]" style={{ color: COLORS.muted }}>Classes et sections</p>
          </Card>
          <Card onClick={resend} className="flex flex-col gap-2">
            <div className="w-9 h-9 rounded-[16px] flex items-center justify-center" style={{ background: COLORS.primarySoft }}><Share2 size={18} color={COLORS.primary} /></div>
            <p className="font-bold text-[13px]" style={{ color: COLORS.text }}>Envoyer une invitation</p>
            <p className="text-[11px]" style={{ color: COLORS.muted }}>Code + accès à l'école</p>
          </Card>
        </div>
        <button onClick={toggleActive} className="w-full text-center text-[12px] font-semibold py-2" style={{ color: teacher.active ? COLORS.danger : COLORS.primary }}>{teacher.active ? "Désactiver ce compte" : "Réactiver ce compte"}</button>
      </div>
    </Screen>
  );
}

function CreateTeacherScreen({ ctx }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const canSubmit = name.trim().length > 1 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const submit = () => {
    if (!canSubmit) { setEmailError("Saisissez un nom et une adresse email valides."); return; }
    const duplicate = ctx.data.teachers.some((t) => t.email.toLowerCase() === email.trim().toLowerCase()) || (ctx.data.invitations || []).some((i) => i.email.toLowerCase() === email.trim().toLowerCase() && i.status === "pending");
    if (duplicate) { setEmailError("Cet email possède déjà un compte ou une invitation active."); return; }
    const inviteId = uid("inv");
    const code = `KAGAT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const invitation = { id: inviteId, code, name: name.trim(), email: email.trim().toLowerCase(), establishmentId: ctx.data.establishment.id, establishmentName: ctx.data.establishment.name, status: "pending", createdAt: Date.now() };
    ctx.setData((d) => ({ ...d, invitations: [...(d.invitations || []), invitation] }));
    ctx.showToast("Invitation créée");
    ctx.nav.push("assignClassesToTeacher", { inviteId });
  };

  return (
    <Screen>
      <TopBar title="Inviter un enseignant" onBack={() => ctx.nav.pop()} />
      <div className="important-form-modal px-4 pt-4">
        <Card className="mb-4 flex items-start gap-3" style={{ background: COLORS.primarySoft, border: "none" }}>
          <ShieldCheck size={20} color={COLORS.primary} className="shrink-0 mt-0.5" />
          <div><p className="text-[13px] font-bold" style={{ color: COLORS.primaryDark }}>Une invitation, pas un mot de passe</p><p className="text-[12px] mt-1" style={{ color: COLORS.muted }}>L’enseignant vérifiera son email et créera lui-même son mot de passe.</p></div>
        </Card>
        <DemoFillButton onClick={() => { setName("Amina Enseignante"); setEmail("amina@ecole-demo.dz"); setEmailError(""); }} />
        <Field label="Nom complet"><TextInput autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex. Chaïma Rahal" /></Field>
        <Field label="Adresse email"><TextInput value={email} onChange={(e) => { setEmail(e.target.value); setEmailError(""); }} placeholder="Ex. chaima.rahal@ecole.dz" autoCapitalize="none" /></Field>
        {emailError && <p className="text-[12px] mb-3 font-semibold" style={{ color: COLORS.danger }}>{emailError}</p>}
        <Btn full icon={Send} disabled={!canSubmit} onClick={submit}>Créer l’invitation</Btn>
      </div>
    </Screen>
  );
}

function ShareCredentialsScreen({ ctx }) {
  const { inviteId } = ctx.nav.current.params;
  const invitation = (ctx.data.invitations || []).find((i) => i.id === inviteId);
  const [copied, setCopied] = useState(false);
  if (!invitation) return null;

  const assignments = resolvePendingAssignments(ctx, invitation);
  const invitationLink = `${window.location.origin}${window.location.pathname}?invite=${encodeURIComponent(invitation.code)}`;
  const assignmentsBlock = assignments.length
    ? `\nClasses et matières assignées :\n${assignments.map((a) => `- ${a.className} — ${a.subjectNames.join(", ")}`).join("\n")}\n`
    : "";
  const message = `Bonjour ${invitation.name},\n${invitation.establishmentName} vous invite à rejoindre KAGAT.\nCode d’invitation : ${invitation.code}\nAccédez directement à votre école : ${invitationLink}\nVous pourrez vérifier votre email et créer votre propre mot de passe.\n${assignmentsBlock}`;

  const copy = async () => {
    try { await navigator.clipboard.writeText(message); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch (e) { /* copie manuelle possible depuis le champ ci-dessous */ }
  };
  const sendByEmail = () => {
    const subject = encodeURIComponent(`Invitation à rejoindre ${invitation.establishmentName} sur KAGAT`);
    window.location.href = `mailto:${invitation.email}?subject=${subject}&body=${encodeURIComponent(message)}`;
  };

  return (
    <Screen>
      <TopBar title="Invitation prête" onBack={() => ctx.nav.resetTo("teachersList")} />
      <div className="px-4 pt-4">
        <Card className="mb-3" style={{ background: COLORS.successSoft, border: "none" }}>
          <p className="text-[13px] font-semibold" style={{ color: COLORS.success }}>L’invitation de {invitation.name} est prête. Aucun mot de passe n’est envoyé.</p>
        </Card>
        <Card className="mb-3 text-center"><p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: COLORS.muted }}>Code d’invitation</p><p className="text-[28px] font-black mt-1 tracking-wide" style={{ color: COLORS.primary }}>{invitation.code}</p></Card>

        <SectionLabel>Classes et matières assignées</SectionLabel>
        {assignments.length > 0 ? (
          <Card className="mb-3 space-y-1.5">
            {assignments.map((a) => (
              <div key={a.classId} className="flex items-start gap-1.5 text-[12px]" style={{ color: COLORS.text }}>
                <GraduationCap size={13} color={COLORS.primary} className="mt-0.5 shrink-0" />
                <span><b>{a.className}</b> — {a.subjectNames.join(", ")}</span>
              </div>
            ))}
          </Card>
        ) : (
          <Card className="mb-3 flex items-start gap-3" style={{ background: COLORS.warningSoft, border: "none" }}>
            <AlertTriangle size={18} color={COLORS.warning} className="shrink-0 mt-0.5" />
            <p className="text-[12px] leading-5" style={{ color: COLORS.warning }}>Aucune classe assignée pour l'instant.</p>
          </Card>
        )}
        <button onClick={() => ctx.nav.push("assignClassesToTeacher", { inviteId })} className="w-full text-center text-[12px] font-semibold py-2 mb-1" style={{ color: COLORS.primary }}>{assignments.length > 0 ? "Modifier l'affectation" : "Assigner des classes"}</button>

        <Card className="mb-3">
          <TextArea readOnly rows={7} value={message} style={{ background: "#F7F8FA" }} />
        </Card>
        <div className="flex gap-2 mb-2">
          <Btn full icon={Send} onClick={sendByEmail}>Envoyer par email</Btn>
          <Btn full variant="ghost" icon={Copy} onClick={copy}>{copied ? "Copié !" : "Copier"}</Btn>
        </div>
        <button onClick={() => ctx.nav.resetTo("teachersList")} className="w-full text-center text-[12px] font-semibold py-2" style={{ color: COLORS.muted }}>Voir la liste des enseignants</button>
      </div>
    </Screen>
  );
}

/* Résout les affectations en attente d'une invitation (classId -> subjectIds) en noms lisibles —
   même forme que groupAssignmentsByClass, pour un enseignant qui n'existe pas encore. */
function resolvePendingAssignments(ctx, invitation) {
  const allClasses = ctx.data.years.flatMap((y) => y.classes);
  return Object.entries(invitation?.pendingAssignments || {}).map(([classId, subjectIds]) => {
    const cls = allClasses.find((c) => c.id === classId);
    if (!cls || !subjectIds.length) return null;
    const yr = ctx.data.years.find((y) => y.classes.some((c) => c.id === classId));
    const subjectNames = getLevelSubjects(yr, cls.level).filter((s) => subjectIds.includes(s.id)).map((s) => s.name);
    return { classId, className: cls.name, subjectNames };
  }).filter(Boolean);
}

/* Affectation d'un enseignant à une ou plusieurs classes, chacune avec plusieurs matières, en boucle.
   Fonctionne pour deux cibles : un enseignant déjà créé (teacherId, écrit directement sur les classes)
   ou une invitation pas encore acceptée (inviteId, écrit dans invitation.pendingAssignments — appliqué
   aux classes seulement quand l'enseignant crée son compte). On choisit d'abord le NIVEAU, puis la
   classe/section à l'intérieur — plus de liste plate mélangeant tous les niveaux. */
function AssignClassesToTeacherScreen({ ctx }) {
  const { teacherId, inviteId } = ctx.nav.current.params;
  const teacher = teacherId ? findTeacher(ctx.data, teacherId) : null;
  const invitation = inviteId ? (ctx.data.invitations || []).find((i) => i.id === inviteId) : null;
  const personName = teacher?.name || invitation?.name || "";
  // Années archivées exclues : impossible d'assigner un enseignant à une classe en lecture seule.
  const allClasses = ctx.data.years.filter((y) => !y.archived).flatMap((y) => y.classes).filter((c) => !c.archived);
  const allLevels = [...new Set(allClasses.map((c) => c.level))].sort();

  const [phase, setPhase] = useState("pickLevel"); // pickLevel | pickClass | pickSubjects | askMore
  const [currentLevel, setCurrentLevel] = useState("");
  const [currentClassId, setCurrentClassId] = useState("");
  const [selectedSubjectIds, setSelectedSubjectIds] = useState(new Set());
  const [doneRounds, setDoneRounds] = useState([]); // [{className, subjectNames:[]}]

  const classesOfLevel = allClasses.filter((c) => c.level === currentLevel);
  const currentClass = allClasses.find((c) => c.id === currentClassId);
  const currentYr = currentClass ? ctx.data.years.find((y) => y.classes.some((c) => c.id === currentClassId)) : null;
  const currentSubjects = currentYr ? getLevelSubjects(currentYr, currentClass.level) : [];

  const pickLevel = (level) => { setCurrentLevel(level); setCurrentClassId(""); setPhase("pickClass"); };
  const pickClass = (classId) => {
    setCurrentClassId(classId);
    const cls = allClasses.find((c) => c.id === classId);
    const already = teacherId
      ? new Set(Object.entries(cls.teacherBySubject || {}).filter(([, tId]) => tId === teacherId).map(([sid]) => sid))
      : new Set((invitation?.pendingAssignments || {})[classId] || []);
    setSelectedSubjectIds(already);
    setPhase("pickSubjects");
  };
  const toggleSubject = (id) => setSelectedSubjectIds((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const confirmSubjects = () => {
    if (teacherId) {
      ctx.setData((d) => updateClass(d, currentClassId, (c) => {
        const next = { ...(c.teacherBySubject || {}) };
        currentSubjects.forEach((s) => {
          if (selectedSubjectIds.has(s.id)) next[s.id] = teacherId;
          else if (next[s.id] === teacherId) delete next[s.id];
        });
        return { ...c, teacherBySubject: next };
      }));
    } else {
      ctx.setData((d) => ({
        ...d,
        invitations: (d.invitations || []).map((i) => (i.id === inviteId ? { ...i, pendingAssignments: { ...(i.pendingAssignments || {}), [currentClassId]: [...selectedSubjectIds] } } : i)),
      }));
    }
    setDoneRounds((r) => [...r, { className: currentClass.name, subjectNames: currentSubjects.filter((s) => selectedSubjectIds.has(s.id)).map((s) => s.name) }]);
    setPhase("askMore");
    ctx.showToast(`${personName.split(" ")[0]} assigné à ${currentClass.name}`);
  };

  const anotherClass = () => { setCurrentClassId(""); setSelectedSubjectIds(new Set()); setPhase("pickLevel"); };
  const finish = () => (inviteId ? ctx.nav.push("shareCredentials", { inviteId }) : ctx.nav.pop());

  let title = "Choisir le niveau", body = null;
  if (phase === "pickLevel") {
    body = <div className="px-4">
      {allLevels.map((level) => {
        const count = allClasses.filter((c) => c.level === level).length;
        return <OptionCard key={level} icon={Layers} title={level} subtitle={`${count} classe${count > 1 ? "s" : ""}`} selected={currentLevel === level} onClick={() => pickLevel(level)} />;
      })}
      {allLevels.length === 0 && <EmptyState icon={Layers} title="Aucun niveau" text="Créez un niveau et ses classes avant d'assigner un enseignant." />}
      {inviteId && <Btn variant="ghost" full onClick={finish}>Assigner plus tard</Btn>}
    </div>;
  } else if (phase === "pickClass") {
    title = "Choisir la classe";
    body = <div className="px-4">
      {classesOfLevel.map((c) => <OptionCard key={c.id} icon={GraduationCap} title={c.name} subtitle={c.level} selected={currentClassId === c.id} onClick={() => pickClass(c.id)} />)}
    </div>;
  } else if (phase === "pickSubjects") {
    title = "Choisir les matières";
    body = <div className="px-4">
      <p className="text-[12px] mb-3" style={{ color: COLORS.muted }}>Cochez toutes les matières que {personName.split(" ")[0]} enseigne dans « {currentClass.name} ».</p>
      <div className="rounded-[16px] overflow-hidden mb-4" style={{ border: `1px solid ${COLORS.border}` }}>
        {currentSubjects.filter((s) => !s.archived).map((s, i) => {
          const isSelected = selectedSubjectIds.has(s.id);
          const currentTeacherId = (currentClass.teacherBySubject || {})[s.id];
          const otherTeacher = currentTeacherId && currentTeacherId !== teacherId ? findTeacher(ctx.data, currentTeacherId) : null;
          return (
            <button key={s.id} onClick={() => toggleSubject(s.id)} className="w-full flex items-center justify-between px-3.5 py-3"
              style={{ borderTop: i ? `1px solid ${COLORS.border}` : "none", background: isSelected ? COLORS.accentSoft : "#fff" }}>
              <div className="text-left">
                <p className="text-[13px]" style={{ color: COLORS.text }}>{s.name}</p>
                {otherTeacher && <p className="text-[11px]" style={{ color: COLORS.warning }}>Actuellement : {otherTeacher.name}</p>}
              </div>
              <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0" style={{ background: isSelected ? COLORS.accent : "transparent", border: isSelected ? "none" : `1.5px solid ${COLORS.border}` }}>
                {isSelected && <Check size={13} color="#fff" />}
              </div>
            </button>
          );
        })}
        {currentSubjects.filter((s) => !s.archived).length === 0 && <div className="px-3.5 py-4 text-center text-[12px]" style={{ color: COLORS.muted }}>Ce niveau n'a aucune matière pour l'instant.</div>}
      </div>
      <Btn full variant="accent" icon={CheckCircle2} disabled={selectedSubjectIds.size === 0} onClick={confirmSubjects}>Confirmer ({selectedSubjectIds.size} matière{selectedSubjectIds.size > 1 ? "s" : ""})</Btn>
    </div>;
  } else if (phase === "askMore") {
    title = "Classe ajoutée";
    body = <div className="px-4">
      <Card className="mb-4" style={{ background: COLORS.successSoft, border: "none" }}>
        <p className="text-[13px] font-semibold" style={{ color: COLORS.success }}>{personName} enseigne maintenant dans {doneRounds.length} classe{doneRounds.length > 1 ? "s" : ""} :</p>
        {doneRounds.map((r, i) => <p key={i} className="text-[12px] mt-1" style={{ color: COLORS.success }}>· {r.className} — {r.subjectNames.join(", ")}</p>)}
      </Card>
      <p className="text-[13px] font-semibold mb-3" style={{ color: COLORS.text }}>Assigner {personName.split(" ")[0]} à une autre classe ?</p>
      <div className="flex gap-2">
        <Btn variant="ghost" full onClick={finish}>Terminer</Btn>
        <Btn full icon={Plus} onClick={anotherClass}>Oui, une autre classe</Btn>
      </div>
    </div>;
  }

  const goBack = () => {
    if (phase === "pickLevel") { ctx.nav.pop(); return; }
    if (phase === "pickClass") { setPhase("pickLevel"); return; }
    if (phase === "pickSubjects") { setPhase("pickClass"); return; }
    finish();
  };

  return (
    <Screen>
      <TopBar title={title} subtitle={teacher ? `${teacher.name} · ${teacher.username}` : `${personName} · ${invitation?.email || ""}`} onBack={goBack} />
      <div className="pt-2">{body}</div>
    </Screen>
  );
}

/* ============================ ESPACE ENSEIGNANT ============================ */

function TeacherDashboardScreen({ ctx }) {
  const teacher = findTeacher(ctx.data, ctx.currentUser.id);
  const levelGroups = getTeacherLevelGroups(ctx.data, teacher.id);
  const alert = getSyncAlertLevel(ctx.data);
  const totalClasses = levelGroups.reduce((sum, g) => sum + g.classes.length, 0);
  const totalStudents = levelGroups.reduce((sum, g) => sum + g.classes.reduce((n, c) => n + c.students.filter((s) => !s.archived).length, 0), 0);
  const inProgress = ctx.data.sessions.filter((s) => s.teacherId === teacher.id && s.status !== "completed").length;

  /* Relancer une évaluation, c'est presque toujours reprendre la même classe et la même
     matière que la dernière fois. On le propose en un geste, plutôt que de faire retraverser
     l'assistant — qui reste la voie normale pour une combinaison inédite. */
  const resume = (() => {
    const last = ctx.data.sessions
      .filter((s) => s.teacherId === teacher.id)
      .reduce((latest, s) => (!latest || (s.createdAt || 0) > (latest.createdAt || 0) ? s : latest), null);
    if (!last) return null;
    const l = locateClass(ctx.data, last.classId);
    if (!l || l.yr.archived || l.cls.archived) return null;
    const subject = getLevelSubjects(l.yr, l.cls.level).find((s) => s.id === last.subjectId);
    if (!subject) return null;
    const course = (subject.courses || []).find((c) => c.id === last.courseId);
    return { classId: l.cls.id, className: l.cls.name, subjectId: subject.id, subjectName: subject.name, courseId: course?.id, courseTitle: course?.title };
  })();

  return (
    <Screen>
      <TopBar title={`Bienvenue, ${teacher.name.split(" ")[0]}`} subtitle={`${ctx.data.establishment.name} · KAGAT`} right={<SyncIndicator ctx={ctx} />} />
      <div className="px-4 pt-3 space-y-4">
        <div className="dashboard-hero teacher-hero">
          <div className="dashboard-hero-icon"><ScanLine size={24} /></div>
          <div className="flex-1"><Badge tone="success">Prêt pour la classe</Badge><p>Lancez une évaluation en quelques secondes.</p></div>
          <button onClick={() => ctx.nav.push("evalPrep", {})} className="hero-play" aria-label="Lancer une évaluation"><PlayCircle size={20}/></button>
        </div>
        {resume && (
          <Card onClick={() => ctx.nav.push("evalPrep", { classId: resume.classId, subjectId: resume.subjectId, ...(resume.courseId ? { courseId: resume.courseId } : {}) })} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[16px] flex items-center justify-center shrink-0" style={{ background: COLORS.successSoft }}><PlayCircle size={20} color={COLORS.success} /></div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[13px] truncate" style={{ color: COLORS.text }}>Reprendre · {resume.className}</p>
              <p className="text-[12px] truncate" style={{ color: COLORS.muted }}>{resume.subjectName}{resume.courseTitle ? ` · ${resume.courseTitle}` : ""}</p>
            </div>
            <ChevronRight size={18} color={COLORS.muted} className="shrink-0" />
          </Card>
        )}
        <OnboardingTip ctx={ctx} text="Dans l'onglet « Classes », préparez vos cours et vos questionnaires. Ensuite, dans l'onglet « Évaluer », lancez vos évaluations et consultez les résultats." />

        {alert.level !== "ok" && (
          <Card onClick={() => ctx.nav.push("sync")} className="flex items-center gap-2" style={{ background: alert.level === "critical" ? COLORS.dangerSoft : COLORS.warningSoft, border: "none" }}>
            <AlertTriangle size={18} color={alert.level === "critical" ? COLORS.danger : COLORS.warning} />
            <p className="text-[12px] font-semibold flex-1" style={{ color: alert.level === "critical" ? COLORS.danger : COLORS.warning }}>
              {alert.count} évaluation(s) non synchronisée(s) — connectez-vous pour sauvegarder vos données.
            </p>
          </Card>
        )}

        {/* Des chiffres, pas une deuxième liste des niveaux — celle-ci vit déjà dans l'onglet Programme. */}
        <SectionLabel>Vue d'ensemble</SectionLabel>
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={Layers} value={levelGroups.length} label="Niveaux enseignés" />
          <StatCard icon={GraduationCap} value={totalClasses} label="Classes" tone="accent" />
          <StatCard icon={Users} value={totalStudents} label="Élèves" tone="success" />
          <StatCard icon={ClipboardList} value={inProgress} label="Évaluations en cours" tone="warning" />
        </div>
      </div>
    </Screen>
  );
}

/* Années scolaires enseignées — racine de l'onglet "Niveaux", même hiérarchie que côté
   gestionnaire (Année → Niveaux → ...) pour rester cohérent dans toute l'app. */
function TeacherYearsScreen({ ctx }) {
  const teacher = findTeacher(ctx.data, ctx.currentUser.id);
  /* Inclut les années clôturées : l'enseignant peut toujours consulter (lecture seule) ce
     qu'il enseignait avant une promotion, et basculer librement entre les deux. */
  const yearGroups = getTeacherYearGroups(ctx.data, teacher.id, { includeArchivedYears: true });
  return (
    <Screen>
      <TopBar title="Mes années scolaires" subtitle={ctx.data.establishment.name} />
      <div className="px-4 pt-4 space-y-2">
        {yearGroups.length === 0 ? (
          <EmptyState icon={GraduationCap} title="Aucune classe assignée" text="Contactez votre gestionnaire d'école pour être affecté à une classe." />
        ) : yearGroups.map((y) => {
          const classCount = y.levels.reduce((sum, g) => sum + g.classes.length, 0);
          const noAssignment = y.levels.length === 0;
          return (
            <Card key={y.yearId} onClick={() => ctx.nav.push("teacherLevels", { yearId: y.yearId })} className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-[16px] flex items-center justify-center" style={{ background: y.yearArchived ? "#EEF1F4" : COLORS.primarySoft }}><Calendar size={20} color={y.yearArchived ? COLORS.muted : COLORS.primary} /></div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-[14px]" style={{ color: COLORS.text }}>{y.yearLabel}</p>
                  {y.yearArchived ? <Badge tone="neutral">Archivée</Badge> : <Badge tone="primary">En cours</Badge>}
                </div>
                <p className="text-[11px]" style={{ color: COLORS.muted }}>
                  {noAssignment ? "Pas encore de matière assignée par le gestionnaire" : `${y.levels.length} niveau(x) · ${classCount} classe(s)`}
                  {y.yearArchived ? " · lecture seule" : ""}
                </p>
              </div>
              <ChevronRight size={18} color={COLORS.muted}/>
            </Card>
          );
        })}
      </div>
    </Screen>
  );
}

/* Niveaux enseignés dans une année précise (active ou archivée). */
function TeacherLevelsScreen({ ctx }) {
  const { yearId } = ctx.nav.current.params;
  const teacher = findTeacher(ctx.data, ctx.currentUser.id);
  const yr = ctx.data.years.find((y) => y.id === yearId);
  if (!yr) return null;
  const levelGroups = getTeacherLevelGroups(ctx.data, teacher.id, { includeArchivedYears: true }).filter((g) => g.yearId === yearId);
  return (
    <Screen>
      <TopBar title="Mes niveaux" subtitle={`${yr.label}${yr.archived ? " · lecture seule" : ""}`} onBack={() => ctx.nav.pop()} />
      <div className="px-4 pt-4 space-y-2">
        {levelGroups.length === 0 ? (
          <EmptyState icon={Layers} title="Pas encore assigné" text={yr.archived ? "Aucune classe ne vous était assignée dans cette année." : "Le gestionnaire n'a pas encore configuré vos matières et classes pour cette année."} />
        ) : levelGroups.map((g) => (
          <Card key={g.level} onClick={() => ctx.nav.push("teacherLevelDetails", { yearId: g.yearId, level: g.level })} className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-[16px] flex items-center justify-center" style={{ background: yr.archived ? "#EEF1F4" : COLORS.primarySoft }}><Layers size={20} color={yr.archived ? COLORS.muted : COLORS.primary} /></div>
            <div className="flex-1"><p className="font-bold text-[14px]" style={{ color: COLORS.text }}>{g.level}</p><p className="text-[11px]" style={{ color: COLORS.muted }}>{g.classes.length} classe(s) · {g.subjects.length} matière(s)</p></div>
            <ChevronRight size={18} color={COLORS.muted}/>
          </Card>
        ))}
      </div>
    </Screen>
  );
}

/* Détail d'un niveau côté enseignant : deux axes bien séparés, chacun sa propre porte
   d'entrée — "Préparer mon programme" (cours, compétences, questionnaires ; partagés entre
   toutes les sections du niveau, à faire une seule fois) et "Voir mes classes" (lancer une
   évaluation / résultats, propre à chaque section avec ses élèves réels). */
function TeacherLevelDetailsScreen({ ctx }) {
  const { yearId, level } = ctx.nav.current.params;
  const teacher = findTeacher(ctx.data, ctx.currentUser.id);
  const yr = ctx.data.years.find((y) => y.id === yearId);
  if (!yr) return null;
  const group = getTeacherLevelGroups(ctx.data, teacher.id, { includeArchivedYears: true }).find((g) => g.yearId === yearId && g.level === level);
  if (!group) return null;

  const items = [
    { key: "prepare", label: yr.archived ? "Voir mes évaluations" : "Préparer mes évaluations", icon: ClipboardList, sub: `Cours, compétences, questionnaires · ${group.subjects.length} matière(s)`, go: () => ctx.nav.push("teacherLevelSubjects", { yearId, level }) },
    { key: "classes", label: "Voir les résultats de mes classes", icon: GraduationCap, sub: `Résultats par classe · ${group.classes.length} classe(s)`, go: () => ctx.nav.push("teacherLevelClasses", { yearId, level }) },
  ];

  return (
    <Screen>
      <TopBar title={level} subtitle={`${group.yearLabel}${yr.archived ? " · lecture seule" : ""}`} onBack={() => ctx.nav.pop()} />
      <div className="px-4 pt-4 space-y-2">
        {items.map((it) => (
          <Card key={it.key} onClick={it.go} className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-[16px] flex items-center justify-center" style={{ background: COLORS.primarySoft }}><it.icon size={20} color={COLORS.primary} /></div>
            <div className="flex-1"><p className="font-bold text-[14px]" style={{ color: COLORS.text }}>{it.label}</p><p className="text-[12px]" style={{ color: COLORS.muted }}>{it.sub}</p></div>
            <ChevronRight size={18} color={COLORS.muted} />
          </Card>
        ))}
      </div>
    </Screen>
  );
}

/* "Préparer mes évaluations" — tout sur un seul écran : Matière → Cours → Questionnaires,
   chaque niveau se déplie sur place (flèche qui tourne), jamais de nouvel écran pour
   simplement consulter. Les compétences évaluées ne sont plus une entité séparée à naviguer :
   ce sont de simples étiquettes libres saisies à la création du questionnaire (facultatives,
   ajoutées une par une). Seuls ajouter un cours/un questionnaire, ou ouvrir un questionnaire
   pour le modifier, déclenchent une vraie action. Une matière n'a besoin que d'UNE classe
   "témoin" pour écrire dans ses questionnaires, puisque ce contenu est partagé par toutes les
   sections du niveau. */
function TeacherLevelSubjectsScreen({ ctx }) {
  const { yearId, level, subjectId: presetSubjectId } = ctx.nav.current.params;
  const teacher = findTeacher(ctx.data, ctx.currentUser.id);
  const yr = ctx.data.years.find((y) => y.id === yearId);
  const isIndependent = ctx.data.establishment?.accountType === "independent";
  const group = getTeacherLevelGroups(ctx.data, teacher.id, { includeArchivedYears: true }).find((g) => g.yearId === yearId && g.level === level);
  /* Compte indépendant : "Matières" et "Préparer mon programme" vivent sur le même écran —
     ajouter une matière ici doit marcher même avant qu'aucune classe n'existe, donc on lit
     directement les matières du niveau plutôt que les affectations (qui ne peuvent exister
     qu'une fois une classe créée). Pour un enseignant d'établissement, rien ne change : les
     matières sont gérées par le gestionnaire, on ne montre ici que celles déjà affectées. */
  if (!yr || (!isIndependent && !group)) return null;
  const readOnly = !!yr.archived;
  const subjects = isIndependent ? getLevelSubjects(yr, level) : group.subjects;
  const classes = isIndependent ? yr.classes.filter((c) => !c.archived && c.level === level) : group.classes;
  const yearLabel = isIndependent ? yr.label : group.yearLabel;
  const representativeClassFor = (subjectId) => classes.find((c) => (c.teacherBySubject || {})[subjectId] === teacher.id)?.id;

  const [openSubjectId, setOpenSubjectId] = useState(presetSubjectId || null);
  const [openCourseId, setOpenCourseId] = useState(null);
  const [addingCourseFor, setAddingCourseFor] = useState(null); // subjectId
  const [courseTitle, setCourseTitle] = useState("");
  const [addingSubject, setAddingSubject] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState(new Set());
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [addingQuestionnaireForCourse, setAddingQuestionnaireForCourse] = useState(null); // courseId
  const [newQTitle, setNewQTitle] = useState("");
  const [newQCount, setNewQCount] = useState("");
  const [newQCompetencyNames, setNewQCompetencyNames] = useState([]);
  const [newQCompetencyInput, setNewQCompetencyInput] = useState("");

  const addSubjects = () => {
    const selfId = ctx.data.admin.selfTeacherId;
    const newSubjects = [...selectedSubjects].map((name) => ({ id: uid("s"), name, archived: false, courses: [], questionnaires: [] }));
    ctx.setData((d) => {
      let next = updateLevel(d, yearId, level, (lv) => ({ ...lv, subjects: [...lv.subjects, ...newSubjects] }));
      const targetClassIds = next.years.find((y) => y.id === yearId).classes.filter((c) => !c.archived && c.level === level).map((c) => c.id);
      targetClassIds.forEach((cid) => {
        next = updateClass(next, cid, (c) => ({ ...c, teacherBySubject: { ...c.teacherBySubject, ...Object.fromEntries(newSubjects.map((s) => [s.id, selfId])) } }));
      });
      return next;
    });
    ctx.showToast(newSubjects.length > 1 ? `${newSubjects.length} matières ajoutées` : "Matière ajoutée");
    setSelectedSubjects(new Set()); setAddingSubject(false);
  };
  const deleteSubject = (id) => {
    ctx.setData((d) => {
      const withLevel = updateLevel(d, yearId, level, (lv) => ({ ...lv, subjects: lv.subjects.filter((s) => s.id !== id) }));
      return { ...withLevel, years: withLevel.years.map((y) => (y.id !== yearId ? y : { ...y, classes: y.classes.map((c) => (c.level !== level ? c : { ...c, teacherBySubject: Object.fromEntries(Object.entries(c.teacherBySubject || {}).filter(([sid]) => sid !== id)) })) })) };
    });
    setConfirmDeleteId(null);
    ctx.showToast("Matière supprimée");
  };

  const addCourse = (subjectId) => {
    if (!courseTitle.trim()) return;
    const course = { id: uid("co"), title: courseTitle.trim(), description: "", competencies: [] };
    ctx.setData((d) => updateLevel(d, yearId, level, (lv) => ({ ...lv, subjects: lv.subjects.map((s) => (s.id === subjectId ? { ...s, courses: [...(s.courses || []), course] } : s)) })));
    setCourseTitle(""); setAddingCourseFor(null); setOpenCourseId(course.id); ctx.showToast("Cours ajouté");
  };
  const resetQuestionnaireForm = () => {
    setAddingQuestionnaireForCourse(null); setNewQTitle(""); setNewQCount(""); setNewQCompetencyNames([]); setNewQCompetencyInput("");
  };
  const addCompetencyChip = () => {
    if (!newQCompetencyInput.trim()) return;
    setNewQCompetencyNames((arr) => [...arr, newQCompetencyInput.trim()]);
    setNewQCompetencyInput("");
  };

  /* Questionnaire créé directement sous son cours — les compétences évaluées sont de simples
     étiquettes libres saisies une par une (facultatives, aucune vraie entité Compétence à
     gérer séparément). Le nombre de questions n'est qu'un objectif affiché — le questionnaire
     démarre vide, les questions s'ajoutent ensuite une par une comme d'habitude. */
  const addCourseQuestionnaire = (subjectId, courseId) => {
    const count = parseInt(newQCount, 10);
    if (!newQTitle.trim() || !count || count < 1) return;
    const newId = uid("qz");
    ctx.setData((d) => updateLevel(d, yearId, level, (lv) => ({ ...lv, subjects: lv.subjects.map((s) => (s.id === subjectId ? { ...s, questionnaires: [...s.questionnaires, { id: newId, title: newQTitle.trim(), description: "", courseId, competencyNames: [...newQCompetencyNames], targetQuestionCount: count, archived: false, questions: [] }] } : s)) })));
    const classId = representativeClassFor(subjectId);
    resetQuestionnaireForm();
    ctx.showToast("Questionnaire créé");
    if (classId) ctx.nav.push("createQuestion", { classId, subjectId, questionnaireId: newId });
  };

  return (
    <Screen>
      <TopBar title={isIndependent ? "Matières et programme" : "Préparer mes évaluations"} subtitle={`${level} · ${yearLabel}`} onBack={() => ctx.nav.pop()} />
      <div className="px-4 pt-4 space-y-2">
        {isIndependent && !readOnly && (
          addingSubject ? (
            <Card className="important-form-modal mb-3">
              <p className="text-[12px] mb-2" style={{ color: COLORS.muted }}>Cochez les matières à ajouter au niveau « {level} ».</p>
              <SubjectPicker catalog={ctx.data.subjectCatalog} selected={selectedSubjects} onToggle={(name) => setSelectedSubjects((prev) => { const n = new Set(prev); n.has(name) ? n.delete(name) : n.add(name); return n; })} onAddCustom={(name) => { ctx.setData((d) => (d.subjectCatalog.includes(name) ? d : { ...d, subjectCatalog: [...d.subjectCatalog, name] })); setSelectedSubjects((prev) => new Set(prev).add(name)); }} excluded={subjects.filter((s) => !s.archived).map((s) => s.name)} />
              <div className="flex gap-2 mt-3">
                <Btn variant="ghost" full onClick={() => { setAddingSubject(false); setSelectedSubjects(new Set()); }}>Annuler</Btn>
                <Btn full disabled={selectedSubjects.size === 0} onClick={addSubjects}>Ajouter ({selectedSubjects.size})</Btn>
              </div>
            </Card>
          ) : <Btn full icon={Plus} onClick={() => setAddingSubject(true)}>Ajouter une matière</Btn>
        )}
        <p className="text-[11px] -mt-1 mb-1" style={{ color: COLORS.muted }}>Partagé entre les {classes.length} section{classes.length > 1 ? "s" : ""} de ce niveau.</p>
        {subjects.filter((s) => !s.archived).map((s) => {
          const subjOpen = openSubjectId === s.id;
          const classId = representativeClassFor(s.id);
          const courses = s.courses || [];
          const canDeleteSubject = s.questionnaires.length === 0;
          return (
            <Card key={s.id} className="!p-0 overflow-hidden">
              <div className="w-full flex items-center gap-3 p-4">
                <button onClick={() => setOpenSubjectId(subjOpen ? null : s.id)} className="flex-1 min-w-0 flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-[16px] flex items-center justify-center shrink-0" style={{ background: COLORS.primarySoft }}><BookOpen size={18} color={COLORS.primary} /></div>
                  <div className="flex-1 min-w-0"><p className="font-bold text-[14px]" style={{ color: COLORS.text }}>{s.name}</p><p className="text-[12px]" style={{ color: COLORS.muted }}>{courses.length} cours</p></div>
                </button>
                {isIndependent && !readOnly && <button onClick={() => setConfirmDeleteId(s.id)} disabled={!canDeleteSubject} className="p-1.5 shrink-0" style={{ opacity: canDeleteSubject ? 1 : 0.3 }}><Trash2 size={18} color={COLORS.danger} /></button>}
                <button onClick={() => setOpenSubjectId(subjOpen ? null : s.id)} className="shrink-0">{subjOpen ? <ChevronDown size={18} color={COLORS.primary} /> : <ChevronRight size={18} color={COLORS.muted} />}</button>
              </div>
              {subjOpen && (
                <div className="px-3 pb-3 space-y-2" style={{ borderTop: `1px solid ${COLORS.border}`, background: "#FBFBFD" }}>
                  {courses.length === 0 && <p className="text-[11px] px-1 pt-2" style={{ color: COLORS.muted }}>Ajoutez un cours pour commencer à y créer des questionnaires.</p>}
                  {courses.map((course, i) => {
                    const courseOpen = openCourseId === course.id;
                    const courseQuestionnaires = s.questionnaires.filter((q) => !q.archived && q.courseId === course.id);
                    return (
                      <div key={course.id} className="relative mt-2">
                        {i < courses.length - 1 && <div className="absolute" style={{ left: 19, top: 44, bottom: -8, width: 2, background: "#e4e7f1", zIndex: 0 }} />}
                        <div className="relative rounded-[16px] overflow-hidden" style={{ background: "#fff", border: `1px solid ${COLORS.border}`, borderLeft: `3px solid ${COLORS.primary}` }}>
                          <button onClick={() => setOpenCourseId(courseOpen ? null : course.id)} className="w-full flex items-center gap-2.5 p-3 text-left">
                            <div className="course-number shrink-0">{String(i + 1).padStart(2, "0")}</div>
                            <div className="flex-1 min-w-0">
                              <p className="font-extrabold text-[13px]" style={{ color: COLORS.text }}>{course.title}</p>
                              <p className="text-[11px] flex items-center gap-1 mt-0.5" style={{ color: COLORS.muted }}><ListChecks size={10} />{courseQuestionnaires.length} questionnaire(s)</p>
                            </div>
                            {courseOpen ? <ChevronDown size={18} color={COLORS.primary} className="shrink-0" /> : <ChevronRight size={18} color={COLORS.muted} className="shrink-0" />}
                          </button>
                          {courseOpen && (
                            <div className="px-2.5 pb-2.5 space-y-1.5">
                              {courseQuestionnaires.map((q) => {
                                const skills = getQuestionnaireSkillLabels(s, q);
                                return (
                                  <button key={q.id} onClick={() => classId && ctx.nav.push("createQuestionnaire", { classId, subjectId: s.id, questionnaireId: q.id, courseId: course.id })} className="w-full flex items-center gap-2 py-2 px-2.5 rounded-[10px] text-left" style={{ background: "#F7F8FA" }}>
                                    <div className="shrink-0 rounded-full flex items-center justify-center" style={{ width: 22, height: 22, background: COLORS.accentSoft }}><ListChecks size={11} color={COLORS.accent} /></div>
                                    <div className="flex-1 min-w-0">
                                      <span className="text-[11px] block truncate" style={{ color: COLORS.text }}>{q.title} · {q.questions.length}{q.targetQuestionCount ? `/${q.targetQuestionCount}` : ""} question(s)</span>
                                      {skills.length > 0 && <span className="text-[10px] block truncate" style={{ color: COLORS.muted }}>{skills.join(", ")}</span>}
                                    </div>
                                    <Pencil size={13} color={COLORS.muted} className="shrink-0" />
                                  </button>
                                );
                              })}
                              {courseQuestionnaires.length === 0 && <p className="text-[11px] px-1" style={{ color: COLORS.muted }}>Aucun questionnaire pour l'instant.</p>}
                              {!readOnly && <AddRow tone="accent" label="Ajouter un questionnaire" onClick={() => setAddingQuestionnaireForCourse(course.id)} />}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {/* Le formulaire (.important-form-modal) doit rester HORS de tout conteneur
                     position:relative/overflow:hidden (comme les cartes de cours ci-dessus) —
                     sinon il s'y positionne et s'y découpe au lieu de s'ancrer à tout l'écran. */}
                  {!readOnly && addingQuestionnaireForCourse && (
                    <Card className="important-form-modal">
                      <Field label="Nom du questionnaire"><TextInput autoFocus value={newQTitle} onChange={(e) => setNewQTitle(e.target.value)} placeholder="Ex. Les fractions" /></Field>
                      <Field label="Nombre de questions"><TextInput type="number" min="1" value={newQCount} onChange={(e) => setNewQCount(e.target.value)} placeholder="Ex. 8" /></Field>
                      <Field label="Compétences évaluées (facultatif)">
                        <div className="flex items-center gap-1.5">
                          <TextInput value={newQCompetencyInput} onChange={(e) => setNewQCompetencyInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addCompetencyChip()} placeholder="Ex. Résoudre un problème" />
                          <button onClick={addCompetencyChip} disabled={!newQCompetencyInput.trim()} className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: newQCompetencyInput.trim() ? COLORS.primary : "#E4E7F0" }}><Plus size={18} color="#fff" /></button>
                        </div>
                        {newQCompetencyNames.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {newQCompetencyNames.map((name, idx) => (
                              <span key={idx} className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-full text-[11px] font-semibold" style={{ background: COLORS.successSoft, color: COLORS.success }}>
                                {name}
                                <button onClick={() => setNewQCompetencyNames((arr) => arr.filter((_, j) => j !== idx))} className="p-0.5"><X size={11} /></button>
                              </span>
                            ))}
                          </div>
                        )}
                      </Field>
                      <div className="flex gap-2 mt-1">
                        <Btn variant="ghost" full onClick={resetQuestionnaireForm}>Annuler</Btn>
                        <Btn full disabled={!newQTitle.trim() || !(parseInt(newQCount, 10) > 0)} onClick={() => addCourseQuestionnaire(s.id, addingQuestionnaireForCourse)}>Créer le questionnaire</Btn>
                      </div>
                    </Card>
                  )}
                  {!readOnly && (addingCourseFor === s.id ? (
                    <div className="flex items-center gap-1.5 pt-1">
                      <TextInput autoFocus value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addCourse(s.id)} placeholder="Nom du cours ou chapitre" style={{ minHeight: 38, fontSize: 12.5, padding: "9px 12px" }} />
                      <button onClick={() => addCourse(s.id)} disabled={!courseTitle.trim()} className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: courseTitle.trim() ? COLORS.primary : "#E4E7F0" }}><Check size={18} color="#fff" /></button>
                      <button onClick={() => { setAddingCourseFor(null); setCourseTitle(""); }} className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "#F2F4F7" }}><X size={18} color={COLORS.muted} /></button>
                    </div>
                  ) : (
                    <AddRow tone="primary" label="Ajouter un cours" onClick={() => setAddingCourseFor(s.id)} />
                  ))}
                </div>
              )}
            </Card>
          );
        })}
        {subjects.length === 0 && <EmptyState icon={BookOpen} title="Aucune matière" text={isIndependent ? "Ajoutez votre première matière pour commencer le programme." : "Aucune matière ne vous est assignée à ce niveau."} />}
      </div>
      {isIndependent && <ConfirmModal open={!!confirmDeleteId} title="Supprimer cette matière ?" text="Cette action retire la matière du niveau. Possible uniquement si aucun questionnaire n'y est rattaché." onCancel={() => setConfirmDeleteId(null)} onConfirm={() => deleteSubject(confirmDeleteId)} confirmLabel="Supprimer" danger />}
    </Screen>
  );
}

/* "Voir mes classes" — sections de ce niveau, pour lancer une évaluation ou consulter des
   résultats propres à chaque classe réelle. */
function TeacherLevelClassesScreen({ ctx }) {
  const { yearId, level } = ctx.nav.current.params;
  const teacher = findTeacher(ctx.data, ctx.currentUser.id);
  const yr = ctx.data.years.find((y) => y.id === yearId);
  const isIndependent = ctx.data.establishment?.accountType === "independent";
  const group = getTeacherLevelGroups(ctx.data, teacher.id, { includeArchivedYears: true }).find((g) => g.yearId === yearId && g.level === level);
  /* Compte indépendant : peut atteindre cet écran avant même d'avoir créé une classe (aucune
     affectation n'existe encore) — on retombe alors sur les classes du niveau directement,
     pour afficher un état vide clair plutôt qu'un écran blanc. */
  if (!yr || (!isIndependent && !group)) return null;
  const readOnly = !!yr.archived;
  const classes = group ? group.classes : yr.classes.filter((c) => !c.archived && c.level === level);
  const subjects = group ? group.subjects : getLevelSubjects(yr, level);
  const yearLabel = group ? group.yearLabel : yr.label;

  return (
    <Screen>
      <TopBar title="Résultats de mes classes" subtitle={`${level} · ${yearLabel}${readOnly ? " · lecture seule" : ""}`} onBack={() => ctx.nav.pop()} />
      <div className="px-4 pt-4 space-y-2">
        {classes.length === 0 && <EmptyState icon={GraduationCap} title="Aucune classe" text="Créez une classe pour ce niveau pour commencer à évaluer." />}
        {classes.map((c) => {
          /* Lancer une évaluation ne se fait plus depuis cet écran (uniquement résultats) — ça
             reste le rôle exclusif de l'onglet "Évaluer", pour ne pas dupliquer l'action. Si la
             classe a plusieurs matières, on filtre par matière directement dans l'écran de
             résultats plutôt que de faire choisir une matière sur un écran séparé. */
          const mySubjects = subjects.filter((s) => (c.teacherBySubject || {})[s.id] === teacher.id);
          const courseProgress = getClassCourseProgress(ctx.data, c, mySubjects);
          return (
            <Card key={c.id} onClick={() => ctx.nav.push("evaluationsList", { classId: c.id, completedOnly: true })} className="flex flex-col gap-2.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[16px] flex items-center justify-center shrink-0" style={{ background: COLORS.accentSoft }}><GraduationCap size={18} color={COLORS.accent} /></div>
                <div className="flex-1 min-w-0"><p className="font-bold text-[14px]" style={{ color: COLORS.text }}>{c.name}</p><p className="text-[12px]" style={{ color: COLORS.muted }}>{mySubjects.length} matière(s) · {c.students.filter((st) => !st.archived).length} élève(s)</p></div>
                <ChevronRight size={18} color={COLORS.muted} className="shrink-0" />
              </div>
              {courseProgress.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {courseProgress.map((it) => (
                    <button
                      key={it.key}
                      onClick={it.done ? (e) => { e.stopPropagation(); ctx.nav.push("evaluationsList", { classId: c.id, subjectId: it.subjectId, completedOnly: true }); } : undefined}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold"
                      style={{ background: it.done ? COLORS.successSoft : "#F2F4F7", color: it.done ? COLORS.success : COLORS.muted, cursor: it.done ? "pointer" : "default" }}
                    >
                      {it.done ? <Check size={10} /> : <Clock size={10} />}
                      {it.title}
                    </button>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </Screen>
  );
}

/* Un seul écran pour "mes évaluations" ET "mes résultats" — l'historique complet (en cours,
   terminées) et le tableau de bord de résultats vivent au même endroit, plutôt que dans deux
   onglets séparés qui montraient en fait la même liste de séances sous deux filtres différents. */
function EvaluationsListScreen({ ctx }) {
  const teacher = findTeacher(ctx.data, ctx.currentUser.id);
  const scope = ctx.nav.current.params || {};
  const classScoped = !!scope.classId;
  const teacherSessions = ctx.data.sessions.filter((s) => s.teacherId === teacher.id);
  const allSessions = [...(classScoped ? teacherSessions.filter((s) => s.classId === scope.classId) : teacherSessions)].reverse();
  const scopedLoc = classScoped ? locateClass(ctx.data, scope.classId) : null;

  // Classes distinctes de l'enseignant, pour le filtre classe — uniquement dans l'onglet "Évaluer" (non scopé)
  const myClasses = [];
  if (!classScoped) {
    getTeacherAssignments(ctx.data, teacher.id).forEach(({ cls }) => { if (!myClasses.some((c) => c.id === cls.id)) myClasses.push(cls); });
  }
  const [classFilter, setClassFilterRaw] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState(() => {
    if (!scope.subjectId || !scopedLoc) return "all";
    const s = getLevelSubjects(scopedLoc.yr, scopedLoc.cls.level).find((x) => x.id === scope.subjectId);
    return s ? s.name : "all";
  });
  const setClassFilter = (id) => { setClassFilterRaw(id); setSubjectFilter("all"); };

  // Matières proposées au filtre : celles de la classe scopée (résultats d'une classe), ou
  // celles de la classe sélectionnée dans le filtre "Classe" côté onglet "Évaluer".
  const mySubjects = [];
  if (classScoped) {
    if (scopedLoc) getLevelSubjects(scopedLoc.yr, scopedLoc.cls.level).filter((s) => (scopedLoc.cls.teacherBySubject || {})[s.id] === teacher.id).forEach((s) => { if (!mySubjects.includes(s.name)) mySubjects.push(s.name); });
  } else {
    getTeacherAssignments(ctx.data, teacher.id).forEach(({ cls, subject }) => {
      if (classFilter !== "all" && cls.id !== classFilter) return;
      if (!mySubjects.includes(subject.name)) mySubjects.push(subject.name);
    });
  }
  const [filter, setFilter] = useState(scope.completedOnly ? "completed" : "all"); // all | inprogress | completed

  const classFiltered = classFilter === "all" ? allSessions : allSessions.filter((s) => s.classId === classFilter);
  const subjectFiltered = subjectFilter === "all" ? classFiltered : classFiltered.filter((s) => {
    const loc = locateClass(ctx.data, s.classId);
    const { subject } = loc ? findQuestionnaire(loc.yr, loc.cls, s.subjectId, s.questionnaireId) : {};
    return subject?.name === subjectFilter;
  });
  const sessions = subjectFiltered.filter((s) => filter === "all" ? true : filter === "inprogress" ? s.status !== "completed" : s.status === "completed");
  const counts = { all: subjectFiltered.length, inprogress: subjectFiltered.filter((s) => s.status !== "completed").length, completed: subjectFiltered.filter((s) => s.status === "completed").length };

  let dashboard = null;
  if (filter === "completed" && sessions.length > 0) {
    const averages = sessions.map((s) => computeResults(ctx, s.id).classAverage);
    const overallAvg = Math.round(averages.reduce((a, b) => a + b, 0) / averages.length);
    const bandCounts = RESULT_BANDS.map((b) => ({ ...b, value: 0 }));
    averages.forEach((avg) => { const idx = RESULT_BANDS.findIndex((b) => avg >= b.min); bandCounts[idx].value++; });
    dashboard = (
      <Card className="flex items-center gap-4">
        <DonutChart segments={bandCounts.map((b) => ({ value: b.value, color: b.color }))} />
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold" style={{ color: COLORS.muted }}>Moyenne générale</p>
          <p className="text-[28px] font-extrabold mb-2" style={{ color: overallAvg >= 50 ? COLORS.success : COLORS.danger }}>{overallAvg}%</p>
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
      <TopBar title={classScoped ? "Résultats" : "Mes évaluations"} subtitle={classScoped ? `${scopedLoc?.cls.name}${subjectFilter !== "all" ? " · " + subjectFilter : ""}` : undefined} onBack={classScoped ? () => ctx.nav.pop() : undefined} right={<SyncIndicator ctx={ctx} />} />
      <div className="px-4 pt-4 space-y-2">
        {!classScoped && <Btn full variant="success" icon={PlayCircle} onClick={() => ctx.nav.push("evalPrep", {})}>Lancer une évaluation</Btn>}

        {!classScoped && (myClasses.length > 1 || mySubjects.length > 1) && (
          <div className="mobile-filter-panel">
            <div className="filter-heading"><SlidersHorizontal size={18}/><span>Affiner la liste</span><Badge tone="primary">{sessions.length}</Badge></div>
            <div className="grid grid-cols-2 gap-2">
              <label><span>Classe</span><select value={classFilter} onChange={(e) => setClassFilter(e.target.value)}><option value="all">Toutes</option>{myClasses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
              <label><span>Matière</span><select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)}><option value="all">Toutes</option>{mySubjects.map((name) => <option key={name} value={name}>{name}</option>)}</select></label>
            </div>
          </div>
        )}

        {classScoped && mySubjects.length > 1 && (
          <div className="mobile-filter-panel">
            <div className="filter-heading"><SlidersHorizontal size={18}/><span>Filtrer par matière</span><Badge tone="primary">{sessions.length}</Badge></div>
            <label><span>Matière</span><select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)}><option value="all">Toutes</option>{mySubjects.map((name) => <option key={name} value={name}>{name}</option>)}</select></label>
          </div>
        )}

        {!classScoped && (
          <div className="mobile-segmented flex p-1">
            {[{ key: "all", label: `Toutes (${counts.all})` }, { key: "inprogress", label: `En cours (${counts.inprogress})` }, { key: "completed", label: `Résultats (${counts.completed})` }].map((f) => (
              <button key={f.key} onClick={() => setFilter(f.key)} className={filter === f.key ? "active" : ""}>{f.label}</button>
            ))}
          </div>
        )}

        {!classScoped && dashboard}

        {sessions.length === 0 ? (
          <EmptyState icon={filter === "completed" ? BarChart3 : ClipboardList} title={filter === "completed" ? "Aucun résultat pour l'instant" : "Aucune évaluation"} text={filter === "completed" ? "Les résultats apparaissent ici une fois une évaluation terminée." : "Lancez votre première évaluation depuis le bouton ci-dessus."} />
        ) : sessions.map((s) => {
          const loc = locateClass(ctx.data, s.classId);
          const cls = loc?.cls;
          const { subject, questionnaire } = loc ? findQuestionnaire(loc.yr, loc.cls, s.subjectId, s.questionnaireId) : {};
          const avg = s.status === "completed" ? computeResults(ctx, s.id).classAverage : null;
          return (
            <Card key={s.id} onClick={() => s.status === "completed" ? ctx.nav.push("sessionResultsGlobal", { sessionId: s.id }) : ctx.nav.push("sessionQuestion", { sessionId: s.id, index: s.currentQuestionIndex || 0 })} className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-[13px] truncate" style={{ color: COLORS.text }}>{questionnaire?.title}</p>
                <p className="text-[12px] truncate" style={{ color: COLORS.muted }}>{classScoped ? `${subject?.name} · ${s.date}` : `${cls?.name} · ${subject?.name} · ${s.date}`}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {avg !== null && <Badge tone={avg >= 50 ? "success" : "danger"}>Moy. {avg}%</Badge>}
                {filter !== "completed" && <Badge tone={s.status === "completed" ? "success" : "warning"}>{s.status === "completed" ? "Terminée" : "En cours"}</Badge>}
              </div>
            </Card>
          );
        })}
      </div>
    </Screen>
  );
}

function CreateQuestionnaireScreen({ ctx }) {
  const { classId, subjectId, questionnaireId, courseId, competencyId } = ctx.nav.current.params;
  const loc = locateClass(ctx.data, classId);
  if (!loc) return null;
  const { yr, cls } = loc;
  const subject = getLevelSubjects(yr, cls.level).find((s) => s.id === subjectId);
  const found = questionnaireId ? findQuestionnaire(yr, cls, subjectId, questionnaireId) : null;
  const existing = found?.questionnaire || null;
  const isOverride = found?.isOverride || false;
  const linkedCourse = (subject.courses || []).find((c) => c.id === (courseId || existing?.courseId));
  const linkedCompetency = linkedCourse?.competencies.find((c) => c.id === competencyId || (existing?.competencyIds || []).includes(c.id));
  const locked = existing ? questionnaireHasSessions(ctx.data, existing.id) : false;
  const siblingCount = yr.classes.filter((c) => !c.archived && c.level === cls.level && c.id !== cls.id).length;

  const [title, setTitle] = useState(existing?.title || "");
  const [description, setDescription] = useState(existing?.description || "");
  const [competencyNames, setCompetencyNames] = useState(existing?.competencyNames || []);
  const [competencyInput, setCompetencyInput] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmDeleteQ, setConfirmDeleteQ] = useState(null);
  const qId = existing?.id || null;
  const addCompetencyName = () => {
    if (!competencyInput.trim()) return;
    setCompetencyNames((arr) => [...arr, competencyInput.trim()]);
    setCompetencyInput("");
  };

  /* Un questionnaire se crée toujours partagé au niveau et le reste pour toujours — simple,
     une seule version, la même pour toutes les sections du niveau. Modifiable librement tant
     qu'aucune évaluation ne l'a utilisé ; verrouillé (questions figées) dès la première
     utilisation, sans exception (pas de copie/duplication pour contourner le verrou). */
  const save = () => {
    if (!title.trim()) return;
    if (qId) {
      if (isOverride) {
        ctx.setData((d) => updateClass(d, classId, (c) => ({ ...c, questionnaireOverrides: (c.questionnaireOverrides || []).map((q) => (q.id === qId ? { ...q, title, description, competencyNames } : q)) })));
      } else {
        ctx.setData((d) => updateLevel(d, yr.id, cls.level, (lv) => ({ ...lv, subjects: lv.subjects.map((s) => (s.id === subjectId ? { ...s, questionnaires: s.questionnaires.map((q) => (q.id === qId ? { ...q, title, description, competencyNames } : q)) } : s)) })));
      }
      ctx.nav.pop();
    } else {
      const newId = uid("qz");
      ctx.setData((d) => updateLevel(d, yr.id, cls.level, (lv) => ({ ...lv, subjects: lv.subjects.map((s) => (s.id === subjectId ? { ...s, questionnaires: [...s.questionnaires, { id: newId, title, description, courseId: courseId || null, competencyNames, archived: false, questions: [] }] } : s)) })));
      ctx.nav.push("createQuestion", { classId, subjectId, questionnaireId: newId, courseId });
    }
  };
  const doDelete = () => {
    if (isOverride) {
      ctx.setData((d) => updateClass(d, classId, (c) => ({ ...c, questionnaireOverrides: (c.questionnaireOverrides || []).filter((q) => q.id !== qId) })));
    } else if (locked) {
      ctx.setData((d) => updateLevel(d, yr.id, cls.level, (lv) => ({ ...lv, subjects: lv.subjects.map((s) => (s.id === subjectId ? { ...s, questionnaires: s.questionnaires.map((q) => (q.id === qId ? { ...q, archived: true } : q)) } : s)) })));
    } else {
      ctx.setData((d) => updateLevel(d, yr.id, cls.level, (lv) => ({ ...lv, subjects: lv.subjects.map((s) => (s.id === subjectId ? { ...s, questionnaires: s.questionnaires.filter((q) => q.id !== qId) } : s)) })));
    }
    ctx.nav.pop();
  };
  const deleteQuestion = (questionId) => {
    if (isOverride) {
      ctx.setData((d) => updateClass(d, classId, (c) => ({ ...c, questionnaireOverrides: (c.questionnaireOverrides || []).map((q) => (q.id === qId ? { ...q, questions: q.questions.filter((qu) => qu.id !== questionId) } : q)) })));
    } else {
      ctx.setData((d) => updateLevel(d, yr.id, cls.level, (lv) => ({ ...lv, subjects: lv.subjects.map((s) => (s.id === subjectId ? { ...s, questionnaires: s.questionnaires.map((q) => (q.id === qId ? { ...q, questions: q.questions.filter((qu) => qu.id !== questionId) } : q)) } : s)) })));
    }
    setConfirmDeleteQ(null);
  };

  return (
    <Screen>
      <TopBar title={qId ? "Modifier le questionnaire" : "Nouveau questionnaire"} subtitle={subject.name} onBack={() => ctx.nav.pop()} />
      <div className="important-form-modal px-4 pt-4">
        {isOverride ? (
          <Card className="mb-4 flex items-start gap-3" style={{ background: COLORS.accentSoft, border: "none" }}>
            <Copy size={18} color={COLORS.accent} className="shrink-0 mt-0.5" />
            <p className="text-[12px] leading-5" style={{ color: COLORS.accentDark }}>Copie propre à « {cls.name} » — vos modifications n'affectent ni le modèle partagé du niveau, ni les autres sections.</p>
          </Card>
        ) : existing && siblingCount > 0 && !locked && (
          <Card className="mb-4 flex items-start gap-3" style={{ background: COLORS.primarySoft, border: "none" }}>
            <Info size={18} color={COLORS.primary} className="shrink-0 mt-0.5" />
            <p className="text-[12px] leading-5" style={{ color: COLORS.primaryDark }}>Questionnaire partagé avec {siblingCount} autre(s) section(s) de « {cls.level} ». Le modifier ici les modifie aussi là-bas.</p>
          </Card>
        )}
        <Field label="Titre du questionnaire"><TextInput autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex. Les fractions" /></Field>
        <Field label="Matière"><TextInput disabled value={subject.name} style={{ color: COLORS.muted, background: "#F2F4F7" }} /></Field>
        {linkedCourse && <Field label="Cours"><TextInput disabled value={linkedCourse.title} style={{ color: COLORS.muted, background: "#F2F4F7" }} /></Field>}
        {linkedCompetency ? (
          <Field label="Compétence évaluée"><TextInput disabled value={linkedCompetency.title} style={{ color: COLORS.success, background: COLORS.successSoft }} /></Field>
        ) : (
          <Field label="Compétences évaluées (facultatif)">
            <div className="flex items-center gap-1.5">
              <TextInput value={competencyInput} onChange={(e) => setCompetencyInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addCompetencyName()} placeholder="Ex. Résoudre un problème" />
              <button onClick={addCompetencyName} disabled={!competencyInput.trim()} className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: competencyInput.trim() ? COLORS.primary : "#E4E7F0" }}><Plus size={18} color="#fff" /></button>
            </div>
            {competencyNames.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {competencyNames.map((name, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-full text-[11px] font-semibold" style={{ background: COLORS.successSoft, color: COLORS.success }}>
                    {name}
                    <button onClick={() => setCompetencyNames((arr) => arr.filter((_, j) => j !== idx))} className="p-0.5"><X size={11} /></button>
                  </span>
                ))}
              </div>
            )}
          </Field>
        )}
        <Field label="Description (facultative)"><TextArea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ex. Notions de base sur les fractions" /></Field>

        {locked && (
          <Card className="mb-3 flex items-center gap-2" style={{ background: COLORS.warningSoft, border: "none" }}>
            <Lock size={18} color={COLORS.warning} />
            <p className="text-[12px]" style={{ color: COLORS.warning }}>Déjà utilisé dans une évaluation — les questions ne peuvent plus être modifiées ni supprimées.</p>
          </Card>
        )}

        {existing && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="font-bold text-[13px]" style={{ color: COLORS.text }}>Questions ({existing.questions.length}{existing.targetQuestionCount ? `/${existing.targetQuestionCount}` : ""})</p>
              {!locked && (
                <AddRow tone="primary" full={false} label="Ajouter" onClick={() => ctx.nav.push("createQuestion", { classId, subjectId, questionnaireId: qId, courseId: courseId || existing?.courseId, competencyId })} />
              )}
            </div>
            {existing.questions.length === 0 ? (
              <p className="text-[12px]" style={{ color: COLORS.muted }}>Aucune question pour l'instant.</p>
            ) : (
              <div className="space-y-1.5">
                {existing.questions.map((q, i) => (
                  <Card key={q.id} className="!py-2.5 flex items-center justify-between">
                    <span className="text-[13px] truncate flex-1" style={{ color: COLORS.text }}>{i + 1}. {q.text}</span>
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
            )}
          </div>
        )}

        <div className="flex gap-2 mb-1">
          <Btn variant="ghost" full onClick={() => ctx.nav.pop()}>Annuler</Btn>
          <Btn full icon={Save} onClick={save} disabled={!title.trim()}>{qId ? "Enregistrer" : "Continuer"}</Btn>
        </div>
        {existing && (
          <button onClick={() => setConfirmDelete(true)} className="w-full text-center text-[12px] font-semibold py-2" style={{ color: locked ? COLORS.muted : COLORS.danger }}>
            {locked ? "Archiver ce questionnaire" : "Supprimer ce questionnaire"}
          </button>
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
  const { yr, cls } = loc;
  const found = findQuestionnaire(yr, cls, subjectId, questionnaireId);
  const questionnaire = found.questionnaire;
  const isOverride = found.isOverride;
  const editing = editQuestionId ? questionnaire.questions.find((q) => q.id === editQuestionId) : null;

  const [text, setText] = useState(editing?.text || "");
  const [choices, setChoices] = useState(editing?.choices || { A: "", B: "", C: "", D: "" });
  const [correct, setCorrect] = useState(editing?.correct || "A");
  const [count, setCount] = useState(questionnaire?.questions.length || 0);
  const canSave = text.trim() && choices.A.trim() && choices.B.trim() && choices.C.trim() && choices.D.trim();
  const target = questionnaire?.targetQuestionCount || 0;
  const remainingAfterThis = target ? Math.max(0, target - (count + 1)) : 0;
  const belowTarget = !editing && target > 0 && remainingAfterThis > 0;

  const applyToQuestionnaires = (updater) => {
    if (isOverride) {
      ctx.setData((d) => updateClass(d, classId, (c) => ({ ...c, questionnaireOverrides: (c.questionnaireOverrides || []).map((q) => (q.id === questionnaireId ? updater(q) : q)) })));
    } else {
      ctx.setData((d) => updateLevel(d, yr.id, cls.level, (lv) => ({ ...lv, subjects: lv.subjects.map((s) => (s.id === subjectId ? { ...s, questionnaires: s.questionnaires.map((q) => (q.id === questionnaireId ? updater(q) : q)) } : s)) })));
    }
  };
  const saveQuestion = (addAnother) => {
    if (!canSave) return;
    if (editing) {
      applyToQuestionnaires((q) => ({ ...q, questions: q.questions.map((qu) => (qu.id === editQuestionId ? { id: qu.id, text: text.trim(), choices: { ...choices }, correct } : qu)) }));
      ctx.nav.push("createQuestionnaire", { classId, subjectId, questionnaireId, courseId, competencyId });
      return;
    }
    const newQ = { id: uid("q"), text: text.trim(), choices: { ...choices }, correct };
    applyToQuestionnaires((q) => ({ ...q, questions: [...q.questions, newQ] }));
    setCount((n) => n + 1);
    if (addAnother) { setText(""); setChoices({ A: "", B: "", C: "", D: "" }); setCorrect("A"); }
    else ctx.nav.push("createQuestionnaire", { classId, subjectId, questionnaireId, courseId, competencyId });
  };

  return (
    <Screen>
      <TopBar title={editing ? "Modifier la question" : "Nouvelle question"} subtitle={`${questionnaire?.title} · Question ${editing ? "" : count + 1}`} onBack={() => ctx.nav.pop()} />
      <div className="important-form-modal px-4 pt-4">
        <Field label="Texte de la question"><TextArea rows={2} value={text} onChange={(e) => setText(e.target.value)} placeholder="Ex. Quelle fraction représente..." /></Field>
        {["A", "B", "C", "D"].map((k) => (
          <Field key={k} label={`Choix ${k}`}>
            <div className="flex items-center gap-2">
              <TextInput value={choices[k]} onChange={(e) => setChoices((c) => ({ ...c, [k]: e.target.value }))} placeholder={`Réponse ${k}`} />
              <button onClick={() => setCorrect(k)} className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center font-bold text-[12px]" style={{ background: correct === k ? COLORS.success : COLORS.border, color: correct === k ? "#fff" : COLORS.muted }} title="Marquer comme bonne réponse">
                {correct === k ? <Check size={18} /> : k}
              </button>
            </div>
          </Field>
        ))}
        <p className="text-[12px] mb-4" style={{ color: COLORS.muted }}>Touchez le rond à droite d'un choix pour définir la bonne réponse (actuellement : <b style={{ color: COLORS.success }}>{correct}</b>).</p>
        {!editing && target > 0 && (
          <p className="text-[12px] mb-3" style={{ color: belowTarget ? COLORS.warning : COLORS.success }}>
            {belowTarget ? `Encore ${remainingAfterThis} question(s) à ajouter avant de pouvoir terminer (objectif : ${target}).` : `Objectif de ${target} question(s) atteint — vous pouvez terminer.`}
          </p>
        )}
        {editing ? (
          <Btn full icon={Save} disabled={!canSave} onClick={() => saveQuestion(false)}>Enregistrer</Btn>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <Btn variant="ghost" icon={X} onClick={() => ctx.nav.pop()}>Annuler</Btn>
              <Btn variant="secondary" icon={Plus} disabled={!canSave} onClick={() => saveQuestion(true)}>Ajouter une autre</Btn>
            </div>
            <Btn full icon={Save} disabled={!canSave || belowTarget} onClick={() => saveQuestion(false)}>Enregistrer et terminer</Btn>
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
  const levelGroups = getTeacherLevelGroups(ctx.data, teacher.id);
  /* Arrivée depuis une classe/matière déjà connue (fiche d'affectation, résultats scopés) :
     on saute directement au choix du cours plutôt que de refaire poser des questions dont
     la réponse est déjà connue. Sinon, le flux suit la même hiérarchie que partout ailleurs
     dans l'app : niveau → classe → matière → cours → questionnaire. */
  const preset = ctx.nav.current.params || {};
  const presetLoc = preset.classId ? locateClass(ctx.data, preset.classId) : null;
  const initialStep = preset.classId && preset.subjectId && preset.courseId ? 4
    : preset.classId && preset.subjectId ? 3
    : preset.classId ? 2 : 0;
  const levelKey = (yearId, level) => `${yearId}|${level}`;

  const [level, setLevel] = useState(presetLoc ? levelKey(presetLoc.yr.id, presetLoc.cls.level) : "");
  const [classId, setClassId] = useState(preset.classId || "");
  const [subjectId, setSubjectId] = useState(preset.subjectId || "");
  const [courseId, setCourseId] = useState(preset.courseId || "");
  const [questionnaireId, setQuestionnaireId] = useState("");
  const [step, setStep] = useState(initialStep);
  /* Absents déclarés une seule fois, au lancement : l'absence est un fait de la séance, pas
     de la question. Avant cette correction, le panneau vivait dans l'écran de scan et était
     donc re-parcouru à chaque question. */
  const [absentIds, setAbsentIds] = useState(() => new Set());
  const [absentPanelOpen, setAbsentPanelOpen] = useState(false);
  const [absentSearch, setAbsentSearch] = useState("");

  const loc = classId ? locateClass(ctx.data, classId) : null;
  const cls = loc?.cls;
  const subject = loc ? getLevelSubjects(loc.yr, cls.level).find((s) => s.id === subjectId) : null;
  const course = (subject?.courses || []).find((c) => c.id === courseId);
  const questionnaire = subject?.questionnaires.find((q) => q.id === questionnaireId && !q.archived);
  const selectedGroup = levelGroups.find((g) => levelKey(g.yearId, g.level) === level);
  const classesOfLevel = selectedGroup?.classes || [];
  const mySubjects = assignments.filter(({ cls: assignedClass }) => assignedClass.id === classId);

  const levelCount = levelGroups.length;
  const classCount = classesOfLevel.length;
  const subjectCount = mySubjects.length;
  const courseCount = (subject?.courses || []).length;

  /* Une étape qui n'offre qu'un seul choix ne pose pas une question : elle impose sa réponse.
     On la franchit automatiquement — une enseignante de primaire avec une classe et une
     matière traversait six écrans dont quatre n'avaient qu'une seule carte à toucher.
     movingBackRef empêche le retour arrière d'être immédiatement réavancé par cet effet. */
  const movingBackRef = useRef(false);
  useEffect(() => {
    if (movingBackRef.current) { movingBackRef.current = false; return; }
    if (step === 0 && levelCount === 1) {
      const g = levelGroups[0];
      setLevel(levelKey(g.yearId, g.level)); setClassId(""); setSubjectId(""); setCourseId(""); setQuestionnaireId(""); setStep(1);
    } else if (step === 1 && classCount === 1) {
      setClassId(classesOfLevel[0].id); setSubjectId(""); setCourseId(""); setQuestionnaireId(""); setAbsentIds(new Set()); setStep(2);
    } else if (step === 2 && subjectCount === 1) {
      setSubjectId(mySubjects[0].subject.id); setCourseId(""); setQuestionnaireId(""); setStep(3);
    } else if (step === 3 && courseCount === 1) {
      setCourseId(subject.courses[0].id); setQuestionnaireId(""); setStep(4);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, levelCount, classCount, subjectCount, courseCount]);

  const start = () => {
    const sessionId = uid("sess");
    const participantSnapshot = cls.students.filter((s) => !s.archived).map((s) => ({ id: s.id, name: s.name, cardNumber: s.cardNumber, studentCode: s.studentCode }));
    ctx.setData((d) => ({ ...d, sessions: [...d.sessions, {
      id: sessionId, classId, subjectId, courseId, questionnaireId, teacherId: teacher.id,
      date: new Date().toLocaleDateString("fr-FR"), createdAt: Date.now(),
      questionIds: questionnaire.questions.map((q) => q.id), currentQuestionIndex: 0,
      participantSnapshot, answers: {}, questionStatus: {}, declaredAbsentIds: [...absentIds], status: "in_progress",
      scanMode: null, scanRowCount: null,
      syncStatus: "pending", lastSyncedAt: null,
    }] }));
    ctx.nav.push("sessionQuestion", { sessionId, index: 0 });
  };

  // Le retour arrière saute lui aussi les étapes à choix unique, sinon il y resterait bloqué.
  const stepChoiceCount = (s) => (s === 0 ? levelCount : s === 1 ? classCount : s === 2 ? subjectCount : s === 3 ? courseCount : 2);
  const goBack = () => {
    let s = step - 1;
    while (s >= initialStep && stepChoiceCount(s) <= 1) s--;
    if (s < initialStep) { ctx.nav.pop(); return; }
    movingBackRef.current = true;
    setStep(s);
  };

  let title = "Choisir le niveau", body = null;
  if (step === 0) {
    body = <div className="px-4">
      {levelGroups.map((g) => <OptionCard key={levelKey(g.yearId, g.level)} icon={Layers} title={g.level} subtitle={`${g.yearLabel} · ${g.classes.length} classe(s)`} selected={level === levelKey(g.yearId, g.level)} onClick={() => { setLevel(levelKey(g.yearId, g.level)); setClassId(""); setSubjectId(""); setCourseId(""); setQuestionnaireId(""); setStep(1); }} />)}
      {levelGroups.length === 0 && <EmptyState icon={Layers} title="Aucun niveau" text="Aucune classe ne vous est encore affectée." />}
    </div>;
  } else if (step === 1) {
    title = "Choisir la classe";
    body = <div className="px-4">
      {classesOfLevel.map((c) => <OptionCard key={c.id} icon={GraduationCap} title={c.name} subtitle={`${c.students.filter((s) => !s.archived).length} élèves`} selected={classId === c.id} onClick={() => { setClassId(c.id); setSubjectId(""); setCourseId(""); setQuestionnaireId(""); setAbsentIds(new Set()); setStep(2); }} />)}
    </div>;
  } else if (step === 2) {
    title = "Choisir la matière";
    body = <div className="px-4">
      {mySubjects.map(({ subject: s }) => <OptionCard key={s.id} icon={BookOpen} title={s.name} subtitle={`${(s.courses || []).length} cours`} selected={subjectId === s.id} onClick={() => { setSubjectId(s.id); setCourseId(""); setQuestionnaireId(""); setStep(3); }} />)}
    </div>;
  } else if (step === 3) {
    title = "Choisir le cours";
    const courses = subject?.courses || [];
    body = <div className="px-4">
      {courses.map((c) => { const count = subject.questionnaires.filter((q) => !q.archived && q.courseId === c.id).length; return <OptionCard key={c.id} icon={BookOpen} title={c.title} subtitle={`${count} questionnaire(s)`} selected={courseId === c.id} onClick={() => { setCourseId(c.id); setQuestionnaireId(""); setStep(4); }} />; })}
      {courses.length === 0 && <EmptyState icon={BookOpen} title="Aucun cours disponible" text="Ajoutez d'abord un cours dans cette matière." action={<Btn size="sm" icon={Plus} onClick={() => ctx.nav.push("teacherLevelSubjects", { yearId: loc.yr.id, level: loc.cls.level, subjectId })}>Ajouter un cours</Btn>} />}
    </div>;
  } else if (step === 4) {
    title = "Choisir le questionnaire";
    const sharedQs = subject?.questionnaires.filter((q) => !q.archived && q.courseId === courseId) || [];
    const myOverrides = (cls?.questionnaireOverrides || []).filter((o) => o.subjectId === subjectId && !o.archived && o.courseId === courseId);
    /* On montre toujours la version déjà utilisée par CETTE classe (l'adaptation si elle
       existe, sinon le modèle partagé) — et on laisse le choix explicite, une fois sélectionné,
       de le garder tel quel ou de l'adapter avant de commencer la séance. Les questionnaires
       créés directement pour cette classe (sans modèle partagé) s'ajoutent à la liste. */
    const displayQs = [
      ...sharedQs.map((q) => {
        const override = myOverrides.find((o) => o.sourceQuestionnaireId === q.id);
        return override ? { ...override, isOverride: true } : { ...q, isOverride: false };
      }),
      ...myOverrides.filter((o) => !o.sourceQuestionnaireId).map((o) => ({ ...o, isOverride: true })),
    ];
    const selectedQ = displayQs.find((q) => q.id === questionnaireId);
    body = <div className="px-4">
      {displayQs.map((q) => {
        const skills = getQuestionnaireSkillLabels(subject, q);
        const belowTarget = q.targetQuestionCount > 0 && q.questions.length < q.targetQuestionCount;
        return <OptionCard key={q.id} icon={q.isOverride ? Copy : ListChecks} title={q.title} subtitle={`${q.isOverride ? `Propre à ${cls.name} · ` : ""}${q.questions.length}${q.targetQuestionCount ? `/${q.targetQuestionCount}` : ""} question(s)${belowTarget ? " · incomplet" : ""}${skills.length ? ` · ${skills.join(", ")}` : ""}`} disabled={q.questions.length === 0 || belowTarget} selected={questionnaireId === q.id} onClick={() => setQuestionnaireId(q.id)} />;
      })}
      {displayQs.length === 0 && <EmptyState icon={ListChecks} title="Aucun questionnaire pour ce cours" text="Créez un questionnaire dans ce cours avant de lancer l'évaluation." action={<Btn size="sm" icon={Plus} onClick={() => ctx.nav.push("teacherLevelSubjects", { yearId: loc.yr.id, level: loc.cls.level, subjectId })}>Voir le programme</Btn>} />}
      {selectedQ && !selectedQ.isOverride && (
        <div className="mt-3 space-y-2">
          <p className="text-[11px] text-center" style={{ color: COLORS.muted }}>Partagé avec les autres sections de {cls.level}.</p>
          <Btn full variant="accent" icon={ArrowRight} onClick={() => setStep(5)}>Continuer</Btn>
          {!questionnaireHasSessions(ctx.data, selectedQ.id) && (
            <Btn full variant="ghost" icon={Pencil} onClick={() => ctx.nav.push("createQuestionnaire", { classId, subjectId, questionnaireId: selectedQ.id, courseId })}>Modifier ce questionnaire (toutes les sections)</Btn>
          )}
        </div>
      )}
      {selectedQ && selectedQ.isOverride && (
        <div className="mt-3">
          <Btn full variant="accent" icon={ArrowRight} onClick={() => setStep(5)}>Continuer</Btn>
        </div>
      )}
    </div>;
  } else if (step === 5) {
    title = "Résumé de l'évaluation";
    const skills = getQuestionnaireSkillLabels(subject, questionnaire);
    const roster = cls.students.filter((s) => !s.archived);
    const absentMatches = roster.filter((s) => s.name.toLowerCase().includes(absentSearch.toLowerCase()));
    const toggleAbsent = (id) => setAbsentIds((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
    body = <div className="px-4">
      <Card className="mb-3" style={{ background: COLORS.primarySoft, border: "none" }}>
        <p className="font-bold text-[13px] mb-2" style={{ color: COLORS.primaryDark }}>Résumé</p>
        <div className="space-y-2 text-[13px]" style={{ color: COLORS.primaryDark }}>
          <p className="flex items-center gap-2"><Layers size={18} className="shrink-0" />{cls.level}</p>
          <p className="flex items-center gap-2"><GraduationCap size={18} className="shrink-0" />{cls.name} ({roster.length} élèves{absentIds.size > 0 ? ` · ${roster.length - absentIds.size} attendus` : ""})</p>
          <p className="flex items-center gap-2"><BookOpen size={18} className="shrink-0" />{subject.name}{course ? ` · ${course.title}` : ""}</p>
          {skills.length > 0 && <p className="flex items-center gap-2"><Target size={18} className="shrink-0" />{skills.join(", ")}</p>}
          <p className="flex items-center gap-2"><ClipboardList size={18} className="shrink-0" />{questionnaire.title}</p>
          <p className="flex items-center gap-2"><ListChecks size={18} className="shrink-0" />{questionnaire.questions.length} questions</p>
        </div>
      </Card>

      {/* Appel des absents : une fois pour la séance entière, avant le premier scan. */}
      <Card className="mb-4 !py-3">
        <button className="w-full flex items-center justify-between" onClick={() => setAbsentPanelOpen((v) => !v)}>
          <span className="flex items-center gap-2 text-[13px] font-semibold" style={{ color: COLORS.text }}>
            <UserX size={18} color={COLORS.muted} /> Élèves absents aujourd'hui
            {absentIds.size > 0 && <Badge tone="warning">{absentIds.size}</Badge>}
          </span>
          <ChevronRight size={18} color={COLORS.muted} style={{ transform: absentPanelOpen ? "rotate(90deg)" : "none" }} />
        </button>
        {!absentPanelOpen && (
          <p className="text-[12px] mt-1.5" style={{ color: COLORS.muted }}>
            {absentIds.size === 0 ? "Aucun absent signalé. À déclarer une seule fois — valable pour toutes les questions." : `${absentIds.size} absent(s) — ils ne seront pas attendus au scan.`}
          </p>
        )}
        {absentPanelOpen && (
          <div className="mt-2.5">
            <SearchInput value={absentSearch} onChange={(e) => setAbsentSearch(e.target.value)} placeholder="Rechercher un élève" className="mb-2" />
            <div className="max-h-[220px] overflow-y-auto space-y-0.5">
              {absentMatches.map((s) => (
                <label key={s.id} className="flex items-center gap-2.5 py-1.5 text-[13px]" style={{ color: COLORS.text }}>
                  <input type="checkbox" checked={absentIds.has(s.id)} onChange={() => toggleAbsent(s.id)} />{s.name}
                </label>
              ))}
              {absentMatches.length === 0 && <p className="text-[12px] py-2 text-center" style={{ color: COLORS.muted }}>Aucun élève ne correspond.</p>}
            </div>
          </div>
        )}
      </Card>

      <Btn full variant="success" icon={PlayCircle} onClick={start}>Démarrer l'évaluation</Btn>
    </div>;
  }

  /* La barre de progression ne compte que les étapes réellement présentées : afficher « 5/6 »
     à quelqu'un qui n'a fait qu'un seul choix (parce que les quatre précédentes ont été
     franchies automatiquement) décrirait un parcours qui n'a pas eu lieu. */
  const ALL_STEP_LABELS = ["Choisir le niveau", "Choisir la classe", "Choisir la matière", "Choisir le cours", "Choisir le questionnaire", "Confirmer la séance"];
  const visibleSteps = [0, 1, 2, 3, 4, 5].filter((s) => s >= initialStep && stepChoiceCount(s) > 1);
  const visiblePos = Math.max(0, visibleSteps.indexOf(step));

  return (
    <Screen>
      <TopBar title={title} onBack={goBack} />
      <WizardProgress step={visiblePos} totalSteps={visibleSteps.length} labels={visibleSteps.map((s) => ALL_STEP_LABELS[s])} crumbs={[cls?.level, cls?.name, subject?.name, course?.title, questionnaire?.title].filter(Boolean)} helperText="Préparez la séance avant de lancer le scan" />
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
  const { questionnaire } = findQuestionnaire(loc.yr, loc.cls, session.subjectId, session.questionnaireId);
  const question = questionnaire.questions[index];
  const total = questionnaire.questions.length;
  return (
    <Screen>
      <TopBar title={`Question ${index + 1} / ${total}`} subtitle={`${loc.cls.name} · ${questionnaire.title}`} onBack={() => ctx.nav.pop()} />
      <div className="px-4 pt-4">
        <Card className="mb-4"><p className="font-bold text-[18px] leading-snug" style={{ color: COLORS.text }}>{question.text}</p></Card>
        <div className="space-y-2 mb-6">
          {["A", "B", "C", "D"].map((k) => (
            <div key={k} className="flex items-center gap-3 px-3 py-3 rounded-[16px]" style={{ background: "#F7F8FA" }}>
              <span className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-[13px] shrink-0" style={{ background: COLORS.primary, color: "#fff" }}>{k}</span>
              <span className="text-[14px]" style={{ color: COLORS.text }}>{question.choices[k]}</span>
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
  const { questionnaire } = findQuestionnaire(loc.yr, loc.cls, session.subjectId, session.questionnaireId);
  const question = questionnaire.questions[index];
  const students = session.participantSnapshot || loc.cls.students.filter((s) => !s.archived);
  const total = students.length;
  /* Le mode de scan et le découpage en rangées décrivent l'organisation de la CLASSE, pas
     d'une question : ils appartiennent à la séance et sont donc stockés sur la session. Sans
     ça, chaque question repart d'un composant neuf et redemande le même choix — dix fois pour
     un questionnaire de dix questions, devant les élèves. Le mode "individual" fait exception :
     scanner un seul élève est un geste ponctuel de correction, jamais mémorisé. */
  const [scanMode, setScanMode] = useState(() => session.scanMode || null); // "all" | "rows" | "individual"
  const [individualStudentId, setIndividualStudentId] = useState("");
  const [studentSearch, setStudentSearch] = useState("");
  const [rowCount, setRowCount] = useState(() => (session.scanRowCount ? String(session.scanRowCount) : ""));
  const [rowsConfigured, setRowsConfigured] = useState(() => !!session.scanRowCount);

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
    if (scanMode === "all") return [detectableStudents];
    if (scanMode === "individual") return [detectableStudents.filter((s) => s.id === individualStudentId)];
    if (scanMode === "rows" && rowsConfigured) {
      const count = Math.max(1, Math.min(parseInt(rowCount, 10) || 1, detectableStudents.length || 1));
      const perRow = Math.ceil(detectableStudents.length / count);
      return Array.from({ length: count }, (_, i) => detectableStudents.slice(i * perRow, (i + 1) * perRow)).filter((row) => row.length > 0);
    }
    if (scanMode === "rows") return [[]];
    const z = [];
    for (let i = 0; i < detectableStudents.length; i += ZONE_SIZE) z.push(detectableStudents.slice(i, i + ZONE_SIZE));
    return z.length ? z : [[]];
  }, [detectableStudents, scanMode, individualStudentId, rowCount, rowsConfigured]);

  const [zoneIndex, setZoneIndex] = useState(0);
  const currentZone = zones[Math.min(zoneIndex, zones.length - 1)] || [];
  const [detected, setDetected] = useState([]);
  const [lastFeed, setLastFeed] = useState([]);
  const [scanning, setScanning] = useState(false);
  const detectedIdsRef = useRef(new Set());

  useEffect(() => { setScanning(!!scanMode && currentZone.length > 0 && (scanMode !== "rows" || rowsConfigured)); }, [zoneIndex, scanMode, individualStudentId, rowsConfigured]);
  useEffect(() => {
    if (!scanning) return;
    const remainingInZone = currentZone.filter((s) => !detectedIdsRef.current.has(s.id));
    if (remainingInZone.length === 0) { setScanning(false); return; }
    const timer = setInterval(() => {
      setDetected((prev) => {
        const remaining = currentZone.filter((s) => !detectedIdsRef.current.has(s.id));
        if (remaining.length === 0) { setScanning(false); return prev; }
        const batchSize = scanMode === "all" ? 4 : scanMode === "individual" ? 1 : 2;
        const batch = remaining.slice(0, Math.min(batchSize, remaining.length));
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
  }, [scanning, currentZone, question.correct, scanMode]);

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
  const filteredStudents = detectableStudents.filter((s) => s.name.toLowerCase().includes(studentSearch.toLowerCase()));
  const resetScanState = () => {
    detectedIdsRef.current = new Set(); setDetected([]); setLastFeed([]); setZoneIndex(0);
    setIndividualStudentId(""); setRowCount(""); setRowsConfigured(false);
  };
  const chooseMode = (mode) => {
    resetScanState();
    setScanMode(mode);
    // "individual" ne redéfinit pas l'organisation de la séance : on garde le mode mémorisé.
    if (mode !== "individual") ctx.setData((d) => updateSession(d, sessionId, (s) => ({ ...s, scanMode: mode, scanRowCount: null })));
  };
  // Revenir au choix du mode en cours de séance, sans quitter le scan (action « Mode »).
  const changeMode = () => { resetScanState(); setScanMode(null); };

  if (!scanMode) return (
    <Screen>
      <TopBar title="Comment souhaitez-vous scanner ?" subtitle="Choix valable pour toute la séance" onBack={() => ctx.nav.pop()} />
      <div className="px-4 pt-4">
        <Card className="mb-4" style={{ background: COLORS.primarySoft, border: "none" }}><Badge tone="primary">Une seule fois</Badge><p className="text-[12px] mt-2" style={{ color: COLORS.primaryDark }}>Choisissez le mode adapté à l’organisation de votre classe. Il sera conservé pour toutes les questions de cette séance — vous pourrez en changer à tout moment depuis l’écran de scan.</p></Card>
        <OptionCard icon={Camera} title="Scanner toute la classe" subtitle="Détecter automatiquement plusieurs cartes en continu" onClick={() => chooseMode("all")} />
        <OptionCard icon={Users} title="Scanner par rangée" subtitle="Avancer groupe par groupe et repérer les absents" onClick={() => chooseMode("rows")} />
        <OptionCard icon={User} title="Scanner un élève" subtitle="Enregistrer ou remplacer une réponse individuellement" onClick={() => chooseMode("individual")} />
      </div>
    </Screen>
  );

  if (scanMode === "individual" && !individualStudentId) return (
    <Screen>
      <TopBar title="Scanner un élève" subtitle={`Question ${index + 1}`} onBack={changeMode} />
      <div className="px-4 pt-4">
        <SearchInput autoFocus value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)} placeholder="Rechercher un élève" className="mb-3" />
        <div className="space-y-2 max-h-[520px] overflow-y-auto">{filteredStudents.map((student) => <Card key={student.id} onClick={() => setIndividualStudentId(student.id)} className="flex items-center gap-3 !py-3"><div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: COLORS.primarySoft }}><User size={18} color={COLORS.primary} /></div><span className="text-[13px] font-semibold flex-1" style={{ color: COLORS.text }}>{student.name}</span><ChevronRight size={18} color={COLORS.muted} /></Card>)}</div>
      </div>
    </Screen>
  );

  if (scanMode === "rows" && !rowsConfigured) {
    const parsedRowCount = parseInt(rowCount, 10);
    const validRowCount = Number.isInteger(parsedRowCount) && parsedRowCount >= 1 && parsedRowCount <= Math.max(1, detectableStudents.length);
    return (
      <Screen>
        <TopBar title="Organiser le scan" subtitle="Mode par rangée · toute la séance" onBack={changeMode} />
        <div className="px-4 pt-5">
          <Card className="mb-4" style={{ background: COLORS.primarySoft, border: "none" }}><Users size={24} color={COLORS.primary} className="mb-2" /><p className="text-[14px] font-bold" style={{ color: COLORS.primaryDark }}>Combien de rangées voulez-vous scanner ?</p><p className="text-[12px] mt-1 leading-5" style={{ color: COLORS.muted }}>KAGAT répartira automatiquement les {detectableStudents.length} élèves présents entre les rangées. Ce découpage vaut pour toutes les questions de la séance.</p></Card>
          <Field label="Nombre de rangées"><TextInput autoFocus type="number" min="1" max={Math.max(1, detectableStudents.length)} value={rowCount} onChange={(e) => setRowCount(e.target.value)} placeholder="Ex. 4" /></Field>
          {validRowCount && <Card className="mb-4 !py-3"><p className="text-[12px]" style={{ color: COLORS.text }}><b>{parsedRowCount} rangée{parsedRowCount > 1 ? "s" : ""}</b> · environ {Math.ceil(detectableStudents.length / parsedRowCount)} élève(s) par rangée</p></Card>}
          <Btn full icon={Camera} disabled={!validRowCount} onClick={() => { setZoneIndex(0); setRowsConfigured(true); ctx.setData((d) => updateSession(d, sessionId, (s) => ({ ...s, scanRowCount: parsedRowCount }))); }}>Commencer par la rangée 1</Btn>
        </div>
      </Screen>
    );
  }

  const modeLabel = scanMode === "all" ? "Toute la classe" : scanMode === "rows" ? `Rangée ${zoneIndex + 1}/${zones.length}` : currentZone[0]?.name || "Un élève";
  const scanStatusText = scanning ? "Recherche des cartes-réponses…" : zoneDone ? (scanMode === "rows" ? "Rangée terminée" : "Scan terminé") : "Scan en pause";

  return (
    <Screen>
      {/* Retour = quitter le scan. Changer de mode est une action à part entière, pas un
          retour arrière : elle vit à droite de la barre, disponible sans quitter la séance. */}
      <TopBar title="Scan en cours" subtitle={`Question ${index + 1} · ${modeLabel}`} onBack={() => ctx.nav.pop()}
        right={<button onClick={changeMode} className="flex items-center gap-1 text-[12px] font-semibold px-2.5 py-1.5 rounded-[10px]" style={{ background: COLORS.primarySoft, color: COLORS.primary }}><SlidersHorizontal size={13} />Mode</button>} />
      <div className="px-4 pt-3">
        {scanMode === "rows" && zones.length > 1 && (
          <div className="flex gap-1.5 overflow-x-auto pb-1 mb-3 -mx-1 px-1">
            {zones.map((z, i) => {
              const done = z.every((s) => detectedIdsRef.current.has(s.id)) && z.length > 0;
              return (
                <button key={i} onClick={() => setZoneIndex(i)} className="shrink-0 px-3 py-1.5 rounded-full text-[12px] font-semibold flex items-center gap-1"
                  style={{ background: i === zoneIndex ? COLORS.primary : done ? COLORS.successSoft : COLORS.primarySoft, color: i === zoneIndex ? "#fff" : done ? COLORS.success : COLORS.primary }}>
                  {done && <CheckCircle2 size={12} />}Rangée {i + 1}
                </button>
              );
            })}
          </div>
        )}
        <Card className="mb-3 !py-2.5">
          <button className="w-full flex items-center justify-between" onClick={() => setAbsentPanelOpen((v) => !v)}>
            {/* Les absents ont déjà été déclarés au lancement de la séance : ce panneau n'est
                plus qu'un rattrapage pour les retardataires, d'où le libellé « Ajuster ». */}
            <span className="flex items-center gap-2 text-[13px] font-semibold" style={{ color: COLORS.text }}>
              <UserX size={18} color={COLORS.muted} /> Ajuster les absents
              <Badge tone="neutral">{declaredAbsentIds.length}</Badge>
            </span>
            <ChevronRight size={18} color={COLORS.muted} style={{ transform: absentPanelOpen ? "rotate(90deg)" : "none" }} />
          </button>
          {absentPanelOpen && (
            <div className="mt-2">
              <SearchInput value={absentSearch} onChange={(e) => setAbsentSearch(e.target.value)} placeholder="Rechercher un élève à signaler absent" className="mb-2" />
              <div className="max-h-[180px] overflow-y-auto space-y-1">
                {filteredAbsentList.slice(0, 30).map((s) => (
                  <label key={s.id} className="flex items-center gap-2 py-1 text-[13px]" style={{ color: COLORS.text }}>
                    <input type="checkbox" checked={declaredAbsentIds.includes(s.id)} onChange={() => toggleAbsent(s.id)} />{s.name}
                  </label>
                ))}
              </div>
            </div>
          )}
        </Card>
        <div className="rounded-[16px] mb-3 flex flex-col items-center justify-center py-8 relative overflow-hidden" style={{ background: "#0F1E33" }}>
          <div className="absolute inset-4 rounded-[16px]" style={{ border: "2px dashed rgba(255,255,255,0.25)" }} />
          <Camera size={28} color="rgba(255,255,255,0.6)" />
          <p className="text-[12px] mt-2" style={{ color: "rgba(255,255,255,0.7)" }}>{scanStatusText}</p>
          {scanning && <div className="flex gap-1 mt-2">{[0, 1, 2].map((i) => <span key={i} className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#fff", animationDelay: `${i * 150}ms` }} />)}</div>}
          {lastFeed.length > 0 && (
            <div className="w-full mt-3 px-4 space-y-1">
              {lastFeed.map((f, i) => (
                <div key={f.studentId + i} className="flex items-center justify-between text-[11px] px-2 py-1 rounded-[10px]" style={{ background: "rgba(255,255,255,0.08)", opacity: 1 - i * 0.18 }}>
                  <span style={{ color: "#fff" }}>{f.name}</span><span style={{ color: "#8FE3C7" }}>Réponse {f.choice}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <Card className="flex items-center justify-between mb-3" style={{ background: COLORS.primarySoft, border: "none" }}>
          <div>
            <p className="text-[12px] font-semibold" style={{ color: COLORS.primaryDark }}>Élèves détectés (total)</p>
            <p className="text-[28px] font-extrabold" style={{ color: COLORS.primary }}>{detected.length} <span className="text-[14px] font-semibold" style={{ color: COLORS.muted }}>/ {total}</span></p>
            {declaredAbsentIds.length > 0 && <p className="text-[11px]" style={{ color: COLORS.muted }}>dont {declaredAbsentIds.length} absent(s) signalé(s)</p>}
          </div>
          <ScanLine size={24} color={COLORS.primary} />
        </Card>
        {notDetectedInZone.length > 0 && scanMode !== "individual" && (
          <Card className="mb-4">
            <p className="font-bold text-[13px] mb-2" style={{ color: COLORS.text }}>Non détectés dans cette rangée ({notDetectedInZone.length})</p>
            <div className="flex flex-wrap gap-1.5">
              {notDetectedInZone.slice(0, 8).map((s) => <span key={s.id} className="text-[11px] px-2 py-1 rounded-full" style={{ background: COLORS.dangerSoft, color: COLORS.danger }}>{s.name}</span>)}
              {notDetectedInZone.length > 8 && <span className="text-[11px] px-2 py-1 rounded-full" style={{ background: COLORS.dangerSoft, color: COLORS.danger }}>+{notDetectedInZone.length - 8} autres</span>}
            </div>
          </Card>
        )}
        <div className="space-y-2">
          {!scanning && !zoneDone && <Btn full variant="secondary" icon={ScanLine} onClick={rescanZone}>Continuer le scan</Btn>}
          {scanMode === "rows" && zoneDone && !isLastZone && <Btn full icon={ArrowRight} onClick={goToNextZone}>Rangée {zoneIndex + 2} — continuer le scan</Btn>}
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
  const { questionnaire } = findQuestionnaire(loc.yr, loc.cls, session.subjectId, session.questionnaireId);
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

  const isLastQuestion = index === questionnaire.questions.length - 1;
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

  /* Passer à la question suivante n'est ni destructif ni définitif : on enchaîne directement
     et on laisse une sortie de secours dans le toast, plutôt que de bloquer sur une modale
     dix fois par séance — au troisième affichage elle n'est plus lue, elle est tapée, donc
     elle ne protège plus rien. Même principe que le retrait d'un élève, déjà annulable.
     Terminer l'évaluation, en revanche, clôt la séance : là, la confirmation reste. */
  const validateQuestion = () => {
    ctx.setData((d) => updateSession(d, sessionId, (s) => ({ ...s, questionStatus: { ...s.questionStatus, [question.id]: "validated" } })));
    const nextIndex = index + 1;
    if (nextIndex < questionnaire.questions.length) {
      ctx.nav.resetTo("sessionQuestion", { sessionId, index: nextIndex });
      ctx.showToast(`Question ${index + 1} validée`, {
        actionLabel: "Annuler",
        duration: 5000,
        onAction: () => {
          ctx.setData((d) => updateSession(d, sessionId, (s) => ({ ...s, questionStatus: { ...s.questionStatus, [question.id]: "scanned" } })));
          // Reconstitue la pile telle qu'elle était : l'écran de vérification garde son retour.
          ctx.nav.resetTo("sessionQuestion", { sessionId, index });
          ctx.nav.push("verifyAnswers", { sessionId, index });
        },
      });
    } else { ctx.setData((d) => updateSession(d, sessionId, (s) => ({ ...s, status: "completed" }))); ctx.nav.resetTo("sessionResultsGlobal", { sessionId }); }
  };

  return (
    <Screen>
      <TopBar title="Vérifier les réponses" subtitle={`Question ${index + 1} — ${detectedCount}/${students.length} détectés`} onBack={() => ctx.nav.pop()}
        right={<button onClick={() => { setSelectMode((v) => !v); setSelected(new Set()); }} className="text-[12px] font-semibold px-2.5 py-1.5 rounded-[10px]" style={{ background: selectMode ? COLORS.primary : COLORS.primarySoft, color: selectMode ? "#fff" : COLORS.primary }}>{selectMode ? "Terminer" : "Sélection multiple"}</button>} />
      <div className="px-4 pt-3">
        <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un élève" className="mb-2" />
        <div className="mobile-segmented flex p-1 mb-3">
          {[{ key: "all", label: `Tous (${students.length})` }, { key: "detected", label: `Détectés (${detectedCount})` }, { key: "undetected", label: `Non détectés (${students.length - detectedCount})` }].map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)} className={filter === f.key ? "active" : ""}>{f.label}</button>
          ))}
        </div>
        {selectMode && (
          <div className="flex items-center justify-between mb-2 px-1">
            <button onClick={selectAllVisible} className="text-[12px] font-semibold" style={{ color: COLORS.primary }}>Tout sélectionner ({visibleStudents.length})</button>
            <span className="text-[12px]" style={{ color: COLORS.muted }}>{selected.size} sélectionné(s)</span>
          </div>
        )}
        <div className="rounded-[16px] overflow-hidden mb-4" style={{ border: `1px solid ${COLORS.border}` }}>
          <div className="max-h-[380px] overflow-y-auto">
            {visibleStudents.length === 0 && <div className="py-8 text-center text-[13px]" style={{ color: COLORS.muted }}>Aucun élève ne correspond.</div>}
            {visibleStudents.map((s, i) => {
              const choice = session.answers[s.id]?.[question.id];
              const isAbsentDeclared = declaredAbsentIds.includes(s.id) && !choice;
              return (
                <div key={s.id} onClick={selectMode ? () => toggleSelect(s.id) : undefined} className="flex items-center justify-between px-3 py-2.5"
                  style={{ borderTop: i ? `1px solid ${COLORS.border}` : "none", background: selected.has(s.id) ? COLORS.primarySoft : i % 2 ? "#FBFCFD" : "#fff", cursor: selectMode ? "pointer" : "default" }}>
                  <div className="flex items-center gap-2 min-w-0">
                    {selectMode && <input type="checkbox" readOnly checked={selected.has(s.id)} className="mr-1" />}
                    {choice ? <UserCheck size={18} color={COLORS.success} /> : <UserX size={18} color={isAbsentDeclared ? COLORS.muted : COLORS.danger} />}
                    <span className="text-[13px] font-medium truncate" style={{ color: COLORS.text }}>{s.name}</span>
                  </div>
                  {!selectMode && (correcting === s.id ? (
                    <div className="flex gap-1.5">
                      {["A", "B", "C", "D"].map((k) => <button key={k} onClick={() => setChoice(s.id, k)} className="w-8 h-8 rounded-full text-[11px] font-bold" style={{ background: choice === k ? COLORS.primary : COLORS.border, color: choice === k ? "#fff" : COLORS.muted }}>{k}</button>)}
                      <button onClick={() => setChoice(s.id, null)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: COLORS.dangerSoft }}><X size={18} color={COLORS.danger} /></button>
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
        {!selectMode && (
          <>
            <p className="flex items-center gap-1.5 text-[12px] font-medium mb-2" style={{ color: detectedCount < students.length ? COLORS.warning : COLORS.success }}>
              {detectedCount < students.length ? <AlertTriangle size={14} /> : <CheckCircle2 size={14} />}
              {detectedCount < students.length ? `Vérifiez que tous les élèves ont répondu — ${students.length - detectedCount} non détecté(s).` : "Toutes les réponses ont été détectées."}
            </p>
            <Btn full icon={isLastQuestion ? CheckCircle2 : ArrowRight} onClick={() => (isLastQuestion ? setConfirmValidate(true) : validateQuestion())}>{isLastQuestion ? "Terminer et voir les résultats" : "Continuer à la question suivante"}</Btn>
          </>
        )}
      </div>
      {selectMode && selected.size > 0 && (
        <div className="sticky bottom-0 px-4 py-3" style={{ background: COLORS.surface, borderTop: `1px solid ${COLORS.border}` }}>
          <p className="text-[11px] font-semibold mb-2" style={{ color: COLORS.muted }}>Attribuer aux {selected.size} élève(s) sélectionné(s) :</p>
          <div className="flex gap-2">
            {["A", "B", "C", "D"].map((k) => <button key={k} onClick={() => setChoiceBulk(k)} className="flex-1 rounded-[16px] font-bold text-[13px]" style={{ minHeight: 40, background: COLORS.primarySoft, color: COLORS.primary }}>{k}</button>)}
            <button onClick={() => setChoiceBulk(null)} className="flex-1 rounded-[16px] font-semibold text-[12px]" style={{ minHeight: 40, background: COLORS.dangerSoft, color: COLORS.danger }}>Absent</button>
          </div>
        </div>
      )}
      <ConfirmModal open={confirmValidate && isLastQuestion} title="Terminer l'évaluation ?" text="Les réponses seront enregistrées et la séance sera clôturée. Vous accéderez ensuite aux résultats." onCancel={() => setConfirmValidate(false)} onConfirm={() => { setConfirmValidate(false); validateQuestion(); }} confirmLabel="Terminer" />
    </Screen>
  );
}

/* Résultats — s'appuient sur la photo des participants prise au lancement de la session, jamais recalculée après coup */
function computeResults(ctx, sessionId) {
  const session = findSession(ctx.data, sessionId);
  const loc = locateClass(ctx.data, session.classId);
  const { questionnaire } = findQuestionnaire(loc.yr, loc.cls, session.subjectId, session.questionnaireId);
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
    <div className="px-4 pb-3">
      <div className="mobile-segmented flex p-1">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => ctx.nav.resetTo(t.key, { sessionId })} className={active === t.key ? "active" : ""}>{t.label}</button>
        ))}
      </div>
    </div>
  );
}
function DonutChart({ segments, size = 132, strokeWidth = 16, centerValue, centerLabel }) {
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
      <text x={size / 2} y={size / 2 - 3} textAnchor="middle" fontSize="22" fontWeight="800" fill={COLORS.text}>{centerValue !== undefined ? centerValue : total}</text>
      <text x={size / 2} y={size / 2 + 15} textAnchor="middle" fontSize="10" fill={COLORS.muted}>{centerLabel !== undefined ? centerLabel : (total > 1 ? "évaluations" : "évaluation")}</text>
    </svg>
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
            <span className="w-7 text-[11px] font-bold flex items-center gap-0.5" style={{ color: isCorrect ? COLORS.success : COLORS.muted }}>{k}{isCorrect && <Check size={11} />}</span>
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

  const participationPct = r.students.length ? Math.round((r.participants / r.students.length) * 100) : 0;
  const incorrectCount = r.perQuestion.reduce((sum, pq) => sum + pq.incorrect, 0);
  const noAnswerCount = r.perQuestion.reduce((sum, pq) => sum + pq.noAnswer, 0);
  const outcomeTotal = r.totalCorrect + incorrectCount + noAnswerCount;
  const outcomePct = (n) => (outcomeTotal ? Math.round((n / outcomeTotal) * 100) : 0);
  const outcomeSegments = [
    { key: "correct", value: r.totalCorrect, color: COLORS.success, label: "Correct" },
    { key: "incorrect", value: incorrectCount, color: COLORS.danger, label: "Incorrect" },
    { key: "noAnswer", value: noAnswerCount, color: COLORS.warning, label: "Sans réponse" },
  ];

  return (
    <Screen>
      <TopBar title="Résultats" subtitle={`${r.loc.cls.name} · ${r.questionnaire.title}`} onBack={() => ctx.nav.pop()} />
      <ResultsTabs ctx={ctx} sessionId={sessionId} active="sessionResultsGlobal" />
      <div className="px-4 pb-4 space-y-4">
        {isWeak && (
          <Card className="flex items-start gap-2.5" style={{ background: COLORS.dangerSoft, border: "none", borderLeft: `3px solid ${COLORS.danger}` }}>
            <AlertTriangle size={18} color={COLORS.danger} className="mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[12px] leading-5" style={{ color: COLORS.danger }}>
                Résultats faibles sur « {r.questionnaire.title} ». Nous recommandons de revoir le cours correspondant avec la classe avant de continuer.
              </p>
              <button onClick={() => setConfirmRetry(true)} className="mt-2 flex items-center gap-1.5 text-[12px] font-bold" style={{ color: COLORS.danger }}>
                <RefreshCw size={13} /> Refaire ce questionnaire
              </button>
            </div>
          </Card>
        )}

        <SectionLabel>Vue d'ensemble</SectionLabel>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <StatCard icon={isWeak ? XCircle : CheckCircle2} value={`${r.classAverage}%`}
              label={`Moyenne de la classe · ${isWeak ? "sous" : "au-dessus du"} seuil (${WEAK_RESULT_THRESHOLD}%)`}
              tone={isWeak ? "danger" : "success"} />
          </div>
          <StatCard icon={Users} value={`${participationPct}%`} label={`Participation (${r.participants} sur ${r.students.length})`} tone={r.participants >= r.students.length * 0.8 ? "success" : "warning"} />
          <StatCard icon={GraduationCap} value={r.students.length} label="Élèves inscrits" />
        </div>

        <Card>
          <p className="text-[11px] font-extrabold uppercase mb-3" style={{ color: COLORS.muted, letterSpacing: "0.09em" }}>Répartition des réponses</p>
          <div className="flex items-center gap-4">
            <DonutChart segments={outcomeSegments} size={100} strokeWidth={14} centerValue={`${outcomePct(r.totalCorrect)}%`} centerLabel="correct" />
            <div className="flex-1 min-w-0 space-y-2.5">
              {outcomeSegments.map((s) => (
                <div key={s.key} className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 text-[12px]" style={{ color: COLORS.text }}>
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
                    {s.label}
                  </span>
                  <b className="text-[13px]" style={{ color: COLORS.text }}>{outcomePct(s.value)}%</b>
                </div>
              ))}
            </div>
          </div>
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
      <div className="px-4 space-y-2">
        {r.perQuestion.map((pq, i) => {
          const weak = pq.rate < WEAK_RESULT_THRESHOLD;
          return (
            <Card key={pq.question.id} style={weak ? { border: "1.5px solid #F0C6C1" } : undefined}>
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
          <div className="grid grid-cols-2 gap-3 mb-4">
            <StatCard icon={ClipboardList} value={`${selected.score}/${r.questions.length}`} label="Score" />
            <StatCard icon={CheckCircle2} value={`${selected.pct}%`} label="Réussite" tone={selected.pct >= 50 ? "success" : "danger"} />
          </div>
          <div className="space-y-2">
            {selected.detail.map((d, i) => (
              <Card key={d.question.id} className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium truncate" style={{ color: COLORS.text }}>Q{i + 1}. {d.question.text}</p>
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
        <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un élève" className="mb-3" />
        <div className="space-y-1.5 max-h-[500px] overflow-y-auto">
          {filtered.map((p) => (
            <Card key={p.student.id} onClick={() => ctx.nav.push("sessionResultsByStudent", { sessionId, studentId: p.student.id })} className="flex items-center justify-between !py-2.5">
              <span className="text-[13px] font-medium truncate" style={{ color: COLORS.text }}>{p.student.name}</span>
              <div className="flex items-center gap-2"><span className="text-[12px]" style={{ color: COLORS.muted }}>{p.score}/{r.questions.length}</span><Badge tone={p.pct >= 50 ? "success" : "danger"}>{p.pct}%</Badge></div>
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
            <p className="font-bold text-[14px]" style={{ color: COLORS.text }}>{ctx.isOnline ? "Connexion disponible" : "Mode hors ligne"}</p>
            <p className="text-[11px]" style={{ color: COLORS.muted }}>{ctx.isOnline ? "Détectée automatiquement — synchronisation en cours dès qu'une donnée change." : "Détecté automatiquement — les données seront envoyées dès le retour du réseau."}</p>
          </div>
        </Card>

        {alert.level !== "ok" && (
          <Card className="mb-4 flex items-center gap-2" style={{ background: alert.level === "critical" ? COLORS.dangerSoft : COLORS.warningSoft, border: "none" }}>
            <AlertTriangle size={18} color={alert.level === "critical" ? COLORS.danger : COLORS.warning} />
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
                    <p className="text-[13px] font-medium truncate" style={{ color: COLORS.text }}>{cls?.name} · {s.date}</p>
                    <p className="text-[11px]" style={{ color: COLORS.muted }}>{s.lastSyncedAt ? `Synchronisé à ${new Date(s.lastSyncedAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}` : "Jamais synchronisé"}</p>
                  </div>
                  <Badge tone={meta.tone} icon={meta.icon}>{meta.label}</Badge>
                </Card>
              );
            })}
          </div>
        )}
        <Btn full icon={syncing ? RefreshCw : UploadCloud} disabled={!ctx.isOnline || syncing} onClick={syncNow}>{syncing ? "Synchronisation en cours…" : "Synchroniser maintenant"}</Btn>
        {!ctx.isOnline && <p className="text-[12px] mt-2 text-center" style={{ color: COLORS.warning }}>Activez la connexion pour synchroniser.</p>}
      </div>
    </Screen>
  );
}

/* ================================ APP ROOT ================================ */
const SCREENS = {
  splash: SplashScreen, welcome: WelcomeScreen, register: RegisterWizardScreen, joinEstablishment: JoinEstablishmentScreen, login: LoginScreen,
  forcedPasswordChange: ForcedPasswordChangeScreen, forgotPassword: ForgotPasswordScreen, myProfile: MyProfileScreen,
  adminDashboard: AdminDashboardScreen, adminResults: AdminResultsScreen, myEstablishment: MyEstablishmentScreen,
  years: YearsScreen, levels: LevelsScreen, levelDetails: LevelDetailsScreen, classes: ClassesScreen, classDetails: ClassDetailsScreen,
  closeYear: CloseYearScreen, distributeStudents: DistributeStudentsScreen,
  importStudents: ImportStudentsScreen, importPreview: ImportPreviewScreen,
  subjects: SubjectsScreen, teachersList: TeachersListScreen, teacherDetails: TeacherDetailsScreen, createTeacher: CreateTeacherScreen,
  shareCredentials: ShareCredentialsScreen, assignClassesToTeacher: AssignClassesToTeacherScreen,
  teacherDashboard: TeacherDashboardScreen, teacherYears: TeacherYearsScreen, teacherLevels: TeacherLevelsScreen, teacherLevelDetails: TeacherLevelDetailsScreen, teacherLevelSubjects: TeacherLevelSubjectsScreen, teacherLevelClasses: TeacherLevelClassesScreen,
  evaluationsList: EvaluationsListScreen,
  createQuestionnaire: CreateQuestionnaireScreen, createQuestion: CreateQuestionScreen,
  evalPrep: EvalPrepScreen, sessionQuestion: SessionQuestionScreen, scanSimulation: ScanSimulationScreen,
  verifyAnswers: VerifyAnswersScreen, sessionResultsGlobal: ResultsGlobalScreen,
  sessionResultsByQuestion: ResultsByQuestionScreen, sessionResultsByStudent: ResultsByStudentScreen, sync: SyncScreen,
};
const NO_BOTTOM_BAR_APP = new Set(["scanSimulation"]);

export default function KagatPrototype() {
  const [data, setData] = useState(() => {
    try { const saved = localStorage.getItem("kagat-prototype-data"); return saved ? JSON.parse(saved) : makeInitialData(); }
    catch (e) { return makeInitialData(); }
  });
  const [isOnline, setIsOnline] = useState(() => (typeof navigator !== "undefined" ? navigator.onLine : true));
  const [currentUser, setCurrentUser] = useState(null);
  const [mode, setMode] = useState("auth"); // 'auth' | 'app'
  const [authStack, setAuthStack] = useState(() => {
    const inviteCode = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("invite") : "";
    return inviteCode ? [{ screen: "joinEstablishment", params: { inviteCode } }] : [{ screen: "splash", params: {} }];
  });
  const [activeTab, setActiveTab] = useState("accueil");
  const [tabStacks, setTabStacks] = useState({});
  const [onboardingSeen, setOnboardingSeen] = useState(false);
  const [toasts, setToasts] = useState([]);

  const dismissToast = (id) => setToasts((t) => t.filter((x) => x.id !== id));
  const showToast = (message, opts = {}) => {
    const id = uid("toast");
    setToasts((t) => [...t, { id, message, tone: opts.tone || "success", actionLabel: opts.actionLabel, onAction: opts.onAction }]);
    setTimeout(() => dismissToast(id), opts.duration || 3500);
  };

  // Conserve les invitations et comptes simulés afin qu'un lien reçu puisse être ouvert dans le prototype.
  useEffect(() => {
    try { localStorage.setItem("kagat-prototype-data", JSON.stringify(data)); }
    catch (e) { /* stockage indisponible : le prototype reste utilisable en mémoire */ }
  }, [data]);

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

  /* accountTypeOverride : quand l'établissement vient tout juste d'être défini dans le même
     geste (inscription, démo), `data` ici est encore l'ancienne valeur — React n'a pas encore
     appliqué le setData précédent au moment où cette fonction s'exécute. Sans cet override,
     un enseignant indépendant qui vient de créer son compte atterrirait sur les onglets d'un
     enseignant d'établissement (pas d'onglet "Classes" pour créer ses propres classes). */
  const enterApp = (role, accountTypeOverride) => {
    const effectiveAccountType = accountTypeOverride !== undefined ? accountTypeOverride : data.establishment?.accountType;
    const tabs = role === "admin" ? ADMIN_TABS : (effectiveAccountType === "independent" ? INDEPENDENT_TABS : TEACHER_TABS);
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

  const ctx = { data, setData, isOnline, setIsOnline, currentUser, setCurrentUser, nav, enterApp, exitApp, onboardingSeen, setOnboardingSeen, showToast };
  const current = nav.current;
  const ScreenComponent = SCREENS[current.screen] || WelcomeScreen;
  const showBottomBar = mode === "app" && !NO_BOTTOM_BAR_APP.has(current.screen);
  /* Repère constant, présent sur tous les écrans une fois connecté : quelle est l'année
     scolaire active en ce moment (par opposition à une année archivée qu'on est peut-être en
     train de consulter dans l'écran lui-même). Un seul endroit à maintenir plutôt que de le
     répéter dans chaque écran. */
  const activeYearLabel = mode === "app" ? data.years.find((y) => !y.archived)?.label : null;

  return (
    <div className="prototype-stage w-full min-h-[100vh] flex items-center justify-center py-6" style={{ fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif" }}>
      <div className="prototype-note hidden sm:flex"><Info size={18} /><span>Prototype déployé présentant les fonctionnalités de base de l’application KAGAT.</span></div>
      <div className="phone-shell relative w-full max-w-[410px] flex flex-col overflow-hidden" style={{ background: COLORS.bg }}>
        <div className="phone-status flex items-center justify-between px-6 pt-2 pb-1 text-[10px] font-bold shrink-0" style={{ color: COLORS.text, background: COLORS.surface }}>
          <span>9:41</span>
          <div className="flex items-center gap-1">{isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}<span>KAGAT</span></div>
        </div>
        {activeYearLabel && (
          <div className="app-year-banner flex items-center justify-center gap-1.5 py-1 shrink-0" style={{ background: COLORS.primarySoft }}>
            <Calendar size={10.5} color={COLORS.primary} />
            <span className="text-[10px] font-bold" style={{ color: COLORS.primaryDark }}>Année scolaire en cours · {activeYearLabel}</span>
          </div>
        )}
        <div className="app-scroll flex-1 overflow-y-auto relative" style={{ background: COLORS.bg }}>
          <ScreenComponent ctx={ctx} />
        </div>
        {showBottomBar && <BottomTabBar ctx={ctx} />}
        <ToastHost toasts={toasts} onDismiss={dismissToast} />
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, value, label, tone = "primary" }) {
  const color = tone === "accent" ? COLORS.accent : tone === "success" ? COLORS.success : tone === "warning" ? COLORS.warning : tone === "danger" ? COLORS.danger : COLORS.primary;
  const soft = tone === "accent" ? COLORS.accentSoft : tone === "success" ? COLORS.successSoft : tone === "warning" ? COLORS.warningSoft : tone === "danger" ? COLORS.dangerSoft : COLORS.primarySoft;
  return (
    <Card className="stat-card">
      <div className="stat-icon" style={{ background: soft, color }}><Icon size={18} /></div>
      <p className="text-[28px] font-extrabold tracking-[-0.04em] mt-3" style={{ color: COLORS.text }}>{value}</p>
      <p className="text-[11px] font-semibold mt-0.5" style={{ color: COLORS.muted }}>{label}</p>
    </Card>
  );
}

/* Composant retiré — remplacé partout par Btn (voir plus haut) pour rester cohérent avec les
   autres boutons de l'app. */
