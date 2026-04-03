import { User } from '@/payload/types';
import { CollectionAfterChangeHook } from 'payload';

export const welcome: CollectionAfterChangeHook<User> = async ({
  req,
  doc,
  previousDoc,
  operation,
}) => {
  if (operation !== 'update') return;

  console.log('doc', doc);
  console.log('previousDoc', previousDoc);

  // Check if the user just became verified
  if (doc._verified === true && previousDoc._verified === false) {
    await req.payload.sendEmail({
      to: doc.email,
      subject: 'Account Verified!',
      html: `<h1>Welcome ${doc.email}!</h1><p>Your account is now active.</p>`,
    });
  }
};
