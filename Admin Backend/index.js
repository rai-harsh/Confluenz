import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import multer from 'multer';
import path from "path"
import { fileURLToPath } from 'url';
import fs from 'fs';

//Selecting the upload path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseUploadPath = path.join(__dirname, '..', 'Backend', 'uploads');

// Configuring the disk storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const categoryPath = path.join(baseUploadPath, req.params.category);

    // Check if the directory exists; if not, create it
    if (!fs.existsSync(categoryPath)) {
      fs.mkdirSync(categoryPath, { recursive: true }); // Recursively create directories if needed
    }

    cb(null, categoryPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage })

//Info about the express app
const app = express();
const port = process.env.PORT||4000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "Confluenz",
    password: "120422",
    port: 5432,
  });
  db.connect();

app.use(bodyParser.urlencoded({ extended: true }));

// Serving these folders 
app.use(express.static("public"));
// Serving these folders with correct static path
app.use('/uploads', express.static(baseUploadPath));



app.get("/api/typeId", async(req,res)=>{
    var result = await db.query("SELECT venue,id  from events");
    const events = result.rows;
    var result = await db.query("SELECT locations,id from photowalk");
    const walk = result.rows;
    res.send({events,walk});
  })

// app.post('/api/uploadImage', upload.single('file'), (req, res) => {
//   console.log(req.body); // Logs text data from the form
//   console.log(req.file); // Logs the file information
//   res.send(req.body);
// });
// app.post('/api/uploadPhotowalk', upload.single('file'), (req, res) => {
//     console.log(req.body); // Logs text data from the form
//     console.log(req.file); // Logs the file information
//     res.send(req.body);
//   });


app.get("/api/admin/categories/:category",async (req,res)=>{
  const { category } = req.params;
  console.log(category);
  var result = await db.query("SELECT * from images WHERE category = $1 ",
    [category]);
  var cat = result.rows;
  res.send(cat);
})
app.delete("/api/admin/categories/:id",async (req,res)=>{
  var id = (req.params.id)
  await db.query("DELETE from images WHERE id = $1 ",
    [id]
  );
  res.send(`Deleted`);
})
app.post('/api/admin/categories/upload/:category', upload.single('image'), async function (req, res, next) {
  console.log(req.file)  
  const { category } = req.params;
  const filePath = `/uploads/${category}/${req.file.filename}`;
  try {
    // Insert image details into database
    await db.query(
      "INSERT INTO images (category, image_url) VALUES ($1, $2)",
      [category, filePath]
    );
    res.send("done");
  } catch (error) {
    console.error("Error saving to database:", error);
    res.status(500).send("Error saving image data to database.");
  }
})

// Universal GET route for categories, events, and photowalks
app.get("/api/admin/:type", async (req, res) => {
  const { type } = req.params;
  let query;

  // Determine the query based on the type parameter
  if (type === "categories") {
      query = "SELECT * FROM categories";
  } else if (type === "events") {
      query = "SELECT * FROM events";
  } else if (type === "photowalks") {
      query = "SELECT * FROM photowalk";
  } else {
      return res.status(400).json({ error: "Invalid type specified" });
  }

  try {
      const result = await db.query(query);
      console.log(result.rows);
      res.send(result.rows);

  } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Error fetching data" });
  }
});



app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
