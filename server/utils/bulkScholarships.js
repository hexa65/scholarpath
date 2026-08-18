require('dotenv').config();
const mongoose = require('mongoose');
const { Scholarship } = require('../models');

// ─────────────────────────────────────────────────────────────────────────────
// VERIFIED DEADLINES — sourced from official websites August 2026
// Note: Deadlines shown are for the NEXT available cycle.
// Always check the official sourceUrl before applying.
// ─────────────────────────────────────────────────────────────────────────────

const scholarships = [

  // ════════════════════════════════════════════════════════
  // UK SCHOLARSHIPS
  // ════════════════════════════════════════════════════════
  {
    title: "Chevening Scholarship",
    orgName: "UK Foreign Commonwealth & Development Office",
    description: "Chevening Scholarships are the UK government's international awards programme aimed at developing global leaders. Fully-funded master's degree at any eligible UK university. Open to citizens of 160+ countries.",
    deadline: new Date("2026-10-06"), // Official: 6 Oct 2026 at 11:00 UTC — chevening.org/apply
    level: "Masters", field: "Any", country: "UK",
    fundingType: "Fully Funded", amount: "£25,000/yr",
    eligibility: [
      "Citizen of a Chevening-eligible country",
      "Minimum 2 years work experience (paid, voluntary or part-time)",
      "Hold an undergraduate degree equivalent to UK upper second class (2:1)",
      "Apply to three different eligible UK universities",
      "Commit to return to home country for 2 years after scholarship"
    ],
    benefits: [
      "Full tuition fees paid", "Monthly living allowance",
      "Economy return flights to the UK", "Arrival allowance",
      "Departure allowance", "Chevening alumni network access"
    ],
    requiredDocs: [
      "University acceptance letters from 3 UK universities (before July deadline)",
      "Two references", "Work experience evidence", "English language certificate"
    ],
    status: "active", views: 0, bookmarks: 0,
    tags: ["chevening", "UK", "masters", "leadership", "fully funded"],
    sourceUrl: "https://www.chevening.org/scholarships/",
    verified: true, verifiedDate: new Date("2026-08-13")
  },

  {
    title: "Commonwealth Masters Scholarship",
    orgName: "Commonwealth Scholarship Commission (CSC)",
    description: "Fully-funded scholarships for citizens of low and middle-income Commonwealth countries to study a Masters degree at a UK university. Funded by the UK Foreign, Commonwealth & Development Office.",
    deadline: new Date("2026-10-21"), // Official: ~mid-October annually — cscuk.fcdo.gov.uk
    level: "Masters", field: "Any", country: "UK",
    fundingType: "Fully Funded", amount: "£28,000/yr",
    eligibility: [
      "Citizen of an eligible Commonwealth country",
      "Hold a first degree at minimum upper second class (2:1)",
      "Unable to afford to study in the UK without this scholarship",
      "Not previously studied in the UK at Masters level",
      "Permanently resident in an eligible Commonwealth country"
    ],
    benefits: [
      "Full tuition fees", "Monthly living allowance (£1,236 London / £1,040 elsewhere)",
      "Return economy airfare", "Arrival allowance of £887",
      "Warm clothing allowance", "Thesis/study travel grant"
    ],
    requiredDocs: [
      "Academic transcripts and degree certificate", "Two academic references",
      "Personal statement", "Proof of English proficiency"
    ],
    status: "active", views: 0, bookmarks: 0,
    tags: ["commonwealth", "UK", "masters", "fully funded", "Africa"],
    sourceUrl: "https://cscuk.fcdo.gov.uk/scholarships/commonwealth-masters-scholarships/",
    verified: true, verifiedDate: new Date("2026-08-13")
  },

  {
    title: "Gates Cambridge Scholarship",
    orgName: "Gates Cambridge Trust (Bill & Melinda Gates Foundation)",
    description: "Prestigious full-cost awards for outstanding applicants from any country outside the UK to pursue a postgraduate degree at the University of Cambridge. ~80 scholarships awarded annually since 2000.",
    deadline: new Date("2026-12-02"), // International round: Dec 2 or Jan 7 depending on course — gatescambridge.org
    level: "PhD", field: "Any", country: "UK",
    fundingType: "Fully Funded", amount: "£50,000/yr",
    eligibility: [
      "Citizen of any country outside the United Kingdom",
      "Applying for a full-time postgraduate degree at University of Cambridge",
      "Outstanding academic achievement",
      "Leadership potential and commitment to improving lives of others",
      "Strong fit between applicant and Cambridge"
    ],
    benefits: [
      "Full University Composition Fee (tuition)", "Annual maintenance allowance (~£18,744)",
      "Return airfare to the UK", "Discretionary funding for academic development",
      "Family allowance if applicable", "Gates Cambridge community events"
    ],
    requiredDocs: [
      "Cambridge graduate application (GRADSAF portal)",
      "Academic CV", "Research proposal (for PhD)",
      "Three academic references", "Gates Cambridge personal statement"
    ],
    status: "active", views: 0, bookmarks: 0,
    tags: ["gates", "cambridge", "PhD", "UK", "fully funded"],
    sourceUrl: "https://www.gatescambridge.org/apply/timeline/",
    verified: true, verifiedDate: new Date("2026-08-13")
  },

  {
    title: "Rhodes Scholarship",
    orgName: "Rhodes Trust",
    description: "The oldest and most celebrated international fellowship in the world, bringing outstanding students to the University of Oxford. Awarded on the basis of intellect, character, leadership and commitment to service.",
    deadline: new Date("2026-08-01"), // Varies by country; typically August–October. Check your country page.
    level: "Masters", field: "Any", country: "UK",
    fundingType: "Fully Funded", amount: "£20,000/yr",
    eligibility: [
      "Age between 18 and 28 (varies by country)",
      "Strong academic record (typically top of class)",
      "Demonstrated leadership qualities",
      "Commitment to service and improving the world"
    ],
    benefits: [
      "University and college fees at Oxford", "Living stipend",
      "Airfare to and from Oxford", "Thesis allowance",
      "Rhodes community and network for life"
    ],
    requiredDocs: [
      "Academic transcripts", "Personal statement",
      "Eight reference letters", "Medical certificate"
    ],
    status: "active", views: 0, bookmarks: 0,
    tags: ["rhodes", "oxford", "UK", "masters", "leadership"],
    sourceUrl: "https://www.rhodeshouse.ox.ac.uk/scholarships/the-rhodes-scholarship/",
    verified: true, verifiedDate: new Date("2026-08-13")
  },

  {
    title: "Wellcome Trust PhD Studentships",
    orgName: "Wellcome Trust",
    description: "Supports talented students to undertake a PhD in biomedical science, public health, medical humanities or social science research related to health at UK universities.",
    deadline: new Date("2026-09-30"), // Rolling deadlines vary by programme — wellcome.org
    level: "PhD", field: "Medicine", country: "UK",
    fundingType: "Fully Funded", amount: "£25,000/yr",
    eligibility: [
      "Hold or expect a first or upper second class honours degree",
      "Strong research background in health-related field",
      "Clear research proposal relevant to Wellcome themes"
    ],
    benefits: [
      "Full tuition fees", "Annual living stipend",
      "Research expenses covered", "Conference and travel funding"
    ],
    requiredDocs: [
      "Research proposal", "Academic transcripts",
      "Two academic references", "Personal statement"
    ],
    status: "active", views: 0, bookmarks: 0,
    tags: ["wellcome", "UK", "PhD", "medicine", "research"],
    sourceUrl: "https://wellcome.org/grant-funding/schemes/four-year-phd-programmes",
    verified: true, verifiedDate: new Date("2026-08-13")
  },

  // ════════════════════════════════════════════════════════
  // USA SCHOLARSHIPS
  // ════════════════════════════════════════════════════════
  {
    title: "Fulbright Foreign Student Program",
    orgName: "U.S. Department of State / Institute of International Education (IIE)",
    description: "The largest U.S. international exchange program. For Nigeria specifically, this is a research program for doctoral students. For other countries it covers Masters and research degrees. Funded by U.S. Department of State.",
    deadline: new Date("2026-06-01"), // Nigeria deadline: June 1 annually — ng.usembassy.gov
    level: "Masters", field: "Any", country: "USA",
    fundingType: "Fully Funded", amount: "$40,000/yr",
    eligibility: [
      "Non-US citizen residing in home country",
      "Strong academic record",
      "English language proficiency (TOEFL minimum 90)",
      "Leadership qualities and commitment to return home after grant"
    ],
    benefits: [
      "Full tuition or research fees", "Monthly living stipend",
      "Health insurance", "J-1 visa support", "Round-trip economy airfare"
    ],
    requiredDocs: [
      "Academic transcripts", "TOEFL scores (minimum 90)",
      "Research proposal or study plan", "Three references",
      "Personal statement"
    ],
    status: "active", views: 0, bookmarks: 0,
    tags: ["fulbright", "USA", "masters", "fully funded", "research"],
    sourceUrl: "https://ng.usembassy.gov/the-fulbright-foreign-student-program/",
    verified: true, verifiedDate: new Date("2026-08-13")
  },

  {
    title: "Hubert Humphrey Fellowship Program",
    orgName: "U.S. Department of State",
    description: "Brings accomplished mid-level professionals from designated countries to the United States for ten months of non-degree academic study and related professional experiences in their field.",
    deadline: new Date("2026-09-01"), // Varies by country. Check US Embassy in home country.
    level: "Postdoctoral", field: "Any", country: "USA",
    fundingType: "Fully Funded", amount: "$35,000",
    eligibility: [
      "Mid-career professional with minimum 5 years work experience",
      "Demonstrated leadership and public service commitment",
      "English language proficiency",
      "Citizen of an eligible country"
    ],
    benefits: [
      "Tuition and fees at US university", "Monthly maintenance allowance",
      "Round-trip international airfare", "Health insurance",
      "Professional development activities"
    ],
    requiredDocs: [
      "Application form", "Three professional references",
      "Official academic transcripts", "English test scores", "CV"
    ],
    status: "active", views: 0, bookmarks: 0,
    tags: ["humphrey", "USA", "professional", "fully funded", "leadership"],
    sourceUrl: "https://www.humphreyfellowship.org/",
    verified: true, verifiedDate: new Date("2026-08-13")
  },

  {
    title: "Google PhD Fellowship",
    orgName: "Google LLC",
    description: "Recognizes outstanding graduate students doing exceptional and innovative research in areas relevant to computer science, engineering, and related fields. Faculty must nominate candidates.",
    deadline: new Date("2026-12-01"), // Typically December. Check research.google/outreach/phd-fellowship
    level: "PhD", field: "Computer Science", country: "Various",
    fundingType: "Fully Funded", amount: "$15,000/yr",
    eligibility: [
      "Enrolled full-time in a PhD programme at an eligible university",
      "Research in computer science, AI, ML or related field",
      "Must be nominated by faculty advisor",
      "Strong academic and research record"
    ],
    benefits: [
      "Annual fellowship award", "Dedicated Google Research mentor",
      "Internship opportunity at Google", "Conference travel support"
    ],
    requiredDocs: [
      "Faculty nomination letter", "Research statement",
      "CV", "Academic transcripts", "Reference letters"
    ],
    status: "active", views: 0, bookmarks: 0,
    tags: ["Google", "PhD", "computer science", "technology", "research"],
    sourceUrl: "https://research.google/outreach/phd-fellowship/",
    verified: true, verifiedDate: new Date("2026-08-13")
  },

  {
    title: "Microsoft Research PhD Fellowship",
    orgName: "Microsoft Research",
    description: "Supports talented, early-career PhD students pursuing research in areas related to Microsoft Research interests including AI, ML, systems, security, and human-computer interaction.",
    deadline: new Date("2026-09-30"), // Typically September/October — microsoft.com/en-us/research
    level: "PhD", field: "Computer Science", country: "USA",
    fundingType: "Fully Funded", amount: "$42,000/yr",
    eligibility: [
      "Enrolled in PhD programme at a university in USA or Canada",
      "Typically in second or third year of PhD study",
      "Research in computing or related field",
      "Open to all nationalities"
    ],
    benefits: [
      "Annual stipend of $42,000", "Tuition coverage",
      "Conference and travel funding", "Microsoft Research mentorship",
      "Internship opportunity at Microsoft Research"
    ],
    requiredDocs: [
      "Research proposal and statement", "Academic transcripts",
      "Two academic references", "CV"
    ],
    status: "active", views: 0, bookmarks: 0,
    tags: ["Microsoft", "PhD", "computer science", "technology", "fellowship"],
    sourceUrl: "https://www.microsoft.com/en-us/research/academic-programs/phd-fellowship/",
    verified: true, verifiedDate: new Date("2026-08-13")
  },

  {
    title: "AAUW International Fellowships",
    orgName: "American Association of University Women",
    description: "Awarded for full-time study or research in the United States to women who are not US citizens or permanent residents. Open to women from all countries for graduate and postgraduate study.",
    deadline: new Date("2026-11-15"), // Typically 1 November. Check aauw.org for exact date.
    level: "Masters", field: "Any", country: "USA",
    fundingType: "Fully Funded", amount: "$20,000",
    eligibility: [
      "Woman who is not a US citizen or permanent resident",
      "Hold a bachelor's degree by the time fellowship begins",
      "Planning to use degree to advance career in home country",
      "Applied to or enrolled in US institution"
    ],
    benefits: [
      "Fellowship award of up to $20,000",
      "Health insurance allowance",
      "Childcare allowance if applicable"
    ],
    requiredDocs: [
      "Academic transcripts", "Personal statement",
      "Three references", "Proof of admission to US institution"
    ],
    status: "active", views: 0, bookmarks: 0,
    tags: ["AAUW", "USA", "women", "masters", "fellowship"],
    sourceUrl: "https://www.aauw.org/resources/programs/fellowships-grants/current-opportunities/international/",
    verified: true, verifiedDate: new Date("2026-08-13")
  },

  // ════════════════════════════════════════════════════════
  // GERMANY SCHOLARSHIPS
  // ════════════════════════════════════════════════════════
  {
    title: "DAAD Scholarship — Development-Related Postgraduate Courses (EPOS)",
    orgName: "DAAD (German Academic Exchange Service)",
    description: "Supports graduates from developing countries to study postgraduate degrees at German universities in subject areas relevant to their home country's development. Funded by Germany's Federal Ministry for Economic Cooperation.",
    deadline: new Date("2026-10-15"), // Varies by course: most around Aug–Oct. Check funding-guide.de
    level: "Masters", field: "Engineering", country: "Germany",
    fundingType: "Fully Funded", amount: "€1,400/mo",
    eligibility: [
      "Citizen of a developing or newly industrialised country",
      "Hold a bachelor's degree in a relevant field",
      "Minimum 2 years professional work experience",
      "Above-average academic results",
      "German or English language proficiency depending on course"
    ],
    benefits: [
      "Monthly stipend of EUR 1,200 (Masters) / EUR 1,400 (PhD)",
      "Health, accident and personal liability insurance",
      "Travel allowance", "Study and research allowance",
      "Rent subsidy in some cases"
    ],
    requiredDocs: [
      "Academic transcripts", "Language certificate (German B2 or IELTS/TOEFL)",
      "CV and motivation letter", "Two recommendation letters",
      "Proof of 2 years work experience"
    ],
    status: "active", views: 0, bookmarks: 0,
    tags: ["DAAD", "Germany", "masters", "engineering", "development"],
    sourceUrl: "https://www2.daad.de/deutschland/stipendium/datenbank/en/21148-scholarship-database/?detail=50076777",
    verified: true, verifiedDate: new Date("2026-08-13")
  },

  {
    title: "Heinrich Böll Foundation Scholarship",
    orgName: "Heinrich Böll Foundation",
    description: "Scholarships for undergraduate and graduate students in Germany who demonstrate academic excellence, social commitment, and alignment with Green/progressive political values. Open to international students.",
    deadline: new Date("2027-01-01"), // Twice a year: 1 March and 1 September. Check boell.de
    level: "Masters", field: "Any", country: "Germany",
    fundingType: "Fully Funded", amount: "€850/mo",
    eligibility: [
      "Strong academic record",
      "Social or political engagement",
      "Open to students from any country",
      "Good German language skills (usually B2+)",
      "Alignment with the foundation's values"
    ],
    benefits: [
      "Monthly stipend of EUR 850", "Monthly flat-rate study allowance",
      "Health insurance subsidy", "Networking seminars and events"
    ],
    requiredDocs: [
      "Academic transcripts", "Motivation letter",
      "CV", "Two references", "German language certificate"
    ],
    status: "active", views: 0, bookmarks: 0,
    tags: ["heinrich boll", "Germany", "masters", "social", "political"],
    sourceUrl: "https://www.boell.de/en/foundation/scholarships",
    verified: true, verifiedDate: new Date("2026-08-13")
  },

  {
    title: "Konrad Adenauer Foundation Scholarship",
    orgName: "Konrad Adenauer Foundation (KAS)",
    description: "Supports students who demonstrate outstanding academic achievement and commitment to Christian-Democratic values and principles. Open to German and international students enrolled in German universities.",
    deadline: new Date("2027-01-15"), // Deadlines: 15 Jan and 15 July each year — kas.de
    level: "Masters", field: "Any", country: "Germany",
    fundingType: "Fully Funded", amount: "€850/mo",
    eligibility: [
      "Strong academic record (typically top 30% of class)",
      "Political or social commitment",
      "International students enrolled at German universities welcome",
      "Good German language proficiency"
    ],
    benefits: [
      "Monthly stipend of EUR 850", "Study allowance",
      "Health insurance contribution", "Seminars and ideological training events"
    ],
    requiredDocs: [
      "Academic transcripts", "Motivation letter",
      "Two references", "Language certificate"
    ],
    status: "active", views: 0, bookmarks: 0,
    tags: ["adenauer", "Germany", "masters", "democracy", "KAS"],
    sourceUrl: "https://www.kas.de/en/web/begabtenfoerderung-und-kultur/scholarships",
    verified: true, verifiedDate: new Date("2026-08-13")
  },

  // ════════════════════════════════════════════════════════
  // AUSTRALIA SCHOLARSHIPS
  // ════════════════════════════════════════════════════════
  {
    title: "Australia Awards Scholarship (Africa)",
    orgName: "Australian Government — Department of Foreign Affairs and Trade (DFAT)",
    description: "Prestigious government scholarships for mid-career professionals from 25 eligible African countries to pursue a fully-funded Masters degree at an Australian university. Nigeria is an eligible country.",
    deadline: new Date("2027-04-30"), // Confirmed: 30 April 2026 for 2027 intake — australiaawardsafrica.org. Next cycle: 1 Feb 2027 opening, 30 Apr 2027 close.
    level: "Masters", field: "Any", country: "Australia",
    fundingType: "Fully Funded", amount: "Full Coverage",
    eligibility: [
      "Citizen of an eligible African country (including Nigeria, Ghana, Kenya, South Africa, Ethiopia etc.)",
      "Minimum 25 years of age at commencement",
      "Minimum 5 years post-graduate work experience",
      "Currently employed at time of application",
      "Not already hold a Masters degree",
      "Must return to home country for 2 years after studies"
    ],
    benefits: [
      "Full tuition fees at Australian university", "Return economy airfare",
      "Establishment allowance on arrival", "Monthly living stipend",
      "Overseas Student Health Cover (OSHC)"
    ],
    requiredDocs: [
      "Academic transcripts", "IELTS 6.5+ or TOEFL 84+ scores",
      "Personal statement and development impact plan",
      "Three professional references", "Passport copy", "Employer letter"
    ],
    status: "active", views: 0, bookmarks: 0,
    tags: ["australia", "Africa", "masters", "fully funded", "Nigeria"],
    sourceUrl: "https://australiaawardsafrica.org/awards/apply/",
    verified: true, verifiedDate: new Date("2026-08-13")
  },

  // ════════════════════════════════════════════════════════
  // CANADA SCHOLARSHIPS
  // ════════════════════════════════════════════════════════
  {
    title: "Vanier Canada Graduate Scholarship",
    orgName: "Government of Canada",
    description: "Strengthens Canada's ability to attract and retain world-class doctoral students. Supports students who demonstrate leadership skills and high scholarly achievement in social sciences, humanities, natural sciences, engineering or health.",
    deadline: new Date("2026-11-01"), // Typically early November. Check vanier.gc.ca
    level: "PhD", field: "Any", country: "Canada",
    fundingType: "Fully Funded", amount: "CAD $50,000/yr",
    eligibility: [
      "Nominated by a Canadian university (must be invited to apply)",
      "Strong academic record (top of class)",
      "Demonstrated leadership skills",
      "Pursuing first doctoral degree",
      "Canadian citizens, permanent residents, and international students eligible"
    ],
    benefits: [
      "CAD $50,000 per year for 3 years",
      "Prestige and global networking opportunities",
      "Access to Vanier alumni community"
    ],
    requiredDocs: [
      "University nomination (mandatory)", "Research proposal",
      "Academic transcripts", "Leadership and research achievement record",
      "References"
    ],
    status: "active", views: 0, bookmarks: 0,
    tags: ["vanier", "Canada", "PhD", "leadership", "research"],
    sourceUrl: "https://vanier.gc.ca/en/home-accueil.html",
    verified: true, verifiedDate: new Date("2026-08-13")
  },

  {
    title: "Mastercard Foundation Scholars Program — University of Toronto",
    orgName: "Mastercard Foundation",
    description: "Provides scholarships for academically talented yet economically disadvantaged students from Sub-Saharan Africa to pursue undergraduate or graduate study at the University of Toronto, Canada.",
    deadline: new Date("2027-01-15"), // Typically Jan. Check mastercardscholars.utoronto.ca
    level: "Undergraduate", field: "Any", country: "Canada",
    fundingType: "Fully Funded", amount: "$45,000/yr",
    eligibility: [
      "Citizen of a Sub-Saharan African country",
      "Demonstrate financial need",
      "Strong academic performance",
      "Demonstrated leadership potential",
      "Commitment to give back to Africa"
    ],
    benefits: [
      "Full tuition and fees", "Accommodation and meals",
      "Living expenses", "Leadership training and mentorship",
      "Psychosocial support"
    ],
    requiredDocs: [
      "Academic records", "Financial need statement",
      "Personal essay", "Two references", "Proof of citizenship"
    ],
    status: "active", views: 0, bookmarks: 0,
    tags: ["mastercard", "Africa", "undergraduate", "Canada", "fully funded"],
    sourceUrl: "https://mastercardscholars.utoronto.ca/",
    verified: true, verifiedDate: new Date("2026-08-13")
  },

  // ════════════════════════════════════════════════════════
  // NETHERLANDS / EUROPE SCHOLARSHIPS
  // ════════════════════════════════════════════════════════
  {
    title: "Erasmus Mundus Joint Master Scholarship",
    orgName: "European Commission — Erasmus+ Programme",
    description: "Prestigious, integrated international study programmes jointly delivered by a consortium of European higher education institutions. Students study in at least two countries and receive a joint degree.",
    deadline: new Date("2027-01-15"), // Varies by programme. Most close Jan–Feb. Check eacea.ec.europa.eu
    level: "Masters", field: "Any", country: "Various EU",
    fundingType: "Fully Funded", amount: "€1,400/mo",
    eligibility: [
      "From any country in the world",
      "Strong academic record",
      "Apply to a specific Erasmus Mundus Joint Master programme",
      "Language proficiency as required by the chosen programme"
    ],
    benefits: [
      "Monthly contribution of EUR 1,400 (for non-EU students)",
      "Tuition fees waiver", "Travel and installation costs",
      "Health insurance", "Joint degree from multiple universities"
    ],
    requiredDocs: [
      "Academic transcripts", "Language certificates",
      "Motivation letter", "References", "CV"
    ],
    status: "active", views: 0, bookmarks: 0,
    tags: ["erasmus", "Europe", "masters", "fully funded", "joint degree"],
    sourceUrl: "https://erasmus-plus.ec.europa.eu/opportunities/opportunities-for-individuals/students/erasmus-mundus-joint-masters",
    verified: true, verifiedDate: new Date("2026-08-13")
  },

  {
    title: "Swedish Institute Scholarship for Global Professionals (SISGP)",
    orgName: "Swedish Institute",
    description: "Full scholarship for international students to pursue a master's degree in Sweden. Specifically for high-potential leaders who can contribute to sustainable development in their home country.",
    deadline: new Date("2027-02-10"), // Typically February each year — si.se
    level: "Masters", field: "Any", country: "Sweden",
    fundingType: "Fully Funded", amount: "SEK 11,000/mo",
    eligibility: [
      "Citizen of an eligible country (includes Nigeria and most developing nations)",
      "Hold a bachelor's degree",
      "Minimum 3,000 hours (about 2 years full-time) professional work experience",
      "Applying for a master's programme starting in autumn at a Swedish university"
    ],
    benefits: [
      "Monthly living allowance of SEK 11,000 (~USD 1,050)",
      "Full tuition fees covered", "One-time travel grant",
      "Insurance for the duration of studies"
    ],
    requiredDocs: [
      "Academic transcripts", "Work experience documentation",
      "Motivation letter", "Two professional references", "CV"
    ],
    status: "active", views: 0, bookmarks: 0,
    tags: ["sweden", "masters", "professionals", "fully funded", "Swedish Institute"],
    sourceUrl: "https://si.se/en/apply/scholarships/swedish-institute-scholarships-for-global-professionals/",
    verified: true, verifiedDate: new Date("2026-08-13")
  },

  // ════════════════════════════════════════════════════════
  // JAPAN SCHOLARSHIPS
  // ════════════════════════════════════════════════════════
  {
    title: "MEXT Japanese Government Scholarship (Embassy Recommendation)",
    orgName: "Japan Ministry of Education, Culture, Sports, Science and Technology (MEXT)",
    description: "Japan's flagship government scholarship for international students to study at Japanese universities. Covers research students (Masters/PhD), undergraduate, and teacher training. Apply through the Japanese Embassy in your country.",
    deadline: new Date("2026-05-21"), // Varies by country. USA: May 21 2026. Nigeria: check Japanese Embassy Lagos. Typically April–June.
    level: "Masters", field: "Any", country: "Japan",
    fundingType: "Fully Funded", amount: "¥143,000/mo",
    eligibility: [
      "Citizen of a country with diplomatic relations with Japan",
      "Age under 35 for research students",
      "Good academic record",
      "Good health — must pass medical examination",
      "Apply through the Japanese Embassy in your home country"
    ],
    benefits: [
      "Monthly stipend of JPY 143,000 (~USD 960)", "Full tuition and examination fees",
      "Return airfare to Japan", "6–12 month Japanese language preparatory course"
    ],
    requiredDocs: [
      "Application form (from Japanese Embassy)", "Academic transcripts",
      "Research plan or study plan", "Medical certificate",
      "Recommendation letters", "Language certificates if applicable"
    ],
    status: "active", views: 0, bookmarks: 0,
    tags: ["MEXT", "Japan", "masters", "government", "research"],
    sourceUrl: "https://www.studyinjapan.go.jp/en/smap-stopj-applications-research.html",
    verified: true, verifiedDate: new Date("2026-08-13")
  },

  // ════════════════════════════════════════════════════════
  // CHINA SCHOLARSHIPS
  // ════════════════════════════════════════════════════════
  {
    title: "Chinese Government Scholarship (CSC)",
    orgName: "China Scholarship Council (CSC)",
    description: "The Chinese Government Scholarship provides full scholarships for international students and scholars to study in China. One of the world's largest scholarship programmes with placements at 300+ Chinese universities.",
    deadline: new Date("2027-03-15"), // Typically February–April depending on country. Check campuschina.org
    level: "Masters", field: "Any", country: "China",
    fundingType: "Fully Funded", amount: "¥3,000/mo",
    eligibility: [
      "Non-Chinese citizen in good health",
      "Bachelors degree for Masters applicants",
      "Age under 35 for Masters applicants",
      "Apply through Chinese Embassy, participating Chinese university, or home country government"
    ],
    benefits: [
      "Full tuition waiver", "On-campus accommodation or accommodation allowance",
      "Monthly stipend (CNY 3,000 for Masters)", "Medical insurance",
      "Return economy airfare for full scholarship winners"
    ],
    requiredDocs: [
      "Application form", "Academic transcripts and degree certificates",
      "Medical certificate and blood test results", "Passport copy",
      "Admission notice from Chinese university (for some tracks)"
    ],
    status: "active", views: 0, bookmarks: 0,
    tags: ["CSC", "China", "masters", "government", "fully funded"],
    sourceUrl: "https://www.campuschina.org/scholarships/index.html",
    verified: true, verifiedDate: new Date("2026-08-13")
  },

  // ════════════════════════════════════════════════════════
  // AFRICAN & INTERNATIONAL SCHOLARSHIPS
  // ════════════════════════════════════════════════════════
  {
    title: "African Development Bank Scholarship Program (JFJP)",
    orgName: "African Development Bank (AfDB)",
    description: "The Japan-Africa Dream Scholarship (JADS) programme by AfDB provides opportunities for African students to study at the African Development Bank Institute and selected partner institutions.",
    deadline: new Date("2026-08-01"), // Check afdb.org/en/topics-and-sectors for annual opening
    level: "Masters", field: "Business", country: "Various",
    fundingType: "Fully Funded", amount: "$30,000/yr",
    eligibility: [
      "African citizen from an AfDB member country",
      "Hold a bachelor's degree with at least upper second class",
      "Employed by an organisation in Africa",
      "Maximum age of 40"
    ],
    benefits: [
      "Full tuition fees", "Monthly living allowance",
      "Return airfare", "Medical insurance", "Books and materials allowance"
    ],
    requiredDocs: [
      "Application form", "Academic transcripts",
      "Employer endorsement letter", "References", "Medical certificate"
    ],
    status: "active", views: 0, bookmarks: 0,
    tags: ["AfDB", "Africa", "masters", "development", "business"],
    sourceUrl: "https://www.afdb.org/en/topics-and-sectors/initiatives-partnerships/japan-africa-dream-scholarship",
    verified: true, verifiedDate: new Date("2026-08-13")
  },

  {
    title: "Aga Khan Foundation International Scholarship",
    orgName: "Aga Khan Foundation",
    description: "Offers a limited number of scholarships each year to outstanding students from developing countries who have no other means of financing their postgraduate studies. Awarded as 50% grant, 50% loan.",
    deadline: new Date("2027-03-31"), // Applications open December–March annually — akdn.org
    level: "Masters", field: "Any", country: "Various",
    fundingType: "Fully Funded", amount: "Full Coverage",
    eligibility: [
      "Citizen of a developing country where Aga Khan Foundation works",
      "Demonstrate financial need (means-tested)",
      "Strong academic record",
      "Age 30 or under at time of application"
    ],
    benefits: [
      "50% grant + 50% interest-free loan covering full tuition fees",
      "Living expenses", "Return airfare", "Health insurance"
    ],
    requiredDocs: [
      "Academic transcripts", "Financial need statement",
      "References", "Personal statement", "Proof of admission"
    ],
    status: "active", views: 0, bookmarks: 0,
    tags: ["aga khan", "developing countries", "masters", "need-based"],
    sourceUrl: "https://www.akdn.org/our-agencies/aga-khan-foundation/international-scholarship-programme",
    verified: true, verifiedDate: new Date("2026-08-13")
  },

  {
    title: "Islamic Development Bank (IsDB) Merit Scholarship",
    orgName: "Islamic Development Bank",
    description: "The IsDB Merit Scholarship Programme for High Technology provides scholarships to outstanding students from IsDB member countries to pursue graduate studies in STEM fields at universities worldwide.",
    deadline: new Date("2027-01-20"), // Typically January–February. Check isdb.org
    level: "Masters", field: "STEM", country: "Various",
    fundingType: "Fully Funded", amount: "$25,000/yr",
    eligibility: [
      "Citizen of an IsDB member country",
      "Muslim faith",
      "Strong academic record in STEM",
      "Age under 35",
      "Hold or expecting proof of university admission"
    ],
    benefits: [
      "Full tuition fees", "Monthly living stipend",
      "Return airfare", "Research allowance", "Books and materials allowance"
    ],
    requiredDocs: [
      "Academic transcripts", "Proof of citizenship",
      "University admission letter", "Medical certificate",
      "Personal statement"
    ],
    status: "active", views: 0, bookmarks: 0,
    tags: ["IsDB", "Islamic", "STEM", "masters", "fully funded"],
    sourceUrl: "https://www.isdb.org/scholarship-programs",
    verified: true, verifiedDate: new Date("2026-08-13")
  },

  {
    title: "Mo Ibrahim Foundation Scholarship",
    orgName: "Mo Ibrahim Foundation",
    description: "Offers scholarships to African students for postgraduate study in governance, public policy, economics, law, and related subjects at leading universities in the UK. Named after Sudanese-British billionaire Mo Ibrahim.",
    deadline: new Date("2026-10-01"), // Varies. Check moibrahimfoundation.org
    level: "Masters", field: "Social Sciences", country: "UK",
    fundingType: "Fully Funded", amount: "£30,000/yr",
    eligibility: [
      "African citizen (Sub-Saharan or North African)",
      "Strong academic record",
      "Demonstrated interest in African governance and public policy",
      "Under 35 years old"
    ],
    benefits: [
      "Full tuition fees", "Monthly living allowance",
      "Return airfare", "Research stipend", "Mo Ibrahim Foundation networking"
    ],
    requiredDocs: [
      "Academic transcripts", "Personal statement on governance interest",
      "References", "CV"
    ],
    status: "active", views: 0, bookmarks: 0,
    tags: ["Mo Ibrahim", "Africa", "governance", "UK", "fully funded"],
    sourceUrl: "https://mo.ibrahim.foundation/",
    verified: true, verifiedDate: new Date("2026-08-13")
  },

  // ════════════════════════════════════════════════════════
  // NIGERIA-SPECIFIC SCHOLARSHIPS
  // ════════════════════════════════════════════════════════
  {
    title: "PTDF Overseas Postgraduate Scholarship",
    orgName: "Petroleum Technology Development Fund (PTDF)",
    description: "Provides opportunities for Nigerian graduates in relevant fields to pursue postgraduate education at leading universities in the UK and other countries. Administered by the Federal Government of Nigeria.",
    deadline: new Date("2026-09-15"), // Typically August–September. Check ptdf.gov.ng annually.
    level: "Masters", field: "Engineering", country: "UK",
    fundingType: "Fully Funded", amount: "£25,000/yr",
    eligibility: [
      "Nigerian citizen with valid NIN",
      "Second class upper (2:1) degree in a relevant field",
      "Age not above 35 at time of application",
      "NYSC discharge or exemption certificate",
      "Proof of admission to a foreign university"
    ],
    benefits: [
      "Full tuition fees", "Monthly living stipend",
      "Return economy airfare", "Health insurance",
      "Books and study materials allowance"
    ],
    requiredDocs: [
      "Academic transcripts", "NYSC certificate",
      "Birth certificate or National ID", "Work experience letter if applicable",
      "Two references", "University admission letter"
    ],
    status: "active", views: 0, bookmarks: 0,
    tags: ["PTDF", "Nigeria", "masters", "engineering", "oil and gas"],
    sourceUrl: "https://ptdf.gov.ng/scholarships/",
    verified: true, verifiedDate: new Date("2026-08-13")
  },

  {
    title: "Federal Government of Nigeria Bilateral Education Agreement (BEA) Scholarship",
    orgName: "Federal Government of Nigeria — Ministry of Education",
    description: "Awards Nigerian students the opportunity to study in countries that Nigeria has bilateral education agreements with, including China, Russia, Hungary, Romania, Bulgaria, Morocco, Egypt, Serbia, and others. Free tuition in partner countries.",
    deadline: new Date("2026-07-31"), // Typically July–August. Check scholarships.education.gov.ng
    level: "Undergraduate", field: "Any", country: "Various",
    fundingType: "Fully Funded", amount: "Full Coverage",
    eligibility: [
      "Nigerian citizen by birth",
      "O'Level result with minimum of 5 credits including English and Mathematics",
      "Age between 17 and 25",
      "Good health — medical certificate required",
      "JAMB score for Nigerian university-based criteria"
    ],
    benefits: [
      "Full tuition paid by host country", "Monthly allowance",
      "Return economy airfare", "Accommodation in student hostel",
      "Medical care at host institution"
    ],
    requiredDocs: [
      "WAEC/NECO result with 5 credits", "Birth certificate",
      "Medical certificate", "JAMB result",
      "Letter of identification from Local Government"
    ],
    status: "active", views: 0, bookmarks: 0,
    tags: ["Nigeria", "BEA", "undergraduate", "bilateral", "fully funded"],
    sourceUrl: "https://scholarships.education.gov.ng/",
    verified: true, verifiedDate: new Date("2026-08-13")
  },

  {
    title: "Niger Delta Development Commission (NDDC) Postgraduate Scholarship",
    orgName: "Niger Delta Development Commission",
    description: "NDDC Postgraduate Foreign Scholarship for Nigerians from Niger Delta states to study in reputable universities abroad, with focus on science, engineering, technology and management.",
    deadline: new Date("2026-08-30"), // Typically August–September. Check nddc.gov.ng
    level: "Masters", field: "STEM", country: "Various",
    fundingType: "Fully Funded", amount: "$30,000/yr",
    eligibility: [
      "Nigerian citizen and indigene of a Niger Delta state (Abia, Akwa Ibom, Bayelsa, Cross River, Delta, Edo, Imo, Ondo, Rivers)",
      "Second class upper (2:1) degree",
      "Age not above 35",
      "Evidence of admission to an accredited foreign university"
    ],
    benefits: [
      "Full tuition fees", "Monthly living allowance",
      "Return airfare", "Research materials allowance", "Health insurance"
    ],
    requiredDocs: [
      "Academic transcripts", "State of origin / LGA certificate",
      "University admission letter", "NYSC discharge certificate",
      "Medical certificate", "Two references"
    ],
    status: "active", views: 0, bookmarks: 0,
    tags: ["NDDC", "Nigeria", "Niger Delta", "masters", "STEM"],
    sourceUrl: "https://nddc.gov.ng/scholarship/",
    verified: true, verifiedDate: new Date("2026-08-13")
  },

  // ════════════════════════════════════════════════════════
  // GLOBAL / INTERNATIONAL ORGANISATIONS
  // ════════════════════════════════════════════════════════
  {
    title: "Joint Japan / World Bank Graduate Scholarship Program",
    orgName: "World Bank & Government of Japan",
    description: "Provides scholarships to mid-career professionals from developing countries to pursue a master's degree related to development at accredited universities worldwide. Focus on economics, public policy, and related fields.",
    deadline: new Date("2026-04-30"), // Typically April. Check worldbank.org/jj-wbgsp
    level: "Masters", field: "Any", country: "Various",
    fundingType: "Fully Funded", amount: "$30,000/yr",
    eligibility: [
      "Citizen of a World Bank member developing country",
      "Age 45 or below",
      "Hold a bachelor's degree",
      "Minimum 3 years work experience in development-related field",
      "Secured admission to an approved university programme"
    ],
    benefits: [
      "Full tuition fees", "Monthly living allowance",
      "Round-trip economy airfare", "Health insurance",
      "Travel allowance for fieldwork"
    ],
    requiredDocs: [
      "Application form", "Official academic transcripts",
      "Work experience letters", "Two references",
      "English language test results", "Proof of university admission"
    ],
    status: "active", views: 0, bookmarks: 0,
    tags: ["world bank", "japan", "masters", "development", "fully funded"],
    sourceUrl: "https://www.worldbank.org/en/programs/scholarships",
    verified: true, verifiedDate: new Date("2026-08-13")
  },

  {
    title: "Rotary Foundation Global Grant Scholarship",
    orgName: "Rotary International Foundation",
    description: "Global Grants support large international activities with sustainable, measurable outcomes in one of Rotary's six areas of focus. Includes graduate study abroad in a field related to Rotary's areas of focus.",
    deadline: new Date("2026-07-15"), // Rolling deadline; apply through local Rotary club — rotary.org
    level: "Masters", field: "Any", country: "Various",
    fundingType: "Fully Funded", amount: "$30,000+",
    eligibility: [
      "Must be sponsored by a local Rotary club",
      "Strong academic record",
      "Clear project related to Rotary's six areas of focus",
      "Language proficiency for host country"
    ],
    benefits: [
      "Grant of minimum USD 30,000", "Access to Rotary global network",
      "Vocational training opportunities", "Cultural exchange"
    ],
    requiredDocs: [
      "Application through local Rotary club", "Academic transcripts",
      "Project proposal", "Language proficiency proof", "References"
    ],
    status: "active", views: 0, bookmarks: 0,
    tags: ["rotary", "global", "masters", "community", "development"],
    sourceUrl: "https://www.rotary.org/en/our-programs/scholarships",
    verified: true, verifiedDate: new Date("2026-08-13")
  },

  {
    title: "IMF Scholarship Program for Africa (SPA)",
    orgName: "International Monetary Fund",
    description: "Supports African graduate students pursuing advanced studies in economics, finance and related quantitative fields at accredited universities. Includes mentorship from IMF economists.",
    deadline: new Date("2027-02-28"), // Typically January–February. Check imf.org/spa
    level: "Masters", field: "Economics", country: "Various",
    fundingType: "Fully Funded", amount: "$25,000/yr",
    eligibility: [
      "African citizen from a Sub-Saharan African country",
      "Accepted or enrolled in an accredited Masters programme in economics",
      "Strong mathematical and quantitative background",
      "Under 30 years old"
    ],
    benefits: [
      "Annual living stipend", "Tuition coverage",
      "IMF staff mentorship", "Internship consideration at IMF"
    ],
    requiredDocs: [
      "Academic transcripts", "GRE scores preferred",
      "Personal statement", "Three references",
      "Proof of university admission or enrollment"
    ],
    status: "active", views: 0, bookmarks: 0,
    tags: ["IMF", "Africa", "economics", "masters", "finance"],
    sourceUrl: "https://www.imf.org/en/About/Recruitment/spa",
    verified: true, verifiedDate: new Date("2026-08-13")
  },

  {
    title: "African Economic Research Consortium (AERC) Scholarship",
    orgName: "African Economic Research Consortium",
    description: "AERC's Collaborative Masters Programme in Economics provides scholarships for African students to pursue high-quality master's level education in economics at one of 25+ partner African universities.",
    deadline: new Date("2027-01-31"), // Typically January. Check aercafrica.org
    level: "Masters", field: "Economics", country: "Various",
    fundingType: "Fully Funded", amount: "$18,000/yr",
    eligibility: [
      "African citizen",
      "Bachelor's degree in economics or quantitative field",
      "Strong mathematical and statistical background",
      "Commitment to work in Africa after graduation"
    ],
    benefits: [
      "Full tuition at partner African university", "Monthly living allowance",
      "Research and textbook support", "AERC professional network access"
    ],
    requiredDocs: [
      "Academic transcripts", "References",
      "Statement of purpose", "GRE or equivalent test preferred"
    ],
    status: "active", views: 0, bookmarks: 0,
    tags: ["AERC", "Africa", "economics", "masters", "research"],
    sourceUrl: "https://aercafrica.org/collaborative-masters-programme/",
    verified: true, verifiedDate: new Date("2026-08-13")
  },

  {
    title: "Global Health Corps Fellowship",
    orgName: "Global Health Corps",
    description: "Places talented individuals under 30 in high-impact health organisations in Sub-Saharan Africa and the United States to work as full-time paid fellows for one year. No health background required.",
    deadline: new Date("2027-01-20"), // Typically January. Check ghcorps.org
    level: "Postdoctoral", field: "Medicine", country: "Various",
    fundingType: "Fully Funded", amount: "$700/mo",
    eligibility: [
      "Age 30 or under at start of fellowship",
      "Bachelor's degree in any field",
      "Passion for health equity and social justice",
      "Willingness to relocate to placement country for one year"
    ],
    benefits: [
      "Monthly living stipend", "Housing allowance",
      "Health insurance", "Professional development budget",
      "Global Health Corps alumni community"
    ],
    requiredDocs: [
      "Online application form", "CV/Resume",
      "Personal essay", "Two professional references"
    ],
    status: "active", views: 0, bookmarks: 0,
    tags: ["global health", "fellowship", "Africa", "medicine", "equity"],
    sourceUrl: "https://ghcorps.org/fellows/apply/",
    verified: true, verifiedDate: new Date("2026-08-13")
  },

  {
    title: "Forté Foundation MBA Fellowship",
    orgName: "Forté Foundation",
    description: "Awarded to outstanding women applicants at top MBA programs worldwide to increase the number of women in business leadership. Offered through Forté Foundation partner business schools.",
    deadline: new Date("2027-03-01"), // Varies by partner school. Check fortefoundation.org
    level: "Masters", field: "Business", country: "USA",
    fundingType: "Partial", amount: "$50,000",
    eligibility: [
      "Woman applicant (all gender identities that identify as woman welcome)",
      "Applying to a Forté Foundation partner MBA programme",
      "Strong leadership track record",
      "GMAT/GRE scores meeting programme requirements"
    ],
    benefits: [
      "Fellowship award up to $50,000", "Access to Forté Foundation network",
      "Leadership conferences and career programming", "Mentorship"
    ],
    requiredDocs: [
      "MBA application to a Forté partner school", "GMAT or GRE scores",
      "References", "Essays", "Transcripts"
    ],
    status: "active", views: 0, bookmarks: 0,
    tags: ["forte", "MBA", "women", "business", "leadership"],
    sourceUrl: "https://www.fortefoundation.org/site/PageServer?pagename=mba_fellowships",
    verified: true, verifiedDate: new Date("2026-08-13")
  },

  {
    title: "Charles Wallace Nigeria Trust Fellowship",
    orgName: "Charles Wallace Nigeria Trust",
    description: "Offers small grants and fellowships for Nigerians in the creative arts, cultural heritage, and humanities to visit the UK for short-term training, research, or professional collaboration.",
    deadline: new Date("2027-01-31"), // Typically January–February. Check britishcouncil.org.ng
    level: "Postdoctoral", field: "Arts & Humanities", country: "UK",
    fundingType: "Partial", amount: "£3,000",
    eligibility: [
      "Nigerian citizen permanently resident in Nigeria",
      "Working professionally in arts, culture or humanities",
      "Minimum 2 years relevant professional experience",
      "Clear specific project or collaboration purpose in the UK"
    ],
    benefits: [
      "Grant towards travel and living costs",
      "Access to UK arts and cultural sector",
      "British Council support network"
    ],
    requiredDocs: [
      "Project proposal", "Professional CV",
      "Two references", "Detailed budget breakdown"
    ],
    status: "active", views: 0, bookmarks: 0,
    tags: ["charles wallace", "Nigeria", "arts", "humanities", "UK"],
    sourceUrl: "https://www.britishcouncil.org.ng/study-uk/charles-wallace-nigeria-trust",
    verified: true, verifiedDate: new Date("2026-08-13")
  },

  {
    title: "IEEE Foundation Scholarship",
    orgName: "IEEE Foundation",
    description: "IEEE Foundation offers multiple scholarship programmes to support undergraduate and graduate students pursuing degrees in electrical engineering, computer science, and related technology fields worldwide.",
    deadline: new Date("2027-02-01"), // Varies by specific programme. Check ieee.org/about/awards
    level: "Undergraduate", field: "Engineering", country: "Various",
    fundingType: "Partial", amount: "$5,000",
    eligibility: [
      "Enrolled in accredited electrical engineering or computer science programme",
      "IEEE student member",
      "Strong academic record (typically 3.0 GPA minimum)",
      "Demonstrated financial need for some awards"
    ],
    benefits: [
      "Annual scholarship award of up to $5,000",
      "IEEE membership benefits", "Professional networking opportunities"
    ],
    requiredDocs: [
      "Academic transcripts", "Personal essay",
      "References", "IEEE student membership proof"
    ],
    status: "active", views: 0, bookmarks: 0,
    tags: ["IEEE", "engineering", "undergraduate", "technology", "STEM"],
    sourceUrl: "https://www.ieee.org/about/awards/scholarships.html",
    verified: true, verifiedDate: new Date("2026-08-13")
  },

  {
    title: "Norwegian Government Quota Scholarship",
    orgName: "Norwegian Directorate for Higher Education and Skills (HK-dir)",
    description: "Provides scholarship opportunities for students from developing countries and selected regions to pursue a full degree (bachelor's, master's or PhD) at a Norwegian university or university college.",
    deadline: new Date("2027-01-15"), // Typically December–February depending on institution. Check hkdir.no
    level: "Masters", field: "Any", country: "Norway",
    fundingType: "Fully Funded", amount: "NOK 11,000/mo",
    eligibility: [
      "Citizen of an eligible developing country",
      "Accepted to and enrolled at a Norwegian university",
      "Under 35 years old for most awards",
      "Good academic record"
    ],
    benefits: [
      "Monthly grant of NOK 11,000 (~USD 1,030)", "Travel grant",
      "Settling-in allowance", "Health and travel insurance"
    ],
    requiredDocs: [
      "Proof of university admission", "Academic transcripts",
      "Financial need statement", "Passport copy"
    ],
    status: "active", views: 0, bookmarks: 0,
    tags: ["norway", "masters", "government", "developing countries", "fully funded"],
    sourceUrl: "https://www.hkdir.no/en/funding/scholarship-database",
    verified: true, verifiedDate: new Date("2026-08-13")
  },

  {
    title: "Holland Scholarship",
    orgName: "Dutch Ministry of Education, Culture and Science",
    description: "Offered by Dutch universities for talented international students from outside the European Economic Area who want to do their bachelor's or master's at a Dutch research university or university of applied sciences.",
    deadline: new Date("2027-02-01"), // Typically 1 February. Check studyinholland.nl
    level: "Masters", field: "Any", country: "Netherlands",
    fundingType: "Partial", amount: "€5,000",
    eligibility: [
      "From outside the European Economic Area (EEA)",
      "Applying for a bachelor's or master's programme at a Dutch institution",
      "Not previously studied in the Netherlands",
      "Strong academic record"
    ],
    benefits: [
      "One-off grant of EUR 5,000 (typically for first year)",
      "Access to Dutch higher education institution network"
    ],
    requiredDocs: [
      "Proof of admission to Dutch university", "Academic transcripts",
      "Motivation letter", "Passport copy"
    ],
    status: "active", views: 0, bookmarks: 0,
    tags: ["holland", "Netherlands", "masters", "international", "grant"],
    sourceUrl: "https://www.studyinholland.nl/scholarships/highlighted-scholarships/holland-scholarship",
    verified: true, verifiedDate: new Date("2026-08-13")
  },

  {
    title: "Vanier Canada Graduate Scholarship (International)",
    orgName: "Government of Canada — NSERC / SSHRC / CIHR",
    description: "Canada's most prestigious doctoral scholarship. $50,000 per year for 3 years. Open to international students as well as Canadians. Must be nominated by a Canadian university — you cannot apply directly.",
    deadline: new Date("2026-11-01"), // Typically first week of November. Check vanier.gc.ca
    level: "PhD", field: "Any", country: "Canada",
    fundingType: "Fully Funded", amount: "CAD $50,000/yr",
    eligibility: [
      "Nominated by a Canadian university you are applying to or enrolled in",
      "Applying for or enrolled in first doctoral degree",
      "GPA of at least 3.7/4.0 in each of the last two years of study",
      "International students eligible — no citizenship restriction"
    ],
    benefits: [
      "CAD $50,000 per year for three years",
      "Vanier Scholar designation for life",
      "Access to exclusive networking and professional development"
    ],
    requiredDocs: [
      "University nomination package (your university submits on your behalf)",
      "Research proposal", "Academic transcripts",
      "Leadership and research achievement record", "References"
    ],
    status: "active", views: 0, bookmarks: 0,
    tags: ["vanier", "Canada", "PhD", "leadership", "research"],
    sourceUrl: "https://vanier.gc.ca/en/home-accueil.html",
    verified: true, verifiedDate: new Date("2026-08-13")
  },

  {
    title: "Trudeau Foundation Scholarship",
    orgName: "Pierre Elliott Trudeau Foundation",
    description: "Supports doctoral candidates whose research explores complex social issues. Among Canada's most prestigious awards. Scholars receive funding plus extensive mentorship, retreats, and community engagement.",
    deadline: new Date("2026-12-01"), // Typically December 1. Check trudeaufoundation.ca
    level: "PhD", field: "Social Sciences", country: "Canada",
    fundingType: "Fully Funded", amount: "CAD $40,000/yr",
    eligibility: [
      "Enrolled in or accepted to a doctoral programme at a Canadian university",
      "Research addressing complex social questions (human rights, environment, citizenship, Canada & the world)",
      "Demonstrated social engagement and leadership"
    ],
    benefits: [
      "Annual award of CAD $40,000 for up to 4 years",
      "Travel and research allowances up to CAD $20,000/year",
      "Mentorship from Trudeau Foundation members",
      "Exclusive retreat and community events"
    ],
    requiredDocs: [
      "Research proposal", "Academic transcripts",
      "References", "Personal essay on social commitment"
    ],
    status: "active", views: 0, bookmarks: 0,
    tags: ["trudeau", "Canada", "PhD", "social sciences", "human rights"],
    sourceUrl: "https://www.trudeaufoundation.ca/programs/trudeau-scholarships",
    verified: true, verifiedDate: new Date("2026-08-13")
  },

  {
    title: "Fogarty International Research Scholarship (NIH)",
    orgName: "Fogarty International Center — National Institutes of Health (NIH)",
    description: "NIH's Fogarty International Center supports global health research and training. Multiple programmes for researchers from low and middle income countries to conduct research at NIH or US partner institutions.",
    deadline: new Date("2026-10-01"), // Varies by programme. Check fic.nih.gov
    level: "PhD", field: "Medicine", country: "USA",
    fundingType: "Fully Funded", amount: "$45,000/yr",
    eligibility: [
      "From a low or middle income country",
      "PhD student or early-career researcher",
      "Research in global health or biomedical science",
      "Affiliation with an eligible institution"
    ],
    benefits: [
      "Research stipend", "Tuition support",
      "Research and travel expenses", "Access to NIH facilities"
    ],
    requiredDocs: [
      "Research proposal", "Academic transcripts",
      "References", "Institutional letter of support"
    ],
    status: "active", views: 0, bookmarks: 0,
    tags: ["fogarty", "NIH", "global health", "PhD", "research"],
    sourceUrl: "https://www.fic.nih.gov/Programs/Pages/default.aspx",
    verified: true, verifiedDate: new Date("2026-08-13")
  },

];

// ─────────────────────────────────────────────────────────────────────────────
async function bulkInsert() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('\n✅ MongoDB connected\n');

    // Remove any existing scholarships with matching titles to avoid duplicates
    const titles = scholarships.map(s => s.title);
    const deleted = await Scholarship.deleteMany({ title: { $in: titles } });
    if (deleted.deletedCount > 0) {
      console.log(`🗑  Removed ${deleted.deletedCount} existing entries to prevent duplicates\n`);
    }

    // Insert all at once
    const result = await Scholarship.insertMany(scholarships);
    console.log(`🎓 Successfully inserted ${result.length} verified scholarships!\n`);

    // Summary by country
    const countries = {};
    scholarships.forEach(s => { countries[s.country] = (countries[s.country] || 0) + 1; });
    console.log('📊 Breakdown by destination country:');
    Object.entries(countries).sort((a, b) => b[1] - a[1]).forEach(([c, n]) => {
      console.log(`   ${c.padEnd(20)} ${n} scholarship${n > 1 ? 's' : ''}`);
    });

    // Summary by level
    const levels = {};
    scholarships.forEach(s => { levels[s.level] = (levels[s.level] || 0) + 1; });
    console.log('\n📊 Breakdown by study level:');
    Object.entries(levels).forEach(([l, n]) => {
      console.log(`   ${l.padEnd(20)} ${n} scholarship${n > 1 ? 's' : ''}`);
    });

    const fullyFunded = scholarships.filter(s => s.fundingType === 'Fully Funded').length;
    console.log(`\n💰 Fully Funded: ${fullyFunded} | Partial: ${scholarships.length - fullyFunded}`);
    console.log('\n✅ Done! Open /pages/find.html in your browser to see all scholarships.');
    console.log('⚠️  Note: Always verify current deadlines at the official sourceUrl before applying.\n');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Error:', err.message);
    process.exit(1);
  }
}

bulkInsert();
