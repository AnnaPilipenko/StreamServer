import express from 'express';

import ipcam from './ipcam';
import webcam from './webcam';
import general from './general';

const router = express.Router();

// index
router.get('/', (req, res) => {
	res.redirect('/');
});

// video devices
router.use('/ipcam', ipcam);
router.use('/webcam', webcam);

// general settings
router.use('/general', general);

export default router;
