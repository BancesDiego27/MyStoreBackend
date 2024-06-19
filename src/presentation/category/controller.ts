import e, { Request, Response } from "express"
import { CreateCategoryDto, CustomError, PaginationDTO } from "../../domain"
import { CategoryService } from "../services/category.service"


export class CategoryController{
    constructor(private readonly categoryServices: CategoryService) {}

    private handleError = (error: any,res:Response)=>{
        if(error instanceof CustomError){
            return res.status(error.statusCode).json({error:error.message})
        }
        console.log(`${error}`)
        return res.status(500).json({error: 'Internal server error'})
    }

   createCategory = (req:Request,res:Response)=>{
    const [error,createCategoryDTO] =CreateCategoryDto.create(req.body)
    const {user} = req.body
    if(error) return res.status(400).json({error})

    this.categoryServices.createCategory(createCategoryDTO!,user)
    .then(newCategory=>res.status(201).json(newCategory))
    .catch(error=> this.handleError(error,res))

   }

   getCategories = async(req:Request,res:Response)=>{
    const { page = 1, limit = 10} = req.query
    const [error,paginationDTO] = PaginationDTO.create(+page,+limit)

    if(error) return res.status(400).json({error})

    

    this.categoryServices.GetCategories(paginationDTO!)
    .then(categories => res.json(categories))
    .catch(error => this.handleError(error,res))
  
   }
}