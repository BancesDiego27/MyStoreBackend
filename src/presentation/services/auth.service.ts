import { JwtAdapter, bcryptAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomError, RegisterUserDTO, UserEntity,LoginUserDTO } from "../../domain";


export class AuthService{
    constructor(){}

    public async registerUser(registerDTO:RegisterUserDTO){
        const existUser = await UserModel.findOne({email: registerDTO.email})
        if(existUser) throw CustomError.badRequest('Email already exist')
        try {
            const newUser = new UserModel(registerDTO);
            newUser.password = bcryptAdapter.hash(registerDTO.password)

            await newUser.save()

    
            const {password, ...userEntity } = UserEntity.fromObject(newUser)
            return {
                user: userEntity,
                token:'JWT',
            }

        } catch (error) {
            throw CustomError.internalServer(`${error}`)
        }

    }

    public async loginUser(loginUserDTO:LoginUserDTO){
        const existUser = await UserModel.findOne({email: loginUserDTO.email})
        if(!existUser) throw CustomError.badRequest('Email not exist')
       
        const isMatching = bcryptAdapter.compare(loginUserDTO.password,existUser.password)
        if(!isMatching) throw CustomError.badRequest('Password is not valid')

        const {password, ...userEntity} = UserEntity.fromObject(existUser)

        const token = await JwtAdapter.generateToken({id: existUser.id})
        if(!token) throw CustomError.internalServer('Error while creating JWT')


        return {
            user:{
               userEntity,
            },
            token
        }

    }
}