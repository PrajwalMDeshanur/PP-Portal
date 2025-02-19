// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const { Pool } = require("pg");

// const app = express();
// const port = process.env.PORT || 5000;

// // PostgreSQL connection setup using .env variables
// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_DATABASE,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT || 5432,
// });

// // Middleware

// // ✅ Fix CORS to allow React frontend (localhost:3000)
// app.use(
//   cors({
//     origin: "http://localhost:3000", // Allow frontend to call backend
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true, // Allow cookies if needed
//   })
// );

// app.use(express.json());

// app.use(express.json());

// // ✅ Check Database Connection & Start Server
// pool
//   .connect()
//   .then(() => {
//     console.log("✅ Connected to PostgreSQL successfully!");

//     // Start the server **only if the DB connection is successful**
//     app.listen(port, () => {
//       console.log(`🚀 Server running at http://localhost:${port}`);
//     });
//   })
//   .catch((err) => {
//     console.error("❌ Database connection error:", err);
//     process.exit(1); // Exit if DB connection fails
//   });

// // 🔹 Create a new student
// app.post("/student", async (req, res) => {
//   const {
//     nmms_reg_number,
//     student_name,
//     father_name,
//     gender,
//     nmms_year,
//     gmat_score,
//     sat_score,
//     dob,
//   } = req.body;

//   try {
//     const result = await pool.query(
//       "INSERT INTO student (nmms_reg_number, student_name, father_name, gender, nmms_year, gmat_score, sat_score, dob) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
//       [
//         nmms_reg_number,
//         student_name,
//         father_name,
//         gender,
//         nmms_year,
//         gmat_score,
//         sat_score,
//         dob,
//       ]
//     );

//     res.status(201).json({
//       message: "✅ Student added successfully!",
//       student: result.rows[0],
//     });
//   } catch (err) {
//     console.error("❌ Error inserting student:", err);
//     res.status(500).json({ message: "❌ Server error", error: err });
//   }
// });

// // 🔹 Get all students
// app.get("/student", async (req, res) => {
//   try {
//     const result = await pool.query(
//       "SELECT * FROM student ORDER BY student_name ASC;"
//     );
//     res.json(result.rows);
//   } catch (err) {
//     console.error("❌ Error fetching students:", err);
//     res.status(500).json({ message: "❌ Server error", error: err });
//   }
// });

// // 🔹 Update a student by ID
// app.put("/student/:id", async (req, res) => {
//   const { id } = req.params;
//   const {
//     nmms_reg_number,
//     student_name,
//     father_name,
//     gender,
//     nmms_year,
//     gmat_score,
//     sat_score,
//     dob,
//   } = req.body;

//   try {
//     const result = await pool.query(
//       "UPDATE student SET nmms_reg_number = $1, student_name = $2, father_name = $3, gender = $4, nmms_year = $5, gmat_score = $6, sat_score = $7, dob = $8 WHERE id = $9 RETURNING *",
//       [
//         nmms_reg_number,
//         student_name,
//         father_name,
//         gender,
//         nmms_year,
//         gmat_score,
//         sat_score,
//         dob,
//         id,
//       ]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: "❌ Student not found" });
//     }

//     res.json({
//       message: "✅ Student updated successfully!",
//       student: result.rows[0],
//     });
//   } catch (err) {
//     console.error("❌ Error updating student:", err);
//     res.status(500).json({ message: "❌ Server error", error: err });
//   }
// });

// // 🔹 Delete a student by ID
// app.delete("/student/:id", async (req, res) => {
//   const { id } = req.params;

//   try {
//     const result = await pool.query(
//       "DELETE FROM student WHERE id = $1 RETURNING *",
//       [id]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: "❌ Student not found" });
//     }

//     res.status(204).send(); // No content response
//   } catch (err) {
//     console.error("❌ Error deleting student:", err);
//     res.status(500).json({ message: "❌ Server error", error: err });
//   }
// });

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const csv = require("csv-parser");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 5000;

// ✅ PostgreSQL Connection Setup using .env Variables
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_DATABASE || "dummydb",
  password: process.env.DB_PASSWORD || "123",
  port: process.env.DB_PORT || 5432,
});

// ✅ Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Allow frontend calls
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Allow cookies if needed
  })
);
app.use(express.json());

// ✅ Ensure Database Connection Before Starting Server
pool
  .connect()
  .then(() => {
    console.log("✅ Connected to PostgreSQL successfully!");
    createTable(); // Ensure table exists before processing requests
    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err);
    process.exit(1); // Exit if DB connection fails
  });

// ✅ Ensure Table Exists
const createTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS student (
      id SERIAL PRIMARY KEY,
      nmms_reg_number VARCHAR(50) NOT NULL,
      student_name VARCHAR(100) NOT NULL,
      father_name VARCHAR(100) NOT NULL,
      gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')) NOT NULL,
      nmms_year VARCHAR(10) NOT NULL,
      gmat_score INT CHECK (gmat_score >= 0) NOT NULL,
      sat_score INT CHECK (sat_score >= 0) NOT NULL,
      dob DATE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(query);
    console.log("✅ Table checked/created successfully.");
  } catch (error) {
    console.error("❌ Error creating table:", error);
  }
};

// ✅ CRUD APIs for Students

// 🔹 Create a new student
app.post("/student", async (req, res) => {
  const {
    nmms_reg_number,
    student_name,
    father_name,
    gender,
    nmms_year,
    gmat_score,
    sat_score,
    dob,
  } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO student (nmms_reg_number, student_name, father_name, gender, nmms_year, gmat_score, sat_score, dob) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [
        nmms_reg_number,
        student_name,
        father_name,
        gender,
        nmms_year,
        gmat_score,
        sat_score,
        dob,
      ]
    );

    res.status(201).json({
      message: "✅ Student added successfully!",
      student: result.rows[0],
    });
  } catch (err) {
    console.error("❌ Error inserting student:", err);
    res.status(500).json({ message: "❌ Server error", error: err });
  }
});

// 🔹 Get all students (sorted by name)
app.get("/student", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM student ORDER BY student_name ASC;"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching students:", err);
    res.status(500).json({ message: "❌ Server error", error: err });
  }
});

// 🔹 Update a student by ID
app.put("/student/:id", async (req, res) => {
  const { id } = req.params;
  const {
    nmms_reg_number,
    student_name,
    father_name,
    gender,
    nmms_year,
    gmat_score,
    sat_score,
    dob,
  } = req.body;

  try {
    const result = await pool.query(
      "UPDATE student SET nmms_reg_number = $1, student_name = $2, father_name = $3, gender = $4, nmms_year = $5, gmat_score = $6, sat_score = $7, dob = $8 WHERE id = $9 RETURNING *",
      [
        nmms_reg_number,
        student_name,
        father_name,
        gender,
        nmms_year,
        gmat_score,
        sat_score,
        dob,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "❌ Student not found" });
    }

    res.json({
      message: "✅ Student updated successfully!",
      student: result.rows[0],
    });
  } catch (err) {
    console.error("❌ Error updating student:", err);
    res.status(500).json({ message: "❌ Server error", error: err });
  }
});

// 🔹 Delete a student by ID
app.delete("/student/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM student WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "❌ Student not found" });
    }

    res.status(204).send(); // No content response
  } catch (err) {
    console.error("❌ Error deleting student:", err);
    res.status(500).json({ message: "❌ Server error", error: err });
  }
});

// ✅ File Upload (CSV to PostgreSQL)

// 🔹 Setup Multer for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "./uploads/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `upload_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// 🔹 API to Upload CSV File and Insert Data into Database
app.post("/api/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "❌ No file uploaded" });
  }

  const filePath = req.file.path;
  const results = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      results.push(row);
    })
    .on("end", async () => {
      try {
        for (const row of results) {
          const query = `
            INSERT INTO student (nmms_reg_number, student_name, father_name, gender, nmms_year, gmat_score, sat_score, dob)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
          `;
          await pool.query(query, [
            row.nmms_reg_number,
            row.student_name,
            row.father_name,
            row.gender,
            row.nmms_year,
            parseInt(row.gmat_score),
            parseInt(row.sat_score),
            row.dob,
          ]);
        }
        res.status(200).json({ message: "✅ File uploaded and data inserted successfully!" });
      } catch (error) {
        console.error("❌ Error inserting data:", error);
        res.status(500).json({ message: "❌ Error inserting data into database" });
      }
    });
});
