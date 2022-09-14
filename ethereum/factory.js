import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";
// import * as dotenv from "dotenv";
// dotenv.config();

const address = process.env.NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDRESS; // "0x62f9E1DC227BeAc3F03d02F700d4aF7d9916eeD1"
const instance = new web3.eth.Contract(CampaignFactory.abi, address);

export default instance;
