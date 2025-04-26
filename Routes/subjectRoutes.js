const express = require('express');
const router = express.Router();
const subjectController = require('../Controllers/subjectController');

router.post('/createSubject', subjectController.createSubject);
router.delete('/deleteSubject/:id', subjectController.deleteSubjectById);
router.get('/', subjectController.index);
router.get('/:id', subjectController.get)
router.post('/:id/p_section', subjectController.createPSection);
router.post('/:id/t_section', subjectController.createTSection);
router.delete('/deleteSubjectByName/:name', subjectController.deleteSubjectByName);
module.exports = router;
