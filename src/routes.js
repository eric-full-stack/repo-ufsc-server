const routes = require('express').Router()
const multer = require('multer')
const multerConfig = require('./config/multer')
const authAdminMiddleware = require('./middlewares/auth')
const authUserMiddleware = require('./middlewares/authUser')

const PostController = require('./controllers/PostController') 
const DisciplineController = require('./controllers/DisciplineController') 
const TeacherController = require('./controllers/TeacherController') 
const ClassController = require('./controllers/ClassController') 
const SemesterController = require('./controllers/SemesterController') 
const UserController = require('./controllers/UserController') 

//DISCIPLINES
routes.get('/disciplines', DisciplineController.index)
routes.get('/disciplines/semester/:id', DisciplineController.getBySemester)

//SEMESTERS
routes.get('/semesters', SemesterController.index)

//CLASSES
routes.get('/classes', ClassController.index)

//TEACHERS
routes.get('/teachers', TeacherController.index)

//USER AUTH
routes.post('/register', UserController.register)
routes.post('/authenticate', UserController.authenticate)

//POSTS
routes.get('/posts/getByDiscipline/:id', PostController.getByDiscipline)
routes.get('/posts', PostController.index)
routes.get('/posts/:id/download', PostController.downloadFiles)

routes.use(authUserMiddleware)
routes.post('/posts', multer(multerConfig).array('files[]'), PostController.create)
routes.post('/posts/:id/like', PostController.like)
routes.post('/posts/:id/unlike', PostController.unlike)
routes.get('/posts/byUser', PostController.byUser)
routes.delete('/posts/:id', PostController.delete)


//AUTH ADMIN MIDDLEWARE
routes.use(authAdminMiddleware)
routes.post('/disciplines', DisciplineController.create)
routes.delete('/disciplines/:id', DisciplineController.delete)
routes.patch('/discipline/:id', DisciplineController.update)
routes.post('/semesters', SemesterController.create)
routes.delete('/semesters/:id', SemesterController.delete)
routes.post('/classes', multer(multerConfig).single('image'), ClassController.create)
routes.delete('/classes/:id', ClassController.delete)
routes.post('/teachers', TeacherController.create)
routes.delete('/teachers/:id', TeacherController.delete)

module.exports = routes