export const errorHandler = (error: any) => {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    // Unique constraint violation
    throw new Error(error.message); // The message defined in the plugin
  }
  throw error; // Other errors
};
