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

// Helper function to delete a file from storage
const deleteFile = (DBfilePath) => {
  console.log(DBfilePath)
  const filePath = path.join(baseUploadPath, '..', DBfilePath);
  console.log(filePath);
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) console.error(`Error deleting file: ${filePath}`, err);
      else console.log(`Successfully deleted file: ${filePath}`);
    });
  }
};

//!------------------------------------------------------------------- Configuring the disk storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Check if the URL is for the gallery endpoint
    let categoryPath;
    if (req.originalUrl.includes("/api/admin/upload/gallery")) {
      categoryPath = path.join(baseUploadPath, "gallery");
    } 
    else if (req.originalUrl.includes("/api/admin/post/reviews")) {
      categoryPath = path.join(baseUploadPath, "reviews");
    } 
    else if (req.originalUrl.includes("/api/admin/put/reviews")) {
      categoryPath = path.join(baseUploadPath, "reviews");
    } 
    else if (req.originalUrl.includes("/api/society")) {
      categoryPath = path.join(baseUploadPath, "society");
    } 
    else if (req.originalUrl.includes("/api/admin/categories/upload")) {
      categoryPath = path.join(baseUploadPath, "categories");
    } 
    else if (req.originalUrl.includes("/api/admin/photowalks/upload")) {
      categoryPath = path.join(baseUploadPath, "photowalks");
    } 
    else if (req.originalUrl.includes("/api/admin/events/upload")) {
      categoryPath = path.join(baseUploadPath, "events");
    } 
    else if (req.originalUrl.includes("/api/admin/cover")) {
      categoryPath = path.join(baseUploadPath, "covers");
    } 
    else {
      categoryPath = path.join(baseUploadPath,"misc");
    }

    // Check if the directory exists; if not, create it
    if (!fs.existsSync(categoryPath)) {
      fs.mkdirSync(categoryPath, { recursive: true }); // Recursively create directories if needed
    }

    cb(null, categoryPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() ;
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});



const upload = multer({ storage: storage })

//Info about the express app
const app = express();
const port = process.env.PORT||4000;
app.use(express.json());

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


// *--------------------------------------------------------------------DELETING IMAGES FRORM TILES
app.delete("/api/admin/categories/:id", async (req, res) => {
  const id = req.params.id;
  const result = await db.query("SELECT image_url FROM images WHERE id = $1", [id]);
  if (result.rows.length > 0) {
    deleteFile(result.rows[0].image_url);
  }
  await db.query("DELETE FROM images WHERE id = $1", [id]);
  res.send("Deleted");
});

app.delete("/api/admin/photowalks/:id", async (req, res) => {
  const id = req.params.id;
  const result = await db.query("SELECT image_url FROM photowalk_images WHERE id = $1", [id]);
  if (result.rows.length > 0) {
    deleteFile(result.rows[0].image_url);
  }
  await db.query("DELETE FROM photowalk_images WHERE id = $1", [id]);
  res.send("Deleted");
});

app.delete("/api/admin/events/:id", async (req, res) => {
  const id = req.params.id;
  const result = await db.query("SELECT image_url FROM event_images WHERE id = $1", [id]);
  if (result.rows.length > 0) {
    deleteFile(result.rows[0].image_url);
  }
  await db.query("DELETE FROM event_images WHERE id = $1", [id]);
  res.send("Deleted");
});

//*------------------------------------------------Uploading images in tiles on any particular event , photowalk or category

//Uploading in category

app.post('/api/admin/categories/upload/:category', upload.single('image'), async function (req, res, next) {
  
  const { itemId } = req.body;
  const result = await db.query("SELECT category from categories WHERE id = $1",
    [itemId]
  )
  const category = result.rows[0].category;
  const filePath = `/uploads/categories/${req.file.filename}`;
  try {
    // Insert image details into database
    await db.query(
      "INSERT INTO images (category, image_url, category_id) VALUES ($1, $2,$3)",
      [category, filePath,itemId]
    );
    res.send("done");
  } catch (error) {
    console.error("Error saving to database:", error);
    res.status(500).send("Error saving image data to database.");
  }
})

//uploading in photowalks
app.post('/api/admin/photowalks/upload/:walkId', upload.single('image'), async function (req, res, next) {
  const { walkId } = req.params;
  console.log(walkId)  ;  
  
  const { itemId } = req.body;
  console.log(itemId)

  const filePath = `/uploads/photowalks/${req.file.filename}`;
  try {
    // Insert image details into database
    await db.query(
      "INSERT INTO photowalk_images ( image_url, photowalkid) VALUES ($1, $2)",
      [filePath,itemId]
    );
    res.send("done");
  } catch (error) {
    console.error("Error saving to database:", error);
    res.status(500).send("Error saving image data to database.");
  }
})

// uploading in images
app.post('/api/admin/events/upload/:eventId', upload.single('image'), async function (req, res, next) {
  const { eventId } = req.params;
  //console.log(walkId)  
  
  const { itemId } = req.body;
  console.log(itemId)

  const filePath = `/uploads/events/${req.file.filename}`;
  try {
    // Insert image details into database
    await db.query(
      "INSERT INTO event_images ( image_url, eventid) VALUES ($1, $2)",
      [filePath,itemId]
    );
    res.send("done");
  } catch (error) {
    console.error("Error saving to database:", error);
    res.status(500).send("Error saving image data to database.");
  }
})

//*------------------------------------------------------------- Universal GET route for categories, events, and photowalks
  // Serving fetch in items.jsx
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
      //console.log(result.rows);
      res.send(result.rows);

  } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Error fetching data" });
  }
});

//  Get all images from a particular category id 
app.get("/api/admin/categories/item/:id",async (req,res)=>{
  const { id } = req.params;
  //console.log(category);
  var result = await db.query("SELECT * from images WHERE category_id = $1 ",
    [id]);
  var cat = result.rows;
  res.send(cat);
})

// Get all images from a photowalk category id 
app.get("/api/admin/photowalks/item/:id",async (req,res)=>{
  const { id } = req.params;
  console.log(id);
  var result = await db.query("SELECT * from photowalk_images WHERE photowalkId = $1 ",
    [id]);
  var cat = result.rows;
  res.send(cat);
})
// Get all images from a event category id 
app.get("/api/admin/events/item/:id",async (req,res)=>{
  const { id } = req.params;
  console.log(id);
  var result = await db.query("SELECT * from event_images WHERE eventId = $1 ",
    [id]);
  var cat = result.rows;
  res.send(cat);
})

//* --------------------------------------------------------------ADD NEW CATEOGORY, PW, EVENT
// Add a new category 
app.post("/api/admin/cover/addcategories",upload.single('file'),async(req,res)=>{
  const { name} = req.body;
  const filePath = `/uploads/covers/${req.file.filename}`;
  
  try{
    const result =  await db.query(
      "INSERT INTO categories (category,cover_img) VALUES ($1,$2)  RETURNING *", // Adjust table and column names as per your database schema
      [name,filePath]
    );  
    res.status(201).json(result.rows[0]);
  } catch (error) {
      console.error("Error adding category:", error);
      res.status(500).send("Error adding category");
  }
})

// Add a new photowalk
app.post('/api/admin/cover/addphotowalk', upload.single('file'), async function (req, res, next) {
  const { description , location, genre, date } = req.body;
  const filePath = `/uploads/covers/${req.file.filename}`;
  try {
    // Insert image details into database
    await db.query(
      "INSERT INTO photowalk (locations, description, cover_img , genre, date) VALUES ($1, $2,$3, $4, $5) ",
      [location, description, filePath, genre, date]
    );
    res.send("done");
  } catch (error) {
    console.error("Error saving to database:", error);
    res.status(500).send("Error saving image data to database.");
  }
})

// Add a new event
app.post('/api/admin/cover/addevent', upload.single('file'), async function (req, res, next) {
  const { description , location, genre, name,date } = req.body;
  const filePath = `/uploads/covers/${req.file.filename}`;
  try {
    // Insert image details into database
    await db.query(
      "INSERT INTO events (venue, description, cover_img , genre , name,date) VALUES ($1, $2,$3, $4, $5, $6 ) ",
      [location, description, filePath, genre, name,date]
    );
    res.send("done");
  } catch (error) {
    console.error("Error saving to database:", error);
    res.status(500).send("Error saving image data to database.");
  }
})
 //*--------------------------------------------------------------GALLERY ROUTES

 // GET THE IMAGES USED IN GALLERY
app.get("/api/admin/get/gallery", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM gallery");
    res.send(result.rows);
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    res.status(500).json({ error: "Error fetching gallery images" });
  }
});

// POST NEW IMAGES IN GALLERY
app.post("/api/admin/upload/gallery",upload.single('image'), async (req, res) => {
  const { caption , orientation} =  req.body;
  const filePath = `/uploads/gallery/${req.file.filename}`;
  
  try {
    const result = await db.query("INSERT INTO gallery (image_url, caption, orientation) VALUES ($1,$2,$3)",
      [filePath,caption,orientation]
    );
    res.send(result.rows);
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    res.status(500).json({ error: "Error fetching gallery images" });
  }
});

// DELETE IMAGES FROM GALLERY
app.delete("/api/admin/delete/gallery/:id", async (req,res) => {
  const id = req.params.id;
  const result = await db.query("SELECT image_url FROM gallery WHERE id = $1", [id]);
  if (result.rows.length > 0) {
    deleteFile(result.rows[0].image_url);
    
  }
  await db.query("DELETE FROM gallery WHERE id = $1",
    [id]
  )
})

// EDIT GALLERY IMAGE DATA
app.put("/api/admin/edit/gallery/:editingId", async (req,res) => {
  const editingId = req.params.editingId;
  const {caption, orientation} = req.body;

  await db.query("UPDATE gallery SET caption = $1, orientation = $2	WHERE id = $3",
    [caption,orientation,editingId]
  )
})

//*----------------------------------------------------------------HANDLE REVIEWS
app.get("/api/admin/get/reviews", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM reviews ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).send("Error fetching reviews");
  }
});

// Add a new review
app.post("/api/admin/post/reviews",upload.single('profile_pic') ,async (req, res) => {
  const { username, review_text, rating } = req.body;
  const filePath = `/uploads/reviews/${req.file.filename}`;
  console.log(req.file)
  try {
    const result = await db.query(
      "INSERT INTO reviews (username, review_text, rating,profile_pic) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, review_text, rating, filePath]
    );
    res.send(result.rows[0])
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).send("Error adding review");
  }
});

// Update an existing review  
app.put("/api/admin/put/reviews/:id", upload.single('profile_pic'), async (req, res) => {
  const { id }= req.params;
  const { username, review_text, rating } = req.body;
  const filePath =req.file ? `/uploads/reviews/${req.file.filename}` : null;
  console.log(req.file)
  try {
    const result = await db.query(
      "UPDATE reviews SET username = $1, review_text = $2, rating = $3, profile_pic = COALESCE($4, profile_pic) WHERE id = $5 RETURNING *",
      [username, review_text, rating, filePath, id]
    );
    res.send(result.rows[0])
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).send("Error adding review");
  }
});

// Delete a review
app.delete("/api/admin/reviews/:id", async (req, res) => {
  const { id } = req.params;
  const result = await db.query("SELECT profile_pic FROM reviews WHERE id = $1", [id]);
 
  if (result.rows.length > 0) {
    deleteFile(result.rows[0].profile_pic);
  }
  try {
    await db.query("DELETE FROM reviews WHERE id = $1", [id]);
    res.send("Review deleted successfully");
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).send("Error deleting review");
  }
});

//*--------------------------------------------------------------HANDLE MEMBERS
//GET NEW MEMEBRS
app.get('/api/society', async (req, res) => {
  try {
      const result = await db.query('SELECT * FROM society');
      res.send(result.rows);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching members' });
  }
});

//POST NEW MEMBERS
app.post('/api/society', upload.single('profile_pic'), async (req, res) => {
  const { member_name, position, description, instagram } = req.body;
  const filePath = `/uploads/society/${req.file.filename}`;
  try { 
      const result = await db.query(
          'INSERT INTO society (member_name, position, description, instagram, profile_pic) VALUES ($1, $2, $3, $4, $5) RETURNING *',
          [member_name, position, description, instagram, filePath]
      );
      res.json(result.rows[0]);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error adding member' });
  }
});

//DELETE NEW MEMBERS
app.delete('/api/society/:id', async (req, res) => {
  const { id } = req.params;
  const result = await db.query("SELECT profile_pic FROM society WHERE id = $1", [id]);
  if (result.rows.length > 0) {
    deleteFile(result.rows[0].profile_pic);
  }
  try {
      await db.query('DELETE FROM society WHERE id = $1', [id]);
      res.json({ message: 'Member deleted' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error deleting member' });
  }
});

// EDIT OLD MEMBERS
app.put('/api/society/:id', upload.single('profile_pic'), async (req, res) => {
  const { id } = req.params;
  const { member_name, position, description, instagram } = req.body;
  const filePath =req.file ? `/uploads/society/${req.file.filename}` : null;
  try {
      const query = `
          UPDATE society
          SET member_name = $1, position = $2, description = $3, instagram = $4, profile_pic = COALESCE($5, profile_pic)
          WHERE id = $6 RETURNING *
      `;
      const result = await db.query(query, [member_name, position, description, instagram, filePath, id]);
      res.json(result.rows[0]);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating member' });
  }
});

// *----------------------------------------------Routes to update categories, events, and photowalks with file handling

// Helper function to handle update logic with file upload and existing file deletion
const handleUpdate = async (table, id, name, req, res) => {
  const filePath = req.file ? `/uploads/covers/${req.file.filename}` : null;
  let result;
  if (filePath) {
      result = await db.query(`SELECT cover_img FROM ${table} WHERE id = $1`, [id]);
  }
  try {
      await db.query(
          `UPDATE ${table} SET name = $1, cover_img = COALESCE($2, cover_img) WHERE id = $3`,
          [name, filePath, id]
      );
      if (filePath) deleteFile(result.rows[0].cover_img);
      res.status(200).send({ message: `${table} updated successfully` });
  } catch (error) {
      console.error(error);
      res.status(500).send(`Error updating ${table}`);
  }
};

app.put('/api/admin/cover/:type/:id', upload.single('file'), async (req, res) => {
  const { type, id } = req.params;
  const { name } = req.body;
  const tableMap = {
      categories: 'categories',
      events: 'events',
      photowalks: 'photowalk'
  };
  const table = tableMap[type];
  if (table) {
      await handleUpdate(table, id, name, req, res);
  } else {
      res.status(400).send("Invalid type parameter");
  }
});
//* ----------------------------------- Routes to delete categories, events, and photowalks with file handling
// Helper function to delete an item and its associated file
const handleDelete = async (table, id, res) => {
  try {
      const result = await db.query(`SELECT cover_img FROM ${table} WHERE id = $1`, [id]);
      await db.query(`DELETE FROM ${table} WHERE id = $1`, [id]);
      deleteFile(result.rows[0].cover_img);
      res.status(200).send({ message: `${table} deleted successfully` });
  } catch (error) {
      console.error(error);
      res.status(500).send(`Error deleting ${table}`);
  }
};

app.delete('/api/admin/delete/:type/:id', async (req, res) => {
  const { type, id } = req.params;
  const tableMap = {
      categories: 'categories',
      events: 'events',
      photowalks: 'photowalk'
  };
  const table = tableMap[type];
  if (table) {
      await handleDelete(table, id, res);
  } else {
      res.status(400).send("Invalid type parameter");
  }
});
//*---------------------------- Routes to get count of associated images for categories, events, and photowalks
// Helper function for counting items in related tables
const handleCount = async (table, column, id, res) => {
  try {
      const result = await db.query(`SELECT id FROM ${table} WHERE ${column} = $1`, [id]);
      res.send({ num: result.rows.length });
  } catch (error) {
      console.error(error);
      res.status(500).send(`Error counting items for ${table}`);
  }
};

app.get('/api/admin/count/:type/:id', async (req, res) => {
  const { type, id } = req.params;
  const countMap = {
      categories: { table: 'images', column: 'category_id' },
      events: { table: 'event_images', column: 'eventid' },
      photowalks: { table: 'photowalk_images', column: 'photowalkid' }
  };
  const config = countMap[type];
  if (config) {
      await handleCount(config.table, config.column, id, res);
  } else {
      res.status(400).send("Invalid type parameter");
  }
});

 

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
