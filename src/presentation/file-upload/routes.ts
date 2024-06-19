import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth.middlewares';
import { FileUploadController } from './controller';
import { FileUploadService } from '../services/file-upload.service';
import { FileUpMiddleware } from '../middlewares/file-upload.middleware';
import { TypeMiddleware } from '../middlewares/type.middleware';





export class FileUploadRoutes {


  static get routes(): Router {

    const router = Router();
    const service = new FileUploadService()
    const controller = new FileUploadController(service)    
    // Definir las rutas

    router.use(FileUpMiddleware.containFiles)
    router.use(TypeMiddleware.validType(['users','products','categories']))

    router.post('/single/:type', [ AuthMiddleware.validateJWT], controller.uploadFile);
    router.post('/multiple/:type',[ AuthMiddleware.validateJWT] , controller.uploadMultipleFiles);


    return router;
  }


}

