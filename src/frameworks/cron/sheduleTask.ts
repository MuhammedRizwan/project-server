import cron from "node-cron";
import { OfferController } from "../../adapters/controllers/offer.controller";
import OfferDepencies from "../dependancies/offerdependencies";

const offerExecution=new OfferController(OfferDepencies)

cron.schedule("1 0 * * *", async () => {
  console.log("Running cron job: Process Expired Offers");
  await offerExecution.execute();
});