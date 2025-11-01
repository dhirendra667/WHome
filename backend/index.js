import app from './app.js';
import connectToDB from './config/dbConn.js';


const PORT = process.env.PORT || 5000;




app.listen(PORT, async () => {
    //connect to DB
    await connectToDB();
    console.log(`App is running at port: ${PORT}`);
    
})