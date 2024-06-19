import { CategoryModel } from "../../data";
import { CreateCategoryDto, CustomError, PaginationDTO, UserEntity } from "../../domain";


export class CategoryService{

    constructor(){}


    async createCategory(createCategoryDTO: CreateCategoryDto, user : UserEntity){
        const categoryExists = await CategoryModel.findOne({name:createCategoryDTO.name})

        if(categoryExists) throw CustomError.badRequest('Category Already Exists');

        try {
            const category = new CategoryModel({
                ...createCategoryDTO,
                user:user.id
            })
            
            await category.save()

            return {
                category
            }
        } catch (error) {
            throw CustomError.internalServer('Internal server error')
        }
    }

    async GetCategories(paginationDTO:PaginationDTO){
        const {page,limit} = paginationDTO

        try {

            const [total,allCategories] = await Promise.all([
                CategoryModel.countDocuments(),
                CategoryModel.find()
                .skip((page-1)*limit)
                .limit(limit),
            ])



            return {
                page,
                limit,
                total,
                next: `api/categories?page=${page+1}&limit=${limit}`,
                prev: (page-1 >0 ) ?`api/categories?page=${page-1}&limit=${limit}`:null,
                categories: allCategories.map( category => ({
                id:category.id,
                name: category.name,
                available: category.available,
                user: category.user,
            }))}
            
        } catch (error) {
            throw CustomError.internalServer('Internal server error')
        }
    }


}