import { Router } from 'express';
import { auth } from '../../middleware/auth';
import { Role } from '../../../generated/prisma/enums';
import { premiumController } from './premium.controller';
import { premiumGaurd } from '../../middleware/premiumGaurd';

const router = Router();

router.get("/", auth(Role.ADMIN, Role.USER, Role.AUTHOR), premiumGaurd(), premiumController.getPremiumContent);

export const premiumRouter = router;