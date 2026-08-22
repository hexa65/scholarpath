require('dotenv').config();
const mongoose = require('mongoose');
const { Scholarship } = require('../models');
const User = require('../models/User');

async function run() {
  try {
    // ── Connect ──────────────────────────────────────────
    await mongoose.connect(process.env.MONGO_URI);
    console.log('\n✅ MongoDB connected\n');

    // ── Get or create an org user ────────────────────────
    let org = await User.findOne({ role: 'organization' });
    if (!org) org = await User.findOne({ role: 'admin' });
    if (!org) {
      org = await User.create({
        name: 'ScholarPath Official',
        email: 'official@scholarpath.com',
        password: 'Official@1234',
        role: 'organization',
        isVerified: true,
        orgProfile: { verified: true }
      });
      console.log('Created default org user\n');
    }
    console.log('Using org:', org.name, '\n');

    // ── Clear existing scholarships ──────────────────────
    await Scholarship.deleteMany({});
    console.log('🗑  Cleared existing scholarships\n');

    // ── Scholarship data ─────────────────────────────────
    const data = [
      {
        title: "Chevening Scholarship",
        orgName: "UK Foreign Commonwealth & Development Office",
        description: "Chevening Scholarships are the UK government's international awards programme aimed at developing global leaders. Fully-funded master's degree at any eligible UK university. Open to citizens of 160+ countries.",
        deadline: new Date("2026-10-06"),
        level: "Masters", field: "Any", country: "UK",
        fundingType: "Fully Funded", amount: "£25,000/yr",
        eligibility: [
          "Citizen of a Chevening-eligible country",
          "Minimum 2 years work experience",
          "Hold an undergraduate degree equivalent to UK upper second class 2:1",
          "Apply to three different eligible UK universities",
          "Commit to return to home country for 2 years after scholarship"
        ],
        benefits: [
          "Full tuition fees paid",
          "Monthly living allowance",
          "Economy return flights to the UK",
          "Arrival and departure allowances",
          "Chevening alumni network access"
        ],
        requiredDocs: [
          "University acceptance letters from 3 UK universities",
          "Two references",
          "Work experience evidence",
          "English language certificate"
        ],
        tags: ["chevening", "UK", "masters", "leadership", "fully funded"],
        sourceUrl: "https://www.chevening.org/scholarships/",
        verified: true, verifiedDate: new Date("2026-08-13")
      },
      {
        title: "Commonwealth Masters Scholarship",
        orgName: "Commonwealth Scholarship Commission",
        description: "Fully-funded scholarships for citizens of low and middle-income Commonwealth countries to study a Masters degree at a UK university. Funded by the UK Foreign Commonwealth and Development Office.",
        deadline: new Date("2026-10-21"),
        level: "Masters", field: "Any", country: "UK",
        fundingType: "Fully Funded", amount: "£28,000/yr",
        eligibility: [
          "Citizen of an eligible Commonwealth country",
          "Hold a first degree at minimum upper second class 2:1",
          "Unable to afford to study in the UK without this scholarship",
          "Not previously studied in the UK at Masters level"
        ],
        benefits: [
          "Full tuition fees",
          "Monthly living allowance £1,236 London / £1,040 elsewhere",
          "Return economy airfare",
          "Arrival allowance of £887",
          "Warm clothing allowance"
        ],
        requiredDocs: [
          "Academic transcripts and degree certificate",
          "Two academic references",
          "Personal statement",
          "Proof of English proficiency"
        ],
        tags: ["commonwealth", "UK", "masters", "fully funded", "Africa"],
        sourceUrl: "https://cscuk.fcdo.gov.uk/scholarships/commonwealth-masters-scholarships/",
        verified: true, verifiedDate: new Date("2026-08-13")
      },
      {
        title: "Gates Cambridge Scholarship",
        orgName: "Gates Cambridge Trust",
        description: "Prestigious full-cost awards for outstanding applicants from any country outside the UK to pursue a postgraduate degree at the University of Cambridge. About 80 scholarships awarded annually.",
        deadline: new Date("2026-12-02"),
        level: "PhD", field: "Any", country: "UK",
        fundingType: "Fully Funded", amount: "£50,000/yr",
        eligibility: [
          "Citizen of any country outside the United Kingdom",
          "Applying for a full-time postgraduate degree at Cambridge",
          "Outstanding academic achievement",
          "Leadership potential and commitment to improving lives"
        ],
        benefits: [
          "Full University Composition Fee (tuition)",
          "Annual maintenance allowance £18,744",
          "Return airfare to the UK",
          "Discretionary funding for academic development",
          "Family allowance if applicable"
        ],
        requiredDocs: [
          "Cambridge graduate application via GRADSAF portal",
          "Academic CV",
          "Research proposal for PhD applicants",
          "Three academic references",
          "Gates Cambridge personal statement"
        ],
        tags: ["gates", "cambridge", "PhD", "UK", "fully funded"],
        sourceUrl: "https://www.gatescambridge.org/apply/timeline/",
        verified: true, verifiedDate: new Date("2026-08-13")
      },
      {
        title: "Rhodes Scholarship",
        orgName: "Rhodes Trust",
        description: "The oldest and most celebrated international fellowship in the world, bringing outstanding students to the University of Oxford. Awarded on the basis of intellect, character, leadership and commitment to service.",
        deadline: new Date("2026-08-01"),
        level: "Masters", field: "Any", country: "UK",
        fundingType: "Fully Funded", amount: "£20,000/yr",
        eligibility: [
          "Age between 18 and 28",
          "Strong academic record typically top of class",
          "Demonstrated leadership qualities",
          "Commitment to service and improving the world"
        ],
        benefits: [
          "University and college fees at Oxford",
          "Living stipend",
          "Airfare to and from Oxford",
          "Thesis allowance",
          "Rhodes community and network for life"
        ],
        requiredDocs: [
          "Academic transcripts",
          "Personal statement",
          "Eight reference letters",
          "Medical certificate"
        ],
        tags: ["rhodes", "oxford", "UK", "masters", "leadership"],
        sourceUrl: "https://www.rhodeshouse.ox.ac.uk/scholarships/the-rhodes-scholarship/",
        verified: true, verifiedDate: new Date("2026-08-13")
      },
      {
        title: "Wellcome Trust PhD Studentships",
        orgName: "Wellcome Trust",
        description: "Supports talented students to undertake a PhD in biomedical science, public health, medical humanities or social science research related to health at UK universities.",
        deadline: new Date("2026-09-30"),
        level: "PhD", field: "Medicine", country: "UK",
        fundingType: "Fully Funded", amount: "£25,000/yr",
        eligibility: [
          "Hold or expect a first or upper second class honours degree",
          "Strong research background in health-related field",
          "Clear research proposal relevant to Wellcome themes"
        ],
        benefits: [
          "Full tuition fees",
          "Annual living stipend",
          "Research expenses covered",
          "Conference and travel funding"
        ],
        requiredDocs: [
          "Research proposal",
          "Academic transcripts",
          "Two academic references",
          "Personal statement"
        ],
        tags: ["wellcome", "UK", "PhD", "medicine", "research"],
        sourceUrl: "https://wellcome.org/grant-funding/schemes/four-year-phd-programmes",
        verified: true, verifiedDate: new Date("2026-08-13")
      },
      {
        title: "Fulbright Foreign Student Program",
        orgName: "U.S. Department of State",
        description: "The largest U.S. international exchange program for students and professionals to undertake graduate study and advanced research. For Nigeria this is a research program for doctoral students.",
        deadline: new Date("2026-06-01"),
        level: "Masters", field: "Any", country: "USA",
        fundingType: "Fully Funded", amount: "$40,000/yr",
        eligibility: [
          "Non-US citizen residing in home country",
          "Strong academic record",
          "English language proficiency TOEFL minimum 90",
          "Leadership qualities and commitment to return home after grant"
        ],
        benefits: [
          "Full tuition or research fees",
          "Monthly living stipend",
          "Health insurance",
          "J-1 visa support",
          "Round-trip economy airfare"
        ],
        requiredDocs: [
          "Academic transcripts",
          "TOEFL scores minimum 90",
          "Research proposal or study plan",
          "Three references",
          "Personal statement"
        ],
        tags: ["fulbright", "USA", "masters", "fully funded", "research"],
        sourceUrl: "https://ng.usembassy.gov/the-fulbright-foreign-student-program/",
        verified: true, verifiedDate: new Date("2026-08-13")
      },
      {
        title: "Hubert Humphrey Fellowship Program",
        orgName: "U.S. Department of State",
        description: "Brings accomplished mid-level professionals from designated countries to the United States for ten months of non-degree academic study and related professional experiences.",
        deadline: new Date("2026-09-01"),
        level: "Postdoctoral", field: "Any", country: "USA",
        fundingType: "Fully Funded", amount: "$35,000",
        eligibility: [
          "Mid-career professional with minimum 5 years work experience",
          "Demonstrated leadership and public service commitment",
          "English language proficiency",
          "Citizen of an eligible country"
        ],
        benefits: [
          "Tuition and fees at US university",
          "Monthly maintenance allowance",
          "Round-trip international airfare",
          "Health insurance",
          "Professional development activities"
        ],
        requiredDocs: [
          "Application form",
          "Three professional references",
          "Official academic transcripts",
          "English test scores",
          "CV"
        ],
        tags: ["humphrey", "USA", "professional", "fully funded", "leadership"],
        sourceUrl: "https://www.humphreyfellowship.org/",
        verified: true, verifiedDate: new Date("2026-08-13")
      },
      {
        title: "Google PhD Fellowship",
        orgName: "Google",
        description: "Recognizes outstanding graduate students doing exceptional and innovative research in areas relevant to computer science and related fields. Faculty must nominate candidates.",
        deadline: new Date("2026-12-01"),
        level: "PhD", field: "Computer Science", country: "Various",
        fundingType: "Fully Funded", amount: "$15,000/yr",
        eligibility: [
          "Enrolled full-time in a PhD programme at an eligible university",
          "Research in computer science AI ML or related field",
          "Must be nominated by faculty advisor",
          "Strong academic and research record"
        ],
        benefits: [
          "Annual fellowship award",
          "Dedicated Google Research mentor",
          "Internship opportunity at Google",
          "Conference travel support"
        ],
        requiredDocs: [
          "Faculty nomination letter",
          "Research statement",
          "CV",
          "Academic transcripts"
        ],
        tags: ["Google", "PhD", "computer science", "technology", "research"],
        sourceUrl: "https://research.google/outreach/phd-fellowship/",
        verified: true, verifiedDate: new Date("2026-08-13")
      },
      {
        title: "Microsoft Research PhD Fellowship",
        orgName: "Microsoft Research",
        description: "Supports talented early-career PhD students pursuing research in areas related to Microsoft Research interests including AI, ML, systems, security and human-computer interaction.",
        deadline: new Date("2026-09-30"),
        level: "PhD", field: "Computer Science", country: "USA",
        fundingType: "Fully Funded", amount: "$42,000/yr",
        eligibility: [
          "Enrolled in PhD programme at a university in USA or Canada",
          "Typically in second or third year of PhD study",
          "Research in computing or related field",
          "Open to all nationalities"
        ],
        benefits: [
          "Annual stipend of $42,000",
          "Tuition coverage",
          "Conference and travel funding",
          "Microsoft Research mentorship",
          "Internship opportunity at Microsoft Research"
        ],
        requiredDocs: [
          "Research proposal and statement",
          "Academic transcripts",
          "Two academic references",
          "CV"
        ],
        tags: ["Microsoft", "PhD", "computer science", "technology", "fellowship"],
        sourceUrl: "https://www.microsoft.com/en-us/research/academic-programs/phd-fellowship/",
        verified: true, verifiedDate: new Date("2026-08-13")
      },
      {
        title: "AAUW International Fellowships",
        orgName: "American Association of University Women",
        description: "Awarded for full-time study or research in the United States to women who are not US citizens or permanent residents. Open to women from all countries for graduate and postgraduate study.",
        deadline: new Date("2026-11-15"),
        level: "Masters", field: "Any", country: "USA",
        fundingType: "Fully Funded", amount: "$20,000",
        eligibility: [
          "Woman who is not a US citizen or permanent resident",
          "Hold a bachelor's degree by the time fellowship begins",
          "Planning to use degree to advance career in home country"
        ],
        benefits: [
          "Fellowship award of up to $20,000",
          "Health insurance allowance",
          "Childcare allowance if applicable"
        ],
        requiredDocs: [
          "Academic transcripts",
          "Personal statement",
          "Three references",
          "Proof of admission to US institution"
        ],
        tags: ["AAUW", "USA", "women", "masters", "fellowship"],
        sourceUrl: "https://www.aauw.org/resources/programs/fellowships-grants/current-opportunities/international/",
        verified: true, verifiedDate: new Date("2026-08-13")
      },
      {
        title: "DAAD Scholarship Development-Related Postgraduate Courses",
        orgName: "DAAD German Academic Exchange Service",
        description: "Supports graduates from developing countries to study postgraduate degrees at German universities in subject areas relevant to their home country's development.",
        deadline: new Date("2026-10-15"),
        level: "Masters", field: "Engineering", country: "Germany",
        fundingType: "Fully Funded", amount: "€1,400/mo",
        eligibility: [
          "Citizen of a developing or newly industrialised country",
          "Hold a bachelor's degree in a relevant field",
          "Minimum 2 years professional work experience",
          "Above-average academic results"
        ],
        benefits: [
          "Monthly stipend EUR 1,200 Masters / EUR 1,400 PhD",
          "Health accident and personal liability insurance",
          "Travel allowance",
          "Study and research allowance"
        ],
        requiredDocs: [
          "Academic transcripts",
          "Language certificate German B2 or IELTS/TOEFL",
          "CV and motivation letter",
          "Two recommendation letters",
          "Proof of 2 years work experience"
        ],
        tags: ["DAAD", "Germany", "masters", "engineering", "development"],
        sourceUrl: "https://www2.daad.de/deutschland/stipendium/datenbank/en/21148-scholarship-database/",
        verified: true, verifiedDate: new Date("2026-08-13")
      },
      {
        title: "Heinrich Böll Foundation Scholarship",
        orgName: "Heinrich Böll Foundation",
        description: "Scholarships for undergraduate and graduate students in Germany who demonstrate academic excellence, social commitment and alignment with Green progressive values. Open to international students.",
        deadline: new Date("2027-01-01"),
        level: "Masters", field: "Any", country: "Germany",
        fundingType: "Fully Funded", amount: "€850/mo",
        eligibility: [
          "Strong academic record",
          "Social or political engagement",
          "Open to students from any country",
          "Good German language skills usually B2+"
        ],
        benefits: [
          "Monthly stipend of EUR 850",
          "Monthly flat-rate study allowance",
          "Health insurance subsidy",
          "Networking seminars and events"
        ],
        requiredDocs: [
          "Academic transcripts",
          "Motivation letter",
          "CV",
          "Two references",
          "German language certificate"
        ],
        tags: ["heinrich boll", "Germany", "masters", "social", "political"],
        sourceUrl: "https://www.boell.de/en/foundation/scholarships",
        verified: true, verifiedDate: new Date("2026-08-13")
      },
      {
        title: "Konrad Adenauer Foundation Scholarship",
        orgName: "Konrad Adenauer Foundation KAS",
        description: "Supports students who demonstrate outstanding academic achievement and commitment to Christian-Democratic values. Open to German and international students enrolled in German universities.",
        deadline: new Date("2027-01-15"),
        level: "Masters", field: "Any", country: "Germany",
        fundingType: "Fully Funded", amount: "€850/mo",
        eligibility: [
          "Strong academic record typically top 30% of class",
          "Political or social commitment",
          "International students enrolled at German universities welcome",
          "Good German language proficiency"
        ],
        benefits: [
          "Monthly stipend of EUR 850",
          "Study allowance",
          "Health insurance contribution",
          "Seminars and training events"
        ],
        requiredDocs: [
          "Academic transcripts",
          "Motivation letter",
          "Two references",
          "Language certificate"
        ],
        tags: ["adenauer", "Germany", "masters", "democracy", "KAS"],
        sourceUrl: "https://www.kas.de/en/web/begabtenfoerderung-und-kultur/scholarships",
        verified: true, verifiedDate: new Date("2026-08-13")
      },
      {
        title: "Australia Awards Scholarship",
        orgName: "Australian Government DFAT",
        description: "Prestigious government scholarships for mid-career professionals from eligible African countries including Nigeria to pursue a fully-funded Masters degree at an Australian university.",
        deadline: new Date("2027-04-30"),
        level: "Masters", field: "Any", country: "Australia",
        fundingType: "Fully Funded", amount: "Full Coverage",
        eligibility: [
          "Citizen of an eligible African country including Nigeria",
          "Minimum 25 years of age at commencement",
          "Minimum 5 years post-graduate work experience",
          "Currently employed at time of application",
          "Must return to home country for 2 years after studies"
        ],
        benefits: [
          "Full tuition fees at Australian university",
          "Return economy airfare",
          "Establishment allowance on arrival",
          "Monthly living stipend",
          "Overseas Student Health Cover OSHC"
        ],
        requiredDocs: [
          "Academic transcripts",
          "IELTS 6.5+ or TOEFL 84+ scores",
          "Personal statement and development impact plan",
          "Three professional references",
          "Passport copy",
          "Employer letter"
        ],
        tags: ["australia", "Africa", "masters", "fully funded", "Nigeria"],
        sourceUrl: "https://australiaawardsafrica.org/awards/apply/",
        verified: true, verifiedDate: new Date("2026-08-13")
      },
      {
        title: "Vanier Canada Graduate Scholarship",
        orgName: "Government of Canada",
        description: "Canada's most prestigious doctoral scholarship supporting students who demonstrate leadership skills and high scholarly achievement. Open to international students. Must be nominated by a Canadian university.",
        deadline: new Date("2026-11-01"),
        level: "PhD", field: "Any", country: "Canada",
        fundingType: "Fully Funded", amount: "CAD $50,000/yr",
        eligibility: [
          "Nominated by a Canadian university — you cannot apply directly",
          "GPA of at least 3.7 out of 4.0 in last two years",
          "Demonstrated leadership skills",
          "International students eligible — no citizenship restriction"
        ],
        benefits: [
          "CAD $50,000 per year for three years",
          "Vanier Scholar designation for life",
          "Exclusive networking and professional development"
        ],
        requiredDocs: [
          "University nomination package submitted by your university",
          "Research proposal",
          "Academic transcripts",
          "Leadership and research achievement record"
        ],
        tags: ["vanier", "Canada", "PhD", "leadership", "research"],
        sourceUrl: "https://vanier.gc.ca/en/home-accueil.html",
        verified: true, verifiedDate: new Date("2026-08-13")
      },
      {
        title: "Mastercard Foundation Scholars — University of Toronto",
        orgName: "Mastercard Foundation",
        description: "Scholarships for academically talented yet economically disadvantaged students from Sub-Saharan Africa to study at the University of Toronto Canada.",
        deadline: new Date("2027-01-15"),
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
          "Full tuition and fees",
          "Accommodation and meals",
          "Living expenses",
          "Leadership training and mentorship",
          "Psychosocial support"
        ],
        requiredDocs: [
          "Academic records",
          "Financial need statement",
          "Personal essay",
          "Two references",
          "Proof of citizenship"
        ],
        tags: ["mastercard", "Africa", "undergraduate", "Canada", "fully funded"],
        sourceUrl: "https://mastercardscholars.utoronto.ca/",
        verified: true, verifiedDate: new Date("2026-08-13")
      },
      {
        title: "Erasmus Mundus Joint Master Scholarship",
        orgName: "European Commission Erasmus+ Programme",
        description: "Prestigious integrated international study programmes jointly delivered by a consortium of European universities. Students study in at least two countries and receive a joint degree.",
        deadline: new Date("2027-01-15"),
        level: "Masters", field: "Any", country: "Various EU",
        fundingType: "Fully Funded", amount: "€1,400/mo",
        eligibility: [
          "From any country in the world",
          "Strong academic record",
          "Apply to a specific Erasmus Mundus Joint Master programme",
          "Language proficiency as required by chosen programme"
        ],
        benefits: [
          "Monthly contribution of EUR 1,400 for non-EU students",
          "Tuition fees waiver",
          "Travel and installation costs",
          "Health insurance",
          "Joint degree from multiple universities"
        ],
        requiredDocs: [
          "Academic transcripts",
          "Language certificates",
          "Motivation letter",
          "References",
          "CV"
        ],
        tags: ["erasmus", "Europe", "masters", "fully funded", "joint degree"],
        sourceUrl: "https://erasmus-plus.ec.europa.eu/opportunities/opportunities-for-individuals/students/erasmus-mundus-joint-masters",
        verified: true, verifiedDate: new Date("2026-08-13")
      },
      {
        title: "Swedish Institute Scholarship for Global Professionals",
        orgName: "Swedish Institute",
        description: "Full scholarship for international students to pursue a master's degree in Sweden for high-potential leaders who can contribute to sustainable development in their home country.",
        deadline: new Date("2027-02-10"),
        level: "Masters", field: "Any", country: "Sweden",
        fundingType: "Fully Funded", amount: "SEK 11,000/mo",
        eligibility: [
          "Citizen of an eligible country including Nigeria",
          "Hold a bachelor's degree",
          "Minimum 3,000 hours professional work experience",
          "Applying for master's programme starting in autumn at Swedish university"
        ],
        benefits: [
          "Monthly living allowance of SEK 11,000",
          "Full tuition fees covered",
          "One-time travel grant",
          "Insurance for duration of studies"
        ],
        requiredDocs: [
          "Academic transcripts",
          "Work experience documentation",
          "Motivation letter",
          "Two professional references",
          "CV"
        ],
        tags: ["sweden", "masters", "professionals", "fully funded", "Swedish Institute"],
        sourceUrl: "https://si.se/en/apply/scholarships/swedish-institute-scholarships-for-global-professionals/",
        verified: true, verifiedDate: new Date("2026-08-13")
      },
      {
        title: "MEXT Japanese Government Scholarship",
        orgName: "Japan Ministry of Education MEXT",
        description: "Japan's flagship government scholarship for international students to study at Japanese universities. Apply through the Japanese Embassy in your home country.",
        deadline: new Date("2026-05-21"),
        level: "Masters", field: "Any", country: "Japan",
        fundingType: "Fully Funded", amount: "¥143,000/mo",
        eligibility: [
          "Citizen of a country with diplomatic relations with Japan",
          "Age under 35 for research students",
          "Good academic record",
          "Good health — must pass medical examination"
        ],
        benefits: [
          "Monthly stipend of JPY 143,000",
          "Full tuition and examination fees",
          "Return airfare to Japan",
          "6-12 month Japanese language preparatory course"
        ],
        requiredDocs: [
          "Application form from Japanese Embassy",
          "Academic transcripts",
          "Research plan or study plan",
          "Medical certificate",
          "Recommendation letters"
        ],
        tags: ["MEXT", "Japan", "masters", "government", "research"],
        sourceUrl: "https://www.studyinjapan.go.jp/en/smap-stopj-applications-research.html",
        verified: true, verifiedDate: new Date("2026-08-13")
      },
      {
        title: "Chinese Government Scholarship CSC",
        orgName: "China Scholarship Council",
        description: "Full scholarships for international students to study in China at 300+ universities. One of the world's largest scholarship programmes with over 50,000 recipients annually.",
        deadline: new Date("2027-03-15"),
        level: "Masters", field: "Any", country: "China",
        fundingType: "Fully Funded", amount: "¥3,000/mo",
        eligibility: [
          "Non-Chinese citizen in good health",
          "Bachelor's degree for Masters applicants",
          "Age under 35 for Masters applicants"
        ],
        benefits: [
          "Full tuition waiver",
          "On-campus accommodation or accommodation allowance",
          "Monthly stipend CNY 3,000 for Masters",
          "Medical insurance",
          "Return economy airfare for full scholarship winners"
        ],
        requiredDocs: [
          "Application form",
          "Academic transcripts and degree certificates",
          "Medical certificate and blood test results",
          "Passport copy"
        ],
        tags: ["CSC", "China", "masters", "government", "fully funded"],
        sourceUrl: "https://www.campuschina.org/scholarships/index.html",
        verified: true, verifiedDate: new Date("2026-08-13")
      },
      {
        title: "Norwegian Government Quota Scholarship",
        orgName: "Norwegian Directorate for Higher Education HK-dir",
        description: "Provides scholarship opportunities for students from developing countries to pursue a full degree at a Norwegian university or university college.",
        deadline: new Date("2027-01-15"),
        level: "Masters", field: "Any", country: "Norway",
        fundingType: "Fully Funded", amount: "NOK 11,000/mo",
        eligibility: [
          "Citizen of an eligible developing country",
          "Accepted to and enrolled at a Norwegian university",
          "Under 35 years old for most awards",
          "Good academic record"
        ],
        benefits: [
          "Monthly grant of NOK 11,000",
          "Travel grant",
          "Settling-in allowance",
          "Health and travel insurance"
        ],
        requiredDocs: [
          "Proof of university admission",
          "Academic transcripts",
          "Financial need statement",
          "Passport copy"
        ],
        tags: ["norway", "masters", "government", "developing countries", "fully funded"],
        sourceUrl: "https://www.hkdir.no/en/funding/scholarship-database",
        verified: true, verifiedDate: new Date("2026-08-13")
      },
      {
        title: "Holland Scholarship",
        orgName: "Dutch Ministry of Education",
        description: "For talented international students from outside the European Economic Area who want to study at a Dutch research university or university of applied sciences.",
        deadline: new Date("2027-02-01"),
        level: "Masters", field: "Any", country: "Netherlands",
        fundingType: "Partial", amount: "€5,000",
        eligibility: [
          "From outside the European Economic Area",
          "Applying for bachelor's or master's at Dutch institution",
          "Not previously studied in Netherlands",
          "Strong academic record"
        ],
        benefits: [
          "One-off grant of EUR 5,000",
          "Access to Dutch higher education network"
        ],
        requiredDocs: [
          "Proof of admission to Dutch university",
          "Academic transcripts",
          "Motivation letter",
          "Passport copy"
        ],
        tags: ["holland", "Netherlands", "masters", "international", "grant"],
        sourceUrl: "https://www.studyinholland.nl/scholarships/highlighted-scholarships/holland-scholarship",
        verified: true, verifiedDate: new Date("2026-08-13")
      },
      {
        title: "PTDF Overseas Postgraduate Scholarship",
        orgName: "Petroleum Technology Development Fund Nigeria",
        description: "Provides opportunities for Nigerian graduates to pursue postgraduate education at leading universities in the UK and other countries in engineering and related fields.",
        deadline: new Date("2026-09-15"),
        level: "Masters", field: "Engineering", country: "UK",
        fundingType: "Fully Funded", amount: "£25,000/yr",
        eligibility: [
          "Nigerian citizen with valid NIN",
          "Second class upper 2:1 degree in relevant field",
          "Age not above 35 at time of application",
          "NYSC discharge or exemption certificate"
        ],
        benefits: [
          "Full tuition fees",
          "Monthly living stipend",
          "Return economy airfare",
          "Health insurance",
          "Books and study materials allowance"
        ],
        requiredDocs: [
          "Academic transcripts",
          "NYSC certificate",
          "Birth certificate or National ID",
          "Two references",
          "University admission letter"
        ],
        tags: ["PTDF", "Nigeria", "masters", "engineering", "oil and gas"],
        sourceUrl: "https://ptdf.gov.ng/scholarships/",
        verified: true, verifiedDate: new Date("2026-08-13")
      },
      {
        title: "Federal Government of Nigeria BEA Scholarship",
        orgName: "Federal Government of Nigeria Ministry of Education",
        description: "Awards Nigerian students the opportunity to study in countries with bilateral education agreements with Nigeria including China, Russia, Hungary, Egypt, Morocco and others.",
        deadline: new Date("2026-07-31"),
        level: "Undergraduate", field: "Any", country: "Various",
        fundingType: "Fully Funded", amount: "Full Coverage",
        eligibility: [
          "Nigerian citizen by birth",
          "O Level result with minimum of 5 credits including English and Mathematics",
          "Age between 17 and 25",
          "Good health — medical certificate required"
        ],
        benefits: [
          "Full tuition paid by host country",
          "Monthly allowance",
          "Return economy airfare",
          "Accommodation in student hostel",
          "Medical care at host institution"
        ],
        requiredDocs: [
          "WAEC or NECO result with 5 credits",
          "Birth certificate",
          "Medical certificate",
          "JAMB result",
          "Letter of identification from Local Government"
        ],
        tags: ["Nigeria", "BEA", "undergraduate", "bilateral", "fully funded"],
        sourceUrl: "https://scholarships.education.gov.ng/",
        verified: true, verifiedDate: new Date("2026-08-13")
      },
      {
        title: "NDDC Postgraduate Foreign Scholarship",
        orgName: "Niger Delta Development Commission",
        description: "Postgraduate Foreign Scholarship for Nigerians from Niger Delta states to study at reputable universities abroad in STEM and management fields.",
        deadline: new Date("2026-08-30"),
        level: "Masters", field: "STEM", country: "Various",
        fundingType: "Fully Funded", amount: "$30,000/yr",
        eligibility: [
          "Nigerian citizen and indigene of a Niger Delta state",
          "Second class upper 2:1 degree",
          "Age not above 35",
          "Evidence of admission to an accredited foreign university"
        ],
        benefits: [
          "Full tuition fees",
          "Monthly living allowance",
          "Return airfare",
          "Research materials allowance",
          "Health insurance"
        ],
        requiredDocs: [
          "Academic transcripts",
          "State of origin or LGA certificate",
          "University admission letter",
          "NYSC discharge certificate",
          "Medical certificate"
        ],
        tags: ["NDDC", "Nigeria", "Niger Delta", "masters", "STEM"],
        sourceUrl: "https://nddc.gov.ng/scholarship/",
        verified: true, verifiedDate: new Date("2026-08-13")
      },
      {
        title: "World Bank Joint Japan Graduate Scholarship",
        orgName: "World Bank and Government of Japan",
        description: "Scholarships for mid-career professionals from developing countries to pursue a master's degree related to development at accredited universities worldwide.",
        deadline: new Date("2026-04-30"),
        level: "Masters", field: "Any", country: "Various",
        fundingType: "Fully Funded", amount: "$30,000/yr",
        eligibility: [
          "Citizen of a World Bank member developing country",
          "Age 45 or below",
          "Hold a bachelor's degree",
          "Minimum 3 years work experience in development-related field"
        ],
        benefits: [
          "Full tuition fees",
          "Monthly living allowance",
          "Round-trip economy airfare",
          "Health insurance",
          "Travel allowance for fieldwork"
        ],
        requiredDocs: [
          "Application form",
          "Official academic transcripts",
          "Work experience letters",
          "Two references",
          "Proof of university admission"
        ],
        tags: ["world bank", "japan", "masters", "development", "fully funded"],
        sourceUrl: "https://www.worldbank.org/en/programs/scholarships",
        verified: true, verifiedDate: new Date("2026-08-13")
      },
      {
        title: "African Development Bank JADS Scholarship",
        orgName: "African Development Bank",
        description: "The Japan-Africa Dream Scholarship programme provides opportunities for African students to pursue postgraduate studies at leading institutions.",
        deadline: new Date("2026-08-01"),
        level: "Masters", field: "Business", country: "Various",
        fundingType: "Fully Funded", amount: "$30,000/yr",
        eligibility: [
          "African citizen from an AfDB member country",
          "Hold bachelor's degree with upper second class",
          "Employed by an organisation in Africa",
          "Maximum age 40"
        ],
        benefits: [
          "Full tuition fees",
          "Monthly living allowance",
          "Return airfare",
          "Medical insurance",
          "Books allowance"
        ],
        requiredDocs: [
          "Application form",
          "Academic transcripts",
          "Employer endorsement letter",
          "References",
          "Medical certificate"
        ],
        tags: ["AfDB", "Africa", "masters", "development", "business"],
        sourceUrl: "https://www.afdb.org/en/topics-and-sectors/initiatives-partnerships/japan-africa-dream-scholarship",
        verified: true, verifiedDate: new Date("2026-08-13")
      },
      {
        title: "Aga Khan Foundation International Scholarship",
        orgName: "Aga Khan Foundation",
        description: "Scholarships for outstanding students from developing countries who have no other means of financing postgraduate studies. Awarded as 50% grant and 50% interest-free loan.",
        deadline: new Date("2027-03-31"),
        level: "Masters", field: "Any", country: "Various",
        fundingType: "Fully Funded", amount: "Full Coverage",
        eligibility: [
          "Citizen of a developing country where AKF works",
          "Demonstrate financial need",
          "Strong academic record",
          "Age 30 or under at time of application"
        ],
        benefits: [
          "50% grant plus 50% interest-free loan",
          "Full tuition fees",
          "Living expenses",
          "Return airfare",
          "Health insurance"
        ],
        requiredDocs: [
          "Academic transcripts",
          "Financial need statement",
          "References",
          "Personal statement",
          "Proof of admission"
        ],
        tags: ["aga khan", "developing countries", "masters", "need-based", "fully funded"],
        sourceUrl: "https://www.akdn.org/our-agencies/aga-khan-foundation/international-scholarship-programme",
        verified: true, verifiedDate: new Date("2026-08-13")
      },
      {
        title: "Islamic Development Bank Merit Scholarship",
        orgName: "Islamic Development Bank",
        description: "Merit Scholarship Programme for High Technology provides scholarships to outstanding students from IsDB member countries to pursue graduate studies in STEM fields worldwide.",
        deadline: new Date("2027-01-20"),
        level: "Masters", field: "STEM", country: "Various",
        fundingType: "Fully Funded", amount: "$25,000/yr",
        eligibility: [
          "Citizen of an IsDB member country",
          "Muslim faith",
          "Strong academic record in STEM",
          "Age under 35",
          "Proof of university admission"
        ],
        benefits: [
          "Full tuition fees",
          "Monthly living stipend",
          "Return airfare",
          "Research allowance",
          "Books allowance"
        ],
        requiredDocs: [
          "Academic transcripts",
          "Proof of citizenship",
          "University admission letter",
          "Medical certificate",
          "Personal statement"
        ],
        tags: ["IsDB", "Islamic", "STEM", "masters", "fully funded"],
        sourceUrl: "https://www.isdb.org/scholarship-programs",
        verified: true, verifiedDate: new Date("2026-08-13")
      },
      {
        title: "Mo Ibrahim Foundation Scholarship",
        orgName: "Mo Ibrahim Foundation",
        description: "Scholarships for African students for postgraduate study in governance, public policy and related subjects at leading universities in the UK.",
        deadline: new Date("2026-10-01"),
        level: "Masters", field: "Social Sciences", country: "UK",
        fundingType: "Fully Funded", amount: "£30,000/yr",
        eligibility: [
          "African citizen",
          "Strong academic record",
          "Interest in African governance and public policy",
          "Under 35 years old"
        ],
        benefits: [
          "Full tuition fees",
          "Monthly living allowance",
          "Return airfare",
          "Research stipend",
          "Mo Ibrahim Foundation networking"
        ],
        requiredDocs: [
          "Academic transcripts",
          "Personal statement on governance",
          "References",
          "CV"
        ],
        tags: ["Mo Ibrahim", "Africa", "governance", "UK", "fully funded"],
        sourceUrl: "https://mo.ibrahim.foundation/",
        verified: true, verifiedDate: new Date("2026-08-13")
      },
      {
        title: "IMF Scholarship Program for Africa",
        orgName: "International Monetary Fund",
        description: "Supports African graduate students pursuing advanced studies in economics, finance and related quantitative fields at accredited universities. Includes mentorship from IMF economists.",
        deadline: new Date("2027-02-28"),
        level: "Masters", field: "Economics", country: "Various",
        fundingType: "Fully Funded", amount: "$25,000/yr",
        eligibility: [
          "African citizen from Sub-Saharan Africa",
          "Accepted or enrolled in accredited Masters in economics",
          "Strong mathematical and quantitative background",
          "Under 30 years old"
        ],
        benefits: [
          "Annual living stipend",
          "Tuition coverage",
          "IMF staff mentorship",
          "Internship consideration at IMF"
        ],
        requiredDocs: [
          "Academic transcripts",
          "GRE scores preferred",
          "Personal statement",
          "Three references",
          "Proof of university admission"
        ],
        tags: ["IMF", "Africa", "economics", "masters", "finance"],
        sourceUrl: "https://www.imf.org/en/About/Recruitment/spa",
        verified: true, verifiedDate: new Date("2026-08-13")
      },
      {
        title: "Rotary Foundation Global Grant",
        orgName: "Rotary International Foundation",
        description: "Global Grants support large international activities with sustainable outcomes in Rotary's areas of focus. Includes graduate study abroad related to Rotary's six areas of focus.",
        deadline: new Date("2026-07-15"),
        level: "Masters", field: "Any", country: "Various",
        fundingType: "Fully Funded", amount: "$30,000+",
        eligibility: [
          "Must be sponsored by a local Rotary club",
          "Strong academic record",
          "Clear project related to Rotary's areas of focus",
          "Language proficiency for host country"
        ],
        benefits: [
          "Grant of minimum USD 30,000",
          "Access to Rotary global network",
          "Cultural exchange opportunities"
        ],
        requiredDocs: [
          "Application through local Rotary club",
          "Academic transcripts",
          "Project proposal",
          "References"
        ],
        tags: ["rotary", "global", "masters", "community", "development"],
        sourceUrl: "https://www.rotary.org/en/our-programs/scholarships",
        verified: true, verifiedDate: new Date("2026-08-13")
      },
      {
        title: "Global Health Corps Fellowship",
        orgName: "Global Health Corps",
        description: "Places talented individuals under 30 in high-impact health organisations in Sub-Saharan Africa and the United States as full-time paid fellows for one year. No health background required.",
        deadline: new Date("2027-01-20"),
        level: "Postdoctoral", field: "Medicine", country: "Various",
        fundingType: "Fully Funded", amount: "$700/mo",
        eligibility: [
          "Age 30 or under at start of fellowship",
          "Bachelor's degree in any field",
          "Passion for health equity and social justice",
          "Willingness to relocate to placement country for one year"
        ],
        benefits: [
          "Monthly living stipend",
          "Housing allowance",
          "Health insurance",
          "Professional development budget",
          "Global Health Corps alumni community"
        ],
        requiredDocs: [
          "Online application form",
          "CV or Resume",
          "Personal essay",
          "Two professional references"
        ],
        tags: ["global health", "fellowship", "Africa", "medicine", "equity"],
        sourceUrl: "https://ghcorps.org/fellows/apply/",
        verified: true, verifiedDate: new Date("2026-08-13")
      },
      {
        title: "Charles Wallace Nigeria Trust Fellowship",
        orgName: "Charles Wallace Nigeria Trust",
        description: "Small grants and fellowships for Nigerians in the creative arts, cultural heritage and humanities to visit the UK for short-term training, research or collaboration.",
        deadline: new Date("2027-01-31"),
        level: "Postdoctoral", field: "Arts & Humanities", country: "UK",
        fundingType: "Partial", amount: "£3,000",
        eligibility: [
          "Nigerian citizen permanently resident in Nigeria",
          "Working professionally in arts culture or humanities",
          "Minimum 2 years relevant professional experience",
          "Clear specific project or collaboration purpose in the UK"
        ],
        benefits: [
          "Grant towards travel and living costs",
          "Access to UK arts and cultural sector",
          "British Council support network"
        ],
        requiredDocs: [
          "Project proposal",
          "Professional CV",
          "Two references",
          "Detailed budget breakdown"
        ],
        tags: ["charles wallace", "Nigeria", "arts", "humanities", "UK"],
        sourceUrl: "https://www.britishcouncil.org.ng/study-uk/charles-wallace-nigeria-trust",
        verified: true, verifiedDate: new Date("2026-08-13")
      },
      {
        title: "AERC Collaborative Masters in Economics",
        orgName: "African Economic Research Consortium",
        description: "Provides scholarships for African students to pursue high-quality master's level education in economics at partner African universities across the continent.",
        deadline: new Date("2027-01-31"),
        level: "Masters", field: "Economics", country: "Various",
        fundingType: "Fully Funded", amount: "$18,000/yr",
        eligibility: [
          "African citizen",
          "Bachelor's in economics or quantitative field",
          "Strong mathematical background",
          "Commitment to work in Africa after graduation"
        ],
        benefits: [
          "Full tuition at partner African university",
          "Monthly living allowance",
          "Research support",
          "AERC professional network access"
        ],
        requiredDocs: [
          "Academic transcripts",
          "References",
          "Statement of purpose",
          "GRE or equivalent preferred"
        ],
        tags: ["AERC", "Africa", "economics", "masters", "research"],
        sourceUrl: "https://aercafrica.org/collaborative-masters-programme/",
        verified: true, verifiedDate: new Date("2026-08-13")
      },
      {
        title: "Fogarty International Research Scholarship NIH",
        orgName: "Fogarty International Center NIH",
        description: "NIH's Fogarty International Center supports global health research and training for researchers from low and middle income countries at NIH or US partner institutions.",
        deadline: new Date("2026-10-01"),
        level: "PhD", field: "Medicine", country: "USA",
        fundingType: "Fully Funded", amount: "$45,000/yr",
        eligibility: [
          "From a low or middle income country",
          "PhD student or early-career researcher",
          "Research in global health",
          "Affiliation with an eligible institution"
        ],
        benefits: [
          "Research stipend",
          "Tuition support",
          "Research and travel expenses",
          "Access to NIH facilities"
        ],
        requiredDocs: [
          "Research proposal",
          "Academic transcripts",
          "References",
          "Institutional letter of support"
        ],
        tags: ["fogarty", "NIH", "global health", "PhD", "research"],
        sourceUrl: "https://www.fic.nih.gov/Programs/Pages/default.aspx",
        verified: true, verifiedDate: new Date("2026-08-13")
      },
      {
        title: "Forté Foundation MBA Fellowship",
        orgName: "Forté Foundation",
        description: "Awarded to outstanding women applicants at top MBA programs worldwide to increase the number of women in business leadership positions.",
        deadline: new Date("2027-03-01"),
        level: "Masters", field: "Business", country: "USA",
        fundingType: "Partial", amount: "$50,000",
        eligibility: [
          "Woman applicant",
          "Applying to a Forté Foundation partner MBA programme",
          "Strong leadership track record",
          "GMAT or GRE scores meeting programme requirements"
        ],
        benefits: [
          "Fellowship award up to $50,000",
          "Access to Forté Foundation network",
          "Leadership conferences and career programming",
          "Mentorship"
        ],
        requiredDocs: [
          "MBA application to a Forté partner school",
          "GMAT or GRE scores",
          "References",
          "Essays",
          "Transcripts"
        ],
        tags: ["forte", "MBA", "women", "business", "leadership"],
        sourceUrl: "https://www.fortefoundation.org/site/PageServer?pagename=mba_fellowships",
        verified: true, verifiedDate: new Date("2026-08-13")
      },
      {
        title: "Trudeau Foundation Scholarship",
        orgName: "Pierre Elliott Trudeau Foundation",
        description: "Supports doctoral candidates whose research explores complex social issues in human rights, responsible citizenship, Canada in the world, and people and their natural environment.",
        deadline: new Date("2026-12-01"),
        level: "PhD", field: "Social Sciences", country: "Canada",
        fundingType: "Fully Funded", amount: "CAD $40,000/yr",
        eligibility: [
          "Enrolled in doctoral programme at a Canadian university",
          "Research addressing complex social questions",
          "Demonstrated social engagement and leadership"
        ],
        benefits: [
          "Annual award of CAD $40,000 for up to 4 years",
          "Travel and research allowances up to CAD $20,000 per year",
          "Mentorship from Trudeau Foundation members",
          "Exclusive retreat and community events"
        ],
        requiredDocs: [
          "Research proposal",
          "Academic transcripts",
          "References",
          "Personal essay on social commitment"
        ],
        tags: ["trudeau", "Canada", "PhD", "social sciences", "human rights"],
        sourceUrl: "https://www.trudeaufoundation.ca/programs/trudeau-scholarships",
        verified: true, verifiedDate: new Date("2026-08-13")
      },
    ];

    // ── Add org ID to every scholarship ──────────────────
    const scholarships = data.map(s => ({
      ...s,
      organization: org._id,
      status: 'active',
      views: 0,
      bookmarks: 0,
    }));

    // ── Insert all at once ────────────────────────────────
    const inserted = await Scholarship.insertMany(scholarships);
    console.log(`🎓 Successfully inserted ${inserted.length} scholarships!\n`);

    // ── Summary ───────────────────────────────────────────
    const countries = {};
    const levels = {};
    scholarships.forEach(s => {
      countries[s.country] = (countries[s.country] || 0) + 1;
      levels[s.level]   = (levels[s.level]   || 0) + 1;
    });

    console.log('📊 By country:');
    Object.entries(countries)
      .sort((a, b) => b[1] - a[1])
      .forEach(([c, n]) => console.log(`   ${c.padEnd(22)} ${n}`));

    console.log('\n📊 By level:');
    Object.entries(levels)
      .forEach(([l, n]) => console.log(`   ${l.padEnd(22)} ${n}`));

    const ff = scholarships.filter(s => s.fundingType === 'Fully Funded').length;
    console.log(`\n💰 Fully Funded: ${ff} | Partial: ${inserted.length - ff}`);
    console.log('\n✅ Done! Refresh /pages/find.html to see all scholarships.\n');
    process.exit(0);

  } catch (err) {
    console.error('\n❌ Error:', err.message);
    process.exit(1);
  }
}

run();