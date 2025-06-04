import type { Handler } from '@netlify/functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!);
  
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key.replace(/\\n/g, '\n'),
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
}

const db = admin.database();

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  createdAt: string;
}

export const handler: Handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  try {
    // Parse form data
    const data: FormData = JSON.parse(event.body || '{}');
    const { firstName, lastName, email, message } = data;

    // Validate required fields
    if (!firstName || !lastName || !email || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          message: 'Missing required fields',
          required: ['firstName', 'lastName', 'email', 'message']
        }),
      };
    }

    // Create form submission object with timestamp
    const formSubmission = {
      firstName,
      lastName,
      email,
      message,
      createdAt: new Date().toISOString(),
      read: false
    };

    // Store in Firebase Realtime Database
    const submissionsRef = db.ref('contactSubmissions');
    const newSubmissionRef = await submissionsRef.push();
    await newSubmissionRef.set(formSubmission);

    // Return success response with the generated submission ID
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Form submitted successfully',
        submissionId: newSubmissionRef.key 
      }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: 'Error sending email',
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : undefined
      }),
    };
  }
};
