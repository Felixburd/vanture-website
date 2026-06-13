// Load .env (tsx does not do this automatically; Node 21+ provides loadEnvFile).
try {
  process.loadEnvFile()
} catch {
  /* env already present */
}

import { getPayload } from 'payload'
import config from '@payload-config'
import type { Payload } from 'payload'

const PORTAL = 'https://portal.vanture.capital/webhook/vanture-briefing'

// ── link helpers ──────────────────────────────────────────────────────────
const booking = (label: string) => ({ link: { type: 'booking' as const, label } })
const custom = (url: string, label: string, newTab = false) => ({
  link: { type: 'custom' as const, url, label, newTab },
})

// ── lexical rich-text helpers ───────────────────────────────────────────────
const txt = (text: string, bold = false) => ({
  type: 'text',
  text,
  format: bold ? 1 : 0,
  detail: 0,
  mode: 'normal',
  style: '',
  version: 1,
})
const a = (text: string, url: string) => ({
  type: 'link',
  fields: { linkType: 'custom', url, newTab: true },
  format: '',
  indent: 0,
  version: 2,
  direction: 'ltr',
  children: [txt(text)],
})
const p = (children: unknown[]) => ({
  type: 'paragraph',
  format: '',
  indent: 0,
  version: 1,
  direction: 'ltr',
  textFormat: 0,
  children,
})
const richText = (paras: unknown[]) => ({
  root: { type: 'root', format: '', indent: 0, version: 1, direction: 'ltr' as const, children: paras },
})

async function uploadImage(payload: Payload, url: string, alt: string) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status}`)
  const buffer = Buffer.from(await res.arrayBuffer())
  const name = decodeURIComponent(url.split('/').pop() || 'image.jpg')
  const doc = await payload.create({
    collection: 'media',
    data: { alt },
    file: {
      data: buffer,
      mimetype: res.headers.get('content-type') || 'image/jpeg',
      name,
      size: buffer.length,
    },
  })
  return doc.id
}

const IMG = {
  agency:
    'https://cdn.prod.website-files.com/6a108e4f6aac487ad29139a7/6a109419d003d7b727e04097_pexels-photo-7675029.jpeg',
  saas: 'https://cdn.prod.website-files.com/6a108e4f6aac487ad29139a7/6a10941931c483ab8f15d508_pexels-photo-6803542.jpeg',
  ecom: 'https://cdn.prod.website-files.com/6a108e4f6aac487ad29139a7/6a109418dc9c4de6766aa261_pexels-photo-6170405.jpeg',
  msp: 'https://cdn.prod.website-files.com/6a108e4f6aac487ad29139a7/6a1094181253c6442795c723_pexels-photo-37605911.jpeg',
  logo: 'https://cdn.prod.website-files.com/694f82d3ab726ade91d3acc4/694f8420fd4e67d5bc2c4e94_Fichier%201.png',
}

async function seed() {
  const payload = await getPayload({ config })
  payload.logger.info('— Seeding Vanture content —')

  // Wipe content collections for a clean re-seed (subscribers are preserved).
  for (const collection of ['pages', 'caseStudies', 'media'] as const) {
    const all = await payload.find({ collection, limit: 500, locale: 'en' })
    for (const doc of all.docs) await payload.delete({ collection, id: doc.id })
  }

  // Admin user
  const users = await payload.find({ collection: 'users', limit: 1 })
  if (users.totalDocs === 0) {
    await payload.create({
      collection: 'users',
      data: { email: 'felix@hubelia.com', password: 'ChangeMe!2026', name: 'Felix Burt' },
    })
    payload.logger.info('Created admin user felix@hubelia.com (password: ChangeMe!2026)')
  }

  // Images
  const agency = await uploadImage(payload, IMG.agency, 'Marketing team working at a desktop computer')
  const saas = await uploadImage(payload, IMG.saas, 'Developer coding on a laptop in a modern office')
  const ecom = await uploadImage(payload, IMG.ecom, 'Warehouse worker inspecting shipment packages')
  const msp = await uploadImage(payload, IMG.msp, 'IT professional managing systems in a server room')
  const logo = await uploadImage(payload, IMG.logo, 'Vanture')

  // ── Globals ────────────────────────────────────────────────────────────
  await payload.updateGlobal({
    slug: 'siteSettings',
    locale: 'en',
    data: {
      bookingUrl: PORTAL,
      siteName: 'Vanture',
      defaultSeo: {
        title: 'Vanture — Digital Value & Transferability Assessment (DVTA)',
        description:
          "Vanture's DVTA converts operational reality into decision-grade deal terms. Independent diligence delivering PROCEED, REPRICE, or NO_GO signals in roughly 30 days.",
        image: agency,
      },
    },
  })
  await payload.updateGlobal({
    slug: 'siteSettings',
    locale: 'fr-ca',
    data: {
      defaultSeo: {
        title: 'Vanture — Évaluation de la valeur et de la transférabilité numériques (DVTA)',
        description:
          "La DVTA de Vanture transforme la réalité opérationnelle en conditions de transaction décisionnelles. Une diligence indépendante livrant des signaux PROCEED, REPRICE ou NO_GO en environ 30 jours.",
      },
    },
  })

  await payload.updateGlobal({
    slug: 'header',
    locale: 'en',
    data: {
      logo,
      cta: { type: 'booking', label: 'Book a briefing' },
      navItems: [
        custom('/', 'Home'),
        custom('/#dvta', 'DVTA'),
        custom('/case-studies', 'Case Studies'),
        custom('/about', 'About us'),
      ],
    },
  })
  await payload.updateGlobal({
    slug: 'header',
    locale: 'fr-ca',
    data: {
      cta: { type: 'booking', label: 'Réservez une séance' },
      navItems: [
        custom('/', 'Accueil'),
        custom('/#dvta', 'DVTA'),
        custom('/case-studies', 'Études de cas'),
        custom('/about', 'À propos de nous'),
      ],
    },
  })

  await payload.updateGlobal({
    slug: 'footer',
    locale: 'en',
    data: {
      newsletterHeading: 'Stay informed',
      newsletterBody: 'Get updates on operational governance',
      newsletterDisclaimer: 'We respect your privacy. Unsubscribe anytime.',
      legalName: 'Vanture. All rights reserved.',
      socialLinks: [{ platform: 'LinkedIn', url: 'https://www.linkedin.com/company/hubelia/' }],
    },
  })
  await payload.updateGlobal({
    slug: 'footer',
    locale: 'fr-ca',
    data: {
      newsletterHeading: 'Restez informé',
      newsletterBody: 'Recevez des mises à jour sur la gouvernance opérationnelle',
      newsletterDisclaimer:
        'Nous respectons votre vie privée. Vous pouvez vous désabonner à tout moment.',
      legalName: 'Vanture. Tous droits réservés.',
    },
  })

  // ── Home page ────────────────────────────────────────────────────────────
  const homeEN = [
    {
      blockType: 'hero',
      headline: "The financials were clean. The business wasn't.",
      subhead:
        "Vanture's DVTA uncovers the operational risks that traditional due diligence was never built to find. Key-person dependencies, undocumented revenue, fragile processes, caught before the wire goes through.",
      buttons: [booking('Book a confidential briefing'), custom('/#dvta', 'DVTA')],
    },
    {
      blockType: 'stats',
      eyebrow: 'The question traditional due diligence never asks',
      heading: 'Can this business operate without its current owner?',
      body: "Where is money leaking through informal processes? What breaks when accountability changes? If the answer is unclear, and the deal closes anyway, you don't own a business. You own a dependency with a countdown timer.",
      stats: [
        { value: '47%', label: 'of failures trace to technology and operational integration', source: 'Industry Research' },
        { value: '30%', label: 'of integrations fail because of issues that existed pre-close', source: 'Deloitte' },
        { value: '40–60%', label: 'of expected synergies depend on IT and ops integration', source: 'McKinsey' },
      ],
    },
    {
      blockType: 'dvtaPanel',
      panelLabel: 'DVTA · Target assessment',
      tabs: [
        { label: 'Summary' }, { label: 'Revenue' }, { label: 'Execution' },
        { label: 'Spending' }, { label: 'Decision' }, { label: 'Valuation' },
      ],
      scoreCards: [
        { label: 'L1 Revenue Quality', value: 61, status: 'AMBER' },
        { label: 'L2 Delivery Proof', value: 48, status: 'CRITICAL' },
        { label: 'L3 Spending Control', value: 71, status: 'GREEN' },
        { label: 'L4 Key Person Risk', value: 39, status: 'CRITICAL' },
      ],
      findings: [
        { finding: '200 invoices issued, zero client contracts on file', lens: 'Revenue', status: 'CRITICAL' },
        { finding: 'No project-management system; delivery unprovable', lens: 'Execution', status: 'CRITICAL' },
        { finding: 'Spend controls present but 35% of spend uncontracted', lens: 'Spending', status: 'AMBER' },
        { finding: 'Founder signs every invoice and payment (bus factor 1)', lens: 'Key Person', status: 'CRITICAL' },
        { finding: 'Credit notes accelerating 1.8× quarter over quarter', lens: 'Revenue', status: 'AMBER' },
      ],
      decision: {
        signal: 'PROCEED_WITH_CONDITIONS.',
        text: 'T2 (Execution) and T5 (Key Person) CRITICAL. 28% valuation haircut recommended; 90-day remediation and escrow advised.',
      },
      heading: 'Four lenses. Four scores. One question due diligence never asked.',
      body: 'The Digital Value & Transferability Assessment evaluates every target through four governance lenses that traditional DD structurally cannot examine. Each lens produces a deterministic score from 0–100.',
      buttons: [booking('Book a confidential briefing'), custom('/case-studies', 'Case Studies')],
    },
    {
      blockType: 'lenses',
      eyebrow: 'Our four lenses',
      heading: "What DVTA examines, that due diligence doesn't.",
      body: 'When acquisitions fail, the root causes usually cluster into four categories. DVTA examines each one with evidence, not interviews.',
      lenses: [
        { code: 'L1', title: 'Revenue Quality', description: "Is revenue earned under explicit conditions, or informal agreements that won't survive a change of ownership?", failurePercent: '32%', failureLabel: 'of M&A failures' },
        { code: 'L2', title: 'Execution Proof', description: 'Can delivery be objectively proven, or does “done” mean whatever one person decides it means?', failurePercent: '28%', failureLabel: 'of M&A failures' },
        { code: 'L3', title: 'Spending Control', description: 'When does cost become unavoidable, and is that moment governed, or does it just happen?', failurePercent: '18%', failureLabel: 'of M&A failures' },
        { code: 'L4', title: 'Key-Person Risk', description: "If three people left tomorrow, would the business survive the month if their job wasn't documented?", failurePercent: '22%', failureLabel: 'of M&A failures' },
      ],
    },
    {
      blockType: 'audience',
      cards: [
        { eyebrow: 'Partner', title: 'For M&A Advisors', body: "You've spent months on a mandate. Then post-close integration unravels what nobody tested.", buttons: [custom('/case-studies', 'Case studies')] },
        { title: 'For Owners', body: "A buyer's DVTA is coming, whether you commission one or not.", buttons: [booking('Book a briefing')] },
        { title: 'For Buyers', body: 'Test whether the business survives without its founder.', buttons: [booking('Book a briefing')] },
        { title: 'For Mergers', body: "Pressure-test the target's operations before the deal closes and avoid the integration surprises that erode value.", buttons: [booking('Book a briefing')] },
      ],
    },
    {
      blockType: 'comparison',
      eyebrow: 'The difference',
      heading: "DVTA doesn't compete with your DD. It completes it.",
      colTraditional: 'Traditional DD',
      colDvta: 'DVTA',
      rows: [
        { dimension: 'Truth anchor', traditional: 'Management interviews', dvta: 'Accounting data (mandatory)' },
        { dimension: 'Process view', traditional: 'Declared processes', dvta: 'Event lineage, actual behavior' },
        { dimension: 'Uncertainty', traditional: 'Hidden in qualifications', dvta: 'Explicit confidence scores' },
        { dimension: 'Output', traditional: 'Narrative report', dvta: 'Deterministic decision signal' },
        { dimension: 'Reproducibility', traditional: 'Depends on analyst', dvta: 'Same inputs → same outputs' },
        { dimension: 'Timeline', traditional: '4–8 weeks', dvta: '30 days' },
        { dimension: 'Price point', traditional: '$75K–$200K+', dvta: '$35K–$50K' },
      ],
    },
    {
      blockType: 'cta',
      eyebrow: 'Transparent Governance',
      heading: 'The operational record that proves your risk is known.',
      body: 'Vanture deploys the operational record that proves your commitments are real, your exceptions are bounded, and your risk is known.',
      buttons: [booking('Contact'), custom('/about', 'Learn')],
    },
    {
      blockType: 'cta',
      heading: "See what you're actually buying.",
      body: "Before you sign, know what's durable: how revenue is earned, how costs become commitments, and where execution depends on people instead of systems.",
      buttons: [booking('Book a call'), custom('/about', 'About us')],
    },
  ]

  const homeFR = [
    {
      blockType: 'hero',
      headline: "Les finances étaient saines. L'entreprise ne l'était pas.",
      subhead:
        "Le DVTA de Vanture révèle les risques opérationnels que la vérification diligente traditionnelle n'a jamais été conçue pour trouver. Dépendances envers des personnes clés, revenus non documentés, processus fragiles, détectés avant que le virement ne soit effectué.",
      buttons: [booking("Réservez une séance confidentielle"), custom('/#dvta', 'DVTA')],
    },
    {
      blockType: 'stats',
      eyebrow: 'La question que la vérification diligente traditionnelle ne pose jamais',
      heading: 'Cette entreprise peut-elle fonctionner sans son propriétaire actuel?',
      body: "Où l'argent s'échappe-t-il par des processus informels? Qu'est-ce qui se brise lorsque les responsabilités changent? Si la réponse est floue et que la transaction se conclut quand même, vous ne possédez pas une entreprise. Vous possédez une dépendance avec un compte à rebours.",
      stats: [
        { value: '47 %', label: "des échecs sont attribuables à l'intégration technologique et opérationnelle", source: 'Recherche sectorielle' },
        { value: '30 %', label: 'des intégrations échouent en raison de problèmes qui existaient avant la clôture', source: 'Deloitte' },
        { value: '40–60 %', label: "des synergies attendues dépendent de l'intégration des TI et des opérations", source: 'McKinsey' },
      ],
    },
    {
      blockType: 'dvtaPanel',
      panelLabel: 'DVTA · Évaluation de la cible',
      tabs: [
        { label: 'Sommaire' }, { label: 'Revenus' }, { label: 'Exécution' },
        { label: 'Dépenses' }, { label: 'Décision' }, { label: 'Valorisation' },
      ],
      scoreCards: [
        { label: 'L1 Qualité des revenus', value: 61, status: 'AMBER' },
        { label: "L2 Preuve d'exécution", value: 48, status: 'CRITICAL' },
        { label: 'L3 Contrôle des dépenses', value: 71, status: 'GREEN' },
        { label: 'L4 Risque personnes clés', value: 39, status: 'CRITICAL' },
      ],
      findings: [
        { finding: '200 factures émises, aucun contrat client au dossier', lens: 'Revenus', status: 'CRITICAL' },
        { finding: "Aucun système de gestion de projet; livraison non prouvable", lens: 'Exécution', status: 'CRITICAL' },
        { finding: '35 % des dépenses sans contrat', lens: 'Dépenses', status: 'AMBER' },
        { finding: 'Le fondateur signe chaque facture et chaque paiement (facteur bus 1)', lens: 'Personnes clés', status: 'CRITICAL' },
        { finding: 'Notes de crédit en hausse de 1,8× trimestre après trimestre', lens: 'Revenus', status: 'AMBER' },
      ],
      decision: {
        signal: 'PROCEED_WITH_CONDITIONS.',
        text: "T2 (Exécution) et T5 (Personnes clés) CRITIQUES. Décote de valorisation de 28 % recommandée; remédiation sur 90 jours et entiercement conseillés.",
      },
      heading: "Quatre perspectives. Quatre scores. Une question que la vérification diligente n'a jamais posée.",
      body: "L'évaluation de la valeur numérique et de la transférabilité (DVTA) évalue chaque cible à travers quatre perspectives de gouvernance que la vérification diligente traditionnelle ne peut structurellement pas examiner. Chaque perspective produit un score déterministe de 0 à 100.",
      buttons: [booking("Réservez une séance confidentielle"), custom('/case-studies', 'Études de cas')],
    },
    {
      blockType: 'lenses',
      eyebrow: 'Nos quatre perspectives',
      heading: 'Ce que la DVTA examine, et que la vérification diligente ne fait pas.',
      body: "Lorsque les acquisitions échouent, les causes profondes se regroupent généralement en quatre catégories. La DVTA examine chacune d'elles à l'aide de preuves, et non d'entrevues.",
      lenses: [
        { code: 'L1', title: 'Qualité des revenus', description: 'Les revenus sont-ils générés selon des conditions explicites ou des ententes informelles qui ne survivront pas à un changement de propriétaire?', failurePercent: '32 %', failureLabel: 'des échecs de F&A' },
        { code: 'L2', title: "Preuve d'exécution", description: "La livraison peut-elle être prouvée objectivement, ou est-ce que « fait » signifie ce qu'une seule personne décide que cela signifie?", failurePercent: '28 %', failureLabel: 'des échecs de F&A' },
        { code: 'L3', title: 'Contrôle des dépenses', description: 'Quand les coûts deviennent-ils inévitables, et ce moment est-il contrôlé, ou cela arrive-t-il simplement?', failurePercent: '18 %', failureLabel: 'des échecs de F&A' },
        { code: 'L4', title: 'Risque lié aux personnes clés', description: "Si trois personnes partaient demain, l'entreprise survivrait-elle le mois si leur travail n'était pas documenté?", failurePercent: '22 %', failureLabel: 'des échecs de F&A' },
      ],
    },
    {
      blockType: 'audience',
      cards: [
        { eyebrow: 'Partenaires', title: 'Pour les conseillers en F&A', body: "Vous avez passé des mois sur un mandat. Puis l'intégration post-clôture révèle ce que personne n'a testé.", buttons: [custom('/case-studies', 'Études de cas')] },
        { title: 'Pour les propriétaires', body: "Une DVTA d'acheteur s'en vient, que vous en commandiez une ou non.", buttons: [booking('Réservez une séance')] },
        { title: 'Pour les acheteurs', body: "Vérifiez si l'entreprise survit sans son fondateur.", buttons: [booking('Réservez une séance')] },
        { title: 'Pour les fusions', body: "Mettez à l'épreuve les opérations de la cible avant la clôture de la transaction et évitez les surprises d'intégration qui érodent la valeur.", buttons: [booking('Réservez une séance')] },
      ],
    },
    {
      blockType: 'comparison',
      eyebrow: 'La différence',
      heading: 'Le DVTA ne fait pas concurrence à votre DD. Il le complète.',
      colTraditional: 'DD traditionnel',
      colDvta: 'DVTA',
      rows: [
        { dimension: 'Ancrage de la vérité', traditional: 'Entretiens avec la direction', dvta: 'Données comptables (obligatoire)' },
        { dimension: 'Vue des processus', traditional: 'Processus déclarés', dvta: 'Lignage des événements, comportement réel' },
        { dimension: 'Incertitude', traditional: 'Caché dans les réserves', dvta: 'Scores de confiance explicites' },
        { dimension: 'Sortie', traditional: 'Rapport narratif', dvta: 'Signal de décision déterministe' },
        { dimension: 'Reproductibilité', traditional: "Dépend de l'analyste", dvta: 'Mêmes entrées → mêmes sorties' },
        { dimension: 'Échéancier', traditional: '4 à 8 semaines', dvta: '30 jours' },
        { dimension: 'Fourchette de prix', traditional: '75 k$ à 200 k$+', dvta: '35 k$ à 50 k$' },
      ],
    },
    {
      blockType: 'cta',
      eyebrow: 'Gouvernance transparente',
      heading: 'Le registre opérationnel qui prouve que votre risque est connu.',
      body: 'Vanture déploie le registre opérationnel qui prouve que vos engagements sont réels, que vos exceptions sont encadrées et que votre risque est connu.',
      buttons: [booking('Contact'), custom('/about', 'En savoir plus')],
    },
    {
      blockType: 'cta',
      heading: 'Voyez ce que vous achetez réellement.',
      body: "Avant de signer, sachez ce qui est durable : comment les revenus sont générés, comment les coûts deviennent des engagements et où l'exécution dépend des personnes plutôt que des systèmes.",
      buttons: [booking('Réserver un appel'), custom('/about', 'À propos de nous')],
    },
  ]

  const home = await payload.create({
    collection: 'pages',
    locale: 'en',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: { title: 'Home', slug: 'home', layout: homeEN as any },
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await payload.update({ collection: 'pages', id: home.id, locale: 'fr-ca', data: { title: 'Accueil', layout: homeFR as any } })

  // ── About page ─────────────────────────────────────────────────────────
  const aboutEN = [
    {
      blockType: 'hero',
      headline: 'Built by operators. Bought by capital. Designed for both.',
      subhead:
        'Vanture is the governance methodology that came out of running businesses, not advising them. Ten years operating Quebec SMEs taught us where value quietly leaks: undocumented processes, founder-held relationships, revenue that exists on a handshake. DVTA codifies what we found.',
      buttons: [booking('Book a briefing')],
    },
    {
      blockType: 'richText',
      heading: 'About us',
      content: richText([
        p([
          txt(
            "Vanture is a Montréal-based governance firm built around a single observation: a company's value lives in its processes, not only in its financial statements. We saw it firsthand operating ",
          ),
          a('Hubelia', 'https://www.hubelia.com'),
          txt(
            ', a custom-software and operations practice serving Quebec SMEs since 2015. The pattern repeated across hundreds of mandates: clean books, broken processes, revenue tied to relationships nobody had documented, founders who were the system. So we built DVTA, the Digital Value & Transferability Assessment, to measure what traditional due diligence structurally cannot.',
          ),
        ]),
        p([
          txt('Today, Vanture operates four entities under one thesis. Vanture is the methodology and the M&A governance work. '),
          a('Hubelia', 'https://www.hubelia.com'),
          txt(' is custom software and operational implementation. '),
          a('Hubelia Agentics', 'https://www.hubelia.com'),
          txt(' builds operational AI. Interbroker handles data translation and restructuring in M&A. Diagnostic, remediation, and infrastructure under one roof, which is why the methodology has teeth: we don’t just find the gap, we have the people who can close it.'),
        ]),
      ]),
    },
    {
      blockType: 'cta',
      heading: "See what you're actually buying.",
      body: "Before you sign, know what's durable: how revenue is earned, how costs become commitments, and where execution depends on people instead of systems.",
      buttons: [booking('Book a call'), custom('/case-studies', 'Case studies')],
    },
  ]

  const aboutFR = [
    {
      blockType: 'hero',
      headline: 'Bâti par des opérateurs. Acheté par des investisseurs. Conçu pour les deux.',
      subhead:
        "Vanture est la méthodologie de gouvernance née de l'exploitation d'entreprises, et non du conseil. Dix ans à exploiter des PME québécoises nous ont appris où la valeur s'échappe discrètement : processus non documentés, relations détenues par le fondateur, revenus reposant sur une poignée de main. La DVTA codifie ce que nous avons constaté.",
      buttons: [booking('Réservez une séance')],
    },
    {
      blockType: 'richText',
      heading: 'À propos de nous',
      content: richText([
        p([
          txt(
            "Vanture est une firme de gouvernance établie à Montréal, construite autour d'une seule observation : la valeur d'une entreprise réside dans ses processus, et non uniquement dans ses états financiers. Nous l'avons constaté de première main en exploitant ",
          ),
          a('Hubelia', 'https://www.hubelia.com'),
          txt(
            ", une pratique de logiciel sur mesure et d'opérations au service des PME québécoises depuis 2015. Le schéma s'est répété sur des centaines de mandats : des livres propres, des processus brisés, des revenus liés à des relations que personne n'avait documentées, des fondateurs qui étaient le système. Nous avons donc créé la DVTA, l'évaluation de la valeur et de la transférabilité numériques, pour mesurer ce que la vérification diligente traditionnelle ne peut structurellement pas mesurer.",
          ),
        ]),
        p([
          txt('Aujourd’hui, Vanture exploite quatre entités sous une même thèse. Vanture, c’est la méthodologie et le travail de gouvernance en F&A. '),
          a('Hubelia', 'https://www.hubelia.com'),
          txt(', c’est le logiciel sur mesure et la mise en œuvre opérationnelle. '),
          a('Hubelia Agentics', 'https://www.hubelia.com'),
          txt(" développe l'IA opérationnelle. Interbroker gère la traduction et la restructuration des données en F&A. Diagnostic, remédiation et infrastructure sous un même toit, ce qui donne du mordant à la méthodologie : nous ne faisons pas que trouver l'écart, nous avons les gens pour le combler."),
        ]),
      ]),
    },
    {
      blockType: 'cta',
      heading: 'Voyez ce que vous achetez réellement.',
      body: "Avant de signer, sachez ce qui est durable : comment les revenus sont générés, comment les coûts deviennent des engagements et où l'exécution dépend des personnes plutôt que des systèmes.",
      buttons: [booking('Réserver un appel'), custom('/case-studies', 'Études de cas')],
    },
  ]

  const about = await payload.create({
    collection: 'pages',
    locale: 'en',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: { title: 'About', slug: 'about', layout: aboutEN as any },
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await payload.update({ collection: 'pages', id: about.id, locale: 'fr-ca', data: { title: 'À propos', layout: aboutFR as any } })

  // ── Case studies ──────────────────────────────────────────────────────
  const caseStudies = buildCaseStudies({ agency, saas, ecom, msp })
  for (const cs of caseStudies) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const created = await payload.create({ collection: 'caseStudies', locale: 'en', data: cs.en as any })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await payload.update({ collection: 'caseStudies', id: created.id, locale: 'fr-ca', data: cs.fr as any })
  }

  payload.logger.info('— Seed complete —')
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildCaseStudies(img: { agency: any; saas: any; ecom: any; msp: any }) {
  return [
    {
      en: {
        title: "The agency whose numbers wouldn't survive a new owner",
        slug: 'agency-no-go',
        industry: 'Marketing & creative agency',
        heroImage: img.agency,
        publishedDate: '2026-05-22',
        ebitdaLabel: '~$800K',
        askingPriceLabel: '$4M',
        cardSummary: 'Marketing & creative agency · ~$800K reported EBITDA · $4M asking price',
        decisionSignal: 'NO_GO',
        decisionSignalLabel: 'NO_GO',
        twoViews: {
          traditional: 'The revenue is accurate. EBITDA is $800K. The agency has been profitable for three years. Close the deal.',
          dvta: 'The numbers are accurate. They are also not transferable. Without the current owner, this business does not produce them.',
        },
        setup:
          'A mid-market private equity firm was preparing to acquire a marketing and creative agency for $4M — a 5x multiple on $800K of reported EBITDA. Quality of earnings work had cleared the books. Tax returns matched bank statements. Customer concentration looked manageable across 35 active accounts. On paper, this was a clean deal.',
        surfaced: {
          intro:
            "Across all five assessment lenses, the agency triggered critical findings. The pattern was consistent: revenue, execution, and cost decisions all lived in the founder's head, with no governed system capable of producing them after a handover.",
          metrics: [
            { label: 'Revenue under contract', value: '35%', note: '200 invoices, zero contracts on file' },
            { label: 'Delivery captured in system', value: '25%', note: 'No PM tool, no execution proof' },
            { label: 'Exception rate trajectory', value: '1.8x', note: 'Credit notes accelerating quarter over quarter' },
            { label: 'Operational bus factor', value: '1', note: 'Founder signs every invoice, every payment' },
          ],
        },
        evidence:
          "Two hundred invoices were issued over eighteen months with no underlying client contracts. Revenue recognition relied on the founder's monthly judgement, not a governed rule. Twelve credit notes and eight manual journal entries had been quietly absorbed, with the rate of adjustments accelerating. No project management system existed to prove that work had been delivered. Procurement ran on informal supplier relationships, with thirty-five percent of spend uncontracted.",
        decisionImpact: {
          body: 'DVTA returned a NO_GO decision signal with 72% confidence. The buyer walked away from the $4M deal before signing.\n\nThe recommendation was not “negotiate harder.” The recommendation was that the business had no governable operations to acquire — only goodwill tied to one person. The seller was invited to reassess in six months after implementing basic systems.',
          stats: [
            { label: 'Signal', value: 'NO_GO' },
            { label: 'Confidence', value: '72%' },
            { label: 'Outcome', value: 'Walked away' },
          ],
        },
        takeaway:
          'Traditional due diligence asks whether the numbers are accurate. DVTA asks whether those numbers will hold up under a different owner. Verified revenue that disappears post-acquisition is a liability, not an asset.',
      },
      fr: {
        title: "L'agence dont les chiffres ne survivraient pas à un nouveau propriétaire",
        industry: 'Agence de marketing et de création',
        ebitdaLabel: '~800 k$',
        askingPriceLabel: '4 M$',
        cardSummary: 'Agence de marketing et de création · ~800 k$ de BAIIA déclaré · prix demandé de 4 M$',
        decisionSignalLabel: 'NO_GO',
        twoViews: {
          traditional: "Les revenus sont exacts. Le BAIIA est de 800 k$. L'agence est rentable depuis trois ans. Concluez la transaction.",
          dvta: "Les chiffres sont exacts. Ils ne sont pas non plus transférables. Sans le propriétaire actuel, cette entreprise ne les produit pas.",
        },
        setup:
          "Une société de capital-investissement de marché intermédiaire s'apprêtait à acquérir une agence de marketing et de création pour 4 M$ — un multiple de 5x sur 800 k$ de BAIIA déclaré. Les travaux sur la qualité des bénéfices avaient validé les livres. Les déclarations fiscales concordaient avec les relevés bancaires. La concentration de la clientèle semblait gérable sur 35 comptes actifs. Sur papier, c'était une transaction propre.",
        surfaced: {
          intro:
            "Sur les cinq perspectives d'évaluation, l'agence a déclenché des constats critiques. Le schéma était constant : les décisions de revenus, d'exécution et de coûts vivaient toutes dans la tête du fondateur, sans aucun système encadré capable de les reproduire après un transfert.",
          metrics: [
            { label: 'Revenus sous contrat', value: '35 %', note: '200 factures, aucun contrat au dossier' },
            { label: 'Livraison saisie dans un système', value: '25 %', note: 'Aucun outil de gestion de projet, aucune preuve' },
            { label: 'Trajectoire du taux d’exception', value: '1,8x', note: 'Notes de crédit en accélération trimestre après trimestre' },
            { label: 'Facteur bus opérationnel', value: '1', note: 'Le fondateur signe chaque facture, chaque paiement' },
          ],
        },
        evidence:
          "Deux cents factures ont été émises sur dix-huit mois sans aucun contrat client sous-jacent. La constatation des revenus reposait sur le jugement mensuel du fondateur, et non sur une règle encadrée. Douze notes de crédit et huit écritures manuelles avaient été discrètement absorbées, le rythme des ajustements s'accélérant. Aucun système de gestion de projet n'existait pour prouver que le travail avait été livré. L'approvisionnement reposait sur des relations informelles, 35 % des dépenses étant sans contrat.",
        decisionImpact: {
          body: "La DVTA a renvoyé un signal de décision NO_GO avec une confiance de 72 %. L'acheteur s'est retiré de la transaction de 4 M$ avant de signer.\n\nLa recommandation n'était pas « négociez plus fort ». La recommandation était que l'entreprise n'avait aucune opération gouvernable à acquérir — seulement un achalandage lié à une seule personne. Le vendeur a été invité à réévaluer dans six mois, après la mise en place de systèmes de base.",
          stats: [
            { label: 'Signal', value: 'NO_GO' },
            { label: 'Confiance', value: '72 %' },
            { label: 'Résultat', value: 'Retrait' },
          ],
        },
        takeaway:
          "La vérification diligente traditionnelle demande si les chiffres sont exacts. La DVTA demande si ces chiffres tiendront sous un propriétaire différent. Un revenu vérifié qui disparaît après l'acquisition est un passif, pas un actif.",
      },
    },
    {
      en: {
        title: 'The clean SaaS deal with one person holding the keys',
        slug: 'saas-founder-dependency',
        industry: 'B2B SaaS',
        heroImage: img.saas,
        publishedDate: '2026-05-15',
        ebitdaLabel: '$2M',
        askingPriceLabel: '$10M',
        cardSummary: 'B2B SaaS · $2M EBITDA · $10M asking price',
        decisionSignal: 'PROCEED_WITH_CONDITIONS',
        decisionSignalLabel: 'PROCEED with conditions',
        twoViews: {
          traditional: 'Revenue is clean and recurring. Churn is low. The product works. Close at asking.',
          dvta: 'The business is real. The risk is that everything operationally critical runs through one person. Close, but structure the deal to protect against that.',
        },
        setup:
          'A private equity firm was acquiring a B2B SaaS company as a platform add-on, at $10M against $2M EBITDA — a 5x multiple. The product was solid. Recurring revenue was clean. 150 customers, 147 of them on Stripe auto-billing. Quality of earnings work confirmed the numbers. By every conventional measure, this was the kind of deal that closes quickly.',
        surfaced: {
          intro:
            'Four of five assessment lenses came back strong. Revenue conditions were governed by Stripe. Execution was instantaneous and timestamped. Exceptions were rare and stable. Cost commitments were predictable. The fifth lens — transferability — was the problem.',
          metrics: [
            { label: 'Revenue governance', value: '88', note: '147 of 150 customers on auto-billing' },
            { label: 'Execution integrity', value: '94', note: 'Delivery is the product itself' },
            { label: 'Documentation coverage', value: '20%', note: 'Most systems undocumented' },
            { label: 'Operational bus factor', value: '1', note: 'Only founder holds AWS access' },
          ],
        },
        evidence:
          "The founder was the only person with production AWS credentials. Stripe webhooks routed to the founder's personal email. None of the operational runbooks existed in written form. If the founder were hit by the proverbial bus the morning after closing, the buyer would be acquiring a product nobody on their team could legally or technically operate.",
        decisionImpact: {
          body: 'DVTA returned a PROCEED with conditions signal. The buyer closed the deal — but the structure changed materially.\n\nFinal price came down from $10M to $8.6M, reflecting a 13.9% valuation haircut driven by the transferability gap. $1.3M of that was placed in escrow, released over 12 months only on completion of a documented founder transition: written runbooks for every critical system, credentials transferred to a named successor, and a trained operational backup.\n\nThe deal proceeded. The risk was priced and contractually contained.',
          stats: [
            { label: 'Signal', value: 'PROCEED w/ conditions' },
            { label: 'Final price', value: '$8.6M' },
            { label: 'Escrow', value: '$1.3M / 12mo' },
          ],
        },
        takeaway:
          "A verified business can still be an untransferable one. DVTA prices the gap between 'it works today' and 'it works under new ownership' — and turns it into deal terms instead of a post-close surprise.",
      },
      fr: {
        title: "La transaction SaaS propre où une seule personne détenait les clés",
        industry: 'SaaS B2B',
        ebitdaLabel: '2 M$',
        askingPriceLabel: '10 M$',
        cardSummary: 'SaaS B2B · 2 M$ de BAIIA · prix demandé de 10 M$',
        decisionSignalLabel: 'PROCEED avec conditions',
        twoViews: {
          traditional: 'Les revenus sont propres et récurrents. Le taux de désabonnement est faible. Le produit fonctionne. Concluez au prix demandé.',
          dvta: "L'entreprise est réelle. Le risque, c'est que tout ce qui est opérationnellement critique passe par une seule personne. Concluez, mais structurez la transaction pour s'en protéger.",
        },
        setup:
          "Une société de capital-investissement acquérait une entreprise SaaS B2B comme complément de plateforme, à 10 M$ contre 2 M$ de BAIIA — un multiple de 5x. Le produit était solide. Les revenus récurrents étaient propres. 150 clients, dont 147 en facturation automatique Stripe. Les travaux sur la qualité des bénéfices ont confirmé les chiffres. Selon toutes les mesures conventionnelles, c'était le type de transaction qui se conclut rapidement.",
        surfaced: {
          intro:
            "Quatre des cinq perspectives d'évaluation sont revenues solides. Les conditions de revenus étaient encadrées par Stripe. L'exécution était instantanée et horodatée. Les exceptions étaient rares et stables. Les engagements de coûts étaient prévisibles. La cinquième perspective — la transférabilité — était le problème.",
          metrics: [
            { label: 'Gouvernance des revenus', value: '88', note: '147 des 150 clients en facturation automatique' },
            { label: "Intégrité de l'exécution", value: '94', note: 'La livraison est le produit lui-même' },
            { label: 'Couverture documentaire', value: '20 %', note: 'La plupart des systèmes non documentés' },
            { label: 'Facteur bus opérationnel', value: '1', note: "Seul le fondateur détient l'accès AWS" },
          ],
        },
        evidence:
          "Le fondateur était la seule personne disposant des identifiants AWS de production. Les webhooks Stripe étaient acheminés vers le courriel personnel du fondateur. Aucun des guides opérationnels n'existait sous forme écrite. Si le fondateur était frappé par le proverbial autobus le lendemain de la clôture, l'acheteur acquerrait un produit que personne dans son équipe ne pourrait exploiter légalement ou techniquement.",
        decisionImpact: {
          body: "La DVTA a renvoyé un signal PROCEED avec conditions. L'acheteur a conclu la transaction — mais la structure a changé considérablement.\n\nLe prix final est passé de 10 M$ à 8,6 M$, reflétant une décote de valorisation de 13,9 % attribuable à l'écart de transférabilité. 1,3 M$ de ce montant a été placé en entiercement, débloqué sur 12 mois uniquement à l'achèvement d'une transition documentée du fondateur : guides écrits pour chaque système critique, identifiants transférés à un successeur nommé, et une relève opérationnelle formée.\n\nLa transaction a procédé. Le risque a été chiffré et encadré contractuellement.",
          stats: [
            { label: 'Signal', value: 'PROCEED avec conditions' },
            { label: 'Prix final', value: '8,6 M$' },
            { label: 'Entiercement', value: '1,3 M$ / 12 mois' },
          ],
        },
        takeaway:
          "Une entreprise vérifiée peut tout de même être non transférable. La DVTA chiffre l'écart entre « ça fonctionne aujourd'hui » et « ça fonctionne sous une nouvelle propriété » — et le transforme en conditions de transaction plutôt qu'en surprise post-clôture.",
      },
    },
    {
      en: {
        title: 'The e-commerce business with one supplier holding 60% of its costs',
        slug: 'ecommerce-supplier-concentration',
        industry: 'Direct-to-consumer e-commerce',
        heroImage: img.ecom,
        publishedDate: '2026-05-08',
        ebitdaLabel: '$1.5M',
        askingPriceLabel: '$6M',
        cardSummary: 'Direct-to-consumer e-commerce · $1.5M EBITDA · $6M asking price',
        decisionSignal: 'PROCEED_WITH_CONDITIONS',
        decisionSignalLabel: 'REPRICE',
        twoViews: {
          traditional: 'Revenue is verified. Margins are healthy. Customer base is stable. Proceed at asking.',
          dvta: 'The revenue story is real. The cost story has a single point of failure that nobody negotiated against. Reprice and require contractual protection before close.',
        },
        setup:
          'A strategic buyer was evaluating a direct-to-consumer electronics retailer at $6M against $1.5M EBITDA — a 4x multiple. Shopify ran the storefront cleanly. 15,000 orders over 18 months, refund rate stable at 1.2%, fulfillment timestamps in place. Revenue and execution were governed. The story being sold was a clean, scalable e-commerce operation.',
        surfaced: {
          intro:
            'Four of five lenses came back healthy. The fifth — cost commitments — surfaced a structural risk that quality of earnings work had not flagged: the entire margin profile depended on one supplier relationship with no contract behind it.',
          metrics: [
            { label: 'Revenue governance', value: '91', note: 'Shopify orders timestamped and clean' },
            { label: 'Cost governance', value: '52', note: '9 of 12 suppliers uncontracted' },
            { label: 'Supplier concentration', value: '60%', note: 'Single supplier carrying majority of COGS' },
            { label: 'Exception rate', value: '89', note: 'No manual GL adjustments, refunds stable' },
          ],
        },
        evidence:
          'Three of twelve suppliers operated under written contracts. The remaining nine — including the one carrying 60% of cost of goods sold — operated on handshake terms, with prices and lead times that had drifted informally over years. The current owner had personal relationships with each. A change of ownership exposed the buyer to the risk that the dominant supplier could renegotiate, delay, or walk, with no contractual recourse and no alternative supplier qualified.',
        decisionImpact: {
          body: 'DVTA returned a REPRICE signal. The deal closed, but on materially different terms.\n\nFinal valuation came down from $6M to $5.14M — a 14.2% adjustment reflecting concentrated supply chain risk. The buyer required written supply agreements with the top three suppliers as a condition of closing, plus a 6-month diversification plan to qualify a backup source for the dominant SKUs.\n\nThe seller agreed. The buyer acquired the business with the supply chain risk priced in and contractually contained.',
          stats: [
            { label: 'Signal', value: 'REPRICE' },
            { label: 'Final price', value: '$5.14M' },
            { label: 'Adjustment', value: '-14.2%' },
          ],
        },
        takeaway:
          'A healthy P&L can hide a fragile supply chain. DVTA looks past the income statement to the operational dependencies that make those numbers possible — and surfaces them in time to be negotiated.',
      },
      fr: {
        title: "L'entreprise de commerce électronique dont un fournisseur portait 60 % des coûts",
        industry: 'Commerce électronique direct au consommateur',
        ebitdaLabel: '1,5 M$',
        askingPriceLabel: '6 M$',
        cardSummary: 'Commerce électronique direct au consommateur · 1,5 M$ de BAIIA · prix demandé de 6 M$',
        decisionSignalLabel: 'REPRICE',
        twoViews: {
          traditional: 'Les revenus sont vérifiés. Les marges sont saines. La clientèle est stable. Procédez au prix demandé.',
          dvta: "L'histoire des revenus est réelle. L'histoire des coûts comporte un point de défaillance unique contre lequel personne n'a négocié. Réévaluez le prix et exigez une protection contractuelle avant la clôture.",
        },
        setup:
          "Un acheteur stratégique évaluait un détaillant d'électronique direct au consommateur à 6 M$ contre 1,5 M$ de BAIIA — un multiple de 4x. Shopify exploitait la vitrine proprement. 15 000 commandes sur 18 mois, taux de remboursement stable à 1,2 %, horodatages d'exécution en place. Les revenus et l'exécution étaient encadrés. L'histoire vendue était celle d'une opération de commerce électronique propre et évolutive.",
        surfaced: {
          intro:
            "Quatre des cinq perspectives sont revenues saines. La cinquième — les engagements de coûts — a révélé un risque structurel que les travaux sur la qualité des bénéfices n'avaient pas signalé : tout le profil de marge dépendait d'une seule relation fournisseur sans contrat derrière.",
          metrics: [
            { label: 'Gouvernance des revenus', value: '91', note: 'Commandes Shopify horodatées et propres' },
            { label: 'Gouvernance des coûts', value: '52', note: '9 des 12 fournisseurs sans contrat' },
            { label: 'Concentration des fournisseurs', value: '60 %', note: 'Un seul fournisseur porte la majorité du coût des marchandises' },
            { label: "Taux d'exception", value: '89', note: 'Aucun ajustement manuel au grand livre, remboursements stables' },
          ],
        },
        evidence:
          "Trois des douze fournisseurs opéraient sous contrats écrits. Les neuf autres — y compris celui portant 60 % du coût des marchandises vendues — fonctionnaient sur parole, avec des prix et des délais qui avaient dérivé de façon informelle au fil des ans. Le propriétaire actuel avait des relations personnelles avec chacun. Un changement de propriété exposait l'acheteur au risque que le fournisseur dominant renégocie, retarde ou parte, sans recours contractuel ni fournisseur de rechange qualifié.",
        decisionImpact: {
          body: "La DVTA a renvoyé un signal REPRICE. La transaction s'est conclue, mais à des conditions sensiblement différentes.\n\nLa valorisation finale est passée de 6 M$ à 5,14 M$ — un ajustement de 14,2 % reflétant le risque concentré de la chaîne d'approvisionnement. L'acheteur a exigé des ententes d'approvisionnement écrites avec les trois principaux fournisseurs comme condition de clôture, ainsi qu'un plan de diversification de 6 mois pour qualifier une source de secours pour les UGS dominantes.\n\nLe vendeur a accepté. L'acheteur a acquis l'entreprise avec le risque de chaîne d'approvisionnement chiffré et encadré contractuellement.",
          stats: [
            { label: 'Signal', value: 'REPRICE' },
            { label: 'Prix final', value: '5,14 M$' },
            { label: 'Ajustement', value: '-14,2 %' },
          ],
        },
        takeaway:
          "Un compte de résultat sain peut cacher une chaîne d'approvisionnement fragile. La DVTA regarde au-delà de l'état des résultats vers les dépendances opérationnelles qui rendent ces chiffres possibles — et les révèle à temps pour être négociées.",
      },
    },
    {
      en: {
        title: 'The clean deal that closed faster because nothing was hiding',
        slug: 'clean-deal-it-msp',
        industry: 'IT managed services provider',
        heroImage: img.msp,
        publishedDate: '2026-05-01',
        ebitdaLabel: '$2.4M',
        askingPriceLabel: '$14M',
        cardSummary: 'IT managed services provider · $2.4M EBITDA · $14M asking price',
        decisionSignal: 'GO',
        decisionSignalLabel: 'PROCEED',
        twoViews: {
          traditional: 'Recurring revenue is real. Client retention is strong. But MSPs are operationally messy — proceed cautiously, expect surprises.',
          dvta: "This business runs on documented systems, not on people. Every claim the seller made can be reproduced by the buyer's team on day one. The operational risk discount you'd normally apply doesn't belong here.",
        },
        setup:
          'A search fund was evaluating an established IT managed services provider serving small and mid-sized businesses. $2.4M EBITDA, $14M asking price — a 5.8x multiple at the high end of the MSP comp range. Two competing bidders were also in the data room. The buyer needed to decide quickly whether to match a higher offer or walk. The risk in MSPs is well known: tribal knowledge in technicians’ heads, undocumented client environments, and key-person dependencies that surface only after closing.',
        surfaced: {
          intro:
            'All five lenses returned green. More importantly, the evidence base behind the scores was unusually deep: governed contracts, ticketing system timestamps, documented runbooks, and a leadership team that had already operated the business through one prior key-person departure.',
          metrics: [
            { label: 'Revenue governance', value: '94', note: 'All clients on signed MSAs with defined SLAs' },
            { label: 'Execution integrity', value: '91', note: 'Ticket-to-invoice traceable end to end' },
            { label: 'Documentation coverage', value: '87%', note: 'Client environments documented in IT Glue' },
            { label: 'Operational bus factor', value: '4', note: 'No single technician irreplaceable' },
          ],
        },
        evidence:
          "Every client environment was documented with current access credentials, network diagrams, and recovery procedures. The ticketing system carried full traceability from client request to technician resolution to billable invoice. Four senior technicians had cross-coverage on every client account, with documented escalation paths. The seller had built the business as if it were already someone else's — which, in DVTA terms, meant it was transferable.",
        decisionImpact: {
          body: 'DVTA returned a PROCEED signal with 91% confidence and no required conditions.\n\nThe buyer moved decisively. They closed at $13.6M — modestly below asking, but without the operational holdbacks and earnouts that competing bidders were demanding. The seller accepted the cleaner structure over the marginally higher gross numbers from other suitors. Time from DVTA delivery to signed LOI: 11 days.\n\nThe buyer’s first 90-day operational review confirmed the assessment: revenue, margins, and client retention tracked as projected. No surprises.',
          stats: [
            { label: 'Signal', value: 'PROCEED' },
            { label: 'Final price', value: '$13.6M' },
            { label: 'LOI time', value: '11 days' },
          ],
        },
        takeaway:
          'A clean DVTA result is not just a green light. It is a negotiating instrument. In a competitive process, the buyer who can quantify the absence of risk moves faster, structures cleaner deals, and wins assets that less-prepared bidders walk away from.',
      },
      fr: {
        title: "La transaction propre qui s'est conclue plus vite parce que rien ne se cachait",
        industry: 'Fournisseur de services gérés en TI',
        ebitdaLabel: '2,4 M$',
        askingPriceLabel: '14 M$',
        cardSummary: 'Fournisseur de services gérés en TI · 2,4 M$ de BAIIA · prix demandé de 14 M$',
        decisionSignalLabel: 'PROCEED',
        twoViews: {
          traditional: 'Les revenus récurrents sont réels. La rétention de la clientèle est forte. Mais les FSG sont opérationnellement désordonnés — procédez prudemment, attendez-vous à des surprises.',
          dvta: "Cette entreprise fonctionne sur des systèmes documentés, pas sur des personnes. Chaque affirmation du vendeur peut être reproduite par l'équipe de l'acheteur dès le premier jour. La décote de risque opérationnel que vous appliqueriez normalement n'a pas sa place ici.",
        },
        setup:
          "Un fonds de recherche évaluait un fournisseur de services gérés en TI établi, au service de petites et moyennes entreprises. 2,4 M$ de BAIIA, prix demandé de 14 M$ — un multiple de 5,8x dans le haut de la fourchette des comparables FSG. Deux soumissionnaires concurrents étaient aussi dans la salle de données. L'acheteur devait décider rapidement s'il égalait une offre plus élevée ou se retirait. Le risque des FSG est bien connu : savoir tribal dans la tête des techniciens, environnements clients non documentés et dépendances envers des personnes clés qui n'apparaissent qu'après la clôture.",
        surfaced: {
          intro:
            "Les cinq perspectives sont revenues au vert. Plus important encore, la base de preuves derrière les scores était exceptionnellement profonde : contrats encadrés, horodatages du système de billetterie, guides documentés et une équipe de direction qui avait déjà exploité l'entreprise à travers un départ antérieur d'une personne clé.",
          metrics: [
            { label: 'Gouvernance des revenus', value: '94', note: 'Tous les clients sous contrats-cadres signés avec SLA définis' },
            { label: "Intégrité de l'exécution", value: '91', note: 'Du billet à la facture, traçable de bout en bout' },
            { label: 'Couverture documentaire', value: '87 %', note: 'Environnements clients documentés dans IT Glue' },
            { label: 'Facteur bus opérationnel', value: '4', note: 'Aucun technicien irremplaçable' },
          ],
        },
        evidence:
          "Chaque environnement client était documenté avec les identifiants d'accès courants, les schémas de réseau et les procédures de récupération. Le système de billetterie offrait une traçabilité complète, de la demande du client à la résolution par le technicien jusqu'à la facture. Quatre techniciens seniors assuraient une couverture croisée sur chaque compte client, avec des chemins d'escalade documentés. Le vendeur avait bâti l'entreprise comme si elle appartenait déjà à quelqu'un d'autre — ce qui, en termes DVTA, signifiait qu'elle était transférable.",
        decisionImpact: {
          body: "La DVTA a renvoyé un signal PROCEED avec une confiance de 91 % et aucune condition requise.\n\nL'acheteur a agi de façon décisive. Il a conclu à 13,6 M$ — modestement sous le prix demandé, mais sans les retenues opérationnelles ni les compléments de prix que les soumissionnaires concurrents exigeaient. Le vendeur a accepté la structure plus propre plutôt que les chiffres bruts marginalement plus élevés d'autres prétendants. Délai entre la livraison de la DVTA et la lettre d'intention signée : 11 jours.\n\nLe premier examen opérationnel de 90 jours de l'acheteur a confirmé l'évaluation : revenus, marges et rétention de la clientèle conformes aux projections. Aucune surprise.",
          stats: [
            { label: 'Signal', value: 'PROCEED' },
            { label: 'Prix final', value: '13,6 M$' },
            { label: "Délai LI", value: '11 jours' },
          ],
        },
        takeaway:
          "Un résultat DVTA propre n'est pas qu'un feu vert. C'est un instrument de négociation. Dans un processus concurrentiel, l'acheteur qui peut quantifier l'absence de risque agit plus vite, structure des transactions plus propres et remporte des actifs que des soumissionnaires moins préparés abandonnent.",
      },
    },
  ]
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
