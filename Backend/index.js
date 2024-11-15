  import express from "express";
  import bodyParser from "body-parser";
  import cors from 'cors';

  import authRoutes from './routes/authRoutes.js'; 
  import db from './db/index.js';


  const app = express();
  const port = process.env.PORT||3000;


  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json()); //! Added this while doing authentication , some features may break
  app.use(express.static("public"));
  
  app.use(cors({
    origin: 'http://localhost:5173', // Replace with the origin of your frontend
    credentials: true // Allows cookies to be sent and received
}));

  app.use('/api/auth', authRoutes);

  app.get("/api/home", async (req, res) => {
    try {
      const result = await db.query("SELECT * from gallery")

      // console.log(result.rows)
      res.send(result.rows);  // Send both sets of images in the response
    } catch (error) {
      console.error("Error fetching images:", error);
      res.status(500).send("Error fetching images");
    }
  });
  app.get("/api/get/categoryCovers", async (req, res) => {
    try {
      const result = await db.query("SELECT * from categories")

      // console.log(result.rows)
      res.send(result.rows);  // Send both sets of images in the response
    } catch (error) {
      console.error("Error fetching images:", error);
      res.status(500).send("Error fetching images");
    }
  });


  app.get("/api/Photowalks", async (req, res) => {
    try {
        const result = await db.query(
        "SELECT *  FROM photowalk "
      )
      res.json(result.rows);  // Send both sets of images in the response
    } catch (error) {
      console.error("Error fetching images:", error);
      res.status(500).send("Error fetching images");
    }
  });

  // Get the data from a single photowalk

  app.get("/api/Photowalks/:walkId", async (req, res) => {
    try {
      const walkId = req.params.walkId;
      var result = await db.query("SELECT * FROM photowalk WHERE id = $1",
        [walkId]);
        res.send(result.rows);
        // Send both sets of images in the response
    } catch (error) {
      console.error("Error fetching images:", error);
      res.status(500).send("Error fetching images");
    }
  });

  // Get a list of Events
  app.get("/api/events", async (req, res) => {
    try {
      const result = await db.query(
        "SELECT id,venue,name,date,cover_img  FROM events "
      )
      res.send(result.rows);  // Send both sets of images in the response
    } catch (error) {
      console.error("Error fetching images:", error);
      res.status(500).send("Error fetching images");
    }
  });

  // Get the entire data about the Event
  app.get("/api/Events/:eventId", async (req, res) => {
    try {
      const eventId = req.params.eventId;
      var result = await db.query("SELECT * FROM events WHERE id = $1",
        [eventId]);
        res.send(result.rows);
        // Send both sets of images in the response
    } catch (error) {
      console.error("Error fetching images:", error);
      res.status(500).send("Error fetching images");
    }
  });

  app.get("/api/images/Events/:eventId", async (req, res) => {
    try {
      const eventId = req.params.eventId;
      var result = await db.query("SELECT * FROM event_images WHERE eventid = $1",
        [eventId]);
        res.send(result.rows);
        // Send both sets of images in the response
    } catch (error) {
      console.error("Error fetching images:", error);
      res.status(500).send("Error fetching images");
    }
  });
  app.get("/api/images/Photowalks/:walkId", async (req, res) => {
    try {
      const walkId = req.params.walkId;
      var result = await db.query("SELECT * FROM photowalk_images WHERE photowalkid = $1",
        [walkId]);
        res.send(result.rows);
        // Send both sets of images in the response
    } catch (error) {
      console.error("Error fetching images:", error);
      res.status(500).send("Error fetching images");
    }
  });
    app.get("/api/get/core", async (req, res) => {
      try {
        var result = await db.query("SELECT * FROM society ");
          res.send(result.rows);
          // Send both sets of images in the response
      } catch (error) {
        console.error("Error fetching images:", error);
        res.status(500).send("Error fetching images");
      }
    });

    app.get("/api/category/item/:id",async (req,res)=>{
      const { id } = req.params;
      
      var result = await db.query("SELECT * from images WHERE category_id = $1 ",
        [id]); 
      var cat = result.rows;
      res.send(cat);
    })

    app.get('/api/categories', async (req, res) => {
      try {
          const result = await db.query('SELECT category FROM categories ');
          res.json(result.rows); // Send only the category names
      } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Failed to fetch categories' });
      }
  });

  app.get('/api/get/reviews', async (req, res) => {
    try {
      const result = await db.query("SELECT * FROM reviews ORDER BY created_at DESC");
      console.log(result.rows)
      res.send(result.rows);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).send("Error fetching reviews");
    }
  });

  app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
  });
