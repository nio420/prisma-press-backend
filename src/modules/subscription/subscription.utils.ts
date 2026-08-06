import Stripe from "stripe";
import { stripe } from "../../lib/stripe";
import { prisma } from "../../lib/prisma";
import { SubcriptionStatus } from "../../../generated/prisma/enums";

export const getPeriodEnd = (payload: Stripe.Subscription) => {
        const currentPeriodInMillSecond = payload.items.data[0]?.current_period_end!;
        const currenPeriod = new Date(currentPeriodInMillSecond * 1000);

        return currenPeriod;
}

export const handleCheckoutCompleted = async (session: Stripe.Checkout.Session)=> {
        const userId = session.metadata?.id;
        const stripeCustomerId = session.customer as string;
        const subscriptionId = session.subscription as string;    

        if(!userId || !stripeCustomerId || !subscriptionId) {
          throw new Error('Invalid session');
        }        
       
        const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId)
        const currentPeriodEnd = getPeriodEnd(stripeSubscription);
console.log(userId, "handle checkou User id");
        await prisma.subscription.upsert({
          where: {
            userId
          },
          create: {
            userId,
            stripeCustomerId,
            subscriptionId,
            status: "ACTIVE",
            currentPeriodEnd
          },
          update: {
            stripeCustomerId,
            subscriptionId,
            status: "ACTIVE",
            currentPeriodEnd
          }
        })        
}

export const handleChangeSubscription = async (payload: Stripe.Subscription) => {
      const stripeSubscriptionId = payload.id;
      const status = payload.status === "active" || payload.status === "trialing" ? SubcriptionStatus.ACTIVE : payload.status === "canceled" ? SubcriptionStatus.CANCELLED : SubcriptionStatus.EXPIRED;

        const currentPeriodEnd = getPeriodEnd(payload);

      const isSubscriptionId = await prisma.subscription.findUnique({
        where: {
         subscriptionId: stripeSubscriptionId,
        }
      })
      if(!isSubscriptionId) {
        console.log(`subxription id not found ${stripeSubscriptionId}`);
        return;
      }

      await prisma.subscription.update({
        where: {
         subscriptionId: stripeSubscriptionId,
        },
        data: {
            status,
            currentPeriodEnd
        }
      })
};