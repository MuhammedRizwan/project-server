import cron from "node-cron";
import { OfferController } from "../../adapters/controllers/offer.controller";
import Depencies from "../dependancies/depencies";

const offerExecution=new OfferController(Depencies)

cron.schedule("1 0 * * *", async () => {
  console.log("Running cron job: Process Expired Offers");
  await offerExecution.execute();
});