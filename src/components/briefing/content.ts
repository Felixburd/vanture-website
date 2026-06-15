import type { Locale } from '@/i18n/routing'

/*
  Briefing form content — recreated from the legacy n8n-hosted multi-step form
  (portal.vanture.capital/webhook/vanture-briefing) and localized EN + fr-ca.

  Option *values* are locale-stable identifiers so the submitted payload is
  identical regardless of language; only the visible labels are translated.
  This module is pure data + the branching/scoring logic the form depends on.
*/

export type Choice = { value: string; title: string; sub?: string }
export type RiskFlag = 'green' | 'amber' | 'critical'
export type RiskChoice = { value: RiskFlag; text: string }
export type LensCode = 'L1' | 'L2' | 'L3' | 'L4'

export type RiskQuestion = {
  lens: LensCode
  short: string
  tagName: string
  tagStat: string
  question: string
  options: RiskChoice[]
}

export type BranchKey = 'dealmaker' | 'seller' | 'lender' | 'operator'
export type RoleKey = 'advisor' | 'seller' | 'buyer' | 'capital' | 'lender' | 'operator'

export type BranchField = {
  /** The state key this branch writes to — also the field validated on step 2. */
  field: 'stage' | 'window' | 'lender_timeline' | 'op_horizon'
  label: string
  hint?: string
  options: Choice[]
}

export type BriefingContent = {
  meta: { title: string; description: string }
  ui: {
    step: string
    of: string
    continue: string
    back: string
    book: string
    submitting: string
    tryAgain: string
    select: string
    confidential: string
    optional: string
    submitError: string
  }
  step1: {
    tagline: string
    heading: string
    lede: string
    roleLabel: string
    roles: (Choice & { value: RoleKey })[]
    intentLabel: string
    intents: Choice[]
  }
  step2: {
    tagline: string
    heading: Record<'default' | 'seller' | 'operator' | 'lender', string>
    lede: Record<'default' | 'seller' | 'operator' | 'lender', string>
    revenueLabel: string
    revenues: Choice[]
    industryLabel: string
    industries: Choice[]
    geoLabel: string
    geos: Choice[]
    branches: Record<BranchKey, BranchField>
  }
  step3: {
    tagline: string
    heading: string
    lede: string
    questions: RiskQuestion[]
  }
  step4: {
    tagline: string
    heading: string
    lede: string
    signal: {
      eyebrow: string
      verdicts: Record<RiskFlag, string>
      headlineCritical: (n: number) => string
      headlineMaterial: (critical: number, amber: number) => string
      headlineStrong: string
      note: string
      flags: Record<RiskFlag | 'pending', string>
    }
    fields: {
      name: { label: string; placeholder: string }
      email: { label: string; placeholder: string }
      company: { label: string; placeholder: string }
      title: { label: string; placeholder: string }
      phone: { label: string; placeholder: string }
    }
  }
  step5: {
    heading: string
    lede: string
    summaryTitle: string
    labels: {
      role: string
      intent: string
      revenue: string
      industry: string
      geo: string
      signal: string
    }
  }
}

/** Which step-2 branch a given role routes to (mirrors the legacy branchByRole). */
export const branchByRole: Record<RoleKey, BranchKey> = {
  advisor: 'dealmaker',
  buyer: 'dealmaker',
  capital: 'dealmaker',
  seller: 'seller',
  lender: 'lender',
  operator: 'operator',
}

/** Heading/lede variant key for step 2, derived from the role. */
export function step2Variant(role?: RoleKey): 'default' | 'seller' | 'operator' | 'lender' {
  if (role === 'seller') return 'seller'
  if (role === 'operator') return 'operator'
  if (role === 'lender') return 'lender'
  return 'default'
}

const EN: BriefingContent = {
  meta: {
    title: 'Book a confidential briefing',
    description:
      'A confidential 30-minute briefing. Your answers prepare a preliminary DVTA signal before we speak.',
  },
  ui: {
    step: 'Step',
    of: 'of',
    continue: 'Continue',
    back: 'Back',
    book: 'Book my briefing',
    submitting: 'Submitting…',
    tryAgain: 'Try again',
    select: 'Select…',
    confidential:
      'Conversations are confidential. We do not share, resell, or use your information beyond this engagement.',
    optional: 'optional',
    submitError: 'Submission failed. Please try again.',
  },
  step1: {
    tagline: 'Confidential briefing · 30 minutes',
    heading: "Let's start with you.",
    lede: 'Your answers route this briefing to the right partner and prepare a preliminary DVTA signal before we speak.',
    roleLabel: 'Which best describes your role?',
    roles: [
      { value: 'advisor', title: 'M&A advisor', sub: 'Buy-side, sell-side, or sell-side prep' },
      {
        value: 'seller',
        title: 'Owner / operator preparing to sell',
        sub: 'Pre-empting a buyer-commissioned DVTA',
      },
      {
        value: 'buyer',
        title: 'Buyer evaluating a target',
        sub: 'Strategic, search fund, or family office',
      },
      { value: 'capital', title: 'Capital allocator', sub: 'PE, VC, holdco, or sponsor' },
      { value: 'lender', title: 'Lender', sub: 'Credit, debt, or specialty finance' },
      {
        value: 'operator',
        title: 'Operator (no live deal)',
        sub: 'Diagnosing operational opacity',
      },
    ],
    intentLabel: 'What brought you here today?',
    intents: [
      { value: 'live', title: 'I have a live deal in motion' },
      { value: 'near', title: 'I expect to act in the next 6–18 months' },
      { value: 'exploring', title: "I'm exploring — no specific timeline" },
      { value: 'postmortem', title: 'I had an integration go sideways' },
    ],
  },
  step2: {
    tagline: 'The target',
    heading: {
      default: 'Tell us about the target.',
      seller: 'Tell us about your business.',
      operator: 'Tell us about your operation.',
      lender: 'Tell us about the borrower.',
    },
    lede: {
      default: 'Just enough context to scope the right diagnostic.',
      seller: 'Just enough context to scope what a buyer will look for.',
      operator: 'Just enough context to scope the diagnostic.',
      lender: 'Just enough context to scope the credit-side risk.',
    },
    revenueLabel: 'Approximate revenue band',
    revenues: [
      { value: '<5m', title: 'Under $5M' },
      { value: '5-25m', title: '$5M – $25M' },
      { value: '25-100m', title: '$25M – $100M' },
      { value: '100m+', title: '$100M+' },
    ],
    industryLabel: 'Industry',
    industries: [
      { value: 'software', title: 'Software / SaaS' },
      { value: 'services', title: 'Professional services' },
      { value: 'construction', title: 'Construction / engineering' },
      { value: 'manufacturing', title: 'Manufacturing / industrial' },
      { value: 'healthcare', title: 'Healthcare' },
      { value: 'finance', title: 'Financial services' },
      { value: 'consumer', title: 'Consumer / retail' },
      { value: 'realestate', title: 'Real estate' },
      { value: 'other', title: 'Other' },
    ],
    geoLabel: 'Geography',
    geos: [
      { value: 'quebec', title: 'Quebec' },
      { value: 'canada', title: 'Rest of Canada' },
      { value: 'us', title: 'United States' },
      { value: 'crossborder', title: 'Cross-border (CA/US)' },
      { value: 'europe', title: 'Europe' },
      { value: 'other', title: 'Other' },
    ],
    branches: {
      dealmaker: {
        field: 'stage',
        label: 'Where is the deal today?',
        options: [
          { value: 'prelim', title: 'Preliminary discussions' },
          { value: 'loi', title: 'LOI signed' },
          { value: 'diligence', title: 'Diligence open' },
          { value: 'postclose', title: 'Post-close integration' },
        ],
      },
      seller: {
        field: 'window',
        label: 'When do you expect to transact?',
        hint: 'Earlier is better — most fragility takes 6–12 months to remediate.',
        options: [
          { value: 'now', title: 'Active sale process' },
          { value: '12mo', title: 'Within 12 months' },
          { value: '24mo', title: '12–24 months' },
          { value: 'exploring', title: 'Just exploring' },
        ],
      },
      lender: {
        field: 'lender_timeline',
        label: 'Decision timeline',
        options: [
          { value: 'active', title: 'Active credit decision' },
          { value: 'quarter', title: 'Within the quarter' },
          { value: 'portfolio', title: 'Portfolio monitoring' },
        ],
      },
      operator: {
        field: 'op_horizon',
        label: 'What is your transition horizon?',
        options: [
          { value: 'immediate', title: 'Immediate concern' },
          { value: '3-5yr', title: '3–5 year planning' },
          { value: 'continuous', title: 'Continuous improvement' },
        ],
      },
    },
  },
  step3: {
    tagline: 'DVTA preview · 4 questions',
    heading: 'Four questions due diligence rarely asks.',
    lede: 'Each maps to one DVTA lens. Your answers generate a preliminary signal — your full assessment expands on this in 30 days.',
    questions: [
      {
        lens: 'L1',
        short: 'Revenue',
        tagName: 'Revenue Quality',
        tagStat: '32% of M&A failures',
        question:
          'Is more than 70% of revenue under written contracts with explicit renewal terms?',
        options: [
          { value: 'green', text: 'Yes, documented' },
          { value: 'amber', text: 'Partly / unsure' },
          { value: 'critical', text: 'No / handshake-based' },
        ],
      },
      {
        lens: 'L2',
        short: 'Execution',
        tagName: 'Execution Proof',
        tagStat: '28% of M&A failures',
        question:
          'Can "delivered" be objectively proven from system events, without asking a specific person?',
        options: [
          { value: 'green', text: 'Yes, in the system' },
          { value: 'amber', text: 'Sometimes' },
          { value: 'critical', text: 'It lives with people' },
        ],
      },
      {
        lens: 'L3',
        short: 'Spending',
        tagName: 'Spending Control',
        tagStat: '18% of M&A failures',
        question: 'Are major commitments documented and approved before they become inevitable?',
        options: [
          { value: 'green', text: 'Always' },
          { value: 'amber', text: 'Inconsistently' },
          { value: 'critical', text: 'They just happen' },
        ],
      },
      {
        lens: 'L4',
        short: 'Key-Person',
        tagName: 'Key-Person Risk',
        tagStat: '22% of M&A failures',
        question:
          'Could three specific people leave next month and the business survive without disruption?',
        options: [
          { value: 'green', text: 'Yes, documented' },
          { value: 'amber', text: 'Painful but survivable' },
          { value: 'critical', text: 'No — it would break' },
        ],
      },
    ],
  },
  step4: {
    tagline: 'Your details',
    heading: 'Where should we send your briefing?',
    lede: 'A senior Vanture partner will review your preliminary signal and reach out within one business day.',
    signal: {
      eyebrow: 'Preliminary DVTA signal',
      verdicts: {
        critical: 'Proceed with conditions',
        amber: 'Material findings',
        green: 'Strong baseline',
      },
      headlineCritical: (n) => `${n} of 4 lenses flagged CRITICAL.`,
      headlineMaterial: (c, a) => `${c} CRITICAL · ${a} AMBER findings preliminary.`,
      headlineStrong: 'No critical flags surfaced. Worth confirming with full DVTA.',
      note: '28% valuation impact has been observed in similar profiles.',
      flags: { critical: 'Critical', amber: 'Amber', green: 'Green', pending: 'Pending' },
    },
    fields: {
      name: { label: 'Full name', placeholder: 'Jane Doe' },
      email: { label: 'Work email', placeholder: 'jane@firm.com' },
      company: { label: 'Company', placeholder: 'Firm name' },
      title: { label: 'Title', placeholder: 'Partner, Managing Director…' },
      phone: { label: 'Phone', placeholder: '+1 (514) 555-0142' },
    },
  },
  step5: {
    heading: 'Your briefing is queued.',
    lede: 'A Vanture partner will reach out within one business day. Expect a confidential 30-minute call to walk through your preliminary signal and decide whether a full DVTA is the right next step.',
    summaryTitle: 'Your briefing at a glance',
    labels: {
      role: 'Role',
      intent: 'Intent',
      revenue: 'Revenue band',
      industry: 'Industry',
      geo: 'Geography',
      signal: 'Preliminary signal',
    },
  },
}

const FR: BriefingContent = {
  meta: {
    title: 'Réservez une séance confidentielle',
    description:
      'Une séance confidentielle de 30 minutes. Vos réponses préparent un signal DVTA préliminaire avant notre échange.',
  },
  ui: {
    step: 'Étape',
    of: 'sur',
    continue: 'Continuer',
    back: 'Retour',
    book: 'Réserver ma séance',
    submitting: 'Envoi…',
    tryAgain: 'Réessayer',
    select: 'Sélectionner…',
    confidential:
      "Les échanges sont confidentiels. Nous ne partageons, ne revendons ni n'utilisons vos renseignements au-delà de ce mandat.",
    optional: 'facultatif',
    submitError: "L'envoi a échoué. Veuillez réessayer.",
  },
  step1: {
    tagline: 'Séance confidentielle · 30 minutes',
    heading: 'Commençons par vous.',
    lede: "Vos réponses orientent cette séance vers le bon associé et préparent un signal DVTA préliminaire avant notre échange.",
    roleLabel: 'Lequel décrit le mieux votre rôle ?',
    roles: [
      {
        value: 'advisor',
        title: 'Conseiller en fusions-acquisitions',
        sub: 'Achat, vente ou préparation à la vente',
      },
      {
        value: 'seller',
        title: "Propriétaire / exploitant en vue d'une vente",
        sub: "Anticiper une DVTA commandée par l'acheteur",
      },
      {
        value: 'buyer',
        title: 'Acheteur évaluant une cible',
        sub: 'Stratégique, fonds de recherche ou family office',
      },
      {
        value: 'capital',
        title: 'Allocateur de capital',
        sub: 'Capital-investissement, capital de risque, holding ou commanditaire',
      },
      { value: 'lender', title: 'Prêteur', sub: 'Crédit, dette ou financement spécialisé' },
      {
        value: 'operator',
        title: 'Exploitant (sans transaction en cours)',
        sub: "Diagnostiquer l'opacité opérationnelle",
      },
    ],
    intentLabel: "Qu'est-ce qui vous amène aujourd'hui ?",
    intents: [
      { value: 'live', title: "J'ai une transaction en cours" },
      { value: 'near', title: 'Je prévois agir dans les 6 à 18 prochains mois' },
      { value: 'exploring', title: "J'explore — sans échéancier précis" },
      { value: 'postmortem', title: 'Une intégration a mal tourné' },
    ],
  },
  step2: {
    tagline: 'La cible',
    heading: {
      default: 'Parlez-nous de la cible.',
      seller: 'Parlez-nous de votre entreprise.',
      operator: 'Parlez-nous de votre exploitation.',
      lender: "Parlez-nous de l'emprunteur.",
    },
    lede: {
      default: 'Juste assez de contexte pour cadrer le bon diagnostic.',
      seller: "Juste assez de contexte pour cadrer ce qu'un acheteur cherchera.",
      operator: 'Juste assez de contexte pour cadrer le diagnostic.',
      lender: 'Juste assez de contexte pour cadrer le risque côté crédit.',
    },
    revenueLabel: 'Tranche de revenus approximative',
    revenues: [
      { value: '<5m', title: 'Moins de 5 M$' },
      { value: '5-25m', title: '5 M$ – 25 M$' },
      { value: '25-100m', title: '25 M$ – 100 M$' },
      { value: '100m+', title: '100 M$ et plus' },
    ],
    industryLabel: 'Secteur',
    industries: [
      { value: 'software', title: 'Logiciel / SaaS' },
      { value: 'services', title: 'Services professionnels' },
      { value: 'construction', title: 'Construction / ingénierie' },
      { value: 'manufacturing', title: 'Fabrication / industriel' },
      { value: 'healthcare', title: 'Santé' },
      { value: 'finance', title: 'Services financiers' },
      { value: 'consumer', title: 'Consommation / commerce de détail' },
      { value: 'realestate', title: 'Immobilier' },
      { value: 'other', title: 'Autre' },
    ],
    geoLabel: 'Territoire',
    geos: [
      { value: 'quebec', title: 'Québec' },
      { value: 'canada', title: 'Reste du Canada' },
      { value: 'us', title: 'États-Unis' },
      { value: 'crossborder', title: 'Transfrontalier (CA / É.-U.)' },
      { value: 'europe', title: 'Europe' },
      { value: 'other', title: 'Autre' },
    ],
    branches: {
      dealmaker: {
        field: 'stage',
        label: 'Où en est la transaction ?',
        options: [
          { value: 'prelim', title: 'Discussions préliminaires' },
          { value: 'loi', title: "Lettre d'intention signée" },
          { value: 'diligence', title: 'Vérification diligente en cours' },
          { value: 'postclose', title: 'Intégration post-clôture' },
        ],
      },
      seller: {
        field: 'window',
        label: 'Quand prévoyez-vous transiger ?',
        hint: 'Plus tôt vaut mieux — la plupart des fragilités prennent de 6 à 12 mois à corriger.',
        options: [
          { value: 'now', title: 'Processus de vente actif' },
          { value: '12mo', title: "D'ici 12 mois" },
          { value: '24mo', title: '12 à 24 mois' },
          { value: 'exploring', title: "J'explore simplement" },
        ],
      },
      lender: {
        field: 'lender_timeline',
        label: 'Échéancier de décision',
        options: [
          { value: 'active', title: 'Décision de crédit active' },
          { value: 'quarter', title: "D'ici le trimestre" },
          { value: 'portfolio', title: 'Suivi de portefeuille' },
        ],
      },
      operator: {
        field: 'op_horizon',
        label: 'Quel est votre horizon de transition ?',
        options: [
          { value: 'immediate', title: 'Préoccupation immédiate' },
          { value: '3-5yr', title: 'Planification sur 3 à 5 ans' },
          { value: 'continuous', title: 'Amélioration continue' },
        ],
      },
    },
  },
  step3: {
    tagline: 'Aperçu DVTA · 4 questions',
    heading: 'Quatre questions que la vérification diligente pose rarement.',
    lede: "Chacune correspond à une perspective DVTA. Vos réponses génèrent un signal préliminaire — votre évaluation complète l'approfondit en 30 jours.",
    questions: [
      {
        lens: 'L1',
        short: 'Revenus',
        tagName: 'Qualité des revenus',
        tagStat: '32 % des échecs de F&A',
        question:
          'Plus de 70 % des revenus sont-ils encadrés par des contrats écrits aux conditions de renouvellement explicites ?',
        options: [
          { value: 'green', text: 'Oui, documenté' },
          { value: 'amber', text: 'En partie / incertain' },
          { value: 'critical', text: 'Non / ententes verbales' },
        ],
      },
      {
        lens: 'L2',
        short: 'Exécution',
        tagName: "Preuve d'exécution",
        tagStat: '28 % des échecs de F&A',
        question:
          "Peut-on prouver objectivement qu'une prestation est « livrée » à partir des événements systèmes, sans demander à une personne précise ?",
        options: [
          { value: 'green', text: 'Oui, dans le système' },
          { value: 'amber', text: 'Parfois' },
          { value: 'critical', text: 'Ça repose sur les personnes' },
        ],
      },
      {
        lens: 'L3',
        short: 'Dépenses',
        tagName: 'Contrôle des dépenses',
        tagStat: '18 % des échecs de F&A',
        question:
          'Les engagements majeurs sont-ils documentés et approuvés avant de devenir inévitables ?',
        options: [
          { value: 'green', text: 'Toujours' },
          { value: 'amber', text: 'De façon irrégulière' },
          { value: 'critical', text: 'Ils surviennent sans contrôle' },
        ],
      },
      {
        lens: 'L4',
        short: 'Personnes clés',
        tagName: 'Risque lié aux personnes clés',
        tagStat: '22 % des échecs de F&A',
        question:
          "Si trois personnes précises partaient le mois prochain, l'entreprise survivrait-elle sans perturbation ?",
        options: [
          { value: 'green', text: 'Oui, documenté' },
          { value: 'amber', text: 'Douloureux mais surmontable' },
          { value: 'critical', text: "Non — tout s'effondrerait" },
        ],
      },
    ],
  },
  step4: {
    tagline: 'Vos coordonnées',
    heading: 'Comment pouvons-nous vous joindre ?',
    lede: 'Un associé principal de Vanture examinera votre signal préliminaire et vous contactera en un jour ouvrable.',
    signal: {
      eyebrow: 'Signal DVTA préliminaire',
      verdicts: {
        critical: 'Poursuivre sous conditions',
        amber: 'Constats importants',
        green: 'Base solide',
      },
      headlineCritical: (n) => `${n} perspectives sur 4 signalées CRITIQUES.`,
      headlineMaterial: (c, a) => `${c} CRITIQUE · ${a} AMBRE — constats préliminaires.`,
      headlineStrong: 'Aucun signal critique détecté. À confirmer par une DVTA complète.',
      note: 'Un impact de 28 % sur la valorisation a été observé dans des profils similaires.',
      flags: { critical: 'Critique', amber: 'Ambre', green: 'Vert', pending: 'En attente' },
    },
    fields: {
      name: { label: 'Nom complet', placeholder: 'Marie Tremblay' },
      email: { label: 'Courriel professionnel', placeholder: 'marie@firme.com' },
      company: { label: 'Entreprise', placeholder: 'Nom de la firme' },
      title: { label: 'Titre', placeholder: 'Associée, directrice générale…' },
      phone: { label: 'Téléphone', placeholder: '+1 (514) 555-0142' },
    },
  },
  step5: {
    heading: 'Votre demande de séance est enregistrée.',
    lede: "Un associé de Vanture vous contactera en un jour ouvrable. Prévoyez un appel confidentiel de 30 minutes pour passer en revue votre signal préliminaire et déterminer si une DVTA complète est la bonne prochaine étape.",
    summaryTitle: "Votre séance en un coup d'œil",
    labels: {
      role: 'Rôle',
      intent: 'Intention',
      revenue: 'Tranche de revenus',
      industry: 'Secteur',
      geo: 'Territoire',
      signal: 'Signal préliminaire',
    },
  },
}

export function getBriefingContent(locale: Locale): BriefingContent {
  return locale === 'fr-ca' ? FR : EN
}
