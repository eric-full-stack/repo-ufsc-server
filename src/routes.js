const routes = require('express').Router()
const multer = require('multer')
const multerConfig = require('./config/multer')

const PostController = require('./controllers/PostController') 
const DisciplineController = require('./controllers/DisciplineController') 
const TeacherController = require('./controllers/TeacherController') 

routes.get('/posts', PostController.index)
routes.get('/post/:id', PostController.show)
routes.post('/posts', multer(multerConfig).array('files[]'), PostController.create)
routes.delete('/posts/:id', PostController.delete)
routes.get('/posts/:id/download', PostController.downloadFiles)
routes.post('/posts/:id/like', PostController.like)
routes.post('/posts/:id/unlike', PostController.unlike)

routes.get('/disciplines', DisciplineController.index)
routes.get('/discipline/:id', DisciplineController.show)
routes.post('/disciplines', DisciplineController.create)
routes.delete('/disciplines/:id', DisciplineController.delete)

routes.get('/teachers', TeacherController.index)
routes.get('/teacher/:id', TeacherController.show)
routes.post('/teachers', TeacherController.create)
routes.delete('/teachers/:id', TeacherController.delete)

module.exports = routes