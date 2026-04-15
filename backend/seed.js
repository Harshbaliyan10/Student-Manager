/**
 * seed.js  —  Inserts 40 sample students via the live REST API.
 *
 * Usage:
 *   node seed.js <email> <password>
 *
 * Example:
 *   node seed.js test@test.com 123456
 *
 * The script logs in with your credentials, grabs the JWT token,
 * then POSTs every student one by one.
 */

const http = require("http");

const BASE = "http://localhost:5000";

// ── 40 realistic sample students ────────────────────────────
const students = [
  { name: "Aarav Sharma",      email: "aarav.sharma@clg.edu",      rollNo: "CS2021001", branch: "CSE", year: 4, cgpa: 9.1,  phone: "+91-9812345678" },
  { name: "Priya Mehta",       email: "priya.mehta@clg.edu",       rollNo: "IT2021002", branch: "IT",  year: 4, cgpa: 8.7,  phone: "+91-9823456789" },
  { name: "Rohan Verma",       email: "rohan.verma@clg.edu",       rollNo: "EC2022003", branch: "ECE", year: 3, cgpa: 7.5,  phone: "+91-9834567890" },
  { name: "Sneha Patel",       email: "sneha.patel@clg.edu",       rollNo: "EE2022004", branch: "EEE", year: 3, cgpa: 8.2,  phone: "+91-9845678901" },
  { name: "Karan Singh",       email: "karan.singh@clg.edu",       rollNo: "ME2023005", branch: "ME",  year: 2, cgpa: 6.8,  phone: "+91-9856789012" },
  { name: "Ananya Gupta",      email: "ananya.gupta@clg.edu",      rollNo: "CE2023006", branch: "CE",  year: 2, cgpa: 7.9,  phone: "+91-9867890123" },
  { name: "Vikram Nair",       email: "vikram.nair@clg.edu",       rollNo: "CS2024007", branch: "CSE", year: 1, cgpa: 8.5,  phone: "+91-9878901234" },
  { name: "Pooja Iyer",        email: "pooja.iyer@clg.edu",        rollNo: "IT2021008", branch: "IT",  year: 4, cgpa: 9.3,  phone: "+91-9889012345" },
  { name: "Arjun Reddy",       email: "arjun.reddy@clg.edu",       rollNo: "EC2021009", branch: "ECE", year: 4, cgpa: 7.1,  phone: "+91-9890123456" },
  { name: "Divya Joshi",       email: "divya.joshi@clg.edu",       rollNo: "CS2022010", branch: "CSE", year: 3, cgpa: 8.9,  phone: "+91-9801234567" },
  { name: "Rahul Kapoor",      email: "rahul.kapoor@clg.edu",      rollNo: "ME2021011", branch: "ME",  year: 4, cgpa: 5.4,  phone: "+91-9712345678" },
  { name: "Meera Pillai",      email: "meera.pillai@clg.edu",      rollNo: "CE2022012", branch: "CE",  year: 3, cgpa: 7.6,  phone: "+91-9723456789" },
  { name: "Aditya Kumar",      email: "aditya.kumar@clg.edu",      rollNo: "EE2021013", branch: "EEE", year: 4, cgpa: 8.0,  phone: "+91-9734567890" },
  { name: "Neha Agarwal",      email: "neha.agarwal@clg.edu",      rollNo: "IT2023014", branch: "IT",  year: 2, cgpa: 9.0,  phone: "+91-9745678901" },
  { name: "Siddharth Rao",     email: "siddharth.rao@clg.edu",     rollNo: "CS2023015", branch: "CSE", year: 2, cgpa: 7.3,  phone: "+91-9756789012" },
  { name: "Kavya Menon",       email: "kavya.menon@clg.edu",       rollNo: "EC2023016", branch: "ECE", year: 2, cgpa: 8.4,  phone: "+91-9767890123" },
  { name: "Nikhil Tiwari",     email: "nikhil.tiwari@clg.edu",     rollNo: "ME2022017", branch: "ME",  year: 3, cgpa: 6.2,  phone: "+91-9778901234" },
  { name: "Simran Kaur",       email: "simran.kaur@clg.edu",       rollNo: "CE2021018", branch: "CE",  year: 4, cgpa: 7.8,  phone: "+91-9789012345" },
  { name: "Yash Trivedi",      email: "yash.trivedi@clg.edu",      rollNo: "CS2024019", branch: "CSE", year: 1, cgpa: 8.6,  phone: "+91-9790123456" },
  { name: "Riya Chaudhary",    email: "riya.chaudhary@clg.edu",    rollNo: "IT2024020", branch: "IT",  year: 1, cgpa: 9.2,  phone: "+91-9612345678" },
  { name: "Abhishek Das",      email: "abhishek.das@clg.edu",      rollNo: "EE2022021", branch: "EEE", year: 3, cgpa: 6.5,  phone: "+91-9623456789" },
  { name: "Tanvi Saxena",      email: "tanvi.saxena@clg.edu",      rollNo: "EC2024022", branch: "ECE", year: 1, cgpa: 8.1,  phone: "+91-9634567890" },
  { name: "Ishaan Bose",       email: "ishaan.bose@clg.edu",       rollNo: "ME2024023", branch: "ME",  year: 1, cgpa: 7.4,  phone: "+91-9645678901" },
  { name: "Palak Srivastava",  email: "palak.srivastava@clg.edu",  rollNo: "CS2021024", branch: "CSE", year: 4, cgpa: 9.5,  phone: "+91-9656789012" },
  { name: "Harsh Mishra",      email: "harsh.mishra@clg.edu",      rollNo: "CE2023025", branch: "CE",  year: 2, cgpa: 5.9,  phone: "+91-9667890123" },
  { name: "Sanya Bhatt",       email: "sanya.bhatt@clg.edu",       rollNo: "IT2022026", branch: "IT",  year: 3, cgpa: 8.8,  phone: "+91-9678901234" },
  { name: "Varun Malhotra",    email: "varun.malhotra@clg.edu",    rollNo: "CS2022027", branch: "CSE", year: 3, cgpa: 7.2,  phone: "+91-9689012345" },
  { name: "Nisha Pandey",      email: "nisha.pandey@clg.edu",      rollNo: "EE2024028", branch: "EEE", year: 1, cgpa: 8.3,  phone: "+91-9690123456" },
  { name: "Manish Yadav",      email: "manish.yadav@clg.edu",      rollNo: "ME2021029", branch: "ME",  year: 4, cgpa: 4.8,  phone: "+91-9512345678" },
  { name: "Kriti Agnihotri",   email: "kriti.agnihotri@clg.edu",   rollNo: "EC2022030", branch: "ECE", year: 3, cgpa: 8.6,  phone: "+91-9523456789" },
  { name: "Samar Oberoi",      email: "samar.oberoi@clg.edu",      rollNo: "CE2024031", branch: "CE",  year: 1, cgpa: 7.0,  phone: "+91-9534567890" },
  { name: "Anika Chatterjee",  email: "anika.chatterjee@clg.edu",  rollNo: "CS2023032", branch: "CSE", year: 2, cgpa: 9.4,  phone: "+91-9545678901" },
  { name: "Dev Shukla",        email: "dev.shukla@clg.edu",        rollNo: "IT2021033", branch: "IT",  year: 4, cgpa: 7.7,  phone: "+91-9556789012" },
  { name: "Preeti Bansal",     email: "preeti.bansal@clg.edu",     rollNo: "EE2021034", branch: "EEE", year: 4, cgpa: 8.9,  phone: "+91-9567890123" },
  { name: "Lakshay Sethi",     email: "lakshay.sethi@clg.edu",     rollNo: "ME2023035", branch: "ME",  year: 2, cgpa: 6.7,  phone: "+91-9578901234" },
  { name: "Rhea Desai",        email: "rhea.desai@clg.edu",        rollNo: "CE2022036", branch: "CE",  year: 3, cgpa: 7.9,  phone: "+91-9589012345" },
  { name: "Kabir Ahuja",       email: "kabir.ahuja@clg.edu",       rollNo: "CS2024037", branch: "CSE", year: 1, cgpa: 8.2,  phone: "+91-9590123456" },
  { name: "Zara Khan",         email: "zara.khan@clg.edu",         rollNo: "EC2021038", branch: "ECE", year: 4, cgpa: 9.0,  phone: "+91-9412345678" },
  { name: "Armaan Luthra",     email: "armaan.luthra@clg.edu",     rollNo: "IT2023039", branch: "IT",  year: 2, cgpa: 7.6,  phone: "+91-9423456789" },
  { name: "Trisha Chakraborty",email: "trisha.chakraborty@clg.edu",rollNo: "CS2022040", branch: "CSE", year: 3, cgpa: 8.5,  phone: "+91-9434567890" },
];

// ── Helpers ──────────────────────────────────────────────────
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

// ── Main ─────────────────────────────────────────────────────
async function main() {
  const [,, email, password] = process.argv;
  if (!email || !password) {
    console.error("Usage: node seed.js <email> <password>");
    process.exit(1);
  }

  // 1. Login
  console.log(`\n🔐 Logging in as ${email}…`);
  const loginRes = await request("POST", "/api/auth/login", { email, password });
  if (loginRes.status !== 200) {
    console.error("❌ Login failed:", loginRes.body?.message || loginRes.body);
    process.exit(1);
  }
  const token = loginRes.body.token;
  console.log("✅ Login successful!\n");

  // 2. Seed students
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
    await sleep(80); // gentle throttle
  }

  console.log(`\n🎉 Done! Inserted: ${inserted}  |  Skipped (already exist): ${skipped}\n`);
}

main().catch((err) => { console.error("Fatal:", err.message); process.exit(1); });
