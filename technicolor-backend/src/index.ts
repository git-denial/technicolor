import 'dotenv/config'
import express, {Express} from 'express'
import DatabaseService from "./services/DatabaseService";
import bodyParser from "body-parser";
import cors from 'cors'
import userRoutes from "./routes/v1/userRoutes";
import vendorRoutes from "./routes/v1/vendorRoutes";
import adminRoutes from "./routes/v1/adminRoutes";
import productRoutes from "./routes/v1/productRoutes";
import deliveryFeaturesRoutes from "./routes/v1/deliveryFeaturesRoutes";
import errorMiddleware from "./middlewares/errorMiddleware";
import jobScheduler from "./jobScheduler";

import logger from "./utils/logger";
import transactionRoutes from "./routes/v1/transactionRoutes";
import orderRoutes from "./routes/v1/orderRoutes";
import uploadRoutes from "./routes/v1/uploadRoutes";
import orderLineRoutes from "./routes/v1/orderLineRoutes";
import globalRoutes from "./routes/v1/globalRoutes";
import categoryRoutes from "./routes/v1/categoryRoutes";
import chatRoutes from "./routes/v1/chatRoutes";
import contactFormRoutes from "./routes/v1/contactFormRoutes";



const app : Express = express();

const PORT = process.env.SERVER_PORT || 9876;

app.get("/", (req,res)=> res.send("Hello"));

DatabaseService.initialize();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

userRoutes(app);
vendorRoutes(app)
productRoutes(app)
adminRoutes(app)
deliveryFeaturesRoutes(app)
transactionRoutes(app)
orderRoutes(app)
orderLineRoutes(app)
uploadRoutes(app)
globalRoutes(app)
categoryRoutes(app)
chatRoutes(app)
contactFormRoutes(app)

app.use(errorMiddleware);

app.listen(PORT, () =>{
    logger.log(`Server ready at port ${PORT}`)
/*    logger.reporterClientInstance.success("Ready on port " + PORT)
        .then((response : any) => logger.log(response.data) )
        .catch((e: any)=>{logger.warn("Failed to report to intellivent reporting system.");logger.warn(e)})*/
});

jobScheduler.initiateJobs();

