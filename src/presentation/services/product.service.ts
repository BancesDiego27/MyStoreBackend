
import { ProductModel } from "../../data";
import {CreateProductDTO, CustomError, PaginationDTO} from "../../domain";


export class ProductService{

    constructor(){}


    async createProducts(createProductDTO: CreateProductDTO){
        const productExists = await ProductModel.findOne({name:createProductDTO.name})
        
        if(productExists) throw CustomError.badRequest('Product Already Exists');

        try {
            const product = new ProductModel(createProductDTO)
            
            await product.save()

            return {
              product
            }
        } catch (error) {
            console.log(error)
            throw CustomError.internalServer('Internal server error22')
        }
    }

    async getProduct(paginationDTO:PaginationDTO){
        const {page,limit} = paginationDTO

        try {

            const [total,allProducts] = await Promise.all([
                ProductModel.countDocuments(),
                ProductModel.find()
                .skip((page-1)*limit)
                .limit(limit)
                .populate('user')
                .populate('category'),
            ])



            return {
                page,
                limit,
                total,
                next: `api/products?page=${page+1}&limit=${limit}`,
                prev: (page-1 >0 ) ?`api/products?page=${page-1}&limit=${limit}`:null,
                categories: allProducts
            }
            
        } catch (error) {
            throw CustomError.internalServer('Internal server error')
        }
    }


}