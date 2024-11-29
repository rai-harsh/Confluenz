import express from "express";
import bodyParser from "body-parser";
import path from "path"
import { fileURLToPath } from 'url';
import fs from 'fs';
import cookieParser from "cookie-parser";

import { uploadToCloudinary } from './utils/cloudinary.js';
import { uploadMiddleware } from './middleware/multer.js';

import { authenticateToken } from './middleware/authMiddleware.js';
import db from './db/index.js';

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



//Info about the express app
const app = express();
// const port = process.env.PORT||4000;
const port =4000;
app.use(express.json());


app.use(bodyParser.urlencoded({ extended: true }));

// Serving these folders 
app.use(express.static("public"));
// Serving these folders with correct static path
app.use('/uploads', express.static(baseUploadPath));
app.use(cookieParser());





// *--------------------------------------------------------------------DELETING IMAGES FRORM TILES
app.delete("/api/admin/categories/:id",authenticateToken, async (req, res) => {
  const id = req.params.id;
  const result = await db.query("SELECT image_url FROM images WHERE id = $1", [id]);
  if (result.rows.length > 0) {
    deleteFile(result.rows[0].image_url);
  }
  await db.query("DELETE FROM images WHERE id = $1", [id]);
  res.send("Deleted");
});

app.delete("/api/admin/photowalks/:id",authenticateToken, async (req, res) => {
  const id = req.params.id;
  const result = await db.query("SELECT image_url FROM photowalk_images WHERE id = $1", [id]);
  if (result.rows.length > 0) {
    deleteFile(result.rows[0].image_url);
  }
  await db.query("DELETE FROM photowalk_images WHERE id = $1", [id]);
  res.send("Deleted");
});

app.delete("/api/admin/events/:id",authenticateToken, async (req, res) => {
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

app.post('/api/admin/categories/upload/:category', uploadMiddleware('image'),authenticateToken, async function (req, res, next) {
  
  const { itemId } = req.body;
  const result = await db.query("SELECT category from categories WHERE id = $1",
    [itemId]
  )
  const category = result.rows[0].category;
  try {
    // Insert image details into database
    const uploadResult = req.file ? await uploadToCloudinary(req.file.path, 'photowalks') : null;

    await db.query(
      "INSERT INTO images (category, image_url, category_id) VALUES ($1, $2,$3)",
      [category, uploadResult.secure_url,itemId]
    );
    res.send("done");
  } catch (error) {
    console.error("Error saving to database:", error);
    res.status(500).send("Error saving image data to database.");
  }
})

//uploading in photowalks
app.post('/api/admin/photowalks/upload/:walkId', uploadMiddleware('image'),authenticateToken, async function (req, res, next) {
  const { walkId } = req.params;
  const { itemId } = req.body;

  try {
      // Upload image to Cloudinary
      const uploadResult = await uploadToCloudinary(req.file.path, 'photowalks');

      // Insert the Cloudinary URL into the database
      await db.query(
          'INSERT INTO photowalk_images (image_url, photowalkid) VALUES ($1, $2)',
          [uploadResult.secure_url, itemId]
      );
   
      res.status(200).json({ message: 'Image uploaded successfully', url: uploadResult.secure_url });
  } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).send('Error uploading image.');
  }
}
);

// uploading in images
app.post('/api/admin/events/upload/:eventId', uploadMiddleware('image'),authenticateToken, async function (req, res, next) {
  const { eventId } = req.params;
  //console.log(walkId)  
  
  const { itemId } = req.body;
  console.log(itemId)

  try {
    const uploadResult = req.file ? await uploadToCloudinary(req.file.path, 'photowalks') : null;

    // Insert image details into database
    await db.query(
      "INSERT INTO event_images ( image_url, eventid) VALUES ($1, $2)",
      [uploadResult.secure_url,itemId]
    );
    res.send("done");
  } catch (error) {
    console.error("Error saving to database:", error);
    res.status(500).send("Error saving image data to database.");
  }
})

//*------------------------------------------------------------- Universal GET route for categories, events, and photowalks
  // Serving fetch in items.jsx
app.get("/api/admin/:type",authenticateToken, async (req, res) => {
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
app.post("/api/admin/cover/addcategories",uploadMiddleware('file'),async(req,res)=>{
  const { name} = req.body;
  
  try{
    const uploadResult = await uploadToCloudinary(req.file.path, 'photowalks');
    console.log(uploadResult.secure_url)
    const result =  await db.query(
      "INSERT INTO categories (category,cover_img) VALUES ($1,$2)  RETURNING *", // Adjust table and column names as per your database schema
      [name,uploadResult.secure_url]
    );  
    res.status(201).json(result.rows[0]);
  } catch (error) {
      console.error("Error adding category:", error);
      res.status(500).send("Error adding category");
  }
})

// Add a new photowalk
app.post('/api/admin/cover/addphotowalk', uploadMiddleware('file'),authenticateToken, async function (req, res, next) {
  const { description , location, genre, date } = req.body;
  try {
    const uploadResult = await uploadToCloudinary(req.file.path, 'photowalks');

    // Insert image details into database
    await db.query(
      "INSERT INTO photowalk (locations, description, cover_img , genre, date) VALUES ($1, $2,$3, $4, $5) ",
      [location, description, uploadResult.secure_url, genre, date]
    );
    res.send("done");
  } catch (error) {
    console.error("Error saving to database:", error);
    res.status(500).send("Error saving image data to database.");
  }
})

// Add a new event
app.post('/api/admin/cover/addevent', uploadMiddleware('file'),authenticateToken, async function (req, res, next) {
  const { description , location, genre, name,date } = req.body;
  try {
    const uploadResult = await uploadToCloudinary(req.file.path, 'photowalks');

    // Insert image details into database
    await db.query(
      "INSERT INTO events (venue, description, cover_img , genre , name,date) VALUES ($1, $2,$3, $4, $5, $6 ) ",
      [location, description, uploadResult.secure_url, genre, name,date]
    );
    res.send("done");
  } catch (error) {
    console.error("Error saving to database:", error);
    res.status(500).send("Error saving image data to database.");
  }
})
 //*--------------------------------------------------------------GALLERY ROUTES

 // GET THE IMAGES USED IN GALLERY
app.get("/api/admin/get/gallery",authenticateToken, async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM gallery");
    res.send(result.rows);
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    res.status(500).json({ error: "Error fetching gallery images" });
  }
});

// POST NEW IMAGES IN GALLERY
app.post("/api/admin/upload/gallery",uploadMiddleware('image'),authenticateToken, async (req, res) => {
  const { caption , orientation} =  req.body;
  
  try {
    const uploadResult = await uploadToCloudinary(req.file.path, 'photowalks');
    const result = await db.query("INSERT INTO gallery (image_url, caption, orientation) VALUES ($1,$2,$3)",
      [uploadResult.secure_url,caption,orientation]
    );
    //res.status(200).json({ message: 'Image uploaded successfully', url: uploadResult.secure_url });
    res.send(result.rows);
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).send('Error uploading image.');
  }
});


// DELETE IMAGES FROM GALLERY
app.delete("/api/admin/delete/gallery/:id",authenticateToken, async (req,res) => {
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
app.put("/api/admin/edit/gallery/:editingId",authenticateToken, async (req,res) => {
  const editingId = req.params.editingId;
  const {caption, orientation} = req.body;
  
  console.log(orientation);
  await db.query("UPDATE gallery SET caption = $1, orientation = $2	WHERE id = $3",
    [caption,orientation,editingId]
  )
  res.status(200).send("Edited successfully")
})

//*----------------------------------------------------------------HANDLE REVIEWS
app.get("/api/admin/get/reviews",authenticateToken, async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM reviews ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).send("Error fetching reviews");
  }
});

// Add a new review
app.post("/api/admin/post/reviews",uploadMiddleware('profile_pic') ,async (req, res) => {
  const { username, review_text, rating } = req.body;
  // console.log(req.file)
  try {
    const uploadResult = await uploadToCloudinary(req.file.path, 'photowalks');
    const result = await db.query(
      "INSERT INTO reviews (username, review_text, rating,profile_pic) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, review_text, rating, uploadResult.secure_url]
    );
    res.send(result.rows[0])
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).send("Error adding review");
  }
});

// Update an existing review   
app.put("/api/admin/put/reviews/:id",authenticateToken, async (req, res) => {
  const { id }= req.params;
  const { username, review_text, rating } = req.body;
  try {

    const result = await db.query(
      "UPDATE reviews SET username = $1, review_text = $2, rating = $3 WHERE id = $4 RETURNING *",
      [username, review_text, rating,id]
    );
    res.send(result.rows[0])
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).send("Error adding review");
  }
});

// Delete a review
app.delete("/api/admin/reviews/:id",authenticateToken, async (req, res) => {
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
app.get('/api/society', authenticateToken,authenticateToken, async (req, res) => {
  try {
      const result = await db.query('SELECT * FROM society');
      res.send(result.rows);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching members' });
  }
});

//POST NEW MEMBERS
app.post('/api/society', uploadMiddleware('profile_pic'),authenticateToken, async (req, res) => {
  const { member_name, position, description, instagram } = req.body;
  try { 
    const uploadResult = await uploadToCloudinary(req.file.path, 'photowalks');

      const result = await db.query(
          'INSERT INTO society (member_name, position, description, instagram, profile_pic) VALUES ($1, $2, $3, $4, $5) RETURNING *',
          [member_name, position, description, instagram, uploadResult.secure_url]
      );
      res.json(result.rows[0]);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error adding member' });
  }
});

//DELETE NEW MEMBERS
app.delete('/api/society/:id',authenticateToken, async (req, res) => {
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
app.put('/api/society/:id', uploadMiddleware('profile_pic'),authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { member_name, position, description, instagram } = req.body;
  try {
        const uploadResult = req.file ? await uploadToCloudinary(req.file.path, 'photowalks') : null;

      const query = `
          UPDATE society
          SET member_name = $1, position = $2, description = $3, instagram = $4, profile_pic = COALESCE($5, profile_pic)
          WHERE id = $6 RETURNING *
      `;
      const result = await db.query(query, [member_name, position, description, instagram, uploadResult.secure_url, id]);
      res.json(result.rows[0]);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating member' });
  }
});

// *----------------------------------------------Routes to update categories, events, and photowalks with file handling

// Helper function to handle update logic with file upload and existing file deletion
const handleUpdate = async (table, id, name, req, res) => {
  let filePath = null;

  try {
    // Try uploading the file if it exists
    if (req.file) {
      filePath = await uploadToCloudinary(req.file.path, 'photowalks');
    }
  } catch (uploadError) {
    console.error("Error uploading to Cloudinary:", uploadError);
    return res.status(500).send({ message: "Error uploading file to Cloudinary" });
  }

  let result;

  // Map columns to their respective tables
  const columnMap = {
    categories: 'category',
    events: 'name',
    photowalk: 'locations'
  };
  const column = columnMap[table];

  if (filePath) {
    try {
      // Get existing file path if updating
      result = await db.query(`SELECT cover_img FROM ${table} WHERE id = $1`, [id]);
    } catch (dbSelectError) {
      console.error("Error fetching existing file path from database:", dbSelectError);
      return res.status(500).send({ message: "Error fetching existing file from database" });
    }
  }

  try {
    // Perform the update
    await db.query(
      `UPDATE ${table} SET ${column} = $1, cover_img = COALESCE($2, cover_img) WHERE id = $3`,
      [name, filePath?.secure_url, id]
    );

    // Delete the old file if a new one was uploaded
    if (filePath && result?.rows[0]?.cover_img) {
      deleteFile(result.rows[0].cover_img);
    }

    res.status(200).send({ message: `${table} updated successfully` });
  } catch (dbUpdateError) {
    console.error("Error updating the database:", dbUpdateError);
    res.status(500).send(`Error updating ${table}`);
  }
};
 

app.put('/api/admin/cover/:type/:id', uploadMiddleware('file'),authenticateToken, async (req, res) => {
  const { type, id } = req.params;
  const { name } = req.body;
  console.log(type)
  console.log(id)
  console.log(name)
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

app.delete('/api/admin/delete/:type/:id',authenticateToken, async (req, res) => {
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

app.get('/api/admin/count/:type/:id',authenticateToken, async (req, res) => {
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
