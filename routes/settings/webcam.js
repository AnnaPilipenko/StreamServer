import express from 'express';
import { dbManager }  from 'db';
import devicesManager from 'devices';

const router = express.Router();
let PAGE_PATH = 'settings/webcam';
let devManager = new devicesManager();

const getVideoList = async () => {
	return await dbManager.getVideoDevices({ order: { type: 'DESC' }});
};

router.get('/', async (req, res) => {
	let list = await getVideoList();
	let mediaDevices = await devManager.getMediaDevices();
	res.view(PAGE_PATH, { result: list.result, webcams: mediaDevices.video });
});

// create new video device
router.post('/', async (req, res) => {
	let form = req.body;
	console.log('FULLNAME', form.fullname);
	let fullname = form.fullname.split('    '),
		name = fullname[0].trim(),
		path = fullname[1].trim().replace('(', '').replace(')','');

	console.log('name', name);
	console.log('path', path);

	let out = await dbManager.createVideoDevice(name, path, 'webcam');
	let list = await getVideoList();
	let mediaDevices = await devManager.getMediaDevices();

	console.log('list', list);

	if (out.status == 0) {
		res.view(PAGE_PATH, { status: 0, result: list.result, success: 'Успешно добавлено', webcams: mediaDevices.video  });
	}
	else {
		res.view(PAGE_PATH, { status: 1, error: 'Что-то пошло не так...', result: list.result, webcams: mediaDevices.video   });
	}
});

// remove audio device
router.get('/remove/:id', async (req, res) => {
	let out = await dbManager.removeVideoDevice(req.params.id);
	let list = await getVideoList();
	let mediaDevices = await devManager.getMediaDevices();
	if (out.status == 0) {
		res.view('/' + PAGE_PATH, { status: 0, result: list.result, success: 'Успешно удалено', webcams: mediaDevices.video });
	}
	else {
		res.view('/' + PAGE_PATH, { status: 1, error: 'Что-то пошло не так...', result: list.result,webcams: mediaDevices.video});
	}
});
export default router;