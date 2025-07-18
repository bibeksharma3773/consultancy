// This is the updated Next.js API route for the App Router.
// It connects directly to MySQL.
import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function POST(req) {
  // Get the form data from the request body
  const data = await req.json();
  const { fieldOfStudy, destination, educationLevel } = data;

  // Validate the data
  if (!fieldOfStudy || !destination || !educationLevel) {
    return NextResponse.json(
      { status: 'error', message: 'Incomplete data provided.' },
      { status: 400 }
    );
  }

  let connection;
  try {
    // Database connection details for your XAMPP server
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',       // Default XAMPP username
      password: '',       // Default XAMPP password
      database: 'applyboard_db' // The database you created
    });

    // Prepare and execute the SQL statement to prevent SQL injection
    await connection.execute(
      'INSERT INTO inquiries (field_of_study, destination, education_level) VALUES (?, ?, ?)',
      [fieldOfStudy, destination, educationLevel]
    );

    // Close the database connection
    await connection.end();

    // Send a success response
    return NextResponse.json(
      { status: 'success', message: 'Your inquiry has been submitted successfully!' },
      { status: 200 }
    );

  } catch (error) {
    // Handle any errors that occurred during the database operation
    console.error('Database Error:', error);
    
    // Ensure the connection is closed in case of an error
    if (connection) {
      await connection.end();
    }

    return NextResponse.json(
      { status: 'error', message: error.message || 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
