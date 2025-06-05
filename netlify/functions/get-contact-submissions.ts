import { Handler } from '@netlify/functions';
import * as admin from 'firebase-admin';

interface ServiceAccount {
  project_id: string;
  client_email: string;
  private_key: string;
  [key: string]: unknown; // For any additional properties that might exist
}

// Initialize Firebase Admin
if (!admin.apps.length) {
  const serviceAccount: ServiceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}');
  
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

export const handler: Handler = async (event) => {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  try {
    const submissionsRef = db.ref('contactSubmissions');
    const snapshot = await submissionsRef.once('value');
    const submissions = snapshot.val() || {};

    // Define the submission data type
    type SubmissionData = {
      firstName: string;
      lastName: string;
      email: string;
      message: string;
      createdAt: string;
      read?: boolean;
    };

    // Convert the object of submissions to an array with IDs
    const submissionsList = Object.entries<SubmissionData>(submissions).map(([id, data]) => ({
      id,
      ...data,
    }));

    // Sort by creation date, newest first
    submissionsList.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // For development
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      },
      body: JSON.stringify(submissionsList)
    };
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: 'Error fetching submissions',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};
