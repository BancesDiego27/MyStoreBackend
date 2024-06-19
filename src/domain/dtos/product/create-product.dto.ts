import { validators } from "../../../config"

export class CreateProductDTO{

    private constructor(
        public  readonly name: string,
        public  readonly available: boolean,
        public  readonly price: number,
        public  readonly description: string,
        public readonly user: string, // User ID
        public  readonly category: string, // Category ID

    ){}

    static create(object:{[key:string]:any}):[string?,CreateProductDTO?]{
        const {
            name,
            available,
            price,
            description,
            user,
            category
        } = object

        if(!name) return ['Missing name']
        if(!user) return ['Missing user']
        if(!category) return ['Missing category']
        if(!validators.isMongoID(user)) return ['Invalid User ID']
        if(!validators.isMongoID(category)) return ['Invalid Category ID']


        return [undefined,new CreateProductDTO(name,!!available,price,description,user,category)]
    }
}