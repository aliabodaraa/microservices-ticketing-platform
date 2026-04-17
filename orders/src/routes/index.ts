import express, { Request, Response } from "express";
import { requireAuth } from "@aaticketsaa/common";
import { Order } from "../models/order";

const router = express.Router();

router.get("/api/orders", requireAuth, async (req: Request, res: Response) => {
  console.log("before orders");
  const orders = await Order.find({
    userId: req.currentUser!.id,
  }).populate("ticket");
  console.log("after orders", orders);
  res.send(orders);
});

export { router as indexOrderRouter };
