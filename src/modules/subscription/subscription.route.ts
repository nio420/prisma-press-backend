import { Router } from 'express';
import { auth } from '../../middleware/auth';
import { Role } from '../../../generated/prisma/enums';
import { subscriptionController } from './subscription.controller';


const router = Router();

router.post("/checkout", auth(Role.ADMIN, Role.USER, Role.AUTHOR), subscriptionController.createCheckoutSession);
router.post("/webhook", subscriptionController.webhookHandler);
router.get("/status", auth(Role.ADMIN, Role.USER, Role.AUTHOR), subscriptionController.getSubscriptionStatus);

export const subscriptionRouter = router;