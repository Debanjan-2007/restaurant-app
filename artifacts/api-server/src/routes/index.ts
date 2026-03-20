import { Router, type IRouter } from "express";
import healthRouter from "./health";
import menuRouter from "./menu";
import ordersRouter from "./orders";
import reservationsRouter from "./reservations";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(menuRouter);
router.use(ordersRouter);
router.use(reservationsRouter);
router.use(adminRouter);

export default router;
