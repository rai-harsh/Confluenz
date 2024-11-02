import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import multer from 'multer';

const upload = multer({ dest: 'uploads/' }); 

const app = express();
const port = process.env.PORT||3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "Confluenz",
    password: "120422",
    port: 5432,
  });
  db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));



async function getimages() {
  const cpImages = [];
  const monoImages = [];

  const result1 = await db.query(
    "SELECT image_url,category,aspect_ratio FROM images WHERE grading = $1 ",
    [ 'brown']
  );
  result1.rows.forEach((item) => {
    cpImages.push(item);
  });

  const result2 = await db.query(
    "SELECT image_url,category FROM images WHERE grading = $1 ",
    [ 'monochrome']
  );
  result2.rows.forEach((item) => {
    monoImages.push(item);
  });

  return { cpImages, monoImages };  // Return both sets of images
}

app.get("/api/home", async (req, res) => {
  try {
    const { cpImages, monoImages } = await getimages();
     // Optional: Log to check the data
    res.json({ cpImages, monoImages });  // Send both sets of images in the response
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).send("Error fetching images");
  }
});

async function  getPhotowalk(){
  const result = await db.query(
    "SELECT *  FROM photowalk "
  )
  return result.rows;
  
}
app.get("/api/Photowalks", async (req, res) => {
  try {
    const pw = await getPhotowalk();
     // Optional: Log to check the data
    res.json(pw);  // Send both sets of images in the response
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).send("Error fetching images");
  }
});

// Get the data from a single photowalk
async function getWalkData(a){
  const result = await db.query(
    "SELECT photowalk.dates ,photowalk.cover_img ,photowalk.locations, photowalk.description, images.image_url FROM photowalk JOIN images ON images.type_id = photowalk.id WHERE images.type = 'Photowalk' AND photowalk.id = $1",
    [a]
  );
  return result.rows;
}
app.get("/api/Photowalks/:walkId", async (req, res) => {
  try {
    const walkId = req.params.walkId;
    const walk = await getWalkData(walkId);
     // Optional: Log to check the data
    res.json(walk);  // Send both sets of images in the response
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).send("Error fetching images");
  }
});

// Get a list of Events
async function  getEvents(){
  const result = await db.query(
    "SELECT id,venue,name,dates,cover_img  FROM events "
  )
  return result.rows;
  
}
app.get("/api/events", async (req, res) => {
  try {
    const pw = await getEvents();
     // Optional: Log to check the data
    res.json(pw);  // Send both sets of images in the response
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).send("Error fetching images");
  }
});

// Get the entire data about the Event
async function getEventData(a){
  const result = await db.query(
    "SELECT events.name , events.dates ,events.cover_img ,events.venue, events.description, images.image_url FROM events JOIN images ON images.type_id = events.id WHERE images.type = 'Event' AND events.id = $1",
    [a]
  );
  return result.rows;
}
app.get("/api/Events/:eventId", async (req, res) => {
  try {

    const eventId = req.params.eventId;
    const event = await getEventData(eventId);
    console.log(event);
     // Optional: Log to check the data
    res.json(event);  // Send both sets of images in the response
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).send("Error fetching images");
  }
});
app.get("/api/typeId", async(req,res)=>{
  var result = await db.query("SELECT venue,id  from events");
  const events = result.rows;
  var result = await db.query("SELECT locations,id from photowalk");
  const walk = result.rows;
  res.send({events,walk});
})
app.post('/api/uploadImage', upload.single('file'), (req, res) => {
  console.log(req.body); // Logs text data from the form
  console.log(req.file); // Logs the file information
  res.send(req.body);
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
