import express from "express";
import { 
  listDocuments,
  uploadHandler
 } from "../controllers/document"
import { upload } from "../util/awsService";

const router = express.Router();

router.route("/all").get(listDocuments);
router.route("/upload").post(upload.single('image'), uploadHandler);

export default router;