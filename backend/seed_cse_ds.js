/**
 * seed_cse_ds.js  —  Inserts 20 CSE-DS Section C students via the REST API.
 * Usage: node seed_cse_ds.js <email> <password>
 */

const http = require("http");

const BASE = "http://localhost:5000";

const students = [
  { name: "Aanya Verma",        email: "aanya.verma@clg.edu",        rollNo: "DS2024001", branch: "CSE-DS", section: "C", year: 1, cgpa: 9.2,  phone: "+91-9911001001" },
  { name: "Rohan Kulkarni",     email: "rohan.kulkarni@clg.edu",     rollNo: "DS2024002", branch: "CSE-DS", section: "C", year: 1, cgpa: 8.7,  phone: "+91-9911002002" },
  { name: "Ishita Sharma",      email: "ishita.sharma@clg.edu",      rollNo: "DS2024003", branch: "CSE-DS", section: "C", year: 1, cgpa: 7.9,  phone: "+91-9911003003" },
  { name: "Devesh Mishra",      email: "devesh.mishra@clg.edu",      rollNo: "DS2024004", branch: "CSE-DS", section: "C", year: 1, cgpa: 8.4,  phone: "+91-9911004004" },
  { name: "Prachi Gupta",       email: "prachi.gupta@clg.edu",       rollNo: "DS2024005", branch: "CSE-DS", section: "C", year: 1, cgpa: 9.5,  phone: "+91-9911005005" },
  { name: "Aman Soni",          email: "aman.soni@clg.edu",          rollNo: "DS2024006", branch: "CSE-DS", section: "C", year: 1, cgpa: 7.2,  phone: "+91-9911006006" },
  { name: "Snehal Joshi",       email: "snehal.joshi@clg.edu",       rollNo: "DS2024007", branch: "CSE-DS", section: "C", year: 1, cgpa: 8.9,  phone: "+91-9911007007" },
  { name: "Parth Agarwal",      email: "parth.agarwal@clg.edu",      rollNo: "DS2024008", branch: "CSE-DS", section: "C", year: 1, cgpa: 6.8,  phone: "+91-9911008008" },
  { name: "Ridhi Kapoor",       email: "ridhi.kapoor@clg.edu",       rollNo: "DS2024009", branch: "CSE-DS", section: "C", year: 1, cgpa: 9.0,  phone: "+91-9911009009" },
  { name: "Saksham Tiwari",     email: "saksham.tiwari@clg.edu",     rollNo: "DS2024010", branch: "CSE-DS", section: "C", year: 1, cgpa: 8.1,  phone: "+91-9911010010" },
  { name: "Anushka Bajaj",      email: "anushka.bajaj@clg.edu",      rollNo: "DS2024011", branch: "CSE-DS", section: "C", year: 1, cgpa: 7.6,  phone: "+91-9911011011" },
  { name: "Krish Malhotra",     email: "krish.malhotra@clg.edu",     rollNo: "DS2024012", branch: "CSE-DS", section: "C", year: 1, cgpa: 8.3,  phone: "+91-9911012012" },
  { name: "Tanushree Rao",      email: "tanushree.rao@clg.edu",      rollNo: "DS2024013", branch: "CSE-DS", section: "C", year: 1, cgpa: 9.4,  phone: "+91-9911013013" },
  { name: "Nitin Chaudhary",    email: "nitin.chaudhary@clg.edu",    rollNo: "DS2024014", branch: "CSE-DS", section: "C", year: 1, cgpa: 7.3,  phone: "+91-9911014014" },
  { name: "Vrinda Singh",       email: "vrinda.singh@clg.edu",       rollNo: "DS2024015", branch: "CSE-DS", section: "C", year: 1, cgpa: 8.6,  phone: "+91-9911015015" },
  { name: "Harsh Rajan",        email: "harsh.rajan@clg.edu",        rollNo: "DS2024016", branch: "CSE-DS", section: "C", year: 1, cgpa: 6.5,  phone: "+91-9911016016" },
  { name: "Pallavi Nair",       email: "pallavi.nair@clg.edu",       rollNo: "DS2024017", branch: "CSE-DS", section: "C", year: 1, cgpa: 8.8,  phone: "+91-9911017017" },
  { name: "Siddhanth Mehta",    email: "siddhanth.mehta@clg.edu",    rollNo: "DS2024018", branch: "CSE-DS", section: "C", year: 1, cgpa: 7.7,  phone: "+91-9911018018" },
  { name: "Jiya Pandey",        email: "jiya.pandey@clg.edu",        rollNo: "DS2024019", branch: "CSE-DS", section: "C", year: 1, cgpa: 9.1,  phone: "+91-9911019019" },
  { name: "Laksh Rajput",       email: "laksh.rajput@clg.edu",       rollNo: "DS2024020", branch: "CSE-DS", section: "C", year: 1, cgpa: 8.0,  phone: "+91-9911020020" },
];

function request(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const options = {
      hostname: "localhost",
      port: 5000,
      path,
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(payload ? { "Content-Length": Buffer.byteLength(payload) } : {}),
      },
    };
    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function main() {
  const [,, email, password] = process.argv;
  if (!email || !password) {
    console.error("Usage: node seed_cse_ds.js <email> <password>");
    process.exit(1);
  }

  console.log(`\n🔐 Logging in as ${email}…`);
  const loginRes = await request("POST", "/api/auth/login", { email, password });
  if (loginRes.status !== 200) {
    console.error("❌ Login failed:", loginRes.body?.message || loginRes.body);
    process.exit(1);
  }
  const token = loginRes.body.token;
  console.log("✅ Login successful!\n");
  console.log("🎓 Seeding CSE-DS | Section C | Year 1\n");

  let inserted = 0, skipped = 0;
  for (const student of students) {
    const res = await request("POST", "/api/students", student, token);
    if (res.status === 201) {
      console.log(`  ✅ [${String(inserted + skipped + 1).padStart(2, "0")}] ${student.name}`);
      inserted++;
    } else {
      const msg = res.body?.message || "unknown error";
      console.log(`  ⚠️  [${String(inserted + skipped + 1).padStart(2, "0")}] ${student.name} — skipped (${msg})`);
      skipped++;
    }
    await sleep(80);
  }

  console.log(`\n🎉 Done!  Inserted: ${inserted}  |  Skipped: ${skipped}\n`);
}

main().catch((err) => { console.error("Fatal:", err.message); process.exit(1); });
