import * as express from 'express';
import {onlyAuthorized} from '../middleware/auth';
import {viewsDirectory} from '../../consts';
const router = express.Router()



router.get('/tasks', ((req, res, next) => {
    return res.sendFile('tasks.html', {root: viewsDirectory});
}));

export default router;
