import admin from 'firebase-admin';

const verifyToken = async (req, res, next) => {
  const idToken = req.headers.authorization.split(' ')[1];
  try {
    const auth = admin.auth();
    const decodedToken = await auth.verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(403).send('Unauthorized');
  }
};

export default verifyToken;