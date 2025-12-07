const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");
const stripeLib = require("stripe");

// Define secrets (set via `firebase functions:secrets:set STRIPE_SECRET`)
const stripeSecret = defineSecret("STRIPE_SECRET");
const stripeWebhookSecret = defineSecret("STRIPE_WEBHOOK_SECRET");

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

// 🔹 Callable function from frontend to start Stripe Checkout
exports.createCheckoutSession = onCall(
  { secrets: [stripeSecret] },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "You must be logged in");
    }

    const priceId = request.data.priceId;
    if (!priceId) {
      throw new HttpsError("invalid-argument", "Missing priceId");
    }

    const uid = request.auth.uid;
    const email = request.auth.token.email;

    // Initialize Stripe with the secret
    const stripe = stripeLib(stripeSecret.value());

    try {
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        customer_email: email,
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: "https://YOUR-PROTOCOL-DOMAIN.com/app?checkout=success",
        cancel_url: "https://YOUR-PROTOCOL-DOMAIN.com/app?checkout=cancel",
        metadata: { uid },
      });

      return { url: session.url };
    } catch (err) {
      console.error("Error creating checkout session:", err);
      throw new HttpsError("internal", "Unable to create checkout session");
    }
  }
);

// 🔹 Stripe webhook – updates user.plan based on subscription status
exports.stripeWebhook = onRequest(
  { secrets: [stripeSecret, stripeWebhookSecret] },
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    // Initialize Stripe with the secret
    const stripe = stripeLib(stripeSecret.value());

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.rawBody, sig, stripeWebhookSecret.value());
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    const data = event.data.object;

    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const uid = data.metadata && data.metadata.uid;
          if (uid) {
            await db.collection("users").doc(uid).set(
              {
                plan: "pro",
                stripeCustomerId: data.customer,
                stripeSubscriptionId: data.subscription,
              },
              { merge: true }
            );
          }
          break;
        }

        case "customer.subscription.deleted":
        case "customer.subscription.canceled": {
          const subscriptionId = data.id;
          const snap = await db
            .collection("users")
            .where("stripeSubscriptionId", "==", subscriptionId)
            .limit(1)
            .get();

          if (!snap.empty) {
            const docRef = snap.docs[0].ref;
            await docRef.set({ plan: "free" }, { merge: true });
          }
          break;
        }

        default:
          // ignore other events for now
          break;
      }

      return res.json({ received: true });
    } catch (err) {
      console.error("Error handling webhook:", err);
      return res.status(500).send("Webhook handler failed");
    }
  }
);
